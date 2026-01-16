const Structure = require("../../components/structures")
const { MessageEmbed } = require('discord.js')
module.exports = class HelpCommand extends Structure {
	constructor(ray) {
		super(ray, {
			name: "help",
			multiLanguageName: true,
			aliases: ["ajuda", "ayuda", "?"],
			category: "config",
			cooldown: 3,
			dm: true,
			Memberperm: [],
			Rayperm: [],
			dev: false,
			testCommand: ['{@comando}']
		})
	}
	async execute({ message, args, user }, t) {
		if (args[0]) {
			const comando = this.ray.commands.get(args[0].normalize('NFD').replace(/[\u0300-\u036f]/g, "")) || this.ray.commands.get(this.ray.aliases.get(args[0].normalize('NFD').replace(/[\u0300-\u036f]/g, "")))
			if (!comando && args[0]) return message.errorEmbed(t("commands:help.args-null"))
			if (!comando.config.Memberperm[0]) var txt = t("events:permnull")
			else var txt = comando.config.Memberperm.map(value => t(`permissions:${value}`)).join(", ")
			var botPermissions = comando.config.Rayperm
			botPermissions.push('SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS', 'EMBED_LINKS')
			var txt2 = comando.config.Rayperm.map(value => t(`permissions:${value}`)).join(", ")

			const helpCommands = new MessageEmbed()
				.setColor(this.ray.colors.red)
				//		.setThumbnail(t("commands:helpc.thumb"))
				.setTitle(t("commands:helpc.title", { info: this.ray.emotes.info, name: comando.config.name }))
				.setDescription(t(`commands:${comando.config.name}:help`))
				.addField(t("commands:helpc.field", { autorizado: this.ray.emotes.autorizado }), `\`${user.prefix}${comando.config.name} ${t(`commands:${comando.config.name}.usage`, { prefix: user.prefix })}\``)
				.addField(t("commands:helpc.ex", { lampada: this.ray.emotes.lampada }), `\`${user.prefix}${comando.config.name} ${t(`commands:${comando.config.name}:ex`)}\``)
				.addField(t("commands:helpc.aliases", { info: this.ray.emotes.info }), '`' + comando.config.aliases.join(" ").replace(new RegExp(' ', 'g'), '\`, \`') + '`')
				.addField(t("commands:helpc.uperms", { martelo: ":name_badge:" }), "`" + txt + '`')
				.addField(t("commands:helpc.cperms", { martelo: this.ray.emotes.martelo }), "`" + txt2 + '`')
				.setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ format: 'jpg', dynamic: true, size: 32 }))
			if (comando.config.category === 'image' && t(`commands:${comando.config.name}.img`)) helpCommands.setImage(t(`commands:${comando.config.name}.img`))
			return message.reply({ embeds: [helpCommands] })
		} else {
			let ray = this.ray
			const embed = new MessageEmbed()
				.setColor(this.ray.colors.red)
				.setTitle(t("commands:help.title", { author: message.author.tag }))
				.setDescription(t("commands:help.desc", { ray: ray.user.username, /*clientUptime: moment.duration(ray.uptime).format("D[d], H[h], m[m], s[s]"), clientGuildSize: Number(guilds).toLocaleString(), clientUserSize: Number(users).toLocaleString()*/ }))
				.addField(t("commands:help.field1", { red_ruby: ray.emotes.red_ruby }), t("commands:help.field1b", { prefix: user.prefix, dev: ray.emotes.dev, comunism: ray.emotes.comunism, }))
				.addField(t("commands:help.field2", { red_ruby: ray.emotes.red_ruby }), t("commands:help.field2b", { invite: this.ray.config.BOT_INVITE }))
				.addField(t("commands:help.field3", { red_ruby: ray.emotes.red_ruby }), t("commands:help.field3b", { support: this.ray.config.SUPPORT_SERVER }))
				.setFooter(t("events:footer.f3", { ray: ray.user.tag, prefix: user.prefix }), message.author.displayAvatarURL({ format: "jpg", dynamic: true }))
			message.reply({ embeds: [embed] })
		}
	}
}