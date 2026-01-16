const Structure = require("../../components/structures")
const Canvas = require("canvas")
const { MessageAttachment } = require('discord.js')

module.exports = class DeceptionCommand extends Structure {
	constructor(ray) {
		super(ray, {
			name: "deception",
			multiLanguageName: true,
			aliases: ["decepcao", "decepcion", "disappointment"],
			category: "image",
			cooldown: 5,
			dm: false,
			workInThreads: true,
			Memberperm: [],
			Rayperm: ["ATTACH_FILES"],
			dev: false,
			testCommand: ['você perdeu todos os seus sad cats']
		})
	}

	async execute({ message, args, noargs }, t) {
		const canvas = await Canvas.createCanvas(425, 700)
		const ctx = await canvas.getContext("2d")

		if (!args[0]) return message.reply({ embeds: [noargs] })
		var msg = await message.rayReply('carregando', t("events:image.loading"))
		var img = await Canvas.loadImage("./src/assets/decepcao.png")

		await ctx.drawImage(img, 0, 0, 425, 700);
		await ctx.rotate(-0.13)
		ctx.textAlign = "left"
		ctx.fillStyle = "#050505"

		if (args.join(" ").length < 10) ctx.font = "24px arial"
		else ctx.font = "16px arial"
		await ctx.fillText(ctx.getLines(args.join(" "), 130).join("\n"), 117, 327)

		await msg.delete().catch(e => { });
		await message.reply({ content: this.ray.emotes.autorizado + `** | ${t("events:image.complete")}**`, files: [new MessageAttachment(canvas.toBuffer(), 'deception.jpg')] }).catch(e => { });
	}
}