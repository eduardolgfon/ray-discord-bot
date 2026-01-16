const Structure = require("../../components/structures")
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js')
module.exports = class CommandsCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "commands",
            multiLanguageName: true,
            aliases: ["comandos", "comandos"],
            category: "config",
            cooldown: 7,
            dm: true,
            workInThreads: true,
            Memberperm: [],
            Rayperm: ["ADD_REACTIONS"],
            dev: false,
            testCommand: []
        })
    }
    async execute({ message, user }, t) {
        const ray = this.ray
        var MLN = false
        function getCommands(categoria, MLN) {
            if (!MLN) return ray.commands.filter(c => c.config.category === categoria).map(c => `**${user.prefix}${c.config.name}\nㅤ${ray.emotes.red_arrow}**\`${t(`commands:${c.config.name}:help`)}\``).join("\n ")
            else switch (user.lang) {
                case 'pt-BR':
                    return ray.commands.filter(c => c.config.category === categoria).map(c => {
                        if (c.config.multiLanguageName) return `**${user.prefix}${c.config.aliases[0]}\nㅤ${ray.emotes.red_arrow}**\`${t(`commands:${c.config.name}:help`)}\``
                        else return `**${user.prefix}${c.config.name}\nㅤ${ray.emotes.red_arrow}**\`${t(`commands:${c.config.name}:help`)}\``
                    }).join("\n ")
                    break
                case 'es-ES':
                    return ray.commands.filter(c => c.config.category === categoria).map(c => {
                        if (c.config.multiLanguageName) return `**${user.prefix}${c.config.aliases[1]}\nㅤ${ray.emotes.red_arrow}**\`${t(`commands:${c.config.name}:help`)}\``
                        else return `**${user.prefix}${c.config.name}\nㅤ${ray.emotes.red_arrow}**\`${t(`commands:${c.config.name}:help`)}\``
                    }).join("\n ")
                    break
            }
        }
        function getCategoryLength(categoria) {
            return ray.commands.filter(c => c.config.category == categoria).size
        }

        const embed = new MessageEmbed()
            .setColor(this.ray.colors.red)
            .setThumbnail(this.ray.user.displayAvatarURL({ format: 'png', dynamic: true }))
            .setTitle(t("commands:commands.title", { comunism: this.ray.emotes.comunism }))
            .setDescription(t("commands:commands.desc", {
                red_ruby: this.ray.emotes.red_ruby,
                red_arrow: this.ray.emotes.red_arrow, fodar: this.ray.emotes.fodar,
                cristal: this.ray.emotes.cristal, dev: this.ray.emotes.dev,
                info: this.ray.emotes.info, sadcat1: this.ray.emotes.sadcat1,
                funCount: getCategoryLength("animation") + getCategoryLength("image"), socialCount: getCategoryLength('social'),
                configCount: getCategoryLength("config"), utilCount: getCategoryLength("util")
            }))
            .setFooter(t("events:footer.f3", { prefix: user.prefix }), message.author.displayAvatarURL({ format: 'jpg', dynamic: true, size: 32 }))
        const menu = new MessageEmbed()
            .setColor(this.ray.colors.red)
            .setThumbnail(this.ray.user.displayAvatarURL({ format: 'png', dynamic: true }))
            .setTitle(t("commands:commands.title", { comunism: this.ray.emotes.comunism }))
            .setDescription(t("commands:commands.desc", {
                red_ruby: this.ray.emotes.red_ruby,
                red_arrow: this.ray.emotes.red_arrow, fodar: this.ray.emotes.fodar,
                cristal: this.ray.emotes.cristal, dev: this.ray.emotes.dev,
                info: this.ray.emotes.info, sadcat1: this.ray.emotes.sadcat1,
                funCount: getCategoryLength("animation") + getCategoryLength("image"), socialCount: getCategoryLength('social'),
                configCount: getCategoryLength("config"), utilCount: getCategoryLength("util")
            }))
            .setFooter(t("events:footer.f3", { prefix: user.prefix }), message.author.displayAvatarURL({ format: 'jpg', dynamic: true, size: 32 }))

        var funButton = new MessageButton()
            .setCustomId('FUN_BUTTON')
            //.setLabel(t("commands:commands.fun"))
            .setEmoji('783149522372919316')
            .setStyle('SECONDARY')
        var imageButton = new MessageButton()
            .setCustomId('IMAGE_BUTTON')
            .setEmoji('789847998875697172')
            .setStyle('SECONDARY')
        var socialButton = new MessageButton()
            .setCustomId('SOCIAL_BUTTON')
            //.setLabel(t("commands:commands.economy"))
            .setEmoji('846538777854083133')
            .setStyle('SECONDARY')
        var configButton = new MessageButton()
            .setCustomId('CONFIG_BUTTON')
            //.setLabel(t("commands:commands.config"))
            .setEmoji('785503980893503538')
            .setStyle('SECONDARY')
        var musicButton = new MessageButton()
            .setCustomId('MUSIC_BUTTON')
            //.setLabel(t("commands:commands.music"))
            .setEmoji('790212560540270602')
            .setStyle('SECONDARY')
        var utilButton = new MessageButton()
            .setCustomId('UTIL_BUTTON')
            //.setLabel(t("commands:settings.util"))
            .setEmoji('783149388092145704')
            .setStyle('SECONDARY')
        var backButton = new MessageButton()
            .setCustomId('BACK_BUTTON')
            .setLabel(t("commands:settings.back"))
            .setEmoji('◀️')
            .setStyle('PRIMARY')
        var multiLanguageButton = new MessageButton()
            .setCustomId('MLN_BUTTON')
            .setLabel(t("commands:commands.MLN"))
            .setEmoji('🌎')
            .setStyle('PRIMARY')

        if (user.lang === 'en-US') multiLanguageButton.setDisabled(true)

        var options;
        var multiLanguageNameOption;
        var backRow;
        var funRow;
        function generateButtons() {
            options = new MessageActionRow()
                .addComponents(funButton, socialButton, configButton, musicButton, utilButton);
            multiLanguageNameOption = new MessageActionRow()
                .addComponents(multiLanguageButton)
            backRow = new MessageActionRow()
                .addComponents(backButton)
            funRow = new MessageActionRow()
                .addComponents(funButton, imageButton, backButton)
        }
        function normalizeButtons() {
            funButton.setStyle('SECONDARY')
            imageButton.setStyle('SECONDARY')
            socialButton.setStyle('SECONDARY')
            configButton.setStyle('SECONDARY')
            musicButton.setStyle('SECONDARY')
            utilButton.setStyle('SECONDARY')
        }
        generateButtons()
        var msg = await message.reply({ embeds: [embed], components: [options, multiLanguageNameOption] })
        var collector = await msg.createMessageComponentCollector({ filter: ((i) => i.user.id === message.author.id), time: 120000 })
        setTimeout(() => {
            funButton.setDisabled(true)
            imageButton.setDisabled(true)
            socialButton.setDisabled(true)
            configButton.setDisabled(true)
            musicButton.setDisabled(true)
            utilButton.setDisabled(true)
            backButton.setDisabled(true)
            multiLanguageButton.setDisabled(true)
            generateButtons()
            msg.edit({ embeds: [menu], components: [options, multiLanguageNameOption] }).catch(e => { });
        }, 120000)

        collector.on('collect', async (i) => {
            switch (i.customId) {
                case 'FUN_BUTTON':
                    embed.setColor(this.ray.colors.blue)
                    embed.setTitle(t("commands:commands.fun", { fodar: this.ray.emotes.fodar }))
                    embed.setDescription(getCommands("animation", MLN))
                    funButton.setStyle(`SUCCESS`)
                    generateButtons()
                    await msg.edit({ embeds: [embed], components: [funRow] })
                    normalizeButtons()
                    i.deferUpdate().catch(e => { })
                    break
                case 'IMAGE_BUTTON':
                    embed.setColor(this.ray.colors.yellow)
                    embed.setTitle(t("commands:commands.image", { pato: this.ray.emotes.pato }))
                    embed.setDescription(getCommands("image", MLN))
                    imageButton.setStyle(`SUCCESS`)
                    generateButtons()
                    await msg.edit({ embeds: [embed], components: [funRow] })
                    normalizeButtons()
                    i.deferUpdate().catch(e => { })
                    break
                case 'CONFIG_BUTTON':
                    embed.setColor(this.ray.colors.purple)
                    embed.setTitle(t("commands:commands.config", { info: this.ray.emotes.info }))
                    embed.setDescription(getCommands("config", MLN))
                    configButton.setStyle(`SUCCESS`)
                    generateButtons()
                    await msg.edit({ embeds: [embed], components: [options, backRow] })
                    normalizeButtons()
                    i.deferUpdate().catch(e => { })
                    break
                case 'SOCIAL_BUTTON':
                    embed.setColor(this.ray.colors.green)
                    embed.setTitle(t("commands:commands.economy", { sadcat1: this.ray.emotes.sadcat1, martelo: this.ray.emotes.martelo }))
                    embed.setDescription(getCommands("social", MLN))
                    socialButton.setStyle(`SUCCESS`)
                    generateButtons()
                    await msg.edit({ embeds: [embed], components: [options, backRow] })
                    normalizeButtons()
                    i.deferUpdate().catch(e => { })
                    break
                case 'MUSIC_BUTTON':
                    embed.setColor(this.ray.colors.red)
                    embed.setTitle(t("commands:commands.music", { batida: this.ray.emotes.batida }))
                    embed.setDescription("Em breve...")
                    musicButton.setStyle(`SUCCESS`)
                    generateButtons()
                    await msg.edit({ embeds: [embed], components: [options, backRow] })
                    normalizeButtons()
                    i.deferUpdate().catch(e => { })
                    break
                case 'UTIL_BUTTON':
                    embed.setColor(this.ray.colors.pink)
                    embed.setTitle(t("commands:commands.util", { dev: this.ray.emotes.dev }))
                    embed.setDescription(getCommands("util", MLN))
                    utilButton.setStyle(`SUCCESS`)
                    generateButtons()
                    await msg.edit({ embeds: [embed], components: [options, backRow] })
                    normalizeButtons()
                    i.deferUpdate().catch(e => { })
                    break
                case 'MLN_BUTTON':
                    await normalizeButtons()
                    if (MLN) {
                        MLN = false
                        await multiLanguageButton.setEmoji('847312373361541160')
                        await multiLanguageButton.setStyle('PRIMARY')
                    } else {
                        MLN = true
                        await multiLanguageButton.setStyle('DANGER')
                    }
                    await multiLanguageButton.setEmoji('🌎')
                    await generateButtons()
                    await msg.edit({ embeds: [menu], components: [options, multiLanguageNameOption] })
                    i.deferUpdate().catch(e => { })
                    break
                case 'BACK_BUTTON':
                    normalizeButtons()
                    generateButtons()
                    await msg.edit({ embeds: [menu], components: [options, multiLanguageNameOption] })
                    i.deferUpdate().catch(e => { })
                    break
            }
        })
    }
}