const Structure = require("../../components/structures")
const { version, MessageEmbed } = require('discord.js')
// let os = require("os")
let cpuStat = require("cpu-stat")
const moment = require('moment')

module.exports = class BotinfoCommand extends Structure {
	constructor(ray) {
		super(ray, {
			name: "botinfo",
			multiLanguageName: false,
			aliases: ["info", "bi"],
			category: "config",
			cooldown: 5,
			dm: true,
			workInThreads: true,
			Memberperm: [],
			Rayperm: [],
			dev: false,
			testCommand: []
		})
	}
	async execute({ message, user }, t) {
		var hery = await this.findUser(message, "568493382884917258")
		let ray = this.ray
		var users = (0 - Number(this.ray.guilds.cache.size)); this.ray.guilds.cache.map(g => users += g.memberCount)
		const duration = moment.duration(ray.uptime).format(" dd[d] hh[h] mm[m] ss[s]")
		cpuStat.usagePercent(function (err, percent, seconds) {
			const embed = new MessageEmbed()
			embed.setColor(ray.colors.hardblue)
			embed.setTitle(t("commands:botinfo.title", { dev: ray.emotes.dev }))
			embed.addField(t("commands:botinfo.quser"), `\`\`\`css\n${parseInt(users).toLocaleString(user.lang)}\`\`\``, true)
			embed.addField(t("commands:botinfo.qserver"), `\`\`\`css\n${parseInt(ray.guilds.cache.size).toLocaleString(user.lang)}\`\`\``, true)
			if (ray.shard) embed.addField(t("commands:botinfo.shard", { cristal: ray.emotes.cristal }), `\`\`\`md\n#[Shard ${parseInt(message.guild.shard.id) + 1}]/${ray.config.SHARDS_AM0UNT}\`\`\``, true)
			else embed.addField(t("commands:botinfo.shard", { cristal: ray.emotes.cristal }), `\`\`\`md\n#[Shard 1]/1}\`\`\``, true)
			embed.addField(t("commands:botinfo.cpu-status"), `\`\`\`fix\n${percent.toFixed(2)}%\`\`\``, true)
			embed.addField(t("commands:botinfo.memory"), `\`\`\`fix\n${Math.round(process.memoryUsage().rss / 1024 / 1024).toString()}MB\`\`\``, true)
			embed.addField(t("commands:botinfo.uptime"), `\`\`\`fix\n${duration}\`\`\``, true)
			// embed.addField(t("commands:botinfo.cpu"), `\`\`\`cs\n# ${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
			embed.addField(t("commands:botinfo.version"), `\`\`\`diff\n- ${require("../../../package.json").version}\`\`\``, true)
			embed.addField('discord.js', `\`\`\`diff\n- ${version}\`\`\``, true)
			embed.setFooter(t("events:footer.f2", { ray: ray.user.username, owner: hery.tag }), hery.displayAvatarURL({ format: 'png', dynamic: true, size: 32 }))
			message.reply({ embeds: [embed] })
		})
	}
}