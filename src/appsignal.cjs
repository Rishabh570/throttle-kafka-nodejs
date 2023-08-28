const { Appsignal } = require("@appsignal/nodejs");
const config = require('../config');

new Appsignal({
  active: true,
  name: config.appName,
  pushApiKey: process.env.APPSIGNAL_PUSH_API_KEY,
  environment: 'production',
});
