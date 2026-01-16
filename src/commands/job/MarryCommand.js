const Structure = require('../../components/structures')
const { MessageButton, MessageActionRow } = require('discord.js')

module.exports = class MarryCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: 'marry',
            multiLanguageName: true,
            aliases: ['casar', "casarse", 'casamento'],
            category: 'social',
            cooldown: 5,
            dm: false,
            workInThreads: true,
            Memberperm: [],
            Rayperm: ['ADD_REACTIONS'],
            dev: false,
            testCommand: ['{@user}']
        })
    }
    async execute({ message, args, noargs, db, user }, t) {
        const member = await this.findUser(message, args)
        if (member.id === message.author.id || !args[0]) return message.reply({ embeds: [noargs] })
        var memberdb = await db.query(`select * from users where id = '${member.id}'`)
        if (!memberdb) {
            await db.query(`insert into users id values('${member.id}')`)
            var memberdb = await db.query(`select * from users where id = '${member.id}'`)
        }
        const ray = this.ray
        var marryConfig = await db.query(`select * from usersconfig where id = '${user.marry}'`)
        var memberConfig = await db.query(`select * from usersconfig where id = '${memberdb.marry}'`)

        if (!marryConfig || marryConfig.dnd) var marryDnd = null
        else var marryDnd = true
        if (!memberConfig || memberConfig.dnd) var memberDnd = null
        else var memberDnd = true
        var ignoreAlerts = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('ignore')
                    .setLabel(t("commands:marry.disableAlert"))
                    .setEmoji('❌')
                    .setStyle("SECONDARY")
            )
        if (member.id === message.author.id || member.id === user.marry) return message.reply({ embeds: [noargs] })
        async function verificarMarry() {
            if (user.marry) {
                var marry = await ray.users.fetch(user.marry)
                message.errorEmbed(t("commands:marry.traicao", { marry: marry.tag }) + ray.emotes.pistolao)
                if (marryDnd) return;
                else {
                    var marryAlert = await marry.send({ content: t("commands:marry.marryMessage", { author: message.author.username, member: member.tag }), components: [ignoreAlerts] }).catch(e => { });
                    var ignoreCollector = await marryAlert.createMessageComponentCollector({ filter: ((i) => i.user.id === marry.id), time: 120000 })
                    ignoreCollector.on('collect', async (b) => {
                        marryAlert.delete().catch(e => { });
                        try {
                            await db.query(`insert into usersconfig (id, dnd) values('${marry.id}', true)`)
                        } catch (e) {
                            await db.query(`update usersconfig set dnd = true where id = '${marry.id}'`)
                        }
                    })
                    return
                }
            }
            if (memberdb.marry) {
                var marry = await ray.users.fetch(memberdb.marry)
                message.errorEmbed(t("commands:marry.traicao2", { member: member.username }))
                if (memberDnd) return
                else {
                    var marryAlert = await marry.send({ content: t("commands:marry.marryMessage2", { member: member.username, author: message.author.tag, shorin: ray.emotes.shorin }), components: [ignoreAlerts] }).catch(e => { });
                    var ignoreCollector = await marryAlert.createMessageComponentCollector({ filter: ((i) => i.user.id === marry.id), time: 120000 })
                    ignoreCollector.on('collect', async (b) => {
                        marryAlert.delete().catch(e => { });
                        try {
                            await db.query(`insert into usersconfig (id, dnd) values('${marry.id}', true)`)
                        } catch (e) {
                            await db.query(`update usersconfig set dnd = true where id = '${marry.id}'`)
                        }
                    })
                }
            }
            if (user.marry || memberdb.marry) return false
            else return true
        }
        if (await verificarMarry() !== true) return;
        var yesButton = new MessageButton()
            .setCustomId('YES_BUTTON')
            .setLabel(t("events:confirm.yes"))
            .setStyle("SUCCESS")
            .setEmoji('❤️')
        var noButton = new MessageButton()
            .setCustomId("NO_BUTTON")
            .setLabel(t("events:confirm.no"))
            .setStyle("DANGER")
            .setEmoji('💔')
        var confirm = new MessageActionRow().addComponents(yesButton, noButton)
        const embed = {
            color: this.ray.colors.pink,
            title: ':ring:' + t("commands:marry.title") + ':ring:',
            description: t("commands:marry.desc", { member: member.toString(), author: message.author.toString() }),
            footer: {
                text: t("events:footer.f1", { prefix: user.prefix }),
                icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true })
            }
        }
        const msg = await message.reply({ content: member.toString(), embeds: [embed], components: [confirm] })
        setTimeout(() => {
            yesButton.setDisabled(true)
            noButton.setDisabled(true)
            var confirm = new MessageActionRow().addComponents(yesButton, noButton)
            msg.edit({ embeds: [embed], components: [confirm] }).catch(e => { });
        }, 120000);
        const confirmCollector = await msg.createMessageComponentCollector({ filter: ((i) => i.user.id === member.id), time: 120000 })

        confirmCollector.on('collect', async (i) => {
            switch (i.customId) {
                case 'YES_BUTTON':
                    if (await verificarMarry() !== true) return;
                    await db.query(`update users set 
                    marry = '${member.id}',
                    marrytimestamp = ${Date.now()}

                    where id = '${message.author.id}'`)

                    await db.query(`update users set 
                    marry = '${message.author.id}',
                    marrytimestamp = ${Date.now()}

                    where id = '${member.id}'`)
                    msg.edit({
                        embeds: [{
                            color: this.ray.colors.green,
                            title: t("commands:marry.yesTitle"),
                            description: t("commands:marry.yesDesc"),
                            footer: {
                                text: t("events:footer.f1", { prefix: user.prefix }),
                                icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true })
                            }

                        }], components: []
                    }).catch(e => { });
                    break
                case 'NO_BUTTON':
                    msg.edit({
                        embeds: [{
                            color: this.ray.colors.red,
                            title: t("commands:marry.noTitle") + this.ray.emotes.autorizado,
                            description: t("commands:marry.noDesc", { clicker: i.user.toString() }) + this.ray.emotes.desespero
                        }], components: []
                    }).catch(e => { });
                    break
            }
        })
    }
}