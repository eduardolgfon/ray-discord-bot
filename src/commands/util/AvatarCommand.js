const { MessageEmbed } = require('discord.js')
const Structure = require("../../components/structures")
module.exports = class AvatarCommand extends Structure {
	constructor(ray) {
		super(ray, {
			name: "avatar",
			multiLanguageName: false,
			aliases: ["icon"],
			category: "util",
			cooldown: 3,
			dm: true,
			workInThreads: true,
			Memberperm: [],
			Rayperm: ["EMBED_LINKS"],
			dev: false,
			testCommand: ['{@user}']
		})
	}
	async execute({ message, args, user }, t) {
		var member = await this.findUser(message, args)
		var png = member.displayAvatarURL({ format: "png", dynamic: true, size: 2048 })
		var jpg = member.displayAvatarURL({ format: "jpg", dynamic: true, size: 2048 })
		var gif = member.displayAvatarURL({ format: "gif", dynamic: true, size: 2048 })
		var webp = member.displayAvatarURL({ format: "webp", dynamic: true, size: 2048 })
		const embed = new MessageEmbed()
			.setColor(this.ray.colors.yellow)
			.setTitle(t("commands:avatar.title", { member: member.username }))
			.setDescription(t("commands:avatar.download", { png: png, jpg: jpg, gif: gif, webp: webp }))
			.setImage(png)
			.setFooter(t("events:footer.f4", { prefix: user.prefix }), message.author.displayAvatarURL({ format: 'jpg', dynamic: true }))
		if (member.id == this.ray.user.id) embed.setDescription(t("commands:avatar.download", { png: png, jpg: jpg, gif: gif, webp: webp }) + t("commands:avatar.ray"))
		if (args[1] && ['light', 'leve', 'l'].includes(args[0].toLowerCase())) {
			var member = await this.findUser(message, args, 1)
			embed.setTitle(t("commands:avatar.title", { member: member.username }) + t("commands:avatar.light"))
			embed.setImage(member.displayAvatarURL({ format: "jpg", size: 256 }))
		}
		message.reply({ embeds: [embed] })
	}
}