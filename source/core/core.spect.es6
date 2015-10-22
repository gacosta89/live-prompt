/**
 * Created by gonzalo on 20/10/15.
 */
import test from 'tape';
import {fromJS} from 'immutable';
import {newState, undo, redo, cancel} from './core';

test('set command', nest => {
  nest.test('...with future', assert => {
    const msg = 'should set the current command.',
      state = fromJS({
        history: ['base base.json', 'set broker.id=225', ''],
        count: 3,
        current: 0
      }),
      action = {
        type: 'COMMAND',
        data: 'set broker.name=gonzalo'
      },
      expected = {
        history: ['base base.json', 'set broker.id=225', 'set broker.name=gonzalo', ''],
        count: 4,
        current: 3
      },
      actual = newState(state, action).toJS();

    assert.deepEqual(actual, expected, msg);
    assert.end();
  });
});

test('undo', nest => {
  nest.test('... with past', assert => {
    const msg = 'should show the prev command.',
      state = fromJS({
        history: ['base base.json', 'set broker.name', ''],
        count: 3,
        current: 1
      }),
      expected = {
        history: ['base base.json', 'set broker.name', ''],
        count: 3,
        current: 0
      },
      actual = undo(state).toJS();

    assert.deepEqual(actual, expected, msg);
    assert.end();
  });

  nest.test('... without past.', assert => {
    const msg = 'should show the last command.',
      state = fromJS({
        history: ['base base.json', 'set broker.name', ''],
        count: 3,
        current: 0
      }),
      expected = {
        history: ['base base.json', 'set broker.name', ''],
        count: 3,
        current: 0
      },
      actual = undo(state).toJS();

    assert.deepEqual(actual, expected, msg);
    assert.end();
  });

});

test('redo', nest => {
  nest.test('... with future', assert => {
    const msg = 'should show the next command.',
      state = fromJS({
        history: ['base base.json', 'set broker.name', ''],
        count: 3,
        current: 0
      }),
      expected = {
        history: ['base base.json', 'set broker.name', ''],
        count: 3,
        current: 1
      },
      actual = redo(state).toJS();

    assert.deepEqual(actual, expected, msg);
    assert.end();
  });

  nest.test('... without future.', assert => {
    const msg = 'should show the last command.',
      state = fromJS({
        history: ['base base.json', 'set broker.name', ''],
        count: 3,
        current: 2
      }),
      expected = {
        history: ['base base.json', 'set broker.name', ''],
        count: 3,
        current: 2
      },
      actual = redo(state).toJS();

    assert.deepEqual(actual, expected, msg);
    assert.end();
  });
});

test('cancel', assert => {
  const msg = 'should cancel history search.',
    state = fromJS({
      history: ['base base.json', 'set broker.name', ''],
      count: 3,
      current: 0
    }),
    expected = {
      history: ['base base.json', 'set broker.name', ''],
      count: 3,
      current: 2
    },
    actual = cancel(state).toJS();

  assert.deepEqual(actual, expected, msg);
  assert.end();
});
