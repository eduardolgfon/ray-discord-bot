const { readdirSync } = require("fs")
const i18next = require("i18next")
const translationBackend = require("i18next-node-fs-backend")
const c = require('chalk')
class LocaleStructure {
    constructor(ray) {
        this.ray = ray
        this.languages = ["pt-BR", "en-US", "es-ES"]
        this.ns = ["commands", "events", "permissions"]
    }

    inicialize() {
        try {
            this.startLocales()
            console.log(c.green('✓ ') + c.bgCyan('[ LOCALES MANAGER ] - Locales carregados'))
            return true
        } catch (err) {
            this.ray.returnError('[ LOCALES STRUCTURES ]', err)
        }
    }

    async startLocales() {
        try {
            i18next.use(translationBackend).init({
                ns: this.ns,
                preload: await readdirSync("./src/i18n/"),
                fallbackLng: "pt-BR",
                backend: {
                    loadPath: "./src/i18n/{{lng}}/{{ns}}.json"
                },
                interpolation: {
                    escapeValue: false
                },
                returnEmpyString: false
            })
        } catch (err) {
            this.ray.returnError('[ LOCALES STRUCTURES ]', err)
        }
    }
}

module.exports = LocaleStructure