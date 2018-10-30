import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import appReducers from './reducers/';

const createStoreWithInitialState = (initState) => {
	return createStore(appReducers, initState, applyMiddleware(thunk));
};

export default createStoreWithInitialState;
