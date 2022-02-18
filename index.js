// const axios = require("./axios-instance")

const {
  getChannelMsgs,
  sendMsg
} = require('./message')

const {
  TEST_CHANNEL,
  BABYSWAP_CHANNEL,
  SELF_ID,
  MSG_LIST
} = process.env

let channelId = ''
let commonMsg = []
let refMsg = []

const setChannel = channel => channelId = channel

setChannel(BABYSWAP_CHANNEL)

const initContext = async () => {
  const msg = await getChannelMsgs(channelId, 100)
  commonMsg = msg.commonMsg
  refMsg = msg.refMsg
  return Promise.resolve()
}

const chat = async () => {
  // const msg = await getChannelMsgs(channelId)
}

const start = async () => {
  await initContext()
  if (refMsg.length) {
    const {
      message_reference,
      content
    } = refMsg[0]
    sendMsg(content, message_reference)
  }
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