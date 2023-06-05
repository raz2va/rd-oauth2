const axios = require("axios");

module.exports = (redirect_url, authorisation) => {

  return async (req, res) => {
    const url = redirect_url + req.originalUrl
    try {
      const result = await axios({
        "headers": {
          "content-type": "application/json",
          'Authorization': authorisation
        },
        "method": req.method,
        "url": url,
        "data": req.body
      })
      res.set('content-type', result.headers['content-type'] || 'application/json')
      res.send(result.data)
    } catch (err) {
      res.status(400).send(err.message)
    }

  }
}
