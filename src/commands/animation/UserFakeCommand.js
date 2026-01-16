const Structure = require("../../components/structures")
module.exports = class UserFakeCommand extends Structure {
	constructor(ray) {
		super(ray, {
			name: "userfake",
			multiLanguageName: false,
			aliases: ["fake", "ufk", "fakemsg"],
			category: "animation",
			cooldown: 4,
			dm: false,
			workInThreads: false,
			Memberperm: [],
			Rayperm: ["MANAGE_WEBHOOKS"],
			dev: false,
			testCommand: ['{@user} teste {@user}', '{@user} @everyone {@role}']
		})
	}
	async execute({ message, args, noargs }, t) {
		try {
			if (!args[0]) return message.reply({ embeds: [noargs] })
			message.delete().catch(e => { });
			const member = await this.findUser(message, args)
			if (member.id === this.ray.user.id) return;

			var user = await message.guild.members.cache.get(member.id)

			if (!user.displayName) var name = member.username
			else var name = user.displayName

			var messageObject = {
				username: name,
				avatarURL: member.displayAvatarURL({ format: "png" }),
				content: args.slice(1).join(" ").slice(0, 1800),
				files: [],
				embeds: []
			}
			if (message.attachments.first()) {
				if (!messageObject.content) messageObject.content = '_ _'
				messageObject.files.push(message.attachments.first())
			}
			if (!messageObject.content) return message.reply({ embeds: [noargs] })
			var webhooks = await message.channel.fetchWebhooks()
			var webhook = webhooks.find(w => w.owner.id === this.ray.user.id)
			if (!webhook) {
				message.channel.createWebhook(this.ray.user.username, {
					avatar: this.ray.user.displayAvatarURL({ format: 'png' }),
					reason: 'userfake Command'
				}).then(async (webhook) => {
					var webhooks = await message.channel.fetchWebhooks();
					var webhook = webhooks.find(w => w.owner.id === this.ray.user.id)
					webhook.send(messageObject);
				}).catch(e => message.errorEmbed(t("events:very-webhooks")))
			} else webhook.send(messageObject)
		} catch (e) {
			return message.channel.send({ embeds: [noargs] }).catch(e => { })
		}
	}
}