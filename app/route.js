import { renderPage, addBootstrap, addCtaTrigger } from "../lib/proxy";

export const dynamic = "force-dynamic";

// Per UW feedback the homepage carries no visible search embed: the bootstrap
// only brings the bottom-right chat bubble, and the header keeps the site's
// own Search link.
export async function GET(request) {
  return renderPage({
    request,
    path: "",
    transform: (html) => addCtaTrigger(addBootstrap(html)),
  });
}
