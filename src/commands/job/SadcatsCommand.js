const Structure = require("../../components/structures")
module.exports = class SadcatsCommand extends Structure {
	constructor(ray) {
		super(ray, {
			name: "sadcats",
			multiLanguageName: false,
			aliases: ["money", "atm", "cats"],
			category: "social",
			cooldown: 3,
			dm: true,
			workInThreads: true,
			Memberperm: [],
			Rayperm: [],
			dev: false,
			testCommand: ['{@user}']
		})
	}
	async execute({ message, query, args, user }, t) {
		const member = await this.findUser(message, args)
		var userdb = await query(`select cats from users where id = '${member.id}'`)
		if (!userdb) var cats = 0
		else var cats = userdb.cats
		message.reply({
			embeds: [{
				color: this.ray.colors.green,
				title: this.ray.emotes.sadcat4 + t("commands:sadcats.title") + this.ray.emotes.sadcat5,
				description: t("commands:sadcats.desc", {
					member: member.toString(),
					cats: parseInt(cats).toLocaleString(user.lang), sadcat1: this.ray.emotes.sadcat1,
					sadcat2: this.ray.emotes.sadcat2, sadcat6: this.ray.emotes.sadcat6,
				}),
				footer: {
					text: t("events:footer.f1", { prefix: user.prefix }),
					icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true })
				}
			}]
		})
	}
}
