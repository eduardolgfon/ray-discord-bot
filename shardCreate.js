console.clear()
const { ShardingManager } = require('./node_modules/discord.js')
const config = require("./src/json/config.json")
const c = require('./node_modules/chalk')
var DISCORD_TOKEN = !config.CLIENT_CANARY ? config.CLIENT_DISCORD_TOKEN : config.BETA_CLIENT_DISCORD_TOKEN
const MANAGER = new ShardingManager("./index.js", { token: DISCORD_TOKEN })

MANAGER.on("shardCreate", (s) => console.log(c.bgBlueBright(`[SHARDING MANAGER] - Criando shard ${s.id}`)))

MANAGER.on("shardDisconnect", (s) => console.log(c.red(`[SHARDING MANAGER] - Shard ${s.id} desconectada do servidor.`)))

MANAGER.on('message', (s, message) => console.log(`Shard[${s.id}] : ${message._eval} : ${message._result}`));

MANAGER.spawn({ amount: config.SHARDS_AM0UNT, delay: 5500, timeout: 30000 })
    .then(console.log(c.bgBlueBright("[SHARDING MANAGER] - Iniciando fragmentação...")))

process.on('SIGINT', async () => {
    console.log(c.bgGreen('encerrando conexão com o banco de dados...'))
    await global.db.end()
    console.log('encerrado.')
    process.exit(1)
})