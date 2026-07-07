import type { TutorEvent } from "../../types/tutor";

type TutorDevPanelProps = {
  event?: TutorEvent;
  devGoal: string;
};

export function TutorDevPanel({ event, devGoal }: TutorDevPanelProps) {
  return (
    <section className="panel tutor-dev-panel">
      <p className="eyebrow">Tutor Dev</p>
      <h2>{event?.title ?? "Lógica do jogo"}</h2>

      {!event && (
        <>
          <p>{devGoal}</p>
          <p>
            Faça uma jogada para ver como o tabuleiro, a matriz e as funções se
            conectam.
          </p>
        </>
      )}

      {event && (
        <>
          <div className="dev-block">
            <h3>No Go</h3>
            <p>{event.goExplanation}</p>
          </div>

          <div className="dev-block">
            <h3>No código</h3>
            <p>{event.devExplanation}</p>
          </div>

          {event.codeFocus && (
            <div className="code-card">
              <span>Trecho em foco</span>
              <code>{event.codeFocus}</code>
            </div>
          )}
        </>
      )}
    </section>
  );
}
