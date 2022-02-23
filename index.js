const {
  setChannel,
  getChannelMsgs,
  sendMsg
} = require('./message')

const {
  TALES_OF_ASHEA
} = process.env

let commonMsg = []
let refMsg = []
let hasGottenMsg = false

setChannel(TALES_OF_ASHEA)

const shuffle = list => list.sort(() => Math.random() - 0.5)

const getMsgs = async () => {
  const msg = await getChannelMsgs(100, hasGottenMsg)
  commonMsg = shuffle(msg.commonMsg)
  refMsg = shuffle(msg.refMsg)
  if (!hasGottenMsg) hasGottenMsg = true
  return Promise.resolve()
}

const sendCommonMsg = async () => {
  if (commonMsg.length) {
    const {
      content,
    } = commonMsg.shift()
    return await sendMsg(content)
  }
  return Promise.reject()
}

const sendRefMsg = async () => {
  if (refMsg.length) {
    const {
      message_reference,
      content
    } = refMsg.shift()
    return await sendMsg(content, message_reference)
  }
  return Promise.reject()
}

const start = async () => {
  console.log('【start】')
  await getMsgs()
  console.log(commonMsg, refMsg)
  const timer = setInterval(async () => {
    try {
      await sendCommonMsg()
    } catch (error) {
      await getMsgs()
    }
  }, 10000)
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