<template>
	<div class="table">
		<div class="statistics">
			<span>Bank: ${{ bankAmount }}</span>
			<span>Bet: ${{ betAmount }}</span>
			<span>Win rate: {{ winRate }}</span>
		</div>
		<div v-if="isJokerOut" class="joker">
			<img :src="JOKER.src" alt="Joker Card" class="jokerCard" />
			Deck will be shuffled next round
		</div>
		<div class="notes">
			Currently playing with 4 decks
		</div>
		<div class="dealerSection">
			Dealer
			<span>{{
				dealerCards.length === 2 && !isDecided
					? dealerCards[0].value
					: dealerValue
			}}</span>
			<div class="dealerCards">
				<img
					v-for="(card, idx) in dealerCards"
					:key="idx"
					:src="card.src"
					:alt="
						hiddenDealerCard && idx === 1
							? 'Hidden Dealer Card'
							: 'Dealer Card'
					"
					class="card"
					:class="{ ExHide: hiddenDealerCard && idx === 1 }"
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
			<button
				v-if="!isGameOver && !isDecided && playerCards.length === 2"
				@click="double"
			>
				Double
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
			<button v-if="betAmount > 0" @click="resetBet">
				Reset
			</button>
			<button v-if="betAmount === 0" @click="reBet">
				Re-bet
			</button>
		</div>
	</div>
</template>

<script>
import { CARDS, JOKER } from '@/utils/constants.js';

export default {
	computed: {
		JOKER: () => JOKER,

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
			previousBetAmount: 0,
			bankAmount: 1000,
			numGames: 0,
			numWins: 0,
			isJokerOut: false,
			hiddenDealerCard: '',
		};
	},

	created() {
		this.message = 'Place your bets';
		this.shuffleDeck();
	},

	methods: {
		addBet(bet) {
			this.betAmount += bet;
		},

		resetBet() {
			this.previousBetAmount = this.betAmount;
			this.betAmount = 0;
		},

		reBet() {
			this.betAmount = this.previousBetAmount;
		},

		playBJ() {
			this.shuffledCards
				.filter(card => card.value === 1)
				.map(card => (card.value = 11));
			if (this.isJokerOut) {
				this.shuffleDeck();
				this.isJokerOut = false;
			}
			this.isDecided = false;
			this.hiddenDealerCard = '';
			this.bankAmount -= this.betAmount;
			this.dealerCards = [];
			this.playerCards = [];
			this.message = 'Dealer stands on 17 \n Blackjack pays 3 to 2';
			this.numGames++;
			this.placePlayerCard();
			this.placePlayerCard();
			if (this.playerValue === 21 && this.playerCards.length === 2) {
				return;
			}
			this.placeDealerCard();
			this.placeDealerCard();
		},

		shuffleDeck() {
			this.shuffledCards = new Array(4) //Number of Decks
				.fill(JSON.parse(JSON.stringify(CARDS)))
				.flat();
			this.shuffledCards.push(JOKER);
			for (let i = this.shuffledCards.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[this.shuffledCards[i], this.shuffledCards[j]] = [
					this.shuffledCards[j],
					this.shuffledCards[i],
				];
			}
		},

		placePlayerCard() {
			if (this.shuffledCards[0].name === 'Joker') {
				this.isJokerOut = true;
				this.message = 'Deck will be shuffled next round';
				this.shuffledCards.shift();
				this.placePlayerCard();
				return;
			}
			this.playerCards.push(this.shuffledCards[0]);
			this.shuffledCards.shift();
			if (
				this.playerValue > 21 &&
				this.playerCards.map(x => x.value).lastIndexOf(11) !== -1
			) {
				this.playerCards.filter(x => x.value === 11)[
					this.playerCards.filter(x => x.value === 11).length - 1
				].value = 1;
			} else if (this.playerValue > 21) {
				this.decideWinner();
			} else if (this.playerValue === 21) {
				this.endTurn();
			}
		},

		placeDealerCard() {
			if (this.shuffledCards[0].name === 'Joker') {
				this.isJokerOut = true;
				this.message = 'Deck will be shuffled next round';
				this.shuffledCards.shift();
				this.placeDealerCard();
				return;
			}
			this.dealerCards.push(this.shuffledCards[0]);
			if (this.dealerCards.length === 2) {
				this.hiddenDealerCard = this.dealerCards[1].src;
				this.dealerCards[1].src = '';
			}
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

		double() {
			this.bankAmount -= this.betAmount;
			this.betAmount *= 2;
			this.placePlayerCard();
			if (this.playerValue > 21) {
				this.decideWinner();
			} else {
				this.endTurn();
			}
		},

		endTurn() {
			if (this.dealerCards[1]) {
				this.dealerCards[1].src = this.hiddenDealerCard;
			}
			if (this.dealerValue >= 17) {
				this.decideWinner();
			} else {
				this.placeDealerCard();
				this.endTurn();
			}
		},

		decideWinner() {
			this.dealerCards[1].src = this.hiddenDealerCard;
			if (
				this.playerValue === 21 &&
				this.playerCards.length === 2 &&
				(this.dealerValue !== 21 ||
					(this.dealerValue === 21 && this.dealerCards.length !== 2))
			) {
				this.message = 'Blackjack! Player wins';
				this.bankAmount += 2.5 * this.betAmount;
			} else if (
				this.dealerValue === 21 &&
				this.dealerCards.length === 2 &&
				(this.playerValue !== 21 ||
					(this.playerValue === 21 && this.playerCards.length !== 2))
			) {
				this.message = 'Dealer has Blackjack. Dealer wins';
			} else if (
				this.playerValue > 21 ||
				(this.dealerValue <= 21 && this.dealerValue > this.playerValue)
			) {
				this.message = 'Dealer wins';
			} else if (
				this.dealerValue > 21 ||
				(this.playerValue <= 21 && this.dealerValue < this.playerValue)
			) {
				this.message = 'Player wins!';
				this.numWins++;
				this.bankAmount += 2 * this.betAmount;
			} else {
				this.message = 'Draw';
				this.bankAmount += this.betAmount;
			}
			this.resetBet();
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

.joker {
	width: 100px;
	position: absolute;
	top: 40px;
	left: 20px;
	display: flex;
	font-size: 10px;
	line-height: 1.4;
	text-align: left;

	.jokerCard {
		height: 40px;
		margin-right: 10px;
	}
}

.notes {
	width: 80px;
	position: absolute;
	top: 40px;
	right: 20px;
	font-size: 10px;
	line-height: 1.4;
	text-align: right;
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
	width: 80px;

	+ .card {
		margin-left: -58px;
	}

	&.ExHide {
		background-color: #000;
		border-radius: 4px;
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
