var express = require('express');
var router = express.Router();
const https = require('https');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const bot = require('../bot/index');

/* GET users listing. */
router.get('/', function(req, res, next) {

});

router.get('/dribbblecallback', (req, res) => {

});

let datas = [];

router.get('/recent', (req, res) => {
  setInterval(() => {
    bot.sendMessage(107608959,'/echo yo');
    //getRecent();
    //console.log(datas)
  }, 30000);

  res.send('ok');
});

const getRecent = () => {
  https.get('https://dribbble.com/shots?sort=recent&page=1&per_page=24', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      //console.log(JSON.parse(data).explanation);
      //console.log(data)

      parseHtml(data);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
};

/**
 *
 * @param raw {HTMLAllCollection} full page source
 */
const parseHtml = (raw) => {
  const sourceHtml = raw;
  let newDom = new dom().parseFromString(raw);
  let nodes = xpath.select("//script", newDom);

  nodes.filter(function(item, i, nodes) {
    if (item.textContent.indexOf('newestShots') > 0) {
      let scripttag2 = item.childNodes[0].data;

      scripttag2 = scripttag2.replace(/\n/g, '');
      scripttag2 = scripttag2.replace(/var newestShots = /i, '');
      scripttag2 = scripttag2.replace(/;if\s\(typeof.+/i, '');

      let arr = eval(scripttag2);

      for (let i of arr) {
        delete i.comments_count;
        delete i.liked_by_html;
        delete i.liked;
        delete i.ga;
        delete i.is_rebound;
        delete i.rebounds_count;
        delete i.attachments_count;
        delete i.view_count;

        existing(i);
      }
    }
  });
};

/**
 *
 * @param item {Object} dribbble shot object [id, path, likes, …]
 */
function existing(item) {
  if (!datas.find(x => x.id === item.id))
    datas.push(item);
}

module.exports = router;

