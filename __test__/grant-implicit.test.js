const {
  getTokenRequestURL,
  validateToken,
  revokeToken,
  extractTokenFromUrl,
  searhQueryString,
  seacrhFragment
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
        expect(url).toContain(`?scope=${scope.join(' ')}`);
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
        expect(url).toBe(`${baseUrl}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(' ')}&response_type=${response_type}`);
    });
  });

  describe('extracting token from fragmneted URL', ()=>{
    it('should return access token if available in a query string', () => {
        const access_token = 'fihsdkfnf432423492304-3204230394';
        const queryString_access_token_asFirstArg = `https://abc.com?access_token=${access_token}&other=oifhjoiejf`;
        expect(searhQueryString(queryString_access_token_asFirstArg, 'access_token')).toBe(access_token)
    })
    it('should return flase if access token not available in a query string', () => {
        const access_token = 'fihsdkfnf432423492304-3204230394';
        const queryString_access_token_asFirstArg = `https://abc.com?access_n=${access_token}&other=oifhjoiejf`;
        expect(searhQueryString(queryString_access_token_asFirstArg, 'access_token')).toBe(false)
    })
    it('should return the token if token is available as query param', () => {
        const access_token = 'fihsdkfnf432423492304-3204230394';
        const url_access_token_asFirstArg=`https://abc.com?access_token=${access_token}&other=oifhjoiejf`;
        expect(extractTokenFromUrl(url_access_token_asFirstArg)).toBe(access_token)

        
        const url_access_token_asNonFirstArg =`https://abc.com?other=ioiwes&access_token=${access_token}&other=oifhjoiejf`;
        expect(extractTokenFromUrl(url_access_token_asNonFirstArg)).toBe(access_token);
    })

    it('should return access token if available in a fragment string', () => {
        const access_token = 'fihsdkfnf432423492304-3204230394';
        const url_access_token_asFirstArg=`https://abc.com#access_token=${access_token}&other=oifhjoiejf`;
        expect(seacrhFragment(url_access_token_asFirstArg, 'access_token=')).toBe(access_token)
    })
    it('should return flase if  token is not available in a fragment string', () => {
        const access_token = 'fihsdkfnf432423492304-3204230394';
        const url_access_token_asFirstArg=`https://abc.com#acces=${access_token}&other=oifhjoiejf`;
        expect(seacrhFragment(url_access_token_asFirstArg, 'access_token=')).toBe(false)
    })

    it('should return the token if token is available as fragment', () => {
        const access_token = 'fihsdkfnf432423492304-3204230394';
        const url_access_token_asFirstArg=`https://abc.com#access_token=${access_token}&other=oifhjoiejf`;
        expect(extractTokenFromUrl(url_access_token_asFirstArg)).toBe(access_token)

        
        const url_access_token_asNonFirstArg =`https://abc.com?other=ioiwes#access_token=${access_token}&other=oifhjoiejf`;
        expect(extractTokenFromUrl(url_access_token_asNonFirstArg)).toBe(access_token);
    })


    it('should return flase if token is not available as fragment', () => {
        const access_token = 'fihsdkfnf432423492304-3204230394';
        const url_access_token_asFirstArg=`https://abc.com#access_ten=${access_token}&other=oifhjoiejf`;
        expect(extractTokenFromUrl(url_access_token_asFirstArg)).toBe(false)

        
        const url_access_token_asNonFirstArg =`https://abc.com?other=ioiwes?ffsdfds=gdfg&other=oifhjoiejf`;
        expect(extractTokenFromUrl(url_access_token_asNonFirstArg)).toBe(false);
    })

    it('should return token of fragment if token is availble in both fragmetn and query', () => {
        const access_token_frg = 'fihsdkfnf432423492304-3204230394frg';
        const access_token_query = 'fihsdkfnf432423492304-3204230394query';
        const url_access_token_asFirstArg=`https://abc.com#access_token=${access_token_frg}?access_token=${access_token_query}`;
        expect(extractTokenFromUrl(url_access_token_asFirstArg)).toBe(access_token_frg)

    })

  });
});
