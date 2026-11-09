import { faceBackground } from '@/components/avatar/CharacterBlock';

export type SpikeShape = {
  /** Center of the square base, in model pixels. */
  x: number;
  y: number;
  z: number;
  /** Width of the square base. */
  base: number;
  /** Distance from base to tip; the tip points up (-y) before rotation. */
  height: number;
  /** Lean towards the back (+) or front (-), in degrees. */
  rx?: number;
  /** Turn around the vertical axis, in degrees. */
  ry?: number;
  /** Lean towards the right (+) or left (-), in degrees. */
  rz?: number;
};

type CharacterSpikeProps = SpikeShape & { color: string };

// Front, right, back, left — same light direction as CharacterBlock.
const SIDE_SHADES = [1, 0.84, 0.68, 0.78];

/** A four-sided pyramid built from CSS 3D triangles. */
export default function CharacterSpike({ x, y, z, base, height, rx = 0, ry = 0, rz = 0, color }: CharacterSpikeProps) {
  const half = base / 2;
  const slant = Math.hypot(height, half);
  const tilt = (Math.atan2(half, height) * 180) / Math.PI;

  return (
    <div
      className="absolute left-0 top-0"
      style={{
        transformStyle: 'preserve-3d',
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateZ(${rz}deg) rotateX(${rx}deg)`,
      }}
    >
      {SIDE_SHADES.map((shade, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            width: base,
            height: slant,
            left: -half,
            top: -slant,
            transformOrigin: '50% 100%',
            transform: `rotateY(${index * 90}deg) translateZ(${half}px) rotateX(${tilt}deg)`,
            clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
            background: faceBackground(color, shade),
          }}
        />
      ))}
    </div>
  );
}
