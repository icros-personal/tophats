/**
 * The front-page hero: a magician's top hat (upside down) with a small critter —
 * wearing its own tiny top hat — that periodically pops out to say hello.
 *
 * Inline SVG on purpose: every part has a class, so it can be animated from CSS
 * (see .hero-art rules in styles.css) and later from JS.
 */
export default function HeroArt() {
  // Geometry for the upside-down hat. y0 = the opening (brim level).
  const cx = 500;
  const y0 = 250;
  const h = 230; // crown depth
  const bw = 300; // crown width at the opening
  const tw = 280; // crown width at the bottom (the hat's "top")
  const ryb = 30;
  const ryt = 28;
  const R = 235; // brim radius
  const Rr = 48;

  return (
    <svg className="hero-art" viewBox="0 0 1000 560" role="img" aria-labelledby="hero-art-title">
      <title id="hero-art-title">A small round creature in a tiny top hat peeking out of a giant top hat</title>

      {/* sparkles */}
      <g className="sparkles" fill="var(--mustard)">
        <path className="sparkle s1" d="M170 150 l10 26 26 10 -26 10 -10 26 -10 -26 -26 -10 26 -10z" />
        <path className="sparkle s2" d="M820 110 l7 18 18 7 -18 7 -7 18 -7 -18 -18 -7 18 -7z" fill="var(--coral)" />
        <path className="sparkle s3" d="M860 330 l9 22 22 9 -22 9 -9 22 -9 -22 -22 -9 22 -9z" fill="var(--mint)" />
        <path className="sparkle s4" d="M120 360 l6 15 15 6 -15 6 -6 15 -6 -15 -15 -6 15 -6z" fill="var(--plum)" />
      </g>

      {/* floor shadow */}
      <ellipse cx={cx} cy={y0 + h + 30} rx="230" ry="26" fill="#000" opacity="0.12" />

      {/* brim (full) + the dark inside of the hat */}
      <ellipse cx={cx} cy={y0 + 8} rx={R} ry={Rr} fill="#1b1424" />
      <ellipse cx={cx} cy={y0} rx={R} ry={Rr} fill="var(--ink)" />
      <ellipse cx={cx} cy={y0} rx={bw / 2} ry={ryb} fill="#120c19" />

      {/* the critter (drawn before the crown so the crown hides its lower half) */}
      <g className="critter">
        <ellipse cx={cx} cy="235" rx="100" ry="88" fill="#7fb4e8" />
        <ellipse cx={cx - 30} cy="190" rx="50" ry="22" fill="#fff" opacity="0.15" />
        <g className="critter-eyes">
          <ellipse cx={cx - 34} cy="215" rx="17" ry="21" fill="#fff" />
          <ellipse cx={cx + 34} cy="215" rx="17" ry="21" fill="#fff" />
          <circle cx={cx - 30} cy="220" r="9" fill="var(--ink)" />
          <circle cx={cx + 38} cy="220" r="9" fill="var(--ink)" />
          <circle cx={cx - 27} cy="216" r="3" fill="#fff" />
          <circle cx={cx + 41} cy="216" r="3" fill="#fff" />
        </g>
        <ellipse cx={cx - 66} cy="250" rx="14" ry="8" fill="#f48fb1" opacity="0.6" />
        <ellipse cx={cx + 66} cy="250" rx="14" ry="8" fill="#f48fb1" opacity="0.6" />
        {/* its own tiny top hat */}
        <g className="critter-hat">
          <ellipse cx={cx + 6} cy="152" rx="46" ry="10" fill="var(--ink)" />
          <path
            d={`M ${cx - 22} 152 L ${cx - 18} 92 A 24 6 0 0 1 ${cx + 30} 92 L ${cx + 34} 152 A 28 7 0 0 1 ${cx - 22} 152 Z`}
            fill="var(--ink)"
          />
          <path
            d={`M ${cx - 21} 140 L ${cx + 33} 140 L ${cx + 34} 150 A 28 7 0 0 1 ${cx - 22} 150 Z`}
            fill="var(--coral)"
          />
          <ellipse cx={cx + 6} cy="92" rx="24" ry="6" fill="#4a3d5c" />
        </g>
      </g>

      {/* the crown (upside down), covering the critter's lower half */}
      <path
        d={`M ${cx - bw / 2} ${y0} A ${bw / 2} ${ryb} 0 0 0 ${cx + bw / 2} ${y0}
            L ${cx + tw / 2} ${y0 + h} A ${tw / 2} ${ryt} 0 0 1 ${cx - tw / 2} ${y0 + h} Z`}
        fill="var(--ink)"
      />
      {/* band, near the opening since the hat is upside down */}
      <path
        d={`M ${cx - bw / 2} ${y0} A ${bw / 2} ${ryb} 0 0 0 ${cx + bw / 2} ${y0}
            L ${cx + 149} ${y0 + 60} A 149 ${ryb} 0 0 1 ${cx - 149} ${y0 + 60} Z`}
        fill="var(--plum)"
      />
      <rect x={cx - 110} y={y0 + 70} width="16" height="140" rx="8" fill="#fff" opacity="0.1" />
      <ellipse cx={cx} cy={y0 + h} rx={tw / 2} ry={ryt} fill="#1b1424" />

      {/* front lip of the brim, in front of everything */}
      <path
        d={`M ${cx - R} ${y0} A ${R} ${Rr} 0 0 0 ${cx + R} ${y0}
            L ${cx + bw / 2} ${y0} A ${bw / 2} ${ryb} 0 0 1 ${cx - bw / 2} ${y0} Z`}
        fill="#3a2f48"
      />
    </svg>
  );
}
