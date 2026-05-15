import { CUSTOM_SPRITE_SHEETS, PoseKey } from '../data/customSpriteOverrides';

interface Props {
  petName?: string;
  src: string;
  pose: PoseKey;
  size: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function SpriteSheetPet({ petName, src, pose, size, className = '', style = {} }: Props) {
  const sheet = petName ? CUSTOM_SPRITE_SHEETS[petName] : undefined;
  const crop = sheet?.poses[pose] ?? { x: 0, y: 0, w: 1, h: 1 };

  // Convert crop region to CSS background-size/background-position
  const bgSizeX = 100 / crop.w;
  const bgSizeY = 100 / crop.h;
  const posX = crop.w === 1 ? 0 : (crop.x / (1 - crop.w)) * 100;
  const posY = crop.h === 1 ? 0 : (crop.y / (1 - crop.h)) * 100;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${bgSizeX}% ${bgSizeY}%`,
        backgroundPosition: `${posX}% ${posY}%`,
        imageRendering: 'pixelated',
        ...style,
      }}
    />
  );
}
