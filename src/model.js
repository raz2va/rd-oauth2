var JWT = require('jsonwebtoken');
require('dotenv').config();

var model = module.exports;

const issuer = process.env.JWT_ISSUER || 'test';
const JWT_SECRET_FOR_ACCESS_TOKEN = process.env.JWT_SECRET_FOR_ACCESS_TOKEN || 'fdsfdsf45dfgf5D$';

// the expiry times should be consistent between the oauth2-server settings
// and the JWT settings (not essential, but makes sense)
model.JWT_ACCESS_TOKEN_EXPIRY_SECONDS = parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRY_SECONDS || 3600);

var oauthClients = [{
  id : process.env.CLIENT_ID,
  secret : process.env.CLIENT_SECRET,
  grants: ['client_credentials'],
  redirectUri : ''
}];


// Functions required to implement the model for oauth2-server

// generateToken
// This generateToken implementation generates a token with JWT.
// the token output is the Base64 encoded string.
model.generateAccessToken = function (client, user, scope, callback) {
  var token;
  var secret;
  //var user = req.user;
  var exp = new Date();
  exp.setSeconds(exp.getSeconds() + model.JWT_ACCESS_TOKEN_EXPIRY_SECONDS)

  var payload = {
    // public claims
    iss: issuer,   // issuer
    clientId: client.id,
    scope,
    //exp: exp.getTime(),
//    jti: '',         // unique id for this token - needed if we keep an store of issued tokens?
    // private claims
    //userId: user.id
  };

  secret = JWT_SECRET_FOR_ACCESS_TOKEN;

  token = JWT.sign(payload, secret, {expiresIn: model.JWT_ACCESS_TOKEN_EXPIRY_SECONDS});

  callback(false, token);
};

// The bearer token is a JWT, so we decrypt and verify it. We get a reference to the
// user in this function which oauth2-server puts into the req object
model.getAccessToken = function (bearerToken, callback) {

  return JWT.verify(bearerToken, JWT_SECRET_FOR_ACCESS_TOKEN, {issuer}, function(err, decoded) {

    if (err) {
      return callback(err, false);   // the err contains JWT error data
    }

    const accessTokenExpiresAt = new Date(0); // The 0 there is the key, which sets the date to the epoch
    accessTokenExpiresAt.setUTCSeconds(decoded.exp);

    return callback(false, {
      //expires: new Date(decoded.exp),
      user: {},
      accessTokenExpiresAt,
    });
  });
};


model.saveToken = function (token, client, user) {
  return {...token, client, user};
}

// authenticate the client specified by id and secret
model.getClient = function (clientId, clientSecret, callback) {
  for(var i = 0, len = oauthClients.length; i < len; i++) {
    var elem = oauthClients[i];
    if(elem.id === clientId &&
      (clientSecret === null || elem.secret === clientSecret)) {
      return callback(false, elem);
    }
  }
  callback(false, false);
};

model.getUserFromClient = () => {
  // imaginary DB query
  return {};
}

// list of valid scopes
const VALID_SCOPES = ['read', 'write'];

model.validateScope = function (user, client, scope) {
  if (!scope.split(' ').every(s => VALID_SCOPES.indexOf(s) >= 0)) {
    return false;
  }
  return scope;
}

