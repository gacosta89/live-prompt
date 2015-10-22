/**
 * Created by gonzalo on 20/10/15.
 */
import test from 'tape';
import makeStore from '../../source/store/store';
import reducer from '../../source/reducer/reducer';

test('integration between store, reducer and actions.', assert => {
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
    store = makeStore({reducer});

  let i = 0;

  store.subscribe(() => {
    i++;
    if (i === 4) {
      let actual = store.getState().toJS();
      assert.deepEqual(actual, expected, msg);
      assert.end();
    }
  });

  actions.forEach(action => {
    store.dispatch(action);
  });
});

