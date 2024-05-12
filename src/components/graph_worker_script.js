import * as d3 from "d3";

function computeForceSimulation(nodes, links) {
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).strength(1))
    .force("charge", d3.forceManyBody(-1).distanceMax(300))
    .force("center", d3.forceCenter(500, 500))
    .stop()

  const numberOfTicksTillEnd = Math.ceil(
    Math.log(simulation.alphaMin()) /
      Math.log(1 - simulation.alphaDecay())
  )
  for (let i = 0, n = numberOfTicksTillEnd; i < n; ++i) {
    postMessage({type: "tick", progress: i});
    simulation.tick();
  }

  postMessage({type: "end", nodes: nodes, links: links});
}

onmessage = (m) => {
  console.dir(m);
  const {nodes, links} = m.data;
  computeForceSimulation(nodes, links);
}
