const _ = require('lodash');
const nodemailer = require('nodemailer');
const PgBoss = require('pg-boss');

class Mailer {
	constructor(transporter, pgConnection) {
		this.transporter = nodemailer.createTransport(transporter);
		this.boss = new PgBoss(pgConnection);
		this.enueueEmailJobName = 'enqueue-email';
		this.onBeforeQueue = () => null;
		this.onAfterQueue = () => null;
		this.onBeforeSend = () => null;
		this.onAfterSendSuccess = () => null;
		this.onAfterSendFail = () => null;
	}

	async start(shouldClearQueue) {
		await this.boss.start();
		if (shouldClearQueue) {
			await this.clearQueue();
		}
		this.boss.subscribe(this.enueueEmailJobName, this._send.bind(this));
		return this;
	}

	async send(email, additionalDetails) {
		const payload = {
			email,
			additionalDetails
		};
		const onBeforeQueueResult = await this.onBeforeQueue(email, additionalDetails);
		const jobId = await this.boss.publish(this.enueueEmailJobName, payload, this.queueOptions);
		const onAfterQueueResult = await this.onAfterQueue(jobId, email, additionalDetails, onBeforeQueueResult);
		return {
			jobId,
			onAfterQueueResult
		};
	}

	async _send({ id: jobId, data: { email, additionalDetails }, done }) {
		try {
			const onBeforeSendResult = await this.onBeforeSend(jobId, email, additionalDetails);

			// send mail with defined transport object
			const emailToSend = _.pick(email, ['from', 'to', 'cc', 'bcc', 'subject', 'text', 'html', 'attachments']);
			const res = await this.transporter.sendMail(emailToSend);

			if (_.size(res.rejected)) {
				await this.onAfterSendFail(jobId, res.rejected, additionalDetails, onBeforeSendResult);
				done('Failed');
				return;
			}

			await this.onAfterSendSuccess(jobId, res.accepted, additionalDetails, onBeforeSendResult);
			done();
		} catch (e) {
			done('Error', e);
		}
	}

	async stop() {
		return this.boss.stop();
	}

	// cancelUncompletedQueue
	async clearQueue() {
		const queue = await this.boss.fetch(this.enueueEmailJobName, 1000);
		if (_.size(queue) > 0) {
			await this.boss.cancel(_.map(queue, 'id'));
			if (_.size(queue) === 1000) {
				await this.clearQueue();
			}
		}
	}
}

module.exports = Mailer;
