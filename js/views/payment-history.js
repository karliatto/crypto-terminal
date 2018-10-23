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
			'scroll': 'onScroll',
			// 'click #export-history-csv': 'exportPaymentDetails'  /**TODO: rename id # */
		},

		ItemView: function() {
			return app.views.PaymentHistoryListItem;
		},

		offset: 0,
		total: 0,

		initialize: function() {

			_.bindAll(this, 'fetchPayments', 'onScroll');

			this.collection = app.paymentRequests;
		},

		fetchPayments: function() {

			var $el = this.$el;
			$el.addClass('loading');
			window.requestAnimationFrame(_.bind(function() {
				this.collection.fetch({
					limit: app.config.paymentHistory.list.limit,
					offset: this.offset,
					error: function() {
						$el.removeClass('loading');
						app.mainView.showMessage(app.i18n.t('payment-history.failed-to-get-payment-data'));
					},
					success: _.bind(function() {
						$el.removeClass('loading');
						this.$el.toggleClass('empty', this.collection.length === 0);
					}, this),
				});
			}, this));
		},

		onRender: function() {

			app.log('paymentHistory.onRender');
			if (this.collection.length < app.config.paymentHistory.list.limit) {
				this.fetchPayments();
			} else {
				this.renderItems();
			}
			this.$items = this.$('.payment-history-items');
			this.$items.on('scroll', this.onScroll);
		},

		onScroll: function(evt) {

			app.log('paymentHistory.onScroll');
			var scrollHeightRemaining = this.getScrollHeightRemaining();
			var threshold = $(window).height();
			if (scrollHeightRemaining < threshold && this.hasMoreItemsToFetch()) {
				this.offset += app.config.paymentHistory.list.limit;
				this.fetchPayments();
			}
		},

		getScrollHeightRemaining: function() {

			return this.$items.prop('scrollHeight') - (this.$items.scrollTop() + this.$items.outerHeight());
		},

		hasMoreItemsToFetch: function() {

			return this.collection.length < this.collection.total;
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

		onClose: function() {

			this.$items.off('scroll', this.onScroll);
		},

		// exportPaymentDetails: function() {

		// 	var fileName = app.config.paymentHistory.export.fileName;

		// 	var history = _.filter(_.map(this.collection.models, function (model) {
		// 		return model.attributes;
		// 	}));

		// 	app.services.exportPayments.exportPaymentDetails(history, fileName, function(error) {

		// 		if (error) {
		// 			return alert(app.i18n.t('payment-history.export.fail'));
		// 		}

		// 		alert(app.i18n.t('payment-history.export.success'));

		// 	})
			
		// }
	});
})();
