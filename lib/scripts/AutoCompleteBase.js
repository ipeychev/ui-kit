'use strict';

import Component from 'metaljs/src/component/Component';
import ComponentRegistry from 'metaljs/src/component/ComponentRegistry';
import core from 'metaljs/src/core';
import dom from 'metaljs/src/dom/dom';
import EventHandler from 'metaljs/src/events/EventHandler';
import {CancellablePromise as Promise} from 'metal-promise/src/promise/Promise';

/*
 * AutoCompleteBase component.
 */
class AutoCompleteBase extends Component {
	/**
	 * @inheritDoc
	 */
	constructor(opt_config) {
		super(opt_config);
	}

	/**
	 * @inheritDoc
	 */
	attached() {
		this.eventHandler_ = new EventHandler();
		this.eventHandler_.add(
			dom.on(this.inputElement, 'input', this.onInput_.bind(this))
		);

		this.on('select', this.selectValue_.bind(this));
	}

	/**
	 * @inheritDoc
	 */
	detached() {
		this.eventHandler_.removeAllListeners();
	}

	/**
	 * Formats the data before to pass it to the UI for displaying.
	 * The `format` function will be called for each item from the data array.
	 *
	 * @protected
	 * @param {!Array} data The data which have to be formatted
	 * @return {Array} The formatted data
	 */
	formatData_(data) {
		if (this.format) {
			data = data.map(function(item) {
				return this.format(item);
			}.bind(this));
		}

		return data;
	}

	/**
	 * Handles the input event in the input element. The function will
	 * load the data and emit `query` and `result` events.
	 *
	 * @protected
	 */
	onInput_() {
		var query = this.inputElement.value;

		this.emit('query', query);

		Promise.resolve(this.data(query))
		.then(function(data) {
			this.emit('result', this.formatData_(data));
		}.bind(this))
		.catch(function(error) {
			this.emit('error', error);
		}.bind(this));
	}

	/**
	 * Selects a value from the UI and populates the input element with
	 * the selected value.
	 *
	 * @protected
	 * @param {!Object} value The value provided by the UI, which have
	 * to be put in the input element
	 */
	selectValue_(value) {
		if (this.select) {
			value = this.select(this.inputElement.value, value);
		}

		this.inputElement.value = value;

		this.inputElement.focus();
	}

	/**
	 * Normalizes the provided data value. If the value is not a function,
	 * the value will be wrapped in a function which returns the provided value.
	 *
	 * @protected
	 * @param {*} val The provided value which have to be normalized.
	 */
	setData_(val) {
		if (!core.isFunction(val)) {
			return function() {
				return val;
			};
		}

		return val;
	}
}

/**
 * AutoCompleteBase attributes definition.
 * @type {Object}
 * @static
 */
AutoCompleteBase.ATTRS = {
	/**
	 * Function or array, which have to return the results from the query.
	 * If function, it should return an `array` or a `Promise`. In case of
	 * Promise, it should be resolved with an array containing the results.
	 *
	 * @type {Array.<object>|function}
	 */
	data: {
		value: [],
		setter: 'setData_'
	},

	/**
	 * Function, which will be invoked for each item from the array of the results
	 * which have to be formatted. The function should return an object
	 * with at least one property called `text`.
	 *
	 * @type {function()}
	 */
	format: {
		validator: core.isFunction
	},

	/**
	 * The element which will be used source for the data queries.
	 *
	 * @type {DOMElement|string}
	 */
	inputElement: {
		setter: dom.toElement
	},

	/**
	 * Function, which have to format the chosen value from the user.
	 * It will receive two parameters - the selected value from the user
	 * and the current value from the input element.
	 *
	 * @type {function()}
	 */
	select: {
		validator: core.isFunction
	}
};

ComponentRegistry.register('AutoCompleteBase', AutoCompleteBase);

export default AutoCompleteBase;
