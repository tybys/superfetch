const bot = require('../bot');
const https = require('https');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const proxy = require('../proxy');
const fs = require('fs');
const path = require('path');

class Awwwards {
  constructor() {
    this.getSiteUrl();
    this.siteUrl = '';
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

        // debugger
        this.saveFiles(videopath).then(() => {
          this.parseMedia(imagepath, title);
        });
      }).on("error", (err) => {

        console.log("Error: " + err.message);
      });
    })
  }

  async saveFiles(paths) {
    debugger
		var fileName = "presentation.pcap";

		var filePath = "/home/files/" + fileName;

		fs.writeFile(filePath, data, function (err) {
			if (err) {
				//Error handling
			} else {
				console.log('Done');
				res.download(filePath, fileName, function(err) {
					console.log('download callback called');
					if( err ) {
						console.log('something went wrong');
					}

				}); // pass in the path to the newly created file
			}
		});

		await console.log('jopa')
  }

  parseMedia(images, title) {
    /*let shuffleArr = [];

    for (var j of video) {
      shuffleArr.push({
        type: "video",
        media: j.attributes[1].value,
        caption: '',
        parse_mode: 'HTML'
      });
    }*/

    let _date = new Date();
    let month = _date.getMonth();
    let day = _date.getDate();
    let year = _date.getFullYear();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const today = ` <b>awwwwards.</b> <b>Site of the Day</b> \n${monthNames[month]} ${day} ${year}`;

    // debugger
    this.printMessages(shuffleArr, title, today);
  }

  printMessages(mediaObject, title, today) {
    bot.sendMessage(process.env.COMMUNITYID, `${today} ${this.constructor.siteUrl}`, {parse_mode: 'HTML'});
    bot.sendMediaGroup(process.env.COMMUNITYID, mediaObject);
  }
}

module.exports = Awwwards;