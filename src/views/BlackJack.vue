<template>
	<div class="blackjack">
		<div
			v-if="!isPlaying"
			class="playButton"
			@click="isPlaying = !isPlaying"
		>
			Play
		</div>
		<BJTable v-if="isPlaying" />
	</div>
</template>

<script>
import BJTable from '@/components/BJTable';

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
	height: calc(100vh - 50px);
	background: url('../assets/green_table.jpg') no-repeat center;
	background-size: cover;
	padding: 50px;
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
