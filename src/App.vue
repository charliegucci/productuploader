<template>
  <v-app>
    <div id="app">
      <Navbar />
      <router-view />
    </div>
  </v-app>
</template>
<script>
import Navbar from '@/components/layout/Navbar';
export default {
  name: 'App',
  components: { Navbar }
};
</script>
<style>
#app {
  width: 100%;
}

</style>
