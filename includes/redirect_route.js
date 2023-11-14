const axios = require("axios");

const ATTEMPTS_MAX = parseInt(process.env.ATTEMPTS_MAX || 3);

module.exports = (redirect_url, authorisation) => {

  return async (req, res) => {
    const url = redirect_url + req.originalUrl
    let error = undefined;
    for (let i = 1; i <= ATTEMPTS_MAX; i++) {
      res.rdAttempts = i;
      const result = await tryToSend(url, req, res, authorisation);
      if (!result.error) {
        res.set('content-type', result.headers['content-type'] || 'application/json')
        res.send(result.data)
        return;
      }
      error = result.error;
    }
    res.rdError = error;
    res.status(400).send(res.rdError)
  }
}

const tryToSend = async (url, req, res, authorisation) => {
  try {
    return await axios({
      "headers": {
        "content-type": "application/json",
        'Authorization': authorisation
      },
      "method": req.method,
      "url": url,
      "data": req.body
    })
  } catch (err) {
    return {error: err.message};
  }
}
