const google  = require("@googleapis/drive");
const drive = google.drive({ version: "v3" });
const driveScopes = ["https://www.googleapis.com/auth/drive"];

// const driveScopes = [
//   'https://www.googleapis.com/auth/drive', //See, edit, create, and delete all of your Google Drive files --
//   'https://www.googleapis.com/auth/drive.appdata', // see. edit. delete it;s own configration data
//   'https://www.googleapis.com/auth/drive.file', // sedd, edir, delete only the specific google drive file you ues with hsi app --
//   'https://www.googleapis.com/auth/drive.metadata', // View and manage metadata of files in your Google Drive
//   'https://www.googleapis.com/auth/drive.metadata.readonly', // See information about your Google Drive files
//   'https://www.googleapis.com/auth/drive.photos.readonly', // View the photos, videos and albums in your Google Photos
//   'https://www.googleapis.com/auth/drive.readonly', // See and download all your Google Drive files --
// ]

/*
  This need to set before any related google api is called 
*/

const attachScopes = function (scope) {
  scope.push(...driveScopes);
  return scope;
};

const setFileType = (fileType) => {
  const options = {};
  switch (fileType) {
    case FileTypes.WORKSPACE_DOCUMENT:
      options["mimeType"] = "application/pdf";
      return { options: options, method: "export" };
    case FileTypes.BINARY:
      return { options: options, method: "get" };
    default:
      return { options: null, method: "" };
  }
};

const file = (() => {
  const FileTypes = Object.freeze({
    WORKSPACE_DOCUMENT: "WORKSPACE_DOCUMENT",
    BINARY: "",
  });
  const download = async ({ fileId, fileType }) => {
    const { options, method } = setFileType(fileType);

    try {
      const response = await drive.files[method]({
        fileId,
        ...options,
      });
      return response;
    } catch (err) {
      throw new Error(err);
    }
  };

  const copy = async ({ fileId, newName, parentId }) => {
    try {
      const response = await drive.files.copy({
        fileId,
        resource: {
          name: newName,
          parents: [parentId],
        },
        fields: "id",
      });
      const { data } = response;
      return data;
    } catch (err) {
      throw new Error(err);
    }
  };

  return {
    download,
    copy,
    FileTypes,
  };
})();

const folder = (() => {
  const create = async ({ parentId, name }) => {
    try {
      const response = await drive.files.create({
        resource: {
          name,
          parents: [parentId],
          mimeType: "application/vnd.google-apps.folder",
        },
        fields: "id",
      });
      const { data } = response;
      return data;
    } catch (err) {
      console.log("----Erorors");
      console.log(err);
      console.log("----Erorors.config");
      console.log(err.response.config);
      throw new Error(err);
    }
  };
  return {
    create,
  };
})();

const attachToken = ({ data, type }) => {
  const auth = require("./auth-service")();
  const authHeader = auth.Auth2Client.getAuth({
    data,
    type: type ?? auth.Auth2Client.oAuth2ClientTypes.QUICK,
  });
  drive.files.context._options["headers"] = authHeader;
};

const resetAuth = () => {
  drive.files.context._options["headers"] = null;
};

module.exports = () => {
  return {
    attachScopes,
    file,
    folder,
    resetAuth,
    attachToken,
  };
};
