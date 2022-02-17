const axios = require("./axios-instance");
const {
  TEST_CHANNEL,
  AUTHOR_ID,
  MSG_LIST
} = process.env

console.log(MSG_LIST)

/* 获得频道消息 */
const getChannelMessage = async (channel, limit = 50) => {
  const url = `https://discordapp.com/api/v9/channels/${channel}/messages?limit=${limit}`
  return new Promise(async (resolve, reject) => {
    try {
      let {
        data: msg
      } = await axios.get(url)
      resolve(
        msg.map(({
          content,
          author: {id: authorId},
          id: channel_id,
          message_reference: {
            guild_id = null
          } = {}
        }) => ({
          authorId,
          content,
          channel_id,
          guild_id
        }))
      )
    } catch (error) {
      reject(error)
    }
  })
}


const chat = async () => {
  const channelMsg = await getChannelMessage(TEST_CHANNEL)
  console.log(channelMsg)
}

// chat()
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

// let chat = (chanel_id) => {
//   let msg = {
//     "content": get_context(),
//     "tts": false
//   }
//   console.log(msg)
//   axios({
//     method: 'POST',
//     url: `https://discord.com/api/v9/channels/${chanel_id}/messages`,
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