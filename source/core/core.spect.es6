/**
 * Created by gonzalo on 20/10/15.
 */
import test from 'tape';
import {fromJS} from 'immutable';
import {commit, prev, next, cancel, backspace, chunk} from './core';

test('commit', assert => {
  const msg = 'should commit the current buffer.',
    state = fromJS({
      history: {
        commands: ['base base.json', 'set broker.id=225'],
        index: 0
      },
      present: {
        buffer: 'set broker.name=gonzalo',
        command: 'sth'
      }
    }),
    action = {
      type: 'COMMAND',
      data: 'set broker.name=gonzalo'
    },
    expected = {
      history: {
        commands: ['base base.json', 'set broker.id=225', 'set broker.name=gonzalo'],
        index: 3
      },
      present: {
        buffer: '',
        command: ''
      }
    },
    actual = commit(state, action).toJS();

  assert.deepEqual(actual, expected, msg);
  assert.end();
});

test('prev', nest => {
  nest.test('... with past', assert => {
    const msg = 'should show the prev command.',
      state = fromJS({
        history: {
        commands: ['base base.json', 'set broker.id=225'],
        index: 2
      },
        present: {
          buffer: 'set broker.name=gonzalo',
          command: ''
        }
      }),
      expected = {
        history: {
          commands: ['base base.json', 'set broker.id=225'],
          index: 1
        },
        present: {
          buffer: 'set broker.id=225',
          command: 'set broker.name=gonzalo'
        }
      },
      actual = prev(state).toJS();

    assert.deepEqual(actual, expected, msg);
    assert.end();
  });

  nest.test('... without past.', assert => {
    const msg = 'should show the last command.',
      state = fromJS({
        history: {
          commands: ['base base.json', 'set broker.id=225'],
          index: 0
        },
        present: {
          buffer: 'base base.js and something else',
          command: 'set broker.name=gonzalo'
        }
      }),
      expected = {
        history: {
          commands: ['base base.json', 'set broker.id=225'],
          index: 0
        },
        present: {
          buffer: 'base base.js and something else',
          command: 'set broker.name=gonzalo'
        }
      },
      actual = prev(state).toJS();

    assert.deepEqual(actual, expected, msg);
    assert.end();
  });

});

test('next', nest => {
  nest.test('... with future', assert => {
    const msg = 'should show the next command.',
      state = fromJS({
        history: {
          commands: ['base base.json', 'set broker.id=225'],
          index: 1
        },
        present: {
          buffer: 'set broker.id a little bit edited',
          command: 'set broker.name=gonzalo'
        }
      }),
      expected = {
        history: {
          commands: ['base base.json', 'set broker.id=225'],
          index: 2
        },
        present: {
          buffer: 'set broker.name=gonzalo',
          command: ''
        }
      },
      actual = next(state).toJS();

    assert.deepEqual(actual, expected, msg);
    assert.end();
  });

  nest.test('... without future.', assert => {
    const msg = 'should show the last command.',
      state = fromJS({
        history: {
          commands: ['base base.json', 'set broker.id=225'],
          index: 2
        },
        present: {
          buffer: 'set broker.name=gonzalo',
          command: ''
        }
      }),
      expected = {
        history: {
          commands: ['base base.json', 'set broker.id=225'],
          index: 2
        },
        present: {
          buffer: 'set broker.name=gonzalo',
          command: ''
        }
      },
      actual = next(state).toJS();

    assert.deepEqual(actual, expected, msg);
    assert.end();
  });
});

test('cancel', nest => {
  nest.test('...first time', assert => {
    const msg = 'should cancel edit mode.',
      state = fromJS({
        history: {
          commands: ['base base.json', 'set broker.id=225'],
          index: 0
        },
        present: {
          buffer: 'base base.json a little bit edited',
          command: 'set broker.name=gonzalo'
        }
      }),
      expected = {
        history: {
          commands: ['base base.json', 'set broker.id=225'],
          index: 0
        },
        present: {
          buffer: 'base base.json',
          command: 'set broker.name=gonzalo'
        }
      },
      actual = cancel(state).toJS();

    assert.deepEqual(actual, expected, msg);
    assert.end();
  });
  nest.test('...second time', assert => {
    const msg = 'should cancel history search.',
      state = fromJS({
        history: {
          commands: ['base base.json', 'set broker.id=225'],
          index: 0
        },
        present: {
          buffer: 'base base.json',
          command: 'set broker.name=gonzalo'
        }
      }),
      expected = {
        history: {
          commands: ['base base.json', 'set broker.id=225'],
          index: 2
        },
        present: {
          buffer: 'set broker.name=gonzalo',
          command: ''
        }
      },
      actual = cancel(state).toJS();

    assert.deepEqual(actual, expected, msg);
    assert.end();
  });
});

test('backspace', assert => {
  const msg = 'should erase last character.',
    state = fromJS({
      history: {
        commands: ['base base.json', 'set broker.id=225'],
        index: 1
      },
      present: {
        buffer: 'set broker.id=225',
        command: 'set broker.name=gonzalo'
      }
    }),
    expected = {
      history: {
        commands: ['base base.json', 'set broker.id=225'],
        index: 1
      },
      present: {
        buffer: 'set broker.id=22',
        command: 'set broker.name=gonzalo'
      }
    },
    actual = backspace(state).toJS();

  assert.deepEqual(actual, expected, msg);
  assert.end();
});

test('chunk', assert => {
  const msg = 'should concat the chunk to the buffer.',
    state = fromJS({
      history: {
        commands: ['base base.json', 'set broker.id=225'],
        index: 1
      },
      present: {
        buffer: 'set broker.id=22',
        command: 'set broker.name=gonzalo'
      }
    }),
    action = {
      type: 'chunk',
      data: '5'
    },
    expected = {
      history: {
        commands: ['base base.json', 'set broker.id=225'],
        index: 1
      },
      present: {
        buffer: 'set broker.id=225',
        command: 'set broker.name=gonzalo'
      }
    },
    actual = chunk(state, action).toJS();

  assert.deepEqual(actual, expected, msg);
  assert.end();
});
