var express = require('express'),
	bodyParser = require('body-parser'),
	OAuth2Server = require('oauth2-server'),
	Request = OAuth2Server.Request,
	Response = OAuth2Server.Response;

require('dotenv').config();

const model = require('./src/model.js');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.oauth = new OAuth2Server({
	model,
	allowBearerTokensInQueryString: true,
	debug: true,
});

app.all('/oauth/token', obtainToken);

// app.get('/', authenticateRequest, function(req, res) {
//
// 	res.send('s area!');
// });

app.use('/', authenticateRequest, require('./src/dummy_routes'))


const port = process.env.PORT || 3011
app.listen(port, () => {
	console.log(`Oauth2 Server is running at http://localhost:${port}`);
});

function obtainToken(req, res) {

	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.token(request, response)
		.then(function(token) {

			const result = {
				token_type: 'Bearer',
				access_token: token.accessToken,
				expires_in: model.JWT_ACCESS_TOKEN_EXPIRY_SECONDS,
			}

			res.json(result);
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}

function authenticateRequest(req, res, next) {

	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.authenticate(request, response)
		.then(function(token) {

			next();
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}
