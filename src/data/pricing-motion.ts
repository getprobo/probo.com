export const archivedPricingMotionStudies = [
  {
    id: "01",
    name: "Souffle",
    description:
      "Une lueur pleine apparaît derrière le badge. Le halo s’ouvre très légèrement, puis retrouve sa place.",
    kind: "fill",
    badge: "breathe",
    halo: "breathe",
    period: 12,
  },
  {
    id: "02",
    name: "Onde",
    description:
      "Un contour elliptique s’écarte du badge et s’efface. Le halo prolonge le mouvement dans le bas de la carte.",
    kind: "ring",
    badge: "wave",
    halo: "expand",
    period: 13,
  },
  {
    id: "03",
    name: "Deux battements",
    description:
      "Deux lueurs rapprochées, la seconde plus légère. Le halo leur répond par deux petits mouvements verticaux.",
    kind: "fill",
    badge: "double",
    halo: "double",
    period: 14,
  },
  {
    id: "04",
    name: "Écho",
    description:
      "Deux contours floutés se succèdent autour du badge. Un déplacement latéral très court fait vivre le halo.",
    kind: "echo",
    badge: "wave",
    halo: "drift",
    period: 14,
  },
  {
    id: "05",
    name: "Lueur de passage",
    description:
      "Une ellipse pleine traverse doucement le badge de gauche à droite. La lumière du bas suit le même sens.",
    kind: "fill",
    badge: "sweep",
    halo: "sweep",
    period: 13,
  },
  {
    id: "06",
    name: "Contour vivant",
    description:
      "Le contour elliptique s’incline légèrement avant de se stabiliser. Le halo accompagne cette petite bascule.",
    kind: "ring",
    badge: "tilt",
    halo: "tilt",
    period: 15,
  },
  {
    id: "07",
    name: "Diffusion",
    description:
      "Une lueur plus large et très douce se dissipe autour du badge. Le halo baisse légèrement d’intensité puis revient.",
    kind: "fill",
    badge: "diffuse",
    halo: "soften",
    period: 15,
  },
  {
    id: "08",
    name: "Retour au calme",
    description:
      "Un contour se resserre autour du badge puis disparaît. Le halo monte de quelques pixels avant de redescendre.",
    kind: "ring",
    badge: "settle",
    halo: "rise",
    period: 12,
  },
  {
    id: "09",
    name: "Relais",
    description:
      "Le badge émet une brève lueur, puis le halo répond. Les deux accents se suivent au lieu de jouer ensemble.",
    kind: "fill",
    badge: "breathe",
    halo: "reply",
    period: 14,
  },
  {
    id: "10",
    name: "Accord",
    description:
      "Un contour fin et une petite lueur se rejoignent. Le halo s’élargit à peine : le geste le plus discret de la série.",
    kind: "both",
    badge: "quiet",
    halo: "quiet",
    period: 13,
  },
] as const;

export const currentPricingMotionStudies = [
  {
    id: "11",
    name: "Expansion centrale",
    description:
      "L’ellipse jaune remplit le badge. Une seconde ellipse, de la couleur du fond, la recouvre. L’orbe se soulève puis revient.",
    kind: "mask",
    badge: "mask-center",
    halo: "orb-rise",
    period: 10,
  },
  {
    id: "12",
    name: "D’un bord à l’autre",
    description:
      "Le jaune grandit depuis la gauche ; le masque revient depuis la droite. L’orbe traverse le bas de la carte dans le même sens.",
    kind: "mask",
    badge: "mask-center",
    halo: "orb-travel",
    period: 12,
  },
  {
    id: "13",
    name: "Deux impulsions",
    description:
      "Deux remplissages jaunes successifs, chacun effacé par son masque. L’orbe s’élargit, se resserre et retrouve sa forme.",
    kind: "mask",
    badge: "mask-double",
    halo: "orb-breathe",
    period: 12,
  },
  {
    id: "14",
    name: "Onde traversante",
    description:
      "Une bande elliptique, jaune franc au centre, traverse le badge. L’arc de l’orbe balaie doucement le fond de la carte.",
    kind: "mask",
    badge: "mask-wave",
    halo: "orb-sweep",
    period: 11,
  },
  {
    id: "15",
    name: "Onde intérieure",
    description:
      "Le masque suit de près l’ellipse jaune et forme une onde courbe dans le badge. L’orbe monte en s’étirant, puis redescend.",
    kind: "mask",
    badge: "mask-ripple",
    halo: "orb-wave",
    period: 12,
  },
  {
    id: "16",
    name: "Passage de relais",
    description:
      "Le jaune remplit le badge depuis le bas, puis s’efface depuis le haut. L’orbe répond après ce premier geste, avec une montée plus ample.",
    kind: "mask",
    badge: "mask-center",
    halo: "orb-reply",
    period: 14,
  },
] as const;

export const pricingMotionStudies = [
  ...currentPricingMotionStudies,
  ...archivedPricingMotionStudies,
] as const;

export type PricingMotionStudy = (typeof pricingMotionStudies)[number];

export const productionPricingMotion = {
  id: "production",
  kind: "mask",
  badge: "production-wave",
  halo: "orb-wave",
  period: 12,
  badgePeriod: 5,
} as const;

export const pricingMotionStyle = (
  study: PricingMotionStudy | typeof productionPricingMotion,
) =>
  "--study-badge:pricing-study-" +
  study.badge +
  ";--study-halo:pricing-study-halo-" +
  study.halo +
  ";--study-mask:pricing-study-" +
  study.badge +
  "-erase" +
  ";--study-period:" +
  study.period +
  "s;--study-badge-period:" +
  ("badgePeriod" in study ? study.badgePeriod : study.period) +
  "s";
