/**
 * Created by gonzalo on 20/10/15.
 */
import test from 'tape';
import reducer from '../../source/reducer/reducer';
import {is, fromJS} from 'immutable';

test('reducer actions', nest => {
  nest.test('...handle command', assert => {
    const msg = 'should handle \'command\' action',
      action = {
        type: 'command',
        data: 'a command'
      },
      state = fromJS({
        history: [],
        count: 0,
        current: 0
      });

    assert.equal(is(state, reducer(state, action)), false, msg);
    assert.end();
  });

  nest.test('...handle undo', assert => {
    const msg = 'should handle \'undo\' action',
      action = {
        type: 'undo'
      },
      state = fromJS({
        history: ['set base', 'base'],
        count: 2,
        current: 1
      });

    assert.equal(is(state, reducer(state, action)), false, msg);
    assert.end();
  });

  nest.test('...handle redo', assert => {
    const msg = 'should handle \'redo\' action',
      action = {
        type: 'redo'
      },
      state = fromJS({
        history: ['set base', 'base'],
        count: 2,
        current: 0
      });

    assert.equal(is(state, reducer(state, action)), false, msg);
    assert.end();
  });
});

test('integration between reducer and core', assert => {
  const msg = 'should be the final state.',
    actions = [
      {type: 'command', data: 'base base.json'},
      {type: 'command', data: 'set broker.name=gonzalo'},
      {type: 'undo'},
      {type: 'redo'}
    ],
    expected = {
      history: ['base base.json', 'set broker.name=gonzalo', ''],
      count: 3,
      current: 2
    },

    actual = actions.reduce(reducer, undefined).toJS();

  assert.deepEqual(actual, expected, msg);
  assert.end();
});
