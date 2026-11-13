<script lang="ts">
  import "../styles/splide.css";
  import { onMount, type Snippet } from "svelte";
  import clsx from "clsx";
  import Splide from "@splidejs/splide";
  import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
  import { Intersection } from "@splidejs/splide-extension-intersection";

  const props: {
    children: Snippet;
    class?: string;
    gap?: number;
    fadeEdges?: boolean;
    label?: string;
  } = $props();
  let slider: HTMLDivElement | null = null;
  const createOptions = () => {
    return {
      type: "loop",
      gap: props.gap ?? 16,
      arrows: false,
      autoWidth: true,
      pagination: false,
      mediaQuery: "min",
      reducedMotion: {
        autoScroll: false,
      },
      autoScroll: {
        autoStart: true,
        pauseOnFocus: true,
        speed: 0.7,
        pauseOnHover: true,
      },
    } as const;
  };

  onMount(() => {
    if (!slider) {
      return;
    }
    const slot = slider.querySelector("astro-slot") as HTMLElement;
    slot.setAttribute("class", "splide__list items-center block");
    Array.from(slot.children).forEach((child) => {
      child.classList.add("splide__slide");
    });
    const s = new Splide(slider, createOptions()).mount({
      AutoScroll,
      Intersection,
    });
    return () => {
      s.destroy();
    };
  });
</script>

<div
  class={clsx(props.class, "splide", props.fadeEdges && "logos-scroll--fade")}
  aria-label={props.label}
  bind:this={slider}
>
  <div class="splide__track">
    {@render props.children()}
  </div>
</div>

<style>
  .logos-scroll--fade.is-overflow .splide__track {
    mask-image: linear-gradient(
      to right,
      transparent,
      #000 40px,
      #000 calc(100% - 40px),
      transparent
    );
  }
</style>
