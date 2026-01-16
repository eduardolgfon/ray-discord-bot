const Structure = require("../../components/structures")
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
module.exports = class LanguageCommand extends Structure {
	constructor(ray) {
		super(ray, {
			name: "language",
			multiLanguageName: true,
			aliases: ["idioma", "idioma", "lang"],
			category: "config",
			cooldown: 7,
			dm: true,
			workInThreads: true,
			Memberperm: [],
			Rayperm: [],
			dev: false,
			testCommand: []
		})
	}
	async execute({ message, db, user }, t) {
		const embed = new MessageEmbed()
			.setThumbnail('https://media.discordapp.net/attachments/788376558271201290/805869783349592064/OLQhROwAbtg6qiUTIXaBZ-uk7meyp4liWIg7TstCAtUd5NQNMvBaKOsH9DKTDSmVFW1ENicyQo_ZJn70JrrsGASB56RFs0_LgYRD.png')
			.setColor(this.ray.colors.hardgreen)
			.setTitle(t("commands:language.title"))
			.setDescription(t("commands:language.desc", { lang: user.lang }))
			.setFooter(t("commands:language.footer"), message.author.displayAvatarURL({ format: 'jpg', dynamic: true, size: 32 }))
		switch (user.lang) {
			case 'pt-BR':
				embed.setThumbnail("https://media.discordapp.net/attachments/788376558271201290/816182444448546816/imagem.png")
				embed.setColor(this.ray.colors.hardgreen)
				break
			case 'en-US':
				embed.setThumbnail('https://media.discordapp.net/attachments/788376558271201290/816182713031065610/imagem.png')
				embed.setColor(this.ray.colors.hardblue)
				break
			case "es-ES":
				embed.setThumbnail("https://media.discordapp.net/attachments/788376558271201290/833920780945063986/es-ES.png")
				embed.setColor(this.ray.colors.orange)
				break
			default:
				embed.setThumbnail("https://media.discordapp.net/attachments/788376558271201290/816182444448546816/imagem.png")
				embed.setColor(this.ray.colors.hardgreen)
				break
		}
		var brButton;
		var usaButton;
		var esButton;
		let langRow = new MessageActionRow().addComponents(
			brButton = new MessageButton()
				.setCustomId("BR_BUTTON")
				.setLabel('Português - Brasil')
				.setStyle("SUCCESS")
				.setEmoji('🇧🇷'),
			usaButton = new MessageButton()
				.setCustomId("USA_BUTTON")
				.setLabel('English - USA')
				.setStyle("PRIMARY")
				.setEmoji('🇺🇸'),
			esButton = new MessageButton()
				.setCustomId("ES_BUTTON")
				.setLabel('Spanish - Spain')
				.setStyle("DANGER")
				.setEmoji('🇪🇸'),
		)
		var msg = await message.reply({ embeds: [embed], components: [langRow] })
		setTimeout(() => {
			brButton.setDisabled(true)
			usaButton.setDisabled(true)
			esButton.setDisabled(true)
			langRow = new MessageActionRow()
				.addComponents(brButton, usaButton, esButton);
			msg.edit({ embeds: [embed], components: [langRow] }).catch(e => { });
		}, 120000)
		const collector = msg.createMessageComponentCollector({ filter: ((i) => i.user.id === message.author.id), time: 120000 })
		collector.on("collect", async (i) => {
			switch (i.customId) {
				case "BR_BUTTON":
					await db.query(`update users set lang = 'pt-BR' where id = '${message.author.id}'`)
					msg.delete().catch(e => { })
					message.reply({ content: "Idioma alterado para `pt-BR` 🇧🇷" })
					break
				case "USA_BUTTON":
					await db.query(`update users set lang = 'en-US' where id = '${message.author.id}'`)
					msg.delete().catch(e => { })
					message.reply({ content: "Language changed to `en-US` 🇺🇸" })
					break
				case 'ES_BUTTON':
					await db.query(`update users set lang = 'es-ES' where id = '${message.author.id}'`)
					msg.delete().catch(e => { })
					message.reply({ content: "El idioma cambió a `es-ES` 🇪🇸" })
			}
		})
	}
}