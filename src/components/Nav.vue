<template>
	<nav>
		<div
			class="nav"
			:class="{ close: showMenu }"
			@click="showMenu = !showMenu"
		></div>
		<ul v-show="showMenu" class="menu">
			<router-link to="/" @click="closeMenu">
				Home
			</router-link>
			<router-link to="/blackjack" @click="closeMenu">
				BlackJack
			</router-link>
			<router-link to="/credits" @click="closeMenu">
				Credits
			</router-link>
		</ul>
		<div v-show="showMenu" class="overlay"></div>
	</nav>
</template>

<script>
export default {
	data() {
		return {
			showMenu: false,
		};
	},

	methods: {
		closeMenu() {
			this.showMenu = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.nav {
	position: absolute;
	right: 0;
	width: 50px;
	height: 50px;

	&::before {
		content: '';
		position: absolute;
		top: 20px;
		right: 12px;
		height: 3px;
		width: 26px;
		background-color: #000;
	}

	&::after {
		content: '';
		position: absolute;
		top: 28px;
		right: 12px;
		height: 3px;
		width: 26px;
		background-color: #000;
	}

	&.close {
		&::before {
			z-index: 15;
			transform-origin: 10px 4px;
			transform: rotate(45deg);
			background-color: red;
		}

		&::after {
			z-index: 15;
			transform-origin: 7px -2px;
			transform: rotate(-45deg);
			background-color: red;
		}
	}
}

.menu {
	position: absolute;
	z-index: 10;
	top: 0;
	right: 0;
	width: 270px;
	height: 100vh;
	padding: 50px 20px;
	background-color: rgb(0, 0, 0, 0.9);

	a {
		display: block;
		margin-bottom: 20px;
		padding: 10px;
		font-weight: bold;
		color: #fff;
		text-decoration: none;

		&.router-link-exact-active {
			color: #080808;
			background-color: #fff;
			border-radius: 100px;
		}
	}
}

.overlay {
	position: fixed;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.5);
}
</style>
