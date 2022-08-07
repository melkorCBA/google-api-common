const google = require("@googleapis/docs");
const docs = google.docs({
  version: "v1",
});

const queryMan = (() => {
  const replaceAllText = (find, replace) => {
    return {
      replaceAllText: {
        containsText: {
          matchCase: true,
          text: `[[${find}]]`,
        },
        replaceText: replace,
      },
    };
  };
  const getDocRequest = (queries) => {
    const requests = [];
    for (let i = 0; i < queries.length; i++) {
      const { action, name, value } = queries[i];
      if (action === "delete") {
        requests.push(replaceAllText(name, ""));
      }
      if (action === "update") {
        requests.push(replaceAllText(name, value));
      }
    }
    return requests;
  };
  return {
    replaceAllText,
    getDocRequest,
  };
})();

const updateDoc = async ({ documentId, query }) => {
  try {
    const response = await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: queryMan.getDocRequest(query),
      },
    });
    return response;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const attachToken = ({ data, type }) => {
  const attach = require('#attachToken');
  attach(docs, {data, type});
  // const auth = require("./auth-scopes")();
  // const authHeader = auth.Auth2Client.getAuth({
  //   data,
  //   type: type ?? auth.Auth2Client.oAuth2ClientTypes.QUICK,
  // });
  // docs.documents.context._options["headers"] = authHeader;
};

const resetAuth = () => {
  docs.documents.context._options["headers"] = null;
};

module.exports = () => {
  return {
    updateDoc,
    attachToken,
    resetAuth,
  };
};

/*
sample query
// const query = [
//   {
//     name: "Skills:Programming_Languages",
//     action: "update",
//     value: "C#",
//   },
//   {
//     name: "Skills:Technologies",
//     action: "delete",
//   },
//   {
//     name: "Skills:Databases",
//     action: "update",
//     value: "SQL",
//   },
//   {
//     name: "Skills:Cloud_Platforms",
//     action: "delete",
//   },
// ];


*/
