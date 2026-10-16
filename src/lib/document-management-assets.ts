import { existsSync } from "node:fs";
import { resolve } from "node:path";

export const findDocumentManagementAsset = (
  name: string,
): string | undefined => {
  for (const directory of [
    "document-management/figma",
    "document-management/v2",
    "document-management",
  ]) {
    for (const extension of ["webp", "svg", "png", "avif"]) {
      const src = `/${directory}/${name}.${extension}`;
      if (existsSync(resolve("public", src.slice(1)))) return src;
    }
  }
};
