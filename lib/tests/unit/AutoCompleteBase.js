'use strict';

import AutoCompleteBase from '../../scripts/AutoCompleteBase';
import dom from 'metaljs/src/dom/dom';

var autoCompleteBase;
var inputElement;

var states = [
  'Alabama',
  'Alaska'
];

var data = function(query) {
  var res = [];

  if (query) {
      query = query.toLowerCase();

      res = states.filter(function(item) {
          return (item.toLowerCase().indexOf(query) === 0);
      }.bind(this));
  }

  return res;
};

describe('AutoCompleteBase', function() {
  afterEach(function() {
    if (autoCompleteBase) {
      autoCompleteBase.dispose();
      autoCompleteBase = null;
    }

    if (inputElement) {
      dom.exitDocument(inputElement);
      inputElement = null;
    }
  });

  beforeEach(function(){
    inputElement = document.createElement('div');
    dom.enterDocument(inputElement);
  });


  it('should wrap the passed value in a function if not already a function', function() {
    autoCompleteBase = new AutoCompleteBase({
        data: [],
        inputElement: inputElement
      }).render();

    assert.isFunction(autoCompleteBase.data);
  });

  it('should return the same value when data is wrapped in a function', function(done) {
    autoCompleteBase = new AutoCompleteBase({
      data: states,
      inputElement: inputElement
    }).render();

    autoCompleteBase.once('result', function(result) {
      assert.strictEqual(states, result);

      done();
    });

    autoCompleteBase.inputElement.value = 'b';

    dom.triggerEvent(autoCompleteBase.inputElement, 'input');
  });

  it('should emit error when data throws exception', function(done) {
    autoCompleteBase = new AutoCompleteBase({
      data: function() {
        return new Promise(function(resolve, reject) {
          reject('error');
        });
      },
      inputElement: inputElement
    }).render();

    autoCompleteBase.once('error', function() {
      done();
    });

    autoCompleteBase.inputElement.value = 'a';

    dom.triggerEvent(autoCompleteBase.inputElement, 'input');
  });

  it('should emit error when format throws exception', function(done) {
    autoCompleteBase = new AutoCompleteBase({
      data: data,
      format: function() {
        throw 'Exception';
      },
      inputElement: inputElement
    }).render();

    autoCompleteBase.once('error', function() {
      done();
    });

    autoCompleteBase.inputElement.value = 'a';

    dom.triggerEvent(autoCompleteBase.inputElement, 'input');
  });

  it('should detach the attached event listeners on dispose', function() {
      autoCompleteBase = new AutoCompleteBase({
        data: data,
        inputElement: inputElement
      }).render();

      var removeEventListener = sinon.stub();

      autoCompleteBase.inputElement.removeEventListener = removeEventListener;

      autoCompleteBase.dispose();
      autoCompleteBase = null;

      assert.ok(removeEventListener.calledWith('input'));
  });

  it('should trigger query event on input', function(done) {
    autoCompleteBase = new AutoCompleteBase({
      data: states,
      inputElement: inputElement
    }).render();

    var queryListener = sinon.stub();

    autoCompleteBase.once('query', queryListener);

    dom.triggerEvent(autoCompleteBase.inputElement, 'input');

    setTimeout(function() {
      assert.ok(queryListener.calledOnce);
      done();
    }, 50);
  });

  it('should process the query and provide results', function(done) {
    autoCompleteBase = new AutoCompleteBase({
      data: data,
      inputElement: inputElement
    }).render();

    var resultListener = sinon.stub();

    autoCompleteBase.once('result', resultListener);

    autoCompleteBase.inputElement.value = 'a';

    dom.triggerEvent(autoCompleteBase.inputElement, 'input');

    setTimeout(function() {
      assert.ok(resultListener.calledOnce);

      done();
    }, 50);
  });

  it('should provide results when data loader returns Promise', function(done) {
    autoCompleteBase = new AutoCompleteBase({
      data: function() {
        return new Promise(function(resolve) {
          resolve(['Alabama', 'Alaska']);
        });
      },
      inputElement: inputElement
    }).render();

    dom.triggerEvent(autoCompleteBase.inputElement, 'input');

    autoCompleteBase.on('result', function(result) {
      assert.strictEqual(result.length, 2);

      done();
    });
  });

  it('should format the data before to display it', function(done) {
    autoCompleteBase = new AutoCompleteBase({
      data: data,
      format: function(item) {
        return item + '-formatted';
      },
      inputElement: inputElement
    }).render();

    autoCompleteBase.inputElement.value = 'a';

    dom.triggerEvent(autoCompleteBase.inputElement, 'input');

    autoCompleteBase.on('result', function(result) {
      assert.strictEqual(states.length, result.length);

      for (var i = 0; i < states.length; i++) {
        assert.strictEqual(states[i] + '-formatted', result[i]);
      }

      done();
    });
	});

  it('should select an item from the results', function(done) {
    autoCompleteBase = new AutoCompleteBase({
      data: data,
      inputElement: inputElement
    }).render();

    autoCompleteBase.inputElement.value = 'a';

    dom.triggerEvent(autoCompleteBase.inputElement, 'input');

    setTimeout(function() {
      autoCompleteBase.emit('select', 'Alabama');

      assert.strictEqual(autoCompleteBase.inputElement.value, 'Alabama');

      done();
    }, 50);
  });

  it('should format the data before applying it to the input', function(done) {
    autoCompleteBase = new AutoCompleteBase({
      data: data,
      select: function() {
          return 'new value';
      },
      inputElement: inputElement
    }).render();

    autoCompleteBase.inputElement.value = 'a';

    dom.triggerEvent(autoCompleteBase.inputElement, 'input');

    setTimeout(function() {
      autoCompleteBase.emit('select', 'Alabama');

      assert.strictEqual(autoCompleteBase.inputElement.value, 'new value');

      done();
    }, 50);
  });
});
