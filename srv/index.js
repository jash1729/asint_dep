const cds = require('@sap/cds');

module.exports = cds.service.impl(async (srv) => {
  console.log('Main CDS service initialized');
});
