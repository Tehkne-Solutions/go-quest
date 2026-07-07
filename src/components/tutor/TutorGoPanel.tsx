import type { Mission } from "../../data/missions";

type TutorGoPanelProps = {
  mission: Mission;
  message: string;
};

export function TutorGoPanel({ mission, message }: TutorGoPanelProps) {
  return (
    <section className="panel tutor-go-panel">
      <p className="eyebrow">Tutor Go</p>
      <h2>{mission.title}</h2>
      <p>{mission.intro}</p>

      <div className="mission-box">
        <strong>Conceito:</strong>
        <span>{mission.concept}</span>
      </div>

      <div className="mission-box mission-box--goal">
        <strong>Missão:</strong>
        <span>{mission.goal}</span>
      </div>

      <p className="teacher-message">{message}</p>
    </section>
  );
}
