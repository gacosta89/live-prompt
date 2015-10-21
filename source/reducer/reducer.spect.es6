/**
 * Created by gonzalo on 20/10/15.
 */
import test from 'tape';
import Immutable from 'immutable';
import {reducer} from './reducer';

test('reducer', nest => {
  nest.test('...handle command', assert => {
    const msg = 'should handle \'command\' action',
      action = {
        type: 'command',
        data: 'a command'
      },
      state = Immutable.fromJS({
        history: [],
        count: 0,
        current: 0
      });

    assert.equal(Immutable.is(state, reducer(state, action)), false, msg);
    assert.end();
  });

  nest.test('...handle undo', assert => {
    const msg = 'should handle \'undo\' action',
      action = {
        type: 'undo'
      },
      state = Immutable.fromJS({
        history: ['set base', 'base'],
        count: 2,
        current: 1
      });

    assert.equal(Immutable.is(state, reducer(state, action)), false, msg);
    assert.end();
  });

  nest.test('...handle redo', assert => {
    const msg = 'should handle \'redo\' action',
      action = {
        type: 'redo'
      },
      state = Immutable.fromJS({
        history: ['set base', 'base'],
        count: 2,
        current: 0
      });

    assert.equal(Immutable.is(state, reducer(state, action)), false, msg);
    assert.end();
  });
});