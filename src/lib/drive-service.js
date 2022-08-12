const google = require("@googleapis/drive");
const drive = google.drive({ version: "v3" });

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
      throw new Error(err);
    }
  };
  return {
    create,
  };
})();

const attachToken = ({ data, type }) => {
  const attach = require('./attachToken');
  attach(drive, 'files',{data, type});
};

const resetAuth = () => {
  drive.files.context._options["headers"] = null;
};

module.exports = () => {
  return {
    file,
    folder,
    resetAuth,
    attachToken,
  };
};
