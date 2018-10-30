import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import createStoreWithInitialState from './store';
import ROOT from './components/app/root';
import { httpRequest } from '../../util/HttpRequest';

let appInitState = window.__APP_INITIAL_STATE__ || {};

//create a store with initial state.
let store = createStoreWithInitialState(appInitState);

// remove the global reference
delete window.__APP_INITIAL_STATE__;

// the below line is used for BTF rendering
window.store = store;

const renderComponents = (store) => {
	render(<Provider store={store}>
        <ROOT/>
	</Provider>, document.getElementById('page-content'));
};

function initApp(){
	renderComponents(store);
}

let onload = () => {
	setTimeout(() => {
		let { envConfig } = store.getState();
		window.deviceType = envConfig.device;
	}, 50);
};

window.addEventListener ?
window.addEventListener('load',()=>{
	onload();
},false) :
window.attachEvent && window.attachEvent('onload',()=>{
	onload();
});

//initialize the app on document ready.
initApp();
