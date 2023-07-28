const NodeCache = require('node-cache');
const express = require('express');
const server = express();

const { HubspotService } = require('../services');
const config = require('../../config');
const refreshTokenStore = {};
const accessTokenCache = new NodeCache({ deleteOnExpire: true });

//===========================================================================//
//  HUBSPOT APP CONFIGURATION
//
//  All the following values must match configuration settings in your app.
//  They will be used to build the OAuth URL, which users visit to begin
//  installing. If they don't match your app's configuration, users will
//  see an error page.

// Replace the following with the values from your app auth config,
// or set them as environment variables before running.

const CLIENT_ID = config.CLIENT_ID;
const CLIENT_SECRET = config.CLIENT_SECRET;
const URL_API = config.API_URL;
// Scopes for this app will default to `crm.objects.contacts.read`
// To request others, set the SCOPE environment variable instead
let SCOPES = ['crm.objects.contacts.read'];
if (config.SCOPE) {
  SCOPES = config.SCOPE.split(/ |, ?|%20/).join(' ');
}
// On successful install, users will be redirected to /oauth-callback
const REDIRECT_URI = `${URL_API}/oauth-callback`;

//================================//
//   Running the OAuth 2.0 Flow   //
//================================//

// Step 1
// Build the authorization URL to redirect a user
// to when they choose to install the app
const authUrl =
  'https://app.hubspot.com/oauth/authorize' +
  `?client_id=${encodeURIComponent(CLIENT_ID)}` + // app's client ID
  `&scope=${encodeURIComponent(SCOPES)}` + // scopes being requested by the app
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`; // where to send the user after the consent page
server.use('/files', express.static(__dirname + '/../../src'));
module.exports = {
  preInstall: async (req, res) => {
    if (!config.CLIENT_ID || !config.CLIENT_SECRET) {
      throw new Error('Missing CLIENT_ID or CLIENT_SECRET environment variable.');
    }
    console.log('=== Initiating OAuth 2.0 flow with HubSpot ===');
    console.log("===> Step 1: Redirecting user to your app's OAuth URL");
    res.redirect(authUrl);
    console.log('===> Step 2: User is being prompted for consent by HubSpot');
  },
  auth: async (req, res) => {
    console.log('===> Step 3: Handling the request sent by the server');
    // Received a user authorization code, so now combine that with the other
    // required values and exchange both for an access token and a refresh token
    if (req.query.code) {
      console.log('       > Received an authorization token');

      const authCodeProof = {
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: req.query.code,
      };

      // Step 4
      // Exchange the authorization code for an access token and refresh token
      console.log('===> Step 4: Exchanging authorization code for an access token and refresh token');
      const token = await HubspotService.exchangeForTokens(req.sessionID, authCodeProof, refreshTokenStore);
      if (token.message) {
        return res.redirect(`/error?msg=${token.message}`);
      }

      res.redirect(`/home?refresh=${refreshTokenStore[req.sessionID]}`);
    }
    res.status(200).end();
  },
  getToken: async (req, res) => {
    try {
      if (!refreshTokenStore[req.sessionID]) {
        return res.status(401).json({ message: 'No esta autorizado Autenticación por Hubspot por permisos ❌' });
      }
      const tokenHubSpot = await HubspotService.getAccessToken(req.sessionID);
      res.status(200).json({ message: tokenHubSpot });
    } catch (err) {
      res.status(401).json({ message: 'Error Token hubspot ❌' });
    }
  },
  refreshToken: async (req, res) => {
    try {
      let token = await HubspotService.refreshAccessToken(null, req.body.refresh);
      res.status(200).json({ token });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  },
  getUser: async (req, res) => {
    // Once the tokens have been retrieved, use them to make a query
    // to the HubSpot API
    let { token } = req.headers;
    try {
      const user = await HubspotService.getUser(token);
      res.status(200).json({ user });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  },
};
