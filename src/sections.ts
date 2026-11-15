import gsap from "gsap";

// One entry per section, in arrow order. "as const" keeps the titles as literal
// types, so Section below is "complete" | "seeds" | "stem" | "strawberry".
const SECTIONS = [
  {
    title: "strawberry",
    description:
      "The strawberry completed, seeds, stem and body all together. Optimazed with Draco and also on Blender using the decimate modifier.",
  },
  {
    title: "seeds",
    description:
      "I created a single seed, then duplicated it into the holes I carved on the strawberry in Sculpt mode. 100 seeds.",
  },
  {
    title: "stem",
    description:
      "I modeled a circle as I wanted, then some extrude and some intrude, and we have our stem ready to put on the top of the body.",
  },
  {
    title: "body",
    description:
      "I started from a sphere, shaped it into a strawberry form (similar diamond), then sculpted the holes where the seeds sit.",
  },
] as const;

export type Section = (typeof SECTIONS)[number]["title"];

// Wires the prev/next arrows: animates the title and tells the caller which section is active
export function setupSections(onChange: (section: Section) => void) {
  const title = document.querySelector("#section-title") as HTMLElement;
  const prev = document.querySelector("#prev") as HTMLButtonElement;
  const next = document.querySelector("#next") as HTMLButtonElement;
  const description = document.querySelector("#section-description") as HTMLElement;

  let index = 0;
  description.textContent = SECTIONS[index].description;
  let change: gsap.core.Timeline | undefined;

  function go(step: number) {
    // Wrap around: after the last section comes the first, and vice versa
    index = (index + step + SECTIONS.length) % SECTIONS.length;
    const section = SECTIONS[index];

    // Fast clicks: jump the running change to its end instead of stacking animations
    change?.progress(1);

    // Next: old title + description exit up, new ones enter from below. Previous: the opposite.
    const dir = step > 0 ? -1 : 1;
    change = gsap
      .timeline()
      .to([title, description], { yPercent: 100 * dir, duration: 0.25, ease: "power2.in" })
      .call(() => {
        title.textContent = section.title;
        description.textContent = section.description;
      })
      .fromTo(
        [title, description],
        { yPercent: -100 * dir },
        // immediateRender: false, otherwise fromTo jumps to its start value before the exit runs
        { yPercent: 0, duration: 0.35, ease: "power3.out", immediateRender: false },
      );

    onChange(section.title);
  }

  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));
}
