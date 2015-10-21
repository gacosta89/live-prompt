/**
 * Created by gonzalo on 20/10/15.
 */
import test from 'tape';
import {reducer} from '../../source/reducer/reducer';
import {Map, toJS} from 'immutable';

test('integration between reducer and core', assert => {
  const msg = 'should be the final state.',
    actions = [
      {type: 'command', data: 'base base.json'},
      {type: 'command', data: 'set broker.name=gonzalo'},
      {type: 'undo'},
      {type: 'redo'}
    ],
    expected = {
      history: ['base base.json', 'set broker.name=gonzalo'],
      count: 2,
      current: 1
    },

    actual = actions.reduce(reducer, undefined).toJS();

  assert.deepEqual(actual, expected, msg);
  assert.end();
});