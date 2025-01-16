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

export const dateFormatter = (stringDate: string): string => {
  const date = new Date(stringDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  for (const { unit, seconds } of intervals) {
    const diff = Math.floor(diffInSeconds / seconds);
    if (diff >= 1) {
      const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
      return `Created about ${rtf.format(-diff, unit)}`;
    }
  }

  return "just now";
};

export { toast };
