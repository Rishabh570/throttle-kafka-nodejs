const { Appsignal } = require("@appsignal/nodejs");
const config = require('../config');

new Appsignal({
  active: true,
  name: config.appName,
  pushApiKey: config.appsignalAPIKey,
  environment: 'production',
});
