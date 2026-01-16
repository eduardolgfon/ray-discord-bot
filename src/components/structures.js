module.exports = class Structure {
	constructor(ray, options) {
		this.config = {
			name: options.name || null,
			multiLanguageName: options.multiLanguageName || false,
			aliases: options.aliases || [],
			category: options.category || "util",
			cooldown: options.cooldown || 3,
			dm: options.dm || false,
			workInThreads: options.workInThreads || false,
			Memberperm: options.Memberperm || [],
			Rayperm: options.Rayperm || [],
			dev: options.dev || false,
			maintenance: options.maintenance || false,
			testCommand: options.testCommand || []
		}
		this.ray = ray
	}
	setT(t) {
		this.config.t = t
		this.ray.t = this.config.t
	}

	getT() {
		return this.config.t
	}
	getOption(message, yes = ["adicionar", "adc", "add", "insert"], no = ["remover", "remove", "delete", "deletar"]) {
		const cleanMessage = message.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
		if (yes.filter(a => a === cleanMessage)[0]) return "yes"
		if (no.filter(a => a === cleanMessage)[0]) return "no"
		return null
	}
	getEmoji(message, text) {
		return message.guild.emojis.cache.get((text.split(":")[2] || "").replace(">", "")) || message.guild.roles.cache.get(text) || message.guild.emojis.cache.find(a => a.name.toLowerCase() === text.toLowerCase()).first()
	}
	getRole(message, text, useMention = false) {
		if (message.mentions.roles.first() && text && useMention) return message.mentions.roles.first()
		else return message.guild.roles.cache.get(text) || message.guild.roles.cache.get(text.split("@&")[1].replace(">", "")) || message.guild.roles.cache.find(a => a.name.toLowerCase() === text.toLowerCase()).first()
	}
	getUser(message, text) {
		try {
			return message.mentions.members.first() || message.guild.members.cache.get(text[0]) || message.guild.members.cache.find(m => m.user.username.toLowerCase() === text.join(" ").toLowerCase() || m.displayName.toLowerCase() === text.join(" ").toLowerCase()) || this.ray.users.cache.size(text[0]) || message.member;
		} catch (e) {
			return message.member
		}
	}
	async findUser(message, text, argsPosition) {
		argsPosition = (!argsPosition ? 0 : Number(argsPosition))
		if (!Array.isArray(text)) var search = text
		else var search = text[argsPosition]

		if (!isNaN(Number(search))) {
			try {
				var user = this.ray.users.cache.get(search)
				if (!user) {
					var user = await this.ray.users.fetch(search)
					if (!user) var user = message.author
				}
			} catch (e) {
				var user = message.author
			}
		} else {
			try {
				var user = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase() === search[argsPosition].toLowerCase() || m.displayName.toLowerCase() === search[argsPosition].toLowerCase() || m.user.username.toLowerCase().startsWith(search[argsPosition].toLowerCase()) || m.displayName.toLowerCase().startsWith(search[argsPosition].toLowerCase()) || m.user.username.toLowerCase().includes(search[argsPosition].toLowerCase()) || m.displayName.toLowerCase().includes(search[argsPosition].toLowerCase()))
				user = user.user
				if (!this.ray.users.cache.has(user.id) || user.partial) this.findUser(message, user.id)
			} catch (e) {
				var user = message.author
			}
		}
		return user
	}
	async findChannel(text) {
		try {
			var channel = this.ray.channels.cache.get(text)
			if (!channel) channel = await this.ray.channels.fetch(text)
		} catch (e) {
			channel = null
		}
		return channel
	}
	async findImage(message) {
		var img;
		if (message.attachments.first()) img = message.attachments.first()
		else {
			if (message.channel.messages.cache.size < 25) var messages = await message.channel.messages.fetch({ limit: 25 })
			else var messages = message.channel.messages.cache

			img = messages.find(msg => msg.attachments.first()).attachments.first()
		}
		return img
	}
	async getGuildDB(data, id) {
		if (!await this.ray.db.query(`select ${data} from servers where id = '${id}'`)) return 0
		else {
			var value = await this.ray.db.query(`select ${data} from servers where id = '${id}'`);
			return value.rows[0]
		}
	}
	async getUserDB(data, id) {
		if (!await this.ray.db.query(`select ${data} from users where id = '${id}'`)) return 0
		else {
			var value = await this.ray.db.query(`select ${data} from users where id = '${id}'`);
			return value.rows[0]
		}
	}
}