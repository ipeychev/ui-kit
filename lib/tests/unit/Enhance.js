'use strict';

import Enhance from '../../scripts/Enhance';

describe('Enhance', function() {
	it('should enhance a class with feature', function() {
		var target = function(){};
		var feature = function() {};
		feature.ATTRS = {
			prop: {
				value: true
			}
		};
		var syncVisible = function(){};

		feature.prototype.syncVisible = syncVisible;
		Enhance(feature)(target);

		assert.deepPropertyVal(target, 'ATTRS.prop.value', true);
		assert.propertyVal(target.prototype, 'syncVisible', syncVisible);
	});
});