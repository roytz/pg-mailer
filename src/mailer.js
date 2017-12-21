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

	async start() {
		await this.boss.start();
		return this.boss.subscribe(this.enueueEmailJobName, this._send.bind(this));
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
		const onBeforeSendResult = await this.onBeforeSend(jobId, email, additionalDetails);

		// send mail with defined transport object
		const res = await this.transporter.sendMail(email);

		if (_.size(res.rejected)) {
			await this.onAfterSendFail(jobId, res.rejected, onBeforeSendResult);
			done('Failed');
			return;
		}

		await this.onAfterSendSuccess(jobId, res.accepted, onBeforeSendResult);
		done();
	}

	async stop() {
		return this.boss.stop();
	}

	async cancelUncompletedQueue() {
		const queue = await this.boss.fetch(this.enueueEmailJobName, 1000);
		await this.cancel.fail(_.map(queue, 'id'));
		if (_.size(queue) === 1000) {
			this.clearQueue();
		}
	}
}

module.exports = Mailer;
