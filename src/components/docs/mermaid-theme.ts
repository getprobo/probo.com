import type { MermaidConfig } from "mermaid";

const fontFamily =
  '"Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

const light = {
  background: "transparent",
  fontFamily,
  fontSize: "14px",

  primaryColor: "#ffffff",
  primaryTextColor: "#171717",
  primaryBorderColor: "#a3a3a3",
  secondaryColor: "#fff8c8",
  secondaryTextColor: "#171717",
  secondaryBorderColor: "#8a7900",
  tertiaryColor: "#f5f5f5",
  tertiaryTextColor: "#171717",
  tertiaryBorderColor: "#e5e5e5",

  textColor: "#171717",
  lineColor: "#737373",
  titleColor: "#171717",

  mainBkg: "#ffffff",
  nodeBorder: "#a3a3a3",
  nodeTextColor: "#171717",
  clusterBkg: "#fafafa",
  clusterBorder: "#d4d4d4",
  edgeLabelBackground: "#ffffff",

  actorBkg: "#fff8c8",
  actorBorder: "#8a7900",
  actorTextColor: "#171717",
  actorLineColor: "#a3a3a3",
  signalColor: "#525252",
  signalTextColor: "#171717",
  labelBoxBkgColor: "#ffffff",
  labelBoxBorderColor: "#a3a3a3",
  labelTextColor: "#171717",
  loopTextColor: "#171717",
  noteBkgColor: "#f5f5f5",
  noteBorderColor: "#a3a3a3",
  noteTextColor: "#171717",
  activationBkgColor: "#fff8c8",
  activationBorderColor: "#8a7900",
  sequenceNumberColor: "#171717",

  labelColor: "#171717",
  altBackground: "#fafafa",
  transitionColor: "#737373",
  transitionLabelColor: "#171717",
} as const;

const dark = {
  background: "transparent",
  fontFamily,
  fontSize: "14px",

  primaryColor: "#262626",
  primaryTextColor: "#f5f5f5",
  primaryBorderColor: "#737373",
  secondaryColor: "#38331f",
  secondaryTextColor: "#fff8c8",
  secondaryBorderColor: "#c4b438",
  tertiaryColor: "#262626",
  tertiaryTextColor: "#f5f5f5",
  tertiaryBorderColor: "#525252",

  textColor: "#f5f5f5",
  lineColor: "#a3a3a3",
  titleColor: "#f5f5f5",

  mainBkg: "#262626",
  nodeBorder: "#737373",
  nodeTextColor: "#f5f5f5",
  clusterBkg: "#171717",
  clusterBorder: "#525252",
  edgeLabelBackground: "#171717",

  actorBkg: "#38331f",
  actorBorder: "#c4b438",
  actorTextColor: "#fff8c8",
  actorLineColor: "#737373",
  signalColor: "#d4d4d4",
  signalTextColor: "#f5f5f5",
  labelBoxBkgColor: "#171717",
  labelBoxBorderColor: "#737373",
  labelTextColor: "#f5f5f5",
  loopTextColor: "#f5f5f5",
  noteBkgColor: "#262626",
  noteBorderColor: "#737373",
  noteTextColor: "#f5f5f5",
  activationBkgColor: "#38331f",
  activationBorderColor: "#c4b438",
  sequenceNumberColor: "#f5f5f5",

  labelColor: "#f5f5f5",
  altBackground: "#171717",
  transitionColor: "#a3a3a3",
  transitionLabelColor: "#f5f5f5",
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
