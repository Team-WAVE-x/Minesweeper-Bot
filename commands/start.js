const { MessageEmbed } = require('discord.js')
const prefix = '!'

const deadEmbed = new MessageEmbed().setTitle(':boom:펑!').setDescription('퍼어엉~!\n아쉽네요.. 다음번에 도전하시길..')
const arr = create2DArray(10, 10)

const spoiler = (str) => `||${str}||`
const int2Emoji = (int) => [':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':bomb:'][int]
const dead = (msg) => msg.channel.send(deadEmbed)

function fn (client, msg) {
  const plusArr = (i, j) => { if ((i >= 0 && i <= 9) && (j >= 0 && j <= 9) && (!(arr[i][j] === 9))) arr[i][j]++ }

  msg.channel.send(new MessageEmbed()
    .setTitle(':boom:지뢰찾기')
    .setDescription('지뢰찾기 모드를 골라주세요!\n1. 스포일러 모드\n2. 확인 모드'))
    .then(async (m) => {
      m.react('1️⃣')
      m.react('2️⃣')
      const reaction = (await m.awaitReactions((r, u) => u.id === msg.author.id && ['1️⃣', '2️⃣'].includes(r.emoji.name), { max: 1 })).first().emoji.name
      if (reaction === '1️⃣') spoilerMode(m)
      if (reaction === '2️⃣') confirmMode(m)
    })

  for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) arr[i][j] = 0

  // Create Bomb and Avoid duplication
  for (let i = 0; i < 10; i++) {
    const x = Math.floor(Math.random() * 10)
    const y = Math.floor(Math.random() * 10)
    if (arr[x][y] === 9) i--
    else arr[x][y] = 9
  }

  // Increase elements around the bomb
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
}

function create2DArray (rows, columns) {
  const arr = new Array(rows)
  for (let i = 0; i < rows; i++) arr[i] = new Array(columns)
  return arr
}

// Spoiler Mode
function spoilerMode (msg) {
  let description = ''
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) description += arr[i][j] === 0 ? int2Emoji(0) : spoiler(int2Emoji(arr[i][j]))
    description += '\n'
  }
  description += '\\💣 : 10개'
  msg.channel.send(new MessageEmbed({ title: '지뢰찾기 (스포일러 모드)', description }))
}

function confirmMode (msg) {
  const confirmArr = create2DArray(10, 10)

  msg.channel.send(new MessageEmbed({ title: '지뢰찾기 (확인 모드)', description: '`!확인 (x좌표) (y좌표)`로 그 곳이 어느 숫자인지 살펴보세요!\n`!찾기 (x좌표) (y좌표)`로 폭탄을 해체하세요!' }))
  const filter = m => m.content.startsWith(`${prefix}확인`) || m.content.startsWith(`${prefix}찾기`)
  const collector = msg.channel.createMessageCollector(filter, { time: 150000 })
  let bomb = 10; let chance = 10 // 폭탄 개수, 기회 번수
  // initial
  for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) confirmArr[i][j] = 10
  collector.on('collect', m => {
    const y = m.content.split(' ')[2]; const x = m.content.split(' ')[1]
    if (m.content.startsWith(`${prefix}확인`)) {
      if (confirmArr[y][x] !== 10) {
        m.channel.send(new MessageEmbed()
          .setTitle('이미 확인한 결과임')
          .setDescription('이미 확인한 결과'))
      } else {
        if (arr[y][x] === 9) {
          dead(msg)
          return
        }
        confirmArr[y][x] = arr[y][x]
        let description = ''
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 10; j++) description += confirmArr[i][j] === 10 ? (arr[i][j] === 0 ? int2Emoji(0) : ':black_large_square:') : int2Emoji(confirmArr[i][j])
          description += '\n'
        }
        m.channel.send(new MessageEmbed().setTitle('결과').setDescription(description))
      }
    } else if (m.content.startsWith(`${prefix}찾기`)) {
      if (arr[y][x] === 9) {
        bomb -= 1
        chance -= 1
        m.channel.send(new MessageEmbed().setTitle('🎉지뢰 찾음').setDescription(`\\💣폭탄 : ${bomb}개 남음\n\\🎱기회 : ${chance}번 남음`))
      } else {
        chance -= 1
        m.channel.send(new MessageEmbed().setTitle('🛑지뢰가 아닙니다.').setDescription(`\\💣폭탄 : ${bomb}개 남음\n\\🎱기회 : ${chance}번 남음`))
      }
    } else if (m.content === `${prefix}종료`) {
      m.channel.send(new MessageEmbed().setTitle('🛑종료됨').setDescription('종료되었습니다'))
      collector.stop()
    }
  })
  collector.on('end', () => {
    msg.channel.send(new MessageEmbed()
      .setTitle('끝')
      .setDescription('끝입니다'))
  })
}

module.exports = fn
module.exports.aliases = ['ping', '', 'pong']
