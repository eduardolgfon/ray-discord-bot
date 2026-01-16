const Structure = require("../../components/structures")

module.exports = class EnzoCommannd extends Structure {
    constructor(ray) {
        super(ray, {
            name: "enzo",
            aliases: [],
            category: "private",
            cooldown: 5,
            Memberperm: [],
            Rayperm: [],
            dev: true
        })
    }
    async execute({ message }, t) {
        message.delete()
        setTimeout(async () => {
            try {
                var foto = await message.channel.send({ content: t("events:enzo.msg"), files: [{ attachment: "https://cdn.discordapp.com/attachments/788376558271201290/836251818392027156/b2e4b184d27cf0063f3001ca60e9b789dae02faf5b63d970acd97ef01914698d_1.png", name: `enzo.png` }] })
                var agradecimento = await foto.reply(t("events:enzo.agradecimento")).catch(O_o => { });
                var participantes = []
                function filter(msg) {
                    if (msg.author.bot) return;
                    var conteudo = agradecimento.content
                    if (msg.content.toLowerCase() === "obrigado enzo" || msg.content.toLowerCase() === "obrigada enzo" || msg.content.toLowerCase() === "thanks enzo") {
                        if (!conteudo.includes(msg.author.tag)) {
                            agradecimento.edit(conteudo + "\n" + msg.author.tag).catch(O_o => { });
                            msg.react("🥤").catch(O_o => { });
                            participantes.push(msg.author.toString())
                        }
                    }
                }
                message.channel.activeCollector = true;
                const response1 = await message.channel.awaitMessages({ filter, max: 1, time: 10000, errors: ["time"] })
            } catch (e) {
                message.channel.activeCollector = false;
                if (!participantes[0]) {
                    agradecimento.delete().catch(e => { })
                    foto.delete().catch(e => { })
                    message.channel.send("Ninguém agradeceu Enzo pela água e agora ele está triste, Enzo vai demorar muito para voltar pois está chorando no cantinho da sala")
                } else {
                    foto.delete()
                    agradecimento.delete()
                    let random = Math.floor((Math.random() * participantes.length)); { }
                    let ganhador = participantes[random]
                    message.channel.send(t("events:enzo.final", { participantes: participantes.join(", "), ganhador: `${ganhador}` }))
                }
            }
        }, 5000)
    }
}