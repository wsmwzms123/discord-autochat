const axios = require("./axios-instance");
const {
  SELF_ID
} = process.env

const buildReferenceMsg = (channel_id, guild_id, message_id) => {
  if (!guild_id || !channel_id || !message_id) return null
  return {
    channel_id,
    message_id,
    guild_id
  }
}

// const buildNonce = () => {
//   const BASIC_NONCE_UNIT = 1e13
//   const START_NUM = '94389'
//   return START_NUM + Math.floor(Math.random() * BASIC_NONCE_UNIT)
// }
let guild_id = ''
let channel_id = ''

const buildChannelMsgUrl = (channel, limit = 50) =>
  `https://discordapp.com/api/v9/channels/${channel}/messages?limit=${limit}`

/* 获得频道消息 */
const getChannelMsgs = async (channel, limit = 50) => {
  const url = buildChannelMsgUrl(channel, limit)
  return new Promise(async (resolve, reject) => {
    try {
      let {
        data: msg
      } = await axios.get(url)
      msg = msg
        .filter(({
          author: {
            id
          },
          content
        }) => id !== SELF_ID && content)
        .map(({
          content,
          author: {
            id: authorId
          },
          id: message_id,
          message_reference: ref
        }) => {
          if (!guild_id && ref) {
            guild_id = ref.guild_id
            channel_id = ref.channel_id
          }
          return {
            authorId,
            content,
            message_id,
            message_reference: ref
          }
        })
      const commonMsg = msg.filter(({
        message_reference
      }) => !message_reference)
      const refMsg = msg.filter(({
        message_reference
      }) => message_reference)
      resolve({
        commonMsg,
        refMsg
      })
    } catch (error) {
      reject(error)
    }
  })
}

const sendMsg = async (content, ref) => {
  const msg = {
    content,
    tts: false,
  }
  if (ref) {
    if (typeof ref === 'string') {
      ref = buildReferenceMsg(channel_id, guild_id, ref)
    }
    Object.assign(msg, {
      message_reference: ref
    })
  }
  try {
    if (!channel_id) return
    await axios({
      method: 'POST',
      url: `https://discord.com/api/v9/channels/${channel_id}/messages`,
      data: msg
    })
    console.log(`【发送成功】: ${msg.content}`)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getChannelMsgs,
  sendMsg
}