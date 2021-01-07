<template>
	<div>
		<form @submit.prevent="submitForm">
			<h1 class="title">
				{{ submitButtonCaption }}
			</h1>
			<div class="form-control">
				<label for="email"></label>
				<input
					type="email"
					id="email"
					placeholder="✉ Email"
					v-model.trim="email"
				/>
			</div>
			<div class="form-control">
				<label for="password"></label>
				<input
					type="password"
					id="password"
					placeholder="⚿ Password"
					v-model.trim="password"
				/>
			</div>

			<p v-if="!formIsValid">
				Please enter a valid email and password (must be at least 6
				characters long).
			</p>
			<button>{{ submitButtonCaption }}</button>
			<button type="button" @click="switchAuthMode" class="switch-mode">
				{{ switchModeButtonCaption }}
			</button>
		</form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			email: '',
			password: '',
			formIsValid: true,
			mode: 'login',
			isLoading: false,
			error: null,
		};
	},

	computed: {
		submitButtonCaption() {
			if (this.mode === 'login') {
				return 'Login';
			} else {
				return 'Sign Up';
			}
		},

		switchModeButtonCaption() {
			if (this.mode === 'login') {
				return 'Sign Up instead';
			} else {
				return 'Login instead';
			}
		},
	},

	methods: {
		async submitForm() {
			this.formIsValid = true;
			if (
				this.email === '' ||
				!this.email.includes('@') ||
				this.password.length < 6
			) {
				this.formIsValid = false;
				return;
			}

			this.isLoading = true;

			const actionPayload = {
				email: this.email,
				password: this.password,
			};

			try {
				if (this.mode === 'login') {
					await this.$store.dispatch('login', actionPayload);
				} else {
					await this.$store.dispatch('signup', actionPayload);
				}
				this.$router.replace('/');
			} catch (err) {
				this.error =
					err.message || 'Failed to authenticate, try later.';
			}

			this.isLoading = false;
		},

		switchAuthMode() {
			if (this.mode === 'login') {
				this.mode = 'signup';
			} else {
				this.mode = 'login';
			}
		},

		handleError() {
			this.error = null;
		},
	},
};
</script>

<style lang="scss" scoped>
form {
	margin: 40px;
}

.title {
	font-size: 24px;
	font-weight: bold;
	margin-bottom: 40px;
	text-transform: uppercase;
}

.form-control {
	margin-bottom: 14px;
}

input {
	display: block;
	width: 100%;
	font: inherit;
	background-color: rgb(246, 246, 246);
	border: none;
	border-radius: 2px;
	padding: 10px;
}

input:focus,
textarea:focus {
	background-color: #faf6ff;
	outline: none;
}

button {
	display: block;
	margin: 30px auto 10px;
	padding: 10px 20px;
	width: 140px;
	background-color: #2c3e50;
	color: #fff;
	outline: none;
	border: 1px solid #fff;
	border-radius: 100px;
	text-transform: uppercase;

	&.switch-mode {
		margin-top: 10px;
		background-color: transparent;
		color: #2c3e50;
		text-decoration: underline;
		text-transform: initial;
		border: none;
		border-radius: 0;
	}
}
</style>
