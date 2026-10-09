<script lang="ts">
  import { scale } from "svelte/transition";
  import { onDestroy } from "svelte";
  import { frameworks } from "../content/frameworks.ts";
  import { windowWidth } from "../lib/window.ts";
  import FrameworkBadge from "./FrameworkBadge.svelte";
  import { useIntersectionObserver } from "../lib/runes/useIntersectionObserver.svelte.ts";
  import clsx from "clsx";

  import("./FrameworkBadge.svelte");

  const duration = 5000;
  let {
    count,
    class: className,
    countMobile,
    border,
  }: {
    count: number;
    countMobile?: number;
    class: string;
    border?: boolean;
  } = $props();
  let timer: ReturnType<typeof setTimeout> | null = null;
  let innerWidth = $state(windowWidth());
  let isMobile = $derived(innerWidth < 640);
  let intersection = useIntersectionObserver({ threshold: 0 });
  let visibleFrameworks = $state(frameworks.slice(0, count));

  // Reset the visibleFrameworks list when count changes, otherwise the list will be updated by the tick
  $effect(() => {
    visibleFrameworks = frameworks.slice(
      0,
      isMobile && countMobile ? countMobile : count,
    );
  });

  const tick = () => {
    // Pick one random available framework
    const availableFrameworks = frameworks.filter(
      (framework) =>
        !visibleFrameworks.map((f) => f.badge).includes(framework.badge),
    );
    if (availableFrameworks.length === 0) {
      return;
    }
    const randomFramework =
      availableFrameworks[
        Math.floor(Math.random() * availableFrameworks.length)
      ];
    const randomIndex = Math.floor(Math.random() * visibleFrameworks.length);
    visibleFrameworks[randomIndex] = randomFramework;
    timer = setTimeout(tick, duration);
  };

  // Enable the timer only when the badges are visible
  $effect(() => {
    if (intersection.observed) {
      timer = setTimeout(tick, duration);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  });

  onDestroy(() => {
    if (timer) {
      clearTimeout(timer);
    }
  });

  const columns = $derived(isMobile ? 3 : 5);
</script>

<div class={clsx(className, "relative")} bind:this={intersection.ref}>
  {#each visibleFrameworks as framework, index (index)}
    <div
      class={clsx(
        "relative overflow-hidden text-center",
        border
          ? "aspect-square md:aspect-192/180 hover:bg-[#F4FCE6] transition-all"
          : "size-25",
      )}
    >
      {#key framework.badge}
        <div
          class="absolute inset-0 m-auto size-25 space-y-3 transition-all duration-1000 mix-blend-multiply"
          transition:scale={{ duration: 750 }}
        >
          <FrameworkBadge
            name={framework.badge}
            class="block size-16 mx-auto"
          />
          <div class="whitespace-nowrap text-xxs">{framework.label}</div>
        </div>
      {/key}
    </div>
  {/each}
  {#if border}
    {#each { length: columns + 1 }, x}
      <div
        class="vertical-rule"
        style={`left: ${Math.round((x * 100) / columns)}%`}
      ></div>
    {/each}
    {#each { length: 3 }, y}
      <div
        class="horizontal-rule"
        style={`top: ${Math.round((y * 100) / 2)}%`}
      ></div>
    {/each}
  {/if}
</div>
<svelte:window bind:innerWidth />

<style>
  .vertical-rule {
    top: -20px;
    bottom: -20px;
    width: 1px;
    background: linear-gradient(
      to bottom,
      transparent,
      var(--color-border-low) 20px,
      var(--color-border-low) calc(100% - 20px),
      transparent
    );
    position: absolute;
  }
  .horizontal-rule {
    left: -20px;
    right: -20px;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      var(--color-border-low) 40px,
      var(--color-border-low) calc(100% - 40px),
      transparent
    );
    position: absolute;
  }
</style>
