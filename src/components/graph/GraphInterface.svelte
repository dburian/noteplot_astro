<script>
  import Separator from "./Separator.svelte";
  import Graph from "./Graph.svelte";
  import { onMount } from "svelte";

  function extractState(url) {
    const breadcrumbs = url.pathname.slice(1).split("/");

    if (breadcrumbs.length == 0) {
      return { inGraph: false, noteId: null };
    } else if (breadcrumbs[0] == "graph") {
      if (breadcrumbs.length == 1) {
        return { inGraph: true, noteId: null };
      } else {
        return { inGraph: true, noteId: breadcrumbs.slice(1).join("/") };
      }
    } else if (breadcrumbs[0] == "notes") {
      return { inGraph: false, noteId: breadcrumbs.join("/") };
    }

    return { inGraph: false, noteId: null };
  }

  export let nodes;
  export let links;
  export let viewBox;
  export let renderedUrl;

  console.log({ renderedUrl });
  let urlState = extractState(renderedUrl);


  let widthStyle = "";
  if (!urlState.inGraph) {
    widthStyle = "width: 0px; min-width: 0px; flex: none";
  }
</script>

<div class="graph-container h-screen flex-1 min-w-[60%]" style={widthStyle}>
  <Graph {nodes} {links} {viewBox} {urlState} />
</div>
<Separator {urlState} />
