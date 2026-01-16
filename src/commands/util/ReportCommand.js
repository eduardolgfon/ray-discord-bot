const { MessageEmbed } = require('discord.js')
const Structure = require("../../components/structures")

module.exports = class ReportCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "report",
            multiLanguageName: true,
            aliases: ["reportar", "reportar", "bug", "erro", "reporte"],
            category: "util",
            cooldown: 5,
            dm: true,
            workInThreads: true,
            Memberperm: [],
            Rayperm: [],
            dev: false,
            testCommand: ['o comando de reportar não ta funcionando']
        })
    }
    async execute({ message, args, noargs, user }, t) {
        if (!args[0]) return message.reply({ embeds: [noargs] })
        message.reply({
            embeds: [{
                color: this.ray.colors.yellow,
                title: t("commands:report.title"),
                description: t("commands:report.desc", { autorizado: this.ray.emotes.autorizado, martelo: this.ray.emotes.martelo }),
                footer: {
                    text: t("events:footer.f1", { prefix: user.prefix }),
                    icon_url: message.author.displayAvatarURL({ format: "jpg", dynamic: true })
                }
            }]
        })
        const embed = new MessageEmbed()
            .setColor(this.ray.colors.red)
            .setTitle("Report realizado")
            .setDescription(`Autor: ${message.author} ${message.author.id}\n\nGuild: ${message.channel.type != 'DM' ? message.guild.name : message.author.name} (${message.channel.type != 'DM' ? message.guild.id : message.author.id})\n\nChat: \`${message.channel.name}\` (ID: ${message.channel.id}, Tipo: ${message.channel.type}, NSFW: ${message.channel.nsfw})\nNão se esqueça de adicionar alguma reação a esta mensagem para confirmar que este report já foi analizado`)
            .addField('Conteúdo:', "```fix\n" + args.join(" ").slice(0, 1800) + "```")
        if (message.attachments.first()) embed.setImage(message.attachments.first().url)
        this.ray.channels.fetch(this.ray.config.REPORT_CHANNEL_ID).then(channel => channel.send({ embeds: [embed] }))
    }
}