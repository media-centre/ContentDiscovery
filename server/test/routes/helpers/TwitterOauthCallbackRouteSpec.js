/*eslint max-nested-callbacks:0*/
"use strict";
import TwitterOauthCallbackRoute from "../../../src/routes/helpers/TwitterOauthCallbackRoute";
import TwitterLogin from "../../../src/twitter/TwitterLogin.js";
import RouteLogger from "../../../src/routes/RouteLogger";
import LogTestHelper from "../../helpers/LogTestHelper";
import sinon from "sinon";

describe("TwitterOauthCallbackRoute", () => {

    describe("handle", () => {
        let sandbox = null;
        beforeEach("beforeEach", () => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(RouteLogger, "instance").returns(LogTestHelper.instance());
        });

        afterEach("afterEach", () => {
            sandbox.restore();
        });

        it("should return the clientCallbackUrl on success", () => {
            let twitterLogin = new TwitterLogin();
            let oauthToken = "oauth_token", oauthVerifier = "oauth_verifier", clientRedirectUrl = "clientRedirectUrl";
            let twitterLoginMock = sandbox.mock(TwitterLogin).expects("instance").withArgs({ "previouslyFetchedOauthToken": oauthToken }).returns(Promise.resolve(twitterLogin));
            let accessTokenFromTwitterMock = sandbox.mock(twitterLogin).expects("accessTokenFromTwitter").withArgs(oauthVerifier).returns(Promise.resolve(clientRedirectUrl));
            let response = { "redirect": () => {} };
            let request = {
                "query": {
                    "oauth_token": oauthToken,
                    "oauth_verifier": oauthVerifier
                }
            };
            let responseMock = sandbox.mock(response);
            responseMock.expects("redirect").withArgs(clientRedirectUrl);
            let twitterOauthCallbackRoute = new TwitterOauthCallbackRoute(request, response);
            return Promise.resolve(twitterOauthCallbackRoute.handle()).then(() => {
                twitterLoginMock.verify();
                accessTokenFromTwitterMock.verify();
                responseMock.verify();
            });
        });
    });
});
