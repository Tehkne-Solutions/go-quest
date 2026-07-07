export type BoardCamera = "top" | "iso" | "cinematic" | "rotated";

const cameraLabels: Record<BoardCamera, string> = {
  top: "Top-down",
  iso: "Isométrico",
  cinematic: "Cinemático",
  rotated: "Rotacionado"
};

type CameraControlsProps = {
  value: BoardCamera;
  onChange: (camera: BoardCamera) => void;
};

export function CameraControls({ value, onChange }: CameraControlsProps) {
  const cameras = Object.entries(cameraLabels) as Array<[BoardCamera, string]>;

  return (
    <div className="camera-controls" aria-label="Controles de câmera do tabuleiro">
      {cameras.map(([camera, label]) => (
        <button
          key={camera}
          type="button"
          className={value === camera ? "camera-button camera-button--active" : "camera-button"}
          onClick={() => onChange(camera)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
