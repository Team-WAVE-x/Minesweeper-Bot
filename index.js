const Discord = require("discord.js")
const {MessageEmbed, MessageCollector} = require('discord.js')
const client = new Discord.Client()
const setting = require('./setting.json')
const prefix = "!"
    


client.on('ready', () => {
    console.log("--Start--")
});



const create2DArray = (rows, columns) => {
    var arr = new Array(rows);
    for (var i = 0; i < rows; i++) {
        arr[i] = new Array(columns);
    }
    return arr;
}

let arr = create2DArray(10, 10)

const plusArr = (i, j) => {
    if ((i >= 0 && i <= 9) && (j >= 0 && j <= 9) && (!(arr[i][j] == 9))) arr[i][j]++
}



client.on('message', (msg) => {
    if (msg.bot) return;
    if (msg.content === `${prefix}start`){
        for (let i = 0; i < 10; i++){
            for (let j = 0; j < 10; j++){
                arr[i][j] = 0
            }
        }

        for (let i = 0; i < 10; i++){
            arr[Math.floor(Math.random() * 10)][Math.floor(Math.random() * 10)] = 9
        }
        
        for (let i = 0; i < 10; i++){
            for (let j = 0; j < 10; j++){
                if (arr[i][j] == 9) {
                    plusArr(i+1, j)
                    plusArr(i+1, j+1)
                    plusArr(i+1, j-1)
                    plusArr(i-1, j)
                    plusArr(i-1, j+1)
                    plusArr(i-1, j-1)
                    plusArr(i, j+1)
                    plusArr(i, j-1)
                }
            }
        }

        let print

        for (let i = 0; i < 10; i++){
            for (let j = 0; j < 10; j++){
                print += arr[i][j]
            }
            print += "\n"
        }

        
        msg.channel.send(new MessageEmbed()
            .setTitle('지뢰찾기')
            .setDescription(print)
        )
    }
});

client.login(setting.token)