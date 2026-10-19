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
const ICON_GRID = '<div class="card-grid card-grid--icons';
const CARD_CONTAINER = '<div class="card-grid__container">';

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

// The 100 Years mark is painted into the hero JPEG, so the homepage serves a
// copy with that square filled back in as the surrounding artwork. srcset has
// to go too, or the browser still picks a remote size. An absolute URL is
// required because <base> would send a root-relative path to the real origin.
function removeAnniversaryBadge(html, origin) {
  const src = `${origin}/hero-no-badge.jpg`;

  return html.replace(
    /<img\b[^>]*UW100_UWSW_Website_HeaderIMG_2_fx1\.jpg"[^>]*>/i,
    (tag) =>
      tag
        .replace(/\s(?:srcset|sizes)="[^"]*"/gi, "")
        .replace(/src="[^"]*"/i, `src="${src}"`),
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
  // The guide owns the placeholder, so the live text is written after the
  // widget mounts. Reapply whenever it does, including the compact header bar.
  const placeholder = `<script>(function(){var TEXT="Find local resources with our AI assistant.";function apply(){document.querySelectorAll("#skl_id_search input,#skl_id_search_hero_section input").forEach(function(input){if(input.getAttribute("placeholder")!==TEXT)input.setAttribute("placeholder",TEXT);});}apply();new MutationObserver(apply).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["placeholder"]});})();</script>`;

  return html
    .replace("</head>", `${config}${SEARCH_THEME}</head>`)
    .replace("</body>", `${widget}${placeholder}</body>`);
}

// United Way skin for every Skilly bar, so it reads as part of the site rather
// than a third-party embed. Tokens come from the site's own stylesheet: navy
// #21296b (headlines), royal #0044b5 (nav links), yellow #ffb900 and Palanquin
// body type. Corners are even on all four sides.
// The yellow tile is the site's sun mark colour; navy on yellow is ~9:1, and
// the focus ring reuses it so keyboard focus shows against the blue hero art.
// The widget's glyph is a magnifier with a sparkle. Both paths are hidden and
// the svg box is masked to a plain glass whose handle is a bit thicker than
// the widget's, so the leg reads at this size. The mask is white so it works
// as a luminance mask; the svg background is the ink and flips on hover.
// Size and spacing stay in addSearchBar/addNavSearch; only paint lives here.
const SEARCH_GLYPH = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><circle cx="10.4" cy="10.4" r="7.55" fill="none" stroke="white" stroke-width="1.55"/><line x1="16.29" y1="16.29" x2="20.05" y2="20.05" stroke="white" stroke-width="2.45" stroke-linecap="round"/></svg>`,
)}`;
const SEARCH_THEME = `<style>
#skl_id_search_hero_section .input-container,#skl_id_search .input-container{background:#fff!important;border:2px solid #21296b!important;border-radius:8px!important;font-family:palanquin,sans-serif!important;transition:border-color .15s ease,box-shadow .15s ease}
#skl_id_search_hero_section .input-container:hover,#skl_id_search .input-container:hover{border-color:#0044b5!important}
#skl_id_search_hero_section .input-container:focus-within,#skl_id_search .input-container:focus-within{border-color:#0044b5!important;box-shadow:0 0 0 4px #ffb900!important}
#skl_id_search_hero_section .input-container input,#skl_id_search .input-container input{color:#21296b!important;font-family:palanquin,sans-serif!important;font-weight:600!important;letter-spacing:0!important;--placeholder-color:#21296b!important;outline:0!important}
#skl_id_search_hero_section .input-container input::placeholder,#skl_id_search .input-container input::placeholder{color:#21296b!important;opacity:.8}
#skl_id_search_hero_section .send-button,#skl_id_search .send-button{flex:none!important;background:#ffb900!important;border:0!important;border-radius:6px!important;cursor:pointer;transition:background-color .15s ease}
#skl_id_search .send-button{border-radius:5px!important}
#skl_id_search_hero_section .send-button svg path,#skl_id_search .send-button svg path{display:none!important}
#skl_id_search_hero_section .send-button svg,#skl_id_search .send-button svg{background:#21296b!important;-webkit-mask:url("${SEARCH_GLYPH}") center/contain no-repeat;mask:url("${SEARCH_GLYPH}") center/contain no-repeat;transition:background-color .15s ease}
#skl_id_search_hero_section .send-button:hover,#skl_id_search .send-button:hover{background:#21296b!important}
#skl_id_search_hero_section .send-button:hover svg,#skl_id_search .send-button:hover svg{background:#fff!important}
</style>`;

// The widget resolves its mount element once and never re-scans, so the div has
// to be in the served HTML rather than added later from the client.
function addSearchBar(html, anchor) {
  const searchBar = `<div id="skl_id_search_hero_section" chat_id="${SHARE_ID}" isHero="true"></div>`;

  // The widget sizes, shapes and colours the bar itself from the guide's
  // Appearance settings, writing them inline. Colour, border and corners are
  // overridden by SEARCH_THEME, so the live bar no longer matches the preview in
  // the Skilly deploy dialog; flex-direction is still left to the widget.
  // The site's global form rule ([type=text] { height:48px; background:#fff })
  // also catches the widget's input. Since the bar is 48px too, the input
  // overflows its content box and paints white over the top and bottom of the
  // bar's border, leaving only the rounded ends visible.
  // Every dimension the widget writes inline is restated here. The icon is a
  // fixed square tile inset evenly from the bar's top, bottom and leading edge.
  const styles = `<style>
#skl_id_search_hero_section{margin:56px auto;padding:0 20px}
#skl_id_search_hero_section .input-container{width:min(800px,100%)!important;max-width:none!important;height:88px!important;margin:0 auto;padding:0 28px 0 10px!important;box-sizing:border-box!important}
#skl_id_search_hero_section .input-container input{height:auto!important;max-height:100%!important;padding:0 0 0 14px!important;margin-right:0!important;font-size:24px!important;background:transparent!important;border:0!important;box-sizing:border-box!important}
#skl_id_search_hero_section .send-button{display:flex!important;align-items:center;justify-content:center;height:64px!important;width:64px!important;padding:0!important}
#skl_id_search_hero_section .send-button svg{width:32px!important;height:32px!important}
@media(max-width:850px){#skl_id_search_hero_section .input-container{height:64px!important;padding:0 16px 0 7px!important}#skl_id_search_hero_section .input-container input{font-size:16px!important;padding:0 0 0 10px!important}#skl_id_search_hero_section .send-button{height:46px!important;width:46px!important}#skl_id_search_hero_section .send-button svg{width:24px!important;height:24px!important}}
</style>`;

  return html.replace(anchor, `${styles}${searchBar}${anchor}`);
}

// Homepage only. The bar is the first child of the hero slider and then pulled
// out of flow. On desktop the yellow caption takes the top inset the bar used
// to have, and the bar drops to the caption's old bottom inset. Left offsets
// stay put, so the caption remains on the left and the bar keeps its x.
function addHeroSearch(html) {
  const anchor = '<div class="js-slider__container">';

  if (!html.includes("js-slider--hero") || !html.includes(anchor)) {
    return addSearchBar(html, '<div class="page-intro">');
  }

  const overlay = `<style>
.js-slider--hero{position:relative}
.js-slider--hero #skl_id_search_hero_section{position:absolute;z-index:5;left:50%;top:8px;transform:translateX(-50%);width:min(960px,calc(100% - 64px));margin:0!important;padding:0}
.js-slider--hero #skl_id_search_hero_section .input-container{background:#fff!important;width:100%!important;height:96px!important;margin:0!important;padding:0 28px 0 14px!important}
.js-slider--hero #skl_id_search_hero_section .input-container input{font-size:28px!important;padding:0 0 0 16px!important}
.js-slider--hero #skl_id_search_hero_section .send-button{height:68px!important;width:68px!important}
.js-slider--hero #skl_id_search_hero_section .send-button svg{width:34px!important;height:34px!important}
@media(min-width:1024px) and (max-width:1439px){.js-slider--hero #skl_id_search_hero_section{left:calc(550px + (100% - 550px) / 2);top:34%;transform:translate(-50%,-50%);width:min(680px,calc(100% - 590px))}.js-slider--hero #skl_id_search_hero_section .input-container input{font-size:22px!important}}
@media(max-width:1023px){.js-slider--hero #skl_id_search_hero_section{top:22%;width:min(720px,calc(100% - 40px));transform:translateX(-50%)}.js-slider--hero #skl_id_search_hero_section .input-container{height:72px!important;padding:0 20px 0 10px!important}.js-slider--hero #skl_id_search_hero_section .input-container input{font-size:20px!important;padding:0 0 0 12px!important}.js-slider--hero #skl_id_search_hero_section .send-button{height:52px!important;width:52px!important}.js-slider--hero #skl_id_search_hero_section .send-button svg{width:26px!important;height:26px!important}}
@media(min-width:1024px){
.js-slider--hero .figure__caption{top:120px!important;bottom:auto!important;height:auto!important}
.js-slider--hero #skl_id_search_hero_section{top:auto!important;bottom:72px!important;transform:translateX(-50%)!important}
}
</style>`;

  return addSearchBar(html, anchor).replace("</head>", `${overlay}</head>`);
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
  // Kept just above the widget's 40px minimum, with a few pixels of clearance
  // top and bottom so the border never meets the top edge of the page. The
  // row's own 8px top padding is dropped so that clearance is the only gap.
  // Below 1280px the whole header collapses into the hamburger and the item
  // stacks full width.
  const styles = `<style>
#skl_id_search{display:flex;align-items:center;min-height:42px;margin:5px 0;flex:0 1 460px;min-width:360px}
#skl_id_search .input-container{width:100%!important;max-width:none!important;height:42px!important;margin:0!important;padding:0 12px 0 4px!important;box-sizing:border-box!important}
#skl_id_search .input-container input{height:auto!important;max-height:100%!important;padding:0 0 0 10px!important;margin-right:0!important;font-size:15px!important;background:transparent!important;border:0!important;box-sizing:border-box!important}
#skl_id_search .send-button{display:flex!important;align-items:center;justify-content:center;height:30px!important;width:30px!important;padding:0!important}
#skl_id_search .send-button svg{width:18px!important;height:18px!important}
@media(min-width:1280px){.nav--secondary .nav__list:not(.nav__list--buttons){align-items:center;padding-top:0}.nav--secondary .nav__list:not(.nav__list--buttons) .nav__link{white-space:nowrap}.nav--secondary .nav__item--search{margin-left:4px}}
@media(max-width:1279px){#skl_id_search{width:100%;padding:0 20px 12px;box-sizing:border-box}}
</style>`;

  return html
    .replace(SEARCH_ITEM, mount)
    .replace("</head>", `${styles}</head>`);
}

// Walks div depth from an opening <div to find the index of the </div> that
// closes it. The card grid's container has no distinguishing closing markup, so
// there is nothing to match on textually.
function closingDivIndex(html, openIndex) {
  const tags = /<div\b|<\/div>/gi;
  tags.lastIndex = openIndex;

  let depth = 0;

  for (let tag = tags.exec(html); tag; tag = tags.exec(html)) {
    depth += tag[0][1] === "/" ? -1 : 1;

    if (depth === 0) {
      return tag.index;
    }
  }

  return -1;
}

// A third circle beside Call 211 and Visit southwest.pa211.org, appended to the
// grid the site already marks card-grid--3, so it inherits the existing column
// layout, heading font and hover transitions with no width overrides.
//
// The icon reuses the site's own --bg-yellow-light token rather than a literal
// hex, which is why that class has to sit last: the stylesheet selects it with
// [class$="--bg-yellow-light"], matching the end of the whole attribute.
function addChatCard(html) {
  const grid = html.indexOf(ICON_GRID);

  if (grid === -1) {
    return html;
  }

  const container = html.indexOf(CARD_CONTAINER, grid);
  const end = container === -1 ? -1 : closingDivIndex(html, container);

  if (end === -1) {
    return html;
  }

  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="201" height="200" viewBox="0 0 201 200" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M71 48H130A26 26 0 0 1 156 74V107A26 26 0 0 1 130 133H95L70 158L78 133H71A26 26 0 0 1 45 107V74A26 26 0 0 1 71 48ZM72 62H129A13 13 0 0 1 142 75V106A13 13 0 0 1 129 119H72A13 13 0 0 1 59 106V75A13 13 0 0 1 72 62Z" fill="white"/><circle cx="76" cy="90" r="9" fill="white"/><circle cx="100" cy="90" r="9" fill="white"/><circle cx="124" cy="90" r="9" fill="white"/></svg>`;

  // The href is a real fallback rather than "#": if the widget script is blocked
  // the card still reaches the chat in a new tab instead of doing nothing.
  const link = `<a href="https://skillbuilder.io/external-ai-chat/${SHARE_ID}" class="card__link" target="_blank" rel="noopener" onclick="if(typeof openIframe==='function'){event.preventDefault();openIframe()}"> <span class="sr-only">Read more</span> </a>`;

  const card = `<div class="card card--icon card--icon-link"><div class="card__icon card__icon--bg-yellow-light">${icon}</div><div class="card__body"><div class="card__heading">Chat with 211 Help Finder</div>${link}</div></div>`;

  // The site turns icons amber on hover, which all but disappears against this
  // circle, so the hover colour is the brand navy here. Circles need naming
  // alongside path because the site's rule only covers path.
  const styles = `<style>
.card--icon-link:hover .card__icon--bg-yellow-light path,.card--icon-link:hover .card__icon--bg-yellow-light circle{fill:#21296b}
</style>`;

  return (html.slice(0, end) + card + html.slice(end)).replace(
    "</head>",
    `${styles}</head>`,
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
  const origin = new URL(request.url).origin;
  html = localizeLinks(html, origin);

  if (path === "") {
    html = removeAnniversaryBadge(html, origin);
  }

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
  addHeroSearch,
  addNavSearch,
  addChatCard,
};
