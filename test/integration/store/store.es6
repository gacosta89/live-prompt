/**
 * Created by gonzalo on 20/10/15.
 */
import test from 'tape';
import makeStore from '../../../source/store/store';
import makeReducer from '../../../source/reducer/reducer';
import {commit, prev, next, cancel, backspace, chunk, INITIAL_STATE} from '../../../source/core/core';
import {List, is, fromJS} from 'immutable';

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
    expected = fromJS([{
      history: {
        commands: ['base base.json'],
        index: 1
      },
      present: {
        buffer: '',
        command: ''
      }
    },
    {
      history: {
        commands: ['base base.json', 'set broker.name=gonzalo'],
        index: 2
      },
      present: {
        buffer: '',
        command: ''
      }
    },
    {
      history: {
        commands: ['base base.json', 'set broker.name=gonzalo'],
        index: 1
      },
      present: {
        buffer: 'set broker.name=gonzalo',
        command: ''
      }
    },
    {
      history: {
        commands: ['base base.json', 'set broker.name=gonzalo'],
        index: 1
      },
      present: {
        buffer: 'set broker.name=gonzal',
        command: ''
      }
    },
    {
      history: {
        commands: ['base base.json', 'set broker.name=gonzalo'],
        index: 1
      },
      present: {
        buffer: 'set broker.name=gonzalo',
        command: ''
      }
    },
    {
      history: {
        commands: ['base base.json', 'set broker.name=gonzalo'],
        index: 2
      },
      present: {
        buffer: '',
        command: ''
      }
    },
    {
      history: {
        commands: ['base base.json', 'set broker.name=gonzalo'],
        index: 1
      },
      present: {
        buffer: 'set broker.name=gonzalo',
        command: ''
      }
    },
    {
      history: {
        commands: ['base base.json', 'set broker.name=gonzalo'],
        index: 2
      },
      present: {
        buffer: '',
        command: ''
      }
    }]),
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

  let i = 0, j = 0, actualWith = List(), actualWithout = List();

  storeWithMiddleware.subscribe(() => {
    actualWith = actualWith.push(storeWithMiddleware.getState());
    if (i === 7) {
      assert.equal(is(actualWith, expected), true, msg);
    }
    i++;
  });

  storeWithoutMiddleware.subscribe(() => {
    actualWithout = actualWithout.push(storeWithoutMiddleware.getState());
    if (j === 7) {
      assert.equal(is(actualWithout, expected), true, msg);
    }
    j++;
  });

  actions.forEach(action => {
    storeWithMiddleware.dispatch(action);
    storeWithoutMiddleware.dispatch(action);
  });
});

