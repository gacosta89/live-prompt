/**
 * Created by gonzalo on 20/10/15.
 */
import {Map} from 'immutable';

/**
 * @param actionHandlers
 * @param INITIAL_STATE
 * @returns {Function} reducer
 */
export default function makeReducer ({actionHandlers = {}, INITIAL_STATE = Map()} = {}) {
  const reducer = (state = INITIAL_STATE, action = {type: '@@noaction'}) => {

    if (!actionHandlers.hasOwnProperty(action.type)) {
      return state;
    }

    return actionHandlers[action.type](state, action);
  };

  return reducer;
}
