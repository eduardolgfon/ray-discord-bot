const { WebhookClient, MessageEmbed } = require('discord.js')
module.exports = class GuildDelete {
	constructor(ray) {
		this.ray = ray
	}
	async start(guild) {
		const db = this.ray.db
		var server = await db.query(`select * from servers where id = '${guild.id}'`)
		server = server.rows[0]
		const guildhook = new WebhookClient({ url: this.ray.config.WEBHOOK_GUILD_REMOVE });
		var guildIcon = !guild.iconURL({ format: "jpg", dynamic: true }) ? 'https://media.discordapp.net/attachments/788376558271201290/821421343274827833/unknown.png' : guild.iconURL({ format: "jpg", dynamic: true })
		let owner = await guild.fetchOwner()
		const outbed = new MessageEmbed()
			.setColor(this.ray.colors.red)
			.setTitle(guild.name)
			.setThumbnail(guildIcon)
			.setDescription(`**${this.ray.emotes.sadcat1} Agora eu tenho ${this.ray.guilds.cache.size} servidores :c ${this.ray.emotes.sadcat2}**`)
			.addField(`ID:`, "```cs\n" + guild.id + "```", true)
			.addField(`Membros:`, "```fix\n" + guild.memberCount + "```", true)
			.addField('Proprietário do servidor:', '```md\n# ' + owner.user.tag + '```')
			.addField(`Contador:`, "```diff\n - " + (server.guildcount === null ? 0 : server.guildcount) + " ```")
		guildhook.send({
			username: `Colônia Dominada`,
			avatarURL: 'https://media.discordapp.net/attachments/788376558271201290/791002931411025970/unknown.png',
			embeds: [outbed],
		});
		await db.query(`DELETE FROM servers WHERE id = '${guild.id}'`)
	}
}