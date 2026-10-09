/* Text splitting for the reveal system, modelled on topology.vc's use of GSAP SplitText (build/index-D_F-KEA1.js,
   read 2026-10-09): its "fadeUp" and "fadeRTL" presets split by { type: "lines" } or "words", and the hero splits
   its title into words and its tagline into lines.
   Here text nodes are wrapped in word spans (kept whole with white-space: nowrap so a word never breaks between
   characters), words are grouped into the lines the browser laid them out on, and chars are wrapped on request.
   The original markup is kept for revert(); the split spans are aria-hidden and a visually hidden copy of the plain text is read instead. */

export type Split = { words: HTMLElement[]; lines: HTMLElement[][]; chars: HTMLElement[][]; revert: () => void };

export function splitText(root: HTMLElement, { chars = false } = {}): Split {
  const original = root.innerHTML;
  const text = root.textContent?.replace(/\s+/g, " ").trim() ?? "";
  const words: HTMLElement[] = [];
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        (child.textContent ?? "").split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { fragment.appendChild(document.createTextNode(" ")); return; }
          const word = document.createElement("span");
          word.className = "sw";
          word.setAttribute("aria-hidden", "true");
          if (chars) Array.from(part).forEach((ch) => { const c = document.createElement("span"); c.className = "sc"; c.textContent = ch; word.appendChild(c); });
          else word.textContent = part;
          words.push(word);
          fragment.appendChild(word);
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName !== "BR") {
        walk(child);
      }
    });
  };
  walk(root);
  const plain = document.createElement("span");
  plain.className = "sr-only";
  plain.textContent = text;
  root.prepend(plain);
  // One group per rendered line, by each word's top edge.
  const lines: HTMLElement[][] = [];
  let top = Number.NaN;
  words.forEach((word) => {
    const y = word.getBoundingClientRect().top;
    if (Number.isNaN(top) || Math.abs(y - top) > 4) { lines.push([]); top = y; }
    lines[lines.length - 1].push(word);
  });
  const charLines = chars ? lines.map((line) => line.flatMap((w) => Array.from(w.children) as HTMLElement[])) : [];
  return {
    words, lines, chars: charLines,
    revert: () => { root.innerHTML = original; },
  };
}
