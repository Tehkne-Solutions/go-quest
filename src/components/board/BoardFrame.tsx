import type { ReactNode } from "react";

type BoardFrameProps = {
  children: ReactNode;
};

export function BoardFrame({ children }: BoardFrameProps) {
  return <div className="fantasy-board-frame" aria-label="Arena tática GoQuest">{children}</div>;
}
