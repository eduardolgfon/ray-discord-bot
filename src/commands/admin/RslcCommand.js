const Structure = require("../../components/structures")
const { inspect } = require('util')
const { MessageEmbed } = require('discord.js')
const moment = require("moment")
require("moment-duration-format")
const cpuStat = require("cpu-stat")
const cld = require('child_process')
const axios = require('axios')
const fs = require('fs')
module.exports = class RslcCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "rslc",
            aliases: ["r"],
            category: "admin",
            cooldown: 1,
            dm: true,
            workInThreads: true,
            Memberperm: [],
            Rayperm: [],
            dev: true,
            testCommand: ['create_invite 761424522259202108']
        })
    }
    async execute({ message, args, user, db, query }, t) {
        const ray = this.ray
        if (!args[0]) return message.reply({
            embeds: [{
                color: this.ray.colors.yellow,
                title: "Comandos para Devs",
                description: "logs\nblacklist {add/remove} {id}\ncreate_invite {guild ID}\nchange_avatar {link/imagem}\maintenance {commandName} {motivo}\nlive_status {tempo em segundos}s\nsearch_user {UserID}\nsend {dm/chat/fake/nada} {mensagem/attachment}\nclear_cache {users} {tempo de inatividade}\nreload {comando/evento/all} {commandName/EventName}"
            }]
        })
        switch (args[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")) {
            case 'logs':
                var embed = new MessageEmbed()
                cld.exec(`cat src/json/logs.txt`, (e, stdout, stderr) => {
                    if (e || stderr) {
                        embed.setTitle('ihh deu merda viado')
                            .setColor(ray.colors.red)
                            .setDescription(`\`\`\`bash\n${e.slice(0, 3900)}\`\`\``)

                        return message.reply({ embeds: [embed] })
                    }
                    embed.setTitle('Terminal')
                        .setColor(this.ray.colors.orange)
                        .setDescription(`\`\`\`fix\n${stdout}\`\`\``)
                    message.reply({ embeds: [embed] })
                })
                break
            case 'create_invite':
                if (!args.slice(1).join(" ")) return message.rayReply("error", "ID inválido")
                let guild = await this.ray.guilds.cache.get(args[1]) || this.ray.guilds.find(g => g.name === args.slice(1).join(" "))
                if (!guild) return message.rayReply("error", "Servidor não encontrado.")
                if (!guild.me.permissions.has("CREATE_INSTANT_INVITE")) return message.rayReply("error", "eu não tenho permissão para criar convites neste servidor.")
                let f = 0
                guild.channels.cache.map((c) => {
                    if (f === 0) {
                        if (c.type === "GUILD_TEXT") {
                            if (c.permissionsFor(this.ray.user).has("VIEW_CHANNEL") === true) {
                                if (c.permissionsFor(this.ray.user).has("CREATE_INSTANT_INVITE") === true) {
                                    c.createInvite().then(invite => message.reply("https://discord.gg/" + invite))
                                    f = 1
                                }
                            }
                        }
                    }
                })
                break
            case 'maintenance':
                if (!args[1]) return message.rayReply("negado", "você não informou um comando")
                var command = this.ray.commands.get(args[1]) || this.ray.aliases.get(args[1])
                if (!command) return message.rayReply("negado", "Comando não encontrado.")
                let cmd = await db.query(`select * from commands where name = '${command.config.name}'`)
                cmd = cmd.rows[0]

                if (cmd.maintenance) {
                    await db.query(`update commands set maintenance = false where name = '${command.config.name}'`)
                    message.rayReply("autorizado", "Comando removido da manutenção.")
                } else {
                    await db.query(`update commands set maintenance = true where name = '${command.config.name}'`)
                    message.rayReply("warn", "comando adicionado a manutenção.")
                }
                break
            case 'change_avantar':
                if (message.attachments.first()) {
                    this.ray.user.setAvatar(message.attachments.first().url).then(bot => {
                        var embed = new MessageEmbed()
                            .setColor(this.ray.colors.yellow)
                            .setAuthor(t("commands:changeavatar.avatar"), bot.displayAvatarURL())
                            .setImage(`${bot.displayAvatarURL({ size: 2048 })}`)
                        message.reply({ embeds: [embed] })
                    })
                } else {
                    if (!args[1]) return message.rayReply("negado", t("commands:changeavatar.args-null"))
                    this.ray.user.setAvatar(args[1]).then(bot => {
                        var embed = new MessageEmbed()
                            .setColor(this.ray.colors.yellow)
                            .setAuthor(t("commands:changeavatar.avatar"), bot.displayAvatarURL())
                            .setImage(`${bot.displayAvatarURL({ size: 2048 })}`)
                        message.reply({ embeds: [embed] })
                    })
                }
                break
            case 'blacklist':
                var member = await this.findUser(message, args, 2)
                if (member.id == message.author.id) return message.rayReply("negado", "usuário não encontrado.")
                switch (args[1]) {
                    case "add":
                        await db.query(`insert into usersconfig (id, banned, reason) VALUES('${member.id}', true, '${args.slice(3).join(" ")}')`)
                        message.rayReply("autorizado", "Usuário adicionado a blacklist.")
                        member.send({
                            embeds: [{
                                color: this.ray.colors.red,
                                title: 'Você foi banido ' + this.ray.emotes.sadcat4,
                                description: `Você acaba de ser banido de usar qualquer comando ou funcionalidade da Ray pelo motivo \`${args.slice(3).join(" ")}\` e dependendo do que tenha feito, será igualmente banido no meu servidor e bots parceiros, caso deseje contestar o seu banimento pode me enviar sua mensagem agora que eu a encaminharei à minha equipe\n\nTenha um péssimo dia e vá se fuder ` + this.ray.emotes.pistolao,
                            }]
                        }).catch(e => { });
                        break
                    case "remove":
                        await db.query(`delete from usersconfig where id = '${member.id}'`)
                        message.rayReply("autorizado", "Usuário removido da blacklist.")
                        break
                    default:
                        message.rayReply("negado", "use {add/remove} {id}")
                }
                break
            case 'live_status':
                if (!args[1]) return message.rayReply('negado', 'Vocẽ não informou o tempo de atualização!')
                var msg = await message.channel.send({ content: this.ray.emotes.carregando + " **| Carregando Menu de Estatísticas Avançadas**" })
                var interval = setInterval(() => {
                    const duration = moment.duration(ray.uptime).format(" dd[d] hh[h] mm[m] ss[s]")
                    cpuStat.usagePercent(function (err, percent, seconds) {
                        var users = (0 - Number(ray.guilds.cache.size)); ray.guilds.cache.map(g => users += g.memberCount)
                        var embed = new MessageEmbed()
                        embed.setColor(ray.colors.hardblue)
                        embed.addField(t("commands:botinfo.quser"), `\`\`\`css\n${users}\`\`\``, true)
                        embed.addField(t("commands:botinfo.qserver"), `\`\`\`css\n${ray.guilds.cache.size}\`\`\``, true)
                        embed.addField(t("commands:botinfo.cpu-status"), `\`\`\`fix\n${percent.toFixed(2)}%\`\`\``, true)
                        embed.addField(t("commands:botinfo.memory"), `\`\`\`fix\n${Math.round(process.memoryUsage().rss / 1024 / 1024).toString()}MB\`\`\``, true)
                        embed.addField(t("commands:botinfo.uptime"), `\`\`\`fix\n${duration}\`\`\``, true)
                        msg.edit({ embeds: [embed] }).catch(e => clearInterval(interval));
                    })
                }, Number(args[1].replace('s', '') * 1000))
                break
            case 'find_user':
                var member = await this.findUser(message, args, 1)
                var userBan = await query(`select * from usersconfig where id = '${member.id}'`)
                var userdb
                var databaseQuery = "var userdb = await query(`select * from users where id = '${member.id}'`);\nreturn userdb"
                var getUser = await eval((`async function aifdjsfnjsnf() {\n${databaseQuery}\n}\naifdjsfnjsnf()`))
                getUser = inspect(getUser, { depth: 1 })
                var comonGuilds = ''
                await this.ray.guilds.cache.forEach(async guild => {
                    var guildMember = guild.members.cache.get(member.id)
                    if (guildMember) comonGuilds += `- ${guild.name} (Membros: ${guild.memberCount} | ID: ${guild.id})\n\n`
                })
                if (comonGuilds === '') comonGuilds = 'Nenhum'
                const userinfoEmbed = new MessageEmbed()
                    .setAuthor(member.tag)
                    .setThumbnail(member.displayAvatarURL({ format: 'jpg', dynamic: true }))
                    .setDescription(`**Usuário: ${member} (ID: ${member.id})**`)

                if (!userBan) userinfoEmbed.addField('Status de Banimento:', "```md\n# O Usuário não está banido.```")
                else if (userBan.banned) {
                    userinfoEmbed.setColor(this.ray.colors.red)
                    userinfoEmbed.addField('Status de Banimento:', "```diff\n- O Usuário está Banido.```")
                    userinfoEmbed.addField("Motivo do Banimento:", "```diff\n- " + userBan.reason + "```")
                } else {
                    userinfoEmbed.setColor(ray.colors.blue)
                    userinfoEmbed.addField('Status de Banimento:', "```md\n# O Usuário não está banido.```")
                }
                userinfoEmbed.addField('Database:', '```js\n' + getUser.slice(0, 900) + '```')
                userinfoEmbed.addField('Servidores em comum:', '```diff\n' + comonGuilds.slice(0, 900) + '```')
                // if(!userdb.background) {}
                // else {
                //     var search = await ray.channels.cache.get('860858806320627722').messages.fetch(userdb.background)
                //     userinfoEmbed.addField('Background:', 'ㅤ')
                //     userinfoEmbed.setImage(search.attachments.first().url+'?width=1280&height=720')
                // }

                message.reply({ embeds: [userinfoEmbed] })
                break
            case 'send':
                try {
                    switch (args[1]) {
                        case 'chat':
                            var canal = await this.ray.channels.fetch(args[2])
                            if (message.attachments.first()) canal.send({ content: args.slice(3).join(" "), files: [{ attachment: message.attachments.first().url, name: message.attachments.first().name }] })
                            else canal.send(args.slice(3).join(" "))
                            message.rayReply('autorizado', 'Mensagem enviada com sucesso')
                            break
                        case 'fake':
                            var canal = await this.ray.channels.fetch(args[2])
                            canal.sendTyping()
                            setTimeout(() => canal.send(args.slice(3).join(" ")), 5000)
                            message.rayReply('autorizado', 'Mensagem enviada com sucesso')
                            break
                        case 'dm':
                            let user = await this.ray.users.fetch(args[2])
                            if (message.attachments.first()) user.send({ content: args.slice(3).join(" "), files: [{ attachment: message.attachments.first().url, name: message.attachments.first().name }] })
                            else user.send(args.slice(3).join(" "))
                            message.rayReply('autorizado', 'Mensagem enviada com sucesso')
                            break
                        case 'karen':
                            if (!this.ray.karen) return message.rayReply('negado', 'O Client Karen não foi iniciado')
                            var channel = await this.ray.karen.channels.fetch(message.channel.id)
                            channel.send(args.slice(2).join(" "))
                            break
                        default:
                            message.channel.send(args.slice(1).join(" "));
                            message.delete().catch(e => { })
                            break
                    }
                } catch (e) {
                    message.rayReply('negado', 'Não foi possível enviar a mensagem')
                }
                break
            case 'clear_cache':
                try {
                    this.ray.sweepUsers(args[2])
                    message.rayReply('autorizado', `Todos os usuários inativos a mais de ${args[2]} minutos foram varridos do cache!`)
                } catch {
                    message.rayReply('negado', "Não foi possível realizar a varredura do cache!")
                }
                break
            case 'reload':
                if (!args[1]) return message.rayReply('negado', 'comando não encontrado')
                if (['all', '*'].includes(args[1])) {
                    const msg = await message.rayReply('carregando', 'Lendo arquivos de locales...\n')
                    await ray.inicializeLocales()
                    await msg.edit(msg.content.replace(this.ray.emotes.carregando, this.ray.emotes.autorizado) + '\n' + this.ray.emotes.carregando + ' **| Lendo arquivos comandos**')
                    await ray.loadCommands('../../commands/')
                    await msg.edit(msg.content.replace(this.ray.emotes.carregando, this.ray.emotes.autorizado) + '\n' + this.ray.emotes.carregando + ' **| Recarregando comandos**')
                    let commands = []
                    await ray.commands.forEach(async c => commands.push(c.config.name))
                    await commands.forEach(async c => await ray.reloadCommand(c))
                    return msg.edit(msg.content.replace(this.ray.emotes.carregando, this.ray.emotes.autorizado) + '\n' + this.ray.emotes.autorizado + ' **| Comandos atualizados**')
                } else {
                    const rst = this.ray.reloadCommand(args[1])
                    if (rst instanceof Error) return message.rayReply("negado", `Não consegui recarregar este comando :(\n\`\`\`js${rst}\`\`\``)
                    if (rst === false) return message.rayReply("negado", `Não encontrei nenhum comando com o nome ${args[1]}`)
                }
                message.rayReply("autorizado", `Comando recarregado com sucesso.`)
                break
            case 'upload':
                if (!message.attachments.first()) return message.reply('cade o arquivo porra')
                var msg = await message.rayReply('carregando', `baixando arquivo...`)
                try {
                    var request = await axios({
                        method: 'get',
                        url: message.attachments.first().url,
                        responseType: 'stream'
                    })
                    await request.data.pipe(fs.createWriteStream(message.attachments.first().name))
                    msg.edit(ray.emotes.autorizado + `** | O arquivo \`${message.attachments.first().name}\` foi baixado com sucesso.**`)
                } catch (e) {
                    message.reply(`Erro ao baixar arquivo\n` + e)
                }
                break
            default:
                message.reply({
                    embeds: [{
                        color: this.ray.colors.yellow,
                        title: "Comandos para Devs",
                        description: "blacklist {add/remove} {id}\ncreate_invite {guild ID}\nchange_avatar {link/imagem}\maintenance {commandName} {motivo}\nlive_status {tempo em segundos}s\nsearch_user {UserID}\nsend {dm/chat/fake/nada} {mensagem/attachment}\nclear_cache {users} {tempo de inatividade}\nreload {comando/evento/all} {commandName/EventName}"
                    }]
                })
        }
    }
}