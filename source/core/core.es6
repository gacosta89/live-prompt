/**
 * Created by gonzalo on 20/10/15.
 */
import {fromJS} from 'immutable';

export const INITIAL_STATE = fromJS({
    history: [''],
    count: 1,
    current: 0
  });

export const newState = (state, {data: command}) => {
    return state.merge({
      history: state.get('history').pop().push(command).push(''),
      count: state.get('count') + 1,
      current: state.get('count')
    });
  };

export const undo = (state) => {
    const current = state.get('current');
    return state.merge({
      current: current > 0 ? current - 1 : 0
    });
  };

export const redo = (state) => {
    const count = state.get('count'),
      current = state.get('current');
    return state.merge({
      current: current < count - 1 ? current + 1 : current
    });
  };

export const cancel = (state) => {
  return state.merge({
      current: state.get('count') - 1
    });
  };
