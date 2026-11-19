<script lang="ts">
  type Item = {
    quote: string;
    author: string;
    role: string;
    image: string;
  };

  let { items, interval = 6000 }: { items: Item[]; interval?: number } =
    $props();

  let current = $state(0);
  let paused = $state(false);

  $effect(() => {
    if (paused || items.length < 2) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      current = (current + 1) % items.length;
    }, interval);
    return () => clearInterval(timer);
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="bg-highlight rounded-3xl p-6 sm:p-8"
  onmouseenter={() => (paused = true)}
  onmouseleave={() => (paused = false)}
  onfocusin={() => (paused = true)}
  onfocusout={() => (paused = false)}
>
  <!-- Every quote sits in the same grid cell, so the card keeps the height
       of the longest one and nothing below it jumps on rotation. -->
  <div class="grid">
    {#each items as item, i (item.author)}
      <figure
        class="col-start-1 row-start-1 flex flex-col justify-between gap-6 transition-opacity duration-500"
        class:opacity-0={i !== current}
        class:pointer-events-none={i !== current}
        aria-hidden={i !== current}
      >
        <blockquote class="text-foreground text-lg">
          “{item.quote}”
        </blockquote>
        <figcaption class="flex items-center gap-3">
          <img
            src={item.image}
            alt=""
            width="44"
            height="44"
            loading="lazy"
            decoding="async"
            class="size-11 rounded-lg object-cover"
          />
          <div class="space-y-0.5 text-sm">
            <cite class="font-medium not-italic">{item.author}</cite>
            <div class="text-muted-foreground">{item.role}</div>
          </div>
        </figcaption>
      </figure>
    {/each}
  </div>

  {#if items.length > 1}
    <div class="mt-6 flex gap-1.5">
      {#each items as item, i (item.author)}
        <button
          type="button"
          class="bg-border-mid aria-current:bg-primary focus-visible:outline-primary h-1.5 w-4 rounded-full transition-all aria-current:w-8 focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-label="Show quote from {item.author}"
          aria-current={i === current ? "true" : undefined}
          onclick={() => (current = i)}
        ></button>
      {/each}
    </div>
  {/if}
</div>
