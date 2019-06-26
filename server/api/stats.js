/* eslint-disable handle-callback-err */
const router = require('express').Router();
const { GodPlayerStats, God, GodInfo } = require('../../db');
const godStats = require('../util/godStats');
const defaultStats = Object.keys(require('../util/defaultPlayerGodStats'));
// const redis = require("redis");
// const client = redis.createClient();


router.get('/', async(req, res, next) => {
    try {
        res.send(defaultStats.slice(0, -3));
    } catch (err){
        next(err);
    }
})

// client.on("error", function (err) {
//     console.log("Error " + err);
// });

// client.set("string key", "string val", redis.print);
// client.hset("hash key", "hashtest 1", "some value", redis.print);



router.get('/all', async(req, res, next) => {
    try {
        // eslint-disable-next-line handle-callback-err
        req.redisMemory.get('hariet', async function(err, reply) {
            if (reply) {
                res.json(reply)
            } else {
                let stats = await godStats.getStats(null, defaultStats, req.query);
                let maxStats = defaultStats.reduce((obj, stat) => {
                    let max = Math.max(...stats.map(god => god[stat] || 0));
                    obj[stat] = max;
                    return obj;
                }, {})
               req.redisMemory.set('hariet', JSON.stringify(maxStats))
               req.redisMemory.hkeys('hariet', function(replies) {
                   console.log(replies.length + "HELLLLOOZZ")
               })
        res.send(maxStats);
            }
        })
    } catch (err){
        next(err);
    }
})

router.get('/:statName', async(req, res, next) => {
    try {
        req.redisMemory.get('machu', async function(err, reply) {
            let stats;
           if(reply) {
               res.send(reply)
        }
          else if (req.params.statName.toUpperCase() === 'KDA') {
        let stats = await godStats.getKDA(null, req.query);
        req.redisMemory.set('kda', JSON.stringify(stats))
         }
         else if (req.params.statName.toUpperCase() === 'GAMES') {
        let stats = await godStats.getGames(null, req.query);
        req.redisMemory.set('games', JSON.stringify(stats))
        } else {
            let stats = await godStats.getStats(null, [req.params.statName], req.query);
            req.redisMemory.set('other', JSON.stringify(stats))
             res.send(stats);
        }
        // res.send(stats)
    })
}
catch(err) {
        next(err);
    }

})


module.exports = router;
