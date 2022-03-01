const axios = require("./axios-instance");
const {
  SELF_ID,
  TEST_CHANNEL
} = process.env


let channel_id = TEST_CHANNEL
let guild_id = ''
let before = '' //实际上他是一个消息id,用来查询他之前的消息

const setChannel = channel => channel && (channel_id = channel)
const setBefore = id => id && (before = id)


const buildReferenceMsg = (guild_id, message_id) => {
  if (!guild_id || !message_id || !channel_id) return null
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

const buildChannelMsgUrl = (limit = 100, searchBefore = false) => {
  const beforeQuery = searchBefore ? `before=${before}` : ''
  const limitQuery = `limit=${limit}`
  const queries = [limitQuery, beforeQuery].filter(Boolean).join('&')
  console.log(queries)
  return `https://discordapp.com/api/v9/channels/${channel_id}/messages?${queries}`
}
// discord.com/api/v9/channels/945616418848784454/messages/948150178223882260

/* 获得频道消息 */
const getChannelMsgs = async (limit = 100, searchBefore) => {
  const url = buildChannelMsgUrl(limit, searchBefore)
  const excludeReg = /[<>@:?？]|http/
  
  return new Promise(async (resolve, reject) => {
    try {
      let {
        data: msg
      } = await axios.get(url)
      setBefore(msg[msg.length - 1].id)
      msg = msg
        .filter(({
          author: {
            id
          },
          content
        }) => id !== SELF_ID && content && !excludeReg.test(content))
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
      ref = buildReferenceMsg(guild_id, ref)
    }
    if (!ref) return
    Object.assign(msg, {
      message_reference: ref
    })
  }
  let id
  try {
    if (!channel_id) return
    id =  await axios({
      method: 'POST',
      url: `https://discord.com/api/v9/channels/${channel_id}/messages`,
      data: msg
    })
    console.log(`【发送成功】: ${msg.content}`)
    return Promise.resolve(id)
  } catch (error) {
    console.log(`【发送失败】: `, error.message)
  }
}

const deleteMsg = async (message_id) => {
  const url = `https://discord.com/api/v9/channels/${channel_id}/messages/${message_id}`
  try {
    await axios({
      method: 'DELETE',
      url,
    })
    console.log('删除成功！ ')
  } catch (error) {
    console.log('【删除失败】: ', error.message)
  }
}

module.exports = {
  setChannel,
  getChannelMsgs,
  sendMsg,
  deleteMsg
}