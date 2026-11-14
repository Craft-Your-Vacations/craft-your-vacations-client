import Image from "next/image";
import Logo from "@/public/logo.png";
import LogoText from "@/public/logo_text.png";

/** Minimum time the splash stays up, so the brand beat is the same on every connection. */
const MIN_MS = 2000;

/**
 * Failure backstop, and the important one. `load` does not fire while any
 * subresource is still pending, so a single hung image or font would otherwise
 * leave a visitor staring at the logo indefinitely. After this we reveal the
 * page regardless — a partly-loaded page beats a permanent splash, and anything
 * still missing keeps arriving behind it.
 */
const CEILING_MS = 5000;

/**
 * Runs synchronously as the first thing in <body>, so the attribute is set
 * before the browser paints. A React state/effect version would paint the real
 * page first and only then cover it, which reads as a bug.
 *
 * Opt-in, not opt-out: the CSS keeps #splash at display:none until this runs,
 * so a blocked or failed script leaves the site usable rather than stuck behind
 * an overlay.
 *
 * Hides at max(MIN_MS, page load) — a fast load still shows the full minimum, a
 * slow one holds until loading actually finishes.
 */
const splashScript = `
(function () {
  var d = document.documentElement, done = false;
  try {
    // Once per tab. Internal navigation and refreshes shouldn't replay it.
    if (sessionStorage.getItem('cyv:splash')) return;
    sessionStorage.setItem('cyv:splash', '1');
  } catch (e) {
    // Private mode or blocked storage — show it rather than fail.
  }

  function out() {
    if (done) return;
    done = true;
    d.setAttribute('data-splash', 'out');
  }

  // Armed before the splash is shown, so the escape hatch exists even if
  // something below this line throws.
  setTimeout(out, ${CEILING_MS});

  d.setAttribute('data-splash', '');

  addEventListener('load', function () {
    // performance.now() is milliseconds since navigation started, so it counts
    // the time before this script ran — Date.now() here would under-measure and
    // hold the splash slightly too long.
    setTimeout(out, Math.max(0, ${MIN_MS} - performance.now()));
  });
})();
`;

/**
 * First-paint brand screen. Render as the first child of <body> — the script
 * must run before anything else in the document is parsed.
 *
 * Styles live in globals.css (`#splash`), because the inline script above
 * toggles them by id on <html> before any React or CSS-module code exists.
 */
export default function Splash() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: splashScript }} />

      <div id="splash" aria-hidden="true">
        {/* alt="" on both — aria-hidden already removes this from the
            accessibility tree, and the page title carries the brand name. */}
        <div className="flex items-center gap-3">
          <Image src={Logo} alt="" width={44} height={52} priority />
          <Image src={LogoText} alt="" width={190} height={70} priority />
        </div>
        <div id="splash-bar" />
      </div>
    </>
  );
}
