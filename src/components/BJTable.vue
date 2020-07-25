<template>
	<div class="table">
		<div class="dealerSection">
			Dealer
			<span>{{ dealerValue }}</span>
			<div class="dealerCards">
				<img
					v-for="(card, idx) in dealerCards"
					:key="idx"
					:src="card.src"
					alt="Dealer Card"
					class="card"
				/>
			</div>
		</div>
		<div>
			{{ message }}
		</div>
		<div class="playerSection">
			<div class="playerCards">
				<img
					v-for="(card, idx) in playerCards"
					:key="idx"
					:src="card.src"
					alt="Player Card"
					class="card"
				/>
			</div>
			<span>{{ playerValue }}</span>
			Player
		</div>
		<div class="buttonSection">
			<button v-if="!isGameOver" @click="placePlayerCard">
				Hit
			</button>
			<button v-if="!isGameOver" @click="endTurn">
				Stand
			</button>
			<button v-if="isGameOver" @click="initialize">
				Start Again
			</button>
		</div>
	</div>
</template>

<script>
import { CARDS } from '@/utils/constants.js';

export default {
	computed: {
		playerValue() {
			return this.playerCards
				.map(x => x.value)
				.reduce((acc, cur) => acc + cur);
		},

		dealerValue() {
			return this.dealerCards
				.map(x => x.value)
				.reduce((acc, cur) => acc + cur);
		},

		isGameOver() {
			if (
				this.playerValue > 21 ||
				this.dealerValue > 21 ||
				this.isDecided
			) {
				return true;
			}
			return false;
		},
	},

	data() {
		return {
			shuffledCards: [],
			dealerCards: [],
			playerCards: [],
			message: '',
			isDecided: false,
		};
	},

	created() {
		this.initialize();
	},

	methods: {
		initialize() {
			this.shuffledCards = [];
			this.dealerCards = [];
			this.playerCards = [];
			this.message = 'Dealer stands on 17';
			this.isDecided = false;
			this.shuffleCards(CARDS);
			this.placePlayerCard();
			this.placePlayerCard();
			this.placeDealerCard();
			this.placeDealerCard();
		},

		shuffleCards(array) {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
			this.shuffledCards = array;
		},

		placePlayerCard() {
			this.playerCards.push(this.shuffledCards[0]);
			this.shuffledCards.shift();
		},

		placeDealerCard() {
			this.dealerCards.push(this.shuffledCards[0]);
			this.shuffledCards.shift();
		},

		endTurn() {
			if (this.dealerValue > 21) {
				this.message = 'You win!';
			} else if (this.dealerValue >= 17) {
				this.decideWinner();
			} else {
				this.placeDealerCard();
				this.endTurn();
			}
		},

		decideWinner() {
			this.isDecided = true;
			if (this.dealerValue > this.playerValue) {
				this.message = 'You lose...';
			} else if (this.dealerValue < this.playerValue) {
				this.message = 'You win!';
			} else {
				this.message = 'Its a draw';
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.table {
	height: 100%;
	position: relative;
	color: rgb(255, 255, 255);
	font-size: 16px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}

.dealerSection {
	display: flex;
	flex-direction: column;
}

.dealerCards {
	position: relative;
	display: flex;
	justify-content: center;
}

.playerSection {
	display: flex;
	flex-direction: column;
}

.playerCards {
	position: relative;
	display: flex;
	justify-content: center;
}

.card {
	position: relative;
	width: 80px;

	+ .card {
		margin-left: -60px;
	}
}

.buttonSection {
	display: flex;
	justify-content: space-evenly;

	button {
		color: #fff;
		font-size: 16px;
		font-weight: bold;
		padding: 10px 15px;
		background-color: transparent;
		outline: none;
		border: 1px solid #fff;
		border-radius: 4px;
		text-transform: uppercase;
	}
}
</style>
