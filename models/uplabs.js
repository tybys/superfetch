const https = require('https');
const bot = require('../bot');
const fs = require('fs');
const stream = fs.createWriteStream(`${__dirname}/uplabs.txt`, {flags:'a'});
const proxy = require('../proxy');

class Uplabs {
  constructor() {
    this.receiveJson()
  }

  receiveJson() {
    https.get(proxy.endpoint('https://www.uplabs.com/all.json?days_ago=0&page=1'), (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        this.sort(data);
      });

    }).on("error", (err) => {

      console.log("Error: " + err.message);
    });
  }

  sort(array) {
    function compareNumeric(a, b) {
      if (a.points > b.points) return -1;
      if (a.points < b.points) return 1;
    }

    array = JSON.parse(array);
    array.sort(compareNumeric);
    array = array.splice(0, 5);

    this.checkForUniq(array);
  }

  checkForUniq(array) {
    let _this = this;
    let uniqArray = [];
    let fileContents = fs.readFileSync(`${__dirname}/uplabs.txt`);

    for (let i of array) {
      if (fileContents.toString().indexOf(i.id) < 0) {
        i.id += ',';
        uniqArray.push(i);
        stream.write(i.id);
      }
    }

    stream.end();
    _this.constructor.messages(uniqArray);
  }

  static messages(array) {
    bot.sendMessage(process.env.COMMUNITYID, 'uplabs popular');
    for (var i of array) {
      bot.sendMediaGroup(process.env.COMMUNITYID, [{
        type: "photo",
        media: i.animated_teaser_url,
        caption: `<a href="${i.link_url}">${i.name}</a>`,
        parse_mode: 'HTML'
      }]);
    }
  }
}

module.exports = Uplabs;