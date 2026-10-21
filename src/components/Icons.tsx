type IconProps = {
  name:
    | "arrow"
    | "check"
    | "book"
    | "bolt"
    | "chart"
    | "reset"
    | "code"
    | "chevron"
    | "close";
  size?: number;
  className?: string;
};

const paths: Record<IconProps["name"], string> = {
  arrow: "M4 12h15m-6-6 6 6-6 6",
  check: "m5 12 4 4L19 6",
  book: "M12 5v15m0-15C8 2 4 3 3 4v14c3-1 6-1 9 2m0-15c4-3 8-2 9-1v14c-3-1-6-1-9 2",
  bolt: "m13 2-9 12h7l-1 8 10-13h-7l1-7Z",
  chart: "M4 20V10m8 10V4m8 16v-7",
  reset: "M4 10a8 8 0 1 1 1 8M4 4v6h6",
  code: "m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18",
  chevron: "m9 5 7 7-7 7",
  close: "m6 6 12 12M6 18 18 6",
};

export function Icon({ name, size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function BadgerMark() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="12" fill="currentColor" />
      <path d="m9 13 5-5 6 5 6-5 5 5-2 15-9 5-9-5-2-15Z" fill="#202323" />
      <path
        d="m14 12 3 2-3 12-3-3 3-11Zm12 0 3 11-3 3-3-12 3-2Z"
        fill="#F0EEE6"
      />
      <path d="m18 26 2-2 2 2-2 3-2-3Z" fill="#F0EEE6" />
    </svg>
  );
}
