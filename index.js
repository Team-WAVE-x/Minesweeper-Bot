const Discord = require("discord.js")
const {MessageEmbed, MessageCollector} = require('discord.js')
const client = new Discord.Client()
const setting = require('./setting.json')
const prefix = "!"
    


client.on('ready', () => {
    console.log("--Start--")
});


client.on('message', (msg) => {
    if (msg.bot) return;
    if (msg.content === `${prefix}start`){
        let arr = create2DArray(10, 10)
        msg.channel.send(new MessageEmbed()
            .setTitle('지뢰찾기 시작')
            .setDescription('TEST')
        )
    }
});

client.login(setting.token)