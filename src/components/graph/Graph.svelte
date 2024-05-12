<script>
  import * as d3 from "d3";
  import {onMount} from 'svelte';
  import GraphNode from "./GraphNode.svelte";

  export let nodes;
  export let links;
  export let viewBox;

  const viewBoxWidth = viewBox[2] - viewBox[0];
  const viewBoxHeight = viewBox[3] - viewBox[1];
  const adjustedViewBox = [
    viewBox[0] - 0.1 * viewBoxWidth,
    viewBox[1] - 0.1 * viewBoxHeight,
    viewBox[2] + 0.2 * viewBoxWidth,
    viewBox[3] + 0.2 * viewBoxHeight
  ];

  let maxX = 0;
  let maxY = 0;

  for (const node of nodes) {
    maxX = Math.max(node.x, maxX);
    maxY = Math.max(node.y, maxY);
  }
  console.log({viewBox, adjustedViewBox, maxX, maxY});

  let transform = '';
  let zoomCoef = 1;

  let svgTag;


  onMount(() => {
    addZoom();
  })

  const addZoom = () => {
    const zoomBehavior = d3.zoom()
      .scaleExtent([1, 10])
      //.translateExtent([viewBox.slice(0, 2), viewBox.slice(2, 4)])
      .on("zoom", zoomed)
    d3.select(svgTag).call(zoomBehavior)

    function zoomed(event) {
        transform = `${event.transform}`;
        zoomCoef = event.transform.k;
    }
  }
</script>

<svg bind:this={svgTag} width="100%" height='100%' viewBox={adjustedViewBox.join(' ')} class="svgGraph">
  <g
    transform={transform}
    class="zoomableContainer"
  >
    {#each links as link}
      <line
        stroke-width="0.1"
        stroke='grey'
        x1={link.source.x}
        y1={link.source.y}
        x2={link.target.x}
        y2={link.target.y}
      />
    {/each}
    {#each nodes as node (node.id)}
      <GraphNode {node} {zoomCoef} />
    {/each}
  </g>
</svg>

<style>
.svgGraph {
  background: lightyellow;
  cursor: crosshair;
}

.zoomableContainer {
  overflow: visible;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}
</style>
