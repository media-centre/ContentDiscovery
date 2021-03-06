/*eslint max-nested-callbacks:0, no-unused-vars:0 */
"use strict";
import Source, { STATUS_INVALID, STATUS_VALID } from "../../src/js/config/Source.js";
import PouchClient from "../../src/js/db/PouchClient.js";
import CategoryDb from "../../src/js/config/db/CategoryDb.js";
import FeedApplicationQueries from "../../src/js/feeds/db/FeedApplicationQueries";
import sinon from "sinon";
import { assert } from "chai";

describe("Source", () => {
    let sandbox = null;
    beforeEach("before each", () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach("after each", () => {
        sandbox.restore();
    });

    describe("delete", () => {
        let sourceId = null, categoryId = null, sourceDocument = null;
        let pouchClientGetDocumentMock = null, pouchClientDeleteDoucmentMock = null, pouchClientUpdateDoucmentMock = null;
        beforeEach("delete", () => {
            sandbox = sinon.sandbox.create();
            sourceId = "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3";
            categoryId = "95fa167311bf340b461ba414f1004074";
            sourceDocument = {
                "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
                "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
                "docType": "source",
                "sourceType": "twitter",
                "url": "@balaswecha",
                "categoryIds": [
                    "95fa167311bf340b461ba414f1004074"
                ],
                "status": "valid"
            };

            pouchClientDeleteDoucmentMock = sandbox.mock(PouchClient).expects("deleteDocument");
            pouchClientUpdateDoucmentMock = sandbox.mock(PouchClient).expects("updateDocument");
        });

        it("delete source document along with the references when category id is available in the category list", () => {
            let source = new Source(sourceDocument);
            let feedsDeleteMock = sandbox.mock(FeedApplicationQueries).expects("deleteFeeds");
            feedsDeleteMock.withArgs(sourceId).returns(Promise.resolve(true));
            pouchClientDeleteDoucmentMock.withArgs(source.getDocument()).returns(Promise.resolve("response"));
            return source.delete(categoryId).then((response) => {
                assert.isTrue(response);
                feedsDeleteMock.verify();
                pouchClientDeleteDoucmentMock.verify();
            });
        });

        it("should reject with false if feeds deletion fails", () => {
            let source = new Source(sourceDocument);
            let feedsDeleteMock = sandbox.mock(FeedApplicationQueries).expects("deleteFeeds");
            feedsDeleteMock.withArgs(sourceId).returns(Promise.reject("error"));
            pouchClientDeleteDoucmentMock.withArgs(source.getDocument()).never();
            return source.delete(categoryId).catch((response) => {
                assert.isFalse(response);
                feedsDeleteMock.verify();
                pouchClientDeleteDoucmentMock.verify();
            });
        });

        it("update source document by removing the category id if more than one category in the list", (done) => {
            sourceDocument = {
                "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
                "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
                "docType": "source",
                "sourceType": "twitter",
                "url": "@balaswecha",
                "categoryIds": [
                    "95fa167311bf340b461ba414f1004073", "95fa167311bf340b461ba414f1004074", "95fa167311bf340b461ba414f1004075"
                ],
                "status": "valid"
            };
            let sourceUpdateDocument = {
                "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
                "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
                "docType": "source",
                "sourceType": "twitter",
                "url": "@balaswecha",
                "categoryIds": [
                    "95fa167311bf340b461ba414f1004073", "95fa167311bf340b461ba414f1004075"
                ],
                "status": "valid"
            };
            pouchClientUpdateDoucmentMock.withArgs(Source.instance(sourceUpdateDocument).getDocument()).returns(Promise.resolve("success"));
            let source = new Source(sourceDocument);
            source.delete(categoryId).then(response => {
                pouchClientUpdateDoucmentMock.verify();
                done();
            });
        });

        it("should reject incase of error while updating the source document", (done) => {
            sourceDocument = {
                "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
                "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
                "docType": "source",
                "sourceType": "twitter",
                "url": "@balaswecha",
                "categoryIds": [
                    "95fa167311bf340b461ba414f1004073", "95fa167311bf340b461ba414f1004074", "95fa167311bf340b461ba414f1004075"
                ],
                "status": "valid"
            };
            let sourceUpdateDocument = {
                "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
                "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
                "docType": "source",
                "sourceType": "twitter",
                "url": "@balaswecha",
                "categoryIds": [
                    "95fa167311bf340b461ba414f1004073", "95fa167311bf340b461ba414f1004075"
                ],
                "status": "valid"
            };
            pouchClientUpdateDoucmentMock.withArgs(Source.instance(sourceUpdateDocument).getDocument()).returns(Promise.reject("Failed"));
            let source = new Source(sourceDocument);
            source.delete(categoryId).catch(error => {
                assert.isFalse(error);
                pouchClientUpdateDoucmentMock.verify();
                done();
            });
        });

        it("should reject incase of error while deleting the source document along with the references", () => {
            let source = new Source(sourceDocument);
            let feedsDeleteMock = sandbox.mock(FeedApplicationQueries).expects("deleteFeeds");
            feedsDeleteMock.withArgs(sourceId).returns(Promise.resolve(true));
            pouchClientDeleteDoucmentMock.withArgs(source.getDocument()).returns(Promise.reject("error"));
            return source.delete(categoryId).catch((response) => {
                assert.isFalse(response);
                feedsDeleteMock.verify();
                pouchClientDeleteDoucmentMock.verify();
            });
        });
    });

    describe("save", () => {
        let sourceParamsObject = null, expectedDocument = null;
        let categoryId = "8bc3db40aa04d6c65fd10d833f00163e", url = "test url";
        before("save", () => {
            let status = STATUS_VALID;
            sourceParamsObject = { "categoryIds": [categoryId], "sourceType": "rss", "url": url, "status": status, "latestFeedTimestamp": "2016-01-18T15:01:47+00:00" };
            expectedDocument = {
                "docType": "source",
                "sourceType": "rss",
                "url": url,
                "categoryIds": [categoryId],
                "status": status,
                "latestFeedTimestamp": "2016-01-18T15:01:47+00:00"
            };
        });

        describe("getDocument", () => {
            it("should return the new source document", () => {
                assert.deepEqual(expectedDocument, new Source(sourceParamsObject).getDocument());
            });
        });

        describe("createOrUpdateSource", () => {
            it("should create Source if no source with url is found", (done) => {
                let jsonDocument = {
                    "docType": "source",
                    "sourceType": "rss",
                    "url": "www.google.com/rss",
                    "categoryId": [
                        "8bc3db40aa04d6c65fd10d833f00163e"
                    ]
                };
                let fetchDocumentsStub = sandbox.stub(PouchClient, "fetchDocuments");
                fetchDocumentsStub.withArgs("category/allSourcesByUrl", { "include_docs": true, "key": jsonDocument.url });
                fetchDocumentsStub.returns(Promise.resolve([]));
                let source = Source.instance(jsonDocument);
                let pouchClientMock = sandbox.mock(PouchClient).expects("createDocument").withArgs(source.getDocument()).returns(Promise.resolve("resolve"));
                source.save().then(() => {
                    pouchClientMock.verify();
                    PouchClient.createDocument.restore();
                    PouchClient.fetchDocuments.restore();
                    done();
                });
            });

            it("should update Source if a source with given url exists", (done) => {
                let existingDocument = {
                    "_id": "12345",
                    "docType": "source",
                    "sourceType": "rss",
                    "url": "www.google.com/rss",
                    "categoryIds": [
                        "id1"
                    ]
                };
                let expectedCreateDocument = {
                    "_id": "12345",
                    "docType": "source",
                    "sourceType": "rss",
                    "url": "www.google.com/rss",
                    "categoryIds": [
                        "id1", "id2"
                    ]
                };

                let jsonDocument = {
                    "docType": "source",
                    "sourceType": "rss",
                    "url": "www.google.com/rss",
                    "categoryIds": [
                        "id2"
                    ]
                };

                let fetchDocumentsStub = sandbox.stub(PouchClient, "fetchDocuments");
                fetchDocumentsStub.withArgs("category/allSourcesByUrl", { "include_docs": true, "key": jsonDocument.url });
                fetchDocumentsStub.returns(Promise.resolve([existingDocument]));
                let pouchClientMock = sandbox.mock(PouchClient).expects("updateDocument").withArgs(Source.instance(expectedCreateDocument).getDocument()).returns(Promise.resolve(""));
                Source.instance(jsonDocument).save().then(() => {
                    pouchClientMock.verify();
                    PouchClient.updateDocument.restore();
                    PouchClient.fetchDocuments.restore();
                    done();
                });
            });

            it("should not update or create if the category id of a url is already exists in the document fetched from db", (done) => {
                let newUrlDocument = {
                    "categoryIds": ["F2B643BE-FC17-AE81-85AF-D6136EB5E1C8"],
                    "docType": "source",
                    "sourceType": "facebook",
                    "status": "invalid",
                    "url": "http://dynamic.feedsportal.com/pf/555218/http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms"
                };

                let existingDocuments = [{
                    "_id": "73C6D95C-C62B-B263-9885-C48CBA039B14",
                    "_rev": "11-4b90658a579a7fbd19658f87e9280683",
                    "categoryIds": ["F2B643BE-FC17-AE81-85AF-D6136EB5E1C8"],
                    "docType": "source",
                    "sourceType": "rss",
                    "status": "valid",
                    "url": "http://dynamic.feedsportal.com/pf/555218/http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms"
                }];
                let fetchDocumentsStub = sandbox.stub(PouchClient, "fetchDocuments");
                fetchDocumentsStub.withArgs("category/allSourcesByUrl", { "include_docs": true, "key": newUrlDocument.url });
                fetchDocumentsStub.returns(Promise.resolve(existingDocuments));

                let pouchClientStub = sandbox.mock(PouchClient).expects("updateDocument");
                pouchClientStub.withArgs(Source.instance(existingDocuments[0]).getDocument()).returns(Promise.resolve({}));

                Source.instance(newUrlDocument).save().then((response)=> {
                    pouchClientStub.verify();
                    PouchClient.updateDocument.restore();
                    PouchClient.fetchDocuments.restore();
                    done();
                });

            });
        });


        describe("update", () => {
            it("should update the document with new values", () => {
                let source = new Source(sourceParamsObject);
                let updatedParams = {
                    "docType": "source",
                    "sourceType": "rss",
                    "url": url,
                    "categoryIds": [categoryId, "1234"],
                    "status": STATUS_INVALID,
                    "latestFeedTimestamp": "2016-01-18T15:01:47+00:00"
                };

                let pouchClientUpdateMock = sandbox.mock(PouchClient).expects("updateDocument");
                pouchClientUpdateMock.withExactArgs(updatedParams).returns(Promise.resolve("response"));
                return source.update({ "status": STATUS_INVALID, "categoryIds": [categoryId, "1234"] }).then(() => {
                    pouchClientUpdateMock.verify();
                    PouchClient.updateDocument.restore();
                });
            });
        });
    });
});
