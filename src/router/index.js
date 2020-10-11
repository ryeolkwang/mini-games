import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
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
];

const router = new VueRouter({
	routes,
});

export default router;
