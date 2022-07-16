const keys = null;
const { OAuth2Client } = require("google-auth-library");
const utills = require("./utills")();
const Auth2Client = (() => {
  const oAuth2ClientTypes = Object.freeze({
    QUICK: "QUICK",
    COMPLETE: "COMPLETE",
  });
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

const getAuthData = async (scopes) => {
  try {
    // Generate a code_verifier and code_challenge
    const codes = await oAuth2Client.generateCodeVerifierAsync();

    // Generate the url that will be used for the consent dialog.
    return {
      authUrl: oAuth2Client.generateAuthUrl({
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

const getToken = async (code, codeVerifier) => {
  try {
    const response = await oAuth2Client.getToken({
      code,
      codeVerifier: codeVerifier,
    });
    return response.tokens["access_token"];
  } catch (err) {
    console.log(err);
  }
};

module.exports = () => {
  return { getAuthData, getToken, Auth2Client };
};
