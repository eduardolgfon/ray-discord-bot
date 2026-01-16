const { MessageEmbed } = require('discord.js')
const Structure = require("../../components/structures")

module.exports = class SuggestCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "suggest",
            multiLanguageName: true,
            aliases: ["sugestao", "sugerencia", "suggestion", "sugestao", "sugerencia"],
            category: "util",
            cooldown: 5,
            dm: true,
            workInThreads: true,
            Memberperm: [],
            Rayperm: [],
            dev: false,
            testCommand: ['deletar o bot :heart:']
        })
    }
    async execute({ message, args, noargs, prefix }, t) {
        if (!args[0]) return message.channel.send({ embeds: [noargs], reply: { messageReference: message.id } })
        message.channel.send({
            embeds: [{
                color: this.ray.colors.yellow,
                thumbnail: { url: t("events:easteregg.thumb") },
                title: t("commands:suggest.title", { autorizado: this.ray.emotes.autorizado }),
                description: t("commands:suggest.desc", { autorizado: this.ray.emotes.autorizado, martelo: this.ray.emotes.martelo }),
                footer: {
                    text: t("events:footer.f1", { prefix: prefix }),
                    icon_url: message.author.displayAvatarURL({ format: "jpg", dynamic: true })
                }
            }], reply: { messageReference: message.id }
        })
        const embed = new MessageEmbed()
            .setColor(this.ray.colors.red)
            .setTitle('Sugestão Recebida')
            .setDescription(`Autor: ${message.author} ${message.author.id}\nGuild: ${message.channel.type != 'DM' ? message.guild.name : message.author.name} (${message.channel.type != 'DM' ? message.guild.id : message.author.id})`)
            .addField("Conteúdo:", "```fix\n" + args.join(" ") + "```")
        if (message.attachments.first()) {
            embed.setImage(message.attachments.first().url)
        }

        this.ray.channels.fetch(this.ray.config.SUGGEST_CHANNEL_ID).then(channel => channel.send({ embeds: [embed] }))
    }
}