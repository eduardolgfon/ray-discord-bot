const Structure = require('../../components/structures')
const path = require('path')
const axios = require('axios')
const fs = require('fs')
const acrcloud = require("acrcloud");
const moment = require('moment');
const { MessageEmbed } = require('discord.js');

module.exports = class MusicSpeakerCommand extends Structure {
    constructor(ray) {
        super(ray, {
            name: 'findmusic',
            multiLanguageName: true,
            aliases: ["encontrarmusica", "quecancion", "shazam", "qualmusica"],
            category: 'util',
            cooldown: 5,
            dm: true,
            workInThreads: true,
            Rayperm: [],
            Memberperm: [],
            dev: false,
            testCommand: ['']
        })
    }
    async execute({ message, user, noargs }, t) {
        if (!message.attachments.first()) return message.reply({ embeds: [noargs] })
        var data = message.attachments.first()
        if (!data.name.endsWith('.mp3') && !data.name.endsWith('.mp4')) return message.errorEmbed(t("commands:findmusic.incompatible"))
        var random = Math.floor(Math.random() * 10000)
        var name = `${random}.${data.name.slice(Number(data.name.split('').length) - 3, Number(data.name.split('').length) + 1)}`

        var msg = await message.rayReply('carregando', t("commands:findmusic.download"))
        var request = await axios({
            method: 'get',
            url: data.url,
            responseType: 'stream'
        })
        await request.data.pipe(fs.createWriteStream(name))

        try {
            msg = await msg.edit(`${this.ray.emotes.autorizado} **| ${t("commands:findmusic.download")}\n${this.ray.emotes.carregando} | ${t("commands:findmusic.finding")}**`)
            var dir = path.resolve(`./${name}`)
            var music = await this.findMusic({ dir })
            if (music) {
                moment.locale(user.lang)
                const embed = new MessageEmbed()
                    .setColor(this.ray.colors.red)
                    .setTitle(`**${t("commands:findmusic.info")}**`)
                    .setDescription(`${t("commands:findmusic.name")} ${music.title}`)
                    .addField(t("commands:findmusic.duration"), "```fix\n " + music.duration + "```", true)
                    .addField(t("commands:findmusic.producion"), "```fix\n" + music.produtora + "```", true)
                    .addField(t("commands:findmusic.date"), "```md\n# " + music.release_date + "```", true)
                    .addField(t("commands:findmusic.artists"), "```cs\n# " + music.artistas + "```")
                    .addField(t("commands:findmusic.album"), "```diff\n- " + music.albumName + "```")
                    .setFooter(t("events:footer.f1", { prefix: user.prefix }))
                msg.edit({ content: ' ', embeds: [embed] })
            } else msg.edit({ content: this.ray.emotes.negado + ` **| ${t("commands:findmusic.not-found")}**` })
            try { fs.unlinkSync(dir) } catch (e) { }
        } catch (e) {
            try { fs.unlinkSync(dir) } catch (e) { }
            return message.errorEmbed(t("commands:findmusic.error"))
        }
    }
    async findMusic({ dir }) {
        try {
            const acr = new acrcloud({
                host: this.ray.config.ACR_HOST.trim(),
                access_key: this.ray.config.ACR_ACCESS_KEY.trim(),
                access_secret: this.ray.config.ACR_ACCESS_SECRET.trim()
            })
            let resp = await acr.identify(fs.readFileSync(dir))

            switch (resp.status.code) {
                case 1001: message.errorEmbed(t("commands:findmusic.not-found"))
                    return false
                case 3003: message.errorEmbed(t("commands:findmusic.error"))
                    return false
                case 3015: message.errorEmbed(t("commands:findmusic.error"))
                    return false
                case 3000: message.errorEmbed(t("commands:findmusic.error"))
                    return false
            }
            let arrayDataLancamento = resp.metadata.music[0].release_date.split("-")
            let artistas = []
            for (let artista of resp.metadata.music[0].artists) artistas.push(artista.name)
            console.log(resp.metadata)
            return {
                title: resp.metadata.music[0].title,
                duration: moment.duration(resp.metadata.music[0].duration_ms).format("hh[h] mm[m] ss[s]"),
                produtora: resp.metadata.music[0].label || "-----",
                release_date: `${arrayDataLancamento[2]}/${arrayDataLancamento[1]}/${arrayDataLancamento[0]}`,
                albumName: resp.metadata.music[0].album.name,
                artistas: artistas.toString()
            }
        } catch (e) { }
    }
}