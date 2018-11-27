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
        let nodes = xpath.select("//div[contains(@id, 'screenshots')]", newDom);
        let nodes2 = xpath.select("//div[contains(@class, 'box-page-related')]", newDom);

        debugger
      }).on("error", (err) => {

        console.log("Error: " + err.message);
      });
    })
  }
}

module.exports = Awwwards;