<script lang="ts">
  import { fly } from "svelte/transition";

  type Props = {
    id: string;
    labelId: string;
    options: string[];
    value?: string;
    placeholder?: string;
  };

  let {
    id,
    labelId,
    options,
    value = $bindable(""),
    placeholder = "Select",
  }: Props = $props();

  let open = $state(false);
  let active = $state(0);
  let root = $state<HTMLElement>();
  let trigger = $state<HTMLButtonElement>();
  let list = $state<HTMLUListElement>();

  const listId = $derived(`${id}-list`);
  const optionId = (i: number) => `${id}-option-${i}`;

  function show() {
    const current = options.indexOf(value);
    active = current >= 0 ? current : 0;
    open = true;
    queueMicrotask(() => {
      list?.focus();
      list
        ?.querySelector(`#${optionId(active)}`)
        ?.scrollIntoView({ block: "nearest" });
    });
  }

  function hide(refocus = true) {
    open = false;
    if (refocus) trigger?.focus();
  }

  function choose(i: number) {
    value = options[i] === value ? "" : options[i];
    hide();
  }

  function move(to: number) {
    active = Math.max(0, Math.min(options.length - 1, to));
    list
      ?.querySelector(`#${optionId(active)}`)
      ?.scrollIntoView({ block: "nearest" });
  }

  function onTriggerKey(e: KeyboardEvent) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      show();
    }
  }

  function onListKey(e: KeyboardEvent) {
    const keys: Record<string, () => void> = {
      ArrowDown: () => move(active + 1),
      ArrowUp: () => move(active - 1),
      Home: () => move(0),
      End: () => move(options.length - 1),
      Enter: () => choose(active),
      " ": () => choose(active),
      Escape: () => hide(),
    };
    if (e.key === "Tab") return hide(false);
    const action = keys[e.key];
    if (!action) return;
    e.preventDefault();
    action();
  }

  $effect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root?.contains(e.target as Node)) hide(false);
    };
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  });
</script>

<div class="relative" bind:this={root}>
  <button
    {id}
    type="button"
    class="border-border-mid bg-level-1 focus-visible:outline-primary flex h-12 w-full items-center justify-between gap-3 rounded-lg border px-3 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-1"
    class:border-primary={open}
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-controls={listId}
    aria-labelledby="{labelId} {id}"
    bind:this={trigger}
    onclick={() => (open ? hide() : show())}
    onkeydown={onTriggerKey}
  >
    <span class={value ? "text-foreground" : "text-quaternary/70"}>
      {value || placeholder}
    </span>
    <svg
      viewBox="0 0 256 256"
      class="text-muted-foreground size-4 flex-none transition-transform duration-200"
      class:rotate-180={open}
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"
      />
    </svg>
  </button>

  {#if open}
    <ul
      id={listId}
      role="listbox"
      tabindex="-1"
      aria-labelledby={labelId}
      aria-activedescendant={optionId(active)}
      class="bg-level-1 border-border-low shadow-mid absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto overscroll-contain rounded-xl border p-1.5 outline-none"
      bind:this={list}
      onkeydown={onListKey}
      transition:fly={{ y: -4, duration: 120 }}
    >
      {#each options as option, i (option)}
        {@const selected = option === value}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <li
          id={optionId(i)}
          role="option"
          aria-selected={selected}
          class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm"
          class:bg-highlight={i === active}
          onpointermove={() => (active = i)}
          onclick={() => choose(i)}
        >
          <span
            class="flex size-4 flex-none items-center justify-center rounded-full border transition-colors"
            class:border-border-mid={!selected}
            class:border-primary={selected}
            class:bg-primary={selected}
            aria-hidden="true"
          >
            {#if selected}
              <span class="bg-primary-foreground size-1.5 rounded-full"></span>
            {/if}
          </span>
          <span class:font-medium={selected}>{option}</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>
