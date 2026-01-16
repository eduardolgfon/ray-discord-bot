module.exports = class KarenClient {
    constructor(ray) {
        this.ray = ray
    }
    async inicialize() {
        return;
        // if(this.ray.config.CLIENT_CANARY) return;
        const { Client, MessageEmbed } = require("discord.js");
        const cooldown = new Set();
        const c = require('chalk')
        const jimp = require('jimp')
        var backgrounds = ["https://cdn.discordapp.com/attachments/881196761429979196/881418671703089253/wallpaper0.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418675033341962/wallpaper1.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418678124556288/wallpaper2.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418685540089856/wallpaper3.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418690602606632/wallpaper4.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418696210395136/wallpaper5.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418700920586270/wallpaper6.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418705525952522/wallpaper7.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418711058235412/wallpaper8.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418713381892126/wallpaper10.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418720440909865/wallpaper11.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418723481763901/wallpaper12.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418728321982464/wallpaper13.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418730444304415/wallpaper14.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418733803962368/wallpaper15.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418743979319296/wallpaper16.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418746768556032/wallpaper17.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418750283378688/wallpaper18.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418754662219786/wallpaper20.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418757451427850/wallpaper21.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418769166123008/wallpaper22.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418772550934558/wallpaper23.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418776841711656/wallpaper24.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418780432011264/wallpaper25.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418783049277450/wallpaper26.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418793572794438/wallpaper27.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418798169718804/wallpaper28.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418801512583168/wallpaper29.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418806583517204/wallpaper30.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418809582428171/wallpaper31.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418818491121704/wallpaper32.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418821238419456/wallpaper33.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418823956316210/wallpaper34.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418827127210054/wallpaper35.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418830767865876/wallpaper36.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418844340625458/wallpaper37.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418848958578688/wallpaper38.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418851840032768/wallpaper39.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418856806113300/wallpaper40.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418859209441380/wallpaper41.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418869707796511/wallpaper42.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418872832528384/wallpaper43.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418875445608498/wallpaper44.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418880080289862/wallpaper45.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418883217637386/wallpaper46.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418893950869534/wallpaper47.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418897427922994/wallpaper48.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418901005680640/wallpaper49.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418906714144828/wallpaper50.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418909830504458/wallpaper51.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418920148475934/wallpaper52.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418925445906482/wallpaper53.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418930927833119/wallpaper54.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418934753042442/wallpaper55.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418939249328168/wallpaper56.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418946308341781/wallpaper57.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418950313930793/wallpaper58.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418954168467466/wallpaper59.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418956974456882/wallpaper60.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418960019554334/wallpaper61.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418971742629898/wallpaper62.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418975270031370/wallpaper63.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418978386411570/wallpaper64.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418981850873886/wallpaper65.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418987752267886/wallpaper67.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418995960516669/wallpaper68.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881418999013986304/wallpaper69.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419004177162240/wallpaper70.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419009399066664/wallpaper71.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419012444160020/wallpaper72.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419021856145428/wallpaper73.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419025048035418/wallpaper74.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419029686910996/wallpaper75.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419032895557722/wallpaper77.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419038180409365/wallpaper78.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419046225055754/wallpaper79.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419049551155240/wallpaper80.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419053057593404/wallpaper81.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419057843306516/wallpaper82.jpg", "https://cdn.discordapp.com/attachments/881196761429979196/881419061664288778/wallpaper83.jpg"]
        const mask = await jimp.read('./src/packages/home/mascaraHEX.png')
        const msg = await jimp.read('./src/packages/home/fundo.png')
        const lente = await jimp.read('https://cdn.discordapp.com/attachments/761424522259202111/846361197695205396/sbp.png')

        var karen = new Client({
            fetchAllMembers: false,
            restTimeOffset: -999999,
            messageCacheMaxSize: 1,
            messageCacheLifetime: 1,
            messageSweepInterval: 1,
            messageEditHistoryMaxSize: 1,
            cacheGuilds: false,
            cacheChannels: false,
            cacheOverwrites: false,
            cacheRoles: true,
            cacheEmojis: false,
            cachePresences: false,
            partials: ['MESSAGE', 'CHANNEL', 'REACTION']
        });
        this.ray.karen = karen
        karen.login(this.ray.config.KAREN_DISCORD_TOKEN)
        karen.on('ready', () => {
            setTimeout(() => {
                var status = { name: 'VOCÊ NÃO ESTÁ VENDO QUE EU SOU UMA MÃE SOLTEIRA? ONDE ESTA O GERENTE???', type: 'WATCHING' }
                karen.user.setPresence({ activity: status })
            }, 5000)
            karen.user.setStatus('dnd')
            console.log(c.cyan(`${karen.user.tag} iniciada.`))
        })
        var guild = await karen.guilds.fetch('810125751441162240')

        karen.on('guildMemberAdd', async (member) => {
            if (member.guild.id != guild.id) return;
            await karen.users.fetch(member.user.id, true)
            let canal = await karen.channels.fetch("852154624222691358")
            //        let fonte = await jimp.loadFont(jimp.FONT_SANS_32_BLACK)
            let img = await jimp.read(backgrounds[Math.floor((Math.random() * backgrounds.length))])
            let avatar = await jimp.read(member.user.displayAvatarURL({ format: 'png' }))
            avatar.resize(250, 250)
            mask.resize(250, 250)
            avatar.mask(mask)
            //            img.print(fonte, 170, 175, member.user.tag)

            img
                .resize(1024, 500)
                .composite(msg.resize(750, 375), 30, 265)
                .composite(avatar, 410, 40)
                .composite(lente.resize(230, 250), 420, 40)
                .getBuffer(jimp.MIME_PNG, (err, i) => {
                    const embed = new MessageEmbed()
                        .setColor(this.ray.colors.red)
                        .setTitle(`${member.user.username} Seja bem-viado(a) ;)`)
                        .setDescription(`Leia o ${this.ray.emotes.comunism} **NOSSO** ${this.ray.emotes.comunism} <#845625693207527456> antes de conversar no servidor e siga-o em nome de Jerusalém\n\n<a:cor:868338819521474661> Mude a cor do ~~**NOSSO**~~ seu nome clicando nos emojis em <#846729978467844097>\n\nEspero que goxte ;)`)
                        .setFooter(`🏆 Você é o ${guild.memberCount}º membro do servidor!`)
                    canal.send(member.user.toString(), { embed: embed, files: [{ attachment: i, name: 'bem-vindo.png' }] })
                })

            if (member.user.bot) member.roles.add('845831915386437643').catch(e => { });
            else {
                member.roles.add('846169627742699570').catch(e => { });
                member.roles.add('846170204866215956').catch(e => { });
                member.roles.add('846170758186270751').catch(e => { });
                member.roles.add('873553064773185587').catch(e => { });
                member.roles.add('873553623781613608').catch(e => { });
                member.roles.add('845658457214550046').catch(e => { });
            }
        })
        karen.on('guildMemberRemove', async (member) => {
            if (member.guild.id != guild.id) return;
            let canal = await karen.channels.fetch("852154624222691358")
            canal.send({
                embed: {
                    color: this.ray.colors.blue,
                    title: `Espero te ver de novo`,
                    description: `${member.user.username} foi embora, talvez algum dia ele volte para lutar nas intermináveis batalhas de Jerusalém`,
                    thumbnail: {
                        url: member.user.displayAvatarURL({ format: 'jpg', dynamic: true })
                    }
                }
            })
        })
        this.ray.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.channel.id != '846729978467844097') return;

            if (reaction.partial) {
                try {
                    await reaction.fetch()
                } catch (error) {
                    return console.error('Alguma coisa está errada quando tento puxar a reação!')
                }
            }
            let member = await guild.members.fetch(user.id)
            let ray_member = await this.ray.guilds.cache.get(guild.id).members.fetch(user.id)

            switch (reaction.emoji.name) {
                case '🏴':
                    if (member.roles.cache.has("846166254514864168")) return
                    else member.roles.add("846166254514864168").catch(e => ray_member.roles.add('846166254514864168'));
                    break
                case '🏳️':
                    if (member.roles.cache.has("846166421066088489")) return
                    else member.roles.add("846166421066088489").catch(e => ray_member.roles.add('846166421066088489'));
                    break
                case '🫐':
                    if (member.roles.cache.has("846166450804752395")) return
                    else member.roles.add("846166450804752395").catch(e => ray_member.roles.add('846166450804752395'));
                    break
                case '🔷':
                    if (member.roles.cache.has("846166455136682014")) return
                    else member.roles.add("846166455136682014").catch(e => ray_member.roles.add('846166455136682014'));
                    break
                case '🍀':
                    if (member.roles.cache.has("846166456638242837")) return
                    else member.roles.add("846166456638242837").catch(e => ray_member.roles.add('846166456638242837'));
                    break
                case '🐙':
                    if (member.roles.cache.has("846166457603588166")) return
                    else member.roles.add("846166457603588166").catch(e => ray_member.roles.add('846166457603588166'));
                    break
                case '🧠':
                    if (member.roles.cache.has("846166458006503454")) return
                    else member.roles.add("846166458006503454").catch(e => ray_member.roles.add('846166458006503454'));
                    break
                case '💄':
                    if (member.roles.cache.has("846166458559758337")) return
                    else member.roles.add("846166458559758337").catch(e => ray_member.roles.add('846166458559758337'));
                    break
                case '💋':
                    if (member.roles.cache.has("846166459411726367")) return
                    else member.roles.add("846166459411726367").catch(e => ray_member.roles.add('846166459411726367'));
                    break
                case '🧧':
                    if (member.roles.cache.has("846167278424948736")) return
                    else member.roles.add("846167278424948736").catch(e => ray_member.roles.add('846167278424948736'));
                    break
                case '🟫':
                    if (member.roles.cache.has("846167282505875485")) return
                    else member.roles.add("846167282505875485").catch(e => ray_member.roles.add('846167282505875485'));
                    break
                case '🔶':
                    if (member.roles.cache.has("846167279091974154")) return
                    else member.roles.add("846167279091974154").catch(e => ray_member.roles.add('846167279091974154'));
                    break
                case '💛':
                    if (member.roles.cache.has("846167280144744500")) return
                    else member.roles.add("846167280144744500").catch(e => ray_member.roles.add('846167280144744500'));
                    break
                case '⭐':
                    if (member.roles.cache.has("846171744015482960")) return
                    else member.roles.add("846171744015482960").catch(e => ray_member.roles.add('846171744015482960'));
                    break
                case '🎁':
                    if (member.roles.cache.has("846167284435124264")) return
                    else member.roles.add("846167284435124264").catch(e => ray_member.roles.add('846167284435124264'));
                    break
                case '✝️':
                    if (member.roles.cache.has("846171744695746591")) return
                    else member.roles.add("846171744695746591").catch(e => ray_member.roles.add('846171744695746591'));
                    break
                case '📣':
                    if (member.roles.cache.has("846171819420811275")) return
                    else member.roles.add("846171819420811275").catch(e => ray_member.roles.add('846171819420811275'));
                    break
            }
        })
        this.ray.on('messageReactionRemove', async (reaction, user) => {
            if (reaction.message.channel.id != '846729978467844097') return;

            if (reaction.partial) {
                try {
                    await reaction.fetch()
                } catch (error) {
                    return console.error('Alguma coisa está errada quando tento puxar a reação!')
                }
            }
            let member = await guild.members.fetch(user.id)
            let ray_member = await this.ray.guilds.cache.get(guild.id).members.fetch(user.id)

            switch (reaction.emoji.name) {
                case '🏴':
                    if (!member.roles.cache.has("846166254514864168")) return
                    else member.roles.remove("846166254514864168").catch(e => ray_member.roles.remove('846166254514864168'));
                    break
                case '🏳️':
                    if (!member.roles.cache.has("846166421066088489")) return
                    else member.roles.remove("846166421066088489").catch(e => ray_member.roles.remove('846166421066088489'));
                    break
                case '🫐':
                    if (!member.roles.cache.has("846166450804752395")) return
                    else member.roles.remove("846166450804752395").catch(e => ray_member.roles.remove('846166450804752395'));
                    break
                case '🔷':
                    if (!member.roles.cache.has("846166455136682014")) return
                    else member.roles.remove("846166455136682014").catch(e => ray_member.roles.remove('846166455136682014'));
                    break
                case '🍀':
                    if (!member.roles.cache.has("846166456638242837")) return
                    else member.roles.remove("846166456638242837").catch(e => ray_member.roles.remove('846166456638242837'));
                    break
                case '🐙':
                    if (!member.roles.cache.has("846166457603588166")) return
                    else member.roles.remove("846166457603588166").catch(e => ray_member.roles.remove('846166457603588166'));
                    break
                case '🧠':
                    if (!member.roles.cache.has("846166458006503454")) return
                    else member.roles.remove("846166458006503454").catch(e => ray_member.roles.remove('846166458006503454'));
                    break
                case '💄':
                    if (!member.roles.cache.has("846166458559758337")) return
                    else member.roles.remove("846166458559758337").catch(e => ray_member.roles.remove('846166458559758337'));
                    break
                case '💋':
                    if (!member.roles.cache.has("846166459411726367")) return
                    else member.roles.remove("846166459411726367").catch(e => ray_member.roles.remove('846166459411726367'));
                    break
                case '🧧':
                    if (!member.roles.cache.has("846167278424948736")) return
                    else member.roles.remove("846167278424948736").catch(e => ray_member.roles.remove('846167278424948736'));
                    break
                case '🟫':
                    if (!member.roles.cache.has("846167282505875485")) return
                    else member.roles.remove("846167282505875485").catch(e => ray_member.roles.remove('846167282505875485'));
                    break
                case '🔶':
                    if (!member.roles.cache.has("846167279091974154")) return
                    else member.roles.remove("846167279091974154").catch(e => ray_member.roles.remove('846167279091974154'));
                    break
                case '💛':
                    if (!member.roles.cache.has("846167280144744500")) return
                    else member.roles.remove("846167280144744500").catch(e => ray_member.roles.remove('846167280144744500'));
                    break
                case '⭐':
                    if (!member.roles.cache.has("846171744015482960")) return
                    else member.roles.remove("846171744015482960").catch(e => ray_member.roles.remove('846171744015482960'));
                    break
                case '🎁':
                    if (!member.roles.cache.has("846167284435124264")) return
                    else member.roles.remove("846167284435124264").catch(e => ray_member.roles.remove('846167284435124264'));
                    break
                case '✝️':
                    if (!member.roles.cache.has("846171744695746591")) return
                    else member.roles.remove("846171744695746591").catch(e => ray_member.roles.remove('846171744695746591'));
                    break
                case '📣':
                    if (!member.roles.cache.has("846171819420811275")) return
                    else member.roles.remove("846171819420811275").catch(e => ray_member.roles.remove('846171819420811275'));
                    break
            }
        })
    }

}