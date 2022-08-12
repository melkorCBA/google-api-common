# Google-api-common 
google-api-common is a wrapper around  **[google-api-nodejs-client]** that provides simpler javaScript APIs for common functions in following libraries.
- [@googleapis/docs]
- [@googleapis/drive]
- [google-auth-library]

# Getting started
## Installation
Run this to install via [NPM]
```
npm i @melkorcba-osl/googleapis-common
```

<h1>Authentication and authorization</h1>

This library provides both client side and server side Auth clients.

<h2> Client side Auth - Implicit Grant Flow </h2>
<p>
Requesting Auth Token in Client Side
</p>


```js
const grantImplicit = require("@melkorcba-osl/googleapis-common/grant-implicit");
const { getTokenRequestURL } = grantImplicit;
const URL = getTokenRequestURL({
      client_id:
        "<Client ID>",
      redirect_uri: "<Redirect URI>",
      scope: ['<list Auth scopes here>'],
      response_type: "token",
    });
window.location.href = URL
```


<p>
Extracting Token From Url
</p>

```js
const grantImplicit = require("@melkorcba-osl/googleapis-common/grant-implicit");
const { extractTokenFromUrl } = grantImplicit;
const access_token = extractTokenFromUrl(window.location.href);
```

<h2> Server side Auth - Explicit Grant Flow (Authorization Code FLow) </h2>

Auth Client is created using  0Auth2 Client from [googleapis/oAuthClient].
The client_id, client_secret, redirect_uris needed to set as environment variables before creating the oAuth2 Client.


```js
const grantExplicit = require("@melkorcba-osl/googleapis-common/grant-explicit");
const { AUTH_SCOPES } = require("@melkorcba-osl/googleapis-common/auth-scopes");
// creating oAuth2 client
const { getAuth, EXECUTION_ENVIRONMENTS } = grantExplicit();
const authClient = getAuth({type:EXECUTION_ENVIRONMENTS.SERVER });
// generate Token request URL and PKCE Codes.
// Scope abbreviations "DRIVE.VED_ALL_FILES" V - View, E - Edit, D - Delete ALL_FILES in the Drive
const scopes = [AUTH_SCOPES.AUTH_SCOPES.DRIVE.VED_ALL_FILES] 
const {authUrl, codes} = getAuthData(authClient, scopes);

```

[google-api-nodejs-client]: https://github.com/googleapis/google-api-nodejs-client  "googleapis/google-api-nodejs-client" 
[@googleapis/docs]: https://www.npmjs.com/package/@googleapis/docs  "@googleapis/docs" 
[@googleapis/drive]: https://www.npmjs.com/package/@googleapis/drive  "@googleapis/drive" 
[google-auth-library]: https://www.npmjs.com/package/google-auth-library  "google-auth-library" 
[NPM]: https://www.npmjs.com/package/@melkorcba-osl/googleapis-common "npm/google-api-common"
[googleapis/oAuthClient]: https://github.com/googleapis/google-api-nodejs-client/blob/main/samples/oauth2.js "googleapis/oAuthClient"


# Contributions
Contributors are welcomed with open arms. Please mind the Documentation still under development. Feel free to report any issues and support for new APIs.
