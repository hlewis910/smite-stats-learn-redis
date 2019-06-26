const express = require('express');
const app = express();
const { db } = require('./db');

const path = require('path');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const redis = require('redis');
const client = redis.createClient();

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

// client.on('error', function (err) {
//     console.log('Error ' + err);
// });

client.on('connect', function() {
  console.log('connected')
})

// client.set('string key', 'string val', redis.print);
// client.hset('hash key', 'hashtest 1', 'some value', redis.print);
// client.hset(['hash key', 'hashtest 2', 'some other value'], redis.print);
// client.hkeys('hash key', function (err, replies) {
//     console.log(replies.length + ' replies:');
//     replies.forEach(function (reply, i) {
//         console.log('    ' + i + ': ' + reply);
//     });
//     // client.quit();
// });

// const {promisify} = require('util');
// const getAsync = promisify(client.get).bind(client);


// return getAsync('foo').then(function(res) {
//   console.log(res); // => 'bar'
// });

// const myFunc = async() => {
//   const res = await getAsync('foo');
//   console.log(res);
// }

app.use(function (req, res, next) {
  req.redisMemory = client;
  next()
})


app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use(volleyball);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')))

app.use('/api', require('./server/api'));

app.get('*', function (req, res, next) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

db.sync({})
.then(() => app.listen(process.env.PORT || 5000));
