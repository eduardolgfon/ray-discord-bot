const Structure = require("../../components/structures")
const { MessageEmbed } = require('discord.js')
const moment = require('moment')
module.exports = class HackCommand extends Structure {
  constructor(ray) {
    super(ray, {
      name: "hack",
      multiLanguageName: false,
      aliases: ["hackear", "hacker", "raki", "invadir"],
      category: "animation",
      cooldown: 18,
      dm: false,
      workInThreads: false,
      Memberperm: [],
      Rayperm: ["MANAGE_WEBHOOKS"],
      dev: false,
      testCommand: ['{@user}']
    })
  }
  async execute({ message, args, user, query }, t) {
    const ray = this.ray
    moment.locale(user.lang)
    let member = await this.findUser(message, args)
    var memberData = await query(`select * from users where id = '${member.id}'`)
    var progresso = t("commands:hack.progress", { carregando2: this.ray.emotes.carregando2 })
    var msg = await message.reply({
      embeds: [{
        color: ray.colors.yellow,
        title: t("commands:hack.f1", { carregando: ray.emotes.carregando }),
        thumbnail: { url: 'https://cdn.discordapp.com/emojis/783150103271702579.gif?v=1' },
        description: progresso + '\n[██•-•-•-•-]**',
        footer: { text: t("events:footer.f1", { prefix: user.prefix }), icon_url: message.author.displayAvatarURL({ dynamic: true, format: "jpg" }) }
      }]
    })
    const embed2 = new MessageEmbed()
      .setColor(this.ray.colors.hardgreen)
      .setThumbnail('https://cdn.discordapp.com/emojis/783150103271702579.gif?v=1')
      .setTitle(t("commands:hack.f2", { autorizado: this.ray.emotes.autorizado }))
      .setDescription(progresso + '\n[████•-•-•-]**')
      .setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ dynamic: true, format: "jpg" }))

    const embed3 = new MessageEmbed()
      .setColor(this.ray.colors.green)
      .setThumbnail('https://cdn.discordapp.com/emojis/783150103271702579.gif?v=1')
      .setTitle(t("commands:hack.f3", { carregando: this.ray.emotes.carregando }))
      .setDescription(progresso + '\n[██████•-•-]**')
      .setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ dynamic: true, format: "jpg" }))

    const embed4 = new MessageEmbed()
      .setColor(this.ray.colors.hardblue)
      .setThumbnail('https://cdn.discordapp.com/emojis/783150103271702579.gif?v=1')
      .setTitle(t("commands:hack.f4", { carregando: this.ray.emotes.carregando }))
      .setDescription(progresso + '\n[████████-•]**')
      .setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ dynamic: true, format: "jpg" }))

    const embed5 = new MessageEmbed()
      .setColor(this.ray.colors.red)
      .setThumbnail('https://cdn.discordapp.com/emojis/783150103271702579.gif?v=1')
      .setTitle(t("commands:hack.f5.title"))
      .setDescription(t("commands:hack.f5.desc", { autorizado: this.ray.emotes.autorizado }), progresso + '\n//[█████████•]**')
      .setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ dynamic: true, format: "jpg" }))

    const embed6 = new MessageEmbed()
      .setColor(this.ray.colors.yellow)
      .setThumbnail('https://cdn.discordapp.com/emojis/783150103271702579.gif?v=1')
      .setTitle(t("commands:hack.f6", { autorizado: this.ray.emotes.autorizado }))
      .setDescription(progresso + '\n[██████████]**')
      .setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ dynamic: true, format: "jpg" }))

    const embed7 = new MessageEmbed()
      .setColor(this.ray.colors.hardgreen)
      .setThumbnail('https://cdn.discordapp.com/emojis/783150103271702579.gif?v=1')
      .setTitle(t("commands:hack.f7"))
      .setDescription(progresso + '\n[██████████]**')
      .setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ dynamic: true, format: "jpg" }))

    const embed8 = new MessageEmbed()
      .setColor(this.ray.colors.red)
      .setThumbnail("https://cdn.discordapp.com/attachments/618150447261417492/626945093923766284/giphy_1.gif")
      .setTitle(t("commands:hack.f8", { negado: this.ray.emotes.negado }))
      .setDescription(progresso + '\n[×-×-×-×-×]**')
      .setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ dynamic: true, format: "jpg" }))

    const embed9 = new MessageEmbed()
      .setColor(this.ray.colors.yellow)
      .setThumbnail('https://cdn.discordapp.com/emojis/783150103271702579.gif?v=1')
      .setTitle(t("commands:hack.f9", { carregando: this.ray.emotes.carregando }))
      .setDescription(progresso + '\n[██•-•-•-•-]**')
      .setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ dynamic: true, format: "jpg" }))

    const embed10 = new MessageEmbed()
      .setColor(this.ray.colors.hardgreen)
      .setThumbnail('https://cdn.discordapp.com/emojis/783150103271702579.gif?v=1')
      .setTitle(t("commands:hack.f9", { carregando: this.ray.emotes.carregando }))
      .setDescription(progresso + '\n[██████•-•-]**')
      .setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ dynamic: true, format: "jpg" }))

    const embed11 = new MessageEmbed()
      .setColor(this.ray.colors.red)
      .setThumbnail('https://cdn.discordapp.com/emojis/783150103271702579.gif?v=1')
      .setTitle(t("commands:hack.f9", { carregando: this.ray.emotes.carregando }))
      .setDescription(progresso + '\n[████████-•]**')
      .setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ dynamic: true, format: "jpg" }))

    const embed12 = new MessageEmbed()
      .setColor(this.ray.colors.green)
      .setThumbnail('https://cdn.discordapp.com/emojis/783150103271702579.gif?v=1')
      .setTitle(t("commands:hack.f9", { carregando: this.ray.emotes.carregando }))
      .setDescription(progresso + '\n[██████████]**')
      .setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ dynamic: true, format: "jpg" }))

    if (message.guild.members.cache.get(member.id).permissions.has("ADMINISTRATOR")) var adm = t("commands:hack.adm", { autorizado: this.ray.emotes.autorizado })
    else var adm = t("commands:hack.not-adm", { negado: this.ray.emotes.negado })

    let IPs = ["25.158.28.250", "281.950.82", "51.946.82.91", "82.912.859.51", "10.950.825.28", "82.69.418.25", "192.86.45.190", "58.210.982.91", "89.215.200.50", "19.825.582.50", "44.966.150.50", "50.289.150.82", "91.82.250.300", "59.168.240.50"]
    let randomip = IPs[Math.floor((Math.random() * IPs.length))]
    let emails = ["******@gmail.com", "********@hotmail.com", "********************@outlook.com", "**********@outlook.com.br", "*********@orkut.com.br"]
    let email = emails[Math.floor((Math.random() * emails.length))]
    let webhookReplys = [t("commands:hack:webfr.f1"), t("commands:hack:webfr.f2", { vitima: member.toString() }), t("commands:hack:webfr.f3"), t("commands:hack:webfr.f4")]
    let randomReply = webhookReplys[Math.floor((Math.random() * webhookReplys.length))]
    const guild_member = message.guild.members.cache.get(member.id)
    if (guild_member.presence?.status) {
      var status = `${guild_member.presence.status}`.replace("dnd", t("commands:hack.dnd", { emoji: this.ray.emotes.dnd })).replace("idle", t("commands:hack.idle", { emoji: this.ray.emotes.idle })).replace("null", t("commands:hack.off", { emoji: this.ray.emotes.offline })).replace("online", t("commands:hack.on", { emoji: this.ray.emotes.online }))
      if (guild_member.presence.clientStatus.mobile) status += `\n📱 Acessando o Discord por um celular`
      if (guild_member.presence.clientStatus.desktop) status += `\n🖥️ Acessando o Discord por um computador`
    } else var status = t("commands:hack.off", { emoji: this.ray.emotes.offline })
    const embed13 = new MessageEmbed()
      .setColor(this.ray.colors.red)
      .setAuthor(t("commands:hack.f15:author"))
      .setTitle(`${member.tag}`)
      .setDescription(`**👑 ${adm}**`)
      .addField(t("commands:hack.f15.id"), "```css\n" + member.id + "```", true)
      .addField(t("commands:hack.f15.status"), status, true)
      .addField(t("commands:hack.f15.email"), "```fix\n" + email + "```")
      .addField(this.ray.emotes.sadcat1 + t("commands:hack.f15.cats"), "```fix\n" + (!memberData.cats ? "0" : memberData.cats) + "```", true)
      .addField(t("commands:hack.f15.since"), "```fix\n" + moment.utc(member.createdAt).format('LLL') + "```", true)
      // .addField(this.ray.emotes.nitro+t("commands:hack.f15.nitro"), "```fix\n"+member.createdAt+"```", true)
      // .addField(t("commands:hack.f15.ip"), "```cs\n# "+randomip+"```")
      .setThumbnail(member.displayAvatarURL({ dynamic: true, format: "jpg" }))
      .setFooter(t("events:footer.f1", { prefix: user.prefix }), message.author.displayAvatarURL({ dynamic: true, format: "jpg" }))

    if (Math.floor((Math.random() * 5)) === 3) {
      var embedCount = 2
      var interval = await setInterval(async () => {
        if (embedCount > 13) { sendWebhook(); return clearInterval(interval) }
        await eval(`msg.edit({embeds: [embed${embedCount++}]}).catch(e => clearInterval(interval))`)
      }, 1500)
    } else {
      var embedCount = 2
      var interval = await setInterval(async () => {
        if (embedCount > 13) { sendWebhook(); return clearInterval(interval) }
        if ([8, 9, 10, 11, 12].includes(embedCount)) return embedCount++
        else eval(`msg.edit({embeds: [embed${embedCount++}]}).catch(e => clearInterval(interval))`)
      }, 1500)
    }
    async function sendWebhook() {
      var webhook = await message.channel.createWebhook(message.guild.members.cache.get(member.id).displayName || member.username, { avatar: member.displayAvatarURL({ dynamic: true, format: "png" }) })
        .catch(e => message.errorEmbed(t("events:very-webhooks")))
      await webhook.send(randomReply)
      webhook.delete().catch(e => { })
    }

  }
}