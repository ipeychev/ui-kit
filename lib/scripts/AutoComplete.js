'use strict';

import AutoCompleteBase from './AutoCompleteBase';
import ComponentRegistry from 'metaljs/src/component/ComponentRegistry';
import {CancellablePromise as Promise} from 'metal-promise/src/promise/Promise';
import core from 'metaljs/src/core';
import dom from 'metaljs/src/dom/dom';
import List from './List';
import Position from './Position';

/*
 * AutoComplete component.
 */
class AutoComplete extends AutoCompleteBase {
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
		super.attached();
		this.list.attach(this.element);
		this.on('click', this.genericStopPropagation_);
		this.eventHandler_.add(dom.on(document, 'click', this.hide.bind(this)));
	}

	/**
	 * @inheritDoc
	 */
	detached() {
		super.detached();
		this.list.detach();
	}

	/**
	 * @inheritDoc
	 */
	renderInternal() {
		this.list = new List().render(this.element);
		this.list.on('itemSelected', this.onListItemSelected_.bind(this));
	}

	/**
	 * Aligns main element to the input element.
	 */
	align() {
		this.element.style.width = this.inputElement.offsetWidth + 'px';
		Position.align(this.element, this.inputElement, Position.Bottom);
	}

	/**
	 * @inheritDoc
	 */
	request(query) {
		var self = this;
		return super.request(query).then(function(data) {
			if (data) {
				data.forEach(self.assertItemObjectStructure_);
				self.list.items = data;
			}
			self.visible = !!(data && data.length > 0);
		});
	}

	/**
	 * Emits a `select` event with the information about the selected item and
	 * hides the element.
	 * @param {Element} item The list selected item.
	 */
	onListItemSelected_(item) {
		var selectedIndex = parseInt(item.getAttribute('data-index'), 10);
		this.emit('select', this.list.items[selectedIndex]);
		this.hide();
	}

	/**
	 * Stops propagation of an event.
	 * @param {Event} event
	 * @protected
	 */
	genericStopPropagation_(event) {
		event.stopPropagation();
	}

	/**
	 * @inheritDoc
	 */
	syncVisible(visible) {
		super.syncVisible(visible);

		if (visible) {
			this.align();
		}
	}

	/**
	 * Asserts that formatted data is valid. Throws error if item is not in the
	 * valid syntax.
	 * @param {*} item
	 * @protected
	 */
	assertItemObjectStructure_(item) {
		if (!core.isObject(item)) {
			throw new Promise.CancellationError('AutoComplete item must be an object');
		}
		if (!item.hasOwnProperty('textPrimary')) {
			throw new Promise.CancellationError('AutoComplete item must be an object with \'textPrimary\' key');
		}
	}
}

AutoComplete.ATTRS = {
	/**
	 * @inheritDoc
	 */
	format: {
		value: function(item) {
			return core.isString(item) ? { textPrimary: item } : item;
		}
	}
};

/**
 * Provides a list of classes which have to be applied to the element's DOM element.
 * @type {string}
 * @static
 * @default 'autocomplete autocomplete-list'
 */
AutoComplete.ELEMENT_CLASSES = 'autocomplete autocomplete-list';

ComponentRegistry.register('AutoComplete', AutoComplete);

export default AutoComplete;
