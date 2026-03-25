import boxingDark from "../assets/images/boxing-dark.svg";
import boxingLight from "../assets/images/boxing-light.svg";
import gymDark from "../assets/images/gym-dark.svg";
import gymLight from "../assets/images/gym-light.svg";
import minimalDark from "../assets/images/minimal-dark.svg";
import minimalLight from "../assets/images/minimal-light.svg";

export const themePresets = {
  gym: {
    id: "gym",
    label: "Gym",
    eyebrow: "Performance Lab",
    title: "Steel textures, velocity data, and a competition-grade pulse.",
    description:
      "Built for strength programs, aggressive gradients, and dashboard-style confidence.",
    badge: "Strength First",
    highlights: ["Compound focus", "Emerald neon", "Arena depth"],
    backgroundImages: {
      light: gymLight,
      dark: gymDark,
    },
  },
  boxing: {
    id: "boxing",
    label: "Boxing",
    eyebrow: "Fight Night",
    title: "High contrast rounds with redline energy and ring-light discipline.",
    description:
      "Sharper accents, impact visuals, and a tighter rhythm for speed sessions and bag work.",
    badge: "Strike Rhythm",
    highlights: ["Round pacing", "Impact contrast", "Corner-card cues"],
    backgroundImages: {
      light: boxingLight,
      dark: boxingDark,
    },
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    eyebrow: "Quiet Precision",
    title: "Reduced noise, premium spacing, and calm focus for repeatable training.",
    description:
      "Neutral surfaces and editorial typography for a cleaner planning and session experience.",
    badge: "Calm Control",
    highlights: ["Editorial balance", "Low-noise UI", "Focus mode"],
    backgroundImages: {
      light: minimalLight,
      dark: minimalDark,
    },
  },
};
