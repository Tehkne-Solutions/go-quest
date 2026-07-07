import { useEffect, useMemo, useState } from "react";
import { BoardGrid } from "../components/board/BoardGrid";
import { CameraControls, type BoardCamera } from "../components/board/CameraControls";
import { CharacterPanel } from "../components/character/CharacterPanel";
import { CodexPanel } from "../components/character/CodexPanel";
import { TutorDevPanel } from "../components/tutor/TutorDevPanel";
import { TutorEventLog } from "../components/tutor/TutorEventLog";
import { TutorGoPanel } from "../components/tutor/TutorGoPanel";
import { createStoneCharacter, getRoleForMission } from "../data/characters";
import { missions } from "../data/missions";
import { playMove } from "../engine/playMove";
import type { StoneCharacter } from "../types/character";
import type { Board, CaptureCounter, MissionId, PlayerColor, Position } from "../types/game";
import type { TutorEvent } from "../types/tutor";

type MedalId = "breath-master" | "first-capture" | "squad-link";

type ProgressState = {
  xp: number;
  completedMissions: MissionId[];
  medals: MedalId[];
};

const progressStorageKey = "goquest-progress-v1";

const medalLabels: Record<MedalId, string> = {
  "breath-master": "Guardião das Liberdades",
  "first-capture": "Primeira Captura",
  "squad-link": "Conector de Squads"
};

const missionRewards: Record<MissionId, { xp: number; medal: MedalId }> = {
  breath: { xp: 50, medal: "breath-master" },
  capture: { xp: 75, medal: "first-capture" },
  squad: { xp: 75, medal: "squad-link" }
};

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

