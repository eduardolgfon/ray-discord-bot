module.exports = class AntiFloodSystem {
    constructor(ray) {
        this.ray = ray;

        this.users = new Map()
        this.messagesLimit = 5;
    }
    async verify({ message, db }, t) {
        let data = await db.query(`select * from serversconfig where id = '${message.guild.id}'`)
        if (!data.rows[0].antiflood || message.author.id === global.ray.user.id) return;
        var user = this.users.get(message.author.id)
        if (!user) {
            this.users.set(message.author.id, {
                messages: 1,
                warns: 0
            })
            user = this.users.get(message.author.id)
        }

        this.check({ message }, t)

        setTimeout(() => {
            user = this.users.get(message.author.id)
            if (user?.messages > 0) user.messages -= 1
            if (user?.warns > 2) {
                message.member.kick()
                .then(banned => message.rayReply("emergencia", `The user ${message.author.tag} has been banned for flood`, true))
                .catch(e => message.rayReply("emergencia", `The anti-flood system cannot work if i don't has the "ADMINISTRATOR" or "BAN_MEMBERS" permission`, true))
                this.users.delete(message.author.id)
            }
        }, 3000)
        setTimeout(() => {
            user = this.users.get(message.author.id)
            if(user.warns > 0) {
                this.users.set(message.author.id, {
                    messages: user.messages,
                    warns: user.warns - 1
                })
            }
        }, 10000)
    }
    check({ message }, t) {
        let user = this.users.get(message.author.id)
        if (user.messages > 3 && user.messages < 5) {
            message.delete().catch(e => { })
            message.rayReply("emergencia", t("events:antiflood"), true)
            return this.users.set(message.author.id, {
                messages: user.messages,
                warns: user.warns + 1
            })
        }
        if (user.messages >= 5) {
            message.delete().catch(e => { })
            message.rayReply("emergencia", t("events:antiflood"), true)
            return this.users.set(message.author.id, {
                messages: user.messages,
                warns: user.warns + 1
            })
        }
        return this.users.set(message.author.id, {
            messages: user.messages + 1,
            warns: user.warns
        })
    }
}