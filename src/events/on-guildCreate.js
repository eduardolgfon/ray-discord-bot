const { MessageEmbed, WebhookClient } = require('discord.js')
const i18next = require("i18next")
const translationBackend = require("i18next-node-fs-backend")
const fs = require("fs")

module.exports = class GuildCreate {
    constructor(ray) {
        this.ray = ray
        this.region = {
            'europe': "en-US",
            'us-east': "en-US",
            'japan': "en-US",
            'india': "en-US",
            'eu-west': "en-US",
            'sydney': "en-US",
            'southafrica': "en-US",
            'us-central': "en-US",
            'singapore': "en-US",
            'london': "en-US",
            'frankfurt': "en-US",
            'us-west': "en-US",
            'eu-central': "en-US",
            'us-south': "en-US",
            'hongkong': "en-US",
            'russia': "en-US",
            'south-korea': "en-US",
            'dubai': "en-US",
            'amsterdam': "en-US",
            'brazil': "pt-BR"
        }
    }
    async start(guild) {
        const db = this.ray.db
        await db.query(`INSERT INTO servers (id) VALUES('${guild.id}')`)
        let t
        const setFixedT = function (translate) {
            t = translate
        }
        const language = "pt-BR"
        setFixedT(i18next.getFixedT(language))
        return new Promise(async (resolve, reject) => {
            i18next.use(translationBackend).init({
                ns: ["commands", "events", "permissions"],
                preload: await fs.readdirSync("./src/i18n/"),
                fallbackLng: "pt-BR",
                backend: {
                    loadPath: "./src/i18n/{{lng}}/{{ns}}.json"
                },
                interpolation: {
                    escapeValue: false
                },
                returnEmptyString: false
            }, async (err, f) => {
                if (f) {
                    const guildhook = new WebhookClient({ url: this.ray.config.WEBHOOK_GUILD_ADD });
                    var guildIcon = !guild.iconURL({ format: "jpg", dynamic: true }) ? 'https://media.discordapp.net/attachments/788376558271201290/821421343274827833/unknown.png' : guild.iconURL({ format: "jpg", dynamic: true })
                    const entbed = new MessageEmbed()

                    if (guild.me.permissions.has("VIEW_AUDIT_LOG")) {
                        let fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'BOT_ADD' });
                        let actionLog = fetchedLogs.entries.first();
                        const embed = new MessageEmbed()
                        embed.setColor(this.ray.colors.yellow)
                        embed.setThumbnail(guildIcon)
                        embed.addField(t("events:add.title"), t("events:add.desc", {
                            prefix: this.ray.config.PREFIX,
                            author: actionLog.executor.tag,
                            guild: guild.name
                        }) + '\n\n' + t("events:add.urls", { invite: this.ray.config.BOT_INVITE, support: this.ray.config.SUPPORT_SERVER }))
                        embed.setFooter(t("events:add.footer"))
                        actionLog.executor.send({ embeds: [embed] }).catch(e => { });
                        var name = actionLog.executor.tag
                    } else var name = "¯\\_(ツ)_/¯"
                    entbed.setColor(this.ray.colors.green)
                    entbed.setTitle(guild.name)
                    entbed.setThumbnail(guildIcon)
                    entbed.setDescription(`**${this.ray.emotes.sabridiluiz} Agora eu tenho ${this.ray.guilds.cache.size} servidores ${this.ray.emotes.sabridiluiz}**`)
                    entbed.addField(`ID:`, "```cs\n" + guild.id + "```", true)
                    entbed.addField(`Membros:`, "```fix\n" + guild.memberCount + "```", true)

                    let owner = await guild.fetchOwner()

                    entbed.addField('Propietário do servidor', '```md\n# ' + owner.user.tag + '```')
                    entbed.addField(`Usuário que adicionou:`, "```diff\n- " + name + "```")
                    guildhook.send({
                        username: `Colônia Conquistada`,
                        avatarURL: 'https://media.discordapp.net/attachments/788376558271201290/791002903082434640/1.png',
                        embeds: [entbed],
                    });
                    if (guild.me.permissions.has("MANAGE_ROLES")) {
                        var role = await guild.roles.cache.find(r => r.name === ',help | ,commands')
                        if (!role) {
                            var role = await guild.roles.create({
                                data: {
                                    name: ',help | ,commands',
                                    color: this.ray.colors.pink,
                                }
                            })
                        }
                        guild.me.roles.add(role.id).catch(e => { });
                    }
                    if (guild.me.permissions.has("CHANGE_NICKNAME")) guild.me.setNickname("[ , ] Ray™️ ,help").catch(e => { });
                }
            })
        })
    }
}
