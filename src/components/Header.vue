<template>
	<header class="header">
		<div class="headerInner">
			<div
				v-if="$route.path !== '/'"
				class="backButton"
				@click="$router.back()"
			>
				Back
			</div>
			<div class="logo">Games</div>
			<Nav />
		</div>
	</header>
</template>

<script>
import Nav from '@/components/Nav.vue';

export default {
	components: { Nav },
};
</script>

<style lang="scss" scoped>
.header {
	position: relative;
	height: 50px;
	z-index: 100;
}

.headerInner {
	position: fixed;
	width: 100%;
	background-color: #fff;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
	display: flex;
	justify-content: center;
}

.backButton {
	position: absolute;
	top: 0;
	left: 0;
	height: 50px;
	width: 50px;
	font-size: 0;
	display: flex;
	justify-content: center;
	align-items: center;

	&::before {
		content: '\1438';
		display: block;
		font-size: 30px;
		font-weight: bold;
	}
}

.logo {
	font-size: 18px;
	font-weight: bold;
	line-height: 50px;
}
</style>
