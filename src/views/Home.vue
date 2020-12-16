<template>
  <v-app>
    <v-main>
      <Table />
    </v-main>
  </v-app>
</template>

<script>
import Table from '../components/home/Table';

export default {
  name: 'Home',

  components: {
    Table
  },

  data: () => ({
    //
  })
};
</script>
