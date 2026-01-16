const Structure = require("../../components/structures")
const { MessageButton, MessageActionRow } = require('discord.js')

module.exports = class PayCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "pay",
            multiLanguageName: true,
            aliases: ["pagar", "pagar", "transferir"],
            category: "social",
            cooldown: 5,
            dm: false,
            workInThreads: true,
            Memberperm: [],
            Rayperm: ["ADD_REACTIONS"],
            dev: false,
            testCommand: ['{@user} 1']
        })
    }
    async execute({ message, args, user, noargs, db }, t) {
        const ray = this.ray
        const member = await this.findUser(message, args)
        if (!args[1]) return message.reply({ embeds: [noargs] })
        var value = parseInt(args[1].toLowerCase().replace(new RegExp("k", 'g'), "000"))
        if (isNaN(value)) return message.reply({ embeds: [noargs] })
        if (member.id == message.author.id) return message.errorEmbed(t("commands:pay.authorMention"))

        async function verificar() {
            var user = await db.query(`select * from users where id = '${message.author.id}'`)
            user = user.rows[0]
            if (parseInt(user.cats) < parseInt(value)) {
                message.reply({
                    embeds: [{
                        color: ray.colors.red,
                        title: t("events:noargs.title", { hum: ray.emotes.hum }),
                        description: ray.emotes.autorizado + t("events:cats-false", { member: message.author.toString() }),
                        footer: {
                            text: t("events:footer.f1", { prefix: user.prefix }),
                            icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true })
                        }
                    }]
                }).catch(e => { });
                return false
            } else return true
        }
        if (await verificar() === false) return;
        var yesButton = new MessageButton()
            .setCustomId('YES_BUTTON')
            .setLabel(t("events:confirm.yes"))
            .setStyle("SUCCESS")
            .setEmoji('785504007778336788')
        var noButton = new MessageButton()
            .setCustomId("NO_BUTTON")
            .setLabel(t("events:confirm.no"))
            .setStyle("DANGER")
            .setEmoji('847312373361541160')
        var confirm = new MessageActionRow().addComponents(yesButton, noButton)

        let msg = await message.reply({
            embeds: [{
                color: this.ray.colors.green,
                title: this.ray.emotes.carregando + t("commands:pay.title") + this.ray.emotes.carregando,
                description: this.ray.emotes.sadcat2 + t("commands:pay.desc") + this.ray.emotes.autorizado,
                footer: {
                    text: t("events:footer.f1", { prefix: user.prefix }),
                    icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true })
                }
            }], components: [confirm]
        })

        const confirmCollector = await msg.createMessageComponentCollector({ filter: ((i) => i.user.id === message.author.id), time: 60000 })

        confirmCollector.on("collect", async (i) => {
            switch (i.customId) {
                case 'YES_BUTTON':
                    if (await verificar() !== true) return;
                    await db.query(`update users set cats = cats + ${value} where id = '${member.id}'`)
                    await this.ray.newTransation(member, `5/${value}/${Date.now()}/${message.author.id}`)

                    await db.query(`update users set cats = cats - ${value} where id = '${message.author.id}'`)
                    await this.ray.newTransation(message.author, `6/${value}/${Date.now()}/${member.id}`)

                    msg.delete().catch(e => { });
                    message.reply({
                        embeds: [{
                            color: this.ray.colors.green,
                            title: t("commands:pay.confirmTitle") + this.ray.emotes.autorizado,
                            description: t("commands:pay.confirmDesc", { author: message.author.toString(), member: member.toString(), value: value.toLocaleString(user.lang) }) + this.ray.emotes.sadcat1,
                            footer: {
                                text: t("events:footer.f1", { prefix: user.prefix }),
                                icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true })
                            }
                        }]
                    }).catch(e => message.channel.send({
                        embeds: [{
                            color: this.ray.colors.green,
                            title: t("commands:pay.confirmTitle") + this.ray.emotes.autorizado,
                            description: t("commands:pay.confirmDesc", { author: message.author.toString(), member: member.toString(), value: value.toLocaleString(user.lang) }) + this.ray.emotes.sadcat1,
                            footer: {
                                text: t("events:footer.f1", { prefix: user.prefix }),
                                icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true })
                            }
                        }]
                    }))

                    break

                case 'NO_BUTTON':
                    msg.delete().catch(e => { });
                    message.reply({
                        embeds: [{
                            color: this.ray.colors.red,
                            title: t("commands:pay.cancelTitle") + this.ray.emotes.negado,
                            description: t("commands:pay.cancelDesc") + this.ray.emotes.sadcat1,
                            footer: {
                                text: t("events:footer.f1", { prefix: user.prefix }),
                                icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true })
                            }
                        }]
                    }).catch(e => { });

                    break
            }
        })
    }
}