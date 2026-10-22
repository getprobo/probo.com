/** Preserve native table layout inside a keyboard-accessible scroll region. */
export function rehypeDocsTables() {
  return (tree, file) => {
    if (
      !String(file.path ?? "")
        .replaceAll("\\", "/")
        .includes("/content/docs/")
    )
      return;
    const text = (node) =>
      node.type === "text"
        ? node.value
        : (node.children ?? []).map(text).join("");
    const walk = (parent) => {
      if (!parent.children) return;
      for (let index = 0; index < parent.children.length; index++) {
        const node = parent.children[index];
        if (node.type === "element" && node.tagName === "table") {
          const head = node.children.find((child) => child.tagName === "thead");
          const headers =
            head?.children
              .flatMap((row) => row.children ?? [])
              .filter((cell) => cell.tagName === "th") ?? [];
          for (const header of headers) header.properties.scope ??= "col";
          const label = headers.map(text).filter(Boolean).join(", ");
          parent.children[index] = {
            type: "element",
            tagName: "div",
            properties: {
              className: ["docs-table-scroll"],
              role: "region",
              ariaLabel: label ? `Table: ${label}` : "Data table",
              tabIndex: 0,
            },
            children: [node],
          };
        } else {
          walk(node);
        }
      }
    };
    walk(tree);
  };
}
