<template>
	<div class="piggame">
		<div v-show="!isPlaying" class="pig-rules">
			<h3>
				Pig Game Rules
			</h3>
			<p>
				A simple 1v1 dice rolling game that you can play by yourself
				against a computer or with a friend!
			</p>
			<p>
				Players temporarily recieve the amount of points rolled by the
				dice which is added to your current score. Players can only cash
				in their current score to their total score when they press
				'Hold Score' and the turn will go to the next player. Players
				can continue to 'Roll Dice' to increase their current score. If
				a player rolls a one on either of the dice, the player will lose
				all their current point score, but retain their previous total
				score, and the next player plays.
			</p>
			<button class="play-button" @click="playVsComputer()">
				Play <span>(vs Computer)</span><IosPlayIcon />
			</button>
			<button class="play-button" @click="isPlaying = !isPlaying">
				Play <span>(2 Player)</span><IosPlayIcon />
			</button>
		</div>
		<pig-player
			v-show="isPlaying"
			v-for="(player, idx) in players"
			:key="idx"
			:index="idx"
			:player="player"
			:currentPlayer="currentPlayer"
			:isFinished="isFinished"
			:isComputer="isComputer"
			@roll-dice="rollDice"
			@hold-score="holdScore"
		/>
		<div
			v-show="dice !== null && isPlaying && !isFinished"
			class="dice-area"
		>
			<img
				v-for="(die, idx) in dice"
				:key="idx"
				:src="die.src"
				:alt="`dice ${idx + 1}`"
				class="dice"
			/>
		</div>
		<button
			v-if="isFinished"
			class="play-button ExInGame"
			@click="playAgain()"
		>
			Play Again
		</button>
	</div>
</template>

<script>
import PigPlayer from '../components/PigPlayer.vue';
import IosPlayIcon from 'vue-ionicons/dist/ios-play.vue';
import { DICE } from '@/utils/constants.js';

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

export default {
	components: {
		PigPlayer,
		IosPlayIcon,
	},

	data() {
		return {
			isPlaying: false,
			currentPlayer: 0,
			dice: null,
			players: [
				{
					name: 'Player 1',
					holdingScore: 0,
					currentScore: 0,
					isWinner: false,
				},
				{
					name: 'Player 2',
					holdingScore: 0,
					currentScore: 0,
					isWinner: false,
				},
			],
			isComputer: false,
			winningScore: 100,
		};
	},

	computed: {
		DICE: () => DICE,

		diceValue() {
			return this.dice.reduce((acc, cur) => acc + cur.value, 0);
		},

		isFinished() {
			return this.players.some(player => player.isWinner === true);
		},
	},

	methods: {
		playVsComputer() {
			this.isComputer = true;
			this.isPlaying = !this.isPlaying;
			this.players[1].name = 'Computer';
		},

		playAgain() {
			this.currentPlayer = 0;
			this.dice = null;
			this.players = [
				{
					name: 'Player 1',
					holdingScore: 0,
					currentScore: 0,
					isWinner: false,
				},
				{
					name: this.isComputer ? 'Computer' : 'Player 2',
					holdingScore: 0,
					currentScore: 0,
					isWinner: false,
				},
			];
		},

		rollDice(role = 'player') {
			this.dice = [
				this.DICE[Math.floor(Math.random() * 6)],
				this.DICE[Math.floor(Math.random() * 6)],
			];
			if (this.dice.some(die => die.value === 1)) {
				this.players[this.currentPlayer].currentScore = 0;
				if (role === 'computer') {
					return;
				}
				this.holdScore('roll');
			} else {
				this.players[this.currentPlayer].currentScore += this.diceValue;
			}
		},

		holdScore(method) {
			this.players[this.currentPlayer].holdingScore += this.players[
				this.currentPlayer
			].currentScore;
			if (
				method !== 'roll' &&
				this.players[this.currentPlayer].holdingScore >=
					this.winningScore
			) {
				this.players[this.currentPlayer].isWinner = true;
				return;
			}
			this.players[this.currentPlayer].currentScore = 0;
			this.currentPlayer
				? (this.currentPlayer = 0)
				: (this.currentPlayer = 1);

			if (
				method !== 'auto' &&
				this.isComputer &&
				this.currentPlayer === 1
			) {
				this.playAuto();
			}
		},

		playAuto() {
			setTimeout(() => {
				this.rollDice('computer');
				setTimeout(() => this.holdScore('auto'), 1000);
			}, 1000);
		},
	},
};
</script>

<style lang="scss" scoped>
.piggame {
	position: relative;
	height: calc(100vh - 50px);
	height: calc(var(--vh, 1vh) * 100 - 50px);
	background: url('../assets/piggame.jpg') no-repeat center;
	background-size: cover;
	padding: 40px;
}

.pig-rules {
	h3 {
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 40px;
	}

	p {
		text-align: left;
		line-height: 1.3;
		font-size: 14px;
		margin-bottom: 30px;
	}
}

.play-button {
	margin-top: 30px;
	width: 100%;
	background-color: rgba(255, 255, 255, 0.5);
	padding: 10px;
	border: 1px solid rgba(0, 0, 0, 0.2);
	border-radius: 3px;
	font-size: 20px;
	font-weight: bold;
	text-transform: uppercase;

	.ion {
		vertical-align: text-top;
		margin-left: 5px;
	}

	&.ExInGame {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 50%;
		margin-top: 0;
	}

	span {
		font-size: 14px;
		font-weight: normal;
		vertical-align: 3px;
	}
}

.dice-area {
	position: absolute;
	width: 100%;
	padding: 0 40px;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	.dice {
		width: 60px;

		&:first-child {
			margin-right: 20px;
		}
	}
}
</style>
