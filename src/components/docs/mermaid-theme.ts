import type { MermaidConfig } from "mermaid";

const fontFamily =
  '"Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

const light = {
  background: "transparent",
  fontFamily,
  fontSize: "14px",

  primaryColor: "#ffffff",
  primaryTextColor: "#21201c",
  primaryBorderColor: "#aaa89c",
  secondaryColor: "#fff8c8",
  secondaryTextColor: "#21201c",
  secondaryBorderColor: "#8a7900",
  tertiaryColor: "#f5f5f0",
  tertiaryTextColor: "#21201c",
  tertiaryBorderColor: "#e9e8e1",

  textColor: "#21201c",
  lineColor: "#77756b",
  titleColor: "#21201c",

  mainBkg: "#ffffff",
  nodeBorder: "#aaa89c",
  nodeTextColor: "#21201c",
  clusterBkg: "#f7f7f1",
  clusterBorder: "#dcdacf",
  edgeLabelBackground: "#ffffff",

  actorBkg: "#fff8c8",
  actorBorder: "#8a7900",
  actorTextColor: "#21201c",
  actorLineColor: "#aaa89c",
  signalColor: "#59574e",
  signalTextColor: "#21201c",
  labelBoxBkgColor: "#ffffff",
  labelBoxBorderColor: "#aaa89c",
  labelTextColor: "#21201c",
  loopTextColor: "#21201c",
  noteBkgColor: "#f5f5f0",
  noteBorderColor: "#aaa89c",
  noteTextColor: "#21201c",
  activationBkgColor: "#fff8c8",
  activationBorderColor: "#8a7900",
  sequenceNumberColor: "#21201c",

  labelColor: "#21201c",
  altBackground: "#f7f7f1",
  transitionColor: "#77756b",
  transitionLabelColor: "#21201c",
} as const;

const dark = {
  background: "transparent",
  fontFamily,
  fontSize: "14px",

  primaryColor: "#242420",
  primaryTextColor: "#eeede6",
  primaryBorderColor: "#747267",
  secondaryColor: "#38331f",
  secondaryTextColor: "#fff8c8",
  secondaryBorderColor: "#c4b438",
  tertiaryColor: "#242420",
  tertiaryTextColor: "#eeede6",
  tertiaryBorderColor: "#45443b",

  textColor: "#eeede6",
  lineColor: "#9a9789",
  titleColor: "#eeede6",

  mainBkg: "#242420",
  nodeBorder: "#747267",
  nodeTextColor: "#eeede6",
  clusterBkg: "#1d1d1a",
  clusterBorder: "#45443b",
  edgeLabelBackground: "#1d1d1a",

  actorBkg: "#38331f",
  actorBorder: "#c4b438",
  actorTextColor: "#fff8c8",
  actorLineColor: "#747267",
  signalColor: "#c9c7bb",
  signalTextColor: "#eeede6",
  labelBoxBkgColor: "#1d1d1a",
  labelBoxBorderColor: "#747267",
  labelTextColor: "#eeede6",
  loopTextColor: "#eeede6",
  noteBkgColor: "#242420",
  noteBorderColor: "#747267",
  noteTextColor: "#eeede6",
  activationBkgColor: "#38331f",
  activationBorderColor: "#c4b438",
  sequenceNumberColor: "#eeede6",

  labelColor: "#eeede6",
  altBackground: "#1d1d1a",
  transitionColor: "#9a9789",
  transitionLabelColor: "#eeede6",
} as const;

export function mermaidConfig(mode: "light" | "dark"): MermaidConfig {
  return {
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",
    themeVariables: mode === "dark" ? dark : light,
    fontFamily,
    flowchart: { curve: "basis", padding: 16, useMaxWidth: true },
    sequence: {
      useMaxWidth: true,
      actorMargin: 60,
      boxMargin: 12,
      mirrorActors: false,
      messageAlign: "center",
    },
    state: { useMaxWidth: true },
  };
}
