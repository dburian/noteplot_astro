<script>
  import * as d3 from "d3";
  import {onMount} from 'svelte';

  export let nodes;
  export let links;

  let zoomableContainer;
  let svgTag;

  onMount(() => {
    redraw();
  })

  const redraw = () => {
    console.log('redrawing')

    const dots = nodes.map(node => ({...node}));
    let lines = []

    for (const link of links) {
      const source = dots.findIndex(dot => link.from == dot.id);
      const target = dots.findIndex(dot => link.to == dot.id);

      if (target != -1 && source !== -1) {
        lines.push({ source, target });
      }
    }

    d3.select(zoomableContainer).html(null);

    // Create a simulation with several forces.
    const simulation = d3.forceSimulation(dots)
      .force("link", d3.forceLink(lines).strength(1))
      .force("charge", d3.forceManyBody(-1).distanceMax(300))
      .force("center", d3.forceCenter(500, 500))
      .on("tick", ticked);

    // Create the SVG container.
    const contentContainer = d3.select(zoomableContainer)

    const node = contentContainer.append("g")
      .selectAll()
      .data(dots)
      .join("g")

    node.append("circle")
      .attr("r", 2)
      .attr("fill", 'black')
      .attr("style", "cursor: pointer")
    node.append("text")
      .attr("style", "font-size: 0.2em; font-style: italic; font-family: sans")
      .attr("x", 4)
      .attr("y", 1.5)
      .attr("fill", "darkblue")

    // Add a line for each link, and a circle for each node.
    const link = contentContainer.append("g")
        .attr("stroke", "black")
      .selectAll()
      .data(lines)
      .join("line")
        .attr("stroke-width", 0.1)
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);


    const zoomBehavior = d3.zoom()
      .scaleExtent([1, 50])
      .translateExtent([[0, 0], [1000, 1000]])
      .on("zoom", zoomed)
    d3.select(svgTag).call(zoomBehavior)

    function ticked() {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

      node
        .attr("transform", d=> `translate(${d.x}, ${d.y})`)
    }

    function zoomed(event) {
        const transform = event.transform;
        contentContainer.attr("transform", transform);

        if (transform.k > 3) {
          node.select("text").html(d => d.name)
        } else {
          node.select("text").html("")
        }
    }

    return () => simulation.stop();
  }

</script>

<svg bind:this={svgTag} width="100%" height='100%' viewBox="0 0 1000 1000" class="svgGraph">
  <g bind:this={zoomableContainer} />
</svg>

<style>
.svgGraph {
  background: lightyellow;
  cursor: crosshair;
}
</style>
