/**
 * Created by gonzalo on 20/10/15.
 */
import {Map} from 'immutable';

export const INITIAL_STATE = Map({
    history: [],
    count: 0,
    current: 0
  });

export const newState = (state, {data: command}) => {
    return state.merge({
      history: state.get('history').push(command),
      count: state.get('count') + 1,
      current: state.get('count')
    });
  };

export const undo = (state, action = {}) => {
    const current = state.get('current');
    return state.merge({
      current: current > 0 ? current - 1 : 0
    });
  };

export const redo = (state, action = {}) => {
    const count = state.get('count'),
      current = state.get('current');
    return state.merge({
      current: current < count - 1 ? current + 1 : current
    });
  };