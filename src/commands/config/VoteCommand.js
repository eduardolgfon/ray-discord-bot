const Structure = require("../../components/structures")
module.exports = class VoteCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "vote",
            multiLanguageName: true,
            aliases: ["votar", "votar", "upvote", "dbl", "botlist"],
            category: "config",
            cooldown: 3,
            dm: true,
            workInThreads: true,
            Memberperm: [],
            Rayperm: [],
            dev: false,
            testCommand: []
        })
    }
    async execute({ message, user }, t) {
        message.reply({
            embeds: [{
                color: this.ray.colors.hardblue,
                title: t("commands:vote.title"),
                description: t("commands:vote.desc", { bacana: this.ray.emotes.fodar, prefix: user.prefix }),
                footer: {
                    text: t("events:footer.f1", { prefix: user.prefix }),
                    icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true, size: 32 })
                }
            }]
        })
    }
}