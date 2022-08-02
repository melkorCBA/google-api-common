const {
  getTokenRequestURL,
  validateToken,
  revokeToken,
} = require("../src/lib/grant-implicit");

describe("implecit grannt flows", () => {
  describe("generating Token Request URL", () => {
    it("should have a clientId as a query paramter if client id is provided", () => {
        const clientId='riuwehriuwehiufiudhfsdfbsdjkfbsbdifu.apps.googleusercontent.com';
        const url  = getTokenRequestURL({client_id : clientId});
        expect(url).toContain(`?client_id=${clientId}`);
    });
    it("should have a redirect_uri as a query paramter if redirect_uri id is provided", () => {
        const redirect_uri='www.google.com/page';
        const url  = getTokenRequestURL({redirect_uri});
        expect(url).toContain(`?redirect_uri=${redirect_uri}`);
    });
    it("should have a scopes as a query paramter if scopes id is provided", () => {
        const scope=['www.google.com/scope1', 'www.google.com/scope2'];
        const url  = getTokenRequestURL({scope});
        expect(url).toContain(`?scope=${scope.join(',')}`);
    });
    it("should have a response_type as a query paramter if response_type is provided", () => {
        const response_type='offline';
        const url  = getTokenRequestURL({response_type});
        expect(url).toContain(`?response_type=${response_type}`);
    });
    it("should have a valid request url if valid query paramters provided", () => {
        const client_id='riuwehriuwehiufiudhfsdfbsdjkfbsbdifu.apps.googleusercontent.com';
        const redirect_uri='www.google.com/page';
        const scope=['www.google.com/scope1', 'www.google.com/scope2'];
        const response_type='offline';
        const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const url  = getTokenRequestURL({client_id, redirect_uri, scope, response_type,});
        expect(url).toBe(`${baseUrl}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(',')}&response_type=${response_type}`);
    });
  });
});
