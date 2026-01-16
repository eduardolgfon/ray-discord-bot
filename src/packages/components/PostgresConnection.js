const c = require('chalk')

module.exports = class DatabaseConnection {
    constructor(ray) {
        this.ray = ray
    }
    async inicialize() {
        var db = this.ray.db
        db.connect()
            .then(connected => {
                console.log(c.green('[ DATABASE ] - √ Banco de dados operante'))
                this.ray.databaseConnection = true
            })
            .catch(error => console.log(c.red('[ DATABASE ] - x Não foi possível realizar conexão ao banco de dados\n'+error)))
        try {
            await db.query(`SELECT * FROM users`)
        } catch (e) {
            console.log(c.yellow(`Criando tabela de dados para usuários`))
            await db.query(`CREATE TABLE public.users (
                id VARCHAR(20) NOT NULL PRIMARY KEY,
                cats NUMERIC CHECK(cats > -1) DEFAULT 0,
                commands NUMERIC DEFAULT 0,
                prefix VARCHAR(3) DEFAULT '${this.ray.config.PREFIX}',
                lang VARCHAR(5) DEFAULT 'pt-BR',
                description TEXT NULL,
                wins NUMERIC DEFAULT 0,
                loses NUMERIC DEFAULT 0,
                logs TEXT [] NULL,
                achievements TEXT [] NULL,
                marry VARCHAR(20) NULL,
                marrytimestamp NUMERIC NULL,
                background VARCHAR(20) NULL,
                timedaily NUMERIC DEFAULT 0
              );
              `)
        }; try {
            await db.query(`SELECT * FROM servers`)
        } catch (e) {
            console.log(c.blue(`Criando tabela de dados para servidores`))
            await db.query(`CREATE TABLE public.servers (
                id VARCHAR(20) NOT NULL PRIMARY KEY,
                guildcount NUMERIC DEFAULT 0,
                miscmode BOOLEAN DEFAULT NULL
              );`)
        }; try {
            await db.query(`SELECT * FROM commands`)
        } catch (e) {
            console.log(c.green(`Criando tabela de dados para comandos`))
            await db.query(`CREATE TABLE public.commands (
                name TEXT NOT NULL PRIMARY KEY,
                maintenance BOOLEAN DEFAULT false,
                reason TEXT DEFAULT NULL
              );`)
        }; try {
            await db.query(`SELECT * FROM usersconfig`)
        } catch (e) {
            console.log(c.red(`Criando tabela de dados para configurações de usuários`))
            await db.query(`CREATE TABLE public.usersconfig (
                id VARCHAR(20) NOT NULL PRIMARY KEY,
                dnd BOOLEAN DEFAULT false,
                banned BOOLEAN NULL,
                reason TEXT NULL
              );`)
        }; try {
            await db.query(`SELECT * FROM serversconfig`)
        } catch (e) {
            console.log(c.red(`Criando tabela de dados para blacklist e parcerias`))
            await db.query(`CREATE TABLE public.serversconfig (
                id VARCHAR(20) NOT NULL PRIMARY KEY,
                partner BOOLEAN NULL,
                antiflood BOOLEAN NULL,
                antiinvite BOOLEAN NULL,
                catspermsg BOOLEAN NULL,
                banned BOOLEAN NULL,
                reason TEXT NULL
              );`)
        }; try {
            await db.query(`SELECT * FROM temp`)
        } catch (e) {
            console.log(c.blue(`Criando tabela de dados temporários`))
            await db.query(`CREATE TABLE temp (
                id VARCHAR(20) NOT NULL PRIMARY KEY,
                warn NUMERIC DEFAULT 0,
                channelDelete NUMERIC DEFAULT 0
              );`)
        }
    }
}