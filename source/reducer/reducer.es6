/**
 * Created by gonzalo on 20/10/15.
 */
import {commit, prev, next, cancel, backspace, chunk, INITIAL_STATE} from '../core/core';

export default function reducer (state = INITIAL_STATE, action = {}) {
  const actionHandlers = {
    commit,
    prev,
    next,
    cancel,
    backspace,
    chunk
  };

  if (!actionHandlers.hasOwnProperty(action.type)) {
    return state;
  }

  return actionHandlers[action.type](state, action);
}
