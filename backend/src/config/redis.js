const {createClient} = require('redis');


const redisclient = createClient({
    url: 'redis://localhost:6379'
});

redisclient.on('error', (err) => console.log('Redis Client Error:', err.message));

module.exports = redisclient;



