'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

var HTMLSelectHelper = function (element){
    this.__select = element;
};

HTMLSelectHelper.prototype = Object.create({}, {
        selectOptionByName: {
            value: function(optionName) {
                this.__select.all(by.tagName('option')).filter(function (elem, i) {
                    return elem.getText().then(function (text) {
                        return text == optionName;
                    })
                }).first().click();
            }
        }
    }
);

module.exports = HTMLSelectHelper;
