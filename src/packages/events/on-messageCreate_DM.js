const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js')
const moment = require("moment")
require("moment-duration-format")
const i18next = require("i18next")
const cooldown = new Map();
const chalk = require('chalk')
module.exports = class messageCreateDM {
    constructor(ray) {
        this.ray = ray
    }
    async start(message) {
        if (message.editedTimestamp) return;
        if (message.channel.type != 'DM' && message.channel.parentId === '876505530569474048' && !message.author.bot) {
            var guild = await this.ray.guilds.fetch('761424522259202108')
            if (message.content.startsWith('//')) return;
            var user = await this.ray.users.fetch(message.channel.topic)
            try {
                var sendObject = {
                    content: message.content,
                    files: []
                }
                if (message.attachments.first()) {
                    sendObject.files.push(message.attachments.first())
                    if (message.content.length === 0) sendObject.content = '_ _'
                }
                user.send(sendObject)
            } catch (e) {
                message.rayReply('negado', `Não foi possível enviar sua mensagem para ${user.tag}\n` + e)
            }
        }

        if (message.author.bot && !this.ray.config.TRUSTED_BOTS.includes(message.author.id) || message.channel.type != 'DM') return;
        if (message.author.id === this.ray.user.id) return;
        var guild = await this.ray.guilds.fetch('761424522259202108')
        const ray = this.ray
        const db = this.ray.db
        async function query(query) {
            var value = await db.query(`${query}`)
            return value.rows[0]
        }
        var user = await query(`select * from users where id = '${message.author.id}'`)
        var userconfig = await query(`select * from usersconfig where id = '${message.author.id}'`)

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

        var channel = await guild.channels.cache.find(c => c.topic === message.author.id)
        if (!channel) {
            var channel = await guild.channels.create(message.author.username, { topic: message.author.id })
            await channel.setParent('876505530569474048')
            var webhook = await channel.createWebhook(message.author.username, { avatar: message.author.displayAvatarURL({ format: 'png' }), })
        }
        const webhooks = await channel.fetchWebhooks();
        var webhook = await webhooks.find(w => w.name = message.author.username)
        if (!webhook) var webhook = await channel.createWebhook(message.author.username, { avatar: message.author.displayAvatarURL({ format: 'png' }), })
        var messageObject = {
            username: message.author.username,
            avatarURL: message.author.displayAvatarURL({ format: 'png' }),
            content: message.content,
            files: [],
            embeds: []
        }
        if (message.attachments.first()) {
            messageObject.files.push(message.attachments.first())
            if (message.content.length > 0) webhook.send(messageObject)
            else {
                messageObject.content = '_ _'
                webhook.send(messageObject)
            }
        } else webhook.send(messageObject)

        if (!message.content.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().startsWith(prefix.toLowerCase())) return;
        if (!user) {
            await db.query(`insert into users (id) values('${message.author.id}')`)
            user = await query(`select * from users where id = '${message.author.id}'`)
        }
        const args = message.content.slice(user.prefix.length).trim().split(/ +/g)
        const command = args.shift().normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
        var comando = this.ray.commands.get(command) || this.ray.commands.get(this.ray.aliases.get(command))
        if (!comando) {
            const commandSelector = require('../../json/commandSelector.json');
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
            if (!comando.config.dm) return message.reply({
                embeds: [{
                    color: ray.colors.red,
                    title: ray.emotes.negado + " | Calma lá",
                    description: '**:flag_br: | Este comando não pode ser usado em `Mensagens Diretas`\n:flag_us: | This command cannot be used in `Direct Messages`\n:flag_es: | Este comando no se puede utilizar en `Mensajes directos`**',
                    footer: {
                        text: t("events:footer.f1", { prefix: user.prefix }),
                        icon_url: message.author.displayAvatarURL({ format: "jpg", dynamic: true })
                    }
                }]
            })
            var cmd = await query(`select * from commands where name = '${comando.config.name}'`)
            if (comando.config.dev && !ray.config.DEVS.includes(message.author.id)) return message.reply({ embeds: [{ color: ray.colors.hardblue, title: t("events:cooldown.title", { stop: ray.emotes.stop }), description: t("events:dev", { negado: ray.emotes.negado }), thumbnail: { url: t("events:noargs.thumb") }, footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: message.author.displayAvatarURL({ dynamic: true, format: 'jpg', size: 32 }) } }] })
            if (cmd.maintenance && !ray.config.DEVS.includes(message.author.id)) return message.reply({ embeds: [{ color: ray.colors.red, title: ray.emotes.stop + t("events:manutencao.title") + ray.emotes.stop, description: t("events:manutencao.desc", { reason: await query(`select reason from commands where name = '${comando.config.name}'`) }), footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true }) } }] })

            let ctime = Number(comando.config.cooldown) * 1000
            if (cooldown.has(message.author.id)) {
                if (cooldown.get(message.author.id) > 19999999999999) return;
                let time = cooldown.get(message.author.id)
                message.reply({ embeds: [{ color: ray.colors.hardblue, title: t("events:cooldown.title", { stop: ray.emotes.stop }), description: t("events:cooldown.message", { negado: ray.emotes.negado, time: (time - Date.now() > 1000) ? moment.utc(time - Date.now()).format(`s [${t("events:cooldown.secounds")}]`) : moment.duration(time - Date.now()).format(`[${t("events:cooldown.milliseconds")}]`) }), thumbnail: { url: t("events:cooldown.gif") }, footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: message.author.displayAvatarURL({ dynamic: true, format: 'jpg', size: 32 }) } }] })
                return cooldown.set(message.author.id, Date.now() + 99999999999999)
            } else {
                await db.query(`update users set commands = commands + 1  where id = '${message.author.id}'`)
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
            }
            if ((Math.floor(Math.random() * 200)) === 16) message.reply({ content: t("events:mendingu") })
            if (!ray.config.TRUSTED_BOTS.includes(message.author.id)) {
                cooldown.set(message.author.id, Date.now() + ctime)
                setTimeout(() => cooldown.delete(message.author.id), ctime)
            }
            comando.setT(t); new Promise(async (res, rej) => {
                message.channel.sendTyping()
                await res(comando.execute({ message, args, db, query, user, command, comando, noargs }, t))
            }).catch(e => {
                message.reply({ embeds: [{ color: ray.colors.red, title: t("events:erro.title", { shorin: ray.emotes.shorin, pika: ray.emotes.pikapalm }), description: t("events:erro.desc", { support: ray.config.SUPPORT_SERVER }) + `\n\n\`\`\`js\n${e.message}\`\`\` `, footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true }) } }] })
                ray.channels.cache.get(ray.config.REPORT_CHANNEL_ID).send({ embeds: [{ color: ray.colors.red, title: user.prefix + comando.config.name, description: `Autor: **${message.author} ${message.author.id}**\n\nChat: **${message.channel.name} ${message.channel.id} (Tipo: ${message.channel.type}, NSFW: ${message.channel.nsfw})**`, fields: [{ name: `Argumentos:`, value: `\`\`\`diff\n- ${!(args.join(" ")) ? 'Sem argumentos' : args.join(" ")}\`\`\``, }, { name: 'Erro:', value: ` \`\`\`js\n${e.stack.length > 1800 ? `${e.stack.slice(0, 1800)}...` : e.stack}\`\`\` ` }] }] })
            });
        }
    }
}