function loadProgress(): ProgressState {
  if (typeof window === "undefined") {
    return { xp: 0, completedMissions: [], medals: [] };
  }

  try {
    const saved = window.localStorage.getItem(progressStorageKey);

    if (!saved) {
      return { xp: 0, completedMissions: [], medals: [] };
    }

    return JSON.parse(saved) as ProgressState;
  } catch {
    return { xp: 0, completedMissions: [], medals: [] };
  }
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
  const [boardCamera, setBoardCamera] = useState<BoardCamera>("iso");
  const [selectedCharacter, setSelectedCharacter] = useState<StoneCharacter | undefined>();
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  const selectedEvent = tutorEvents[selectedEventIndex];
  const isMissionComplete = progress.completedMissions.includes(mission.id);

  useEffect(() => {
    window.localStorage.setItem(progressStorageKey, JSON.stringify(progress));
  }, [progress]);

  function resetMission(nextMissionId = mission.id) {
    const nextMission = missions.find((item) => item.id === nextMissionId) ?? missions[0];

    setMissionId(nextMission.id);
    setBoard(nextMission.createInitialBoard());
    setCurrentPlayer(nextMission.player);
    setTutorEvents([]);
    setSelectedEventIndex(0);
    setSelectedCharacter(undefined);
    setMessage("Sensei Grid: missão carregada. Observe o objetivo e teste no tabuleiro.");
    setCaptures({ BLACK: 0, WHITE: 0 });
    setShowTarget(true);
  }

  function completeMission() {
    const reward = missionRewards[mission.id];

    setProgress((current) => {
      if (current.completedMissions.includes(mission.id)) {
        return current;
      }

      return {
        xp: current.xp + reward.xp,
        completedMissions: [...current.completedMissions, mission.id],
        medals: current.medals.includes(reward.medal)
          ? current.medals
          : [...current.medals, reward.medal]
      };
    });
  }

  function handlePlay(position: Position) {
    const clickedCell = board[position.y][position.x];

    if (clickedCell.state !== "EMPTY") {
      setSelectedCharacter(clickedCell.character);
      setMessage(clickedCell.character ? `${clickedCell.character.name} selecionado no campo.` : "Unidade selecionada.");
      return;
    }

    const role = getRoleForMission(mission.id);
    const actor = createStoneCharacter(currentPlayer, role, position, progress.xp + captures[currentPlayer]);
    const result = playMove(board, position, currentPlayer, actor);

    setTutorEvents(result.tutorEvents);
    setSelectedEventIndex(Math.max(0, result.tutorEvents.length - 1));
    setMessage(result.message);

    if (!result.success) {
      return;
    }

    setBoard(result.board);
    setSelectedCharacter(actor);

    if (result.captured.length > 0) {
      setCaptures((current) => ({
        ...current,
        [currentPlayer]: current[currentPlayer] + result.captured.length
      }));
    }

    const completedExpectedMove = samePosition(position, mission.expectedMove);

    if (completedExpectedMove) {
      completeMission();
      setMessage(mission.successMessage);
      return;
    }

    setCurrentPlayer(nextPlayer(currentPlayer));
  }

  function goToNextMission() {
    const nextMissionId = getNextMissionId(mission.id);
    resetMission(nextMissionId);
  }

  return (
    <main className="app-shell app-shell--game">
      <header className="hero game-hero">
        <div>
          <p className="eyebrow">GoQuest Sprint 4</p>
          <h1>Reino do Tabuleiro</h1>
          <p>
            Go como campanha medieval: unidades entram no campo, formam companhias e revelam a lógica do motor.
          </p>
        </div>
        <div className="signature">Tehkné Solutions</div>
      </header>

      <nav className="game-menu" aria-label="Menu de jogo">
        <button type="button" onClick={() => resetMission("breath")}>Jornada</button>
        <button type="button" onClick={() => setShowTarget((value) => !value)}>{showTarget ? "Dica ativa" : "Dica oculta"}</button>
        <button type="button" onClick={() => resetMission()}>Reiniciar</button>
      </nav>

      <section className="status-bar" aria-label="Estado do jogo">
        <div>
          <strong>Turno</strong>
          <span>{currentPlayer === "BLACK" ? "Preta" : "Branca"}</span>
        </div>
        <div>
          <strong>XP</strong>
          <span>{progress.xp}</span>
        </div>
        <div>
          <strong>Medalhas</strong>
          <span>{progress.medals.length}</span>
        </div>
        <div>
          <strong>Missões</strong>
          <span>{progress.completedMissions.length}/{missions.length}</span>
        </div>
      </section>

      <section className="journey-panel" aria-label="Jornada do Mundo 1">
        <div>
          <p className="eyebrow">Mundo 1</p>
          <h2>O Tabuleiro Vivo</h2>
          <p>Complete as missões para liberar a base mental do Go: respirar, capturar e conectar.</p>
        </div>

        <div className="mission-tabs">
          {missions.map((item) => {
            const completed = progress.completedMissions.includes(item.id);
            const active = item.id === mission.id;

            return (
              <button
                key={item.id}
                className={`mission-tab ${active ? "mission-tab--active" : ""}`}
                type="button"
                onClick={() => resetMission(item.id)}
              >
                <span>{completed ? "✓" : "•"}</span>
                <strong>{item.title}</strong>
              </button>
            );
          })}
        </div>

        {progress.medals.length > 0 && (
          <div className="medal-row">
            {progress.medals.map((medal) => (
              <span key={medal}>{medalLabels[medal]}</span>
            ))}
          </div>
        )}
      </section>

      <section className="workspace workspace--cinematic">
        <TutorGoPanel mission={mission} message={message} />

        <section className="board-card board-card--cinematic">
          <div className="board-header">
            <div>
              <p className="eyebrow">Campo 2.5D</p>
              <h2>{mission.concept}</h2>
            </div>
            <div className="board-header-actions">
              <CameraControls value={boardCamera} onChange={setBoardCamera} />
              <button type="button" onClick={() => setShowTarget((value) => !value)}>
                {showTarget ? "Ocultar dica" : "Mostrar dica"}
              </button>
            </div>
          </div>

          <BoardGrid
            board={board}
            expectedMove={mission.expectedMove}
            showTarget={showTarget}
            camera={boardCamera}
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

        <div className="tutor-stack tutor-stack--game">
          <CharacterPanel board={board} character={selectedCharacter} />
          <TutorDevPanel event={selectedEvent} devGoal={mission.devGoal} />
          <TutorEventLog
            events={tutorEvents}
            selectedIndex={selectedEventIndex}
            onSelect={setSelectedEventIndex}
          />
          <CodexPanel />
        </div>
      </section>
    </main>
  );
}
