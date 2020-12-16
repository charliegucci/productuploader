<template>
  <div>
    <v-card>
      <v-card-title>
        ABI Product Management
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
    </v-card>
    <v-data-table
      :headers="headers"
      :items="woo_product_uk"
      :search="search"
      dark
      fixed-header
      height="600px"
    >
      <template v-slot:item.name="props">
        <v-edit-dialog
          :return-value.sync="props.item.name"
          @save="save"
          @cancel="cancel"
          @open="open"
          @close="close"
        >
          {{ props.item.name }}
          <template v-slot:input>
            <v-text-field
              v-model="props.item.name"
              :rules="[max25chars]"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.sku="props">
        <v-edit-dialog
          :return-value.sync="props.item.sku"
          @save="save"
          @cancel="cancel"
          @open="open"
          @close="close"
        >
          {{ props.item.sku }}
          <template v-slot:input>
            <v-text-field
              v-model="props.item.sku"
              :rules="[max25chars]"
              label="Edit"
              single-line
              counter
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
    </v-data-table>

    <v-snackbar v-model="option" :timeout="3000" :color="optionColour">
      {{ optionText }}

      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" text @click="option = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import db from '@/firebase/init';
import axios from 'axios';
export default {
  name: 'TableIndex',
  data() {
    return {
      woo_product_uk: [],
      search: '',
      option: false,
      optionColour: '',
      optionText: '',
      max25chars: (v) => v.length <= 60 || 'Input too long!',
      pagination: {},
      headers: [
        {
          text: 'PRODUCT',
          align: 'start',
          sortable: false,
          value: 'name'
        },
        { text: 'ID', value: 'id' },
        { text: 'SKU', value: 'sku' },
        { text: 'TYPE', value: 'type' },
        { text: 'STATUS', value: 'status' },
        { text: 'PRICE', value: 'price' },
        { text: 'SALE PRICE', value: 'sale_price' },
        { text: 'BACK ORDERED', value: 'backordered' }
      ],
      dialog: false,
      dialogDelete: false
    };
  },
  methods: {
    save() {
      this.option = true;
      this.optionColour = 'success';
      this.optionText = 'Data saved';
    },
    cancel() {
      this.option = true;
      this.optionColour = 'error';
      this.optionText = 'Canceled';
    },
    open() {
      this.option = true;
      this.optionColour = 'info';
      this.optionText = 'Dialog opened';
    },
    close() {
      console.log('Dialog closed');
    }
  },
  created() {
    for (let i = 1; i < 26; i++) {
      axios
        .post('https://enfidw9d58469xa.m.pipedream.net', { page: i })
        .then((product) => {
          this.woo_product_uk.push(...product.data);
          console.log(
            `Downloading Product. Total count: ${this.woo_product_uk.length}, ${i}`
          );
        });
      //     .catch((err) => console.log(err));
      // await db
      //   .collection("products")
      //   .get()
      //   .then((snapshot) => {
      //     snapshot.forEach((doc) => {
      //       let product = doc.data();
      //       product.id = doc.id;
      //       this.woo_product_uk.push(product);
      //     });
      //   });
    }
  }
};
</script>

<style></style>
