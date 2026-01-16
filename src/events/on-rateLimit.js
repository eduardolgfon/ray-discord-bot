const c = require('chalk')
const { MessageEmbed } = require('discord.js')
module.exports = class RateLimitevent {
    constructor(ray) {
        this.ray = ray
    }
    async start(rayteLimit) {
        if (Number(rayteLimit.timeDifference ? rayteLimit.timeDifference : rayteLimit.timeout ? rayteLimit.timeout : 0) > 5000 || rayteLimit.global) console.log(`[ ` + c.green('CLIENT STATUS') + ` ] - ${c.red(rayteLimit.timeDifference ? rayteLimit.timeDifference : rayteLimit.timeout ? rayteLimit.timeout : 'Unknown timeout ')} ms de RAYte Limit ${!rayteLimit.global ? '' : 'GLOBAL'} por ${c.yellow(rayteLimit.method)} on ${c.cyan(rayteLimit.route)}`)
        const embed = new MessageEmbed()
            .setColor(this.ray.colors.red)
            .setTitle('RAYte Limit')
            .setDescription(`**${rayteLimit.timeDifference ? rayteLimit.timeDifference : rayteLimit.timeout ? rayteLimit.timeout : 'Unknown timeout '}** ms de RAYte Limit ${!rayteLimit.global ? '' : 'GLOBAL'} por **${rayteLimit.method}** on **${rayteLimit.route}**`)
        this.ray.channels.cache.get('881150103845486653').send({embeds: [embed]})
    }
}