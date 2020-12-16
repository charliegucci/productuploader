<template>
    <v-data-table
      :headers="headers"
      :items="products"
      :items-per-page="50"
      :loading="products.length == 0"
      :search="search"
      sort-by="Stock"
      multi-sort
      fixed-header
      height="78vh"
      class="elevation-1"
    >
      <template v-slot:top dark>
        <v-text-field
          v-model="search"
          prepend-icon="mdi-magnify"
          label="Search"
          class="search"
          dark
        ></v-text-field>
      </template>

      <template v-slot:item.Name="props">
        <a class="product-name" v-bind:href="props.item.URL" target="_blank">
          {{ props.item.Name }}
        </a>
      </template>

      <template v-slot:item.Stock="props">
        <v-chip
          v-if="Number.isFinite(props.item.Stock)"
          :color="`${getColor(props.item.Stock)} lighten-2`"
        >
          {{ props.item.Stock }}
        </v-chip>
      </template>

      <template v-slot:item.ETA="props">
        <v-text-field
          v-model="props.item.ETA"
          @change="canUpdate(props.item)"
        ></v-text-field>
      </template>

      <template v-slot:item.Backorders="props">
        <v-select
          :items="backorderOptions"
          v-model="props.item.Backorders"
          @change="canUpdate(props.item)"
        ></v-select>
      </template>

      <template v-slot:item.Inventory="props">
          <v-btn
            :loading="props.item.InventoryCheck"
            @click="getStockLevels(props.item)"
          >
          Check
          <v-icon right light>
            mdi-replay
          </v-icon>
          </v-btn>
          <v-dialog
            v-if="props.item.Inventory.length > 0"
            v-model="props.item.Inventory"
            max-width="600"
          >
            <v-card>
              <v-card-title>
                {{props.item.Name}}
              </v-card-title>
              <v-card-text>
                <v-simple-table>
                  <template>
                  <tbody>
                    <tr
                      v-for="warehouse in props.item.Inventory"
                      v-if="warehouse.WarehouseId == 14"
                      :key="props.item.Inventory.WarehouseId"
                    >
                      <td>{{warehouses.filter( w => w.WarehouseId == warehouse.WarehouseId )[0].Name}}</td>
                      <td>{{warehouse.RequiredByBackOrder}}</td>
                      <!-- <td>{{warehouse.WarehouseId}}</td> -->
                    </tr>
                  </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  class="ml-auto"
                  color="red darken-2"
                  text
                  @click="props.item.Inventory = false"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
      </template>

      <template v-slot:item.Update="props">
        <v-btn
          :loading="props.item.Uploading"
          :color="props.item.Update == 'updateMe' ? 'green' : 'grey'"
          :disabled="props.item.Update != 'updateMe'"
          class="ma-2 white--text"
          @click="updateProductCall(props.item)"
        >
          Update
          <v-icon right dark>
            mdi-cloud-upload
          </v-icon>
        </v-btn>
      </template>
      
      <template v-slot:item.OnWatch="props">
        
        <v-btn
          v-if="props.item.OnWatch == 'yes'"
          color='green'
          class="rounded-pill"
          @click="toggleWatch(props.item)"
        >
          <v-icon color="white">
              mdi-eye
          </v-icon>
        </v-btn>

        <v-btn
          v-if="props.item.OnWatch != 'yes' "
          color='red'
          class="rounded-pill"
          @click="toggleWatch(props.item)"
        >
          <v-icon color="white">
              mdi-eye-off
          </v-icon>
        </v-btn>
        
      </template>

      <template v-slot:item.UpdateNote="props">
        <v-textarea
          class="product-notes"
          v-model="props.item.UpdateNote"
          @change="canUpdate(props.item)"
        ></v-textarea>
      </template>

    </v-data-table>
</template>

<script>
import axios from 'axios';
import firebase from 'firebase';

