const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const Agent = require('socks5-https-client/lib/Agent');
require('dotenv').config();

let datas = [];

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TOKEN;
const socksConfig = {
  host: `${process.env.SOCKSHOST}`,
  port: parseInt(process.env.SOCKSPORT),
  user: `${process.env.SOCKSUSERNAME}`,
  pass: `${process.env.SOCKSPASSWORD}`
};
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {
  polling: true,
  request: {
		agentClass: Agent,
		agentOptions: {
      socksHost: socksConfig.host,
      socksPort: socksConfig.port,
      socksUsername: socksConfig.user,
      socksPassword: socksConfig.pass
		}
	}
});

bot.onText(/\/start/, (msg, match) => {
  //bot.sendMessage(msg.chat.id, 'dribbble fetching started');
  getRecent();
  // printMessages();
});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});

const getRecent = () => {
  https.get('https://dribbble.com/shots?sort=recent&page=1&per_page=24', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      //console.log(JSON.parse(data).explanation);
      //console.log(data)

      parseData(data).then((data) => {
        printMessages(datas);
      });
    });

  }).on("error", (err) => {

    console.log("Error: " + err.message);
  });
};

/**
 *
 * @param raw {HTMLAllCollection} full page source
 */
const parseData = async (raw) => {
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

        // https://ru.wikipedia.org/wiki/%D0%90%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC_%D0%B2%D1%8B%D0%B1%D0%BE%D1%80%D0%B0
        // https://ru.stackoverflow.com/questions/589269/%D0%9D%D0%B0%D0%B9%D1%82%D0%B8-%D0%BD%D0%B5%D1%81%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE-%D0%BC%D0%B0%D0%BA%D1%81%D0%B8%D0%BC%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D1%85-%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%B2-%D0%BC%D0%B0%D1%81%D1%81%D0%B8%D0%B2%D0%B5
        //if (i.likes_count == 0) delete i;

        delete i.comments_count;
        delete i.liked_by_html;
        delete i.liked;
        delete i.ga;
        delete i.is_rebound;
        delete i.rebounds_count;
        delete i.attachments_count;
        delete i.view_count;
       
        i.image = images[i.id]

        //existing(i);
        if (!datas.find(x => x.id === i.id)) {
          datas.push(i);
        }
      }
    }
  });
};

/**
 *
 * @param item {Object} dribbble shot object [id, path, likes, …]
 */
function existing(item) {
  if (!datas.find(x => x.id === item.id))
    datas.push(item);
}

function printMessages(shotsArray) {
  debugger
  let message = ''
  for (var i of shotsArray) {
    message += `<a href="https://dribbble.com${i.path}">${i.title}</a>\n`;

    bot.sendMediaGroup(process.env.BOTID, [
      {
        type: "photo",
        media: i.image,
        caption: `<a href="https://dribbble.com${i.path}">${i.title}</a>`,
        parse_mode: 'HTML'
      }
    ])
  }
}

getRecent();