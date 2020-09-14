const Discord = require("discord.js")
const { MessageEmbed , MessageCollector} = require('discord.js')
const client = new Discord.Client()
const setting = require('./setting.json')
const prefix = "!"
    


client.on("ready", () => {
    console.log("Start")
    console.log(`--------------------------------------------`);
});

client.on("message", (msg) => {
    let topic = msg.content.slice(4)
    if (msg.content.startsWith(`${prefix}시작`)){
        if (msg.content === `${prefix}시작`) return
        msg.channel.send(new MessageEmbed()
            .setTitle('🔊 토론을 시작합니다.')
            .addField(`**주제**`, `${topic}`))
        
        msg.channel.send(new MessageEmbed()
            .setTitle(`👀 토론에 참가하실 분`)
            .setDescription(`**"${topic}"** 이란 주제로 토론을 하고 싶으신 분은 **"!참가"** 라고 외쳐주세요!\n제한시간은 15초예요!`))

        //new MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 1000 })

        const filter = m => m.content === '!참가';
        const collector = msg.channel.createMessageCollector(filter, { time: 15000 });

        let member = []
        let mem_list
        collector.on('collect', m => {
            if (!member.includes(m.author.id)){
                member.push(m.author.id)
                mem_list = ""
                member.forEach((mem) => {
                    mem_list += `<@${mem}>\n`;
                })
                msg.channel.send(new MessageEmbed()
                    .setTitle(`🤗 ${m.author.tag}님 참가!`)
                    .addField(`현재 참가자`, `${mem_list}`))

            }
        })
            
        collector.on('end', (collected) => {
            if (member.length === 1){
                msg.channel.send(new MessageEmbed()
                .setTitle('🛑 너무 인원이 적네요')
                .setDescription(`토론은 2명 이상 참가가 가능해요.`))
                return
            }
            else {            
                msg.channel.send(new MessageEmbed()
                .setTitle('🛑 찬반정하기')
                .addField('이분들은 반응으로 찬반을 정해주세요 (⭕: 찬성, ❌: 반대)', `${mem_list}`))
                .then(async (m) => {
                    m.react('⭕')
                    m.react('❌')
                })
            }
        });
    }
});

client.on('messageReactionAdd', (react) => {
    console.log(react.emoji.name)
    console.log(react.emoji.id)
    if (react.emoji.name == '⭕'){
        react.message.channel.send(`님 찬성`)
    }
})

client.login(setting.token)