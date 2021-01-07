export default {
	userId(state) {
		return state.userId;
	},
	token(state) {
		return state.token;
	},
	isAuthenticated(state) {
		return !!state.token;
	},
	expiryTime(state) {
		return state.expiryTime;
	},
	didAutoLogout(state) {
		return state.didAutoLogout;
	},
};
