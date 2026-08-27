import {
  renderPage,
  addBootstrap,
  addSearchBar,
  addChatCard,
} from "../../lib/proxy";

export const dynamic = "force-dynamic";

// The bar goes in ahead of .content rather than inside it: the page's own copy
// sits in a narrow reading column, and mounting there would squeeze the bar
// well below the width it has on the rest of the site.
export async function GET(request) {
  return renderPage({
    request,
    path: "get-help",
    transform: (html) =>
      addChatCard(addSearchBar(addBootstrap(html), '<div class="content">')),
  });
}
