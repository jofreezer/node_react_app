const axios = require('axios').default

module.exports = async function sendSMS(tel, contenu) {
          if(!tel) return false
          const response = await axios.post('http://app.mediabox.bi:1124/sms', {
                    phone: tel,
                    txt_message: contenu,
          })
}