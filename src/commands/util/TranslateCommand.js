const Structure = require("../../components/structures")
const api = require("@iamtraction/google-translate")
module.exports = class TranslateCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "translate",
            multiLanguageName: true,
            aliases: ["traduzir", "traducir", 'trad', 'translator', 'tradutor', 'bilingui', 't', "traductor"],
            category: "util",
            cooldown: 4,
            dm: true,
            workInThreads: true,
            Memberperm: [],
            Rayperm: [],
            dev: false,
            testCommand: ['pt pussy', 'en jacaré']
        })
    }

    async execute({ message, args, noargs, user }, t) {
        var color = this.ray.colors.blue
        var prefix = prefix
        if (!args[1] || args[0].length != 2) return message.reply({ embeds: [noargs] })
        api(args.slice(1).join(" "), { to: args[0] }).then(res => {
            message.reply({
                embeds: [{
                    color: color,
                    title: t("commands:translate.title"),
                    description: `\`\`\`fix\n${res.text}\`\`\``,
                    footer: {
                        text: t("events:footer.f1", { prefix: user.prefix }),
                        icon_url: message.author.displayAvatarURL({ fomart: 'png', dynamic: true })
                    }
                }]
            })
        })
    }
}