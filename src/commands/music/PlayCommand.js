const Structures = require('../../components/structures')

module.exports = class PlayCommand extends Structures {
    constructor(ray) {
        super(ray, {
            name: "play",
            multiLanguageName: true,
            aliases: ["tocar", "tocar", "p"],
            category: "music",
            cooldown: 3,
            dm: false,
            workInThreads: true,
            Memberperm: [],
            Rayperm: [],
            dev: false,
            testCommand: []
        })
    }
}