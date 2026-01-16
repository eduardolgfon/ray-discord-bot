const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const Structure = require("../../components/structures")
const c = require('chalk')
module.exports = class BetCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "bet",
            multiLanguageName: true,
            aliases: ["apostar", "apostar"],
            category: "social",
            cooldown: 5,
            dm: false,
            workInThreads: true,
            Memberperm: [],
            Rayperm: [],
            dev: false,
            testCommand: ['{@user} 10', '{@user} 1k']
        })
    }
    async execute({ message, noargs, args, db, query, user }, t) {
        if (!args[1]) return message.reply({ embeds: [noargs] })
        const member = await this.findUser(message, args)
        let value = parseInt(args[1].toLowerCase().replace(new RegExp("k", 'g'), "000"))

        if (member.id === message.author.id) return message.errorEmbed(t("commands:bet.no-mention"))

        if (isNaN(value)) return message.reply({ embeds: [noargs] })
        async function verificarCats() {
            var user = await query(`select * from users where id = '${message.author.id}'`)
            var memberdb = await query(`select * from users where id = '${member.id}'`)
            if (parseInt(user.cats) < parseInt(value)) {
                message.errorEmbed(t("events:cats-false", { member: message.author.toString() }));
                return false;
            }
            if (!memberdb || parseInt(memberdb.cats) < parseInt(value)) {
                message.errorEmbed(t("events:cats-false", { member: member.toString() }));
                return false;
            }
            if (memberdb && parseInt(memberdb.cats) > parseInt(value) && parseInt(user.cats) > parseInt(value)) return true
            else return false
        }

        if (await verificarCats() === false) return;


        var yesButton = new MessageButton()
            .setCustomId('YES_BUTTON')
            .setLabel(t("events:confirm.yes"))
            .setEmoji('785504007778336788')
            .setStyle('SUCCESS')
        var noButton = new MessageButton()
            .setCustomId('NO_BUTTON')
            .setLabel(t("events:confirm.no"))
            .setEmoji('847312373361541160')
            .setStyle('DANGER')

        const confirm = new MessageActionRow()
            .addComponents(yesButton, noButton)
        const embed = {
            color: this.ray.colors.green,
            title: t("commands:bet.title") + this.ray.emotes.sadcat2,
            description: t("commands:bet.desc", {
                member: member.toString(),
                author: message.author.toString(),
                value: parseInt(value).toLocaleString(user.lang)
            }),
            footer: {
                text: t("events:footer.f1", { prefix: user.prefix }),
                icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true, size: 32 })
            }
        }

        let msg = await message.reply({ content: member.toString(), embeds: [embed], components: [confirm] })
        var timeout = setTimeout(() => {
            yesButton.setDisabled(true)
            noButton.setDisabled(true)
            var confirm = new MessageActionRow().addComponents(yesButton, noButton)
            msg.edit({ embeds: [embed], components: [confirm] }).catch(e => { });
        }, 60000);
        const confirmCollector = msg.createMessageComponentCollector({ filter: (i => i.user.id === member.id || i.user.id === message.author.id), time: 60000 });
        confirmCollector.on('collect', async (i) => {
            var user = await query(`select * from users where id = '${message.author.id}'`)
            switch (i.customId) {
                case 'YES_BUTTON':
                    if (i.user.id != member.id) return;
                    yesButton.setStyle('PRIMARY')
                    if (await verificarCats() === false) return;
                    var memberdb = await query(`select * from users where id = '${member.id}'`)
                    if (!memberdb) await db.query(`insert into users (id) values('${member.id}')`)
                    msg.edit({
                        embeds: [{
                            color: this.ray.colors.yellow,
                            title: t("commands:coinflip.flip"),
                            image: { url: "https://media.discordapp.net/attachments/788376558271201290/788376760492359680/coin-flip-2.gif" },
                            footer: {
                                text: t("events:footer.f1", { prefix: user.prefix }),
                                icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true })
                            }
                        }], components: []
                    })
                    var ganhador
                    var UserGainRate = 50
                    var UserLoseRate = 50
                    var MemberGainRate = 50
                    var MemberLoseRate = 50
                    var UserWins = Number(user.wins)
                    var UserLoses = Number(user.loses)
                    var MemberWins = Number(memberdb.wins)
                    var MemberLoses = Number(memberdb.loses)

                    if (UserWins > UserLoses) UserLoseRate = Number(UserWins - UserLoses) * 20
                    else UserGainRate = Number(UserLoses - UserWins) * 20
                    if (MemberWins > MemberLoses) MemberLoseRate = Number(MemberWins - MemberLoses) * 20
                    else MemberGainRate = Number(MemberLoses - MemberWins) * 20

                    if (Math.floor(Math.random() * 100) >= 51) UserGainRate += 25
                    else MemberGainRate += 25

                    if (Number(UserGainRate - UserLoseRate) > Number(MemberGainRate - MemberLoseRate)) ganhador = message.author
                    else ganhador = member
                    const embed = new MessageEmbed()
                    if (ganhador.id == member.id) {
                        ganhador = member
                        embed.setColor(this.ray.colors.blue)

                        await db.query(`update users set 
                        cats = cats + ${parseInt(value)}, 
                        wins = wins + 1                            
                        where id = '${member.id}'
                    `)
                        await this.ray.newTransation(member, `3/${value}/${Date.now()}/${message.author.id}`)
                        await db.query(`update users set 
                        cats = cats - ${value}, 
                        loses = loses + 1
                            
                        where id = '${message.author.id}'
                    `)
                        await this.ray.newTransation(message.author, `4/${value}/${Date.now()}/${member.id}`)

                    } else {
                        ganhador = message.author
                        embed.setColor(this.ray.colors.orange)

                        await db.query(`update users set 
                            cats = cats + ${value}, 
                            wins = wins + 1                                
                            where id = '${message.author.id}'
                        `)
                        await this.ray.newTransation(message.author, `3/${value}/${Date.now()}/${member.id}`)

                        await db.query(`update users set 
                            cats = cats - ${value}, 
                            loses = loses + 1
                            where id = '${member.id}'
                        `)
                        await this.ray.newTransation(member, `4/${value}/${Date.now()}/${message.author.id}`)


                    }
                    embed.setTitle(t("commands:bet.title") + this.ray.emotes.sadcat4)
                    embed.setDescription(t("commands:bet.gainDesc", { ganhador: ganhador.toString(), value: parseInt(value).toLocaleString(user.lang) }))
                    embed.setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ format: 'jpg', dynamic: true }))
                    setTimeout(() => {
                        clearTimeout(timeout)
                        msg.edit({ embeds: [embed], components: [] }).catch(e => { })
                    }, 4750);
                    break
                case 'NO_BUTTON':
                    msg.edit({
                        embeds: [{
                            color: this.ray.colors.red,
                            title: t("commands:bet.cancelTitle"),
                            description: t("commands:bet.cancelDesc", { user: i.user.toString() }),
                            footer: {
                                text: t("events:footer.f1", { prefix: user.prefix }),
                                icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true })
                            }
                        }], components: []
                    }).catch(e => { });
                    break
            }
        });
    }
}