const { OAuth2Client } = require("google-auth-library");
const utills = require("./utills")();

/**
 * Get Auth2Client that can be used to genereate new Auth Client
 * @returns {{oAUTH2CLIENT_TYPES: Object, getAuth:Function}} client types and getAuth function
 */

const Auth2Client = (() => {
  /**
   * Client types that is supported by getAuth
   * @param {{QUICK: String, COMPLETE:String}} oAUTH2CLIENT_TYPES description
   */
  const oAUTH2CLIENT_TYPES = Object.freeze({
    QUICK: "QUICK",
    COMPLETE: "COMPLETE",
  });
  /**
   * execution environment supported by getAuth
   * @param {{CLIENT: String, SERVER:String}} EXECUTION_ENVIRONMENTS  description
   */
  const EXECUTION_ENVIRONMENTS = Object.freeze({
    CLIENT: "CLIENT",
    SERVER: "SERVER",
  });
  /**
   * Get Auth client with requested type
   * @param {{token:String}} data  - Access token object
   * @param {oAUTH2CLIENT_TYPES} scopes  - client type (Quick or Complete)
   * @param {EXECUTION_ENVIRONMENTS} exeEnv  - execution environment of the Auth flow  (CLIENT or SERVER)
   * @param {Object} options  - auth data if auth flow happens in the client side
   * @returns {OAuth2Client} AuthClient Object
   */
  const getAuth = ({ data, type, exeEnv, options }) => {
    if (type === oAUTH2CLIENT_TYPES.QUICK) {
      return {
        Authorization: `Bearer ${data.token}`,
      };
    }
    // Auth flow happens in the server side
    // this is because the secrets are accsesble in the server side via environment varibales
    if (exeEnv && exeEnv === EXECUTION_ENVIRONMENTS.SERVER) {
      const { client_id, client_secret, redirect_uris } =
        utills.Environment.AUTH_DATA;

      const oAuth2Client = new OAuth2Client(
        client_id,
        client_secret,
        redirect_uris
      );

      return oAuth2Client;
    }

    // Auth flow happens in the client side, hence auth data has to be provided
    if (exeEnv && exeEnv === EXECUTION_ENVIRONMENTS.CLIENT && options) {
      const { client_id, client_secret, redirect_uris } = options;
      const oAuth2Client = new OAuth2Client(
        client_id,
        client_secret,
        redirect_uris
      );

      return oAuth2Client;
    }

    return new Error("execution environment or Auth data required are missing");
  };
  return {
    oAUTH2CLIENT_TYPES,
    EXECUTION_ENVIRONMENTS,
    getAuth,
  };
})();

/**
 * Get Auth data required to request a token for given scopes
 * @param {OAuth2Client} client  - OAuth2Client instance
 * @param {string[]} scopes  - required scopes
 * @returns {{authUrl:String, codes:Obejct}} authUrl and PKCE codes
 */

const getAuthData = async (client, scopes) => {
  try {
    // Generate a code_verifier and code_challenge
    const codes = await client.generateCodeVerifierAsync();

    // Generate the url that will be used for the consent dialog.
    return {
      authUrl: client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        // When using `generateCodeVerifier`, make sure to use code_challenge_method 'S256'.
        code_challenge_method: "S256",
        // Pass along the generated code challenge.
        code_challenge: codes.codeChallenge,
      }),
      codes,
    };
  } catch (err) {
    console.log(err);
  }
};

/**
 * Acquire access tokens from Auth code
 * Also set access tokens in for provided client internally
 * @param {OAuth2Client} client  - OAuth2Client instance
 * @param {string} code  - Auth code
 * @param {string} codeVerifier
 * @returns {string} Access token
 */

const getToken = async (client, code, codeVerifier) => {
  try {
    const response = await client.getToken({
      code,
      codeVerifier: codeVerifier,
    });
    client.setCredentials(response.tokens);
    return response.tokens?.access_token;
  } catch (err) {
    console.log(err);
  }
};

const AUTH_SCOPES = {
  DRIVE: {
    VED_ALL_FILES: "https://www.googleapis.com/auth/drive",
    VED_CONFIGRATION_DATA: "https://www.googleapis.com/auth/drive.appdata",
    VED_SPECIFIC_FILE: "https://www.googleapis.com/auth/drive.file",
    VM_METADATA_OF_FILES: "https://www.googleapis.com/auth/drive.metadata",
    V_INFORMATION_OF_FILE: "https://www.googleapis.com/auth/drive.metadata.readonly",
    V_PHOTOS: "https://www.googleapis.com/auth/drive.photos.readonly",
    V_ALL_FILES: "https://www.googleapis.com/auth/drive.readonly",
  },
  DOC :{
    VED_ALL : 'https://www.googleapis.com/auth/documents'
  }
};

module.exports = () => {
  return { getAuthData, getToken, Auth2Clien, AUTH_SCOPES };
};
