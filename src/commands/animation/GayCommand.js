const Structure = require("../../components/structures")
const { MessageEmbed } = require('discord.js')
module.exports = class GayCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "gay",
            multiLanguageName: false,
            aliases: ["guei", "gayzao", "gaymer"],
            category: "animation",
            cooldown: 3,
            dm: true,
            workInThreads: true,
            Memberperm: [],
            Rayperm: [],
            dev: false,
            testCommand: ['{@user}']
        })
    }

    async execute({ message, args, user }, t) {
        let member = await this.findUser(message, args)
        let values = []
        for (let count = 0; count < 100; count++) values.push(count)
        values.push(500, 'INFINITAMENTE')
        var value = values[Math.floor((Math.random() * values.length))]
        const embed = new MessageEmbed()
            .setColor(this.ray.colors.green)
            .setTitle(t("commands:gay.title"))
            .setDescription(t("commands:gay.desc", { member: member.toString(), value: value }))
            .setImage('https://cdn.discordapp.com/attachments/606550590855839746/641017340271788063/reut.gif')
            .setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ format: 'jpg', dynamic: true, size: 32 }))
        message.reply({ embeds: [embed] })
    }

}