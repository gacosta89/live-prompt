/**
 * Created by gonzalo on 20/10/15.
 */
import test from 'tape';
import makeStore from '../../../source/store/store';
import reducer from '../../../source/reducer/reducer';

test('integration between store, reducer and actions.', assert => {
  const msg = 'should be the final state.',
    actions = [
      {type: 'commit', data: 'base base.json'},
      {type: 'commit', data: 'set broker.name=gonzalo'},
      {type: 'prev'},
      {type: 'prev'},
      {type: 'next'}
    ],
    expected = {
      history: {
        commands: ['base base.json', 'set broker.name=gonzalo'],
        index: 1
      },
      present: {
        buffer: 'set broker.name=gonzalo',
        command: ''
      }
    },
    store = makeStore({reducer});

  let i = 0;

  store.subscribe(() => {
    i++;
    if (i === 5) {
      let actual = store.getState().toJS();
      assert.deepEqual(actual, expected, msg);
      assert.end();
    }
  });

  actions.forEach(action => {
    store.dispatch(action);
  });
});

