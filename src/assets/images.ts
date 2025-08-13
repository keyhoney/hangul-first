import circle from "./images/circle.svg";
import square from "./images/square.svg";
import triangle from "./images/triangle.svg";
import star from "./images/star.svg";

const IMAGE_MAP: Record<string, string> = {
  "assets/images/circle.svg": circle,
  "assets/images/square.svg": square,
  "assets/images/triangle.svg": triangle,
  "assets/images/star.svg": star,
};

export function resolveImage(path: string): string {
  return IMAGE_MAP[path] ?? path;
}


