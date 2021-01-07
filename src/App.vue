<template>
	<div id="app">
		<Header />
		<router-view />
	</div>
</template>

<script>
import Header from '@/components/Header.vue';

export default {
	components: { Header },

	computed: {
		didAutoLogout() {
			return this.$store.getters.didAutoLogout;
		},
	},

	created() {
		this.$store.dispatch('tryLogin');
	},

	watch: {
		didAutoLogout(curValue, oldValue) {
			if (curValue && curValue !== oldValue) {
				this.$router.replace('/credits');
			}
		},
	},
};
</script>

<style lang="scss">
* {
	box-sizing: border-box;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
</style>
