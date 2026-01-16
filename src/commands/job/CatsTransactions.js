const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const Structure = require('../../components/structures')
const moment = require('moment')
const { tz } = require('moment-timezone')

module.exports = class AdopthistoryCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: 'catstransactions',
            multiLanguageName: false,
            aliases: ['adocoes', 'historicodeadocoes', 'transacoes', 'transactions'],
            category: 'social',
            cooldown: 5,
            dm: false,
            workInThreads: true,
            Rayperm: [],
            Memberperm: [],
            dev: false,
            testCommand: ['{@user}']
        })
    }
    async execute({ message, args, user, db, query }, t) {
        const ray = this.ray
        var member = await this.findUser(message, args)
        var memberdb = await query(`select * from users where id = '${member.id}'`)
        moment.locale(user.lang)
        switch (user.lang) {
            case 'pt-BR': var locale = "America/Bahia"
                break
            case 'en-US': var locale = "America/New_York"
                break
            case 'es-ES': var locale = "Europe/Spain"
        }

        var embed = new MessageEmbed()
            .setColor(ray.colors.hardblue)
            .setTitle(t("commands:catstransations.title") + ray.emotes.pepesadcat)
            .setDescription(t("commands:catstransations.desc", { member: member.toString() }))
        if (!memberdb || !memberdb.logs) {
            embed.setDescription(t("commands:catstransations.no-data", { member: member.toString() }))
            return message.reply({ embeds: [embed] })
        }
        var userLogs = await db.query(`SELECT * FROM users WHERE id = '${member.id}' `)
        var logs = userLogs.rows[0].logs
        logs.length = 10
        await logs.reverse().map(async l => {
            var log = l.split('/')
            if (log[3]) var fetchUser = await ray.users.fetch(log[3])
            let msg;
            var value = parseInt(log[1]).toLocaleString(user.lang)
            switch (parseInt(log[0])) {
                case 1: msg = t("commands:catstransations.type1", { stonks: ray.emotes.stonks, value: value, prefix: user.prefix })
                    break
                case 2: msg = t("commands:catstransations.type2", { pepesadcat: ray.emotes.pepesadcat, value: value, prefix: user.prefix })
                    break
                case 3: msg = t("commands:catstransations.type3", { stonks: ray.emotes.stonks, value: value, fetchUser: fetchUser.tag })
                    break
                case 4: msg = t("commands:catstransations.type4", { pepesadcat: ray.emotes.pepesadcat, value: value, fetchUser: fetchUser.tag })
                    break
                case 5: msg = t("commands:catstransations.type5", { pepesadcat: ray.emotes.pepesadcat, value: value, fetchUser: fetchUser.tag, prefix: user.prefix })
                    break
                case 6: msg = t("commands:catstransations.type5", { pepesadcat: ray.emotes.pepesadcat, value: value, fetchUser: fetchUser.tag })
            }
            await embed.addField(`${msg}`, `\`${moment.tz(parseInt(log[2]), locale).format('LLL')}\``)
        })
        message.reply({ embeds: [embed] })
    }
}