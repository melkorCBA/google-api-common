const drive = require("./drive-service");
const doc = require("./docs-service");
const explicitFlow = require('./grant-explicit');


const clients = (() => {
    const getClients = (token) => {
      const tokenData = {type: explicitFlow.Auth2Client.oAuth2ClientTypes.QUICK, data: {token}}
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