<script>
  import { onMount } from "svelte";
  import { navigate, link } from "svelte-routing";
  import user from "../stores/user";
  import cart, { cartTotal } from "../stores/cart";
  import submitOrder from "../strapi/submitOrder";
  import globalStore from "../stores/globalStore";

  let name = "";
  // stripe vars
  let cardElement;
  let cardErrors;
  let card;
  let stripe;
  let elements;

  // is Empty
  $: isEmpty = !name || $globalStore.alert;

  onMount(() => {
    if (!$user.jwt) {
      navigate("/");
      return;
    }
    if ($cartTotal > 0) {
      stripe = Stripe("pk_test_0bvCzd3VvVEJHubF4S5bR93v00vMM5hJTs");
      elements = stripe.elements();
      card = elements.create("card");
      card.mount(cardElement);
      card.addEventListener("change", function(event) {
        if (event.error) {
          cardErrors.textContent = event.error.message;
        } else {
          cardErrors.textContent = "";
        }
      });
    }
  });

  async function handleSubmit() {
    globalStore.toggleItem("alert", true, "submitting the order, please wait");
    let response = await stripe
      .createToken(card)
      .catch(error => console.log(error));
    const { token } = response;
    ///stripe token
    if (token) {
      const { id } = token;
      let order = await submitOrder({
        name,
        total: $cartTotal,
        items: $cart,
        stripeTokenId: id,
        userToken: $user.jwt
      });
      // console.log(order);
      if (order) {
        globalStore.toggleItem("alert", true, `your order of ${name}`);
        cart.set([]);
        localStorage.setItem("cart", JSON.stringify([]));
        navigate("/");
        return;
      } else {
        globalStore.toggleItem("alert", true, "there was an error", true);
      }
    } else {
    }
  }
</script>

{#if $cartTotal > 0}
  <section class="form">
    <h2 class="section-title">Checkout</h2>
    <form class="checkout-form" on:submit|preventDefault={handleSubmit}>
      <h3>orderm total : {$cartTotal}</h3>
      <!--name input-->
      <div class="form-control">
        <label for="name">name</label>
        <input type="text" id="name" bind:value={name} />
      </div>

      <!--stripe-->
      <div class="stripe-input">
        <label for="card-element">Credit or Debit Card</label>
        <p class="stripe-info">
          testing this credit card:
          <span>4242 4242 4242 4242</span>
          <br />
          enter any 5 digits for the zip code
          <br />
          enter 3 digit for any cvc
        </p>
        <div id="card-element" bind:this={cardElement} />
        <div id="card-errors" bind:this={cardErrors} role="alert" />
      </div>
      <!--end sripte-->

      {#if isEmpty}
        <p class="form-empty">Pleas fill out name field</p>
      {/if}
      <button
        type="submit"
        class="btn btn-block btn-primary"
        disabled={isEmpty}
        class:disabled={isEmpty}>
        Submit
      </button>
    </form>
  </section>
{:else}
  <div class="checkout-empty">
    <h2>Your cart is empty</h2>
    <a href="/products" use:link class="btn btn-primary">Fill it</a>
  </div>
{/if}
