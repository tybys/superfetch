const HttpsProxyAgent = require('https-proxy-agent');
const url = require('url');

module.exports = {
  endpoint: function (uri) {
    // HTTP/HTTPS proxy to connect to
    const proxy = process.env.PROXYHOST;
    console.log('using proxy server %j', proxy);

    let endpoint = uri;
    console.log('attempting to GET %j', endpoint);
    let options = url.parse(endpoint);

    let agent = new HttpsProxyAgent(proxy);
    options.agent = agent;

    return options;
  }
};