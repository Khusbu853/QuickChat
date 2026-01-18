import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from "@/assets/lottie-json.json"


export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-red-900/60 text-red-200 border border-red-400/40",
  "bg-green-900/60 text-green-200 border border-green-400/40",
  "bg-blue-900/60 text-blue-200 border border-blue-400/40",
  "bg-yellow-900/60 text-yellow-200 border border-yellow-400/40",
];


export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0];
}

export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
}
