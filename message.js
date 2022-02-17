const axios = require("./axios-instance");


let guild_id = ''

const buildReferenceMsg = (channel_id, message_id) => {
  if (!guild_id || !channel_id || !message_id) return null
  return {
    channel_id,
    message_id,
    guild_id
  }
}

const buildNonce = () => {
  const BASIC_NONCE_UNIT = 1e13
  const START_NUM = '94389'
  return START_NUM + Math.floor(Math.random() * BASIC_NONCE_UNIT)
}

const buildChannelMsgUrl = (channel, limit = 50) =>
  `https://discordapp.com/api/v9/channels/${channel}/messages?limit=${limit}`

/* 获得频道消息 */
const getChannelMsgs = async (channel, limit = 50) => {
  const url = buildChannelMsgUrl(channel, limit)

  return new Promise(async (resolve, reject) => {
    try {
      const {
        data: msg
      } = await axios.get(url)
      resolve(
        msg.map(({
          content,
          author: {
            id: authorId
          },
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

const sendMsg = async (content, ifReference) => {

}

module.exports = {
  getChannelMsgs
}