<template>
	<div class="blackjack">
		<div
			v-if="!isPlaying"
			class="playButton"
			@click="isPlaying = !isPlaying"
		>
			Play
		</div>
		<BJTable v-if="isPlaying" @end-game="isPlaying = !isPlaying" />
	</div>
</template>

<script>
import BJTable from '@/components/BJTable';

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

export default {
	components: { BJTable },

	data() {
		return {
			isPlaying: false,
		};
	},
};
</script>

<style lang="scss" scoped>
.blackjack {
	position: relative;
	height: calc(100vh - 50px);
	height: calc(var(--vh, 1vh) * 100 - 50px);
	background: url('../assets/green_table.jpg') no-repeat center;
	background-size: cover;
	padding: 40px;
}

.playButton {
	position: absolute;
	top: 55%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 120px;
	background-color: rgba(255, 255, 255, 0.8);
	padding: 20px;
	border-radius: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 20px;
	font-weight: bold;
	text-transform: uppercase;
}
</style>
