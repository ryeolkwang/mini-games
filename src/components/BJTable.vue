<template>
	<div class="table">
		<div class="statistics">
			<span>Bank: ${{ bankAmount }}</span>
			<span>Bet: ${{ totalBetAmount }}</span>
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
			<span class="dealerScore">{{
				dealersHand.length === 2 && !isDecided
					? dealersHand[0].value
					: handValue(dealersHand)
			}}</span>
			<div class="dealerCards">
				<img
					v-for="(card, idx) in dealersHand"
					:key="idx"
					:src="
						dealersHand.length === 2 && !isDecided && idx === 1
							? ''
							: card.src
					"
					:alt="
						dealersHand.length === 2 && !isDecided && idx === 1
							? ''
							: 'Dealers Card'
					"
					class="card"
					:class="{
						ExHide:
							dealersHand.length === 2 && !isDecided && idx === 1,
					}"
				/>
			</div>
		</div>
		<div class="playerSection">
			<div class="playerTable">
				<div class="playerMiniTable">
					<div class="messages">
						{{ messages[0] }}
					</div>
					<div
						class="playerCards"
						:class="{
							ExOther:
								currentHand !== null &&
								currentHand !== playersHand &&
								!isDecided,
						}"
					>
						<img
							v-for="(card, idx) in playersHand"
							:key="idx"
							:src="card.src"
							alt="Players Card"
							class="card"
							:class="{ ExSmall: playersSplitHand.length !== 0 }"
						/>
					</div>
					<span class="playerScore">{{
						handValue(playersHand)
					}}</span>
				</div>
				<div
					v-if="playersSplitHand.length !== 0"
					class="playerMiniTable"
				>
					<div class="messages">
						{{ messages[1] }}
					</div>
					<div
						class="playerCards"
						:class="{
							ExOther:
								currentHand !== playersSplitHand && !isDecided,
						}"
					>
						<img
							v-for="(card, idx) in playersSplitHand"
							:key="idx"
							:src="card.src"
							alt="Players Card"
							class="card ExSmall"
						/>
					</div>
					<span
						v-if="playersSplitHand.length !== 0"
						class="playerScore"
						>{{ handValue(playersSplitHand) }}</span
					>
				</div>
			</div>
			Player
		</div>
		<div class="buttonSection">
			<button v-if="!isDecided" @click="placePlayerCard(currentHand)">
				Hit
			</button>
			<button v-if="!isDecided" @click="endTurn()">
				Stand
			</button>
			<button v-if="canDouble" @click="double(currentHand)">
				Double
			</button>
			<button v-if="canSplit" @click="split()">
				Split
			</button>
			<span v-if="isDecided">${{ betAmount }}</span>
			<button
				v-if="isDecided"
				:disabled="betAmount === 0 && bankAmount > 0"
				:class="{ ExDisabled: betAmount === 0 && bankAmount > 0 }"
				@click="
					bankAmount <= 0 && betAmount <= 0
						? $emit('end-game')
						: playBJ()
				"
			>
				{{ playButton }}
			</button>
		</div>
		<div v-if="isDecided && bankAmount > 0" class="betSection">
			<button v-if="betAmount > 0" @click="resetBet">
				Reset
			</button>
			<button
				v-for="(bet, idx) in betUnits"
				:key="idx"
				@click="addBet(bet.value)"
			>
				{{ bet.amount }}
			</button>
			<button
				v-if="betAmount === 0 && previousBetAmount !== 0"
				@click="reBet"
			>
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
			if (this.bankAmount <= 0 && this.betAmount <= 0) {
				return 'bankrupt';
			} else if (this.numGames === undefined || this.numGames === 0) {
				return 'play';
			}
			return 'play again';
		},

		betUnits: () => [
			{ amount: '$50', value: 50 },
			{ amount: '$100', value: 100 },
			{ amount: '$500', value: 500 },
			{ amount: '$1000', value: 1000 },
		],

		canDouble() {
			return (
				!this.isDecided &&
				this.currentHand.length === 2 &&
				this.bankAmount >= this.betAmount
			);
		},

		canSplit() {
			return (
				!this.isDecided &&
				this.bankAmount >= this.betAmount &&
				this.playersSplitHand.length === 0 &&
				this.playersHand.length !== 0 &&
				(this.playersHand[0].value === this.playersHand[1].value ||
					this.playersHand[1].value === 1)
			);
		},
	},

	data() {
		return {
			shuffledCards: [],
			dealersHand: [],
			playersHand: [],
			playersSplitHand: [],
			currentHand: null,
			messages: ['', ''],
			isDecided: true,
			betAmount: 0,
			totalBetAmount: 0,
			previousBetAmount: 0,
			bankAmount: 1000,
			numGames: 0,
			numWins: 0,
			isJokerOut: false,
		};
	},

	watch: {
		betAmount(val) {
			if (val > this.bankAmount) {
				this.betAmount = this.bankAmount;
			}
		},
	},

	created() {
		this.messages[0] = 'Place your bets';
		this.shuffleDeck();
	},

	methods: {
		handValue(hand) {
			if (hand === undefined || hand.length === 0) {
				return 0;
			}
			return hand.map(x => x.value).reduce((acc, cur) => acc + cur);
		},

		isBJ(hand) {
			return this.handValue(hand) === 21 && hand.length === 2;
		},

		addBet(bet) {
			this.betAmount += bet;
		},

		resetBet() {
			this.previousBetAmount = this.betAmount;
			this.betAmount = 0;
			this.totalBetAmount = 0;
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
			this.bankAmount -= this.betAmount;
			this.totalBetAmount += this.betAmount;
			this.dealersHand = [];
			this.playersHand = [];
			this.playersSplitHand = [];
			this.currentHand = this.playersHand;
			this.messages[0] = 'Dealer stands on 17\nBlackjack pays 3 to 2';
			this.messages[1] = '';
			this.numGames++;
			this.placePlayerCard();
			this.placePlayerCard();
			if (this.isBJ(this.playersHand)) {
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

		placePlayerCard(hand = this.playersHand, play) {
			if (this.shuffledCards[0].name === 'Joker') {
				this.isJokerOut = true;
				this.messages[0] = 'Deck will be shuffled next round';
				// this.messages[1] = 'Deck will be shuffled next round';
				this.shuffledCards.shift();
				this.placePlayerCard(hand);
				return;
			}
			hand.push(this.shuffledCards[0]);
			this.shuffledCards.shift();
			this.checkAceValue(hand);
			if (play === 'split') {
				return;
			} else if (play === 'double' || this.handValue(hand) >= 21) {
				this.endTurn();
			}
		},

		placeDealerCard() {
			if (this.shuffledCards[0].name === 'Joker') {
				this.isJokerOut = true;
				this.messages[0] = 'Deck will be shuffled next round';
				this.shuffledCards.shift();
				this.placeDealerCard();
				return;
			}
			this.dealersHand.push(this.shuffledCards[0]);
			this.shuffledCards.shift();
			this.checkAceValue(this.dealersHand);
		},

		checkAceValue(hand) {
			if (
				this.handValue(hand) > 21 &&
				hand.map(x => x.value).lastIndexOf(11) !== -1
			) {
				hand.filter(x => x.value === 11)[
					hand.filter(x => x.value === 11).length - 1
				].value = 1;
			} else if (hand[0].value === 1) {
				hand[0].value === 11;
			}
		},

		double(hand) {
			this.bankAmount -= this.betAmount;
			this.betAmount *= 2;
			this.totalBetAmount = this.betAmount;
			this.placePlayerCard(hand, 'double');
		},

		split() {
			this.numGames++;
			this.bankAmount -= this.betAmount;
			this.totalBetAmount += this.betAmount;
			this.playersSplitHand.push(this.playersHand[1]);
			this.checkAceValue(this.playersSplitHand);
			this.playersHand.pop();
			this.messages[1] = 'Dealer stands on 17\nBlackjack pays 3 to 2';
			this.placePlayerCard(this.playersHand, 'split');
			this.placePlayerCard(this.playersSplitHand, 'split');
			if (
				this.handValue(this.playersHand) === 21 &&
				this.handValue(this.playersSplitHand) === 21
			) {
				this.endTurn();
			} else if (this.handValue(this.playersHand) === 21) {
				this.currentHand = this.playersSplitHand;
			}
		},

		endTurn() {
			if (
				this.playersSplitHand.length !== 0 &&
				this.handValue(this.playersSplitHand) < 21 &&
				this.currentHand !== this.playersSplitHand
			) {
				this.currentHand = this.playersSplitHand;
				return;
			}
			if (
				(this.handValue(this.playersHand) > 21 &&
					this.handValue(this.playersSplitHand) > 21) ||
				((this.handValue(this.playersHand) > 21 ||
					this.isBJ(this.playersHand)) &&
					this.currentHand !== this.playersSplitHand &&
					this.dealersHand.length === 2) ||
				this.handValue(this.dealersHand) >= 17
			) {
				this.decideWinner();
			} else {
				this.placeDealerCard();
				this.endTurn();
			}
		},

		decideWinner() {
			[this.playersHand, this.playersSplitHand].forEach((hand, idx) => {
				if (hand.length === 0) {
					return;
				}
				if (
					this.isBJ(hand) &&
					!this.isBJ(this.dealersHand) &&
					this.playersSplitHand.length === 0
				) {
					this.messages[idx] = 'Blackjack! Player wins';
					this.bankAmount += 2.5 * this.betAmount;
				} else if (!this.isBJ(hand) && this.isBJ(this.dealersHand)) {
					this.messages[idx] = 'Dealer has Blackjack. Dealer wins';
				} else if (
					this.handValue(hand) > 21 ||
					(this.handValue(this.dealersHand) <= 21 &&
						this.handValue(this.dealersHand) > this.handValue(hand))
				) {
					this.messages[idx] = 'Dealer wins';
				} else if (
					this.handValue(this.dealersHand) > 21 ||
					(this.handValue(hand) <= 21 &&
						this.handValue(this.dealersHand) < this.handValue(hand))
				) {
					this.messages[idx] = 'Player wins!';
					this.numWins++;
					this.bankAmount += 2 * this.betAmount;
				} else {
					this.messages[idx] = 'Draw';
					this.bankAmount += this.betAmount;
				}
			});
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
	margin-top: 6px;
	padding: 10px;
	height: 140px;
	background-color: rgba(255, 255, 255, 0.2);
	border: 1px solid #fff;
	border-radius: 6px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.dealerScore {
	font-size: 20px;
}

.playerSection {
	display: flex;
	flex-direction: column;
}

.playerTable {
	display: flex;
}

.playerMiniTable {
	width: 100%;
	display: flex;
	flex-direction: column;

	+ .playerMiniTable {
		margin-left: 8px;
	}
}

.playerCards {
	margin-bottom: 6px;
	padding: 10px;
	height: 140px;
	background-color: rgba(255, 255, 255, 0.2);
	border: 1px solid #fff;
	border-radius: 6px;
	display: flex;
	justify-content: center;
	align-items: center;

	&.ExOther {
		opacity: 0.2;
	}
}

.playerScore {
	font-size: 20px;
}

.card {
	position: relative;
	height: 106px;

	+ .card {
		margin-left: -58px;
	}

	&.ExHide {
		background-color: rgba(0, 0, 0, 0.95);
		border: 1px solid #000;
		border-radius: 4px;
		width: 73px;
	}

	&.ExSmall {
		height: 92px;

		+ .card {
			margin-left: -52px;
		}
	}
}

.messages {
	margin-bottom: 15px;
	font-size: 16px;
	text-transform: uppercase;
}

.buttonSection {
	display: flex;
	justify-content: space-evenly;
	align-items: center;

	button {
		color: #fff;
		font-size: 14px;
		font-weight: bold;
		padding: 8px 12px;
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
