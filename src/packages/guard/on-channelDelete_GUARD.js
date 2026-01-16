module.exports = class channelDeleteGuard {
    constructor(ray) {
        this.ray = ray
    }
    async start(c) {
        const db = this.ray.db
        var user = await db.query(`select * from temp where id = '${c.guild.id}'`)
        var server = await db.query(`select * from serversconfig where id = '${c.guild.id}'`)
        if (user) user = user.rows[0]
        if (!server) return;
        server = server.rows[0]
        if (!server || !server.partner) return;

        let fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: 'CHANNEL_DELETE' });
        let actionLog = fetchedLogs.entries.first();

        if (Number(user.channelDelete) >= 3) {
            var user = await c.guild.members.fetch(actionLog.executor.id)
            return user.ban({ reason: `anti-raid system || ${actionLog.executor.tag} apagou mais de 3 chats do servidor em um curto período de tempo (5 segundos)` }).catch(e => { })
        }
        db.query(`insert into temp (id, channelDelete) VALUES('${actionLog.executor.id}', 1)`).then(sus => { }).catch(e => db.query(`update temp set channelDelete = channelDelete +1 where id = '${actionLog.executor.id}'`))
        setTimeout(async () => await db.query(`update temp set channelDelete = channelDelete-1 where id = '${actionLog.executor.id}'`), 5000)
    }
}