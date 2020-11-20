module.exports = class Reconnecting {
	constructor(client) {
		this.client = client
	}

	run() {
		console.log("Reconnecting to Discord...")
	}
}