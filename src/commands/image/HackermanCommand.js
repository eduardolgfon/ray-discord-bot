const Structure = require("../../components/structures")
const { MessageAttachment } = require('discord.js')
const Canvas = require("canvas")

module.exports = class HackermanCommand extends Structure {
	constructor(ray) {
		super(ray, {
			name: "hackerman",
			multiLanguageName: false,
			aliases: ["meninohackerhomem"],
			category: "image",
			cooldown: 5,
			dm: false,
			workInThreads: true,
			Memberperm: [],
			Rayperm: ["ATTACH_FILES"],
			dev: false,
			testCommand: ['{@user}']
		})
	}
	async execute({ message, args }, t) {
		const member = await this.findUser(message, args)
		const canvas = Canvas.createCanvas(1280, 720)
		const ctx = canvas.getContext("2d")

		let img = await Canvas.loadImage("./src/assets/hackerman.png")
		var msg = await message.rayReply('carregando', t("events:image.loading"))
		var avatar = await Canvas.loadImage(member.displayAvatarURL({ format: 'png' }))
		let roundedImage = await ctx.roundImageCanvas(avatar, 280, 280)

		ctx.drawImage(img, 0, 0, 1280, 720);
		ctx.drawImage(roundedImage, 540, 0, 280, 280);

		msg.delete().catch(e => { });
		message.reply({ content: this.ray.emotes.autorizado + `** | ${t("events:image.complete")}**`, files: [new MessageAttachment(canvas.toBuffer(), 'hackerman.jpg')] }).catch(e => { });
	}
}