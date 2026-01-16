module.exports = class ShardController {
    constructor(ray) {
        this.ray = ray
    }

    async getFromCollection(collection, id) {
        const data = await this.ray.shard.broadcastEval(`this.${collection}.cache.get('${id}')`).then(a => a.filter(b => b))
        return data[0]
    }
    async getSizeCollection(collection) {
        const info = await this.ray.shard.fetchClientValues(`${collection}.cache.size`)
        let i = info.reduce((prev, val) => prev + val)
        return i
    }

    getAllSizeObject(collection) {
        return this.getSizeCollection(collection)
    }

    getEmojis(id) {
        return this.getFromCollection('emojis', id)
    }

    getUsers(id) {
        return this.getFromCollection('users', id)
    }

    getGuilds(id) {
        return this.getFromCollection('guilds', id)
    }

    getChannels(id) {
        return this.getFromCollection('channels', id)
    }

    killShard(id) {
        return this.ray.shard.broadcastEval(`if (this.shard.id === ${id}) { this.destroy() }`)
    }

    respawnShard(id) {
        return this.ray.shard.broadcastEval(`if (this.shard.id === ${id}) { this.respawn() }`)
    }
}