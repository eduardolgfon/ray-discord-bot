const Structure = require("../../components/structures")
const { MessageAttachment } = require('discord.js')
const Canvas = require("canvas")

module.exports = class ResizeCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "resize",
            multiLanguageName: true,
            aliases: ["redimensionar", "cambiartamano", "rd", "redimencionar"],
            category: "image",
            cooldown: 10,
            dm: true,
            workInThreads: true,
            Memberperm: [],
            Rayperm: ["ATTACH_FILES"],
            dev: false,
            testCommand: ['100 100 https://media.discordapp.net/attachments/845680435334086686/867744130615738408/IMG-20200406-WA0036.jpg']
        })
    }
    async execute({ message, args, noargs, user }, t) {
        try {
            if (isNaN(Number(args[0])) || isNaN(Number(args[1]))) return message.reply({ embeds: [noargs] })
            if (message.attachments.first()) var img = message.attachments.first().url
            else {
                if (!args[2] || !args[2].startsWith('http')) return message.reply({ embeds: [noargs] })
                var img = args[2]
            }
            if (parseInt(args[0]) > 1280 || parseInt(args[1]) > 1280) return message.errorEmbed(t("commands:resize.pobreza"))
            var msg = await message.rayReply('carregando', t("events:image.loading"))

            const canvas = Canvas.createCanvas(Number(args[1]), Number(args[0]))
            const ctx = canvas.getContext('2d')
            const imagem = await Canvas.loadImage(img)
            ctx.drawImage(imagem, 0, 0, Number(args[1]), Number(args[0]));

            msg.delete().catch(e => { });
            message.reply({ content: this.ray.emotes.autorizado + `** | ${t("events:image.complete")} >>>(Este comando é experimental)<<<**`, files: [new MessageAttachment(canvas.toBuffer(), 'image.png')] }).catch(e => { });
        } catch (e) {
            message.errorEmbed(t("commands:resize.error"))
        }
    }
}