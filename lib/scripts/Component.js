'use strict';

import SoyComponent from 'metaljs/src/soy/SoyComponent';
import Enhance from './Enhance';
import Visible from './Visible';

@Enhance(Visible)
class Component extends SoyComponent {
	constructor(opt_config) {
		super(opt_config);
	}
}

export default Component;
