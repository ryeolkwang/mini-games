<template>
	<div class="table">
		<div class="statistics">
			<span>Bank: ${{ bankAmount }}</span>
			<span>Bet: ${{ betAmount }}</span>
			<span>Win rate: {{ winRate }}</span>
		</div>
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
		<div class="message">
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
			<button v-if="!isGameOver && !isDecided" @click="placePlayerCard">
				Hit
			</button>
			<button v-if="!isGameOver && !isDecided" @click="endTurn">
				Stand
			</button>
			<span v-if="isDecided || isGameOver">${{ betAmount }}</span>
			<button
				v-if="isDecided || isGameOver"
				:disabled="betAmount === 0 && bankAmount !== 0"
				:class="{ ExDisabled: betAmount === 0 && bankAmount !== 0 }"
				@click="
					bankAmount === 0 && betAmount === 0
						? $emit('end-game')
						: playBJ()
				"
			>
				{{ playButton }}
			</button>
		</div>
		<div v-if="isDecided || isGameOver" class="betSection">
			<button
				v-for="(bet, idx) in betUnits"
				:key="idx"
				@click="addBet(bet.value)"
			>
				{{ bet.amount }}
			</button>
			<button @click="resetBet">
				Reset
			</button>
		</div>
	</div>
</template>

<script>
import { CARDS } from '@/utils/constants.js';

export default {
	computed: {
		winRate() {
			if (this.numGames === undefined || this.numGames === 0) {
				return 'N/A';
			}
			return Math.round((this.numWins / this.numGames) * 100) / 100;
		},

		playButton() {
			if (this.bankAmount === 0 && this.betAmount === 0) {
				return 'bankrupt';
			} else if (this.numGames === undefined || this.numGames === 0) {
				return 'play';
			}
			return 'play again';
		},

		betUnits: () => [
			{ amount: '$10', value: 10 },
			{ amount: '$20', value: 20 },
			{ amount: '$50', value: 50 },
			{ amount: '$100', value: 100 },
		],

		playerValue() {
			if (
				this.playerCards === undefined ||
				this.playerCards.length === 0
			) {
				return 0;
			}
			return this.playerCards
				.map(x => x.value)
				.reduce((acc, cur) => acc + cur);
		},

		dealerValue() {
			if (
				this.dealerCards === undefined ||
				this.dealerCards.length === 0
			) {
				return 0;
			}
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
			isDecided: true,
			betAmount: 0,
			bankAmount: 1000,
			numGames: 0,
			numWins: 0,
		};
	},

	created() {
		this.message = 'Place your bets';
	},

	methods: {
		addBet(bet) {
			this.betAmount += bet;
		},

		resetBet() {
			this.betAmount = 0;
		},

		playBJ() {
			this.isDecided = false;
			this.bankAmount -= this.betAmount;
			this.shuffledCards = JSON.parse(JSON.stringify(CARDS));
			this.dealerCards = [];
			this.playerCards = [];
			this.message = 'Dealer stands on 17 \n Blackjack pays 2 to 1';
			this.isDecided = false;
			this.numGames++;
			this.shuffleCards(this.shuffledCards);
			this.placePlayerCard();
			this.placePlayerCard();
			this.placeDealerCard();
			this.placeDealerCard();
			this.isBlackJack();
		},

		shuffleCards(array) {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
		},

		placePlayerCard() {
			this.playerCards.push(this.shuffledCards[0]);
			this.shuffledCards.shift();
			if (
				this.playerValue > 21 &&
				this.playerCards.map(x => x.value).lastIndexOf(11) !== -1
			) {
				this.playerCards.filter(x => x.value === 11)[
					this.playerCards.filter(x => x.value === 11).length - 1
				].value = 1;
			} else if (this.playerValue === 21) {
				this.endTurn();
			}
		},

		placeDealerCard() {
			this.dealerCards.push(this.shuffledCards[0]);
			this.shuffledCards.shift();
			if (
				this.dealerValue > 21 &&
				this.dealerCards.map(x => x.value).lastIndexOf(11) !== -1
			) {
				this.dealerCards.filter(x => x.value === 11)[
					this.dealerCards.filter(x => x.value === 11).length - 1
				].value = 1;
			}
		},

		isBlackJack() {
			if (this.playerValue !== 21) {
				return;
			}
			this.message = 'Blackjack! Player wins';
			this.bankAmount += 3 * this.betAmount;
			this.isDecided = true;
		},

		endTurn() {
			if (this.dealerValue > 21) {
				this.message = 'Player wins!';
				this.isDecided = true;
				this.numWins++;
				this.bankAmount += 2 * this.betAmount;
				this.resetBet();
			} else if (this.dealerValue >= 17) {
				this.decideWinner();
				this.resetBet();
			} else {
				this.placeDealerCard();
				this.endTurn();
			}
		},

		decideWinner() {
			if (this.dealerValue > this.playerValue) {
				this.message = 'Dealer wins';
			} else if (this.dealerValue < this.playerValue) {
				this.message = 'Player wins!';
				this.numWins++;
				this.bankAmount += 2 * this.betAmount;
			} else {
				this.message = 'Draw';
				this.bankAmount += this.betAmount;
			}
			this.isDecided = true;
		},
	},
};
</script>

<style lang="scss" scoped>
.table {
	height: 100%;
	color: rgb(255, 255, 255);
	font-size: 16px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}

.statistics {
	position: absolute;
	top: 10px;
	left: 0;
	width: 100%;
	display: flex;
	justify-content: space-around;
}

.dealerSection {
	display: flex;
	flex-direction: column;
}

.dealerCards {
	margin-top: 10px;
	padding: 10px;
	height: 140px;
	border: 1px solid #fff;
	border-radius: 10px;
	display: flex;
	justify-content: center;
}

.playerSection {
	display: flex;
	flex-direction: column;
}

.playerCards {
	margin-bottom: 10px;
	padding: 10px;
	height: 140px;
	border: 1px solid #fff;
	border-radius: 10px;
	display: flex;
	justify-content: center;
}

.card {
	position: relative;
	height: 120px;

	+ .card {
		margin-left: -60px;
	}
}

.message {
	font-size: 16px;
	text-transform: uppercase;
}

.buttonSection {
	display: flex;
	justify-content: space-evenly;
	align-items: center;

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
		display: flex;
		justify-content: center;
		align-items: center;

		&.ExDisabled {
			font-weight: normal;
			color: #777;
			border-color: #777;
			background-color: rgb(0, 73, 6);
		}
	}
}

.betSection {
	display: flex;
	justify-content: space-evenly;

	button {
		color: #fff;
		font-size: 14px;
		padding: 4px 6px;
		background-color: transparent;
		outline: none;
		border: 1px solid #fff;
		border-radius: 3px;
		text-transform: uppercase;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>
