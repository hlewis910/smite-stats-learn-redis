/* eslint-disable handle-callback-err */
const router = require('express').Router();
const { GodPlayerStats, God, GodInfo } = require('../../db');
const godStats = require('../util/godStats');
const defaultStats = Object.keys(require('../util/defaultPlayerGodStats'));


router.get('/', async (req, res, next) => {
    try {
        req.redisMemory.get('hariet', async function(err, reply){
            if (reply) {
                req.redisMemory.expire('hariet', 100)
                res.send(reply)
            } else {
                let gods = await God.findAll().map(god => god.name);
                req.redisMemory.set('hariet', JSON.stringify(gods))
                res.send(gods);
            }
            })
    } catch (err){
        next(err);
    }
})



// client.set("string key", "string val", redis.print);
// client.hset("hash key", "hashtest 1", "some value", redis.print);

router.get('/:godName', async (req, res, next) => {
    try {
        req.redisMemory('david', async function(err, reply) {
            if (reply) {
                 req.redisMemory.expire('david', 100)
                res.json(reply)
            } else {
                let godInfo = await God.findOne({
                    where: {
                        name: req.params.godName
                    },
                    include: [{
                        model: GodInfo,
                        required: true
                    }]
                }, {});
                req.redisMemory.set('david', JSON.stringify(godInfo))
                res.send(godInfo);
            }
        })
    } catch (err){
        next(err);
    }
})

router.get('/:godName/stats', async (req, res, next) => {
    try {
        let godInfo = await God.findOne({where: {name: req.params.godName}});
        let stats = await godStats.getStats(req.params.godName, defaultStats, req.query);
        godInfo.dataValues.stats = stats;
        res.send(godInfo);
    } catch(err){
        next(err);
    }
})

router.get('/:godName/stats/KDA', async (req, res, next) => {
    try {
        let godKDAs = await godStats.getKDA(req.params.godName, req.query);
        res.send(godKDAs);
    } catch(err){
        next(err);
    }
})

router.get('/:godName/stats/games', async (req, res, next) => {
    try {
        let gamesPlayed = await godStats.getGames(req.params.godName, req.query);
        res.send(gamesPlayed);
    } catch(err){
        next(err);
    }
})

router.get('/:godName/stats/:statName', async (req, res, next) => {
    try {
        let stat = await godStats.getStats(req.params.godName, [req.params.statName], req.query);
        res.send(stat);
    } catch (err){
        next(err);
    }
})

module.exports = router;
