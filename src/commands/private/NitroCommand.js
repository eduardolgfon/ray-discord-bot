const Structure = require("../../components/structures")
module.exports = class NitroCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "nitro",
            category: "private",
            aliases: ["nitror", "notri", "notrer"],
            cooldown: 4,
            dm: false,
            Memberperm: [],
            Rayperm: ["MANAGE_WEBHOOKS"],
            dev: false,
            testCommand: []
        })
    }
    async execute({ message }, t) {
        message.delete().catch(e => { });
        var webhook = await message.channel.createWebhook("Cl̶yde", { avatar: 'https://media.discordapp.net/attachments/788376558271201290/817010542237057044/unknown.png' })
            .catch(e => message.errorEmbed('Este canal está lotado de webhooks, por favor apague alguns para que este comando funcione corretamente'))
        await webhook.send('https://preview.redd.it/xedy9ugkqo621.png?auto=webp&s=d508969a6c3963ac3ff844a31f755fc0f18f91de')
        webhook.delete().catch(e => { })
    }
}