'use strict';
const MongoClient = require('mongodb').MongoClient;
const Collection = require('mongodb').Collection;
const Promise = require('bluebird');
Promise.promisifyAll(MongoClient);
Promise.promisifyAll(Collection.prototype);

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
        this.__expression = {};
        this.__reverse = false;
        this.__setExpression = {};
        return this;
    },

    greatThan: function (number) {
        this.__expression[this.field] = !this.__reverse ? {$gt: number} : {$lt: number};
        return this;
    },

    lessThan: function (number) {
        this.__expression[this.field] = !this.__reverse ? {$lt: number} : {$gt: number};
        return this;
    },

    equal: function (string) {
        this.__expression[this.field] = !this.__reverse ? {$eq: string} : {$not: {$eq: string}};
        return this;
    },

    not: function () {
        this.__reverse = !this.__reverse;
        return this;
    },

    include: function (array) {
        this.__expression[this.field] = !this.__reverse ? {$in: array} : {$not: {$in: array}};
        return this;
    },

    find: function (callback) {
        if (!this.__checkParams(callback)) {
            return this;
        }
        if (!this.__expression) {
            this.__expression = {};
        }
        this.__mongoRequest('find', {
            url: this.url,
            col: this.col,
            expression: this.__expression
        }, callback);
        return this;
    },

    insert: function (obj, callback) {
        if (!this.__checkParams(callback)) {
            return this;
        }
        if (!obj) {
            callback('no object');
            return this;
        }
        this.__mongoRequest('insert', {
            url: this.url,
            col: this.col,
            expression: this.__expression,
            object: obj
        }, callback);
        return this;
    },

    remove: function (callback) {
        this.__mongoRequest('remove', {
            url: this.url,
            col: this.col,
            expression: this.__expression
        }, callback);
        return this;
    },

    set: function (field, value) {
        this.__setExpression['$set'] = {};
        this.__setExpression['$set'][field] = value;
        return this;
    },

    update: function (callback) {
        this.__mongoRequest('update', {
                url: this.url,
                col: this.col,
                expression: this.__expression,
                setExpression: this.__setExpression
            },
            callback);
        return this;
    },

    __checkParams: function (callback) {
        if (!this.url) {
            callback('no server');
            return false;
        }
        if (!this.col) {
            callback('no collection');
            return false;
        }
        return true;
    },

    __mongoRequest: function (type, params, callback) {
        if (!this.__checkParams(callback)) {
            return this;
        }
        var database;
        MongoClient.connectAsync(params.url)
            .then(function (db) {
                database = db;
                var col = db.collection(params.col);
                switch (type) {
                    case 'find':
                        return col.find(params.expression).toArray();
                        break;
                    case 'insert':
                        return col.insertOne(params.object);
                        break;
                    case 'remove':
                        return col.deleteMany({});
                        break;
                    case 'update':
                        return col.updateMany(params.expression, params.setExpression);
                        break;
                }
            })
            .then(function (data) {
                database.close();
                callback(null, data);
            })
            .catch(function (error) {
                console.log(error);
                database.close();
                callback(error);
            });
        return this;
    }
};

