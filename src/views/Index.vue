<template>
  <v-app>
    <v-main>
      <TableIndex />
    </v-main>
  </v-app>
</template>
</template>

<script>
import TableIndex from "../components/home/TableIndex";
export default {
  name: "IndexView",
  components: {
    TableIndex,
  }
  ,
  methods: {
    console() {
      console.log(this.woo_product_uk);
    },
  },
};
</script>

<style></style>
