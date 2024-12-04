<script data-astro-rerun>
  export let message;
  let state = 1;
</script>

<h1>{state}</h1>
<p>{message}</p>
<button on:click={() => {state = state + 1}}>Increment</button>
