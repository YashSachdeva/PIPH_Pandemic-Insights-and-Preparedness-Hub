import { useEffect, useMemo, useRef, useState } from "react";
import { legacyPages, normalizePath } from "./legacyPages";

const loadedStyleHrefs = new Set();

function loadScript(script) {
  return new Promise((resolve, reject) => {
    const nextScript = document.createElement("script");

    for (const attr of script.attributes) {
      nextScript.setAttribute(attr.name, attr.value);
    }

    if (script.src) {
      nextScript.onload = resolve;
      nextScript.onerror = reject;
      nextScript.src = script.src;
    } else {
      nextScript.textContent = script.textContent;
    }

    document.body.appendChild(nextScript);

    if (!script.src) {
      resolve();
    }
  });
}

function LegacyPage({ page }) {
  const mountRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    const mountedScripts = [];

    async function hydrateLegacyPage() {
      setStatus("loading");

      try {
        const response = await fetch(`/legacy-pages/${page.file}`);
        if (!response.ok) {
          throw new Error(`Unable to load ${page.file}`);
        }

        const html = await response.text();
        if (cancelled) return;

        const parsed = new DOMParser().parseFromString(html, "text/html");
        document.title = parsed.querySelector("title")?.textContent || page.title;

        parsed.querySelectorAll('link[rel="stylesheet"], link[rel="shortcut icon"]').forEach((link) => {
          const href = link.getAttribute("href");
          const key = href || link.outerHTML;

          if (!loadedStyleHrefs.has(key)) {
            const nextLink = document.createElement("link");
            for (const attr of link.attributes) {
              nextLink.setAttribute(attr.name, attr.value);
            }
            document.head.appendChild(nextLink);
            loadedStyleHrefs.add(key);
          }
        });

        const bodyClone = parsed.body.cloneNode(true);
        const scripts = [...bodyClone.querySelectorAll("script")];
        scripts.forEach((script) => script.remove());

        mountRef.current.replaceChildren(...bodyClone.childNodes);

        for (const script of scripts) {
          if (cancelled) return;
          await loadScript(script);
          mountedScripts.push(document.body.lastElementChild);
        }

        document.dispatchEvent(new Event("DOMContentLoaded"));
        window.dispatchEvent(new Event("load"));
        setStatus("ready");
      } catch (error) {
        console.error(error);
        if (!cancelled) setStatus("error");
      }
    }

    hydrateLegacyPage();

    return () => {
      cancelled = true;
      mountedScripts.forEach((script) => script?.remove());
      if (mountRef.current) {
        mountRef.current.replaceChildren();
      }
    };
  }, [page]);

  return (
    <>
      {status === "loading" && <div className="react-page-status">Loading...</div>}
      {status === "error" && (
        <main className="react-page-status">
          <h1>Page unavailable</h1>
          <p>React could not load this page template.</p>
        </main>
      )}
      <div ref={mountRef} className={status === "ready" ? "" : "react-hidden"} />
    </>
  );
}

function App() {
  const page = useMemo(() => {
    const currentPath = normalizePath(window.location.pathname);
    return legacyPages[currentPath] || legacyPages["/"];
  }, []);

  return <LegacyPage page={page} />;
}

export default App;
