/**
 * Created by gonzalo on 20/10/15.
 */
import {createStore, applyMiddleware} from 'redux';

export default function makeStore ({reducer, middleware = undefined}) {
  if (typeof middleware === 'function') {
    return applyMiddleware(middleware)(createStore)(reducer);
  }
  return createStore(reducer);
}
