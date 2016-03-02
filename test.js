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
    .server('mongodb://localhost/test')
    .collection('students')
    .where('group').not().include(['ПИ-401'])
    .find(function (err, data) {
        if (!err) {
            console.log(data);
        } else {
            console.log(err);
        }
    });


var petr = {
    name: 'Петр',
    group: 'ПИ-302',
    grade: 5
};

multivarka
    .insert(petr, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });


multivarka
    .where('grade').greatThan(1)
    .find(function (err, data) {
        if (!err) {
            console.log(data);
        } else {
            console.log(err);
        }
    });
