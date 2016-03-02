'use strict';
var MongoClient = require('mongodb').MongoClient;

module.exports = {
    server: function (url) {
        this.url = url;
        return this;
    },

    collection: function (collection) {
        this.col = collection;
        return this;
    },

    where: function (field) {
        this.field = field;
        this.expression = {};
        this.reverse = false;
        return this;
    },

    greatThan: function (number) {
        if (!this.reverse) {
            this.expression[this.field] = {$gt: number};
        } else {
            this.expression[this.field] = {$lt: number};
        }
        return this;
    },

    lessThan: function (number) {
        this.not();
        this.greatThan(number);
        this.not();
        return this;
    },

    equal: function (string) {
        if (!this.reverse) {
            this.expression[this.field] = {$eq: string};
        } else {
            this.expression[this.field] = {$not: {$eq: string}};
        }
        return this;
    },

    not: function () {
        this.reverse = !this.reverse;
        return this;
    },

    include: function (array) {
        if (!this.reverse) {
            this.expression[this.field] = {$in: array};
        } else {
            this.expression[this.field] = {$not: {$in: array}};
        }
        return this;
    },

    find: function (callback) {
        if (!this.url) {
            callback('no server');
            return;
        }
        if (!this.col) {
            callback('no collection');
            return;
        }
        if (!this.expression) {
            this.expression = {};
        }
        var collection = this.col;
        var expression = this.expression;
        MongoClient.connect(this.url, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(expression);
            var col = db.collection(collection);
            col.find(expression).toArray(function (err, res) {
                callback(err, res);
                db.close();
            });
        });
    }
};