export default {
  name: 'Table',
  methods: {
    updateProductCall(product) {
      product.Uploading = true;
      console.log(product);
      axios // Send Product Updates to Woo
        //.post('https://enq39j6i9rg5luj.m.pipedream.net', { // PRODUCTION
        .post('https://ennvtp3mrxdwuwl.m.pipedream.net', { // DEVELOPMENT
          id: product.WooID,
          ETA: product.ETA,
          Backorders: product.Backorders,
          Attributes: product.Attributes,
          LastUpdatedBy: `${firebase.auth().currentUser.email} @ ${new Date().toLocaleString( 'en-GB', {timeZone: "Australia/Brisbane"} )}`,
          UpdateNote: ` ${product.UpdateNote}`,
          OnWatch: product.OnWatch,
        })
        .then((response) => {
          product.Uploading = false;
          if (response.data.attributes.length > 0) {
            product.Update = 'NoUpdate';
            product.LastUpdatedBy = `${firebase.auth().currentUser.email} @ ${new Date().toLocaleString( 'en-GB', {timeZone: "Australia/Brisbane"} )}`
          }
        });
    },
    canUpdate(product) {
      product.Update = 'updateMe';
    },
    getStockLevels(product) {
      product.InventoryCheck = true;
      axios.post('https://enr5cgndr54qnqy.m.pipedream.net', {sku: product.SKU})
      .then((response) => {
        product.InventoryCheck = false
        product.Inventory = response.data
      });
    },
    getColor(stockLevel) {
      if(stockLevel > 20) {
        return 'green'
      } else if(stockLevel > 0) {
        return 'orange'
      } else {
        return 'red'
      }
    },
    toggleWatch(product) {
      product.OnWatch = product.OnWatch == "yes" ? product.OnWatch = "no" : product.OnWatch = "yes";
      this.canUpdate(product);
    },
    log(msg) {
      console.log(msg);
    }
  },
  data: () => ({
    headers: [
      { text: 'Product Name', value: 'Name' },
      { text: 'ETA', value: 'ETA' },
      { text: 'SKU', value: 'SKU' },
      { text: 'Stock', value: 'Stock' },
      { text: 'Backorders', value: 'Backorders' },
      { text: 'Stock Status', value: 'StockStatus' },
      { text: 'Type', value: 'Type' },
      { text: 'Backorder Quantity', value: 'Inventory' },
      { text: 'Update', value: 'Update' },
      { text: 'Watch', value: 'OnWatch'},
      { text: 'Update Note', value: 'UpdateNote'},
      { text: 'Updated By', value: 'LastUpdatedBy' },
    ],
    search: '',
    products: [],
    warehouses: [],
    backorderOptions: ['no', 'notify', 'yes']
  }),
  mounted() {
    // Get Paginated Products from Woo
    for (let i = 1; i <= 1; i++) {
      axios
        //.post('https://enl05db8cgi684g.m.pipedream.net/', { page: i }) // PRODUCTION
        .post('https://ensrxo2l2po2a4f.m.pipedream.net', { page: i }) // DEVELOPMENT
        .then((response) =>
          this.products.push(
            ...response.data.map((prod) => ({
              ...prod,
              Update: 'NoUpdate',
              Uploading: false,
              InventoryCheck: false,
              Inventory: [],
            }))
          )
        );
    }
    // Get Warehouse Summary From Mintsoft
    axios.get('https://en6etanapq9gd8y.m.pipedream.net') 
    .then((response) => 
      this.warehouses.push(...response.data)
    )
  }
};
</script>
<style>
.v-input__slot:before,
.v-input__slot:after {
  border: none !important;
}
.v-text-field__slot {
  font-size: 14px;
}
.v-select__selections {
  font-size: 14px;
}
.search {
  margin-top: 0px !important;
  padding: 16px 16px 0px !important;
  background: #d4a494;
}
.search input {
  border-bottom: solid 1px rgba(255, 255, 255, 0.6);
  max-width: 300px !important;
}
th.text-start.sortable {
  font-size: 14px !important;
}
.container--fluid {
  padding: 0px !important;
  width: 100%;
}
.product-name {
  color: #333 !important;
  text-decoration: none;
}
.product-notes {
  min-width: 250px !important;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
input {
  border-bottom: none !important;
}
input:not([type]):focus:not([readonly]), input[type=text]:not(.browser-default):focus:not([readonly]), input[type=password]:not(.browser-default):focus:not([readonly]), input[type=email]:not(.browser-default):focus:not([readonly]), input[type=url]:not(.browser-default):focus:not([readonly]), input[type=time]:not(.browser-default):focus:not([readonly]), input[type=date]:not(.browser-default):focus:not([readonly]), input[type=datetime]:not(.browser-default):focus:not([readonly]), input[type=datetime-local]:not(.browser-default):focus:not([readonly]), input[type=tel]:not(.browser-default):focus:not([readonly]), input[type=number]:not(.browser-default):focus:not([readonly]), input[type=search]:not(.browser-default):focus:not([readonly]), textarea.materialize-textarea:focus:not([readonly]) {
  border-bottom: none !important;
  box-shadow: 0 1px 0 0 #fff;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
