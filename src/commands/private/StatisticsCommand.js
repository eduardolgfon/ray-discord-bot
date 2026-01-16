const Structure = require("../../components/structures")
const { MessageEmbed } = require('discord.js')
module.exports = class StatisticsCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "statistics",
            aliases: ["stats", "estatisticas", "estatísticas", "estatistica", "estatística", "estadísticas", "estadística"],
            category: "private",
            cooldown: 4,
            dm: false,
            Memberperm: [],
            Rayperm: [],
            dev: false,
            testCommand: ['{@user}']
        })
    }
    async execute({ message, args, db, query, prefix }, t) {
        const member = await this.findUser(message, args)

        var funcount = await db.query(`select * from users where id = '${member.id}'`)//, await this.getUserDB("configcount", member.id), await this.getUserDB("imagecount", member.id), await this.getUserDB("utilcount", member.id), await this.getUserDB("socialcount", member.id))
        console.log(funcount.rows[0])
        /*        const embed = new MessageEmbed()
                    .setColor(this.ray.colors.purple)
                    .setTitle(t("commands:statistics.author"))
        //            .setDescription(t("commands:statistics.desc")+"\n\n**"+t("commands:statistics.f1", {author: member.toString()})+"**\n"+contador)
                    // .addField(t("commands:statistics.f3", {bacana: this.ray.emotes.fodar}), await this.getUserDB("funcount", member.id).funcount, true)
                    // .addField(t("commands:statistics.f4", {dev: this.ray.emotes.dev}), await this.getUserDB("configcount", member.id).configcount, true)
                    // .addField(t("commands:statistics.f5", {pato: this.ray.emotes.pato}), await this.getUserDB("imagecount", member.id).imagecount, true)
                    // .addField(t("commands:statistics.f7", {info: this.ray.emotes.info}), await this.getUserDB("utilcount", member.id).utilcount, true)
                    // .addField(t("commands:statistics.f6", {sadcat1: this.ray.emotes.sadcat1}), await this.getUserDB("socialcount", member.id).socialcount, true)
                    // .addField(t("commands:statistics.f8", {cristal: this.ray.emotes.cristal}), t("commands:statistics.f8b"))
        //            .addField(t("commands:statistics.f9"), await this.getGuildDB("guildcount", message.guild.id).guildcount, true)
        //            .addField(t("commands:statistics.f2"), await this.getUserDB("cooldowns", member.id).cooldowns, true)
                    .setFooter(t("events:footer.f1", { prefix: prefix }), message.author.displayAvatarURL({ format: 'jpg', dynamic: true, size: 32 }))
                message.channel.send({embeds: [embed], reply: {messageReference: message.id}})*/
    }
}