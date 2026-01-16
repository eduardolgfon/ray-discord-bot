const structure = require("../../components/structures")
const moment = require("moment")
const Topgg = require('@top-gg/sdk')
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const { tz } = require('moment-timezone')

module.exports = class DailyCommand extends structure {
	constructor(ray) {
		super(ray, {
			name: "daily",
			multiLanguageName: true,
			aliases: ["diario", "diario", "bolsafamilia", "adotar",],
			category: "social",
			cooldown: 3,
			dm: true,
			workInThreads: true,
			Memberperm: [],
			Rayperm: [],
			dev: false,
			testCommand: []
		})
	}
	async execute({ message, db, query, user }, t) {
		let ray = this.ray
		let guild = this.ray.guilds.cache.get('810125751441162240')
		var dbl = new Topgg.Api(this.ray.config.DBL_TOKEN)

		const embed = new MessageEmbed()
			.setColor(this.ray.colors.red)
			.setThumbnail('https://cdn.discordapp.com/attachments/788376558271201290/846554284916473856/sobrecargadecats.png')
			.setTitle(t("commands:daily.giveTitle"))
			.setDescription(this.ray.emotes.negado + t("commands:daily.giveDesc", {
				time: (parseInt(user.timedaily - Date.now()) > 3600000) ? moment.duration(parseInt(parseInt(user.timedaily) - Date.now())).format(" dd[d] hh[h] mm[m] ss[s]") : moment.duration(parseInt(parseInt(user.timedaily) - Date.now())).format(" dd[d] hh[h] mm[m] ss[s]"),
				sadcat1: this.ray.emotes.sadcat1, support: this.ray.config.SUPPORT_SERVER
			}))
			.setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ format: 'jpg', dynamic: true }))
		dbl.hasVoted(message.author.id)
			.then(async (hasVoted) => {if(message.author.bot) return daily((Math.floor(Math.random() * (3072 - 1536 + 1)) + 1536));
				if (parseInt(user.timedaily) > Date.now()) return message.reply({ embeds: [embed] })
				if (hasVoted) return daily((Math.floor(Math.random() * (3072 - 1536 + 1)) + 1536))
				const niceBot = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('CLAIM_NOW')
							.setLabel(t("commands:daily.claim_now"))
							.setStyle('PRIMARY')
							.setEmoji('846538777854083133'),
						new MessageButton()
							.setLabel(t("commands:daily.click_vote"))
							.setStyle('LINK')
							.setURL('https://top.gg/bot/777938917117919255/vote')
					)
				var msg = await message.reply({
					embeds: [{
						color: this.ray.colors.hardblue,
						title: t("commands:daily.Title1") + this.ray.emotes.sadcat1,
						description: t("commands:daily.desc1", { url: 'https://top.gg/bot/777938917117919255/vote' })
					}], components: [niceBot]
				})
				const dailyCollector = await msg.createMessageComponentCollector({ filter: ((i) => i.user.id === message.author.id), time: 120000 })
				dailyCollector.on("collect", async (i) => {
					switch (i.customId) {
						case "CLAIM_NOW":
							dbl.hasVoted(message.author.id).then(async (hasVoted) => {
								msg.delete().catch(e => { });
								var user = await query(`select * from users where id = '${message.author.id}'`)
								if (parseInt(user.timedaily) > Date.now()) return message.reply({ embeds: [embed] })
								if (!hasVoted) daily((Math.floor(Math.random() * (1024 - 512 + 1)) + 512))
								else daily((Math.floor(Math.random() * (3072 - 1536 + 1)) + 1536))
							})
								.catch(e => daily((Math.floor(Math.random() * (3072 - 1536 + 1)) + 1536)))
							break
					}
				})
			})
			.catch(e => daily((Math.floor(Math.random() * (3072 - 1536 + 1)) + 1536)))
		async function daily(random) {
			await db.query(`update users set cats = cats + ${random} where id = '${message.author.id}'`)
			await ray.newTransation(message.author, `1/${random}/${Date.now()}`)

			if (await guild.members.fetch(message.author.id)) await db.query(`update users set timedaily = 43200000 + ${Date.now()} where id = '${message.author.id}'`)
			else await db.query(`update users set timedaily = 86400000 + ${Date.now()} where id = '${message.author.id}'`)
			var user = await query(`select * from users where id = '${message.author.id}'`)

			var remembermeButton = new MessageButton()
				.setCustomId('REMEMBER_ME')
				.setStyle('PRIMARY')
				.setEmoji('846810720150618202')
			var rememberMeEmbed = {
				color: ray.colors.green,
				thumbnail: { url: "https://cdn.discordapp.com/attachments/788376558271201290/846532258318909450/sad_cat_bongo.gif" },
				title: t("commands:daily.title") + ray.emotes.meow_blush,
				description: t("commands:daily.desc", {
					cats: parseInt(random).toLocaleString(user.lang),
					totalCats: parseInt(user.cats).toLocaleString(user.lang), sadcat1: ray.emotes.sadcat1, sadcat4: ray.emotes.sadcat4,
					sadcat5: ray.emotes.sadcat5, sadcat6: ray.emotes.sadcat6
				}),
				footer: {
					text: t("events:footer.f1", { prefix: user.prefix }),
					icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true })
				}
			}
			var rememberMe = new MessageActionRow().addComponents(remembermeButton)
			var confirm = await message.reply({ embeds: [rememberMeEmbed], components: [rememberMe] })
			const warnCollector = confirm.createMessageComponentCollector({ filter: ((i) => i.user.id === message.author.id), time: 120000 })
			warnCollector.on("collect", async (i) => {
				switch (i.customId) {
					case "REMEMBER_ME":
						if (await guild.members.fetch(message.author.id)) setTimeout(() => message.author.send(t("commands:daily.alert")).catch(e => { }), 43200000)
						else setTimeout(() => message.author.send(t("commands:daily.alert")).catch(e => { }), 86400000)
						await message.rayReply('autorizado', t("commands:daily.alertStart"))
						await remembermeButton.setDisabled(true)
						var rememberMe = new MessageActionRow().addComponents(remembermeButton)
						await i.deferUpdate().catch(e => { });
						confirm.edit({ embeds: [rememberMeEmbed], components: [rememberMe] })
						break
				}
			})
		}
	}
}