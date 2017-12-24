# pg-mailer

[![npm version](https://badge.fury.io/js/pg-mailer.svg)](https://badge.fury.io/js/pg-mailer)
[![Build Status](https://travis-ci.org/roytz/pg-mailer.svg?branch=master)](https://travis-ci.org/roytz/pg-mailer)
[![Dependencies](https://david-dm.org/roytz/pg-mailer.svg)](https://david-dm.org/roytz/pg-mailer)

Manage emails queue stored on top of PostgreSQL and auto-send them using your own custom configurations.

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

const pgMailer = new PgMailer(transporterConfiguration, pgConnection);
```

pg-mailer is a "batteries included" mailer written in Node.js (using PostgreSQL). It uses [pg-boss](https://github.com/timgit/pg-boss) to manage a queue of emails (jobs) that are waiting to be sent and then send them using [nodemailer](https://github.com/nodemailer/nodemailer).

If that's all you need, just init it using your custom configurations just like the example above.

For more examples/options of postgres connection (1st parameter passed to pg-mailer constructor), please see [this](https://github.com/timgit/pg-boss/blob/master/docs/usage.md#newconnectionstring) configurations page.

For more examples/options of transporter configurations (2nd parameter passed to pg-mailer constructor), please see [this](https://nodemailer.com/smtp/#examples) configurations page.

## `start(shouldClearQueue)`

**returns: the current pg-mailer instance**

Init and start the engine using the configurations passed on the constructor. If you'd like to clear previous uncompleted emails on queue, just pass `true` (shouldClearQueue) to the `start` function.

```js
pgMailer.start();
```
