<template>
	<div class="tictactoe">
		<div class="grid">
			<div class="cell"></div>
			<div class="cell"></div>
			<div class="cell"></div>
			<div class="cell"></div>
			<div class="cell"></div>
			<div class="cell"></div>
			<div class="cell"></div>
			<div class="cell"></div>
			<div class="cell"></div>
		</div>
	</div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.tictactoe {
	height: calc(100vh - 50px);
	background: rgba(0, 0, 0, 0.05);
	padding: 40px;
}

.grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
}

.cell {
	flex: 0 0 24vw;
	height: 24vw;
	margin-bottom: 4px;
	border: 2px solid #777;
	box-sizing: border-box;
}
</style>
