<script>
  import * as d3 from "d3";
  import {onMount} from 'svelte';

  export let notes;
  export let references;

  const nodeRadius = 2;
  let dots = [];
  let lines = [];

  let zoomableContainer;
  let svgTag;

  let worker;
  let loadingState = 0;

  onMount(() => {
    worker = new Worker(
      new URL('./graph_worker_script.js', import.meta.url),
      {type: 'module'}
    );
    worker.onmessage = (m) => {
      const {type, ...rest} = m.data;

      switch (type) {
        case 'tick':
          loadingState = rest.progress;
          return
        case 'end':
          dots = rest.nodes;
          lines = rest.links;
          console.log(dots);
          console.log(lines);
      }
    };

    const links = [];
    const nodes = notes.map(n => ({...n}));

    for (const ref of references) {
      const source = nodes.findIndex(node => ref.from == node.id);
      const target = nodes.findIndex(node => ref.to == node.id);

      if (target != -1 && source !== -1) {
        links.push({ source, target });
      }
    }

    console.log('calling worker')
    worker.postMessage({nodes, links});


    return () => worker.terminate()
  })

  const redraw = () => {
    // Create the SVG container.
    const contentContainer = d3.select(zoomableContainer)

    const zoomBehavior = d3.zoom()
      .scaleExtent([1, 50])
      .translateExtent([[0, 0], [1000, 1000]])
      .on("zoom", zoomed)
    d3.select(svgTag).call(zoomBehavior)

    function zoomed(event) {
        const transform = event.transform;
        contentContainer.attr("transform", transform);

//        const nodes = contentContainer.select("g");
//        if (transform.k > 3) {
//          nodes.select("text").html(d => d.name)
//        } else {
//          nodes.select("text").html("")
//        }
    }

    return () => simulation.stop();
  }

</script>

<h1>{loadingState}</h1>
<svg bind:this={svgTag} width="100%" height='100%' viewBox="0 0 1000 1000" class="svgGraph">
  <g bind:this={zoomableContainer}>
    {#each dots as dot}
      <g transform={`translate(${dot.x}, ${dot.y})`}>
        <circle r={nodeRadius} fill="black" style="cursor: pointer" />
        <text class="node-text" x={nodeRadius + 1} y={nodeRadius/2} fill='darkblue' />
      </g>
    {/each}
    {#each lines as line}
      <line
        stroke-width="0.1"
        stroke='black'
        x1={line.source.x}
        y1={line.source.y}
        x2={line.target.x}
        y2={line.target.y}
      />
    {/each}
  </g>
</svg>

<style>
.svgGraph {
  background: lightyellow;
  cursor: crosshair;
}

.node-text {
  font-size: 0.2em;
  font-style: italic;
  font-family: sans;
}
</style>
