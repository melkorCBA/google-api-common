/**
 * Validate access token
 * @param {{ client_id, redirect_uri, scope, response_type}} Auth date  - auth data needed to request new access token
 * @returns {{URL: string }} Request URL
 */

const getTokenRequestURL = ({
  client_id,
  redirect_uri,
  scope,
  response_type,
}) => {
  let URL = "https://accounts.google.com/o/oauth2/v2/auth";
  const params = {
    client_id,
    redirect_uri,
    scope: scope?.join(","),
    response_type,
  };
  let providedCount = Object.keys(params).map((k)=> params[k] ? 1 : 0).reduce((a,b)=>a+b);
  let i = 0;
  Object.keys(params).forEach((key) => {
   
    if (params[key]) {
      if (i === 0) URL += "?";
      URL += `${key}=${params[key]}`;
      if (i < providedCount -1) URL += "&";
      i++;
    }
  });
  return URL;
};

/**
 * Validate access token
 * @param {{token:String}} token  - Access token
 * @param {Object} axios  - axios client
 * @returns {{status: number, expired: number, expires_in: number }} validation status
 */

const validateToken = async (token, axios) => {
  let URL = "https://www.googleapis.com/oauth2/v3/tokeninfo";
  const params = {
    access_token: token,
  };
  Object.keys(params).forEach((key) => {
    if (params[key]) URL += `?${key}=${params[key]}`;
  });

  const response = await axios.get({ baseURL: URL });
  if (response["error_description"])
    return { status: 0, expired: null, expires_in: null };
  const { expires_in } = response;
  if (+expires_in < 1) return { status: 1, expired: 1, timeToExpire: 0 };
  return { status: 1, expired: 0, expires_in: +expires_in };
};
/**
 * Revoke access token
 * @param {{token:String}} token  - Access token
 * @param {Object} axios  - axios client
 * @returns {{status:string}} revoke status (Revoked/Failed)
 */
const revokeToken = async (token, axios) => {
  let URL = "https://oauth2.googleapis.com/revoke";
  const params = {
    token,
  };
  Object.keys(params).forEach((key) => {
    if (params[key]) URL += `?${key}=${params[key]}`;
  });
  const response = await axios.post({ baseURL: URL });
  return { status: response.status === 200 ? "Revoked" : "Failed" };
};

module.exports = {
  getTokenRequestURL,
  validateToken,
  revokeToken,
};
