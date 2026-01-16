const { MessageEmbed } = require('discord.js')
const moment = require("moment")
require("moment-duration-format")
const i18next = require("i18next")
const cooldown = new Map();

module.exports = class interactionCreate {
    constructor(ray) {
        this.ray = ray
        this.commands = [
            {
                name: 'cj',
                description: '〔🤣〕 Versão melhorada do Vieirinha da Loritta com mais de 30 respostas diferentes.',
                options: [{
                    name: 'pergunta',
                    type: 'STRING',
                    description: 'Faça uma pergunta',
                    required: true,
                }],
            },
            {
                name: 'coinflip',
                description: '〔🤣〕 Jogue cara ou coroa.'
            },
            {
                name: 'gay',
                description: '〔🤣〕 descubra o quão gay alguém é.',
                options: [{
                    name: 'usuário',
                    type: 'USER',
                    description: 'escolha algum usuário',
                    required: true,
                }],
            },
            {
                name: 'hack',
                description: '〔🤣〕 hackeie um usuário e obtenha informações.',
                options: [{
                    name: 'usuário',
                    type: 'USER',
                    description: 'escolha algum usuário',
                    required: true,
                }],
            },
            {
                name: 'nitro',
                description: '〔🤣〕 Envia uma imagem de nitro falsa.'
            },
            {
                name: 'say',
                description: '〔🤣〕 Faça eu dizer qualquer coisa com o meme de citação.',
                options: [{
                    name: 'mensagem',
                    type: 'STRING',
                    description: 'Escreva algo',
                    required: true,
                }],
            },
            {
                name: 'userfake',
                description: '〔🤣〕 Crie uma mensagem falsa de um usuário.',
                options: [{
                    name: 'usuário',
                    type: 'USER',
                    description: 'Escolha algum usuário',
                    required: true,
                }, {
                    name: 'mensagem',
                    type: 'STRING',
                    description: 'Escreva algo',
                    required: true,
                }]
            },
            {
                name: 'barry',
                description: 'Crie um meme do Barry em frente de uma lápide',
                options: [{
                    name: 'usuário',
                    type: 'USER',
                    description: 'Escolha algum usuário',
                    required: true,
                }, {
                    name: 'mensagem',
                    type: 'STRING',
                    description: 'Escreva algo',
                    required: true,
                }]
            },
            {
                name: 'clyde',
                description: 'Crie uma mensagem do Clyde',
                options: [{
                    name: 'mensagem',
                    type: 'STRING',
                    description: 'Escreva algo',
                    required: true,
                }],
            },
            {
                name: 'cmm',
                description: 'Crie uma imagem do meme Change My Mind',
                options: [{
                    name: 'texto',
                    type: 'STRING',
                    description: 'Escreva algo',
                    required: true,
                }],
            },
            {
                name: 'deception',
                description: 'Crie um meme do Philip de Futurama lendo algo e ficando triste',
                options: [{
                    name: 'texto',
                    type: 'STRING',
                    description: 'Escreva algo',
                    required: true,
                }],
            },
            {
                name: 'hackerman',
                description: 'Crie uma imagem do Hackerman com avatar',
                options: [{
                    name: 'usuário',
                    type: 'USER',
                    description: 'Escolha algum usuário',
                    required: true,
                }]
            },
            {
                name: 'resize',
                description: 'Redimensione qualquer imagem',
                options: [{
                    name: 'link',
                    type: 'STRING',
                    description: 'Cole o link da imagem',
                    required: true,
                },
                {
                    name: 'dimensoes',
                    type: 'STRING',
                    description: 'Escreva as dimensões da imagem (ex: 1280 720)',
                    required: true,
                }]
            },
            {
                name: 'shithead',
                description: 'Crie uma imagem de uma pessoa com cocô na cabeça falando algo',
                options: [{
                    name: 'texto',
                    type: 'STRING',
                    description: 'Escreva algo',
                    required: true,
                }]
            },
            {
                name: 'stonks',
                description: 'Crie uma imagem de uma pessoa com cocô na cabeça falando algo',
                options: [{
                    name: 'texto',
                    type: 'USER',
                    description: 'Escolha algum usuário',
                    required: false,
                }]
            },
            {
                name: 'ping',
                description: "pong"
            },
            {
                name: 'reload',
                description: "pong"
            }
        ]
    }
    async start(interaction) {
        if (!interaction.isCommand() || interaction.channel.type === 'DM') return;
        if (interaction.user.id != '568493382884917258') {
            const embed = new MessageEmbed()
                .setTitle('Slash Commands ainda não estão disponíveis')
                .setColor(this.ray.colors.pink)
                .setDescription(`Se você não sabe o que são Slash Commands, são estes comandos que começam com / (slash)\nNo futuro, o Discord vai exigir uma verificação para que bots possam ler mensagens, e os que não passarem, vão ter que ser migrados para os slash commands, o que não é fácil e demanda muito tempo.\n\nOs meus comandos ainda não foram migrados, se tiver alguma dúvida você pode entrar no meu [servidor](${this.ray.config.SUPPORT_SERVER})`)
            return interaction.reply({ embeds: [embed] })
        }

        const ray = this.ray
        const db = this.ray.db
        async function query(query) {
            var value = await db.query(`${query}`)
            return value.rows[0]
        }
        var user = await query(`select * from users where id = '${interaction.user.id}'`)
        var server = await query(`select * from servers where id = '${interaction.guild.id}'`)
        var userconfig = await query(`select * from usersconfig where id = '${interaction.user.id}'`)
        if (!server) {
            await db.query(`insert into servers (id) values('${interaction.guild.id}')`)
            var server = await query(`select * from servers where id = '${interaction.guild.id}'`)
        }
        if (userconfig && userconfig.banned) return;
        let t
        const setFixedT = function (translate) { t = translate }
        setFixedT(i18next.getFixedT(user.lang))
        interaction.t = t
        interaction.prefix = user.prefix

        if (!user) {
            await db.query(`insert into users (id) values('${interaction.user.id}')`)
            user = await query(`select * from users where id = '${interaction.user.id}'`)
        }
        // const args = message.content.slice(user.prefix.length).trim().split(/ +/g)
        // const command = args.shift().normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
        var comando = this.ray.commands.get(interaction.commandName)
        if (!comando) return;
        var cmd = await query(`select * from commands where name = '${comando.config.name}'`)
        if (comando.config.dev && !ray.config.DEVS.includes(interaction.user.id)) return interaction.reply({ embeds: [{ color: ray.colors.hardblue, title: t("events:cooldown.title", { stop: ray.emotes.stop }), description: t("events:dev", { negado: ray.emotes.negado }), thumbnail: { url: t("events:noargs.thumb") }, footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: interaction.user.displayAvatarURL({ dynamic: true, format: 'jpg', size: 32 }) } }] })
        if (cmd.maintenance && !ray.config.DEVS.includes(interaction.user.id)) return interaction.reply({ embeds: [{ color: ray.colors.red, title: ray.emotes.stop + t("events:manutencao.commandTitle") + ray.emotes.stop, description: t("events:manutencao.commandDesc", { reason: cmd.reason }), footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: interaction.user.displayAvatarURL({ format: 'jpg', dynamic: true }) } }] })
        if (interaction.channel.type.includes('THREAD') && !comando.config.workInThreads) return interaction.errorEmbed(t("events:not-work-in-threads"), t, prefix)

        let ctime = Number(comando.config.cooldown) * 1000
        if (cooldown.has(interaction.user.id)) {
            if (cooldown.get(interaction.user.id) > 19999999999999) return;
            let time = cooldown.get(interaction.user.id)
            interaction.reply({ embeds: [{ color: ray.colors.hardblue, title: t("events:cooldown.title", { stop: ray.emotes.stop }), description: t("events:cooldown.message", { negado: ray.emotes.negado, time: (time - Date.now() > 1000) ? moment.utc(time - Date.now()).format(`s [${t("events:cooldown.secounds")}]`) : moment.duration(time - Date.now()).format(`[${t("events:cooldown.milliseconds")}]`) }), thumbnail: { url: t("events:cooldown.gif") }, footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: interaction.user.displayAvatarURL({ dynamic: true, format: 'jpg', size: 32 }) }, ephemeral: true }] })
            return cooldown.set(interaction.user.id, Date.now() + 99999999999999)
        } else {
            if (user.commands === 50) interaction.reply({ content: t("events:have-a-suggestion"), ephemeral: true })
            await db.query(`update users set commands = commands + 1  where id = '${interaction.user.id}'`)
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
                footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: interaction.user.displayAvatarURL({ format: 'jpg', dynamic: true }) }
            }
            await query(`update servers set guildcount = guildcount+1  where id = '${interaction.guild.id}'`)
        }
        if ((Math.floor(Math.random() * 200)) === 16) interaction.reply({ content: t("events:mendingu"), ephemeral: true })
        if (ray.config.TRUSTED_BOTS.includes(interaction.user.id) || ray.config.DEVS.includes(interaction.user.id)) { } else {
            cooldown.set(interaction.user.id, Date.now() + ctime)
            setTimeout(() => cooldown.delete(interaction.user.id), ctime)
        }
        // let Memberperms = []
        let Rayperms = []
        try {
            // comando.config.Memberperm.forEach(p => Memberperms.push(p))
            comando.config.Rayperm.forEach(p => Rayperms.push(p))
        } catch (e) { }
        Rayperms.push('SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY')
        // if (Memberperms[0]) {
        //   if (!message.member.permissions.has(Memberperms)) {
        //     let perm = Memberperms.map(value => t(`permissions:${value}`)).join(", ")
        //     return interaction.channel.send(this.ray.emotes.negado + `** | ${t("permissions:USER_MISSING_PERMISSION", { perm: perm })}**`)
        //   }
        // }
        if (!interaction.guild.me.permissions.has(Rayperms) || !interaction.channel.permissionsFor(ray.user.id).has(Rayperms)) {
            let perm = Rayperms.map(value => t(`permissions:${value}`)).join(", ")
            return interaction.channel.send(this.ray.emotes.negado + `** | ${t("permissions:CLIENT_MISSING_PERMISSION", { perm: perm })}**`).catch(e => interaction.user.send(this.ray.emotes.negado + `** | ${t("permissions:CLIENT_MISSING_PERMISSION", { perm: perm })}**`)).catch(e => { });
        }
        comando.setT(t); new Promise(async (res, rej) => {
            comando.config.name === 'userfake' ? {} : interaction.channel.sendTyping()
            try {
                await res(comando.slash({ interaction, db, query, user, server, comando, noargs }, t))
            } catch (e) {
                rej(e)
                interaction.reply({ embeds: [{ color: ray.colors.red, title: t("events:erro.title", { shorin: ray.emotes.shorin, pika: ray.emotes.pikapalm }), description: t("events:erro.desc", { support: ray.config.SUPPORT_SERVER }) + `\n\n\`\`\`js\n${e.message}\`\`\` `, footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: interaction.user.displayAvatarURL({ format: 'jpg', dynamic: true }) } }] })
                // ray.channels.cache.get(ray.config.REPORT_CHANNEL_ID).send({ embeds: [{ color: ray.colors.red, title: user.prefix + comando.config.name, description: `Autor: **${interaction.user} ${interaction.user.id}**\nGuild: **${interaction.guild.name} (${interaction.guild.id}**)\n\nChat: **${interaction.channel.name} ${interaction.channel.id} (Tipo: ${interaction.channel.type}, NSFW: ${interaction.channel.nsfw})**`, fields: [{ name: `Argumentos:`, value: `\`\`\`diff\n- ${!(args.join(" ")) ? 'Sem argumentos' : args.join(" ")}\`\`\``, }, { name: 'Erro:', value: ` \`\`\`js\n${e.stack.length > 1800 ? `${e.stack.slice(0, 1800)}...` : e.stack}\`\`\` ` }] }] })
            }
        })
        if (ray.config.CLIENT_CANARY) return;
        // ray.channels.cache.get(ray.config.LOGS_CHANNEL_ID).send({
        //     embeds: [{
        //         color: ray.colors.yellow,
        //         title: user.prefix + command,
        //         fields: [{
        //             name: `Autor:`, value: interaction.user.toString() + '\n```md\n# ' + `(TAG: ${interaction.user.tag}, ID: ${interaction.user.id})` + '```'
        //         }, {
        //             name: 'Servidor:', value: '```fix\n' + `${interaction.guild.name} (ID: ${interaction.guild.id})` + '```'
        //         }, { name: 'Argumentos:', value: '```diff\n- ' + (!args.join(" ") ? 'Nenhum argumento' : args.join(" ")) + '```' }]
        //     }]
        // })
    }
}