const Structure = require("../../components/structures")
const { MessageEmbed } = require('discord.js')
const cooldown = new Set();
module.exports = class BumpCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "bump",
            multiLanguageName: false,
            aliases: [],
            category: "private",
            cooldown: 3,
            dm: false,
            Memberperm: [],
            Rayperm: [],
            dev: false,
            testCommand: ['cancel']
        })
    }
    async execute({ message, args, query, user }, t) {
        var partner = query(`select partner from serversconfig where id = '${message.guild.id}'`)
        if (!partner) return message.reply({
            embeds: [{
                color: this.ray.colors.yellow,
                title: 'Você descobriu um conteúdo privado',
                description: 'Este comando ou funcionalidade está disponível apenas para servidores parceiros, e este servidor não tem permissão para executa-lo',
                footer: {
                    text: t("events:footer.f1", { prefix: user.prefix }),
                    icon_url: message.author.displayAvatarURL({ format: 'jpg' })
                }
            }]
        })
        var time;
        switch (args[0]) {
            default:
                if (cooldown.has(message.guild.id)) {
                    const cool = new MessageEmbed()
                        .setThumbnail(t("events:cooldown.gif", { negado: this.ray.emotes.negado }))
                        .setColor(this.ray.colors.red)
                        .setTitle(t("events:cooldown.title"))
                        .setDescription(t("commands:bump:cool.desc", { negado: this.ray.emotes.negado, prefix: user.prefix }))
                        .setFooter(t("events:footer.f1", { prefix: user.prefix }))
                    message.reply({ embeds: [cool] })
                } else {
                    const embed2 = new MessageEmbed()
                        .setColor(this.ray.colors.yellow)
                        .setThumbnail("https://media.discordapp.net/attachments/788376558271201290/816183918319239218/imagem.png")
                        .setTitle(t("commands:bump:embed2.title"))
                        .setDescription(t("commands:bump:embed2.desc"))
                        .setImage('https://media.discordapp.net/attachments/788376558271201290/816184237274562560/imagem.png')
                        .setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ format: "jpg", dynamic: true }))

                    var embed = new MessageEmbed()
                        .setThumbnail('https://media.discordapp.net/attachments/788376558271201290/816184377565511721/imagem.png')
                        .setColor(this.ray.colors.red)
                        .setTitle(t("commands:bump:embed1.title"))
                        .setDescription(t("commands:bump:embed1.desc", { prefix: user.prefix }))
                        .setImage("https://media.discordapp.net/attachments/788376558271201290/816184501457780757/imagem.png")
                        .setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ format: "jpg", dynamic: true }))
                    message.reply({ embeds: [embed2] })
                }
                cooldown.add(message.guild.id);
                if (!cooldown.has(message.guild.id)) {
                    return
                }
                var time = setTimeout(() => {
                    cooldown.delete(message.guild.id);
                    message.reply({ content: message.author.toString(), embeds: [embed] })
                }, 7200000);
                break
            case 'cancel':
                if (cooldown.has(message.guild.id)) {
                    cooldown.delete(message.guild.id);
                    clearTimeout(time)
                    message.rayReply('autorizado', 'Notificar bump cancelado!')
                } else message.rayReply('negado', 'O Aviso do bump não está ativado!')
                break
        }
    }
}