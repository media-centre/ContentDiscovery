/* eslint react/no-danger:0 max-len:0, no-set-state:0 */
"use strict";

import React, { Component, PropTypes } from "react";
import FeedHeader from "./FeedHeader.jsx";
import Spinner from "../../utils/components/Spinner.jsx";
import getHtmlContent from "../../utils/HtmContent.js";
import ConfirmPopup from "../../utils/components/ConfirmPopup/ConfirmPopup";
import Toast from "../../utils/custom_templates/Toast.js";

export default class ImageContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "showCustomPopup": false
        };
    }

    _onLoadImage(index) {
        let item = this.refs["gallery-item-" + index];
        item.querySelector("img").classList.remove("hide");
        const spinner = item.querySelector(".custom-spinner");
        if(spinner) {
            spinner.remove();
        }
    }

    _showConfirmPopup() {
        this.setState({ "showCustomPopup": true });
    }

    _parkFeed(feedDoc) {
        if(this.props.category.sourceId === "") {
            this._showConfirmPopup();
        } else {
            this.props.clickHandler(feedDoc);
            Toast.show(feedDoc.status === "park" ? this.props.appEnMessages.parkPage.feeds.unParkedSuccess : this.props.appEnMessages.surfPage.feeds.parkedSuccess);
        }
    }

    handleDeleteClick(event) {
        this.setState({ "showCustomPopup": false });
        if(event.OK) {
            this.props.clickHandler(this.props.category);
        }
    }

    render() {
        let header = this.props.category.feedType ? <FeedHeader actionComponent={this.props.actionComponent} feedAction={this._parkFeed.bind(this, this.props.category)} categoryNames={this.props.category.categoryNames} feedType={this.props.category.feedType} tags={this.props.category.tags} postedDate={this.props.category.postedDate} /> : null;
        let images = this.props.category.images.map((image, index)=>
            <li className="image-container box" ref={"gallery-item-" + index} key={index}>
                <img src={image.url} onLoad={() => this._onLoadImage(index)} onError={() => this._onLoadImage(index)} className="hide"/>
                <Spinner/>
            </li>
        );
        let confirmPopup = this.state.showCustomPopup ? <ConfirmPopup description={this.props.appEnMessages.parkPage.feeds.deletedFeedConfirm} callback={(event)=> this.handleDeleteClick(event)}/> : null;

        let description = this.props.category.content ? <p className="surf-description">{getHtmlContent(this.props.category.content)}</p> : null;
        return (
            <div className="image-gallery news-feed">
                <a target="_blank" rel="noopener noreferrer" href={this.props.category.link}>
                    <div className="title">{this.props.category.title}</div>
                    <ul className="gallery-list h-center">{images}</ul>
                    {description}
                </a>
                {header}
                {confirmPopup}
            </div>
        );
    }
}
ImageContent.displayName = "ImageContent";

ImageContent.propTypes = {
    "category": PropTypes.object,
    "dispatch": PropTypes.func.isRequired,
    "clickHandler": PropTypes.func,
    "actionComponent": PropTypes.func,
    "appEnMessages": PropTypes.object
};
