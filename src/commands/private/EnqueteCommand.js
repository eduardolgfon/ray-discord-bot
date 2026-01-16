const Structure = require("../../components/structures")
module.exports = class SurveyCommannd extends Structure {
    constructor(ray) {
        super(ray, {
            name: "survey",
            aliases: ["enqt", "emquete", "encuesta", "enquete"],
            category: "private",
            cooldown: 5,
            dm: false,
            Memberperm: [],
            Rayperm: ["ADD_REACTIONS"],
            dev: false,
            testCommand: ['quem reagir é gay']
        })
    }
    async execute({ message, args, noargs, user }, t) {
        if (!args[2] || isNaN(args[0]) || isNaN(args[1])) return message.reply({ embeds: [noargs] })
        if (Number(args[1]) > 10 || Number(args[1]) < 1) return message.reply({ content: t("commands:survey.time") })
        if (args[0] > 5) return message.reply({ content: t("commands:survey.reactions") })
        const ray = this.ray

        async function embed(one, two, three, four, five) {
            var msg = await message.reply({
                embeds: [{
                    color: ray.colors.yellow,
                    title: t("commands:survey.title"),
                    description: args.slice(2).join(" "),
                    timestamp: new Date() + 420000000,
                    footer: {
                        icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true })
                    }
                }]
            })
            switch (args[0]) {
                case "2":
                    msg.react("1️⃣").catch(e => { });
                    msg.react("2️⃣").catch(e => { });
                    break
                case "3":
                    msg.react("1️⃣").catch(e => { });
                    msg.react("2️⃣").catch(e => { });
                    msg.react("3️⃣").catch(e => { });
                    break
                case "4":
                    msg.react("1️⃣").catch(e => { });
                    msg.react("2️⃣").catch(e => { });
                    msg.react("3️⃣").catch(e => { });
                    msg.react("4️⃣").catch(e => { });
                    break
                case "5":
                    msg.react("1️⃣").catch(e => { });
                    msg.react("2️⃣").catch(e => { });
                    msg.react("3️⃣").catch(e => { });
                    msg.react("4️⃣").catch(e => { });
                    msg.react("5️⃣").catch(e => { });
                    break
            }

            const umfilter = (r, u) => r.emoji.name === "1️⃣" && !u.bot && ray.users.fetch(u.id, true)
            const doisfilter = (r, u) => r.emoji.name === "2️⃣" && !u.bot && ray.users.fetch(u.id, true)
            const tresfilter = (r, u) => r.emoji.name === "3️⃣" && !u.bot && ray.users.fetch(u.id, true)
            const quatrofilter = (r, u) => r.emoji.name === "4️⃣" && !u.bot && ray.users.fetch(u.id, true)
            const cincofilter = (r, u) => r.emoji.name === "5️⃣" && !u.bot && ray.users.fetch(u.id, true)
            const um = msg.createReactionCollector(umfilter, {
                time: tempo
            });
            const dois = msg.createReactionCollector(doisfilter, {
                time: tempo
            });
            const tres = msg.createReactionCollector(tresfilter, {
                time: tempo
            });
            const quatro = msg.createReactionCollector(quatrofilter, {
                time: tempo
            });
            const cinco = msg.createReactionCollector(cincofilter, {
                time: tempo
            });
            um.on("collect", r1 => {
                one = r1.count - 1
            })
            dois.on("collect", r2 => {
                two = r2.count - 1
            })
            tres.on("collect", r3 => {
                three = r3.count - 1
            })
            quatro.on("collect", r4 => {
                four = r4.count - 1
            })
            cinco.on("collect", r5 => {
                five = r5.count - 1
            })
            setTimeout(() => {
                if (args[0] == 2) var txt = t("commands:survey.two", { one: one, two: two })
                if (args[0] == 3) var txt = t("commands:survey.two", { one: one, two: two }) + t("commands:survey.three", { three: three })
                if (args[0] == 4) var txt = t("commands:survey.two", { one: one, two: two }) + t("commands:survey.three", { three: three }) + t("commands:survey.four", { four: four })
                if (args[0] == 5) var txt = t("commands:survey.two", { one: one, two: two }) + t("commands:survey.three", { three: three }) + t("commands:survey.four", { four: four }) + t("commands:survey.five", { five: five })
                msg.reactions.removeAll().catch(O_o => { });
                ray.tmp.subtract(`${message.author.id}.surveyLimit`, 1)
                msg.reply({
                    embeds: [{
                        color: ray.colors.blue,
                        title: t("commands:survey.result"),
                        description: txt,
                        footer: {
                            text: t("events:footer.f1", { prefix: getGuildDB("prefix", message.guild.id) }),
                            icon_url: message.author.displayAvatarURL({ format: "jpg", dynamic: true })
                        }
                    }]
                })
            }, tempo);
        }
        if (this.ray.tmp.get(`${message.author.id}.surveyLimit`) < 0) this.ray.tmp.set(`${message.author.id}.surveyLimit`, 0)
        if (this.ray.tmp.get(`${message.author.id}.surveyLimit`) > 5) return message.reply({
            embeds: [{
                color: this.ray.colors.red,
                title: t("events:noargs.title", { hum: this.ray.emotes.hum }),
                description: t("commands:survey.limit", { stop: this.ray.emotes.stop }),
                footer: {
                    text: t("events:footer.f1", { prefix: prefix }),
                    icon_url: message.author.displayAvatarURL({ format: "jpg", dynamic: true })
                }
            }]
        })
        this.ray.tmp.add(`${message.author.id}.surveyLimit`, 1)

        switch (args[0]) {
            case "2":
                var one = 0
                var two = 0
                embed(one, two)
                break
            case "3":
                var one = 0
                var two = 0
                var three = 0
                embed(one, two, three)
                break
            case "4":
                var one = 0
                var two = 0
                var three = 0
                var four = 0
                embed(one, two, three, four)

                break
            case "5":
                var one = 0
                var two = 0
                var three = 0
                var four = 0
                var five = 0
                embed(one, two, three, four, five)

                break
        }
    }
}