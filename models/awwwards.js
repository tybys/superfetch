const bot = require('../bot');
const https = require('https');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

class Awwwards {
  constructor() {
    this.getSiteUrl()
  }

  getSiteUrl() {
    https.get('https://www.awwwards.com', (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        let newDom = new dom().parseFromString(data);
        let nodes = xpath.select("//a[contains(@class, 'site-link')]/@href", newDom);
        // debugger
        this.constructor.getSiteOfTheDay(nodes[0].nodeValue);
        //let imageNoes = xpath.select("//a[contains(@class, 'dribbble-link')]//img", newDom);
      }).on("error", (err) => {

        console.log("Error: " + err.message);
      });
    })
  }

  static getSiteOfTheDay(url) {
    https.get(`https://www.awwwards.com${url}`, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        let newDom = new dom().parseFromString(data);
        let imagepath = xpath.select("//div[contains(@id, 'screenshots')]//img", newDom);
        let nodes2 = xpath.select("//div[contains(@class, 'box-page-related')]//video//source", newDom);

        this.parseMedia(imagepath, nodes2);
      }).on("error", (err) => {

        console.log("Error: " + err.message);
      });
    })
  }

  static parseMedia(images, video) {
    let shuffleArr = [];

    for (var i of images) {
      shuffleArr.push({
        type: "photo",
        media: i.attributes[3].nodeValue,
        caption: '',
        parse_mode: 'HTML'
      });
    }

    for (var j of video) {
      shuffleArr.push({
        type: "video",
        media: j.attributes[0].value,
        caption: '',
        parse_mode: 'HTML'
      });
    }
    // images[0].attributes[3].nodeValue
    // video[0].attributes[0].nodeValue
    //return shuffleArr;

    this.printMessages(shuffleArr);
  }

  static printMessages(mediaObject) {
    bot.sendMessage(process.env.COMMUNITYID, 'Awwwards Site of the day!')

    bot.sendMediaGroup(process.env.COMMUNITYID, [
      {
        type: 'photo',
        media: 'https://assets.awwwards.com/awards/sites_of_the_day/2018/11/kopke-since-1638-1.jpg'
      },
      {
        type: 'photo',
        media: 'https://assets.awwwards.com/awards/sites_of_the_day/2018/11/kopke-since-1638-1.jpg'
      },
      {
        type: 'video',
        media: 'https://assets.awwwards.com/awards/external/2018/11/5bfc29cadffb7.mp4'
      },
      {
        type: 'video',
        media: 'https://assets.awwwards.com/awards/external/2018/11/5bfc29cadffb7.mp4'
      }
    ]);
  }
}

module.exports = Awwwards;