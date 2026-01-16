const Structure = require("../../components/structures")
const { MessageEmbed } = require('discord.js')
module.exports = class TopCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: "sadtop",
            multiLanguageName: false,
            aliases: ["top", "sadcatstop", "rank", "sadcatsrank"],
            category: "social",
            cooldown: 5,
            dm: true,
            workInThreads: true,
            Memberperm: [],
            Rayperm: [],
            dev: false,
            testCommand: []
        })
    }
    async execute({ message, args, query, db, user }, t) {
        if (args[0] === 'local') var local = true
        // var limit = 10
        // var offset = 0
        // if(!isNaN(args[0])) {
        //     limit = parseInt(args[0]) * 10
        //     offset = limit - 10
        // }
        var data = await db.query(`select * from users 
        where cats > 1 
        order by cats DESC
        `)
        data = data.rows
        const embed = new MessageEmbed()
        var authorPosition = parseInt(data.map(m => m.id).indexOf(message.author.id)) + 1 //* (limit / 10)
        embed.setDescription(t("commands:sadtop.desc", { authorPosition: authorPosition || 'Sad™' }) + ' ' + this.ray.emotes.stonks)
        embed.setColor(this.ray.colors.blue)
        embed.setTitle('🏆 ' + t(local ? "commands:sadtop.title".replace('global', 'local') : "commands:sadtop.title") + ' 🏆')
        embed.setThumbnail('https://cdn.discordapp.com/attachments/788376558271201290/846532258318909450/sad_cat_bongo.gif')
        embed.setImage('https://cdn.discordapp.com/attachments/788376558271201290/857496019460554752/nyan.gif')
        let rank = []
        await data.forEach(async (user) => {
            let member = await this.findUser(message, user.id)
            if (local) {
                var memberGuild = message.guild.members.cache.get(user.id)
                if (!memberGuild) return;
            }
            member = member ? member.tag : "Invalid-user"
            let posicao = parseInt(data.map(user => user.id).indexOf(user.id)) + 1
            rank.push({ id: user.id, tag: member, cats: user.cats, posicao: posicao })
        })
        rank.length = 10
        try {
            var nextPosition = await query(`select cats from users where id = '${rank[parseInt(data.map(m => m.id).indexOf(message.author.id)) - 1].id}'`)
            var myPosition = await query(`select cats from users where id = '${rank[parseInt(data.map(m => m.id).indexOf(message.author.id))].id}'`)
            embed.setFooter(`Você precisa de mais ${(parseInt(nextPosition.cats) - parseInt(myPosition.cats)).toLocaleString(user.lang)} sadcats para chegar à ${authorPosition - 1}° posição`, message.author.displayAvatarURL({ format: 'jpg' }))
        } catch (e) { embed.setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ format: 'jpg', dynamic: true })) }
        rank.map(async (member) => embed.addField(`${member.posicao == 1 ? `${this.ray.emotes.red_coroa} The Saddest of the Sads™ ${this.ray.emotes.sadcat6}:` : member.posicao + '-'} ${member.tag}`, `**${this.ray.emotes.sadcat1} ${parseInt(member.cats) === 0 ? t("events:no-cats", { sadcat2: this.ray.emotes.sadcat2 }) : parseInt(member.cats).toLocaleString(user.lang)} ${this.ray.emotes.sadcat4}** Sad Cats`))
        message.reply({ embeds: [embed] })
    }
}