import type { ReactNode } from "react";

type BoardFrameProps = {
  children: ReactNode;
};

export function BoardFrame({ children }: BoardFrameProps) {
  return (
    <div className="fantasy-board-frame" aria-label="Arena tática GoQuest">
      <span className="board-corner board-corner--tl" aria-hidden="true" />
      <span className="board-corner board-corner--tr" aria-hidden="true" />
      <span className="board-corner board-corner--bl" aria-hidden="true" />
      <span className="board-corner board-corner--br" aria-hidden="true" />
      <span className="board-banner board-banner--left" aria-hidden="true" />
      <span className="board-banner board-banner--right" aria-hidden="true" />
      {children}
    </div>
  );
}
