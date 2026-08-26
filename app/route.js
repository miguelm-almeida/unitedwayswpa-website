import {
  renderPage,
  addBootstrap,
  addSearchBar,
  addNavSearch,
  addCtaTrigger,
} from "../lib/proxy";

export const dynamic = "force-dynamic";

export async function GET(request) {
  return renderPage({
    request,
    path: "",
    transform: (html) =>
      addNavSearch(
        addCtaTrigger(
          addSearchBar(addBootstrap(html), '<div class="page-intro">'),
        ),
      ),
  });
}
