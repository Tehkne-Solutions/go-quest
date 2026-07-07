import type { TutorEvent } from "../../types/tutor";

type TutorEventLogProps = {
  events: TutorEvent[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export function TutorEventLog({ events, selectedIndex, onSelect }: TutorEventLogProps) {
  return (
    <section className="panel event-log-panel">
      <p className="eyebrow">Passos da jogada</p>
      <h2>Debug narrado</h2>

      {events.length === 0 && (
        <p className="muted">Nenhuma jogada ainda. Clique no tabuleiro para começar.</p>
      )}

      <div className="event-list">
        {events.map((event, index) => (
          <button
            key={`${event.title}-${index}`}
            className={`event-item ${selectedIndex === index ? "event-item--active" : ""}`}
            type="button"
            onClick={() => onSelect(index)}
          >
            <span>{index + 1}</span>
            <strong>{event.title}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}
