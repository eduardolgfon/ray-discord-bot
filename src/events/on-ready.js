const Topgg = require('@top-gg/sdk')
require("moment-duration-format")
const moment = require("moment")
const { tz } = require('moment-timezone')
var agora = moment.tz(Date.now(), "America/Bahia");
const c = require('chalk')
module.exports = class {
	constructor(ray) {
		this.ray = ray
	}
	async start() {
		var users = (0 - Number(this.ray.guilds.cache.size)); this.ray.guilds.cache.map(g => users += g.memberCount)
		await this.ray.loadModules('./src/packages')
		this.ray.sp.succeed('boot', { text: c.bold(`[ `) + c.green('CLIENT STATUS') + c.bold(` ] - `) + `${this.ray.shard ? (`Shard [${this.ray.shard.ids}]`) : 'Status atual:'} Conectada ao Discord\n◆ ▬▬▬▬▬▬▬▬ ❴✪ ❵ ▬▬▬▬▬▬▬▬ ◆\nHorário do boot: ${agora.format('LT')}\nUsuários Conectados: ${users}\nAtentendo ${this.ray.guilds.cache.size} servidores` })

		setInterval(async () => {
			let dani = await this.ray.users.fetch("395788326835322882")
			let burgues = await this.ray.users.fetch("746748969572368457")
			let hery = await this.ray.users.fetch('568493382884917258')
			let status = [
				{ name: "🛠️ A minha equipe conta com 3 pessoas incríveis ⚙️", type: "LISTENING" },
				{ name: `Já colonizei 🔰 ${this.ray.guilds.cache.size} servidores 🔰`, type: "LISTENING" },
				{ name: `⚠️ Use ${this.ray.config.PREFIX}help para saber mais informações ⚠️`, type: "LISTENING" },
				{ name: `🛑 O meu prefixo padrão é ${this.ray.config.PREFIX} 🛑`, type: "LISTENING" },
				{ name: `🎧 As suas sugestões no meu servidor 🎧`, type: "LISTENING" },
				{ name: `🎮 Entretenimento no seu cérebro 🎮`, type: "PLAYING" },
				{ name: `❤️ Muito obrigada @AoiOgataArt, @${dani.username} e @${burgues.username} por me ajudarem (MUITO) a ser quem eu sou hoje ❤️`, type: "LISTENING" },
				{ name: "🌜 Eu fico com status de lua (ausente) durante a noite 🌜", type: "PLAYING" },
				{ name: '🖼️ A minha arte foi feita por @Aoi Ogata | Se quiser acompanhar o trabalho dele vai lá no Twitter 🐦︎ @AoiOgataArt 🐦︎', type: 'WATCHING' },
				{ name: '📸 Avatar feito por @AoiOgataArt, muito obrigada ;3 🖼️', type: 'WATCHING' },
				{ name: `👑 Eu fui criada por ${hery.tag}`, type: 'WATCHING' }
			]
			let randomStatus = status[Math.floor(Math.random() * status.length)]
			this.ray.user.setPresence({ activities: [randomStatus] })
		}, 10000)
		setInterval(() => {
			var agora = moment.tz(Date.now(), "America/Bahia");
			if (agora.format('H') < 6 || agora.format('H') >= 18) this.ray.user.setStatus('idle')
			else if (agora.format('H') >= 6 && agora.format('H') < 18) this.ray.user.setStatus('online')
			/*			if(!this.ray.config.CLIENT_CANARY) {
							this.ray.channels.cache.get('847885526131277853').setName(`〔🌎〕Servidores: ❯ ${this.ray.guilds.cache.size} ❮`).catch(O_o => {});
							this.ray.channels.cache.get('847885785491701774').setName(`〔👥〕Usuários: ❯ ${users} ❮`).catch(O_o => {});
						}*/
			if (!this.ray.config.CLIENT_CANARY) {
				var api = new Topgg.Api(this.ray.config.DBL_TOKEN)
				api.postStats({
					serverCount: this.ray.guilds.cache.size,
					shardCount: this.ray.config.SHARDS_AM0UNT
				})
			}
		}, 1800000);
	}
}