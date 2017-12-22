const Mailer = require('./mailer');

class PgMailer {
	constructor(transporterConfiguration, pgConnection) {
		if (!transporterConfiguration) {
			throw 'Missing nodemailer transporter configuration (as 1st argument)';
		}
		if (!pgConnection) {
			throw 'Missing postgreSQL connection configuration (as 2nd argument)';
		}
		this.mailer = new Mailer(transporterConfiguration, pgConnection);
	}

	async start() {
		return this.mailer.start();
	}

	async stop() {
		await this.mailer.stop();
	}

	setQueueOptions(options) {
		this.mailer.queueOptions = options;
	}

	// 'onBeforeQueue' receives
	// -- 1st and 2nd arguments: the email and additionalDetails passed to the 'enqueueEmail' function
	setOnBeforeQueue(onBeforeQueue) {
		this.mailer.onBeforeQueue = onBeforeQueue;
	}

	// 'onAfterQueue' receives
	// -- 1st argument: the job id of that queue job
	// -- 2nd and 3rd arguments: the email and additionalDetails passed to the 'enqueueEmail' function
	// -- 4th argument: the result of `onBeforeQueue` function
	setOnAfterQueue(onAfterQueue) {
		this.mailer.onAfterQueue = onAfterQueue;
	}

	// 'onBeforeSend' receives
	// -- 1st argument: the job id of that queue job
	// -- 2nd and 3rd arguments: the email and additionalDetails passed to the 'enqueueEmail' function
	setOnBeforeSend(onBeforeSend) {
		this.mailer.onBeforeSend = onBeforeSend;
	}

	// 'onAfterSendSuccess' receives
	// -- 1st argument: the job id of that queue job
	// -- 2nd argument: array of the successfull sent emails address
	// -- 3rd argument: the additionalDetails passed to the 'enqueueEmail' function
	// -- 4th argument: the result of `setOnBeforeSend` function
	setOnAfterSendSuccess(onAfterSendSuccess) {
		this.mailer.onAfterSendSuccess = onAfterSendSuccess;
	}

	// 'setOnAfterSendFail' receives
	// -- 1st argument: the job id of that queue job
	// -- 2nd argument: array of the failed sent emails address
	// -- 3rd argument: the additionalDetails passed to the 'enqueueEmail' function
	// -- 4th argument: the result of `setOnBeforeSend` function
	setOnAfterSendFail(onAfterSendFail) {
		this.mailer.onAfterSendFail = onAfterSendFail;
	}

	// returns an object with `jobId` (the enqueued email id) and `onAfterQueueResult` (the returned value of `onAfterQueue`)
	async enqueueEmail(email, additionalDetails) {
		return this.mailer.send(email, additionalDetails);
	}
}

module.exports = PgMailer;
