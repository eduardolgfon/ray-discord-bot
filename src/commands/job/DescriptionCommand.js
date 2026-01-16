const Structure = require("../../components/structures")
module.exports = class DescriptionCommand extends Structure {
	constructor(ray) {
		super(ray, {
			name: "description",
			multiLanguageName: true,
			aliases: ["descricao", "descripción", 'desc',],
			category: "social",
			cooldown: 3,
			dm: true,
			workInThreads: true,
			Memberperm: [],
			Rayperm: [],
			dev: false,
			testCommand: ['quem leu me deu kapa kapa kapa']
		})
	}
	async execute({ message, args, user, db, noargs }, t) {
		if (!args[0]) return message.reply({ embeds: [noargs] })
		await db.query(`update users set description = '${args.join(" ").slice(0, 100).replace(new RegExp(`'`, "''"), 'ray')}' where id = '${message.author.id}'`)
		message.reply({
			embeds: [{
				color: this.ray.colors.yellow,
				title: t("commands:description.title") + this.ray.emotes.autorizado,
				description: t("commands:description.desc", { desc: args.join(" ").slice(0, 100) }),
				footer: {
					text: t("events:footer.f1", { prefix: user.prefix }),
					icon_url: message.author.displayAvatarURL({ format: 'jpg' })
				}
			}]
		})
	}
}