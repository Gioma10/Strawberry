import gsap from "gsap";

const SECTIONS = ["complete", "seeds", "stem", "strawberry"] as const;

export type Section = (typeof SECTIONS)[number];

// Wires the prev/next arrows: animates the title and tells the caller which section is active
export function setupSections(onChange: (section: Section) => void) {
  const title = document.querySelector("#section-title") as HTMLElement;
  const prev = document.querySelector("#prev") as HTMLButtonElement;
  const next = document.querySelector("#next") as HTMLButtonElement;

  let index = 0;
  let change: gsap.core.Timeline | undefined;

  function go(step: number) {
    // Wrap around: after the last section comes the first, and vice versa
    index = (index + step + SECTIONS.length) % SECTIONS.length;
    const section = SECTIONS[index];

    // Fast clicks: jump the running change to its end instead of stacking animations
    change?.progress(1);

    // Next: old title exits up, new one enters from below. Previous: the opposite.
    const dir = step > 0 ? -1 : 1;
    change = gsap
      .timeline()
      .to(title, { yPercent: 100 * dir, duration: 0.25, ease: "power2.in" })
      .call(() => {
        title.textContent = section;
      })
      .fromTo(
        title,
        { yPercent: -100 * dir },
        // immediateRender: false, otherwise fromTo jumps to its start value before the exit runs
        { yPercent: 0, duration: 0.35, ease: "power3.out", immediateRender: false },
      );

    onChange(section);
  }

  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));
}
