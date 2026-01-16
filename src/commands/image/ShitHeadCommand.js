const Structure = require("../../components/structures")
const { MessageAttachment } = require('discord.js')
const Canvas = require("canvas")

module.exports = class ShitHeadCommand extends Structure {
	constructor(ray) {
		super(ray, {
			name: "shithead",
			multiLanguageName: false,
			aliases: ["transplantemental"],
			category: "image",
			cooldown: 5,
			dm: true,
			workInThreads: true,
			Memberperm: [],
			Rayperm: ["ATTACH_FILES"],
			dev: false,
			testCommand: ['#PronomeNeutro']
		})
	}

	async execute({ message, args, noargs }, t) {
		const canvas = Canvas.createCanvas(862, 1024)
		const ctx = canvas.getContext("2d")
		if (!args.join(" ")) return message.reply({ embeds: [noargs] })

		var msg = await message.rayReply('carregando', t("events:image.loading"))
		let img = await Canvas.loadImage("./src/assets/shithead.jpg")
		ctx.drawImage(img, 0, 0, 862, 1024)
		let txt = args.join(" ")

		ctx.textAlign = "left"
		ctx.fillStyle = "#050505"
		if (txt.length <= 20) ctx.font = "42px arial"
		else ctx.font = "32px arial"
		ctx.fillText(ctx.getLines(args.join(" "), 265).join("\n"), 600, 666)

		msg.delete().catch(e => { });
		message.reply({ content: this.ray.emotes.autorizado + `** | ${t("events:image.complete")}**`, files: [new MessageAttachment(canvas.toBuffer(), 'shithead.jpg')] }).catch(e => { });
	}
}