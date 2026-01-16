const Structure = require("../../components/structures")
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js')
module.exports = class ConfigCommand extends Structure {
	constructor(ray) {
		super(ray, {
			name: "settings",
			multiLanguageName: true,
			aliases: ["configuracoes", "ajustes", "config"],
			category: "config",
			cooldown: 5,
			dm: true,
			workInThreads: true,
			Memberperm: [],
			Rayperm: [],
			dev: false,
			testCommand: [],
		})
	}
	async execute({ message, user, db }, t) {
		const ray = this.ray

		const confirm = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('YES_BUTTON')
					.setLabel(t("events:confirm.yes"))
					.setEmoji('785504007778336788')
					.setStyle('SUCCESS'),
				new MessageButton()
					.setCustomId('NO_BUTTON')
					.setLabel(t("events:confirm.no"))
					.setEmoji('847312373361541160')
					.setStyle('DANGER'),
			);
		const back = new MessageButton()
			.setCustomId("BACK_BUTTON")
			.setLabel(t("commands:settings.back"))
			.setStyle("SECONDARY")
			.setEmoji('◀️')
		var prefixButton;
		var langButton;
		var modButton;
		const replyButton = new MessageButton()
			.setCustomId('REPLY_BUTTON')
			.setLabel(t("commands:settings.reply"))
			.setEmoji('❤️')
			.setStyle('PRIMARY')

		if (message.channel.type === 'DM') replyButton.setDisabled(true)
		var options = new MessageActionRow()
			.addComponents(
				prefixButton = new MessageButton()
					.setCustomId('PREFIX_BUTTON')
					.setLabel(t("commands:settings.prefix"))
					.setEmoji('🛠️')
					.setStyle('DANGER'),
				langButton = new MessageButton()
					.setCustomId('LANG_BUTTON')
					.setLabel(t("commands:settings.lang"))
					.setEmoji('🌎')
					.setStyle('SUCCESS'),
				modButton = new MessageButton()
					.setCustomId('MOD_BUTTON')
					.setLabel("Moderation")
					.setEmoji('903600653492944896')
					.setStyle('SECONDARY'),
				replyButton
			);
		const embed = new MessageEmbed()
			.setColor(this.ray.colors.hardblue)
			.setTitle('🛠️ ' + t("commands:settings.settings") + ' 🛠️')
			.setDescription(t("commands:settings.desc"))
		const menu = new MessageEmbed()
			.setColor(this.ray.colors.hardblue)
			.setTitle('🛠️ ' + t("commands:settings.settings") + ' 🛠️')
			.setDescription(t("commands:settings.desc"))
		var msg = await message.reply({ embeds: [embed], components: [options] })
		setTimeout(() => {
			prefixButton.setDisabled(true)
			langButton.setDisabled(true)
			modButton.setDisabled(true)
			replyButton.setDisabled(true)
			options = new MessageActionRow()
				.addComponents(prefixButton, langButton, replyButton);
			msg.edit({ embeds: [menu], components: [options] }).catch(e => { });
		}, 120000)
		const filter = (i => i.user.id === message.author.id)
		const menuCollector = await msg.createMessageComponentCollector({ filter, time: 120000 });
		menuCollector.on('collect', async (i) => {
			switch (i.customId) {
				case 'PREFIX_BUTTON':
					embed.setTitle('🛠️ ' + t("commands:settings.prefix") + ' 🛠️')
					embed.setColor(this.ray.colors.yellow)
					embed.setDescription(t("commands:settings.prefixDesc", { prefix: user.prefix }))
					embed.setThumbnail('')
					embed.setFooter('')
					await msg.edit({ components: [confirm], embeds: [embed] })
					await i.deferUpdate().catch(e => { })
					const prefixConfirmCollector = await msg.createMessageComponentCollector({ filter, time: 120000 })
					prefixConfirmCollector.on('collect', async (i) => {
						switch (i.customId) {
							case 'YES_BUTTON':
								embed.setTitle(t("commands:settings.prefixQuestionTitle"))
								embed.setDescription(t("commands:settings.prefixQuestionDesc"))
								embed.setThumbnail('')
								embed.setFooter('')
								await msg.edit({ embeds: [embed], components: [] })
								await i.deferUpdate().catch(e => { })
								function replyFilter(reply) {
									if (reply.author.bot || reply.author.id != message.author.id) return undefined
									if (Number(reply.content.length) > 3) {
										reply.rayReply('negado', t("commands:prefix.limit"));
										return false
									} else return true
								}
								message.channel.activeCollector = true;
								const resposta = await message.channel.awaitMessages({ replyFilter, max: 1, time: 60000, errors: ['time'] })
								const reply = resposta.first()
								await db.query(`update users set prefix = '${reply.content.slice(0, 3)}' where id = '${message.author.id}'`)
								embed.setTitle(t("commands:settings.prefix-succeedTitle") + this.ray.emotes.autorizado)
								embed.setDescription(t("commands:settings.prefix-succeedDesc", { prefix: reply.content.slice(0, 3) }))
								embed.setThumbnail('')
								embed.setFooter('')
								msg.edit({ embeds: [embed] }).catch(e => { });
								break
							case 'NO_BUTTON': await msg.edit({ embeds: [menu], components: [options] })
								await i.deferUpdate().catch(e => { })
								break
						}
					})
					break
				case 'LANG_BUTTON':
					let lang = new MessageActionRow().addComponents(
						new MessageButton()
							.setCustomId("BR_BUTTON")
							.setLabel('Português - Brasil')
							.setStyle("SUCCESS")
							.setEmoji('🇧🇷'),
						new MessageButton()
							.setCustomId("USA_BUTTON")
							.setLabel('English - USA')
							.setStyle("PRIMARY")
							.setEmoji('🇺🇸'),
						new MessageButton()
							.setCustomId("ES_BUTTON")
							.setLabel('Spanish - Spain')
							.setStyle("DANGER")
							.setEmoji('🇪🇸'),
						back)
					function embedCustomize(language) {
						switch (language) {
							case 'pt-BR': embed.setThumbnail("https://media.discordapp.net/attachments/788376558271201290/816182444448546816/imagem.png")
								embed.setColor(ray.colors.hardgreen)
								break
							case 'en-US': embed.setThumbnail('https://media.discordapp.net/attachments/788376558271201290/816182713031065610/imagem.png')
								embed.setColor(ray.colors.hardblue)
								break
							case "es-ES": embed.setThumbnail("https://media.discordapp.net/attachments/788376558271201290/833920780945063986/es-ES.png")
								embed.setColor(ray.colors.orange)
								break
						}
					}
					embedCustomize(user.lang)
					embed.setTitle(t("commands:language.title"))
					embed.setDescription(t("commands:language.desc", { lang: user.lang }))
					embed.setFooter(t("commands:language.footer"))
					await msg.edit({ embeds: [embed], components: [lang] })
					await i.deferUpdate().catch(e => { })
					const langCollector = await msg.createMessageComponentCollector({ filter, time: 120000 })
					langCollector.on('collect', async (i) => {
						switch (i.customId) {
							case 'BR_BUTTON':
								await db.query(`update users set lang = 'pt-BR' where id = '${message.author.id}'`)
								embedCustomize('pt-BR')
								embed.setDescription("Idioma alterado para `pt-BR` 🇧🇷")
								msg.edit({ embeds: [embed], components: [] })
								break
							case 'USA_BUTTON':
								await db.query(`update users set lang = 'en-US' where id = '${message.author.id}'`)
								embedCustomize('en-US')
								embed.setDescription("Language changed to `en-US` 🇺🇸")
								msg.edit({ embeds: [embed], components: [] })
								break
							case 'ES_BUTTON':
								await db.query(`update users set lang = 'es-ES' where id = '${message.author.id}'`)
								embedCustomize('es-ES')
								embed.setDescription("El idioma cambió a `es-ES` 🇪🇸")
								msg.edit({ embeds: [embed], components: [] })
						}
					})
					break
				case "MOD_BUTTON":
					const modOptions = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('MOD_INVITE')
								.setLabel("Anti-Invite")
								.setStyle('SUCCESS'),
							new MessageButton()
								.setCustomId('MOD_BADWORDS')
								.setLabel("Anti-Bad Words")
								.setStyle('DANGER'),
							new MessageButton()
								.setCustomId("MOD_FLOOD")
								.setLabel("Anti-flood")
								.setStyle("SECONDARY"),
							new MessageButton()
								.setCustomId("MOD_SPAM")
								.setLabel("Anti-Spam")
								.setStyle("PRIMARY"),
							new MessageButton()
								.setCustomId("MOD_LINK")
								.setLabel("Anti-Links")
								.setStyle("SUCCESS")
						);
					embed.setTitle(`<a:b_Ban_ND:903600653492944896> Moderation <a:b_Ban_ND:903600653492944896>`)
						.setDescription(`Choose one of the moderation options below`)
					await msg.edit({ embeds: [embed], components: [modOptions, new MessageActionRow().addComponents(back)] })
					await i.deferUpdate().catch(e => { })
					break
				case 'MOD_INVITE':
					embed.setAuthor(`Anti-Invite Advanced System`)
					embed.setDescription(`Anti-invite is not enabled on your server, do you want to enable it for messages or status/games?`)
					const antiinviteOptions = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId("MESSAGE_AI")
								.setLabel("Messages")
								.setStyle("SUCCESS"),
							new MessageButton()
								.setCustomId("STATUS_AI")
								.setLabel("Status/Games")
								.setStyle("DANGER"),
							back
						)
					msg.edit({ embeds: [embed], components: [antiinviteOptions] })
					await i.deferUpdate().catch(e => { })
					break
				case "MESSAGE_AI":
					embed.setTitle(`Your server is more secure now!`)
						.setDescription(`I will block all messages that contain server invites`)

					await msg.edit({ embeds: [embed], components: [new MessageActionRow().addComponents(back,)] })
					await i.deferUpdate().catch(e => { })

					break
				case 'MOD_BADWORDS':
					const BW_confirm = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('BW_YES')
								.setLabel(t("events:confirm.yes"))
								.setEmoji('785504007778336788')
								.setStyle('SUCCESS'),
							new MessageButton()
								.setCustomId('BW_NO')
								.setLabel(t("events:confirm.no"))
								.setEmoji('847312373361541160')
								.setStyle('DANGER'),
						);
					embed.setAuthor(`Anti-Bad-Words`)
					embed.setDescription(`Are your server members very rude? Block out bad words and turn your server into a beautiful paradise at the end of the rainbow ✨\n**(THIS FEATURE IS ONLY AVAILABLE IN THE PORTUGUESE LANGUAGE)**`)
					embed.setColor(this.ray.colors.red)
						.setThumbnail('')
						.setFooter('')
					await msg.edit({ components: [BW_confirm], embeds: [embed] })
					await i.deferUpdate().catch(e => { })
					const BWCollector = await msg.createMessageComponentCollector({ filter, time: 120000 })
					BWCollector.on('collect', async (i) => {
						switch (i.customId) {
							case 'BW_YES':
								embed.setDescription(`Your server is now protected from messages that contain profanity`)
								await msg.edit({ embeds: [embed], components: [new MessageActionRow().addComponents(back,)] })
								break
							case 'BW_NO':
								// embed.setDescription(t("commands:settings.replyNo") + this.ray.emotes.sad_flushed)
								await msg.edit({ embeds: [embed], components: [new MessageActionRow().addComponents(back,)] })
								await i.deferUpdate().catch(e => { })
						}
						await i.deferUpdate().catch(e => { })
					})
					break
				case 'REPLY_BUTTON':
					const replyConfirm = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('REPLY_YES_BUTTON')
								.setLabel(t("events:confirm.yes"))
								.setEmoji('785504007778336788')
								.setStyle('SUCCESS'),
							new MessageButton()
								.setCustomId('REPLY_NO_BUTTON')
								.setLabel(t("events:confirm.no"))
								.setEmoji('847312373361541160')
								.setStyle('DANGER'),
						);
					embed.setTitle(t("commands:settings.reply"))
					embed.setDescription(t("commands:settings.replyDesc", { emoji: this.ray.emotes.meow_foof }))
					embed.setColor(this.ray.colors.pink)
					await msg.edit({ components: [replyConfirm], embeds: [embed] })
					await i.deferUpdate().catch(e => { })
					const replyCollector = await msg.createMessageComponentCollector({ filter, time: 120000 })
					replyCollector.on('collect', async (i) => {
						switch (i.customId) {
							case 'REPLY_YES_BUTTON':
								await db.query(`update servers set miscmode = true where id = '${message.guild.id}'`)
								embed.setDescription(t("commands:settings.replyYes") + this.ray.emotes.meow_blush)
								await msg.edit({ embeds: [embed], components: [new MessageActionRow().addComponents(back,)] })
								await i.deferUpdate().catch(e => { })
								break
							case 'REPLY_NO_BUTTON':
								await db.query(`update servers set miscmode = false where id = '${message.guild.id}'`)
								embed.setDescription(t("commands:settings.replyNo") + this.ray.emotes.sad_flushed)
								await msg.edit({ embeds: [embed], components: [new MessageActionRow().addComponents(back,)] })
								await i.deferUpdate().catch(e => { })
								break
						}
					})
					break
				case 'BACK_BUTTON':
					message.channel.activeCollector = false;
					embed.setThumbnail('')
					embed.setFooter('')
					await msg.edit({ components: [options], embeds: [menu] })
					await i.deferUpdate().catch(e => { })
					break
			}
		})
	}
}