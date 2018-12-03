var app = app || {};

app.views = app.views || {};

app.views.PaymentHistory = (function() {

	'use strict';

	return app.views.utility.List.extend({

		className: 'payment-history',
		template: '#template-payment-history',
		itemContainer: '.payment-history-items',
		events: {
			'click .payment-history-item': 'showPaymentDetails',
		},

		initialize: function() {

			_.bindAll(this, 'exportPaymentHistory');
			this.$exportPaymentHistory = app.mainView.$('.header-button.export');
			this.$exportPaymentHistory .on('click', this.exportPaymentHistory);
		},

		collection: function() {
			return app.paymentRequests;
		},

		ItemView: function() {
			return app.views.PaymentHistoryListItem;
		},

		onRender: function() {

			app.views.utility.List.prototype.onRender.apply(this, arguments);
			var collection = _.result(this, 'collection');
			var total = _.result(collection, 'total');
			this.$el.toggleClass('empty', total === 0);
			// Add a class to body tag in order to show specific buttons in header.
			$('body').addClass('payment-history');
		},

		showPaymentDetails: function(evt) {

			if (evt && evt.preventDefault) {
				evt.preventDefault();
			}

			var paymentId = $(evt.currentTarget).attr('data-payment-id');
			app.router.navigate('payment-details/' + paymentId, { trigger: true });
		},

		addItem: function(model) {

			if (model.isComplete()) {
				// Only add "complete" payment requests.
				app.views.utility.List.prototype.addItem.apply(this, arguments);
			}
		},

		exportPaymentHistory: function() {

			app.busy(true);
			app.exportPayments.exportPaymentDetails(function(error) {
				app.busy(false);
				if (error) {
					return app.mainView.showMessage(app.i18n.t('payment-history.export.fail'));
				}

				app.mainView.showMessage(app.i18n.t('payment-history.export.success'));

			});
		}
	});
})();
