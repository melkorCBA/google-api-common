const implicit = require("./grant-implicit");
const explicit = require("./grant-explicit");

const AUTH_SCOPES = {
  DRIVE: {
    VED_ALL_FILES: "https://www.googleapis.com/auth/drive",
    VED_CONFIGRATION_DATA: "https://www.googleapis.com/auth/drive.appdata",
    VED_SPECIFIC_FILE: "https://www.googleapis.com/auth/drive.file",
    VM_METADATA_OF_FILES: "https://www.googleapis.com/auth/drive.metadata",
    V_INFORMATION_OF_FILE:
      "https://www.googleapis.com/auth/drive.metadata.readonly",
    V_PHOTOS: "https://www.googleapis.com/auth/drive.photos.readonly",
    V_ALL_FILES: "https://www.googleapis.com/auth/drive.readonly",
  },
  DOC: {
    VED_ALL: "https://www.googleapis.com/auth/documents",
  },
};

module.exports = {
  implicit,
  explicit,
  AUTH_SCOPES,
};
