import {
  renderPage,
  addBootstrap,
  addIframe,
  addCtaTrigger,
} from "../../lib/proxy";

export const dynamic = "force-dynamic";

// The iframe is standalone, but the bootstrap still loads here so the chat
// bubble stays present on every page of the site.
export async function GET() {
  return renderPage({
    path: "get-help",
    transform: (html) =>
      addCtaTrigger(
        addIframe(addBootstrap(html), '<div class="card-grid card-grid--icons'),
      ),
  });
}
