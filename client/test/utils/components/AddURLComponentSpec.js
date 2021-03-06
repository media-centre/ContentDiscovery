/* eslint no-unused-expressions:0 */

"use strict";

import AddURLComponent from "../../../src/js/utils/components/AddURLComponent";
import { expect, assert } from "chai";
import sinon from "sinon";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";
import "../../helper/TestHelper.js";
import RssRequestHandler from "../../../src/js/rss/RssRequestHandler";

describe("AddURLComponent", () => {

    let AddURLComponentElement = null;
    let categoryDetailsPageStrings = { "allCategoriesLinkLabel": "All Categories",
            "deleteCategoryLinkLabel": "Delete Category",
            "addUrlLinkLabel": "Add Url",
            "successMessages": { "urlSuccess": "Url is successfully added" },
            "errorMessages": { "invalidRssUrl": "Invalid URL format",
                "emptyUrl": "URL should not be empty",
                "alreadyAdded": "URL is already added" }
    };

    before("TabComponent", () => {
        AddURLComponentElement = TestUtils.renderIntoDocument(
            <AddURLComponent exampleMessage="Example: thehindu.com/opinion/?service=rss"
                hintMessage = "Please enter RSS URL here"
                addUrlLinkLabel="Add Url" content={[{ "url": "http://www.test.com" }]} errorMessage=""
                sourceDomainValidation={(url, callback) => callback({ "error": "Url is successfully added", "urlAdded": true })}
                categoryDetailsPageStrings={categoryDetailsPageStrings} categoryId="testCategory"
            />
        );
    });

    it("should be present", () => {
        assert.isDefined(AddURLComponentElement, "Defined");
    });

    it("should have mandatory properties addUrlLinkLabel, content and errorMessage", () => {
        assert.isDefined(AddURLComponentElement.props.addUrlLinkLabel, "Defined");
        assert.isDefined(AddURLComponentElement.props.content, "Defined");
        assert.isDefined(AddURLComponentElement.props.errorMessage, "Defined");
    });

    it("should have values passed in the mandatory props", () => {
        expect("Add Url").to.eq(AddURLComponentElement.props.addUrlLinkLabel);
        expect([{ "url": "http://www.test.com" }]).to.deep.eq(AddURLComponentElement.props.content);
        expect("").to.eq(AddURLComponentElement.props.errorMessage);
    });

    it("should have addUrlLinkLabel displayed in the add url button", () => {
        expect("Add Url").to.eq(AddURLComponentElement.refs.addUrlLinkText.textContent);
    });

    it("should display all the urls if content props has values", ()=> {
        let addUrlDom = ReactDOM.findDOMNode(AddURLComponentElement);
        expect(2).to.eq(addUrlDom.querySelectorAll("ul.url-list li").length);
    });

    it("should call showAddUrlTextBox function on clicking addUrlButton", () => {
        let addUrlDom = ReactDOM.findDOMNode(AddURLComponentElement);
        TestUtils.Simulate.click(addUrlDom.querySelector("#addNewUrlButton"));
        expect(true).to.eq(AddURLComponentElement.state.showUrlInput);
    });

    it("should display add url textbox on clicking addUrlButton", () => {
        let addUrlDom = ReactDOM.findDOMNode(AddURLComponentElement);
        TestUtils.Simulate.click(addUrlDom.querySelector("#addNewUrlButton"));
        assert.isDefined(AddURLComponentElement.refs.addUrlTextBox, "Defined");
    });

    it("should validate the url with regex", ()=> {
        expect("URL should not be empty").to.eq(AddURLComponentElement._isValidUrl(""));
        expect("Invalid URL format").to.eq(AddURLComponentElement._isValidUrl("http.www.test.com"));
        expect("URL is already added").to.eq(AddURLComponentElement._isValidUrl("http://www.test.com"));
        expect("").to.eq(AddURLComponentElement._isValidUrl("http://www.test1.com"));
    });

    it("should set the errorMessage in the dom if the input url is wrong", () => {
        let addUrlDom = ReactDOM.findDOMNode(AddURLComponentElement);
        TestUtils.Simulate.click(addUrlDom.querySelector("#addNewUrlButton"));
        let input = AddURLComponentElement.refs.addUrlTextBox;
        TestUtils.Simulate.blur(input);
        expect("URL should not be empty").to.eq(AddURLComponentElement.state.errorMessage);
        expect("URL should not be empty").to.eq(addUrlDom.querySelector(".add-url-status").textContent);
    });

    it("should remove the url input box once a valid url is entered", () => {
        let addUrlDom = ReactDOM.findDOMNode(AddURLComponentElement);
        TestUtils.Simulate.click(addUrlDom.querySelector("#addNewUrlButton"));
        let input = AddURLComponentElement.refs.addUrlTextBox;
        input.value = "http://www.test1.com";
        TestUtils.Simulate.blur(input);
        expect("Url is successfully added").to.eq(AddURLComponentElement.state.errorMessage);
        expect(addUrlDom.querySelector("input")).to.be.null;
    });

    it("should show the url input with red outline if there is an invalid url", ()=> {
        let addUrlDom = ReactDOM.findDOMNode(AddURLComponentElement);
        TestUtils.Simulate.click(addUrlDom.querySelector("#addNewUrlButton"));
        let input = AddURLComponentElement.refs.addUrlTextBox;
        input.value = "http://www.test1.com";
        TestUtils.Simulate.blur(input);

        expect("Url is successfully added").to.eq(AddURLComponentElement.state.errorMessage);
    });

    it("should call the validateUrl function if the give url is valid", () => {
        let sandbox = sinon.sandbox.create();
        let addUrlDom = ReactDOM.findDOMNode(AddURLComponentElement), url = "http://www.test1.com";
        TestUtils.Simulate.click(addUrlDom.querySelector("#addNewUrlButton"));
        let input = AddURLComponentElement.refs.addUrlTextBox;
        input.value = url;
        let rssRquestHandlerMock = sandbox.stub(RssRequestHandler, "fetchRssFeeds");
        rssRquestHandlerMock.withArgs(url).returns({ "feeds": "test" });

        TestUtils.Simulate.blur(input);

        sandbox.verify();
        sandbox.restore();
    });

    it("should remove the url input box when we click on the deleteUrl button", () => {
        let addUrlDom = ReactDOM.findDOMNode(AddURLComponentElement);
        TestUtils.Simulate.click(addUrlDom.querySelector("#deleteUrlButton"));
        expect(false).to.eq(AddURLComponentElement.state.showUrlInput);
    });

    it("should have addUrlTextBox if addURLHandler property is not present", () => {
        let addUrlDom = ReactDOM.findDOMNode(AddURLComponentElement);
        TestUtils.Simulate.click(addUrlDom.querySelector("#addNewUrlButton"));
        assert.isDefined(AddURLComponentElement.refs.addUrlTextBox);
    });

    it("should not have addUrlTextBox if addURLHandler validation rejected", (done) => {
        let addURLComponentTest = TestUtils.renderIntoDocument(
            <AddURLComponent exampleMessage="test" hintMessage = "test" categoryId="test" addUrlLinkLabel="Add Url" content={[{ "url": "http://www.test.com" }]}
                errorMessage="" sourceDomainValidation={(url, callback) => callback({ "error": "Url is successfully added", "urlAdded": true })}
                categoryDetailsPageStrings={categoryDetailsPageStrings} addURLHandler={() => {
                    return new Promise((resolve, reject) => {
                        reject("error");
                    });
                }}
            />);
        let addUrlDom = ReactDOM.findDOMNode(addURLComponentTest);
        TestUtils.Simulate.click(addUrlDom.querySelector("#addNewUrlButton"));
        setTimeout(() => {
            assert.isUndefined(addURLComponentTest.refs.addUrlTextBox, "Defined");
            done();
        }, 0);
    });

    it("should have addUrlTextBox if addURLHandler validation succeed", (done) => {
        let addURLComponentTest = TestUtils.renderIntoDocument(
            <AddURLComponent exampleMessage="test" hintMessage = "test" categoryId="test" addUrlLinkLabel="Add Url" content={[{ "url": "http://www.test.com" }]}
                errorMessage="" sourceDomainValidation={(url, callback) => callback({ "error": "Url is successfully added", "urlAdded": true })}
                categoryDetailsPageStrings={categoryDetailsPageStrings} addURLHandler={() => {
                    return new Promise((resolve) => {
                        resolve("success");
                    });
                }}
            />);
        let addUrlDom = ReactDOM.findDOMNode(addURLComponentTest);
        TestUtils.Simulate.click(addUrlDom.querySelector("#addNewUrlButton"));
        setTimeout(() => {
            assert.isDefined(addURLComponentTest.refs.addUrlTextBox, "Defined");
            done();
        }, 0);
    });

    it("should display example message on clicking addUrlButton", () => {
        let addUrlDom = ReactDOM.findDOMNode(AddURLComponentElement);
        TestUtils.Simulate.click(addUrlDom.querySelector("#addNewUrlButton"));
        assert.isDefined(AddURLComponentElement.refs.exampleText);
        expect("Please enter RSS URL here").to.eq(AddURLComponentElement.props.hintMessage);
        expect("Example: thehindu.com/opinion/?service=rss").to.eq(AddURLComponentElement.props.exampleMessage);
    });

});
