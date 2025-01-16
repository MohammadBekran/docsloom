import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const parseStringify = (data: unknown) => {
  return JSON.parse(JSON.stringify(data as string));
};

export const generateRandomColor = (input: string) => {
  const hash = Array.from(input).reduce(
    (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc),
    0
  );
  const hex = Math.abs(hash).toString(16);
  const colorToReturn = `#${hex.padStart(6, "0").slice(0, 6)}`;

  return colorToReturn;
};

export { toast };
