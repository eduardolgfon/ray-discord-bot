const Structure = require("../../components/structures")
module.exports = class PrefixCommand extends Structure {
	constructor(ray) {
		super(ray, {
			name: "prefix",
			multiLanguageName: true,
			aliases: ["prefixo", "prefijo", "setprefix"],
			category: "config",
			cooldown: 5,
			dm: true,
			workInThreads: true,
			Memberperm: [],
			Rayperm: [],
			dev: false,
			testCommand: ['cu!', 'r.']
		})
	}
	async execute({ message, args, db, noargs }, t) {
		if (!args[0]) return message.reply({ embeds: [noargs] })
		if (args[0].length > 3) return message.reply({ content: this.ray.emotes.negado + t("commands:prefix.limit") })
		var filtredText = args.join(" ").slice(0, 3).normalize('NFD').replace(/[\u0300-\u036f]/g, "")
		await db.query(`update users set prefix = '${filtredText}' where id = '${message.author.id}'`)

		message.reply({
			embeds: [{
				color: this.ray.colors.yellow,
				title: t("commands:prefix.autorizado", { autorizado: this.ray.emotes.autorizado }),
				description: t("commands:prefix.desc", { prefix: filtredText }),
				footer: {
					text: t("events:footer.f1", { prefix: filtredText }),
					icon_url: message.author.displayAvatarURL({ fomart: "png", dynamic: true })
				}
			}]
		})
	}
}