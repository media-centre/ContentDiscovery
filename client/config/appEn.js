/*eslint no-multi-str:0*/
"use strict";
if(!window.mediaCenter) {
    window.mediaCenter = {};
}
window.mediaCenter.appEn = {
    "locales": ["en"],

    "messages": {
        "loginPage": {
            "login": {
                "loginButton": "Login",
                "userNamePlaceHoder": "username",
                "passwordPlaceHoder": "password",
                "loginHelpLabel": "Need help to login"

            },
            "branding": {
                "text": "MakeNews gives you an aggregate idea of the happenings in the world. \
                News from major news outlets and independent media, reports from press agencies, opinions, columns and articles from \
                favourite writers, as well as social media posts are seen in one space. \
                You identify your sources on the Web, Twitter and Facebook, MakeNews relays you updates. \
                You do not have to go to each and every source to seek updates. Nifty features like Park help you set aside interesting posts \
                from the rush of news items. You can also group your sources into Categories and get a taxonomically arranged view of updates. \
                MakeNews is aimed at independent journalists, reporters, editors and newsrooms. \
                It serves as a powerful journalistic tool that enables users get a broad view of the rapidly updating, \
                vast sea of current happenings on the web and social media."
            },
            "featuresHelp": {
                "configureHelp": {
                    "name": "Configure",
                    "text": "You identify your favourite RSS feeds, Twitter handles, Twitter hashtags and Facebook pages as sources. \
                    Group your sources into Categories and get a taxonomically arranged view of news updates."
                },
                "surfHelp": {
                    "name": "Surf",
                    "text": "MakeNews relays you updates from sources. You do not have to go to each and every source yourself to seek updates. \
                    You can scroll infinitely through regular updates from web, twitter and facebook sources that you have added using Configure. \
                    Click on an item and it opens up in a new tab."
                },
                "parkHelp": {
                    "name": "Park",
                    "text": "Set aside interesting posts from the rush of news items. Parked items can be considered later or unparked and \
                    moved back to Surf."
                }
            }
        },
        "configurePage": {
            "allCategories": {
                "allCategoriesHeading": "All Categories",
                "addNewCategoryLabel": "Add new category"
            },
            "categoryDetailsPage": {
                "allCategoriesLinkLabel": "All Categories",
                "deleteCategoryLinkLabel": "Delete Category",
                "addUrlLinkLabel": "Add URL",
                "categoryDeletionConfirm": "will be deleted and you will no longer receive feeds from its URLs. Parked items will remain unaffected. Are you sure you want to continue?",
                "deleteURLConfirm": "You will no longer receive feeds from this URL. Parked items will remain unaffected. Are you sure you want to continue?",
                "hintMessages": {
                    "RSSExampleURL": "Example: http://www.thehindu.com/opinion/?service=rss",
                    "TwitterExampleURL": "Example: @martinfowler, #savetheinternet",
                    "FacebookExampleURL": "Example: https://www.facebook.com/barackobama",
                    "categoryTitle": "Invalid category name. Use only space or - or _"
                },
                "successMessages": {
                    "categoryDeleteSuccess": "is successfully deleted",
                    "categoryUpdated": "Category name is updated to",
                    "urlDeleteSuccess": "Feed URL successfully deleted",
                    "urlSuccess": "URL is successfully added"
                },
                "errorMessages": {
                    "invalidUrlFormat": "Invalid URL. Please check the URL",
                    "emptyUrl": "URL cannot be empty",
                    "validatingUrl": "Validating the URL...",
                    "alreadyAdded": "URL is already added",
                    "noSuchUrl": "No such link found. Please add a valid URL",
                    "invalidRssUrl": "Invalid URL. Please check the URL",
                    "invalidTwitterUrl": "Invalid twitter handler/hashtag",
                    "invalidFacebookUrl": "Invalid facebook URL. Please check the URL",
                    "noFbAccess": "No such link or no access to the profile",
                    "urlDeleteFailed": "URL deletion failed",
                    "categoryNameExists": "Category name already exists",
                    "categoryNameCantBeEmpty": "Category name can not be empty"
                }
            },
            "configureTabName": "Configure"
        },
        "surfPage": {
            "noFeeds": "You don't have any feeds or no feeds for this filter",
            "fetchingFeeds": "Fetching more feeds for you...",
            "noMoreFeeds": "You have reached the end!! That's all we have",
            "feeds": {
                "parkedSuccess": "You have successfully parked the news item"
            }
        },
        "parkPage": {
            "noFeeds": "You don't have any parked items",
            "feeds": {
                "unParkedSuccess": "You have successfully unparked the news item",
                "deletedFeedConfirm": "This feed item will be permanently deleted. Do you want to continue?",
                "feedDeletionSuccess": "You have successfully deleted the news item"
            }
        },
        "headerStrings": {
            "surfTab": {
                "Name": "Surf"
            },
            "parkTab": {
                "Name": "Park"
            },
            "configTab": {
                "Name": "Configure"
            },
            "logoutButton": {
                "Name": "Logout"
            }
        }
    }
};
