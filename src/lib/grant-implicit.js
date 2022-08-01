const  axios = require("axios");

const getTokenRequestURL = ({
  client_id,
  redirect_uri,
  scopes,
  response_type,
}) => {
  let URL = "https://accounts.google.com/o/oauth2/v2/auth";
  const params = {
    client_id,
    redirect_uri,
    scopes: scopes?.join(","),
    response_type,
  };

  Object.keys(params).forEach((key) => {
    if (params[key]) URL += `?${key}=${params[key]}`;
  });
  return URL;
};

const validateToken = async (token) => {
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

const revokeToken = async (token) => {
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
