import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index.js';

import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import BlackJack from '../views/BlackJack.vue';
import Credits from '../views/Credits.vue';
import Tictactoe from '../views/Tictactoe.vue';
import PigGame from '../views/PigGame.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/login',
		name: 'Login',
		component: Login,
	},
	{
		path: '/blackjack',
		name: 'BlackJack',
		component: BlackJack,
	},
	{
		path: '/piggame',
		name: 'Pig Game',
		component: PigGame,
	},
	{
		path: '/tictactoe',
		name: 'Tic-tac-toe',
		component: Tictactoe,
	},
	{
		path: '/credits',
		name: 'Credits',
		component: Credits,
	},
	{
		path: '*',
		redirect: '/',
	},
];

const router = new VueRouter({
	routes,
});

router.beforeEach((to, from, next) => {
	if (store.getters.isAuthenticated) {
		const expirationDate = new Date().getTime() + store.getters.expiryTime;
		localStorage.setItem('tokenExpiration', expirationDate);
		store.dispatch('setTimer', store.getters.expiryTime);
	}
	next();
});

export default router;
