const Structure = require("../../components/structures")
module.exports = class PingCommand extends Structure {
	constructor(ray) {
		super(ray, {
			name: "ping",
			multiLanguageName: false,
			aliases: ["latencia"],
			category: "config",
			cooldown: 3,
			dm: true,
			workInThreads: true,
			Memberperm: [],
			Rayperm: [],
			dev: false,
			testCommand: []
		})
	}
	async execute({ message }, t) {
		var time = Date.now()
		let msg = await message.channel.send({ content: t("commands:ping.title", { carregando: this.ray.emotes.carregando, carregando2: this.ray.emotes.carregando2 }) })
		var time2 = Date.now()
		msg.edit(`**<:pingu:795978964433895474> PING (UIM) <:pingu:795978964433895474>\n\`\`\`diff\n- ${time2 - time} ms -\`\`\`${this.ray.emotes.discordjs} API:\`\`\`fix\n[${Math.round(this.ray.ws.ping)} ms]\`\`\`**`).catch(e => {})
	}
	async slash({ interaction }, t) {
		var time = Date.now()
		await interaction.reply({ content: t("commands:ping.title", { carregando: this.ray.emotes.carregando, carregando2: this.ray.emotes.carregando2 }) })
		var time2 = Date.now()
		interaction.editReply(`**<:pingu:795978964433895474> PING (UIM) <:pingu:795978964433895474>\n\`\`\`diff\n- ${time2 - time} ms -\`\`\`${this.ray.emotes.discordjs} API:\`\`\`fix\n[${Math.round(this.ray.ws.ping)} ms]\`\`\`**`).catch(e => {})

	}
}