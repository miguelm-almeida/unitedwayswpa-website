import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const SHARE_ID = "f92e9um8a1";
const WIDGET_SRC = "https://d36ewmyb2wrx29.cloudfront.net/index.js";
const ORIGIN = "https://unitedwayswpa.org";
const PROXY_ORIGIN = "https://unitedwayswpa-org.translate.goog";

const SCRIPT_TAG = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
const PAGE_LINK = new RegExp(`(<a\\b[^>]*?href=")${ORIGIN}([^"]*)"`, "gi");
const ASSET_PATH = /\/wp-content\/|\.[a-z0-9]{2,4}(?:$|[?#])/i;
const SEARCH_ITEM = /<li class="nav__item nav__item--search">[\s\S]*?<\/li>/;

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

// The <base> tag above keeps stylesheets and images loading from the real
// origin, but it also drags every <a> along with it, so navigation escapes the
// replica on the first click. Anchors are therefore rewritten to absolute
// localhost URLs — a root-relative path would still resolve against <base>.
// Downloads and other file links are left pointing at the real origin, since
// the proxy only knows how to serve HTML.
function localizeLinks(html, origin) {
  return html.replace(PAGE_LINK, (match, prefix, path) =>
    ASSET_PATH.test(path) ? match : `${prefix}${origin}${path || "/"}"`,
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
  // Every dimension the widget writes inline is restated at 2x native
  // (80% of the previous 2.5x hero scale: 400x48 pill, 8px radius, 1px
  // border, 14px text, 22px glyph).
  const styles = `<style>
#skl_id_search_hero_section{margin:56px auto;padding:0 20px}
#skl_id_search_hero_section .input-container{width:min(800px,100%)!important;max-width:none!important;height:96px!important;margin:0 auto;border-width:2px!important;border-radius:16px!important;padding:0 28px 0 4px!important;box-sizing:border-box!important}
#skl_id_search_hero_section .input-container input{height:auto!important;max-height:100%!important;padding:0 0 0 20px!important;margin-right:20px!important;font-size:28px!important;background:transparent!important;border:0!important;box-sizing:border-box!important}
#skl_id_search_hero_section .send-button{display:flex!important;align-items:center;justify-content:center;height:auto!important;width:auto!important;padding:0!important}
#skl_id_search_hero_section .send-button svg{width:44px!important;height:44px!important}
@media(max-width:850px){#skl_id_search_hero_section .input-container{height:67px!important;border-radius:11px!important;padding:0 16px 0 3px!important}#skl_id_search_hero_section .input-container input{font-size:19px!important;padding:0 0 0 13px!important;margin-right:13px!important}#skl_id_search_hero_section .send-button svg{width:30px!important;height:30px!important}}
</style>`;

  return html.replace(anchor, `${styles}${searchBar}${anchor}`);
}

// Takes over the utility bar's own Search link. The compact variant mounts on
// skl_id_search, and the widget renders it without the hero-input class the
// body bar gets, so the two need separate rules.
//
// The site's global [type=text] rule catches this input as well, and at the
// nav bar's smaller height it would overflow and paint white over the border,
// so the same height/background/border reset is repeated here.
function addNavSearch(html) {
  if (!SEARCH_ITEM.test(html)) {
    return html;
  }

  const mount = `<li class="nav__item nav__item--search"><div id="skl_id_search" chat_id="${SHARE_ID}" isHero="false"></div></li>`;
  // The utility row is only ~40px tall, so the bar is kept at the widget's
  // minimum renderable height and the row's own 8px top padding is dropped to
  // stop the header growing. Below 1280px the whole header collapses into the
  // hamburger and the item stacks full width with the other links.
  const styles = `<style>
#skl_id_search{display:flex;align-items:center;min-height:40px;flex:0 1 230px;min-width:170px}
#skl_id_search .input-container{width:100%!important;max-width:none!important;height:40px!important;margin:0!important;border-radius:6px!important;padding:0 10px 0 4px!important;box-sizing:border-box!important}
#skl_id_search .input-container input{height:auto!important;max-height:100%!important;padding:0 0 0 8px!important;margin-right:8px!important;font-size:14px!important;background:transparent!important;border:0!important;box-sizing:border-box!important}
#skl_id_search .send-button{display:flex!important;align-items:center;justify-content:center;height:auto!important;width:auto!important;padding:0!important}
#skl_id_search .send-button svg{width:20px!important;height:20px!important}
@media(min-width:1280px){.nav--secondary .nav__list:not(.nav__list--buttons){align-items:center;padding-top:0}.nav--secondary .nav__list:not(.nav__list--buttons) .nav__link{white-space:nowrap}.nav--secondary .nav__item--search{margin-left:4px}}
@media(max-width:1279px){#skl_id_search{width:100%;padding:0 20px 12px;box-sizing:border-box}}
</style>`;

  return html
    .replace(SEARCH_ITEM, mount)
    .replace("</head>", `${styles}</head>`);
}

// Get Help already embeds the full panel inline, so the floating launcher is
// redundant there. The bootstrap still has to load on that page — the nav CTA
// calls the widget's openIframe() — so the button is hidden rather than the
// script removed.
function hideChatBubble(html) {
  const styles = `<style>.open-iframe-btn{display:none!important}</style>`;

  return html.replace("</head>", `${styles}</head>`);
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

// The upstream is Google's translate proxy, which rate-limits hard: browsing
// the replica normally is enough to earn a 429 within a few minutes. Each page
// is therefore fetched once and kept on disk, and the directory is committed so
// a deploy serves entirely from it. Delete page-cache to re-pull.
const CACHE_DIR = join(process.cwd(), "page-cache");

function cacheFile(path) {
  const name = createHash("sha1").update(path).digest("hex");
  return join(CACHE_DIR, `${name}.html`);
}

async function readCache(file) {
  try {
    return await readFile(file, "utf8");
  } catch {
    return null;
  }
}

// Serverless filesystems are read-only, so a rejected write is the norm there
// rather than an error worth surfacing: the page is still served, just not
// cached. Letting it throw takes down the whole response with a 500.
async function writeCache(file, html) {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(file, html);
  } catch {}
}

async function fetchSource(path) {
  const file = cacheFile(path);
  const cached = await readCache(file);

  if (cached !== null) {
    return { html: cached };
  }

  let status = 0;

  for (const backoff of [0, 1500, 4000]) {
    if (backoff) await new Promise((done) => setTimeout(done, backoff));

    let response;

    try {
      response = await fetch(sourceUrl(path), {
        cache: "no-store",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140 Safari/537.36",
        },
      });
    } catch {
      status = 504;
      continue;
    }

    if (response.ok) {
      const html = await response.text();
      await writeCache(file, html);

      return { html };
    }

    status = response.status;
    if (status !== 429) break;
  }

  return { status };
}

export async function renderPage({ request, path = "", transform }) {
  const source = await fetchSource(path);

  if (!source.html) {
    const retry = source.status === 429 ? " Upstream is rate-limiting." : "";

    return new Response(`Source website returned ${source.status}.${retry}`, {
      status: source.status === 404 ? 404 : 502,
    });
  }

  let html = source.html;
  html = removeTranslationScripts(html);
  html = makeOriginalAssetsResolvable(html);
  html = transform(html);
  html = localizeLinks(html, new URL(request.url).origin);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export {
  addBootstrap,
  addSearchBar,
  addNavSearch,
  addIframe,
  addCtaTrigger,
  hideChatBubble,
};
