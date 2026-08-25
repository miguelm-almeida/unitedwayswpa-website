import {
  renderPage,
  addBootstrap,
  addSearchBar,
  addCtaTrigger,
} from "../../../lib/proxy";

export const dynamic = "force-dynamic";

export async function GET() {
  return renderPage({
    path: "about-us/contact-us",
    transform: (html) =>
      addCtaTrigger(addSearchBar(addBootstrap(html), '<div class="form">')),
  });
}
