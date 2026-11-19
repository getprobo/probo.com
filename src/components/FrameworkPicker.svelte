<script lang="ts">
  import { slide } from "svelte/transition";
  import {
    frameworks,
    primaryFrameworkCount,
    type Framework,
  } from "../lib/contact";

  type Props = {
    selected?: string[];
    custom?: string[];
    invalid?: boolean;
  };

  let {
    selected = $bindable([]),
    custom = $bindable([]),
    invalid = false,
  }: Props = $props();

  const icons = {
    question:
      "M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z",
    shield:
      "M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z",
    search:
      "M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z",
    plus: "M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z",
    check:
      "M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z",
  };

  let open = $state(false);
  let query = $state("");
  let search = $state<HTMLInputElement>();
  let toggleButton = $state<HTMLButtonElement>();
  let panel = $state<HTMLElement>();

  // A click anywhere outside the panel closes it. Focus stays where the
  // visitor clicked.
  $effect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panel?.contains(target) || toggleButton?.contains(target)) return;
      open = false;
      query = "";
    };
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  });

  // The common frameworks always show as chips; anything picked from the
  // full list joins them so the visitor sees everything they chose.
  const chips = $derived(
    frameworks.filter(
      (f, i) => i < primaryFrameworkCount || selected.includes(f.id),
    ),
  );
  const needle = $derived(query.trim().toLowerCase());
  const results = $derived(
    needle
      ? frameworks.filter((f) => f.label.toLowerCase().includes(needle))
      : frameworks,
  );
  const canAdd = $derived(
    needle.length > 1 &&
      results.length === 0 &&
      !custom.some((c) => c.toLowerCase() === needle),
  );

  const chipClass =
    "border-border-mid bg-level-1 hover:bg-highlight aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground focus-visible:outline-primary flex h-10 items-center gap-2 rounded-full border pr-4 pl-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

  function toggle(id: string) {
    selected = selected.includes(id)
      ? selected.filter((v) => v !== id)
      : [...selected, id];
  }

  function addCustom() {
    const name = query.trim();
    if (!name) return;
    custom = [...custom, name];
    query = "";
    search?.focus();
  }

  function removeCustom(name: string) {
    custom = custom.filter((c) => c !== name);
  }

  function openList() {
    open = true;
    queueMicrotask(() => search?.focus());
  }

  function closeList() {
    open = false;
    query = "";
    toggleButton?.focus();
  }

  function onSearchKey(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeList();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results.length === 1) {
        toggle(results[0].id);
        query = "";
      } else if (canAdd) {
        addCustom();
      }
    }
  }
</script>

{#snippet logo(framework: Framework | null, size: string)}
  <span
    class="bg-level-1 border-border-low flex flex-none items-center justify-center rounded-full border {size}"
    aria-hidden="true"
  >
    {#if framework?.logo}
      <img
        src="/frameworks/{framework.logo}.svg"
        alt=""
        width="60"
        height="60"
        loading="lazy"
        class="size-[85%]"
      />
    {:else}
      <svg
        viewBox="0 0 256 256"
        fill="currentColor"
        class="text-muted-foreground size-[55%]"
      >
        <path
          d={framework?.id === "unsure"
            ? icons.question
            : framework
              ? icons.shield
              : icons.plus}
        />
      </svg>
    {/if}
  </span>
{/snippet}

<div class="flex flex-wrap gap-2">
  {#each chips as framework (framework.id)}
    <button
      type="button"
      class={chipClass}
      class:border-error={invalid}
      aria-pressed={selected.includes(framework.id)}
      onclick={() => toggle(framework.id)}
    >
      {@render logo(framework, "size-7")}
      {framework.label}
    </button>
  {/each}
  {#each custom as name (name)}
    <button
      type="button"
      class={chipClass}
      aria-pressed="true"
      aria-label="Remove {name}"
      onclick={() => removeCustom(name)}
    >
      {@render logo(null, "size-7")}
      {name}
    </button>
  {/each}
  <button
    type="button"
    class="text-muted-foreground hover:text-foreground h-10 px-2 text-sm font-medium underline"
    aria-expanded={open}
    aria-controls="contact-framework-list"
    bind:this={toggleButton}
    onclick={() => (open ? closeList() : openList())}
  >
    {open ? "Hide the list" : "More frameworks"}
  </button>
</div>

{#if open}
  <div
    id="contact-framework-list"
    class="border-border-low bg-level-0 rounded-2xl border p-2"
    bind:this={panel}
    transition:slide={{ duration: 200 }}
  >
    <div class="relative">
      <svg
        viewBox="0 0 256 256"
        fill="currentColor"
        class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        aria-hidden="true"
      >
        <path d={icons.search} />
      </svg>
      <input
        type="search"
        class="border-border-mid placeholder:text-quaternary/70 bg-level-1 focus-visible:outline-primary h-11 w-full rounded-xl border pr-3 pl-9 text-sm focus-visible:outline-2 focus-visible:-outline-offset-1"
        placeholder="Search or add a framework"
        aria-label="Search frameworks"
        autocomplete="off"
        bind:this={search}
        bind:value={query}
        onkeydown={onSearchKey}
      />
    </div>

    <ul class="mt-2 grid max-h-80 gap-1 overflow-y-auto sm:grid-cols-2">
      {#each results as framework (framework.id)}
        {@const checked = selected.includes(framework.id)}
        <li>
          <button
            type="button"
            class="hover:bg-highlight focus-visible:outline-primary flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors focus-visible:outline-2"
            aria-pressed={checked}
            onclick={() => toggle(framework.id)}
          >
            {@render logo(framework, "size-8")}
            <span class="flex-1" class:font-medium={checked}
              >{framework.label}</span
            >
            <span
              class="flex size-5 flex-none items-center justify-center rounded-md border transition-colors"
              class:border-border-mid={!checked}
              class:border-primary={checked}
              class:bg-primary={checked}
              aria-hidden="true"
            >
              {#if checked}
                <svg
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  class="text-primary-foreground size-3.5"
                >
                  <path d={icons.check} />
                </svg>
              {/if}
            </span>
          </button>
        </li>
      {/each}
      {#if canAdd}
        <li>
          <button
            type="button"
            class="hover:bg-highlight focus-visible:outline-primary flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors focus-visible:outline-2"
            onclick={addCustom}
          >
            {@render logo(null, "size-8")}
            <span class="flex-1">Add “{query.trim()}”</span>
          </button>
        </li>
      {/if}
    </ul>
    {#if results.length === 0 && !canAdd}
      <p class="text-muted-foreground px-2 py-3 text-sm">
        Nothing matches. Keep typing to add it.
      </p>
    {/if}
  </div>
{/if}
