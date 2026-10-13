import {
  renderPage,
  addBootstrap,
  addSearchBar,
  addNavSearch,
} from "../lib/proxy";

export const dynamic = "force-dynamic";

export async function GET(request) {
  return renderPage({
    request,
    path: "",
    transform: (html) =>
      addNavSearch(addSearchBar(addBootstrap(html), '<div class="page-intro">')),
  });
}
