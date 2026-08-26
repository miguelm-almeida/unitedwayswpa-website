import {
  renderPage,
  addBootstrap,
  addIframe,
  addNavSearch,
  addCtaTrigger,
  hideChatBubble,
} from "../../lib/proxy";

export const dynamic = "force-dynamic";

// The iframe is standalone, but the bootstrap still loads here so the nav CTA
// keeps working. Only the floating bubble is suppressed, and only on this page.
export async function GET(request) {
  return renderPage({
    request,
    path: "get-help",
    transform: (html) =>
      hideChatBubble(
        addNavSearch(
          addCtaTrigger(
            addIframe(
              addBootstrap(html),
              '<div class="card-grid card-grid--icons',
            ),
          ),
        ),
      ),
  });
}
