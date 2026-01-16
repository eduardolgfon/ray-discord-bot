const { MessageEmbed } = require('discord.js');
const structure = require('../../components/structures')

module.exports = class LikeperianCommand extends structure {
    constructor(ray) {
        super(ray, {
            name: 'likeperian',
            aliases: ['like', 'conlang'],
            category: 'private',
            cooldown: 3,
            dm: true,
            Memberperm: [],
            Rayperm: [],
            dev: false,
            testCommand: ['sla ;-;']
        })
    }
    async execute({ message, args, noargs }, t) {
        if (!args.join(" ")) return message.reply({ embeds: [noargs] })
        const databaseObject = require('../../json/likepeirian.json');
        var traducao = ''
        for (let i in args) {
            if (databaseObject[args[i].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()]) traducao += ' ' + databaseObject[args[i].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()]
            else traducao += ' ' + args[i]
        }

        const embed = new MessageEmbed()
            .setColor(this.ray.colors.green)
            .setTitle(';-; sla ;-----;')
            .addField(`Texto:`, '```fix\n' + args.join(" ") + '```')
            .addField('Tradução:', '```fix\n' + traducao + '```')
        message.reply({ embeds: [embed] })
    }
}