<script>
  import {navigate} from "astro:transitions/client";
  export let urlState;

</script>

<div class="h-screen grid auto-rows-max gap-y-4 m-4">
  <div class="sep-button sep-close" on:click={() => navigate('/graph')}>x</div>
  {#if !urlState.inGraph}
    <div class="sep-button" on:click={() => navigate(`/graph/${urlState.noteId}`)}>&gt;</div>
  {/if}
  {#if urlState.inGraph}
    <div class="sep-button" on:click={() => navigate(`/${urlState.noteId}`)}>&lt;</div>
  {/if}
  <div class="sep-button sep-slider">&lt;-&gt;</div>
</div>

<style>
.sep-button {
  width: 40px;
  height: 40px;
  display: grid;
  align-content: center;
  cursor: pointer;
  text-align: center;
  background: black;
  color: white;
  font-weight: bold;
  z-index: 10;
  user-select:none;
}

.sep-button:hover,.sep-hover {
  color: black;
  background: white;
  border: 2px solid black;
}
.sep-slider {
}
</style>


