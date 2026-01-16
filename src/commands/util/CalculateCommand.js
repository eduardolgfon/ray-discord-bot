const Structure = require("../../components/structures")
const math = require('mathjs');

module.exports = class CalculateCommand extends Structure {
	constructor(ray) {
		super(ray, {
			name: "calculate",
			multiLanguageName: true,
			aliases: ["calcular", "calcular", "calc", "c", "calculadora", "calculo"],
			category: "util",
			cooldown: 3,
			dm: true,
			workInThreads: true,
			Memberperm: [],
			Rayperm: [],
			dev: false,
			testCommand: ['1+1']
		})
	}
	async execute({ message, args, noargs, user }, t) {
		if (!args[0] || args[0] == "help" || args[1] == "help") return message.reply({ embeds: [noargs] });
		let resp;
		let msg = args.join(" ").replace(new RegExp("x", 'g'), "*").replace(new RegExp(",", 'g'), ".").replace(new RegExp("÷", 'g'), "/")
		try {
			resp = math.evaluate(msg);
		} catch (e) {
			return message.reply({ embeds: [noargs] });
		}
		message.reply({
			embeds: [{
				color: this.ray.colors.blue,
				title: t("commands:calculate.title"),
				description: "```fix\n" + resp + "```",
				footer: {
					text: t("events:footer.f1", { prefix: user.prefix }),
					icon_url: message.author.displayAvatarURL({ format: "jpg", dynamic: true })
				}
			}]
		});
	}
}