const https = require('https');
const bot = require('../bot');
const fs = require('fs');

let datas = [];
class Uplabs {
  constructor() {
    this.receiveJson()
  }

  receiveJson() {
    https.get('https://www.uplabs.com/all.json?days_ago=0&page=1', (resp) => {
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
    //this.messages(array);
  }

  checkForUniq(array) {
    /*let hashes = array.map(function(item, index, array) {
      return item.id;
    });

    hashes.toString();
    hashes += ',';*/

    fs.readFile(`${__dirname}/uplabs.txt`, function (err, data) {
      if (err) throw err;

      /*var ids = data.toString().split(',');
      ids.splice(-1, 1);*/

      for (let i of array) {
        if (data.toString().indexOf(i.id) < 0) {
          //console.log(i.id)
          i.id += ',';
          fs.appendFile(`${__dirname}/uplabs.txt`, i.id, function (err) {
            if (err) throw err;
            console.log('The "data to append" was appended to file!', i.link_url);
          });
        }
      }
    });

    // debugger

  }

  messages(array) {
    for (var i of array) {
      bot.sendMediaGroup(process.env.COMMUNITYID, [{
        type: "photo",
        media: i.animated_teaser_url,
        caption: `<a href="https://dribbble.com${i.link_url}">${i.name}</a>`,
        parse_mode: 'HTML'
      }
      ])
    }
  }
}

module.exports = Uplabs;