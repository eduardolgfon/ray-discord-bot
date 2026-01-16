module.exports = class EventHandler {
	constructor(ray) {
		this.ray = ray
		this.events = []
	}

	add(eventName, moduleName, data, dir) {
		this.ray.on(eventName, (...args) => this.executeEvent({ moduleName, args, data }))

		this.events.push({ name: eventName, module: moduleName, dir: dir })
	}
	executeEvent({ moduleName, args, data }) {
		this.events.filter(evento => evento.module === moduleName).map((event) => {
			// delete require.cache[require.resolve(event.dir)]
			new (require(event.dir))(data).start(...args)
		})
	}
	remove(moduleName) {
		if (!this.events.filter(evento => evento.module === moduleName)[0]) return false
		delete this.events[this.events.findIndex(event => event.module === moduleName)]
		return true
	}
}