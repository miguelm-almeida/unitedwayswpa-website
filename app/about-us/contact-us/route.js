import {
  renderPage,
  addBootstrap,
  addIframe,
  addNavSearch,
  hideChatBubble,
} from "../../../lib/proxy";

export const dynamic = "force-dynamic";

export async function GET(request) {
  return renderPage({
    request,
    path: "about-us/contact-us",
    transform: (html) =>
      hideChatBubble(
        addNavSearch(addIframe(addBootstrap(html), '<div class="form">')),
      ),
  });
}
