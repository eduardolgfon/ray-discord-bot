const Structure = require("../../components/structures")
const { MessageAttachment } = require('discord.js')

module.exports = class ProfileCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "profile",
            multiLanguageName: true,
            aliases: ["perfil", 'perfil'],
            category: "social",
            cooldown: 5,
            dm: false,
            workInThreads: true,
            Memberperm: [],
            Rayperm: ["ATTACH_FILES"],
            dev: false,
            testCommand: ['{@user}']

        })
    }

    async execute({ message, args, db }, t) {
        const member = await this.findUser(message, args)
        const ray = this.ray
        var msg = await message.rayReply('carregando', t("events:image.loading"))
        delete require.cache[require.resolve("../../components/ProfileGenerator")]
        const { generateProfile } = require("../../components/ProfileGenerator")
        let image = await generateProfile({ message, ray, member, db }, t)
        msg.delete().catch(e => { });
        message.reply({ content: this.ray.emotes.autorizado + `** | ${t("events:image.complete")}**`, files: [new MessageAttachment(image, 'profile.jpg')] }).catch(e => { });
    }
}