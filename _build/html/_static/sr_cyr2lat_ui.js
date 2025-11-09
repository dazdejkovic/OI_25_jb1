
// sr_cyr2lat_ui.js — transliterates Serbian Cyrillic to Latin in UI chrome only.
// Scope: sidebar, topbar, prev/next, local TOC, search controls.
// Does NOT touch main article content (#main-content).

(function () {
  const CYR2LAT = [
    [/Љ/g, "Lj"], [/Њ/g, "Nj"], [/Џ/g, "Dž"],
    [/Ђ/g, "Đ"],  [/Ћ/g, "Ć"],  [/Ч/g, "Č"],  [/Њ/g, "Nj"], [/Љ/g, "Lj"], [/Ш/g, "Š"], [/Ж/g, "Ž"],
    [/А/g, "A"], [/Б/g, "B"], [/В/g, "V"], [/Г/g, "G"], [/Д/g, "D"], [/Е/g, "E"], [/З/g, "Z"], [/И/g, "I"],
    [/Ј/g, "J"], [/К/g, "K"], [/Л/g, "L"], [/М/g, "M"], [/Н/g, "N"], [/О/g, "O"], [/П/g, "P"], [/Р/g, "R"],
    [/С/g, "S"], [/Т/g, "T"], [/У/g, "U"], [/Ф/g, "F"], [/Х/g, "H"], [/Ц/g, "C"], [/Љ/g, "Lj"], [/Њ/g, "Nj"], [/Џ/g, "Dž"],

    [/љ/g, "lj"], [/њ/g, "nj"], [/џ/g, "dž"],
    [/ђ/g, "đ"],  [/ћ/g, "ć"],  [/ч/g, "č"],  [/ш/g, "š"],  [/ж/g, "ž"],
    [/а/g, "a"], [/б/g, "b"], [/в/g, "v"], [/г/g, "g"], [/д/g, "d"], [/е/g, "e"], [/з/g, "z"], [/и/g, "i"],
    [/ј/g, "j"], [/к/g, "k"], [/л/g, "l"], [/м/g, "m"], [/н/g, "n"], [/о/g, "o"], [/п/g, "p"], [/р/g, "r"],
    [/с/g, "s"], [/т/g, "t"], [/у/g, "u"], [/ф/g, "f"], [/х/g, "h"], [/ц/g, "c"]
  ];

  function transliterateText(t) {
    let out = t;
    for (const [re, rep] of CYR2LAT) out = out.replace(re, rep);
    return out;
  }

  function walkAndTransliterate(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        // Skip pure whitespace
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        // Skip code blocks
        if (node.parentNode && (node.parentNode.tagName === "CODE" || node.parentNode.tagName === "PRE")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    const nodes = [];
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(n => { n.nodeValue = transliterateText(n.nodeValue); });
  }

  function run() {
    const selectors = [
      "aside",                          // sidebar
      ".bd-sidebar",                    // alt sidebar class
      "header",                         // topbar
      ".prev-next-area",                // prev/next controls
      ".bd-toc",                        // local toc block
      "nav[aria-label='breadcrumbs']",  // breadcrumbs
      "form.bd-search",                 // search
      ".bd-search input[type='search']",
      "footer"                          // footer
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => walkAndTransliterate(el));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
