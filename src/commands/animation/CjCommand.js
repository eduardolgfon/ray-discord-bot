const Structure = require("../../components/structures")

module.exports = class CjCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "cj",
            multiLanguageName: false,
            aliases: ["sabio", "sabiocj", "cidinei", "cidiney", "cijei", "carl"],
            category: "animation",
            cooldown: 3,
            dm: false,
            workInThreads: false,
            Memberperm: [],
            Rayperm: ["MANAGE_WEBHOOKS"],
            dev: false,
            testCommand: ['@everyone {@role}', '{@user}']
        })
    }
    async execute({ message, args, noargs }, t) {
        if (!args.join(" ")) return message.reply({ embeds: [noargs] })
        let names = ['Çábio Carro Jonso', 'Experiente Carlos João Enzo', "Sábio Cidinei", 'Sábio Cidiney', 'Zábio Cau Jonço', 'Sábio Cijei']
        let name = names[Math.floor((Math.random() * names.length))]
        let respostas = []
        for (let num = 1; num < 31; num++) respostas.push(t(`commands:cj.${num}`))
        var resposta = respostas[Math.floor((Math.random() * respostas.length))]
        if (args.join(" ").length == 1 && isNaN(args.join(" "))) {
            if (args.join(" ").toLowerCase() == 'z') {
                var resposta = 'Avatetomanocurapá'
            } else {
                let alfa = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',]
                var letra = alfa.indexOf(args.join(" ").toLowerCase())
                letra++
                var resposta = alfa[letra]
            }
        }
        switch (args.join(" ").toLowerCase()) {
            case 'cj': resposta = 'Salve'
                break
            case 'oh shit': resposta = 'Here we go again'
                break
            case 'cj gay': resposta = 'Suck my dick'
                break
            case 'gay': resposta = 'Suck my dick'
                break
            case 'oh shit here we go again': resposta = 'impostor'
                break
            case 'oh shit, here we go again': resposta = 'impostor'
                break
        }
        var messageObject = {
            username: name,
            avatarURL: 'https://media.discordapp.net/attachments/788376558271201290/816180449902198784/imagem.png',
            content: `> ${args.join(" ")}\n${message.author.toString()}, ${resposta}`
        }
        var webhooks = await message.channel.fetchWebhooks()
        var webhook = webhooks.find(w => w.owner.id === this.ray.user.id)
        if (!webhook) {
            message.channel.createWebhook(this.ray.user.username, {
                avatar: this.ray.user.displayAvatarURL({ format: 'png' }),
                reason: 'commands'
            }).then(async (webhook) => {
                var webhooks = await message.channel.fetchWebhooks();
                var webhook = webhooks.find(w => w.owner.id === this.ray.user.id)
                webhook.send(messageObject);
            }).catch(e => message.errorEmbed(t("events:very-webhooks")))
        } else webhook.send(messageObject)
    }
    async slash({ interaction, args, noargs }, t) {
        if (!args.join(" ")) return interaction.reply({ embeds: [noargs] })
        let names = ['Çábio Carro Jonso', 'Experiente Carlos João Enzo', "Sábio Cidinei", 'Sábio Cidiney', 'Zábio Cau Jonço', 'Sábio Cijei']
        let name = names[Math.floor((Math.random() * names.length))]
        let respostas = []
        for (let num = 1; num < 31; num++) respostas.push(t(`commands:cj.${num}`))
        var resposta = respostas[Math.floor((Math.random() * respostas.length))]
        if (args.join(" ").length == 1 && isNaN(args.join(" "))) {
            if (args.join(" ").toLowerCase() == 'z') {
                var resposta = 'Avatetomanocurapá'
            } else {
                let alfa = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',]
                var letra = alfa.indexOf(args.join(" ").toLowerCase())
                letra++
                var resposta = alfa[letra]
            }
        }
        switch (args.join(" ").toLowerCase()) {
            case 'cj': resposta = 'Salve'
                break
            case 'oh shit': resposta = 'Here we go again'
                break
            case 'cj gay': resposta = 'Suck my dick'
                break
            case 'gay': resposta = 'Suck my dick'
                break
            case 'oh shit here we go again': resposta = 'impostor'
                break
            case 'oh shit, here we go again': resposta = 'impostor'
                break
        }
        var messageObject = {
            username: name,
            avatarURL: 'https://media.discordapp.net/attachments/788376558271201290/816180449902198784/imagem.png',
            content: `> ${args.join(" ")}\n${interaction.user.toString()}, ${resposta}`
        }
        var webhooks = await message.channel.fetchWebhooks()
        var webhook = webhooks.find(w => w.owner.id === this.ray.user.id)
        if (!webhook) {
            message.channel.createWebhook(this.ray.user.username, {
                avatar: this.ray.user.displayAvatarURL({ format: 'png' }),
                reason: 'commands'
            }).then(async (webhook) => {
                var webhooks = await message.channel.fetchWebhooks();
                var webhook = webhooks.find(w => w.owner.id === this.ray.user.id)
                webhook.send(messageObject);
            }).catch(e => message.errorEmbed(t("events:very-webhooks")))
        } else webhook.send(messageObject)
    }
}