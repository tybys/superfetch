const bot = require('../bot');
const https = require('https');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const fs = require('fs');
const stream = fs.createWriteStream(`${__dirname}/dribbble.txt`, {flags:'a'});
const proxy = require('../proxy');

class Dribbble {
  constructor() {
    this.getRecent();
  }

  getRecent() {
    https.get(proxy.endpoint('https://dribbble.com/shots?sort=recent&page=0&per_page=24'), (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        this.parseRawHtml(data);
      });

      resp.pipe(process.stdout);

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  }

  parseRawHtml(raw) {
    const sourceHtml = raw;
    let newDom = new dom().parseFromString(raw);
    let nodes = xpath.select("//script", newDom);
    let imageNoes = xpath.select("//a[contains(@class, 'dribbble-link')]//source", newDom);
    let photosArr = new Object();
    let datas = [];

    imageNoes.map(function (item, index, imageNoes) {
      photosArr[item.attributes[0].nodeValue.split('/')[6]] = item.attributes[0].nodeValue;
    });

    nodes.filter((item, i, nodes) => {
      let images = photosArr;

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

          i.image = images[i.id].replace(/_teaser/i, '');

          if (!datas.find(x => x.id === i.id)) {
            datas.push(i);
          }
        }
      }
    });

    this.sortMessages(datas);
  }

  sortMessages(unsortArr) {
    function compareNumeric(a, b) {
      if (a.likes_count > b.likes_count) return -1;
      if (a.likes_count < b.likes_count) return 1;
    }

    unsortArr.sort(compareNumeric);
    unsortArr = unsortArr.splice(0, 5);

    this.checkForUniq(unsortArr);
  }

  checkForUniq(array) {
    let _this = this;
    let uniqArray = [];

    let fileContents = fs.readFileSync(`${__dirname}/dribbble.txt`);

    for (let i of array) {
      if (fileContents.toString().indexOf(i.id) < 0) {
        i.id += ',';
        uniqArray.push(i);
        stream.write(i.id);
      }
    }

    this.printMessages(uniqArray);
  }

  printMessages(shotsArray) {
    if (!shotsArray.length) return;

    for (var i of shotsArray) {
      bot.sendMediaGroup(process.env.COMMUNITYID, [{
        type: "photo",
        media: i.image,
        caption: `<b>Dribbble Recent Shots</b>\n<a href="https://dribbble.com${i.path}">${i.title}</a>`,
        parse_mode: 'HTML'
      }
      ])
    }
  }
}

module.exports = Dribbble;