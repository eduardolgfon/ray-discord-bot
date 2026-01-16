const Postegrego = require('pg').Client
const { Client, Collection } = require('discord.js')
const { readdir } = require("fs")
const EventManager = require("./components/EventHandler")
const c = require('chalk')
module.exports = class RayClient extends Client {
	constructor(options = {}) {
		super(options)

		this.commands = new Collection()
		this.aliases = new Collection()
		this.modules = new Collection()
		this.events = new EventManager(this)
		this.colors = require("./components/colors")
		this.emotes = require("./components/emotes")
		this.config = require("./json/config.json")
		this.db = new Postegrego({
			user: "postgres",
			password: this.config.DATABASE_PASSWORD,
			host: "localhost",
			port: this.config.DATABASE_PORT,
			database: "ray"
		})

		global.ray = this
		global.db = this.db
	}
	async boot(token) {
		await this.inicializeLocales()
		await this.startEvents('./src/events')
		await this.loadCommands('./src/commands')
		return super.login(token)
	}
	returnError(type, error) {
		if (!error) return console.log(c.yellow('ErrorType is not found'))
		if (!type) return type = 'indefinido'
		console.error(c.blue(`[ ERROR FINDER ] - Setor:`, c.cyan(type), c.red(`Erro: `, c.green(error))))
	}
	inicializeLocales() {
		const Locales = require("./components/LocalesManager")
		const locales = new Locales(this)
		locales.inicialize()
	}
	loadCommands(path) {
		readdir(`${__dirname}/commands/`, (err, files) => {
			if (err) this.returnError('[ COMMANDS LOADER ]', err)
			files.forEach(category => {
				readdir(`${__dirname}/commands/${category}`, (err, cmd) => {
					cmd.forEach(async cmd => {
						const command = new (require(`${__dirname}/commands/${category}/${cmd}`))(this)
						command.dir = `${__dirname}/commands/${category}/${cmd}`
						this.commands.set(command.config.name, command)
						command.config.aliases.forEach(a => this.aliases.set(a, command.config.name))
						try {
							var c = await this.db.query(`SELECT name FROM commands WHERE name = '${command.config.name}'`)
							if (!c.rows[0]) await this.db.query(`INSERT INTO commands (name) VALUES('${command.config.name}')`)
						} catch (e) { }
					})
				})
			})
		})
		return this
	}
	loadModules(path) {
		if (!this.config.LOAD_MODULES) return;
		readdir(`${__dirname}/packages/`, (err, files) => {
			if (err) this.returnError('[ MODULES MANAGER ]', err)
			files.forEach(category => {
				readdir(`${__dirname}/packages/${category}`, (e, modules) => {
					modules.map(async file => {
						if (file.split('.')[1] != 'js' || file.startsWith("_")) return
						if (file.startsWith('on-')) {
							var eventName = file.replace('on-', '').split('_')[0]
							return this.events.add(eventName, file.replace('on-', ''), this, `${__dirname}/packages/${category}/${file}`)
						}
						const module = new (require(`${__dirname}/packages/${category}/${file}`))(this)
						this.modules.set(file.split('.')[0], module)
						const modulo = this.modules.get(file.split('.')[0])
						new Promise((res, rej) => res(modulo.inicialize(this)))
					})
				})
			})
		})
		console.log(c.magenta('[ MODULES LOADER ] - √ Iniciando módulos adicionais'))

		return this
	}
	startEvents(path) {
		readdir(path, (err, files) => {
			if (err) this.returnError('[ EVENTS STARTER ]', err)
			files.forEach(fileName => {
				if (fileName.startsWith('_')) return;
				this.events.add(fileName.split(".")[0].replace('on-', ''), `${fileName}_structureEvents`, this, `${__dirname}/events/${fileName}`)
			})
		})

		return this
	}
	reloadCommand(commandName) {
		const command = this.commands.get(commandName) || this.commands.get(this.aliases.get(commandName))
		if (!command) return false
		const dir = command.dir
		this.commands.delete(commandName)
		delete require.cache[require.resolve(`${dir}`)]
		try {
			const Command = require(`${dir}`)
			const cmd = new Command(this)
			cmd.dir = dir
			this.commands.set(commandName, cmd)
			return true
		} catch (e) { return e.message }
	}
	async newTransation(member, transation) {
		var tamanho;
		var user = await this.db.query(`select * from users where id = '${member.id}'`)
		user = user.rows[0]
		if (!user) {
			await this.db.query(`insert into users (id) values('${member.id}')`)
			var user = await this.db.query(`select * from users where id = '${member.id}'`)
			user = user.rows[0]
		}
		if (!user.logs) tamanho = 0
		else tamanho = user.logs.length
		await this.db.query(`update users set
			logs[${parseInt(tamanho)}] = '${transation}'
				
			where id = '${member.id}'
		`)
	}
}