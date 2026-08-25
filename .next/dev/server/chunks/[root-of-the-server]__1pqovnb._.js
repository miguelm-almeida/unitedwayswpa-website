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
const SOURCE_URL = "https://unitedwayswpa-org.translate.goog/?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en";
const TRANSLATE_SCRIPT = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
function removeTranslationScripts(html) {
    return html.replace(TRANSLATE_SCRIPT, (script)=>{
        const isTranslationCode = script.includes("translate_http") || script.includes("google-translate") || script.includes("initProtoFlow") || script.includes("_x_tr_") || script.includes("data-proxy-url");
        return isTranslationCode ? "" : script;
    });
}
function makeOriginalAssetsResolvable(html) {
    const base = '<base href="https://unitedwayswpa.org/">';
    return html.replace(/<base\b[^>]*>/gi, "").replace("<head>", `<head>${base}`).replace(/\?_x_tr_sl=auto(?:&amp;|&)_x_tr_tl=en(?:&amp;|&)_x_tr_hl=en/g, "").replaceAll("https://unitedwayswpa-org.translate.goog", "https://unitedwayswpa.org").replace(/<link[^>]+fonts\.googleapis\.com\/css2\?family=Material\+Symbols[^>]*>/gi, "");
}
const dynamic = "force-dynamic";
async function GET() {
    const response = await fetch(SOURCE_URL, {
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
    return new Response(html, {
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store"
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1pqovnb._.js.map