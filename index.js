const Discord = require("discord.js")
const { MessageEmbed} = require('discord.js')
const client = new Discord.Client()
const setting = require('./setting.json')
const prefix = "!"
    


client.on("ready", () => {
    console.log("Start")
    console.log(`--------------------------------------------`);
});

client.on("message", (msg) => {
    
});

client.login(setting.token)