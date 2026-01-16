const Structure = require("../../components/structures")
const { MessageAttachment } = require('discord.js')
const Canvas = require("canvas")

module.exports = class BarryCommand extends Structure {
	constructor(ray) {
		super(ray, {
			name: "barry",
			multiLanguageName: false,
			aliases: ["barrycove", "cove"],
			category: "image",
			cooldown: 5,
			dm: false,
			workInThreads: true,
			Memberperm: [],
			Rayperm: ["ATTACH_FILES",],
			dev: false,
			testCommand: ['teste de comando', '{@user} teste usando menção', '{@user}']
		})
	}

	async execute({ message, args, noargs }, t) {
		const member = await this.findUser(message, args)
		const canvas = Canvas.createCanvas(850, 850)
		const ctx = canvas.getContext("2d")

		var texto = args.join(" ")
		if (!texto || !args[0]) return message.reply({ embeds: [noargs] })
		var msg = await message.rayReply('carregando', t("events:image.loading"))

		let img = await Canvas.loadImage("./src/assets/barry.png")
		ctx.drawImage(img, 0, 0, 850, 850);
		if (member.id == message.author.id) var txt = args.join(" ")
		else var txt = args.slice(1).join(" ")
		ctx.textAlign = "left"
		ctx.fillStyle = "#050505"
		ctx.font = "24px arial"
		ctx.fillText(ctx.getLines(txt, 185).join("\n"), 135, 307)
		var avatar = await Canvas.loadImage(member.displayAvatarURL({ format: 'png' }))
		ctx.rotate(-0.5)
		let roundedImage = await ctx.roundImageCanvas(avatar, 150, 150)
		ctx.drawImage(roundedImage, 135, 510, 150, 150);
		msg.delete().catch(e => { });
		message.reply({ content: this.ray.emotes.autorizado + `** | ${t("events:image.complete")}**`, files: [new MessageAttachment(canvas.toBuffer(), 'barry.jpg')] }).catch(e => { });
	}
}