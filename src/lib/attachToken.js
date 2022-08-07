const { Auth2Client } = require("./grant-explicit");

module.exports = function (client, resource, { data, type }) {
  const authHeader = Auth2Client.getAuth({
    data,
    type: type ?? Auth2Client.oAUTH2CLIENT_TYPES.QUICK,
  });
  client[resource].context._options["headers"] = authHeader;
};
