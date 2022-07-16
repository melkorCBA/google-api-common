const drive = require("./drive-service");
const doc = require("./docs-service");
const auth = require('./auth-service')()

const clients = (() => {
    const getClients = (token) => {
      const tokenData = {type: auth.Auth2Client.oAuth2ClientTypes.QUICK, data: {token}}
      const driveClient = drive();
      const docClient = doc();
      driveClient.attachToken(tokenData);
      docClient.attachToken(tokenData);
      
      return {
        driveClient,
        docClient,
      };
    };
    
    const resetClients = (clients) => {
      clients.forEach(client => client.resetAuth())
    }
    return {
      getClients,
      resetClients
    }
  })()

  module.exports = clients;