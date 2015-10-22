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
    command: ''
  }
});

export const commit = (state, {data: command}) => {
  return state.merge({
    history: {
      commands: state.get('history').get('commands').push(command),
      index: state.get('history').get('commands').size + 2
    },
    present: {
      buffer: '',
      command: ''
    }
  });
};

export const prev = (state) => {
  const index = state.get('history').get('index'),
    count = state.get('history').get('commands').size;

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
        buffer: state.get('history').get('commands').get(index - 1),
        command: state.get('present').get('buffer')
      }
    });
  }

  return state.merge({
    history: {
      commands: state.get('history').get('commands'),
      index: index - 1
    },
    present: {
      buffer: state.get('history').get('commands').get(index - 1),
      command: ''
    }
  });
};

export const next = (state) => {
  const index = state.get('history').get('index'),
    count = state.get('history').get('commands').size;

  if (index >= count) {
    return state;
  }

  if (index === count) {
    return state;
  }

  if (index === count - 1) {
    return state.merge({
      history: {
        commands: state.get('history').get('commands'),
        index: index + 1
      },
      present: {
        buffer: state.get('present').get('command'),
        command: ''
      }
    });
  }

  return state.merge({
    history: {
      commands: state.get('history').get('commands'),
      index: index + 1
    },
    present: {
      buffer: state.get('history').get('commands').get(index + 1)
    }
  });
};

export const cancel = (state) => {
  const index = state.get('history').get('index'),
    commands = state.get('history').get('commands'),
    count = commands.size,
    command = commands.get(index);

  if (index > count) {
    return state;
  }

  if (index === count) {
    return state;
  }

  if (index < count) {
    if (state.get('present').get('buffer') !== command) {
      return state.merge({
        present: {
          buffer: command,
          command: state.get('present').get('command')
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
        command: ''
      }
    });
  }
};

export const backspace = (state) => {
  return state.merge({
    present: {
      buffer: state.get('present').get('buffer').slice(0, -1),
      command: state.get('present').get('command')
    }
  });
};

export const chunk = (state, {data: ch} = {}) => {
  return state.merge({
    present: {
      buffer: state.get('present').get('buffer') + ch,
      command: state.get('present').get('command')
    }
  });
};
