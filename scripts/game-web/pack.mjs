// Packs a built Solar2D app folder (assets + resource.car) into Solar2D's HTML5 template.
// Mirrors webPackageApp.lua from Solar2D 2024.3711 (github.com/coronalabs/corona,
// platform/resources/webPackageApp.lua): assets go into one Emscripten .data file, and the
// template's loadPackage(...) / FS_createPath(...) placeholders are replaced with the file map.
// Usage: node pack.mjs <appDir> <templateHtmlDir> <outDir>
import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const [appDir, tplDir, outDir] = process.argv.slice(2);
assert(appDir && tplDir && outDir, "usage: node pack.mjs <appDir> <templateHtmlDir> <outDir>");

// Same default excludes as webPackageApp.lua. Lua source ships compiled inside resource.car.
// shortcut: ignores build.settings excludeFiles.all/web (the game sets none); read them if it ever does.
const EXCLUDED_EXT = [".config", ".lu", ".lua", ".bak", ".orig", ".swp", ".DS_Store", ".apk", ".obb", ".obj", ".o", ".lnk", ".class", ".log"];
const included = (name) =>
  !name.startsWith(".") && name !== "build.properties" && !EXCLUDED_EXT.some((ext) => name.endsWith(ext));

const files = []; // { name: "/sounds/sfx/coin.wav", src }
const folders = []; // { parent: "/sounds/", name: "sfx" }
(function walk(dir, vdir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!included(entry.name)) continue;
    const src = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      folders.push({ parent: vdir, name: entry.name });
      walk(src, `${vdir}${entry.name}/`);
    } else {
      files.push({ name: vdir + entry.name, src });
    }
  }
})(appDir, "/");
assert(files.some((f) => f.name === "/resource.car"), "resource.car missing from app folder");

// .data is every file concatenated; the loader slices it back apart by start/end offsets.
let pos = 0;
const entries = files.map(({ name, src }) => {
  const size = fs.statSync(src).size;
  const entry = { audio: 0, start: pos, crunched: 0, end: pos + size, filename: name };
  pos += size;
  return entry;
});
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "coronaHtml5App.data"), Buffer.concat(files.map((f) => fs.readFileSync(f.src))));
assert.equal(fs.statSync(path.join(outDir, "coronaHtml5App.data")).size, pos);

// Replace `<prefix>(...)<suffix>` (balanced parens) at the first occurrence of prefix + "(".
function replaceCall(src, prefixes, replacement, suffix = "") {
  const prefix = prefixes.find((p) => src.includes(p + "("));
  assert(prefix, `template JS has no ${prefixes[0]}(...)`);
  const start = src.indexOf(prefix + "(");
  let i = start + prefix.length, depth = 0;
  do {
    if (src[i] === "(") depth++;
    else if (src[i] === ")") depth--;
    i++;
  } while (depth > 0 && i < src.length);
  assert.equal(depth, 0, `unbalanced ${prefix}(...)`);
  assert(src.startsWith(suffix, i), `${prefix}(...) not followed by "${suffix}"`);
  return src.slice(0, start) + replacement + src.slice(i + suffix.length);
}

const jsPath = path.join(tplDir, "coronaHtml5App.js");
let js = fs.readFileSync(jsPath, "utf8");
const meta = { files: entries, remote_package_size: pos, package_uuid: "134361ad-01a4-42aa-aea6-5b48c05818f7" };
js = replaceCall(js, ["loadPackage"], `loadPackage(${JSON.stringify(meta)})`);
const createPaths = folders.map((f) => `Module["FS_createPath"](${JSON.stringify(f.parent)},${JSON.stringify(f.name)},true,true);`).join("");
js = replaceCall(js, ['Module["FS_createPath"]', "Module['FS_createPath']"], createPaths, ";");

// Engine bug: text line height comes from a hidden span's offsetHeight, which some browsers report
// as 0 while the frame isn't laid out yet. The 0 is cached and every text draw then throws in
// getImageData ("source height is 0"). Fall back to font size * 1.25, and never ask for a 0-px image.
for (const [from, to] of [
  ["var size=[div.offsetWidth,div.offsetHeight];", "var size=[div.offsetWidth,div.offsetHeight||Math.ceil(size*1.25)];"],
  ["hh=h>0?h:y+lineHeight;", "hh=Math.max(1,h>0?h:y+lineHeight);"],
]) {
  assert.equal(js.split(from).length, 2, `engine JS changed; expected exactly one "${from}"`);
  js = js.replace(from, to);
}
fs.writeFileSync(jsPath, js);

// The page downloads .js + .wasm as one zip (.bin) and unpacks it in the browser.
execFileSync("zip", ["-q", "-j", "-X", path.join(path.resolve(outDir), "coronaHtml5App.bin"), jsPath, path.join(tplDir, "coronaHtml5App.wasm")]);

// The template discards engine stdout, which is where Lua runtime errors go; send it to the console.
const tplHtml = fs.readFileSync(path.join(tplDir, "index-nosplash.html"), "utf8");
assert(tplHtml.includes("print: function() {},"), "template HTML changed; print handler not found");
const html = tplHtml.replace("Corona HTML5 App", "Pixel Climb").replace("print: function() {},", "print: function(text) { console.log(text); },");
fs.writeFileSync(path.join(outDir, "index.html"), html);

console.log(`Packed ${files.length} files in ${folders.length} folders (${(pos / 1048576).toFixed(1)} MB)`);
