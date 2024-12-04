import { readable } from "svelte/store";

export function extractState(url) {
  const breadcrumbs = url.pathname.slice(1).split("/")

  if (breadcrumbs.length == 0) {
    return {inGraph: false, noteId: null}
  } else if (breadcrumbs[0] == 'graph') {
    if (breadcrumbs.length == 1) {
      return {inGraph: true, noteId: null}
    } else {
      return {inGraph: true, noteId: breadcrumbs.slice(1).join('/')}
    }
  } else if (breadcrumbs[0] == 'notes') {
    return {inGraph: false, noteId: breadcrumbs.join('/')}
  }

  return {inGraph: false, noteId: null}
}

export function getUrlState(initUrl) {
  return readable(extractState(initUrl), (set) => {
    const onNavigate = (event) => {
      set(extractState(event.destination.url))
    }

    if (typeof window != "undefined") {
      window.navigation.addEventListener("navigate", onNavigate)
    }

    return () => {
      if (typeof window != "undefined") {
        window.navigation.removeEventListener("navigate", onNavigate)
      }
    };

  });
}

