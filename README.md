# pg-mailer

[![npm version](https://badge.fury.io/js/pg-mailer.svg)](https://badge.fury.io/js/pg-mailer)
[![Build Status](https://travis-ci.org/roytz/pg-mailer.svg?branch=master)](https://travis-ci.org/roytz/pg-mailer)
[![Dependencies](https://david-dm.org/roytz/pg-mailer.svg)](https://david-dm.org/roytz/pg-mailer)

Sending email using queue stored on postgreSQL (using [pg-boss](https://github.com/timgit/pg-boss) and [nodemailer](https://github.com/nodemailer/nodemailer))

```js
const PgMailer = require('pg-mailer');

const pgConnection = 'postgres://user:pass@host/database';
const transporterConfiguration = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'username'
            pass: 'password'
};

const mailer = new PgMailer(transporterConfiguration, pgConnection);
```
