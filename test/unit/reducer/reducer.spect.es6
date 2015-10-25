/**
 * Created by gonzalo on 24/10/15.
 */
import test from 'tape';
import makeReducer from '../../../source/reducer/reducer';

test('make reducer', nest => {
  nest.test('... return type', assert => {
    const msg = 'should return a reducer function',
      expected = 'function',
      actual = typeof makeReducer();

    assert.equal(actual, expected, msg);
    assert.end();
  });

  nest.test('... handle action', assert => {
    assert.plan(1);
    const msg = 'should handle the correct action',
      expected = 'handleAction',
      actionHandlers = {
        handleAction (state, {type: actual}) {
          assert.equal(actual, expected, msg);
        }
      };

      makeReducer({actionHandlers})(undefined, {type: 'handleAction'});
  });

  nest.test('... handle undefined action', assert => {
    const msg = 'should return the same state',
      expected = 'hello',
      actionHandlers = {
        handleAction () {
          assert.equal(true, false, 'should not call this action handler.');
        }
      },
      actual = makeReducer({actionHandlers})('hello');

    assert.equal(actual, expected, msg);
    assert.end();
  });
});
