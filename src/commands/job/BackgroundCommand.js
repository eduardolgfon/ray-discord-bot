const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js')
const Structure = require('../../components/structures')
module.exports = class BackgroundCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: 'background',
            multiLanguageName: true,
            aliases: ["papeldeparede", "fondodelperfil", 'wallpaper'],
            category: 'social',
            cooldown: 5,
            dm: true,
            workInThreads: true,
            Rayperm: ['MANAGE_MESSAGES', 'ATTACH_FILES'],
            Memberperm: [],
            dev: false,
            testCommand: ['']
        })
    }
    async execute({ message, db, user, noargs }, t) {
        if (!message.attachments.first()) return message.reply({ embeds: [noargs] })
        var yesButton = new MessageButton()
            .setCustomId('YES_BUTTON')
            .setLabel(t("events:confirm.yes"))
            .setStyle('SUCCESS')
            .setEmoji('785504007778336788')
        var noButton = new MessageButton()
            .setCustomId('NO_BUTTON')
            .setLabel(t("events:confirm.no"))
            .setStyle('DANGER')
            .setEmoji('847312373361541160')

        if (!user.background) var value = 10000
        else var value = 5000
        async function verificarCats() {
            var user = await db.query(`select * from users where id = '${message.author.id}'`)
            if (parseInt(user.cats) < parseInt(value)) {
                yesButton.setDisabled(true)
                message.errorEmbed(t("events:cats-false", { member: message.author.toString() }));
                return false
            } else if (parseInt(user.cats) > parseInt(value)) return true
        }
        if (await verificarCats() === false) return;
        var msg = await message.rayReply('carregando', t("events:image.loading"))
        const confirm = new MessageActionRow().addComponents(yesButton, noButton);

        var member = message.author
        const ray = this.ray
        delete require.cache[require.resolve("../../components/ProfileGenerator")]
        const { generateProfile } = require("../../components/ProfileGenerator")
        const bah = true
        let image = await generateProfile({ message, ray, member, db, bah }, t)
        var embedConfirm = {
            color: this.ray.colors.yellow,
            title: t("commands:background.title"),
            description: t("commands:background.desc", { sadcat4: this.ray.emotes.sadcat4, sadcat6: this.ray.emotes.sadcat6, value: value.toLocaleString(user.lang) })
        }
        msg.delete().catch(e => { });
        var msgConfirm = await message.reply({ embeds: [embedConfirm], components: [confirm], files: [new MessageAttachment(image, 'profile.jpg')] }).catch(e => { })
        setTimeout(() => {
            yesButton.setDisabled(true)
            noButton.setDisabled(true)
            var confirm = new MessageActionRow().addComponents(yesButton, noButton)
            msgConfirm.edit({ embeds: [embedConfirm], components: [confirm] }).catch(e => { });
        }, 120000);
        const confirmCollector = await msgConfirm.createMessageComponentCollector({ filter: ((i) => i.user.id === message.author.id), time: 120000 });
        confirmCollector.on('collect', async (i) => {
            switch (i.customId) {
                case 'YES_BUTTON':
                    if (await verificarCats() === false) return await i.deferUpdate();
                    var embed = new MessageEmbed()
                        .setColor(this.ray.colors.green)
                        .setTitle('Background alterado ' + this.ray.emotes.autorizado)
                        .setDescription(`Agora o seu perfil está assim:`)
                        .setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ format: 'jpg', dynamic: true }))
                    var canal = await this.ray.channels.fetch('860858806320627722')

                    try {
                        canal.send({ content: `Usuário: ${message.author.tag} (ID: ${message.author.id})`, files: [{ attachment: message.attachments.first().url + '?width=1280&height=720', name: message.attachments.first().name }] })
                            .then(async msg => {
                                await db.query(`update users set 
                            background = '${msg.id}',
                            cats = cats - ${parseInt(value)}
                            where id = '${message.author.id}'`)
                                await this.ray.newTransation(message.author, `2/${value}/${Date.now()}`)

                            })
                    } catch (e) {
                        return message.errorEmbed(t("commands:background.error") + this.ray.emotes.fodar)
                    }
                    msgConfirm.delete().catch(e => { })
                    message.reply({ embeds: [embed], files: [new MessageAttachment(image, 'profile.jpg')] }).catch(e => { })
                    break
                case 'NO_BUTTON':
                    msgConfirm.edit({
                        embeds: [{
                            color: this.ray.colors.red,
                            title: 'Troca de background cancelada ' + this.ray.emotes.negado,
                            description: 'Nenhum sad cat foi tirado da sua conta',
                            footer: {
                                text: t("events:footer.f1", { prefix: user.prefix }),
                                icon_url: message.author.displayAvatarURL({ format: 'jpg' })
                            }
                        }], components: []
                    }).catch(e => { })
                    break
            }
        })
    }
}