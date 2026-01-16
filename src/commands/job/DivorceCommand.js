const Structure = require('../../components/structures')
const { MessageButton, MessageActionRow } = require('discord.js')

module.exports = class DivorceCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: 'divorce',
            multiLanguageName: true,
            aliases: ['divorciar', "divorciarse", 'libertar-se'],
            category: 'social',
            cooldown: 3,
            dm: true,
            workInThreads: true,
            Memberperm: [],
            Rayperm: ['MANAGE_MESSAGES'],
            dev: false,
            testCommand: []
        })
    }
    async execute({ message, db, user }, t) {
        const ray = this.ray
        function verificarMarry() {
            if (!user.marry) {
                message.errorEmbed(t("commands:divorce.error") + ray.emotes.pistolao)
                return false
            } else return true
        }
        if (verificarMarry() !== true) return;
        var marry = await this.findUser(message, user.marry)

        var yesButton = new MessageButton()
            .setCustomId('yes')
            .setLabel(t("events:confirm.yes"))
            .setStyle("SUCCESS")
            .setEmoji('💔')
        var confirm = new MessageActionRow().addComponents(yesButton)

        const embed = {
            color: this.ray.colors.red,
            title: t("commands:divorce.title") + this.ray.emotes.pepesadcat + this.ray.emotes.broken,
            description: t("commands:divorce.desc", { author: message.author.toString(), marry: marry.toString() }),
            footer: {
                text: t("events:footer.f1", { prefix: user.prefix }),
                icon_url: message.author.displayAvatarURL({ format: 'jpg' })
            }
        }
        var msg = await message.reply({ embeds: [embed], components: [confirm] })
        setTimeout(() => {
            yesButton.setDisabled(true)
            var confirm = new MessageActionRow().addComponents(yesButton)
            msg.edit({ embeds: [embed], components: [confirm] }).catch(e => { });
        }, 120000);
        const confirmCollector = await msg.createMessageComponentCollector({ filter: ((i) => i.user.id === message.author.id), time: 120000 })
        confirmCollector.on('collect', async (i) => {
            if (verificarMarry() !== true || marry.id === message.author.id) return;
            await db.query(`update users set 
            marry = null,
            marrytimestamp = null
            where id = '${message.author.id}'`)
            await db.query(`update users set 
            marry = null,
            marrytimestamp = null
            where id = '${marry.id}'`)
            msg.delete().catch(e => { });
            message.reply({
                embeds: [{
                    color: this.ray.colors.red,
                    title: t("commands:divorce.title") + this.ray.emotes.pepesadcat + this.ray.emotes.broken,
                    description: t("commands:divorce.yesDesc", { author: message.author.toString(), marry: marry.toString() }) + this.ray.emotes.shorin + this.ray.emotes.sadcat1,
                    footer: {
                        text: t("events:footer.f1", { prefix: user.prefix }),
                        icon_url: message.author.displayAvatarURL({ format: 'jpg' })
                    }
                }]
            }).catch(e => { })
        })
    }
}