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

	async start(shouldClearQueue) {
		return this.mailer.start(shouldClearQueue);
	}

	async stop() {
		return this.mailer.stop();
	}

	async clearQueue() {
		return this.mailer.clearQueue();
	}

	setQueueOptions(options) {
		this.mailer.queueOptions = options;
	}

	setOnBeforeQueue(onBeforeQueue) {
		this.mailer.onBeforeQueue = onBeforeQueue;
	}

	setOnAfterQueue(onAfterQueue) {
		this.mailer.onAfterQueue = onAfterQueue;
	}

	setOnBeforeSend(onBeforeSend) {
		this.mailer.onBeforeSend = onBeforeSend;
	}

	setOnAfterSendSuccess(onAfterSendSuccess) {
		this.mailer.onAfterSendSuccess = onAfterSendSuccess;
	}

	setOnAfterSendFail(onAfterSendFail) {
		this.mailer.onAfterSendFail = onAfterSendFail;
	}

	async enqueue(email, additionalDetails) {
		return this.mailer.send(email, additionalDetails);
	}
}

module.exports = PgMailer;
