const Structure = require("../../components/structures")
const moment = require("moment")
module.exports = class SayCommand extends Structure {
	constructor(ray) {
		super(ray, {
			name: "say",
			multiLanguageName: true,
			aliases: ["falar", "hablar", "dizer", "diz"],
			category: "animation",
			cooldown: 3,
			dm: true,
			workInThreads: true,
			Memberperm: [],
			Rayperm: [],
			dev: false,
			testCommand: ['{@user}', '@everyone {@role}']
		})
	}
	async execute({ message, args, noargs }, t) {
		if (!args.join(" ")) return message.reply({ embeds: [noargs] })
		message.delete().catch(e => { });
		if (message.channel.type === 'DM') var name = message.author.username
		else var name = message.member.displayName
		message.channel.send(`"${args.join(" ")}"\n\n- ${name}, ${moment().format("YYYY")} -`)
	}
}