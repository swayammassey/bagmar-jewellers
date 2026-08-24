export const Logo = ({ compact = false, white = false }) => (
  <img
    src="/logo.webp"
    alt="Bagmar Jewellers"
    data-testid="brand-logo"
    className={`w-auto object-contain ${compact ? "h-9" : "h-11 md:h-14"} ${white ? "[filter:brightness(0)_invert(1)]" : ""}`}
  />
);
