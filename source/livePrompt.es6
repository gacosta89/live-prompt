/**
 * Created by gonzalo on 20/10/15.
 */
import makeReducer from './reducer/reducer';
import makeStore from './store/store';
import {commit, next, prev, cancel, backspace, chunk, INITIAL_STATE} from './core/core';
import keypress from 'keypress';

export default function livePrompt ({
        stdin = process.stdin,
        stdout = process.stdout,
        middleware = undefined,
        prompt = 'live-prompt:$ ',
        bye = 'see you soon!',
        onCtrlC = undefined,
        encoding = 'utf8'} = {}) {

  const reducer = makeReducer({INITIAL_STATE, actionHandlers: {
    commit,
    next,
    prev,
    cancel,
    backspace,
    chunk
  }}),
    store = makeStore({reducer, middleware}),
    getCurrent = () => {
      return store.getState().get('present').get('buffer');
    },
    onExit = typeof onCtrlC === 'function' ? onCtrlC : () => {
      stdout.write('\r\n' + bye + '\r\n');
      process.exit(0);
    },
    onKeyPress = (ch, key) => {

      if (key && key.ctrl && key.name === 'c') {
        onExit();
      }

      if (key) {
        switch (key.name) {
          case 'up':
            store.dispatch({
              type: 'prev'
            });
            return;
          case 'down':
            store.dispatch({
              type: 'next'
            });
            return;
          case 'escape':
            store.dispatch({
              type: 'cancel'
            });
            return;
          case 'return':
            stdout.write('\r\n');
            store.dispatch({
              type: 'commit',
              data: getCurrent()
            });
            return;
          case 'backspace':
            store.dispatch({
              type: 'backspace'
            });
            return;
          default:
        }
      }

      store.dispatch({
        type: 'chunk',
        data: ch
      });
    };

  store.subscribe(() => {
    stdout.clearLine();
    stdout.write('\r' + prompt + getCurrent());
  });

  return {
    start () {
      keypress(stdin);
      stdin.setEncoding(encoding);
      stdin.setRawMode(true);
      stdin.resume();
      stdout.write(prompt);
      stdin.on('keypress', onKeyPress);
    },
    stop () {
      stdin.removeListener('keypress', onKeyPress);
    },
    log (txt) {
      stdout.write('\r\n' + txt);
      stdout.write('\r\n' + prompt + getCurrent());
    }
  };
}
