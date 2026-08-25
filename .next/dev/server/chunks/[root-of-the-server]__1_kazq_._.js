module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/app/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$proxy$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/proxy.js [app-route] (ecmascript)");
;
const dynamic = "force-dynamic";
async function GET() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$proxy$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["renderPage"])({
        path: "",
        transform: (html)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$proxy$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addCtaTrigger"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$proxy$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addSearchBar"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$proxy$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addBootstrap"])(html), '<div class="page-intro">'))
    });
}
}),
"[project]/lib/proxy.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addBootstrap",
    ()=>addBootstrap,
    "addCtaTrigger",
    ()=>addCtaTrigger,
    "addIframe",
    ()=>addIframe,
    "addSearchBar",
    ()=>addSearchBar,
    "renderPage",
    ()=>renderPage
]);
const SHARE_ID = "f92e9um8a1";
const WIDGET_SRC = "https://d36ewmyb2wrx29.cloudfront.net/index.js";
const ORIGIN = "https://unitedwayswpa.org";
const PROXY_ORIGIN = "https://unitedwayswpa-org.translate.goog";
const SCRIPT_TAG = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
function sourceUrl(path) {
    return `${PROXY_ORIGIN}/${path}?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en`;
}
function removeTranslationScripts(html) {
    return html.replace(SCRIPT_TAG, (script)=>{
        const isTranslationCode = script.includes("translate_http") || script.includes("google-translate") || script.includes("initProtoFlow") || script.includes("_x_tr_") || script.includes("data-proxy-url");
        return isTranslationCode ? "" : script;
    });
}
function makeOriginalAssetsResolvable(html) {
    return html.replace(/<base\b[^>]*>/gi, "").replace("<head>", `<head><base href="${ORIGIN}/">`).replace(/\?_x_tr_sl=auto(?:&amp;|&)_x_tr_tl=en(?:&amp;|&)_x_tr_hl=en/g, "").replaceAll(PROXY_ORIGIN, ORIGIN).replace(/<link[^>]+fonts\.googleapis\.com\/css2\?family=Material\+Symbols[^>]*>/gi, "");
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
    return html.replace("</head>", `${config}</head>`).replace("</body>", `${widget}</body>`);
}
// The widget resolves its mount element once and never re-scans, so the div has
// to be in the served HTML rather than added later from the client.
function addSearchBar(html, anchor) {
    const searchBar = `<div class="skilly-search"><div id="skl_id_search_hero_section" chat_id="${SHARE_ID}" isHero="true"></div></div>`;
    // The widget ships a 400px pill sized for its own brand and writes height,
    // padding and border inline, so the host page has to override with
    // !important. Its send button is a white glyph on `background:none`, which is
    // invisible until it is given a fill here.
    //
    // The bar is capped well below the site's 1400px container. Stretched to the
    // full container the submit button ends up marooned a screen-width away from
    // the text the reader is typing.
    const styles = `<style>
#skl_id_search_hero_section{width:min(720px,calc(100% - 80px));margin:56px auto}
#skl_id_search_hero_section .input-container{width:100%!important;max-width:none!important;min-width:0!important;height:64px!important;padding:0 8px 0 20px!important;border:2px solid #0044b5!important;border-radius:8px!important;flex-direction:row!important;box-sizing:border-box}
#skl_id_search_hero_section .input-container input{flex:1;margin:0!important;font-family:Palanquin,Arial,sans-serif!important;font-size:19px!important;color:#21296b!important;--placeholder-color:#5c6699}
#skl_id_search_hero_section .send-button{width:48px!important;height:48px!important;flex:0 0 48px;display:flex!important;align-items:center;justify-content:center;border-radius:6px;background:#0044b5!important}
#skl_id_search_hero_section .send-button svg{width:22px;height:22px}
#skl_id_search_hero_section .send-button svg [fill]{fill:#fff}
#skl_id_search_hero_section .send-button svg [stroke]{stroke:#fff}
@media(max-width:850px){#skl_id_search_hero_section{width:calc(100% - 40px);margin:36px auto}#skl_id_search_hero_section .input-container{height:56px!important;padding:0 6px 0 14px!important}#skl_id_search_hero_section .input-container input{font-size:16px!important}}
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
    return html.replaceAll(`<a href="${ORIGIN}/get-help/" class="nav__link nav__link--button " target="">`, `<a href="${ORIGIN}/get-help/" class="nav__link nav__link--button " target="" onclick="event.preventDefault();openIframe()">`);
}
async function renderPage({ path = "", transform }) {
    const response = await fetch(sourceUrl(path), {
        cache: "no-store",
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140 Safari/537.36"
        }
    });
    if (!response.ok) {
        return new Response("Unable to load the source website.", {
            status: 502
        });
    }
    let html = await response.text();
    html = removeTranslationScripts(html);
    html = makeOriginalAssetsResolvable(html);
    html = transform(html);
    return new Response(html, {
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store"
        }
    });
}
;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1_kazq_._.js.map