const bot = require('../bot');
const https = require('https');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const proxy = require('../proxy');
const fs = require('fs');
const path = require('path');
const download = require('download-file');

//const stream = (fn) => fs.createWriteStream(path.resolve('./downloads', fn), {flags:'a+', encoding: 'utf8'})

class Awwwards {
  constructor() {
    this.getSiteUrl();
    this.siteUrl = '';
    this.paths = null;
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
    https.get(proxy.endpoint('https://www.awwwards.com/'), (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        let newDom = new dom().parseFromString(data);
        let nodes = xpath.select("//a[contains(@class, 'site-link')]/@href", newDom);

        this.getSiteOfTheDay(nodes[0].nodeValue);
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    })
  }

  getSiteOfTheDay(url) {
    this.constructor.siteUrl = `https://www.awwwards.com${url}`;

    https.get(`https://www.awwwards.com${url}`, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        let newDom = new dom().parseFromString(data);
        let title = xpath.select("//h1[contains(@class, 'heading-large')]/a", newDom);
        let imagepath = xpath.select("//div[contains(@id, 'screenshots')]//img", newDom);
        let videopath = xpath.select("//div[contains(@class, 'box-page-related')]//video//source", newDom);

        this.constructor.paths = videopath.map((item) => item.attributes[1].value);

				this.parseMedia(imagepath, title);
      }).on("error", (err) => {

        console.log("Error: " + err.message);
      });
    })
  }

  saveFiles(paths) {
		return new Promise((resolve, reject) => {
			paths.forEach((item, index) => {
				let viduri = item.attributes[1].value;
				let options = {
					directory: process.cwd()+"/downloads/",
					filename: `vid_${index}.mp4`
				};

				download(viduri, options, function(err){
					if (err) reject(err);

					resolve("meow");
				});
			});
    });
  }

  parseMedia(images, title) {
    let _date = new Date();
    let month = _date.getMonth();
    let day = _date.getDate();
    let year = _date.getFullYear();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const today = ` <b>awwwwards.</b> <b>Site of the Day</b> \n${monthNames[month]} ${day} ${year}`;
    let videos = this.constructor.paths.map((item) => {
    	return {
				type: "video",
				media: item,
				caption: '',
				parse_mode: 'HTML'
			}
		});

    this.printMessages(videos, title, today);
  }

  printMessages(mediaObject, title, today) {
    bot.sendMessage(process.env.COMMUNITYID, `${today} ${this.constructor.siteUrl}`, {parse_mode: 'HTML'});
    bot.sendMediaGroup(process.env.COMMUNITYID, mediaObject);
  }
}

module.exports = Awwwards;