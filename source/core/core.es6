/**
 * Created by gonzalo on 20/10/15.
 */
import {fromJS} from 'immutable';

export const INITIAL_STATE = fromJS({
  history: {
    commands: [],
    index: 0
  },
  present: {
    buffer: '',
    command: '',
    cursor: 0
  }
});

export const commit = (state, {data: command}) => {
  return state.merge({
    history: {
      commands: state.get('history').get('commands').push(command),
      index: state.get('history').get('commands').size + 1
    },
    present: {
      buffer: '',
      command: '',
      cursor: 0
    }
  });
};

export const prev = (state) => {
  const index = state.get('history').get('index'),
    count = state.get('history').get('commands').size,
    buffer = state.get('history').get('commands').get(index - 1);

  if (index <= 0) {
    return state;
  }

  if (index === count) {
    return state.merge({
      history: {
        commands: state.get('history').get('commands'),
        index: index - 1
      },
      present: {
        buffer,
        command: state.get('present').get('buffer'),
        cursor: buffer.length
      }
    });
  }

  return state.merge({
    history: {
      commands: state.get('history').get('commands'),
      index: index - 1
    },
    present: {
      buffer,
      command: state.get('present').get('command'),
      cursor: buffer.length
    }
  });
};

export const next = (state) => {
  const index = state.get('history').get('index'),
    count = state.get('history').get('commands').size,
    command = state.get('present').get('command');

  if (index >= count) {
    return state;
  }

  if (index === count - 1) {
    return state.merge({
      history: {
        commands: state.get('history').get('commands'),
        index: index + 1
      },
      present: {
        buffer: command,
        command: '',
        cursor: command.length
      }
    });
  }

  return state.merge({
    history: {
      commands: state.get('history').get('commands'),
      index: index + 1
    },
    present: {
      buffer: state.get('history').get('commands').get(index + 1),
      command: state.get('present').get('command'),
      cursor: state.get('history').get('commands').get(index + 1).length
    }
  });
};

export const cancel = (state) => {
  const index = state.get('history').get('index'),
    commands = state.get('history').get('commands'),
    count = commands.size,
    command = commands.get(index);

  if (index >= count || index < 0) {
    return state;
  }

  if (state.get('present').get('buffer') !== command) {
    return state.merge({
      present: {
        buffer: command,
        command: state.get('present').get('command'),
        cursor: command.length
      }
    });
  }

  return state.merge({
    history: {
      commands,
      index: count
    },
    present: {
      buffer: state.get('present').get('command'),
      command: '',
      cursor: state.get('present').get('command').length
    }
  });
};

export const backspace = (state) => {
  const cursor = state.get('present').get('cursor');

  if (cursor === 0) {
    return state;
  }

  return state.merge({
    present: {
      buffer: state.get('present').get('buffer').slice(0, cursor - 1) + state.get('present').get('buffer').slice(cursor),
      command: state.get('present').get('command'),
      cursor: state.get('present').get('cursor') - 1
    }
  });
};

export const chunk = (state, {data: ch}) => {
  const cursor = state.get('present').get('cursor');
  return state.merge({
    present: {
      buffer: state.get('present').get('buffer').slice(0, cursor) + ch + state.get('present').get('buffer').slice(cursor),
      command: state.get('present').get('command'),
      cursor: state.get('present').get('cursor') + 1
    }
  });
};

export const right = (state) => {
  return state.updateIn(['present', 'cursor'], value => value < state.get('present').get('buffer').length ? value + 1 : value);
};

export const left = (state) => {
  return state.updateIn(['present', 'cursor'], value => value > 0 ? value - 1 : 0);
};
