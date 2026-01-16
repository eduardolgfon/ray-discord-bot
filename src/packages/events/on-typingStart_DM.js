module.exports = class typingStartDM {
    constructor(ray) {
        this.ray = ray
    }
    async start(typing) {
        if (typing.channel.type == 'DM' || typing.channel.parentId != '876505530569474048' || typing.user.bot) return;
        try {
            var user = await this.ray.users.fetch(typing.channel.topic)
            if (!user.dmChannel) await user.createDM(true)
            user.dmChannel.sendTyping()
        } catch (e) {
            typing.channel.send('não foi possível enviar digitação\n\n```js\n' + e.stack.slice(0, 100) + '```')
        }
    }
}