/* eslint consistent-this:0*/
"use strict";

import RssRequestHandler from "../../rss/RssRequestHandler";
import Route from "./Route.js";
import RouteLogger from "../RouteLogger.js";

export default class RssBatchFeedsRoute extends Route {
    constructor(request, response, next) {
        super(request, response, next);
    }

    handle() {
        if(this.isValidRequestData()) {
            let allFeeds = {};
            let rssRequestHandler = RssRequestHandler.instance();
            let counter = 0;
            this.request.body.data.forEach((item)=> {
                rssRequestHandler.fetchRssFeedRequest(item.url).then(feeds => {
                    allFeeds[item.id] = feeds;
                    if (this.request.body.data.length - 1 === counter) {
                        RouteLogger.instance().debug("RssBatchFeedsRoute:: successfully fetched rss feeds for url %s.", item.url);
                        this._handleSuccess(allFeeds);
                    }
                    counter += 1;
                }).catch(() => {
                    allFeeds[item.id] = "failed";
                    if (this.request.body.data.length - 1 === counter) {
                        RouteLogger.instance().debug("RssBatchFeedsRoute:: fetching rss feeds for url %s returned no feeds.", item.url);
                        this._handleSuccess(allFeeds);
                    }
                    counter += 1;
                });
            });
        } else {
            this._handleInvalidRoute();
        }
    }
}
