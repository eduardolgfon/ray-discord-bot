const Structure = require("../../components/structures")
module.exports = class CoinflipCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "coinflip",
            multiLanguageName: true,
            aliases: ["caracoroa", "caraocruz", "flipcoin", "moeda", "girarmoeda", "moedinha", "moneda"],
            category: "animation",
            cooldown: 5,
            dm: true,
            workInThreads: true,
            Memberperm: [],
            Rayperm: [],
            dev: false,
            testCommand: []
        })
    }

    async execute({ message, user }, t) {
        let faces = [t("commands:coinflip.cara"), t("commands:coinflip.coroa")]
        var moeda = faces[Math.floor((Math.random() * faces.length))]
        if (moeda === t("commands:coinflip.cara")) var emoji = this.ray.emotes.cara
        else var emoji = this.ray.emotes.coroa

        message.reply({
            embeds: [{
                color: this.ray.colors.yellow,
                author: { name: t("commands:coinflip.flip") },
                image: { url: "https://media.discordapp.net/attachments/788376558271201290/788376760492359680/coin-flip-2.gif" },
                footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true, size: 32 }) }
            }]
        })
            .then(msg => setTimeout(() => msg.edit({
                embeds: [{
                    color: this.ray.colors.green,
                    title: `${emoji} ${moeda} ${emoji}`,
                    footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true, size: 32 }) }
                }]
            }).catch(e => { }), 4500))
    }
    async slash({ interaction, user }, t) {
        let faces = [t("commands:coinflip.cara"), t("commands:coinflip.coroa")]
        var moeda = faces[Math.floor((Math.random() * faces.length))]
        if (moeda === t("commands:coinflip.cara")) var emoji = this.ray.emotes.cara
        else var emoji = this.ray.emotes.coroa

        interaction.reply({
            embeds: [{
                color: this.ray.colors.yellow,
                author: { name: t("commands:coinflip.flip") },
                image: { url: "https://media.discordapp.net/attachments/788376558271201290/788376760492359680/coin-flip-2.gif" },
                footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: interaction.user.displayAvatarURL({ format: 'jpg', dynamic: true, size: 32 }) }
            }]
        })
        setTimeout(() => interaction.editReply({
            embeds: [{
                color: this.ray.colors.green,
                title: `${emoji} ${moeda} ${emoji}`,
                footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: interaction.user.displayAvatarURL({ format: 'jpg', dynamic: true, size: 32 }) }
            }]
        }).catch(e => { }), 4500)
    }
}