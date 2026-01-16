module.exports = class messageDeleteDM {
    constructor(ray) {
        this.ray = ray
    }
    async start(message) {
        if (message.channel.type === 'DM' || message.channel.parentId != '876505530569474048') return;
        try {
            try {
                if (message.author.bot) return;
            } catch (e) { }
            var user = await this.ray.users.fetch(message.channel.topic)
            if (!user.dmChannel) await user.createDM(true)
            var messages = await user.dmChannel.messages.fetch({ limit: 25 })
            var msg = await messages.find(msg => msg.content === message.content)
            msg.delete()
        } catch (e) {
            message.channel.send('não foi possível encontrar sua mensagem\n\n```js\n' + e.stack.slice(0, 100) + '```')
        }
    }
}