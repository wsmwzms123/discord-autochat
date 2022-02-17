const axios = require("axios")
require('dotenv').config()

const headers = {
  "Authorization": process.env.AUTHORIZATION,
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
}

const proxyConfigsForClash = {
  host: '127.0.0.1',
  port: '7890'
}


module.exports = axios.create({
  proxy: proxyConfigsForClash,
  headers
});