import { writable, derived } from "svelte/store";
// import localProducts from "../localProducts";
import getProducts from "../strapi/getProducts"
import url from "../strapi/URL"
const store = writable([], ()=> {
  setProducts();
  return () => {};

});

// subscribe
// set
// update

// flatten products
async function setProducts() {
  let products = await getProducts();
  if ( products) {
  products = flattenProducts(products);
  store.set(products);
  }
}

function flattenProducts(data) {
  return data.map(item => {
    let image = item.image.url;
    return { ...item, image }
  });
}
// featured store
export const featuredStore = derived(store, $featured => {
  return $featured.filter(item => item.featured === true);
});
export default store;
