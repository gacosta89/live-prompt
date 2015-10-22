/**
 * Created by gonzalo on 20/10/15.
 */
import reducer from './reducer/reducer';
import makeStore from './store/store';
import keypress from 'keypress';

export default function livePrompt ({stdin = process.stdin, stdout = process.stdout, middleware = undefined, prompt = 'live-prompt:$ ', bye = 'see you soon!', encoding = 'utf8'} = {}) {
  const store = makeStore({reducer, middleware}),
    getCurrent = () => {
      return store.getState().get('present').get('buffer');
    };

  stdin.setEncoding(encoding);
  stdin.setRawMode(true);
  stdin.resume();
  stdout.write(prompt);
  keypress(stdin);

  stdin.on('keypress', (ch, key) => {

    if (key && key.ctrl && key.name === 'c') {
      stdout.write('\r\n' + bye + '\r\n');
      process.exit(0);
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
  });

  store.subscribe(() => {
    stdout.clearLine();
    stdout.write('\r' + prompt + getCurrent());
  });
}
