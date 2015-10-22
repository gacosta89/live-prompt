/**
 * Created by gonzalo on 20/10/15.
 */
import {createStore, applyMiddleware} from 'redux';

export default function makeStore ({middleware = undefined, reducer = undefined}) {
  if (typeof middleware !== 'undefined') {
    return applyMiddleware(middleware)(createStore)(reducer);
  }
  return createStore(reducer);
}