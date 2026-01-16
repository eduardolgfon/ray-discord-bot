const { MessageEmbed } = require("discord.js");
const catsCooldown = new Set();

module.exports = class MessageGuard {
    constructor(ray) {
        this.ray = ray
    }
    async start(message) {
        var contentFiltred = message.content.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
        if (contentFiltred.includes(this.ray.token.toLowerCase())) {
            var embed = new MessageEmbed()
                .setColor(this.ray.colors.red)
                .setTitle(this.ray.emotes.emergencia + " FUDEU CARAI VAZOU O TOKEN " + this.ray.emotes.emergencia2)
                .setDescription(`Autor da mensagem: ${message.author} (ID: ${message.author.id}, TAG: \`${message.author.tag}\`)\n\nChat: \`${message.channel.name}\` (ID: ${message.channel.id})\n\nGuild: \`${message.guild.name}\` (ID: ${message.guild.id}) `)
            embed.setFooter('Apaguei a mensagem que continha o token')
            message.delete().catch(e => embed.setFooter('Não consegui apagar a mensagem :('))
            this.ray.channels.cache.get('871554300831232030').send({ embeds: [embed] })
        }
        if ((contentFiltred.includes('ray') || contentFiltred.includes(this.ray.user.id)) && !this.ray.config.DEVS.includes(message.author.id)) this.ray.channels.cache.get('859175423820693585').send({
            embeds: [{
                color: this.ray.colors.red,
                author: {
                    name: `${message.author.tag} (${message.author.id})\nGuild: ${message.guild.name} (${message.guild.id})`,
                    icon_url: message.author.displayAvatarURL({ format: "jpg", dynamic: true })
                },
                thumbnail: { url: !message.guild.iconURL({ format: "jpg", dynamic: true }) ? 'https://media.discordapp.net/attachments/788376558271201290/821421343274827833/unknown.png' : message.guild.iconURL({ format: "jpg", dynamic: true }) },
                description: message.content.slice(0, 1000)
            }]
        })

        if (message.channel.type === 'DM' || message.author.bot) return;
        var db = this.ray.db
        var server = await db.query(`select * from serversconfig where id = '${message.guild.id}'`)
        var user = await db.query(`select * from temp where id = '${message.author.id}'`)
        server = server.rows[0]
        user = user.rows[0]
        if (!server) return;

        //      ANTI-INVITE
        if (server.antiinvite && message.guild.me.permissions.has(`BAN_MEMBERS`)) {
            const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi
            if (regex.exec(contentFiltred)) {
                // if (message.member.permissions.has('ADMINISTRATOR')) return;
                try {
                    await db.query(`insert into temp (id, warn) VALUES('${message.author.id}', 1)`)
                } catch (e) {
                    await db.query(`update temp set warn = warn +1 where id = '${message.author.id}'`)
                }
                var user = await db.query(`select * from temp where id = '${message.author.id}'`)
                user = user.rows[0]
                message.delete().catch(e => { })
                switch (Number(user.warn)) {
                    case 1:
                        message.channel.send(`${message.author} **Opa, calma lá amigão, é probido fazer divulgação de servidores aqui, leia as regras antes de conversar no chat**`,);
                        break
                    case 2:
                        message.channel.send(`${this.ray.emotes.emergencia} **| ${message.author} Último aviso! é probido divulgar servidores aqui, leia as regras antes de conversar no chat**`,);
                        break
                    case 3:
                        message.member.kick({ reason: `[AUTO-MOD SYSTEM] - Divulgação de servidores no chat ${message.channel.name}` })
                            .then(async ban => {
                                message.channel.send(`${this.ray.emotes.emergencia} **| ${message.author.tag} (ID: ${message.author.id}) BANIDO por divulgação de servidores, leia as regras da próxima vez**`,);
                                await db.query(`delete from temp where id = '${message.author.id}'`)
                            })
                            .catch(async e => {
                                await db.query(`delete from temp where id = '${message.author.id}'`)
                                message.channel.send(`Para que o \`anti-invite\` funcione corretamente eu preciso de permissão para \`Banir membros\` e ter um cargo acima dos membros comuns`)
                            })
                        break
                }
            }
        }

        //        SAD CATS POR MENSAGENS        
        if (server.catspermsg) {
            var userdb = await db.query(`select * from usersconfig where id = '${message.author.id}'`)
            if (userdb) if (userdb.banned) return;
            if (catsCooldown.has(message.author.id)) return
            else if (contentFiltred.lentgh > 10) db.query(`update users set cats = cats + 1 where id = '${message.author.id}'`).then(bah => { }).catch(e => { });
            catsCooldown.add(message.author.id);
            setTimeout(() => catsCooldown.delete(message.author.id), 5000);
        }
    }
}