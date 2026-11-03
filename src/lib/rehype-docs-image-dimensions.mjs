import { fileURLToPath } from "node:url";
import sharp from "sharp";

const publicRoot = new URL("../../public/", import.meta.url);

export function rehypeDocsImageDimensions() {
  return async (tree, file) => {
    if (
      !String(file.path ?? "")
        .replaceAll("\\", "/")
        .includes("/content/docs/")
    )
      return;

    const pending = [];
    const walk = (node) => {
      const props = node.properties;
      if (
        node.type === "element" &&
        node.tagName === "img" &&
        typeof props?.src === "string" &&
        props.src.startsWith("/docs/access-review/") &&
        props.width === undefined &&
        props.height === undefined
      ) {
        const image = new URL(`.${props.src}`, publicRoot);
        if (image.pathname.startsWith(publicRoot.pathname)) {
          pending.push(
            sharp(fileURLToPath(image))
              .metadata()
              .then(({ width, height }) => {
                if (width && height) Object.assign(props, { width, height });
              }),
          );
        }
      }
      for (const child of node.children ?? []) walk(child);
    };
    walk(tree);
    await Promise.all(pending);
  };
}
