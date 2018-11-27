const bot = require('../bot');
const https = require('https');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

let datas = [];
class Dribbble {
  constructor() {
    this.getRecent();
  }

  getRecent() {
    https.get('https://dribbble.com/shots?page=1&per_page=24', (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        this.constructor.parseData(data).then((data) => {
          this.constructor.sortMessages(datas).then((data) => {
            this.constructor.printMessages(data);
          });
        });
      });

    }).on("error", (err) => {

      console.log("Error: " + err.message);
    });
  }
  static async parseData(raw) {
    const sourceHtml = raw;
    let newDom = new dom().parseFromString(raw);
    let nodes = xpath.select("//script", newDom);
    let imageNoes = xpath.select("//a[contains(@class, 'dribbble-link')]//img", newDom);
    let photosArr = new Object();

    imageNoes.map(function (item, index, imageNoes) {
      photosArr[item.attributes[1].nodeValue.split('/')[6]] = item.attributes[1].nodeValue;
    });

    await nodes.filter((item, i, nodes) => {
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

          i.image = images[i.id]

          if (!datas.find(x => x.id === i.id)) {
            datas.push(i);
          }
        }
      }
    });
  }
  static async sortMessages(unsortArr) {
    function compareNumeric(a, b) {
      if (a.likes_count > b.likes_count) return -1;
      if (a.likes_count < b.likes_count) return 1;
    }

    await unsortArr.sort(compareNumeric);

    return unsortArr;
  }
  static printMessages(shotsArray) {
    bot.sendMessage(process.env.COMMUNITYID, 'Hello from Dribbble!');

    for (let i = 0; i < 5; i ++) {
      bot.sendMediaGroup(process.env.COMMUNITYID, [{
        type: "photo",
        media: shotsArray[i].image,
        caption: `<a href="https://dribbble.com${shotsArray[i].path}">${shotsArray[i].title}</a>`,
        parse_mode: 'HTML'
      }
      ])
    }
  }
}

module.exports = Dribbble;