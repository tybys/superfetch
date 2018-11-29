//require('dotenv').config();
const bot = require('../bot');

const behance = require('behance-api');
const Be = new behance(process.env.BEHANCEAPIKEY);

let datas = [];
class Behance {
  constructor() {
    this.fetch();
  }

  fetch() {
    Be.projects({time: 'today', field: 'illustration'},(err, res, data) => {
      if (err) throw err;

      // Do something with the data received from the API
      //console.dir(data);
      this.constructor.sort(data.projects);
    });
  }

  static sort(array) {
    function compareNumeric(a, b) {
      if (a.stats.appreciations > b.stats.appreciations) return -1;
      if (a.stats.appreciations < b.stats.appreciations) return 1;
    }

    array.sort(compareNumeric);
    array = array.splice(0, 5);

    for (var i of array) {
      if (!datas.find(x => x.id === i.id)) {
        datas.push({
          id: i.id,
          covers: i.covers,
          name: i.name,
          stats: i.stats.appreciations,
          url: i.url,
        });
      }
    }

    //this.constructor.printMessages(array);
    this.printMessages(datas)
  }

  static printMessages(array) {
    for (var i of array) {
      bot.sendMediaGroup(process.env.COMMUNITYID, [{
        type: "photo",
        media: i.covers.max_808,
        caption: `<a href="https://dribbble.com${i.url}">${i.name}</a>`,
        parse_mode: 'HTML'
      }
      ])
    }
  }
}

module.exports = Behance;