/* eslint max-len:0 no-unused-vars:0, react/no-set-state:0 */
"use strict";
import React, { Component, PropTypes } from "react";
import { addTwitterUrlAsync } from "../actions/CategoryActions.js";
import AddURLComponent from "../../utils/components/AddURLComponent.js";
import TwitterLogin from "../../twitter/TwitterLogin.js";
import Toast from "../../utils/custom_templates/Toast.js";

export const twRegexHandler = (/[@][a-zA-Z0-9_]{1,15}$/);
export const twRegexHashtag = /[#][a-zA-Z][a-zA-Z0-9_]{1,140}$/;
export default class TwitterComponent extends Component {

    constructor(props) {
        super(props);
        this.state = { "exampleMessage": this.props.categoryDetailsPageStrings.exampleMessages.TwitterExampleURL, "errorMessage": "", "hintMessage": this.props.categoryDetailsPageStrings.hintMessages.TwitterHintMessage };
        this.twitterLoginHandler = this.twitterLoginHandler.bind(this);
        TwitterLogin.getInstance().then(instance => {
            this.twitterLogin = instance;
        });
    }

    _validateUrl(url, callback, props) {
        if(!url) {
            return callback({ "error": this.props.categoryDetailsPageStrings.errorMessages.emptyUrl });
        }
        if(url.match(twRegexHandler) || url.match(twRegexHashtag)) {
            props.dispatch(addTwitterUrlAsync(props.categoryId, url, (response)=> {
                let urlStatus = response === "invalid" ? this.props.categoryDetailsPageStrings.errorMessages.noSuchTag : this.props.categoryDetailsPageStrings.successMessages.urlSuccess;
                if(response !== "invalid") {
                    Toast.show(`Twitter ${urlStatus}`);
                }
                return callback({ "error": urlStatus, "urlAdded": response === "valid" });
            }));
        } else {
            return callback({ "error": this.props.categoryDetailsPageStrings.errorMessages.invalidTwitterUrl });

        }
    }

    twitterLoginHandler() {
        return new Promise((resolve) => {
            this.twitterLogin.login().then(() => {
                resolve(true);
            });
        });
    }

    render() {
        return (
            <AddURLComponent exampleMessage = {this.state.exampleMessage} hintMessage = {this.state.hintMessage} dispatch = {this.props.dispatch} categoryId = {this.props.categoryId} content={this.props.content}
                categoryDetailsPageStrings={this.props.categoryDetailsPageStrings} addUrlLinkLabel={this.props.categoryDetailsPageStrings.addTwitterUrlLinkLabel}
                errorMessage={this.state.errorMessage} sourceDomainValidation={(url, callback) => this._validateUrl(url, callback, this.props)}
                noValidation addURLHandler= {this.twitterLoginHandler}
            />
        );
    }
}

TwitterComponent.displayName = "TwitterComponent";
TwitterComponent.propTypes = {
    "content": PropTypes.array.isRequired,
    "content.details": PropTypes.array,
    "categoryDetailsPageStrings": PropTypes.object.isRequired,
    "categoryId": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired
};

