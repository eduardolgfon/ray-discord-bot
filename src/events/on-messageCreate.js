const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const moment = require("moment")
require("moment-duration-format")
const i18next = require("i18next")
const peaceController = require("../packages/guard/_ANTI-FLOOD-SYSTEM.js")
const antiflood = new peaceController(this.ray)
const palavraum = require("../json/badwords.json").palavraum
const cooldown = new Map(); const reaction = new Set();
module.exports = class MessageReceive {
    constructor(ray) {
        this.ray = ray
    }
    async start(message) {
        if (message.author.bot && !this.ray.config.TRUSTED_BOTS.includes(message.author.id) || message.channel.type === 'DM') return;
        const ray = this.ray
        const db = this.ray.db

        // for (let i = 0; i < palavraum.length; i++) {
        //     if (message.content.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(palavraum[i].toLowerCase())) {
        //         message.delete().catch(err => { })
        //         return message.rayReply("negado", `Don't say bad words ${message.author.toString()}!`, true)
        //     }
        // }
        function hasURL(str) {
            let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
            if(regexp.test(str)) return true
            else return false
        }
        if(hasURL(message.content)) {
            message.delete().catch(e => {})
            message.rayReply("negado", message.author.toString()+" You cannot submit links here!", true)
        }
        // if(message?.mentions.members.size >= 5) {
        //     message.author.send("Você foi mutado por spam e mass mention")
        //     message.member.roles.add("903486150105268255")
        // }
        async function query(query) {
            var value = await db.query(`${query}`)
            return value.rows[0]
        }
        var user = await query(`select * from users where id = '${message.author.id}'`)
        var server = await query(`select * from servers where id = '${message.guild.id}'`)
        var userconfig = await query(`select * from usersconfig where id = '${message.author.id}'`)
        var serverconfig = await query(`select * from serversconfig where id = '${message.guild.id}'`)
        if (!server) {
            await db.query(`insert into servers (id) values('${message.guild.id}')`)
            var server = await query(`select * from servers where id = '${message.guild.id}'`)
        }
        if (!user) {
            var prefix = this.ray.config.PREFIX
            var language = 'pt-BR'
        } else {
            if (userconfig && userconfig.banned) return;
            var prefix = user.prefix
            var language = user.lang
        }
        let t
        const setFixedT = function (translate) { t = translate }
        setFixedT(i18next.getFixedT(language))
        if (!serverconfig) { }
        else {
            if (serverconfig.antiflood) antiflood.verify({ message, db }, t)
            if (serverconfig.banned) message.guild.leave()
        }
        if (message.content.replace(/!/g, "") === message.guild.me.toString()) {
            if (message.guild.me.permissions.has(['SEND_MESSAGES', "READ_MESSAGE_HISTORY"]) && message.channel.permissionsFor(this.ray.user.id).has(['SEND_MESSAGES', "READ_MESSAGE_HISTORY"])) return message.reply({ content: t("events:mention", { prefix: prefix, client: this.ray.user.username }) });
        }
        global.t = t
        global.prefix = prefix
        if (reaction.has(message.guild.id)) { } else {
            if (server.miscmode && this.ray.channels.cache.has(message.channel.id) && message.guild.me.permissions?.has(['USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS'])) {
                const reactObject = require('../json/reactions.json');
                if (reactObject[message.content.toLowerCase()]) {
                    message.react(reactObject[message.content.toLowerCase()]).catch(e => { })
                    reaction.add(message.guild.id);
                    setTimeout(() => reaction.delete(message.guild.id), 1800000)
                }
            }
        }
        if (!message.content.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().startsWith(prefix.toLowerCase())) return;
        if (!user) {
            await db.query(`insert into users (id) values('${message.author.id}')`)
            user = await query(`select * from users where id = '${message.author.id}'`)
        }
        const args = message.content.slice(user.prefix.length).trim().split(/ +/g)
        const command = args.shift().normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
        var comando = this.ray.commands.get(command) || this.ray.commands.get(this.ray.aliases.get(command))
        if (!comando) {
            const commandSelector = require('../json/commandSelector.json');
            if (commandSelector[command]) {
                var comando = this.ray.commands.get(commandSelector[command]) || this.ray.commands.get(this.ray.aliases.get(commandSelector[command]))
                execute(comando)
            } else {
                var comandos = []
                this.ray.commands.map(c => comandos.push(c.config.name))
                var selection = comandos.filter(c => c.startsWith(command.slice(0, 3)) || c.startsWith(command.slice(0, 2)) || c.startsWith(command.slice(0, 1)))
                var cmd = selection.filter(c => c.startsWith(command.slice(0, 3)))
                if (!cmd[0]) var cmd = selection.filter(c => c.startsWith(command.slice(0, 2)))
                if (!cmd[0]) var cmd = selection.filter(c => c.startsWith(command.slice(0, 1)))
                var confirm = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setLabel(t("events:confirm.yes"))
                        .setStyle("SUCCESS")
                        .setEmoji('785504007778336788')
                        .setCustomId("yes"))
                var embed = new MessageEmbed()
                    .setColor(this.ray.colors.red)
                    .setTitle(t("events:noargs.title", { hum: this.ray.emotes.hum }))
                    .setThumbnail(t("events:noargs.thumb"))
                !cmd[0] ? embed.setDescription(t("events:command-null", { command: command })) : embed.setDescription(t("events:command-suggestion", { command: command, cmd: cmd[0] }))
                    .setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ format: 'jpg', dynamic: true }))
                let msg = await message.reply({ embeds: [embed], components: [confirm] })
                const commandsCollector = await msg.createMessageComponentCollector({ filter: ((i) => i.user.id === message.author.id), time: 120000 })
                commandsCollector.on('collect', () => {
                    msg.delete().catch(e => { })
                    var comando = this.ray.commands.get(cmd[0])
                    execute(comando)
                })
            }
        } else execute(comando)
        async function execute(comando) {
            if (!comando) return;
            var cmd = await query(`select * from commands where name = '${comando.config.name}'`)
            if (comando.config.dev && !ray.config.DEVS.includes(message.author.id)) return message.reply({ embeds: [{ color: ray.colors.hardblue, title: t("events:cooldown.title", { stop: ray.emotes.stop }), description: t("events:dev", { negado: ray.emotes.negado }), thumbnail: { url: t("events:noargs.thumb") }, footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: message.author.displayAvatarURL({ dynamic: true, format: 'jpg', size: 32 }) } }] })
            if (cmd.maintenance && !ray.config.DEVS.includes(message.author.id)) return message.reply({ embeds: [{ color: ray.colors.red, title: ray.emotes.stop + t("events:manutencao.commandTitle") + ray.emotes.stop, description: t("events:manutencao.commandDesc", { reason: cmd.reason }), footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true }) } }] })
            if (message.channel.type.includes('THREAD') && !comando.config.workInThreads) return message.errorEmbed(t("events:not-work-in-threads"), t, prefix)

            let ctime = Number(comando.config.cooldown) * 1000
            if (cooldown.has(message.author.id)) {
                if (cooldown.get(message.author.id) > 19999999999999) return;
                let time = cooldown.get(message.author.id)
                message.reply({ embeds: [{ color: ray.colors.hardblue, title: t("events:cooldown.title", { stop: ray.emotes.stop }), description: t("events:cooldown.message", { negado: ray.emotes.negado, time: (time - Date.now() > 1000) ? moment.utc(time - Date.now()).format(`s [${t("events:cooldown.secounds")}]`) : moment.duration(time - Date.now()).format(`[${t("events:cooldown.milliseconds")}]`) }), thumbnail: { url: t("events:cooldown.gif") }, footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: message.author.displayAvatarURL({ dynamic: true, format: 'jpg', size: 32 }) } }] })
                return cooldown.set(message.author.id, Date.now() + 99999999999999)
            } else {
                if (user.commands === 50) message.reply(t("events:have-a-suggestion"))
                await db.query(`update users set commands = commands + 1                where id = '${message.author.id}'`)
                var noargs = {
                    color: ray.colors.red, thumbnail: { url: t("events:noargs.thumb") },
                    title: t("events:noargs.title", { hum: ray.emotes.hum }),
                    fields: [{
                        name: t("events:noargs.field", { negado: ray.emotes.negado }),
                        value: `\`${user.prefix}${comando.config.name} ${t(`commands:${comando.config.name}.usage`)}\``,
                    },
                    {
                        name: t("events:noargs.ex"),
                        value: `\`${user.prefix}${comando.config.name} ${t(`commands:${comando.config.name}:ex`)}\``,
                    },
                    {
                        name: t("events:noargs.aliases"),
                        value: '`' + comando.config.aliases.join(" ").replace(new RegExp(' ', 'g'), '\`, \`') + '`',
                    },],
                    footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true }) }
                }
                await query(`update servers set guildcount = guildcount+1                where id = '${message.guild.id}'`)
            }
            if ((Math.floor(Math.random() * 200)) === 16) message.reply({ content: t("events:mendingu") })
            if (ray.config.TRUSTED_BOTS.includes(message.author.id) || ray.config.DEVS.includes(message.author.id)) { } else {
                cooldown.set(message.author.id, Date.now() + ctime)
                setTimeout(() => cooldown.delete(message.author.id), ctime)
            }
            // let Memberperms = []
            // let Rayperms = []
            // try {
            //     // comando.config.Memberperm.forEach(p => Memberperms.push(p))
            //     comando.config.Rayperm.forEach(p => Rayperms.push(p))
            // } catch (e) { }
            // Rayperms.push('SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY')
            // // if (Memberperms[0]) {
            // //                 if (!message.member.permissions.has(Memberperms)) {
            // //                                 let perm = Memberperms.map(value => t(`permissions:${value}`)).join(", ")
            // //                                 return message.channel.send(this.ray.emotes.negado + `** | ${t("permissions:USER_MISSING_PERMISSION", { perm: perm })}**`)
            // //                 }
            // // }
            // if (!message.guild.me.permissions.has(Rayperms) || !message.channel.permissionsFor(ray.user.id).has(Rayperms)) {
            //     let perm = Rayperms.map(value => t(`permissions:${value}`)).join(", ")
            //     return message.channel.send(this.ray.emotes.negado + `** | ${t("permissions:CLIENT_MISSING_PERMISSION", { perm: perm })}**`).catch(e => message.author.send(this.ray.emotes.negado + `** | ${t("permissions:CLIENT_MISSING_PERMISSION", { perm: perm })}**`)).catch(e => { });
            // }
            try {
                comando.setT(t); new Promise((res, rej) => {
                    comando.config.name === 'userfake' ? {} : message.channel.sendTyping()
                    res(comando.execute({ message, args, db, query, user, server, command, comando, noargs }, t))
                })
            } catch (e) {
                message.channel.send({ embeds: [{ color: ray.colors.red, title: t("events:erro.title", { shorin: ray.emotes.shorin, pika: ray.emotes.pikapalm }), description: t("events:erro.desc", { support: ray.config.SUPPORT_SERVER }) + `\n\n\`\`\`js\n${e.message}\`\`\` `, footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true }) } }], reply: { messageReference: message.id } })
                ray.channels.cache.get(ray.config.REPORT_CHANNEL_ID).send({ embeds: [{ color: ray.colors.red, title: user.prefix + comando.config.name, description: `Autor: **${message.author} ${message.author.id}**\nGuild: **${message.guild.name} (${message.guild.id}**)\n\nChat: **${message.channel.name} ${message.channel.id} (Tipo: ${message.channel.type}, NSFW: ${message.channel.nsfw})**`, fields: [{ name: `Argumentos:`, value: `\`\`\`diff\n- ${!(args.join(" ")) ? 'Sem argumentos' : args.join(" ")}\`\`\``, }, { name: 'Erro:', value: ` \`\`\`js\n${e.stack.length > 1800 ? `${e.stack.slice(0, 1800)}...` : e.stack}\`\`\` ` }] }] })
            }
            if (ray.config.CLIENT_CANARY) return;
            ray.channels.cache.get(ray.config.LOGS_CHANNEL_ID).send({
                embeds: [{
                    color: ray.colors.yellow,
                    title: user.prefix + command,
                    fields: [{
                        name: `Autor:`, value: message.author.toString() + '\n```md\n# ' + `(TAG: ${message.author.tag}, ID: ${message.author.id})` + '```'
                    }, {
                        name: 'Servidor:', value: '```fix\n' + `${message.guild.name} (ID: ${message.guild.id})` + '```'
                    }, { name: 'Argumentos:', value: '```diff\n- ' + (!args.join(" ") ? 'Nenhum argumento' : args.join(" ")) + '```' }]
                }]
            })
        }
    }
}