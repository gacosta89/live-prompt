/**
 * Created by gonzalo on 20/10/15.
 */
import reducer from './reducer/reducer';
import makeStore from './store/store';
import keypress from 'keypress';

export default function livePrompt ({stdin = process.stdin, stdout = process.stdout, middleware = undefined, prompt = 'live-prompt:$ ', bye = 'see you soon!', encoding = 'utf8'} = {}) {
  const store = makeStore({reducer, middleware}),
    getCurrent = () => {
      return store.getState().get('history').get(store.getState().get('current'));
    };

  stdin.setEncoding(encoding);
  stdin.setRawMode(true);
  stdin.resume();
  stdout.write(prompt);
  keypress(stdin);

  let buffer = '';

  stdin.on('keypress', (ch, key) => {

    if (key && key.ctrl && key.name === 'c') {
      stdout.write('\r\n' + bye + '\r\n');
      process.exit(0);
    }

    if (key) {
      switch (key.name) {
        case 'up':
          store.dispatch({
            type: 'undo'
          });
          return;
        case 'down':
          store.dispatch({
            type: 'redo'
          });
          return;
        case 'escape':
          store.dispatch({
            type: 'cancel'
          });
          return;
        case 'return':
          stdout.write('\r\n');
          if (buffer.length !== 0) {
            store.dispatch({
              type: 'command',
              data: buffer
            });
            buffer = '';
          }
          return;
        case 'backspace':
          if (buffer.length > 0) {
            buffer = buffer.slice(0, -1);
            stdout.clearLine();
            stdout.write('\r' + prompt + buffer);
          }
          return;
        default:
      }
    }

    buffer += ch;
    stdout.write(ch);
  });

  store.subscribe(() => {
    buffer = getCurrent();
    stdout.clearLine();
    stdout.write('\r' + prompt + buffer);
  });
}
