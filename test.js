'use strict';

var multivarka = require('./multivarka.js');

multivarka
    .server('mongodb://localhost/test')
    .collection('students')
    .where('group').equal('КБ-401')
    .find(function (err, data) {
        if (!err) {
            console.log(data);
        } else {
            console.log(err);
        }
    });

multivarka
    .server('mongodb://localhost/test')
    .collection('students')
    .where('group').include(['ПИ-401', 'КН-401'])
    .find(function (err, data) {
        if (!err) {
            console.log(data);
        } else {
            console.log(err);
        }
    });

multivarka
    .where('mark').greatThan(1)
.find(function (err, data) {
        if (!err) {
            console.log(data);
        } else {
            console.log(err);
        }
    });
