module.exports = class messageUpdateDM {
    constructor(ray) {
        this.ray = ray
    }
    async start(oldMessage, newMessage) {
        if (newMessage.channel.type === 'DM' || newMessage.channel.parentId != '876505530569474048') return;
        try {
            if (newMessage.author.bot) return;
            var user = await this.ray.users.fetch(newMessage.channel.topic)
            if (!user.dmChannel) await user.createDM(true)
            var messages = await user.dmChannel.messages.fetch({ limit: 25 })
            var msg = await messages.find(msg => msg.content === oldMessage.content)
            msg.edit({ content: newMessage.content })
        } catch (e) {
            newMessage.rayReply('negado', 'não foi possível encontrar sua mensagem\n\n```js\n' + e.stack.slice(0, 500) + '```')
        }
    }
}