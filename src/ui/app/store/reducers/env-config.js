const initialState = {

};
export default function(state = initialState, action) {
	let { type } = action;
	if(type) {
		return state;
	}
}
