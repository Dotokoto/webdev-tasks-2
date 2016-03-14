'use strict';

var multivarka = require('./multivarka.js');

var petr = {
    name: 'Петр',
    group: 'ПИ-302',
    grade: 4
};

var nat = {
    name: 'Наталья',
    group: 'КБ-401',
    grade: 5
};
var vas = {
    name: 'Василий',
    group: 'КБ-401',
    grade: 5
};
var alex = {
    name: 'Александр',
    group: 'КН-401'
};
var daria = {
    name: 'Даша',
    group: 'ПИ-401'
};

var insertCb = function (err, res) {
    if (err) {
        console.log(err);
    }
};

multivarka
    .server('mongodb://localhost/test')
    .collection('students')
    .insert(petr, insertCb)
    .insert(nat, insertCb)
    .insert(vas, insertCb)
    .insert(alex, insertCb)
    .insert(daria, insertCb);

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

multivarka
    .where('grade').greatThan(4)
    .find(function (err, data) {
        if (!err) {
            console.log(data);
        } else {
            console.log(err);
        }
    });

multivarka
    .where('group').equal('ПИ-401')
    .find(function (err) {
        if (err) {
            console.log(err);
        }
    })
    .set('group', 'КБ-401')
    .update(function (err) {
        if (err) {
            console.log(err);
        }
    })
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
    .remove(function (err) {
        if (!err) {
            console.log('removed all students');
        } else {
            console.log(err);
        }
    });

