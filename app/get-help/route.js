import {
  renderPage,
  addBootstrap,
  addIframe,
  hideChatBubble,
} from "../../lib/proxy";

export const dynamic = "force-dynamic";

// The inline panel already fills this page, so the floating launcher would be
// redundant here and is hidden. Only on this page.
export async function GET(request) {
  return renderPage({
    request,
    path: "get-help",
    transform: (html) =>
      hideChatBubble(
        addIframe(addBootstrap(html), '<div class="card-grid card-grid--icons'),
      ),
  });
}
