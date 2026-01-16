const Structure = require("../../components/structures")
const { MessageEmbed } = require('discord.js')
const fetch = require("node-fetch");
module.exports = class ClydeCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "clyde",
            multiLanguageName: false,
            aliases: ["cly", "clydemsg"],
            category: "image",
            cooldown: 5,
            dm: true,
            workInThreads: true,
            Memberperm: [],
            Rayperm: ["ATTACH_FILES", "EMBED_LINKS"],
            dev: false,
            testCommand: ['you are being rate limited']
        })
    }

    async execute({ message, args, noargs }, t) {
        if (!args[0]) return message.reply({ embeds: [noargs] })

        //    const data = await fetch(
        //        `https://nekobot.xyz/api/imagegen?type=clyde&text=${args.join("+")}`
        //    ).then((res) => res.json());
        //data.message      
        const embed = new MessageEmbed()
            .setColor(this.ray.colors.blue)
            .setTitle("Clyde " + this.ray.emotes.verificado)
            .setImage(`https://ctk-api.herokuapp.com/clyde/${args.join("+")}`)
        message.reply({ embeds: [embed] });
    }
}