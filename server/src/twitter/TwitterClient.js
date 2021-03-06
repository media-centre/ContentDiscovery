"use strict";
import ApplicationConfig from "../../src/config/ApplicationConfig.js";
import Logger from "../logging/Logger.js";
import AdminDbClient from "../db/AdminDbClient";
import TwitterLogin from "./TwitterLogin";

export const searchApi = "/search/tweets.json", userApi = "/statuses/user_timeline.json", searchParams = "filter:retweets", FEEDS_COUNT = 100;
const twitterTypes = { "TAG": "tag", "USER": "user" };
export default class TwitterClient {

    static logger() {
        return Logger.instance();
    }

    static instance() {
        return new TwitterClient();
    }

    fetchTweets(url, userName, timestamp) {
        let type = url.startsWith("#") || url.startsWith("%20") ? twitterTypes.TAG : twitterTypes.USER;
        let timestampQuery = timestamp ? encodeURIComponent(" since:") + this._getTwitterTimestampFormat(timestamp) : "";

        return new Promise((resolve, reject) => {
            this.getAccessTokenAndSecret(userName).then((tokenInfo) => {
                let [oauthAccessToken, oauthAccessTokenSecret] = tokenInfo;
                let oauth = TwitterLogin.createOAuthInstance();
                let searchUrl = type === twitterTypes.TAG ? `${this._baseUrl()}${searchApi}?q=${encodeURIComponent(url)}${timestampQuery}&count=${encodeURIComponent(FEEDS_COUNT + searchParams)}`
                    : `${this._baseUrl()}${userApi}?screen_name=${encodeURIComponent(url)}${timestampQuery}&count=${encodeURIComponent(FEEDS_COUNT + searchParams)}`;
                oauth.get(searchUrl, oauthAccessToken, oauthAccessTokenSecret, (error, data) => {
                    if(error) {
                        const errorInfo = JSON.stringify(error);
                        TwitterClient.logger().error("TwitterClient:: error fetching twitter feeds for %s.", url, errorInfo);
                        reject(errorInfo);
                    } else {
                        let tweetData = JSON.parse(data);
                        TwitterClient.logger().debug("TwitterClient:: successfully fetched twitter feeds for %s", url);
                        if(type === twitterTypes.USER) {
                            resolve({ "statuses": tweetData });
                        } else {
                            resolve(tweetData);
                        }
                    }
                });
            }).catch(error => {
                reject(error);
            });
        });
    }

    getAccessTokenAndSecret(userName) {
        return new Promise((resolve, reject) => {
            let tokenDocumentId = userName + "_twitterToken";
            const adminDetails = ApplicationConfig.instance().adminDetails();
            AdminDbClient.instance(adminDetails.username, adminDetails.password, adminDetails.db).then((dbInstance) => {
                dbInstance.getDocument(tokenDocumentId).then((fetchedDocument) => { //eslint-disable-line max-nested-callbacks
                    TwitterClient.logger().debug("TwitterClient:: successfully fetched twitter access token for user %s.", userName);
                    resolve([fetchedDocument.oauthAccessToken, fetchedDocument.oauthAccessTokenSecret]);
                }).catch(() => { //eslint-disable-line max-nested-callbacks
                    TwitterClient.logger().error("TwitterClient:: access token not found for user %s.", userName);
                    reject("Not authenticated with twitter");
                });
            });
        });
    }

    _baseUrl() {
        return ApplicationConfig.instance().twitter().url;
    }

    _getTwitterTimestampFormat(timestamp) {
        let dateObj = new Date(timestamp);
        return dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
    }
}
