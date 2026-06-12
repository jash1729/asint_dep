/**
 * Verifies that every runtime dependency declared in package.json can be
 * loaded without throwing. This is the primary dependency check.
 */
describe('Dependency Check', () => {
  test('@sap/cds loads', () => {
    const cds = require('@sap/cds');
    expect(typeof cds.serve).toBe('function');
  });

  test('@sap/xssec loads', () => {
    const xssec = require('@sap/xssec');
    expect(xssec).toBeDefined();
  });

  test('@sap-cloud-sdk/mail-client loads', () => {
    const mail = require('@sap-cloud-sdk/mail-client');
    expect(mail).toBeDefined();
  });

  test('@sap/hana-client loads', () => {
    const hana = require('@sap/hana-client');
    expect(typeof hana.createConnection).toBe('function');
  });

  test('bottleneck loads', () => {
    const Bottleneck = require('bottleneck');
    expect(new Bottleneck()).toBeInstanceOf(Bottleneck);
  });

  test('express loads', () => {
    const express = require('express');
    expect(typeof express).toBe('function');
  });

  test('passport loads', () => {
    const passport = require('passport');
    expect(typeof passport.initialize).toBe('function');
  });
});
