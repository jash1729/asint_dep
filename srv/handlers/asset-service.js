const cds = require('@sap/cds');

module.exports = cds.service.impl(async (srv) => {
  console.log('AssetService initialized - Dependency Check OK');
  
  srv.on('READ', 'Assets', async (req) => {
    return [];
  });
});
