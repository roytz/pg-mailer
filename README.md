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

pg-mailer is a "batteries included" mailer written in Node.js. It uses [pg-boss](https://github.com/timgit/pg-boss) to manage a queue (stored in PostgreSQL DB) of emails (jobs) that are waiting to be sent and then send them using [nodemailer](https://github.com/nodemailer/nodemailer).

If that's all you need, just init it using your custom configurations just like the example above.

For more examples/options of postgres connection (1st parameter passed to pg-mailer constructor), please see [this](https://github.com/timgit/pg-boss/blob/master/docs/usage.md#newconnectionstring) configurations page.

For more examples/options of transporter configurations (2nd parameter passed to pg-mailer constructor), please see [this](https://nodemailer.com/smtp/#examples) configurations page.

## Basic Usage Functions

### `start(shouldClearQueue)`

**Arguments**
- `shouldClearQueue`: bool

**returns: Promise** *(resolves the same PgMailer instance used during invocation for convenience)*

Init and start the engine using the configurations passed on the constructor. If you'd like to clear previous uncompleted emails on queue, just pass `true` (shouldClearQueue) to the `start` function.

```js
pgMailer.start();
```

### `setQueueOptions(options)`

**Arguments**
- `options`: object

Set the queue options. For the complete options list visit [this](https://github.com/timgit/pg-boss/blob/master/docs/configuration.md#publish-options) link.

```js
const options = {
	retryLimit: 3,
	startIn: 30
};
pgMailer.setQueueOptions(options);
```

### `enqueue(email, additionalDetails)`

**Arguments**
- `email`: object, email to be sent - follow [this](https://nodemailer.com/message/#commmon-fields) options
- `additionalDetails`: object, additional details that will be passed to the events-driven functions

**returns: Promise** *(resolves an object containing `jobId` which is a unique identifier for the job in the queue and `onAfterQueueResult` which is the returend value of the [`onAfterQueue`]() function)*

Enqueue the `email` and return a unique id of it in the queue. The `additionalDetails` object will be passed to the [Optional Events-Driven Functions]().

```js
const options = {
	retryLimit: 3,
	startIn: 30
};
pgMailer.setQueueOptions(options);
```

### `clearQueue()`

**returns: Promise** *(resolves the number of uncompleted jobs/emails that were cancelled)*

Cancel all uncompleted emails in queue.

```js
pgMailer.clearQueue();
```

### `stop()`

Asynchronous function that stops the PgMailer instance from working on active queue. Doesn't clear the queue!

```js
pgMailer.stop();
```

## Optional Events-Driven Functions

### `setOnBeforeQueue(email, additionalDetails)`

Set a function that will be automatically executes right before enqueuing a new email.

This function gets the `email` and `additionalDetails` (as 1st and 2nd arguments) arguments that were passed to the [`enqueue`]() function.

```js
pgMailer.setQueueOptions(function(email, additionalDetails) {
	// do something
});
```

### `setOnAfterQueue(jobId, email, additionalDetails, onBeforeQueueResult)`

Set a function that will be automatically executes right after enqueuing a new email.

This function gets `jobId` (as 1st argument) which is the unique id of the email in the queue, the `email` and `additionalDetails` (as 1st and 2nd arguments) arguments that were passed to the [`enqueue`]() function.

```js
pgMailer.setQueueOptions(function(email, additionalDetails) {
	// do something
});
```

### `setOnBeforeQueue(email, additionalDetails)`

Set a function that will be automatically called right before enqueuing a new email.

This function gets the `email` and `additionalDetails` (as 1st and 2nd arguments) arguments that were passed to the [`enqueue`]() function.

```js
pgMailer.setQueueOptions(function(email, additionalDetails) {
	// do something
});
```

### `setOnBeforeQueue(email, additionalDetails)`

Set a function that will be automatically called right before enqueuing a new email.

This function gets the `email` and `additionalDetails` (as 1st and 2nd arguments) arguments that were passed to the [`enqueue`]() function.

```js
pgMailer.setQueueOptions(function(email, additionalDetails) {
	// do something
});
```
