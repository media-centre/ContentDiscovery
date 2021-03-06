/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import FacebookPostsRoute from "../../../src/routes/helpers/FacebookPostsRoute.js";
import FacebookRequestHandler from "../../../src/facebook/FacebookRequestHandler.js";
import FacebookAccessToken from "../../../src/facebook/FacebookAccessToken.js";
import Logger from "../../../src/logging/Logger";
import LogTestHelper from "../../helpers/LogTestHelper";
import sinon from "sinon";
import { assert } from "chai";


describe("FacebookPostsRoute", () => {
    let request = null, facebookRequestHandler = null, accessToken = null, webUrl = null, posts = null, userName = "test1";
    before("FacebookPostsRoute", () => {
        accessToken = "test_access_token";
        webUrl = "https://facebook.com/testpage";
        request = {
            "query": {
                "webUrl": webUrl,
                "accessToken": accessToken,
                "since": "2015-12-21T21:47:11+00:00",
                "userName": userName
            }
        };
        sinon.stub(Logger, "instance").returns(LogTestHelper.instance());
    });

    after("FacebookPostsRoute", () => {
        Logger.instance.restore();
    });

    describe("handle", () => {
        let facebookRequestHandlerInstanceMock = null, facebookAccessTokenMock = null, facebookAccessToken = null;
        beforeEach("handle", () => {
            posts = [
                {
                    "message": "Lammasingi village in #AndhraPradesh is a meteorological oddity. \n\nFind out how - bit.ly/1Y19P17",
                    "created_time": "2015-12-11T08:02:59+0000",
                    "id": "163974433696568_958425464251457"
                }];
            facebookRequestHandler = new FacebookRequestHandler(accessToken);
            facebookRequestHandlerInstanceMock = sinon.mock(FacebookRequestHandler).expects("instance");
            facebookAccessToken = new FacebookAccessToken();
            facebookAccessTokenMock = sinon.mock(FacebookAccessToken);
            facebookAccessTokenMock.expects("instance").returns(facebookAccessToken);
        });

        afterEach("handle", () => {
            FacebookRequestHandler.instance.restore();
            facebookAccessTokenMock.restore();
        });

        it("should set the the facebook feeds on response", (done) => {
            sinon.stub(facebookAccessToken, "getAccessToken").withArgs(userName).returns(Promise.resolve(accessToken));
            facebookRequestHandlerInstanceMock.withArgs(accessToken).returns(facebookRequestHandler);
            let facebookRequestHandlerStub = sinon.stub(facebookRequestHandler, "pagePosts");
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, status);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual({ "posts": posts }, json);
                    facebookRequestHandlerInstanceMock.verify();
                    facebookAccessTokenMock.verify();
                    done();
                }
            };

            facebookRequestHandlerStub.withArgs(webUrl).returns(Promise.resolve(posts));

            let facebookRouteHelper = new FacebookPostsRoute(request, response);
            facebookRouteHelper.handle();
        });

        it("should set the error on the response in case if feeds can not be fetched from facebook", (done) => {
            sinon.stub(facebookAccessToken, "getAccessToken").withArgs(userName).returns(Promise.resolve(accessToken));
            facebookRequestHandlerInstanceMock.withArgs(accessToken).returns(facebookRequestHandler);
            let facebookRequestHandlerStub = sinon.stub(facebookRequestHandler, "pagePosts");
            let error = { "message": "bad request" };
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual(error, json);
                    facebookRequestHandlerInstanceMock.verify();
                    facebookAccessTokenMock.verify();
                    done();
                }
            };

            facebookRequestHandlerStub.withArgs(webUrl).returns(Promise.reject(error));

            let facebookRouteHelper = new FacebookPostsRoute(request, response);
            facebookRouteHelper.handle();
        });

        it("should get the feeds from time since option", (done) => {
            let timSinceRequest = {
                "query": {
                    "webUrl": webUrl,
                    "accessToken": accessToken,
                    "since": "2015-12-21T21:47:11+00:00",
                    "userName": userName
                }
            };

            sinon.stub(facebookAccessToken, "getAccessToken").withArgs(userName).returns(Promise.resolve(accessToken));
            facebookRequestHandlerInstanceMock.withArgs(accessToken).returns(facebookRequestHandler);
            let facebookRequestHandlerPagePostsMock = sinon.mock(facebookRequestHandler).expects("pagePosts");
            facebookRequestHandlerPagePostsMock.withArgs(webUrl, { "since": "2015-12-21T21:47:11.000Z" }).returns(Promise.resolve(posts));

            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, status);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual({ "posts": posts }, json);
                    facebookRequestHandlerInstanceMock.verify();
                    facebookAccessTokenMock.verify();
                    done();
                }
            };

            let facebookRouteHelper = new FacebookPostsRoute(timSinceRequest, response);
            facebookRouteHelper.handle();

        });

        it("should reject the request if web url is missing", (done) => {
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                    done();
                },
                "json": (json) => { //eslint-disable-line

                }
            };

            let facebookRouteHelper = new FacebookPostsRoute({
                "query": {
                    "accessToken": accessToken,
                    "since": "2015-12-21T21:47:11+00:00",
                    "userName": userName
                }
            }, response);
            facebookRouteHelper.handle();
        });

        it("should reject the request if access token is missing", (done) => {
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                    done();
                },
                "json": (json) => { //eslint-disable-line

                }
            };

            let facebookRouteHelper = new FacebookPostsRoute({
                "query": {
                    "webUrl": webUrl,
                    "since": "2015-12-21T21:47:11+00:00",
                    "userName": userName
                }
            }, response);
            sinon.stub(facebookAccessToken, "getAccessToken").withArgs(userName).returns(Promise.reject("access token not there"));
            facebookRouteHelper.handle();
        });

        it("should reject the request if since date is invalid", (done) => {
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                    done();
                },
                "json": (json) => { //eslint-disable-line

                }
            };

            let facebookRouteHelper = new FacebookPostsRoute({
                "query": {
                    "accessToken": accessToken,
                    "webUrl": webUrl,
                    "since": "2015-13-2121:47:11+00:00"
                }
            }, response);
            facebookRouteHelper.handle();
        });

        it("should reject the request if user name is missing", (done) => {
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                    done();
                },
                "json": (json) => { //eslint-disable-line

                }
            };

            let facebookRouteHelper = new FacebookPostsRoute({
                "query": {
                    "webUrl": webUrl,
                    "since": "2015-12-21T21:47:11+00:00"
                }
            }, response);
            facebookRouteHelper.handle();
        });

    });

});

