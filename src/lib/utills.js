const Environment = (() => {
  return {
    TEMPLATE_PARENT_FOLDER_ID: process.env.TEMPLATE_PARENT_FOLDER_ID,
    TEMPLATE_DOC_ID: process.env.TEMPLATE_DOC_ID,
    AUTH_DATA: {
      client_id: process.env.AUTH_DATA_client_id,
      project_id: process.env.AUTH_DATA_project_id,
      auth_uri: process.env.AUTH_DATA_auth_uri,
      token_uri: process.env.AUTH_DATA_token_uri,
      auth_provider_x509_cert_url:
        process.env.AUTH_DATA_auth_provider_x509_cert_url,
      client_secret: process.env.AUTH_DATA_client_secret,
      redirect_uris: process.env.AUTH_DATA_redirect_uris,
    },
  };
})();

module.exports = () => {
  return {
    Environment,
  };
};
