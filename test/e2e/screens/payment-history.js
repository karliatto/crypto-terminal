'use strict';

var manager = require('../../manager');
require('../global-hooks');

describe('#admin/payment-history', function() {

	beforeEach(function(done) {
		manager.onAppLoaded(done);
	});

	beforeEach(function(done) {
		manager.evaluateInPageContext(function() {
			app.setDeveloperMode(true);
			app.markGettingStartedAsComplete();
			app.settings.set('configurableCryptoCurrencies', ['bitcoinTestnet']);
			app.settings.set('bitcoinTestnet.extendedPublicKey', 'tpubDD8itYXaDtaTuuouxqdvxfYthFvs8xNbheGxwEcGXJyxrzuyMAxv4xbsw96kz4wKLjSyn3Dd8gbB7kF1bdJdphz1ZA9Wf1Vbgrm3tTZVqSs');
			app.settings.set('displayCurrency', 'EUR');
		}, done);
	});

	beforeEach(function(done) {
		manager.navigate('/#admin/payment-history', done);
	});

	it('it should open an alert', function(done) {

		manager.page.on('dialog', function(dialog) {

			dialog.accept();
			done();
		});
		manager.page.waitFor('.header-button.export').then(function() {
			manager.page.click('.header-button.export').catch(done);
		}).catch(done);
	});

});
