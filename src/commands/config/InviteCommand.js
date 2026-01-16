const Structure = require("../../components/structures")
module.exports = class InviteCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: 'invite',
            multiLanguageName: true,
            aliases: ["convite", "invitacion", "convidar", "add", "adicionar", 'invitar', "invitacion"],
            category: 'config',
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
                color: this.ray.colors.pink,
                title: t("commands:invite.title"),
                description: t("commands:invite.desc", { invite: this.ray.config.BOT_INVITE }),
                footer: {
                    text: t("events:footer.f1", { prefix: user.prefix }),
                    icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true, size: 32 })
                }
            }]
        })
    }
}