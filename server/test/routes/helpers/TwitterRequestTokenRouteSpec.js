/*eslint max-nested-callbacks:0*/
"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import TwitterRequestTokenRoute from "../../../src/routes/helpers/TwitterRequestTokenRoute.js";
import TwitterLogin from "../../../src/twitter/TwitterLogin.js";
import Logger from "../../../src/logging/Logger";
import LogTestHelper from "../../helpers/LogTestHelper";
import sinon from "sinon";

describe("TwitterRequestTokenRouteSpec", () => {
    describe("handle", () => {
        let sandbox = null;
        beforeEach("beforeEach", () => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(Logger, "instance").returns(LogTestHelper.instance());
        });

        afterEach("afterEach", () => {
            sandbox.restore();
        });

        it("should redirect to authenticate with requestToken", () => {
            let twitterLogin = new TwitterLogin();
            let token = "token", expectedUrl = "https://api.twitter.com/oauth/authenticate?oauth_token=" + token;
            let clientCallbackUrl = "clientUrl", serverCallbackUrl = "serverUrl";
            twitterLogin.oauthToken = token;
            let twitterLoginMock = sandbox.mock(TwitterLogin).expects("instance").withArgs({ "serverCallbackUrl": serverCallbackUrl, "clientCallbackUrl": clientCallbackUrl, "userName": "Maharjun" }).returns(Promise.resolve(twitterLogin));
            let response = { "status": () => {}, "json": () => {} };
            let request = {
                "query": {
                    "clientCallbackUrl": clientCallbackUrl,
                    "serverCallbackUrl": serverCallbackUrl,
                    "userName": "Maharjun"
                }
            };
            let responseMock = sandbox.mock(response);
            responseMock.expects("status").withArgs(HttpResponseHandler.codes.OK);
            responseMock.expects("json").withArgs({ "authenticateUrl": expectedUrl });
            let twitterReqTokenRoute = new TwitterRequestTokenRoute(request, response);
            return Promise.resolve(twitterReqTokenRoute.handle()).then(() => {
                twitterLoginMock.verify();
                responseMock.verify();
            });
        });
    });
});
