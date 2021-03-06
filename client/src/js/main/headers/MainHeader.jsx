/* eslint no-unused-vars:0*/
"use strict";
import Logo from "../../utils/components/Logo.jsx";
import MainHeaderTab from "../../utils/components/TabComponent/MainHeaderTab.jsx";
//import Logout from "../../login/components/Logout.jsx";
import React, { Component, PropTypes } from "react";
import { Route, Link } from "react-router";
import UserProfileSettings from "../../user/UserProfileSettings.jsx";


export default class MainHeader extends Component {
    render() {
        return (
            <header>
                <div className="fixed-header clear-fix multi-column">
                    <Logo ref="logo"/>

                    <div className="user-info right" id="logout">
                        <UserProfileSettings />
                    </div>


                    <div className="flexible t-center">
                        <ul className="menu-list">
                            <MainHeaderTab name={this.props.headerStrings.configTab.Name} url="/configure/categories" tabToHighlight={this.props.highlightedTab} parkCounter={this.props.parkCounter} className="configure" id="configureLink" />
                            <MainHeaderTab name={this.props.headerStrings.surfTab.Name} url="/surf" tabToHighlight={this.props.highlightedTab} parkCounter={this.props.parkCounter} className="surf" id="surfLink" />
                            <MainHeaderTab name={this.props.headerStrings.parkTab.Name} url="/park" tabToHighlight={this.props.highlightedTab} parkCounter={this.props.parkCounter} className="park" id="parkLink" />
                        </ul>
                    </div>
                </div>
            </header>
        );
    }
}
//<UserProfile ref="logout" logoutButton={this.props.headerStrings.logoutButton}/>

MainHeader.displayName = "Main Header";
MainHeader.propTypes = {
    "headerStrings": PropTypes.object.isRequired,
    "highlightedTab": PropTypes.object.isRequired,
    "parkCounter": PropTypes.number.isRequired
};
