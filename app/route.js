import {
  renderPage,
  addBootstrap,
  addHeroSearch,
  addNavSearch,
} from "../lib/proxy";

export const dynamic = "force-dynamic";

export async function GET(request) {
  return renderPage({
    request,
    path: "",
    transform: (html) =>
      addNavSearch(addHeroSearch(addBootstrap(html))),
  });
}
