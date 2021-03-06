"use strict";
import { applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { expect } from "chai";
const middlewares = [thunk];

export default function mockStore(getState, expectedActions, done, verify = function() {}) {
    if (!Array.isArray(expectedActions)) {
        throw new Error("expectedActions should be an array of expected actions.");
    }
    if (typeof done !== "undefined" && typeof done !== "function") {
        throw new Error("done should either be undefined or function.");
    }

    function mockStoreWithoutMiddleware() {
        return {
            getState() {
                return typeof getState === "function" ? getState() : getState;
            },

            dispatch(action) {
                const expectedAction = expectedActions.shift();

                try {
                    expect(action).to.deep.equal(expectedAction);
                    if (done && !expectedActions.length) {
                        verify();
                        done();
                    }
                    return action;
                } catch (error) {
                    done(error);
                }
            }
        };
    }

    const mockStoreWithMiddleware = applyMiddleware(
        ...middlewares
    )(mockStoreWithoutMiddleware);

    return mockStoreWithMiddleware();
}
