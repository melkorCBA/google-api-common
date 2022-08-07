const { Auth2Client } = require("./grant-explicit");

module.export = function (client, { data, type }) {
  const authHeader = Auth2Client.getAuth({
    data,
    type: type ?? Auth2Client.oAUTH2CLIENT_TYPES.QUICK,
  });
  client.files.context._options["headers"] = authHeader;
};
