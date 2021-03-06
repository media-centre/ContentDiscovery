/* eslint max-nested-callbacks: [2, 5]*/

"use strict";
import AdminDbClient from "../../src/db/AdminDbClient";
import CouchSession from "../../src/CouchSession";
import CouchClient from "../../src/CouchClient";
import LogTestHelper from "../helpers/LogTestHelper";
import { assert } from "chai";
import sinon from "sinon";

describe("AdminDbClient", () => {
    let sandbox = null;

    beforeEach("AdminDbClient", () => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(AdminDbClient, "logger").returns(LogTestHelper.instance());
    });

    afterEach("AdminDbClient", () => {
        sandbox.restore();
    });

    describe("instance", () => {
        it("if admin session exists return existing couchClient", (done) => {
            let obj = { "instance": "test" }, userName = "test";
            sandbox.stub(AdminDbClient, "getDbInstance").withArgs(userName).returns(obj);
            sandbox.stub(AdminDbClient, "isSessionExpired").withArgs(userName).returns(false);
            AdminDbClient.instance(userName).then((response) => {
                assert.deepEqual(response, obj.instance);
                done();
            });
        });

        it("if admin session not exists should login and returns couchClient", (done) => {
            sandbox.stub(AdminDbClient, "getDbInstance").withArgs("adminUser").returns(null);
            sandbox.stub(CouchSession, "login").returns(Promise.resolve("AuthSession=Token1-2; Version=1; Path=/; HttpOnly"));

            AdminDbClient.instance("adminUser", "adminPwd", "adminDb").then((response) => {
                assert.deepEqual(response, new CouchClient("adminDb", "Token1-2"));
                done();
            });
        });

        it("if admin session expires it should login and returns couchClient", (done) => {
            sandbox.stub(AdminDbClient, "isSessionExpired").withArgs("adminUser").returns(true);
            sandbox.stub(CouchSession, "login").returns(Promise.resolve("AuthSession=Token1-2; Version=1; Path=/; HttpOnly"));

            AdminDbClient.instance("adminUser", "adminPwd", "adminDb").then((response) => {
                assert.deepEqual(response, new CouchClient("adminDb", "Token1-2"));
                done();
            });
        });
    });

    describe("createUser", () => {
        it("should call put with _users/user", () => {
            let adminDbClient = new AdminDbClient("admin", "token1");
            let putMock = sandbox.mock(adminDbClient).expects("put");
            let body = { "_id": "org.couchdb.user:test", "name": "test", "roles": [], "type": "user", "password": "password", "generated": true };
            putMock.withArgs("/_users/org.couchdb.user:test", body);
            adminDbClient.createUser("test", "password");
            putMock.verify();
        });
    });

    describe("createDb", () => {
        it("should call put with /dbName", () => {
            let adminDbClient = new AdminDbClient("admin", "token1");
            let putMock = sandbox.mock(adminDbClient).expects("put");
            putMock.withArgs("/testdb");
            adminDbClient.createDb("testdb");
            putMock.verify();
        });
    });

    describe("setPermissions", () => {
        it("should call put with ", () => {
            let adminDbClient = new AdminDbClient("admin", "token1");
            let putMock = sandbox.mock(adminDbClient).expects("put");
            let body = { "admins": { "names": [], "roles": [] }, "members": { "names": ["test"], "roles": [] } };
            putMock.withArgs("/testdb/_security", body);
            adminDbClient.setPermissions("test", "testdb");
            putMock.verify();
        });
    });
});
