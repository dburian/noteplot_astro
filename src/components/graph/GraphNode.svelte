<script>
  export let node;
  export let zoomCoef;

  let hover = false;

  const normalRadius = 2
  $: radius = hover ? normalRadius * 1.2 : normalRadius;
</script>

<g transform={`translate(${node.x}, ${node.y})`}>
  <a href={`/graph/${node.id}`}>
    <circle
      r={radius}
      fill="black"
      style="cursor: pointer"
      on:pointerenter={(_) => {hover = true}}
      on:pointerleave={(_) => {hover = false;}}
    />
  </a>
  <text
    class='node-text'
    x={radius * 1.1}
    dominant-baseline="middle"
    fill='darkblue'
    font-size={8 * 1/zoomCoef}
  >
    {#if zoomCoef > 2.5 || hover}
      {node.title}
    {/if}
  </text>
</g>

<style>
.node-text {
  font-style: italic;
  font-family: sans;
}
</style>
