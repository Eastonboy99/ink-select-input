"use strict";
exports.__esModule = true;
var React = require("react");
var __1 = require("../");
var ink_1 = require("ink");
var App = function () {
    var handleSelect = function (item) {
        // `item` = { label: 'First', value: 'first' }
        console.log(item);
    };
    var items = [{
            label: 'First',
            value: 'first'
        }, {
            label: 'Second',
            value: 'second'
        }, {
            label: 'Third',
            value: 'third'
        }];
    return React.createElement(__1["default"], { items: items, onSelect: handleSelect });
};
ink_1.render(React.createElement(App));
