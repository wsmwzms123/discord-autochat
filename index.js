const fs = require('fs')
const {
  setChannel,
  getChannelMsgs,
  sendMsg,
  deleteMsg
} = require('./message')

const {
  Humanians,
} = process.env

let commonMsg = []
let refMsg = []
let hasGottenMsg = false

setChannel(Humanians)

const shuffle = list => list.sort(() => Math.random() - 0.5)
const sleep = delay => new Promise(resolve => setTimeout(resolve, delay))

const getMsgs = async () => {
  const msg = await getChannelMsgs(100, hasGottenMsg)
  commonMsg = shuffle(msg.commonMsg)
  refMsg = shuffle(msg.refMsg)
  if (!hasGottenMsg) hasGottenMsg = true
  return Promise.resolve()
}

const addDrama = async () => {
  while (true) {
    if (commonMsg.length) {
      const {
        content,
      } = commonMsg.shift()
      await fs.promises.appendFile('./drama.txt', content + '\n')
    } else {
      await sleep(1000 * 20)
      await getMsgs()
    }
  }
}

const sendCommonMsg = async () => {
  if (!commonMsg.length) {
    await getMsgs()
    return sendCommonMsg()
  }
  const {
    content,
  } = commonMsg.shift()
  return await sendMsg(content)
}

const sendRefMsg = async () => {
  if (!refMsg.length) {
    await getMsgs()
    return Promise.reject()
  }
  const {
    message_reference,
    content
  } = refMsg.shift()
  return await sendMsg(content, message_reference)
}

const selfDestructMsg = async () => {
  const {
    data: {
      id
    }
  } = await sendCommonMsg()
  await sleep(1500)
  await deleteMsg(id)
}

const start = async () => {
  console.log('【start】')
  await getMsgs()
  console.log(commonMsg, refMsg)

  async function chat() {
    while (true) {
      await selfDestructMsg()
      await sleep(1000 * 30)
    }
    // setTimeout(async () => {
    //   try {
    //     await sendCommonMsg()
    //   } catch (error) {
    //     await getMsgs()
    //   }
    //   chat()
    // }, 1000 * 60)
  }
  chat()
  // addDrama()
}

start()
// const get_context = () => {
//   context_list = [
//     "hello bro", "let's go !", "to the moon!", "nice", "project", "have a good day",
//     "good", "luck", "how's going", "so do i", "yeah", "same to me", "1", "cool", "so far so good",
//     "hi~", "of course", "really", "cool~", "ok", "what?", "why?", "not bad", "well done", "great",
//     "perferct", "thanks", "ture", "yes", "no", "here", "interesting", "it's funny", "i am tired"
//   ]
//   let randomNum = Math.floor(Math.random() * context_list.length);
//   return context_list[randomNum]
// }

// let chat = (channel_id) => {
//   let msg = {
//     "content": get_context(),
//     "tts": false
//   }
//   axios({
//     method: 'POST',
//     url: `https://discord.com/api/v9/channels/${channel_id}/messages`,
//     data: msg
//   }).then(res => {
//     console.log(`发送成功: ${msg.content}`)
//   })
// }

// chat = chat.bind(this, '923434325805006862')

// let count = 0
// const timer = setInterval(() => {
//   if (++count >= 4) {
//     clearInterval(timer)
//   }
//   chat()
// }, 2500)