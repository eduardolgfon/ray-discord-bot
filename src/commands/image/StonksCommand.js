const Structure = require("../../components/structures")
module.exports = class StonksCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "stonks",
            multiLanguageName: false,
            aliases: ["stonk", "stonj"],
            category: "image",
            cooldown: 5,
            dm: false,
            workInThreads: true,
            Memberperm: [],
            Rayperm: ["ATTACH_FILES", "EMBED_LINKS"],
            dev: false,
            testCommand: ['{@user}']
        })
    }

    async execute({ message, args, user }, t) {
        try {
            if (args[0]) {
                if (!isNaN(args[0])) {
                    var memberSearch = await this.ray.users.fetch(args[0])
                    var avatar = memberSearch.displayAvatarURL({ format: 'png', dynamic: true })
                } else var avatar = message.mentions.users.first().displayAvatarURL({ format: 'png', dynamic: true })
            } else var avatar = message.author.displayAvatarURL({ format: 'png', dynamic: true })
        } catch (e) {
            var avatar = message.author.displayAvatarURL({ format: 'png', dynamic: true })
        }
        message.reply({
            embeds: [{
                color: this.ray.colors.hardblue,
                title: this.ray.emotes.stonks + " Stonks " + this.ray.emotes.stonks,
                image: {
                    url: `https://vacefron.nl/api/stonks?user=${avatar}`,
                },
                footer: {
                    text: t("events:footer.f1", { prefix: user.prefix }),
                    icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true })
                }
            }]
        })
    }
}