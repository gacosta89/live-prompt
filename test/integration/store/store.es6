/**
 * Created by gonzalo on 20/10/15.
 */
import test from 'tape';
import makeStore from '../../../source/store/store';
import makeReducer from '../../../source/reducer/reducer';
import {commit, prev, next, cancel, backspace, chunk, INITIAL_STATE} from '../../../source/core/core';

test('integration between store, reducer and actions.', assert => {
  assert.plan(2);
  const msg = 'should be the final state.',
    actions = [
      {type: 'commit', data: 'base base.json'},
      {type: 'commit', data: 'set broker.name=gonzalo'},
      {type: 'prev'},
      {type: 'backspace'},
      {type: 'cancel'},
      {type: 'cancel'},
      {type: 'prev'},
      {type: 'next'}
    ],
    expected = [{
      history: {
        commands: ['base base.json'],
        index: 1
      },
      present: {
        buffer: '',
        command: '',
        cursor: 0
      }
    },
    {
      history: {
        commands: ['base base.json', 'set broker.name=gonzalo'],
        index: 2
      },
      present: {
        buffer: '',
        command: '',
        cursor: 0
      }
    },
    {
      history: {
        commands: ['base base.json', 'set broker.name=gonzalo'],
        index: 1
      },
      present: {
        buffer: 'set broker.name=gonzalo',
        command: '',
        cursor: 23
      }
    },
    {
      history: {
        commands: ['base base.json', 'set broker.name=gonzalo'],
        index: 1
      },
      present: {
        buffer: 'set broker.name=gonzal',
        command: '',
        cursor: 22
      }
    },
    {
      history: {
        commands: ['base base.json', 'set broker.name=gonzalo'],
        index: 1
      },
      present: {
        buffer: 'set broker.name=gonzalo',
        command: '',
        cursor: 23
      }
    },
    {
      history: {
        commands: ['base base.json', 'set broker.name=gonzalo'],
        index: 2
      },
      present: {
        buffer: '',
        command: '',
        cursor: 0
      }
    },
    {
      history: {
        commands: ['base base.json', 'set broker.name=gonzalo'],
        index: 1
      },
      present: {
        buffer: 'set broker.name=gonzalo',
        command: '',
        cursor: 23
      }
    },
    {
      history: {
        commands: ['base base.json', 'set broker.name=gonzalo'],
        index: 2
      },
      present: {
        buffer: '',
        command: '',
        cursor: 0
      }
    }],
    reducer = makeReducer({INITIAL_STATE, actionHandlers: {
      commit,
      prev,
      next,
      cancel,
      backspace,
      chunk
    }}),
    storeWithMiddleware = makeStore({reducer, middleware: store => next => action => next(action)}),
    storeWithoutMiddleware = makeStore({reducer});

  let i = 0, j = 0, actualWith = [], actualWithout = [];

  storeWithMiddleware.subscribe(() => {
    actualWith.push(storeWithMiddleware.getState().toJS());
    if (i === 7) {
      assert.deepEqual(actualWith, expected, msg);
    }
    i++;
  });

  storeWithoutMiddleware.subscribe(() => {
    actualWithout.push(storeWithoutMiddleware.getState().toJS());
    if (j === 7) {
      assert.deepEqual(actualWithout, expected, msg);
    }
    j++;
  });

  actions.forEach(action => {
    storeWithMiddleware.dispatch(action);
    storeWithoutMiddleware.dispatch(action);
  });
});

