<template>
	<div
		class="player"
		:class="{ ExCurrent: isCurrentPlayer, ExFinished: isFinished }"
	>
		<div class="player-section" :class="{ ExOther: index }">
			<h3 v-if="player.isWinner" class="winner-text">Winner!</h3>
			<input v-else type="text" :value="`Player ${index + 1}`" />
			<div class="holding-score">
				{{ player.holdingScore }}
			</div>
			<div class="current-score-box">
				current
				<span class="current-score">
					{{ player.currentScore }}
				</span>
			</div>
		</div>
		<div v-show="showButtonArea" class="button-area">
			<!-- <button class="btn-new"><IosAddCircleOutlineIcon />New game</button> -->
			<button class="btn-roll" @click="$emit('roll-dice')">
				<IosSyncIcon />Roll dice
			</button>
			<button class="btn-hold" @click="$emit('hold-score')">
				<IosDownloadIcon />Hold
			</button>
		</div>
	</div>
</template>

<script>
import IosSyncIcon from 'vue-ionicons/dist/ios-sync.vue';
import IosDownloadIcon from 'vue-ionicons/dist/ios-download.vue';

export default {
	components: {
		IosSyncIcon,
		IosDownloadIcon,
	},

	props: {
		index: {
			type: Number,
			required: true,
		},

		player: {
			type: Object,
			required: true,
		},

		currentPlayer: {
			type: Number,
			required: true,
		},

		isFinished: {
			type: Boolean,
			required: true,
		},
	},

	computed: {
		isCurrentPlayer() {
			return this.currentPlayer === this.index;
		},

		showButtonArea() {
			if (this.isFinished) {
				return false;
			} else {
				return !this.isCurrentPlayer;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.player {
	position: relative;
	height: 50%;

	&.ExCurrent {
		background-color: rgba(255, 255, 255, 0.3);
	}

	&.ExFinished {
		background: none;
	}

	&-section {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		padding: 0 0 30px;

		&.ExOther {
			flex-direction: column-reverse;
			padding: 30px 0 0;

			.current-score-box {
				flex-direction: column-reverse;

				.current-score {
					margin: 0 0 6px;
				}
			}
		}

		input {
			width: 70%;
			background: none;
			border: none;
			text-align: center;
			padding: 10px;
			text-transform: uppercase;
		}

		.holding-score {
			font-size: 48px;
		}

		.current-score-box {
			width: 50%;
			background-color: #eb4d4d;
			color: #222;
			font-size: 10px;
			display: flex;
			flex-direction: column;
			text-transform: uppercase;
			padding: 12px;

			.current-score {
				margin: 6px 0 0;
				color: #fff;
				font-size: 24px;
			}
		}
	}
}

.button-area {
	height: 100%;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.8);
	position: absolute;
	top: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	button {
		width: 200px;
		color: #fff;
		background: none;
		padding: 20px;
		border: none;
		font-size: 20px;
		text-transform: uppercase;

		&:first-child {
			margin-bottom: 10px;
		}

		.ion {
			vertical-align: middle;
			margin-right: 15px;
			color: #eb4d4d;
			font-size: 32px;
		}
	}
}
</style>
