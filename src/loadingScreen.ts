import gsap from "gsap";

const loader = document.querySelector("#loader") as HTMLElement;
const bar = document.querySelector("#loader-bar") as HTMLElement;
const text = document.querySelector("#loader-text") as HTMLElement;

export function setProgress(progress: number) {
  bar.style.width = `${progress * 100}%`;
  text.textContent = `${Math.round(progress * 100)}%`;
}

export function hideLoader() {
  return (
    gsap
      .timeline()
      // Make sure the bar reads full before leaving
      .to(bar, { width: "100%", duration: 0.3, ease: "power2.out" })
      .set(text, { textContent: "100%" })
      // Curtain: the whole loader slides up and off the screen
      .to(loader, {
        duration: 1,
        ease: "power4.inOut",
        delay: 0.2,
        onComplete: () => loader.remove(),
      })
  );
}
