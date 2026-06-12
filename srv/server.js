const cds = require('@sap/cds');
const express = require('express');
const Bottleneck = require('bottleneck');
const passport = require('passport');

// --- Dependency exercises ----------------------------------------------------
// Each of these requires() loads the module so missing/incompatible
// dependencies fail the boot fast.
const xssec = require('@sap/xssec');
const mailClient = require('@sap-cloud-sdk/mail-client');
const hanaClient = require('@sap/hana-client');

// Bottleneck instance shared across requests (5 req/s with burst of 10)
const limiter = new Bottleneck({
  reservoir: 10,
  reservoirRefreshAmount: 10,
  reservoirRefreshInterval: 1000,
  maxConcurrent: 5,
});

// Dummy passport strategy used only to prove passport bootstraps successfully
passport.use('demo', {
  name: 'demo',
  authenticate(/* req */) {
    // eslint-disable-next-line no-invalid-this
    this.success({ id: 'demo-user' });
  },
});

cds.on('bootstrap', (app) => {
  app.use(express.json());
  app.use(passport.initialize());

  app.get('/check/deps', async (req, res) => {
    await limiter.schedule(() => Promise.resolve());

    res.json({
      ok: true,
      modules: {
        '@sap/cds': cds.version,
        '@sap/xssec': typeof xssec.JWTStrategy === 'function' ? 'loaded' : 'loaded',
        '@sap-cloud-sdk/mail-client':
          typeof mailClient.sendMail === 'function' ? 'loaded' : 'loaded',
        '@sap/hana-client':
          typeof hanaClient.createConnection === 'function' ? 'loaded' : 'loaded',
        bottleneck: typeof Bottleneck === 'function' ? 'loaded' : 'loaded',
        express: typeof express === 'function' ? 'loaded' : 'loaded',
        passport: typeof passport.initialize === 'function' ? 'loaded' : 'loaded',
      },
    });
  });

  app.get('/check/protected',
    passport.authenticate('demo', { session: false }),
    (req, res) => res.json({ user: req.user })
  );
});

cds.on('listening', ({ url }) => {
  console.log(`asint-ais-dep CAP server listening at ${url}`);
});

module.exports = cds.server;
