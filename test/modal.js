'use strict';

var body = document.body;
var m = new ModalLayout('Awesome');

QUnit.test('throws', function(assert) {
  assert.throws(
    function() {
      new ModalLayout();
    },
    /content must be a HTMLElement or string/,
    'raised error message contains \'content must be a HTMLElement or string\''
  );
});

QUnit.test('open', function(assert) {
  m.open();
  assert.equal(body.className, m.modalOpen, 'Modal opened');
});

QUnit.test('close', function(assert) {
  m.close();
  assert.equal(body.className, '', 'Modal closed');
});

QUnit.test('events', function(assert) {
  var doneOpen = assert.async();
  var doneClose = assert.async();
  var doneDestroy = assert.async();
  m.on('open', function() {
    assert.ok(true, 'true succeeds');
    doneOpen();
  });
  m.on('close', function() {
    assert.ok(true, 'true succeeds');
    doneClose();
  });
  m.on('destroy', function() {
    assert.ok(true, 'true succeeds');
    doneDestroy();
  });
  m.open();
  m.close();
  m.destroy();
});
