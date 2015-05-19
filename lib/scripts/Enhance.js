'use strict';

import object from 'metaljs/src/object/object';

/*
 * Enhance component.
 */
function Enhance(feature) {
	/**
	 * Applies to the target the properties from the prototype and all static
	 * properties of the provided class.
	 *
	 * @param {function} target The target which have to be enhanced.
	 * @return {function} Returns property decorator.
	 */
	return function decorator(target) {
		var key;

		for (key in feature.prototype) {
			if (feature.prototype.hasOwnProperty(key)) {
				target.prototype[key] = feature.prototype[key];
			}
		}

		for (key in feature) {
			if (feature.hasOwnProperty(key)) {
				if (typeof feature[key] === 'object') {
					target[key] = target[key] || {};

					object.mixin(target, feature[key]);
				} else {
					target[key] = feature[key];
				}
			}
		}
	};
}

export default Enhance;