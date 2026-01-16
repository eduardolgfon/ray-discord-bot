const c = require('chalk')
const spinnies = require('spinnies')
const sp = new spinnies({ color: 'cyan', succeedColor: 'bgGreen', failColor: 'red', spinnerColor: 'green' }); sp.add('boot', { text: 'Conectando ao Discord...' })
require('./src/components/ProtoTypes').start()
const Client = require('./src/RayClient')
const { Options, LimitedCollection } = require('discord.js')
const config = require('./src/json/config.json')
const ray = new Client({
    intents: config.GATEWAY_INTENTS,
    restTimeOffset: 0,
    allowedMentions: { parse: ['users'], repliedUser: true },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    failIfNotExists: false,

    // makeCache: Options.cacheWithLimits({
    //     ApplicationCommandManager: 0, // guild.commands
    //     BaseGuildEmojiManager: 0, // guild.emojis
    //     ChannelManager: {
    //         maxSize: 0,
    //         sweepInterval: 600
    //     }, // client.channels
    //     GuildChannelManager: {
    //         maxSize: 0,
    //         sweepInterval: 600
    //     }, // guild.channels
    //     GuildBanManager: 0, // guild.bans
    //     GuildInviteManager: 0, // guild.invites
    //     GuildManager: Infinity, // client.guilds
    //     GuildMemberManager: {
    //         maxSize: 5,
    //         sweepFilter: collection => (value, key, collection) => value.user && value.user.id !== ray.user.id,
    //         sweepInterval: 600 // autosweep interval in seconds
    //     }, // guild.members
    //     GuildStickerManager: 0, // guild.stickers
    //     MessageManager: {
    //         maxSize: 25,
    //         sweepInterval: 120
    //     },
    //     PermissionOverwriteManager: Infinity, // channel.permissionOverwrites
    //     PresenceManager: 0, // guild.presences
    //     ReactionManager: 0, // message.reactions
    //     ReactionUserManager: 0, // reaction.users
    //     RoleManager: {
    //         maxSize: Infinity,
    //         sweepFilter: () => role => !role.guild.me.roles.cache.has(role.id),
    //         sweepInterval: 600
    //     }, // guild.roles
    //     StageInstanceManager: 0, // guild.stageInstances
    //     ThreadManager: {
    //         sweepInterval: 3600,
    //         sweepFilter: LimitedCollection.filterByLifetime({
    //             getComparisonTimestamp: e => e.archiveTimestamp,
    //             excludeFromSweep: e => !e.archived,
    //         }),
    //     },
    //     ThreadMemberManager: 0, // threadchannel.members
    //     UserManager: {
    //         maxSize: 5,
    //         sweepFilter: collection => (value, key, collection) => value.id !== ray.user.id,
    //         sweepInterval: 600 // autosweep interval in seconds
    //     },
    //     VoiceStateManager: 0, // guild.voiceStates
    // }),
}); ray.sp = sp; ray.dir = __dirname
const ShardController = require('./src/components/ShardController')
if (ray.shard) ray.ShardController = new ShardController(ray)

var DISCORD_TOKEN = !ray.config.CLIENT_CANARY ? ray.config.CLIENT_DISCORD_TOKEN : ray.config.BETA_CLIENT_DISCORD_TOKEN
ray.boot(DISCORD_TOKEN)
    .then(bah => console.log(c.bold(`[ `) + c.green('CLIENT') + c.bold(` ] - Sessão Iniciada como `) + c.bgGreen(ray.user.tag)))
    .catch((e) => ray.returnError('[ BOOT MANAGER ]', e.message))