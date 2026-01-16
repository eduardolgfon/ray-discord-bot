const Canvas = require("canvas")
const badges = require("discord-badges");
module.exports = class CanvasTemplates {
    static async generateProfile({ message, ray, member, db, bah }, t) {
        const canvas = Canvas.createCanvas(1280, 990)
        const ctx = canvas.getContext("2d")
        var user = await db.query(`select * from users where id = '${member.id}'`)
        user = user.rows[0]

        if (!user) {
            await db.query(`insert into users (id) VALUES('${member.id}')`)
            var user = await db.query(`select * from users where id = '${member.id}'`)
            user = user.rows[0]
        }

        var server = await db.query(`select * from servers where id = '${message.guild.id}'`)
        server = server.rows[0]
        var credit = await ray.users.fetch('604123845422612490')
        /*        ctx.fillStyle = "#6585FF"
//        ctx.fillRect(0, 0, canvas.width, canvas.height, true, false)

        ctx.rotate(0.05)
        ctx.fillStyle = "rgb(133, 158, 255)"
//        ctx.fillRect(20, canvas.height / 2 + 30, canvas.width + 100, canvas.height, true, false)

        ctx.rotate(-0.05)
        ctx.fillStyle = "#6585FF"
//        ctx.roundRect((canvas.width - 30) - 180, canvas.height - 30 - 180, 180, 180, 20, true, false)
        ctx.fillStyle = "rgb(133, 158, 255)"*/
        if (bah) var img = await Canvas.loadImage(message.attachments.first().url)
        else {
            try {
                var search = await ray.channels.cache.get('860858806320627722').messages.fetch(user.background)
                var img = await Canvas.loadImage(search.attachments.first().url)
            } catch (e) {
                var img = await Canvas.loadImage(ray.config.DEFAULT_WALLPAPER)
            }
        }
        let none = await Canvas.loadImage('https://cdn.discordapp.com/attachments/788376558271201290/856394796750733312/unknown.png')
        let layout = await Canvas.loadImage('./src/assets/profile2.png')
        var icon = await Canvas.loadImage(!message.guild.iconURL({ format: "jpg" }) ? 'https://media.discordapp.net/attachments/788376558271201290/821421343274827833/unknown.png' : message.guild.iconURL({ format: "jpg" }))
        var sadcat = await Canvas.loadImage('https://cdn.discordapp.com/attachments/802053941809381386/876558530583363634/sadcat1.png')
        ctx.drawImage(img, 0, 0, 1280, 720);
        ctx.drawImage(none, 1080, 805, 200, 200);
        let roundedIcon = await ctx.roundImageCanvas(icon, 190, 190)
        ctx.drawImage(sadcat, 15, 901, 76, 76)
        ctx.drawImage(roundedIcon, 24.5, 660, 190, 190)
        if (!user.marry) ctx.drawImage(layout, 0, 0, 1280, 990);
        else {
            var marry = await ray.users.fetch(user.marry)
            let marrysAvatar = await Canvas.loadImage(marry.displayAvatarURL({ format: 'png' }))
            ctx.textAlign = "left"
            ctx.fillStyle = "#fff"
            ctx.font = "bold 25px Product Sans"
            // ctx.fillRect(30, 330, 40, 50, true)
            ctx.drawImage(marrysAvatar, 1080, 805, 200, 200)
            ctx.drawImage(layout, 0, 0, 1280, 990);
            ctx.fillText(marry.username, 900, 940)
        }

        let avatar = await Canvas.loadImage(member.displayAvatarURL({ format: 'png' }))
        let roundedImage = await ctx.roundImageCanvas(avatar, 285, 285)
        ctx.drawImage(roundedImage, 12, 12, 285, 285)
        ctx.fillStyle = "#553211"
        ctx.roundRect(275, 805, 580, 200, 20, true, false)

        ctx.fillStyle = "#fff"
        ctx.font = "bold 42px Product Sans"
        if (member.username.length <= 4) ctx.fillText(ctx.getLines(member.tag.normalize('NFD').replace(/[\u0300-\u036f]/g, ""), 300).join("\n"), 240, 320)
        else if (member.username.length > 4 && member.username.length <= 10) ctx.fillText(ctx.getLines(member.tag.normalize('NFD').replace(/[\u0300-\u036f]/g, ""), 300).join("\n"), 200, 330)
        else ctx.fillText(ctx.getLines(member.username.normalize('NFD').replace(/[\u0300-\u036f]/g, ""), 300).join("\n"), 275, 295)
        /*
        ctx.textAlign = "center"
        ctx.font = "bold 40px Product Sans"
        ctx.fillText("REP", 962.5, 100)
    //        ctx.fillText(user.rep, 962.5, 170)
    //        ctx.fillText("Yens ", 933, 570)
    //        ctx.drawImage(yen, 983, 523, 60, 60)
    //        ctx.fillText(user.yens, 962.5, 640)*/
        try {
            var response = await badges.badges(member)
            let num = 0
            for (let i = 0; i < response.length; i++) await Canvas.loadImage(`${response[i].url.replace('?v=1', '')}`).then(badge => {
                ctx.drawImage(badge, 245 + num, 725, 65, 65)
                num = num + 85
            })
        } catch (e) { }


        var data = []
        var totalCats = await db.query(`select id, cats from users where cats > 1 order by cats desc`)
        totalCats.rows.map(value => data.push({ id: value.id, cats: value.cats }))
        ctx.textAlign = "left"
        ctx.fillStyle = "#fff"
        ctx.font = "bold 25px Product Sans"
        ctx.fillText(`  ${Number(user.cats).toLocaleString(user.lang)}\nSadCats`, 110, 935)
        ctx.fillText(`    ${user.commands}\n${t("commands:profile.commands")}`, 1005, 60)
        ctx.fillText(`     ${data.map(m => m.id).indexOf(member.id) + 1 || 'Sad™️'}°\n${t("commands:profile.position")}`, 1015, 210)
        ctx.font = "bold 20px Product Sans"
        ctx.fillText(`${server.guildcount}\n${t("commands:profile.commands")} neste\nservidor`, 1015, 360)
        ctx.font = "40px Product Sans"
        if (!user.description) var description = t("commands:profile.desc")
        else var description = user.description
        ctx.fillText(ctx.getLines(description, 560).join("\n"), 290, 845)

        ctx.fillStyle = "#050505"
        ctx.font = "bold 20px Product Sans"
        ctx.fillText(`layout by ${credit.username}`, 865, 985)

        return canvas.toBuffer()
    }
}