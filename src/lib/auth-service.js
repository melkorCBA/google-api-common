const keys = null;
const { OAuth2Client } = require("google-auth-library");
const utills = require("./utills")();

/**
 * Get Auth2Client that can be used to genereate new Auth Client
 * @returns {{oAuth2ClientTypes: Object, getAuth:Function}} client types and getAuth function
 */

const Auth2Client = (() => {
  /**
   * Client types that is supported by getAuth
   * @param {{QUICK: number, COMPLETE:String}} oAuth2ClientTypes description
   */
  const oAuth2ClientTypes = Object.freeze({
    QUICK: "QUICK",
    COMPLETE: "COMPLETE",
  });
  /**
   * Get Auth client with requested type
   * @param {{token:String}} data  - Access token object
   * @param {oAuth2ClientTypes} scopes  - client type (Quick or Complete)
   * @returns {OAuth2Client} AuthClient Object
   */
  const getAuth = ({ data, type }) => {
    if (type === oAuth2ClientTypes.QUICK) {
      return {
        Authorization: `Bearer ${data.token}`,
      };
    }
    const { client_id, client_secret, redirect_uris } =
      utills.Environment.AUTH_DATA;

    const oAuth2Client = new OAuth2Client(
      client_id,
      client_secret,
      redirect_uris
    );

    return oAuth2Client;
  };
  return {
    oAuth2ClientTypes,
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

module.exports = () => {
  return { getAuthData, getToken, Auth2Client };
};
