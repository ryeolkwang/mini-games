import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import BlackJack from '../views/BlackJack.vue';
import Credits from '../views/Credits.vue';

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
		path: '/credits',
		name: 'Credits',
		component: Credits,
	},
];

const router = new VueRouter({
	routes,
});

export default router;
