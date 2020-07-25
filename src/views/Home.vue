<template>
	<div class="home">
		<h1 class="title">Welcome to the Mini-Games Project</h1>
		<h3 class="subtitle">List of Games</h3>
		<ul class="gameList">
			<router-link
				v-for="(game, idx) in GAMES"
				:key="idx"
				:to="game.page"
				class="game"
				tag="li"
			>
				<img :src="game.src" alt="" class="gameImage" />
				<span class="gameTitle">{{ game.name }}</span>
			</router-link>
		</ul>
	</div>
</template>

<script>
export default {
	computed: {
		GAMES: () => [
			{
				name: 'BlackJack',
				src: require('../assets/blackjack.png'),
				page: '/blackjack',
			},
			{
				name: 'Pig Game',
				src: require('../assets/dice.png'),
				page: '/blackjack',
			},
			{
				name: 'others',
				src: require('../assets/other.png'),
				page: '/blackjack',
			},
		],
	},
};
</script>

<style lang="scss" scoped>
.title {
	margin-bottom: 20px;
	padding: 20px;
	font-size: 30px;
	font-weight: bold;
}

.subtitle {
	margin-bottom: 10px;
	font-size: 18px;
	font-weight: bold;
}

.gameList {
	position: relative;
	margin-bottom: 30px;
	padding-bottom: 20px;
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	overflow-y: hidden;
	-webkit-overflow-scrolling: touch;
	font-size: 20px;

	&::before {
		content: '⊲';
		position: fixed;
		left: 15px;
	}

	&::after {
		content: '⊳';
		position: fixed;
		right: 15px;
	}
}

.game {
	flex: 0 0 100%;
}

.gameImage {
	padding: 50px;
	width: 100%;
	height: 200px;
	object-fit: contain;
}

.gameTitle {
	font-size: 16px;
	padding: 10px;
	border: 1px solid rgba(0, 0, 0, 0.5);
	border-radius: 50px;
}
</style>
