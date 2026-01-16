const Structure = require("../../components/structures")
module.exports = class MorseCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "morse",
            multiLanguageName: false,
            aliases: [],
            category: "util",
            cooldown: 3,
            dm: true,
            workInThreads: true,
            Memberperm: [],
            Rayperm: [],
            dev: false,
            testCommand: ['quem leu é gay', '-.-. --- -- .. / --- / -.-. ..- / -.. . / --.- ..- . -- / - .- / .-.. . -. -.. ---']
        })
    }

    async execute({ message, args, noargs, user }, t) {
        let alpha = " ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(""),
            morse = "/,.-,-...,-.-.,-..,.,..-.,--.,....,..,.---,-.-,.-..,--,-.,---,.--.,--.-,.-.,...,-,..-,...-,.--,-..-,-.--,--..,.----,..---,...--,....-,.....,-....,--...,---..,----.,-----".split(","),
            text = args.join(" ").toUpperCase();
        if (!text) return message.reply({ embeds: [noargs] })

        while (text.includes("Ä") || text.includes("Ö") || text.includes("Ü")) {
            text = text.replace("Ä", "AE").replace("Ö", "OE").replace("Ü", "UE");
        }
        if (text.startsWith(".") || text.startsWith("-")) {
            text = text.split(" ");
            let length = text.length;
            for (var i = 0; i < length; i++) {
                text[i] = alpha[morse.indexOf(text[i])];
            }
            text = text.join("");
        } else {
            text = text.split("");
            let length = text.length;
            for (var i = 0; i < length; i++) {
                text[i] = morse[alpha.indexOf(text[i])];
            }
            text = text.join(" ");
        }
        return message.reply({
            embeds: [{
                color: this.ray.colors.green,
                title: t("commands:morse.title"),
                description: '```fix\n' + text + '```',
                footer: {
                    text: t("events:footer.f1", { prefix: user.prefix }),
                    icon_url: message.author.displayAvatarURL({ format: 'jpg', dynamic: true, size: 32 })
                }
            }]
        });
    }
}