import { useState } from "react";
import type { StoneCharacter } from "../../types/character";
import type { Board } from "../../types/game";
import type { TutorEvent } from "../../types/tutor";
import { CharacterPanel } from "../character/CharacterPanel";
import { CodexPanel } from "../character/CodexPanel";
import { TutorDevPanel } from "../tutor/TutorDevPanel";
import { TutorEventLog } from "../tutor/TutorEventLog";

type RightPanelTab = "unit" | "dev" | "debug" | "codex";

type RightPanelTabsProps = {
  board: Board;
  selectedCharacter?: StoneCharacter;
  selectedEvent?: TutorEvent;
  devGoal: string;
  events: TutorEvent[];
  selectedEventIndex: number;
  onSelectEvent: (index: number) => void;
};

const tabLabels: Record<RightPanelTab, string> = {
  unit: "Unidade",
  dev: "Tutor Dev",
  debug: "Debug",
  codex: "Codex"
};

export function RightPanelTabs({
  board,
  selectedCharacter,
  selectedEvent,
  devGoal,
  events,
  selectedEventIndex,
  onSelectEvent
}: RightPanelTabsProps) {
  const [activeTab, setActiveTab] = useState<RightPanelTab>("unit");

  return (
    <aside className="right-panel-shell">
      <div className="right-panel-tabs" role="tablist" aria-label="Painel contextual">
        {(Object.keys(tabLabels) as RightPanelTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "right-panel-tab right-panel-tab--active" : "right-panel-tab"}
            onClick={() => setActiveTab(tab)}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      <div className="right-panel-content">
        {activeTab === "unit" && <CharacterPanel board={board} character={selectedCharacter} />}
        {activeTab === "dev" && <TutorDevPanel event={selectedEvent} devGoal={devGoal} />}
        {activeTab === "debug" && (
          <TutorEventLog
            events={events}
            selectedIndex={selectedEventIndex}
            onSelect={onSelectEvent}
          />
        )}
        {activeTab === "codex" && <CodexPanel />}
      </div>
    </aside>
  );
}
