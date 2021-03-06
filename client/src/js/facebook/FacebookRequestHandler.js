/* eslint no-unused-vars:0 */

"use strict";
import FacebookClient from "./FacebookClient.js";

export default class FacebookRequestHandler {

    static getPosts(nodeUrl) {
        return new Promise((resolve, reject) => {
            let facebookClient = FacebookClient.instance();
            facebookClient.fetchPosts(nodeUrl).then(originalFeeds => {
                resolve(originalFeeds.posts);
            }).catch(error => { // eslint-disable-line
                reject([]);
            });
        });
    }

    static setToken(accessToken) {
        let facebookClient = FacebookClient.instance(accessToken);
        facebookClient.setLongLivedToken();
    }

    static getBatchPosts(postData, skipSessionTimer) {
        return new Promise((resolve, reject)=> {
            let facebookClient = FacebookClient.instance();
            facebookClient.fetchBatchPosts(postData, skipSessionTimer).then(fbPostMap => {
                resolve(fbPostMap);
            }).catch(error => { // eslint-disable-line
                reject([]);
            });
        });
    }
}

