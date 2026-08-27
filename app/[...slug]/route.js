import { renderPage, addBootstrap } from "../../lib/proxy";

export const dynamic = "force-dynamic";

// Catch-all for every page that has no Skilly embed of its own. Next matches
// the explicit segments first, so the homepage, Contact Us and Get Help keep
// their own routes. Without this, any link the nav offers falls through to a
// 404 and the replica looks like a single page.
export async function GET(request, { params }) {
  const { slug } = await params;

  return renderPage({
    request,
    path: slug.join("/"),
    transform: addBootstrap,
  });
}
