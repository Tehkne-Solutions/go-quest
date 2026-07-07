import { useMemo, useState } from "react";
import { BoardGrid } from "../components/board/BoardGrid";
import { TutorDevPanel } from "../components/tutor/TutorDevPanel";
import { TutorEventLog } from "../components/tutor/TutorEventLog";
import { TutorGoPanel } from "../components/tutor/TutorGoPanel";
import { missions } from "../data/missions";
import { playMove } from "../engine/playMove";
import type { Board, CaptureCounter, MissionId, PlayerColor, Position } from "../types/game";
import type { TutorEvent } from "../types/tutor";

function samePosition(a?: Position, b?: Position): boolean {
  return Boolean(a && b && a.x === b.x && a.y === b.y);
}

function nextPlayer(player: PlayerColor): PlayerColor {
  return player === "BLACK" ? "WHITE" : "BLACK";
}

function getNextMissionId(current: MissionId): MissionId {
  const index = missions.findIndex((mission) => mission.id === current);
  return missions[Math.min(index + 1, missions.length - 1)].id;
}

export function BoardScreen() {
  const [missionId, setMissionId] = useState<MissionId>("breath");
  const mission = useMemo(
    () => missions.find((item) => item.id === missionId) ?? missions[0],
    [missionId]
  );

  const [board, setBoard] = useState<Board>(() => mission.createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<PlayerColor>(mission.player);
  const [message, setMessage] = useState(
    "Sensei Grid: primeiro observe o mapa. Cada clique muda o estado do jogo."
  );
  const [tutorEvents, setTutorEvents] = useState<TutorEvent[]>([]);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [captures, setCaptures] = useState<CaptureCounter>({ BLACK: 0, WHITE: 0 });
  const [showTarget, setShowTarget] = useState(true);
  const [completedMissions, setCompletedMissions] = useState<MissionId[]>([]);

  const selectedEvent = tutorEvents[selectedEventIndex];
  const isMissionComplete = completedMissions.includes(mission.id);

  function resetMission(nextMissionId = mission.id) {
    const nextMission = missions.find((item) => item.id === nextMissionId) ?? missions[0];

    setMissionId(nextMission.id);
    setBoard(nextMission.createInitialBoard());
    setCurrentPlayer(nextMission.player);
    setTutorEvents([]);
    setSelectedEventIndex(0);
    setMessage("Sensei Grid: missão reiniciada. Observe o objetivo e teste no tabuleiro.");
    setCaptures({ BLACK: 0, WHITE: 0 });
    setShowTarget(true);
  }

  function handlePlay(position: Position) {
    const result = playMove(board, position, currentPlayer);

    setTutorEvents(result.tutorEvents);
    setSelectedEventIndex(Math.max(0, result.tutorEvents.length - 1));
    setMessage(result.message);

    if (!result.success) {
      return;
    }

    setBoard(result.board);

    if (result.captured.length > 0) {
      setCaptures((current) => ({
        ...current,
        [currentPlayer]: current[currentPlayer] + result.captured.length
      }));
    }

    const completedExpectedMove = samePosition(position, mission.expectedMove);

    if (completedExpectedMove && !completedMissions.includes(mission.id)) {
      setCompletedMissions((current) => [...current, mission.id]);
      setMessage(mission.successMessage);
    }

    if (!completedExpectedMove) {
      setCurrentPlayer(nextPlayer(currentPlayer));
    }
  }

  function goToNextMission() {
    const nextMissionId = getNextMissionId(mission.id);
    resetMission(nextMissionId);
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">GoQuest Sprint 1</p>
          <h1>Modo Tutor: Go + Programação</h1>
          <p>
            Aprenda a jogar Go e veja o motor do jogo sendo explicado como matriz,
            estado, vizinhos, grupos, liberdades e captura.
          </p>
        </div>
        <div className="signature">Tehkné Solutions</div>
      </header>

      <section className="status-bar" aria-label="Estado do jogo">
        <div>
          <strong>Turno</strong>
          <span>{currentPlayer === "BLACK" ? "Preta" : "Branca"}</span>
        </div>
        <div>
          <strong>Capturas pretas</strong>
          <span>{captures.BLACK}</span>
        </div>
        <div>
          <strong>Capturas brancas</strong>
          <span>{captures.WHITE}</span>
        </div>
        <div>
          <strong>Missões</strong>
          <span>{completedMissions.length}/{missions.length}</span>
        </div>
      </section>

      <section className="workspace">
        <TutorGoPanel mission={mission} message={message} />

        <section className="board-card">
          <div className="board-header">
            <div>
              <p className="eyebrow">Tabuleiro 5x5</p>
              <h2>{mission.concept}</h2>
            </div>
            <button type="button" onClick={() => setShowTarget((value) => !value)}>
              {showTarget ? "Ocultar dica" : "Mostrar dica"}
            </button>
          </div>

          <BoardGrid
            board={board}
            expectedMove={mission.expectedMove}
            showTarget={showTarget}
            onCellClick={handlePlay}
          />

          <div className="board-actions">
            <button type="button" onClick={() => resetMission()}>
              Reiniciar missão
            </button>
            <button type="button" onClick={goToNextMission} disabled={mission.id === missions[missions.length - 1].id}>
              Próxima missão
            </button>
          </div>

          {isMissionComplete && (
            <div className="success-card">
              <strong>Missão concluída</strong>
              <span>{mission.successMessage}</span>
            </div>
          )}
        </section>

        <div className="tutor-stack">
          <TutorDevPanel event={selectedEvent} devGoal={mission.devGoal} />
          <TutorEventLog
            events={tutorEvents}
            selectedIndex={selectedEventIndex}
            onSelect={setSelectedEventIndex}
          />
        </div>
      </section>
    </main>
  );
}
