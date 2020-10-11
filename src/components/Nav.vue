<template>
	<nav>
		<div
			class="nav"
			:class="{ close: showMenu }"
			@click="showMenu = !showMenu"
		></div>
		<ul v-show="showMenu" class="menu">
			<router-link to="/" @click.native="closeMenu">
				Home
			</router-link>
			<router-link to="/blackjack" @click.native="closeMenu">
				BlackJack
			</router-link>
			<router-link to="/piggame" @click.native="closeMenu">
				Pig Game
			</router-link>
			<router-link to="/tictactoe" @click.native="closeMenu">
				Tic-tac-toe
			</router-link>
			<router-link to="/credits" @click.native="closeMenu">
				Credits
			</router-link>
		</ul>
		<div
			v-show="showMenu"
			class="overlay"
			@click="showMenu = !showMenu"
		></div>
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
		border-radius: 100px;
	}

	&::after {
		content: '';
		position: absolute;
		top: 28px;
		right: 12px;
		height: 3px;
		width: 26px;
		background-color: #000;
		border-radius: 100px;
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
	background-color: #fff;

	a {
		display: block;
		margin-bottom: 20px;
		padding: 10px;
		color: #080808;
		text-decoration: none;

		&.router-link-exact-active {
			font-weight: bold;
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
