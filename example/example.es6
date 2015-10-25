/**
 * Created by gonzalo on 24/10/15.
 */
import livePrompt from 'live-prompt';
import fs from 'fs';

const commands = fs.createWriteStream('./commands.txt'),
  middleware = store => next => action => {
    if (action.type === 'commit') {
      commands.write(action.data);
    }
    return next(action);
  },
  prompt = livePrompt({middleware});

prompt.start();

setInterval(() => {
  prompt.log('[date]: ' + new Date());
}, 60000);
