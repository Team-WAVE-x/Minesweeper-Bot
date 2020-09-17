/* eslint-disable curly */
const setting = require('./setting.json')
const { Client, MessageEmbed } = require('discord.js')
const client = new Client()
const prefix = '!'

const arr = create2DArray(10, 10)
const spoiler = (str) => `||${str}||`
const int2Emoji = (int) => spoiler([':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':bomb:'][int])

function plusArr (i, j) {
  if (
    (i >= 0 && i <= 9) && (j >= 0 && j <= 9) &&
    (!(arr[i][j] === 9))) arr[i][j]++
}

client.on('ready', () => console.log('--Start--'))
client.on('message', (msg) => {
  if (msg.author.bot) return
  if (msg.content !== `${prefix}start`) return

  let bomb = 0

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) arr[i][j] = 0
  }

  for (let i = 0; i < 10; i++) {
    let x = Math.floor(Math.random() * 10)
    let y = Math.floor(Math.random() * 10)
    if (!(arr[x][y] === 9)) {
      arr[x][y] = 9
      bomb++
    }
    else i--
  }

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (arr[i][j] === 9) {
        plusArr(i + 1, j)
        plusArr(i + 1, j + 1)
        plusArr(i + 1, j - 1)
        plusArr(i - 1, j)
        plusArr(i - 1, j + 1)
        plusArr(i - 1, j - 1)
        plusArr(i, j + 1)
        plusArr(i, j - 1)
      }
    }
  }

  let description = ''

  for (let i = 0; i < 10; i++)
    for (let j = 0; j < 10; j++)
      description += int2Emoji(arr[i][j]) + (j > 8 ? '\n' : '')
  description += `\\💣 : ${bomb}개`
  msg.channel.send(new MessageEmbed({ title: '지뢰찾기', description }))
})

client.login(setting.token)
// client.login(process.env.token)

function create2DArray (rows, columns) {
  const arr = new Array(rows)
  for (let i = 0; i < rows; i++) {
    arr[i] = new Array(columns)
  }
  return arr
}
