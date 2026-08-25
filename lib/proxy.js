const SHARE_ID = "f92e9um8a1";
const WIDGET_SRC = "https://d36ewmyb2wrx29.cloudfront.net/index.js";
const ORIGIN = "https://unitedwayswpa.org";
const PROXY_ORIGIN = "https://unitedwayswpa-org.translate.goog";

const SCRIPT_TAG = /<script\b[^>]*>[\s\S]*?<\/script>/gi;

function sourceUrl(path) {
  return `${PROXY_ORIGIN}/${path}?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en`;
}

function removeTranslationScripts(html) {
  return html.replace(SCRIPT_TAG, (script) => {
    const isTranslationCode =
      script.includes("translate_http") ||
      script.includes("google-translate") ||
      script.includes("initProtoFlow") ||
      script.includes("_x_tr_") ||
      script.includes("data-proxy-url");

    return isTranslationCode ? "" : script;
  });
}

function makeOriginalAssetsResolvable(html) {
  return html
    .replace(/<base\b[^>]*>/gi, "")
    .replace("<head>", `<head><base href="${ORIGIN}/">`)
    .replace(/\?_x_tr_sl=auto(?:&amp;|&)_x_tr_tl=en(?:&amp;|&)_x_tr_hl=en/g, "")
    .replaceAll(PROXY_ORIGIN, ORIGIN)
    .replace(
      /<link[^>]+fonts\.googleapis\.com\/css2\?family=Material\+Symbols[^>]*>/gi,
      "",
    );
}

// window.chatConfig has to be evaluated before index.js, and index.js may only
// run once per document.
//
// index.js is loaded at the end of <body> rather than in <head> on purpose. Its
// observeChatInput() runs synchronously on execution and calls
// MutationObserver.observe() on the search mount. From <head> that mount does
// not exist yet, so it throws and the search bar never renders — the bubble
// still appears, which makes the failure look like a styling problem.
function addBootstrap(html) {
  const config = `<script>window.chatConfig={chatId:"${SHARE_ID}",env:"skl"};</script>`;
  const widget = `<script src="${WIDGET_SRC}"></script>`;

  return html
    .replace("</head>", `${config}</head>`)
    .replace("</body>", `${widget}</body>`);
}

// The widget resolves its mount element once and never re-scans, so the div has
// to be in the served HTML rather than added later from the client.
function addSearchBar(html, anchor) {
  const searchBar = `<div id="skl_id_search_hero_section" chat_id="${SHARE_ID}" isHero="true"></div>`;

  // The widget sizes, shapes and colours the bar itself from the guide's
  // Appearance settings, writing them inline. The host page only positions it —
  // overriding border, height, flex-direction or the button fill here is what
  // makes the live bar diverge from the preview in the Skilly deploy dialog.
  // The site's global form rule ([type=text] { height:48px; background:#fff })
  // also catches the widget's input. Since the bar is 48px too, the input
  // overflows its content box and paints white over the top and bottom of the
  // bar's border, leaving only the rounded ends visible.
  const styles = `<style>
#skl_id_search_hero_section{margin:56px auto;padding:0 20px}
#skl_id_search_hero_section .input-container{margin:0 auto}
#skl_id_search_hero_section .input-container input{height:auto!important;max-height:100%!important;padding:0 0 0 10px!important;background:transparent!important;border:0!important;box-sizing:border-box!important}
</style>`;

  return html.replace(anchor, `${styles}${searchBar}${anchor}`);
}

function addIframe(html, anchor) {
  const iframe = `<div class="skilly-wrapper"><iframe src="https://skillbuilder.io/external-ai-chat/${SHARE_ID}" title="Ask skilly" frameborder="0"></iframe></div>`;
  const styles = `<style>.skilly-wrapper{position:relative;width:min(1400px,calc(100% - 80px));height:calc(90vh - 25px);margin:0 auto 72px}.skilly-wrapper iframe{position:absolute;top:0;left:0;width:100%;height:100%}@media(max-width:850px){.skilly-wrapper{width:calc(100% - 40px)}}</style>`;

  return html.replace(anchor, `${styles}${iframe}${anchor}`);
}

// Only the Get Help link is rewired. Pointing the donation links at the panel
// would swallow navigation the site depends on.
function addCtaTrigger(html) {
  return html.replaceAll(
    `<a href="${ORIGIN}/get-help/" class="nav__link nav__link--button " target="">`,
    `<a href="${ORIGIN}/get-help/" class="nav__link nav__link--button " target="" onclick="event.preventDefault();openIframe()">`,
  );
}

export async function renderPage({ path = "", transform }) {
  const response = await fetch(sourceUrl(path), {
    cache: "no-store",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140 Safari/537.36",
    },
  });

  if (!response.ok) {
    return new Response("Unable to load the source website.", { status: 502 });
  }

  let html = await response.text();
  html = removeTranslationScripts(html);
  html = makeOriginalAssetsResolvable(html);
  html = transform(html);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export { addBootstrap, addSearchBar, addIframe, addCtaTrigger };
