var express = require('express');
var router = express.Router();
const https = require('https');
let request = require('request');
const axios = require('axios');

router.get('/', function(req, res, next) {
  res.redirect('https://dribbble.com/oauth/authorize?client_id=7e36e9fb0efee9af8931982e630a1212f2c00077ac73ee4f4205247e2220800d&redirect_uri=http://localhost:3000/auth/dribbblecallback&scope=public+upload');
});

router.get('/dribbblecallback', (req, res) => {
  const code = req.query.code;
  let data = JSON.stringify({
    client_id: '7e36e9fb0efee9af8931982e630a1212f2c00077ac73ee4f4205247e2220800d',
    client_secret: 'e6828b3f72d52f5ed75df0d1e4579240547c02fb95302142ae1b2dcf8340ecc5',
    code: code,
    redirect_uri: 'http://localhost:3000/auth/dribbblecallback'
  });
  const options = {
    hostname: 'dribbble.com',
    port: 443,
    path: '/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  // debugger
  const _req = https.request(options, (res) => {

    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', (d) => {
      process.stdout.write(d)
    })
  });
// https://api.dribbble.com/v2/user?access_token=cfa3b5cd3e81c77795c9203cac7eee78b3686e66472edaaad9c7f36e6b6bc652
  _req.on('error', (error) => {
    console.error(error)
  });

  _req.write(data);
  _req.end();
  res.end();

  /*axios.post('https://dribbble.com/oauth/token?', {
    client_id: '7e36e9fb0efee9af8931982e630a1212f2c00077ac73ee4f4205247e2220800d',
    client_secret: 'e6828b3f72d52f5ed75df0d1e4579240547c02fb95302142ae1b2dcf8340ecc5',
    code: code,
    redirect_uri: 'http://localhost:3000/'
  })
    .then((res) => {
      console.log(`statusCode: ${res.statusCode}`)
      console.log(res)
    })
    .catch((error) => {
      console.error(error)
    })*/

  /*request.post('https://dribbble.com/oauth/token', {
    json: {
      client_id: '7e36e9fb0efee9af8931982e630a1212f2c00077ac73ee4f4205247e2220800d',
      client_secret: 'e6828b3f72d52f5ed75df0d1e4579240547c02fb95302142ae1b2dcf8340ecc5',
      code: code,
      redirect_uri: 'http://localhost:3000/auth/dribbblecallback'
    }
  }, (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }
    console.log(`statusCode: ${res.statusCode}`)
    console.log(body)
  })*/
});



function postToken() {

}

module.exports = router;
// https://api.dribbble.com/v2/user?access_token=f3a2ceee6daffbfe76cbfd55d10ae74f8c37536c4b43c151097b0a17f36c1043
// https://dribbble.com/oauth/token?client_id=7e36e9fb0efee9af8931982e630a1212f2c00077ac73ee4f4205247e2220800d&client_secret=e6828b3f72d52f5ed75df0d1e4579240547c02fb95302142ae1b2dcf8340ecc5&code=f3a2ceee6daffbfe76cbfd55d10ae74f8c37536c4b43c151097b0a17f36c1043&redirect_uri=http://localhost:3000/

// shots
// https://dribbble.com/shots?page=3&per_page=24

// debuts
// https://dribbble.com/shots?list=debuts&page=2&per_page=24

// playofs
// https://dribbble.com/shots?list=playoffs&page=2&per_page=5