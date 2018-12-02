const bot = require('../bot');
const https = require('https');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const proxy = require('../proxy');

class Awwwards {
  constructor() {
    this.getSiteUrl()
  }

  static junk() {
    let today = new Date();
    let month = today.getMonth();
    let day = today.getDate();
    let year = today.getFullYear();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    return `<b>Site of the Day</b> ${monthNames[month]} ${day} ${year}`
  }

  getSiteUrl() {
    https.get(proxy.endpoint('https://www.awwwards.com'), (resp) => {
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

        //let date = this.constructor.junk();
        let title = xpath.select("//h1[contains(@class, 'heading-large')]/a", newDom);
        let imagepath = xpath.select("//div[contains(@id, 'screenshots')]//img", newDom);
        let videopath = xpath.select("//div[contains(@class, 'box-page-related')]//video//source", newDom);

        this.parseMedia(imagepath, videopath, title);
      }).on("error", (err) => {

        console.log("Error: " + err.message);
      });
    })
  }

  static parseMedia(images, video, title) {
    let shuffleArr = [];
// debugger
    for (var i of images) {
      shuffleArr.push({
        type: "photo",
        media: i.attributes[3].nodeValue,
        caption: '',
        parse_mode: 'HTML'
      });
    }

    /*for (var j of video) {
      shuffleArr.push({
        type: "video",
        media: j.attributes[0].value,
        caption: '',
        parse_mode: 'HTML'
      });
    }*/
    // images[0].attributes[3].nodeValue
    // video[0].attributes[0].nodeValue
    //return shuffleArr;

    let _date = new Date();
    let month = _date.getMonth();
    let day = _date.getDate();
    let year = _date.getFullYear();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const today = ` <b>awwwwards.</b> <b>Site of the Day</b> \n${monthNames[month]} ${day} ${year}`;

    this.printMessages(shuffleArr, title, today);
  }

  static printMessages(mediaObject, title, today) {
    bot.sendMessage(process.env.COMMUNITYID, `${today} ${title}`, {parse_mode: 'HTML'})
    bot.sendMediaGroup(process.env.COMMUNITYID, mediaObject);
    /*bot.sendMediaGroup(process.env.COMMUNITYID, [
      {
        type: 'video',
        media: 'https://assets.awwwards.com/awards/external/2018/11/5bfc29cadffb7.mp4'
      },
      {
        type: 'video',
        media: 'https://assets.awwwards.com/awards/external/2018/11/5bfc29cadffb7.mp4'
      },
      {
        type: 'video',
        media: 'https://assets.awwwards.com/awards/external/2018/11/5bfc29cadffb7.mp4'
      }
    ]);*/
  }
}

module.exports = Awwwards;