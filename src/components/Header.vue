<template>
	<header class="header">
		<div class="headerInner">
			<div class="headerButtons">
				<router-link v-if="$route.path !== '/'" to="/">
					<IosHomeIcon />
				</router-link>
				<router-link
					v-if="
						$route.path !== '/login' &&
							!$store.getters.isAuthenticated
					"
					to="/login"
				>
					<IosLogInIcon />
				</router-link>
				<router-link
					v-if="
						$route.path !== '/login' &&
							$store.getters.isAuthenticated
					"
					to="/credits"
					@click.native="$store.dispatch('logout')"
				>
					<IosLogOutIcon />
				</router-link>
			</div>
			<div class="title">Games</div>
			<Nav />
		</div>
	</header>
</template>

<script>
import Nav from '@/components/Nav.vue';
import IosHomeIcon from 'vue-ionicons/dist/ios-home.vue';
import IosLogInIcon from 'vue-ionicons/dist/ios-log-in.vue';
import IosLogOutIcon from 'vue-ionicons/dist/ios-log-out.vue';

export default {
	components: { Nav, IosHomeIcon, IosLogInIcon, IosLogOutIcon },
};
</script>

<style lang="scss" scoped>
.header {
	position: relative;
	height: 50px;
	z-index: 100;
}

.headerInner {
	position: fixed;
	width: 100%;
	background-color: #fff;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
	display: flex;
	justify-content: center;
}

.title {
	font-size: 18px;
	font-weight: bold;
	line-height: 50px;
}

.headerButtons {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;

	a {
		width: 50px;
		height: 50px;
		font-size: 24px;
		color: #2c3e50;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>
