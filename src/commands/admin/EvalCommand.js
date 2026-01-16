const Structure = require("../../components/structures")
const { inspect } = require('util')
const { MessageEmbed, MessageAttachment, WebhookClient, MessageButton, MessageActionRow } = require('discord.js')
const Canvas = require("canvas")
const canvas = require("canvas")
const jimp = require('jimp')
const moment = require("moment")
const { tz } = require('moment-timezone')
const Topgg = require('@top-gg/sdk')
let os = require("os")
const fs = require('fs')
let cpuStat = require("cpu-stat")
const c = require('chalk')
const bytes = require('bytes')

// const lastDB = require('quick.db')
// const usersdb = new lastDB.table('users')
// const guildsdb = new lastDB.table('guilds')


module.exports = class EvalCommand extends Structure {
	constructor(ray) {
		super(ray, {
			name: "eval",
			category: "admin",
			aliases: ["e"],
			cooldown: 1,
			dm: true,
			workInThreads: true,
			Memberperm: [],
			Rayperm: [],
			dev: true,
			testCommand: ['message.channel.send({content: `a`})']
		})
	}
	async execute({ message, args, db, query, comando, user, server, command }, t) {
		const ray = this.ray
		var backgrounds = ["https://cdn.discordapp.com/attachments/881196761429979196/881418671703089253/wallpaper0.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418675033341962/wallpaper1.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418678124556288/wallpaper2.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418685540089856/wallpaper3.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418690602606632/wallpaper4.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418696210395136/wallpaper5.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418700920586270/wallpaper6.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418705525952522/wallpaper7.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418711058235412/wallpaper8.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418713381892126/wallpaper10.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418720440909865/wallpaper11.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418723481763901/wallpaper12.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418728321982464/wallpaper13.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418730444304415/wallpaper14.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418733803962368/wallpaper15.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418743979319296/wallpaper16.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418746768556032/wallpaper17.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418750283378688/wallpaper18.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418754662219786/wallpaper20.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418757451427850/wallpaper21.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418769166123008/wallpaper22.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418772550934558/wallpaper23.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418776841711656/wallpaper24.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418780432011264/wallpaper25.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418783049277450/wallpaper26.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418793572794438/wallpaper27.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418798169718804/wallpaper28.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418801512583168/wallpaper29.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418806583517204/wallpaper30.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418809582428171/wallpaper31.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418818491121704/wallpaper32.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418821238419456/wallpaper33.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418823956316210/wallpaper34.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418827127210054/wallpaper35.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418830767865876/wallpaper36.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418844340625458/wallpaper37.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418848958578688/wallpaper38.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418851840032768/wallpaper39.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418856806113300/wallpaper40.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418859209441380/wallpaper41.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418869707796511/wallpaper42.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418872832528384/wallpaper43.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418875445608498/wallpaper44.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418880080289862/wallpaper45.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418883217637386/wallpaper46.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418893950869534/wallpaper47.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418897427922994/wallpaper48.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418901005680640/wallpaper49.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418906714144828/wallpaper50.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418909830504458/wallpaper51.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418920148475934/wallpaper52.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418925445906482/wallpaper53.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418930927833119/wallpaper54.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418934753042442/wallpaper55.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418939249328168/wallpaper56.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418946308341781/wallpaper57.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418950313930793/wallpaper58.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418954168467466/wallpaper59.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418956974456882/wallpaper60.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418960019554334/wallpaper61.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418971742629898/wallpaper62.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418975270031370/wallpaper63.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418978386411570/wallpaper64.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418981850873886/wallpaper65.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418987752267886/wallpaper67.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418995960516669/wallpaper68.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418999013986304/wallpaper69.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419004177162240/wallpaper70.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419009399066664/wallpaper71.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419012444160020/wallpaper72.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419021856145428/wallpaper73.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419025048035418/wallpaper74.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419029686910996/wallpaper75.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419032895557722/wallpaper77.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419038180409365/wallpaper78.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419046225055754/wallpaper79.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419049551155240/wallpaper80.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419053057593404/wallpaper81.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419057843306516/wallpaper82.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419061664288778/wallpaper83.jpg"]
		try {
			moment.locale(user.lang)
			const api = new Topgg.Api(this.ray.config.DBL_TOKEN)
			const util = require("util")
			if (args.join(" ").includes('await')) var evaled = await eval((`async function aifdjsfnjsnf() {\n${args.join(" ")}\n}\naifdjsfnjsnf()`).replace("```js", "").replace("```", "").replace(new RegExp(`this.ray`, "g"), 'ray'))
			else var evaled = await eval(args.join(" ").replace("```js", "").replace("```", "").replace(new RegExp(`this.ray`, "g"), 'ray'))
			evaled = inspect(evaled, { depth: 1 })
			evaled = evaled.replace(new RegExp(`${ray.token}`, "g"), undefined)
			if (evaled.length > 1900) evaled = `${evaled.slice(0, 1900)}...`
			if (command === 'eval') message.reply({ embeds: [{ color: ray.colors.green, title: 'Saída:', description: `\`\`\`js\n${evaled}\`\`\`` }] })
		} catch (e) {
			const embed = new MessageEmbed()
				.setTitle('ihh deu merda viado')
				.setColor(ray.colors.red)
				.setDescription(`\`\`\`js\n${e}\`\`\``)
			message.reply({ embeds: [embed] }).catch(OwO => {
				embed.setDescription(`\`\`\`js\n${e.stack.slice(0, 1900)}\`\`\``)
				message.reply({ embeds: [embed] }).catch(e => { })
			})
		}
	}
}