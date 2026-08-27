import { renderPage, addBootstrap, addSearchBar } from "../../../lib/proxy";

export const dynamic = "force-dynamic";

export async function GET(request) {
  return renderPage({
    request,
    path: "about-us/contact-us",
    transform: (html) => addSearchBar(addBootstrap(html), '<div class="form">'),
  });
}
