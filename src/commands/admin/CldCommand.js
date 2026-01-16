const cld = require('child_process')
const { MessageEmbed } = require('discord.js')
const structure = require('../../components/structures')

module.exports = class CldCommand extends structure {
    constructor(ray) {
        super(ray, {
            name: 'cld',
            aliases: [],
            category: 'admin',
            cooldown: 1,
            dm: true,
            workInThreads: true,
            Rayperm: [],
            Memberpem: [],
            dev: true,
            testCommand: ['free -h']
        })
    }
    async execute({ message, args }, t) {
        const embed = new MessageEmbed()
        const ray = this.ray
        cld.exec(args.join(" "), (e, stdout, stderr) => {
            if (e || stderr) {
                embed.setTitle('ihh deu merda viado')
                    .setColor(ray.colors.red)
                    .setDescription(`\`\`\`bash\n${e}\`\`\``)

                return message.reply({ embeds: [embed] })
            }
            embed.setColor(ray.colors.green)
                .addField('Saida:', `\`\`\`bash\n${stdout}\n\`\`\``)
            message.reply({ embeds: [embed] })
        })
    }
}