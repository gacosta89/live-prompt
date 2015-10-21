/**
 * Created by gonzalo on 20/10/15.
 */
import {newState, undo, redo, INITIAL_STATE} from '../core/core';

export const reducer = (state = INITIAL_STATE, action = {}) => {
  const actionHandlers = {
    command: newState,
    undo,
    redo
  };

  if (!actionHandlers.hasOwnProperty(action.type)) {
    return state;
  }

  return actionHandlers[action.type](state, action);
};