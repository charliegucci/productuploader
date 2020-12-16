<template>
  <div class="login container">
    <form @submit.prevent="login" class="card-panel">
      <h2 class="center">Login</h2>
      <div class="field">
        <label for="email">Email:</label>
        <input type="email" name="email" v-model="email" />
      </div>
      <div class="field">
        <label for="password">Password:</label>
        <input type="password" name="password" v-model="password" />
      </div>
      <p v-if="feedback" class="red-text center">{{ feedback }}</p>
      <div class="field">
        <button class="btn primary">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
import firebase from 'firebase';
export default {
  name: 'Login',
  data() {
    return {
      email: null,
      password: null,
      feedback: null
    };
  },
  methods: {
    login() {
      if (this.email && this.password) {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then((cred) => {
            console.log(cred.user);
            this.$router.push({ name: 'Home' });
          })
          .catch((err) => {
            this.feedback = err.message;
          });
        this.feedback = null;
      } else {
        this.feedback = 'Please fill in both fields';
      }
    }
  }
};
</script>

<style scoped>
.login {
  max-width: 400px;
  margin-top: 60px;
}
.login h2 {
  font-size: 2.4em;
}
.login .field {
  margin-bottom: 16px;
}
.login input {
  border-bottom: 1px solid #999 !important;
}
input:not([type]):focus:not([readonly]), input[type=text]:not(.browser-default):focus:not([readonly]), input[type=password]:not(.browser-default):focus:not([readonly]), input[type=email]:not(.browser-default):focus:not([readonly]), input[type=url]:not(.browser-default):focus:not([readonly]), input[type=time]:not(.browser-default):focus:not([readonly]), input[type=date]:not(.browser-default):focus:not([readonly]), input[type=datetime]:not(.browser-default):focus:not([readonly]), input[type=datetime-local]:not(.browser-default):focus:not([readonly]), input[type=tel]:not(.browser-default):focus:not([readonly]), input[type=number]:not(.browser-default):focus:not([readonly]), input[type=search]:not(.browser-default):focus:not([readonly]), textarea.materialize-textarea:focus:not([readonly]) {
  border-bottom: 1px solid #999 !important;
  box-shadow: 0 1px 0 0 #e5d5ca;
}
</style>
