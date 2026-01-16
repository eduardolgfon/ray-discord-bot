const Structure = require("../../components/structures")
module.exports = class CMMCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "cmm",
            multiLanguageName: false,
            aliases: ["changemymind"],
            category: "image",
            cooldown: 3,
            dm: true,
            workInThreads: true,
            Memberperm: [],
            Rayperm: ["ATTACH_FILES"],
            dev: false,
            testCommand: ['Godzilla é melhor que King Kong']
        })
    }
    async execute({ message, args, noargs, user }, t) {
        if (!args[0]) return message.reply({ embeds: [noargs] });
        message.reply({
            embeds: [{
                color: this.ray.colors.blue,
                title: "Change my mind",
                image: { url: `https://vacefron.nl/api/changemymind?text=${args.join("+")}` },
                footer: {
                    text: t("events:footer.f1", { prefix: user.prefix }),
                    icon_url: message.author.displayAvatarURL({ format: "jpg", dynamic: true })
                }
            }]
        })
    }
}