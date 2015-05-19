'use strict';

import core from 'metaljs/src/core';

/*
 * Visible component.
 */
function Visible(){}

/**
 * Synchronizes the visibility of the component.
 *
 * @protected
 * @param {boolean} visible If true, shows the component, hides it otherwise.
 */
Visible.prototype.syncVisible = function(visible) {
	this.element.style.display = visible ? null : 'none';
};

/**
 * Visible attributes definition.
 *
 * @type {Object}
 * @static
 */
Visible.ATTRS = {
	/**
	 * Toggles the visibility of a component.
	 *
	 * @type {boolean}
	 * @default true
	 */
	visible: {
		validator: core.isBoolean,
		value: true
	}
};

export default Visible;