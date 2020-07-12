<script>
import loginUser from "../strapi/loginUser";
import registerUser from "../strapi/registerUser"
import {navigate} from "svelte-routing"
import globalStore from "../stores/globalStore.js"

let email = "";
let password = "";
let username  = "default username";
let isMember = true;
$: isEmpty = !email || !password || !username || $globalStore.alert;

function toggleMember () {
isMember = !isMember;
let user;
 if (!isMember) {
     username = "";
 } else {
     username = "default username";

 }

}
async function handleSubmit () {
   
   globalStore.toggleItem("alert",true,"Loading data ,,,pls wait")
    let user;
  if(isMember) {
   user = await loginUser({email,password});
  }
  else {
   user = await registerUser({email,password,username});
  }
//   console.log(user);
  if (user) {
    navigate('/products');
    globalStore.toggleItem("alert",true,"welcome to our shop")
    return;
  }
    globalStore.toggleItem("alert",true,"wrong credential, pls try again",true)

}


</script>

<section class="form">
<h2 class="section-title">
{#if isMember}signin {:else} register {/if}
</h2>
<form class="login-form" on:submit|preventDefault={handleSubmit}>
<div class="form-control">
<label for="email">email</label>
<input type="email" id="email" bind:value={email}>
</div>
<div class="form-control">
<label for="password">password</label>
<input type="password" id="password" bind:value={password}>
</div>
{#if !isMember}
<div class="form-control">
<label for="username">username</label>
<input type="text" id="username" bind:value={username}>
</div>
{/if}
{#if isEmpty}
<p class="form-empty">Please fill in all information</p>
{/if}
<button type="submit" class="btn btn-block" disable={isEmpty} class:disable={isEmpty} >
submit
</button>
{#if isMember}
<p class="register-link">
need to register
<button type="button" on:click={toggleMember}>click here</button>
</p>
{:else}
<p class="register-link">
alredy member ?
<button type="button" on:click={toggleMember}>click here</button>
</p>
{/if}
</form>

</section>