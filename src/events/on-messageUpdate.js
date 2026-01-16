module.exports = class MessageUpdate {
	constructor(ray) {
		this.ray = ray
	}
	async start(oldMessage, newMessage) {
		if (oldMessage.content === newMessage.content && !newMessage.editedTimestamp) return;
		this.ray.emit("messageCreate", newMessage)
	}
}