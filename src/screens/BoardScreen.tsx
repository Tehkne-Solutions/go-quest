import { useEffect, useMemo, useState } from "react";
import { BoardGrid } from "../components/board/BoardGrid";
import { CameraControls, type BoardCamera } from "../components/board/CameraControls";
import { RightPanelTabs } from "../components/panels/RightPanelTabs";
import { TutorGoPanel } from "../components/tutor/TutorGoPanel";
import { createStoneCharacter, getRoleForMission } from "../data/characters";
import { missions } from "../data/missions";
import { puzzles } from "../data/puzzles";
import { createBoard } from "../engine/createBoard";
import { playMove } from "../engine/playMove";
import type { CharacterRole, StoneCharacter } from "../types/character";
import type { Board, CaptureCounter, MissionId, PlayerColor, Position } from "../types/game";
import type { TutorEvent } from "../types/tutor";

type MedalId = "breath-master" | "first-capture" | "squad-link";
type Mode = "mission" | "puzzle" | "free";

type ProgressState = {
  xp: number;
  completedMissions: MissionId[];
  completedPuzzles: string[];
  medals: MedalId[];
};

const progressStorageKey = "goquest-progress-v4";

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

const freeLesson = {
  title: "Campo Livre",
  concept: "Experimentação",
  intro: "Teste formações, cercos, conexões e captura sem objetivo fixo.",
  goal: "Coloque unidades no tabuleiro e observe o Tutor Dev.",
  successMessage: "Experimento registrado.",
  devGoal: "Explorar matriz, vizinhos, grupos, liberdades, captura e formação."
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

function emptyProgress(): ProgressState {
  return { xp: 0, completedMissions: [], completedPuzzles: [], medals: [] };
}

function loadProgress(): ProgressState {
  if (typeof window === "undefined") return emptyProgress();

  try {
    const saved =
      window.localStorage.getItem(progressStorageKey) ??
      window.localStorage.getItem("goquest-progress-v1");

    if (!saved) return emptyProgress();

    const parsed = JSON.parse(saved) as Partial<ProgressState>;

    return {
      xp: parsed.xp ?? 0,
      completedMissions: parsed.completedMissions ?? [],
      completedPuzzles: parsed.completedPuzzles ?? [],
      medals: parsed.medals ?? []
    };
  } catch {
    return emptyProgress();
  }
}

function roleForPuzzle(concept: string): CharacterRole {
  const text = concept.toLowerCase();

  if (text.includes("captura") || text.includes("cerco")) return "HUNTER";
  if (text.includes("conex") || text.includes("conectar")) return "LINK";
  if (text.includes("territ")) return "BUILDER";
  if (text.includes("atari") || text.includes("salvar")) return "GUARD";
  return "SCOUT";
}

export function BoardScreen() {
  const [mode, setMode] = useState<Mode>("mission");
  const [missionId, setMissionId] = useState<MissionId>("breath");
  const [puzzleId, setPuzzleId] = useState(puzzles[0].id);
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  const mission = useMemo(
    () => missions.find((item) => item.id === missionId) ?? missions[0],
    [missionId]
  );

  const puzzle = useMemo(
    () => puzzles.find((item) => item.id === puzzleId) ?? puzzles[0],
    [puzzleId]
  );

  const activeLesson = mode === "mission" ? mission : mode === "puzzle" ? puzzle : freeLesson;
  const targetMove = mode === "mission" ? mission.expectedMove : mode === "puzzle" ? puzzle.solution : undefined;

  const [board, setBoard] = useState<Board>(() => mission.createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<PlayerColor>("BLACK");
  const [message, setMessage] = useState("O campo está pronto. Escolha uma ordem.");
  const [tutorEvents, setTutorEvents] = useState<TutorEvent[]>([]);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [captures, setCaptures] = useState<CaptureCounter>({ BLACK: 0, WHITE: 0 });
  const [showTarget, setShowTarget] = useState(true);
  const [boardCamera, setBoardCamera] = useState<BoardCamera>("iso");
  const [selectedCharacter, setSelectedCharacter] = useState<StoneCharacter | undefined>();
  const [selectedPosition, setSelectedPosition] = useState<Position | undefined>();
  const [hasPlayedCurrentRun, setHasPlayedCurrentRun] = useState(false);

  const selectedEvent = tutorEvents[selectedEventIndex];
  const isMissionComplete = progress.completedMissions.includes(mission.id);
  const isPuzzleComplete = progress.completedPuzzles.includes(puzzle.id);

  useEffect(() => {
    window.localStorage.setItem(progressStorageKey, JSON.stringify(progress));
  }, [progress]);

  function loadMission(nextMissionId = mission.id) {
    const nextMission = missions.find((item) => item.id === nextMissionId) ?? missions[0];

    setMode("mission");
    setMissionId(nextMission.id);
    setBoard(nextMission.createInitialBoard());
    setCurrentPlayer(nextMission.player);
    setTutorEvents([]);
    setSelectedEventIndex(0);
    setSelectedCharacter(undefined);
    setSelectedPosition(undefined);
    setHasPlayedCurrentRun(false);
    setMessage("Missão carregada. Observe o objetivo e teste no tabuleiro.");
    setCaptures({ BLACK: 0, WHITE: 0 });
    setShowTarget(true);
  }

  function loadPuzzle(nextPuzzleId = puzzle.id) {
    const nextPuzzle = puzzles.find((item) => item.id === nextPuzzleId) ?? puzzles[0];

    setMode("puzzle");
    setPuzzleId(nextPuzzle.id);
    setBoard(nextPuzzle.createInitialBoard());
    setCurrentPlayer("BLACK");
    setTutorEvents([]);
    setSelectedEventIndex(0);
    setSelectedCharacter(undefined);
    setSelectedPosition(undefined);
    setHasPlayedCurrentRun(false);
    setMessage("Puzzle carregado. Encontre a melhor ordem.");
    setCaptures({ BLACK: 0, WHITE: 0 });
    setShowTarget(true);
  }

  function openFreeMode() {
    setMode("free");
    setBoard(createBoard(5));
    setCurrentPlayer("BLACK");
    setTutorEvents([]);
    setSelectedEventIndex(0);
    setSelectedCharacter(undefined);
    setSelectedPosition(undefined);
    setHasPlayedCurrentRun(false);
    setMessage("Campo livre aberto. Experimente formações e leia o Tutor Dev.");
    setCaptures({ BLACK: 0, WHITE: 0 });
    setShowTarget(false);
  }

  function clearProgress() {
    window.localStorage.removeItem(progressStorageKey);
    window.localStorage.removeItem("goquest-progress-v1");
    setProgress(emptyProgress());
    loadMission("breath");
    setMessage("Progresso local limpo. A campanha reiniciou.");
  }

  function completeMission() {
    const reward = missionRewards[mission.id];

    setProgress((current) => {
      if (current.completedMissions.includes(mission.id)) return current;

      return {
        ...current,
        xp: current.xp + reward.xp,
        completedMissions: [...current.completedMissions, mission.id],
        medals: current.medals.includes(reward.medal)
          ? current.medals
          : [...current.medals, reward.medal]
      };
    });
  }

  function completePuzzle() {
    setProgress((current) => {
      if (current.completedPuzzles.includes(puzzle.id)) return current;

      return {
        ...current,
        xp: current.xp + 35,
        completedPuzzles: [...current.completedPuzzles, puzzle.id]
      };
    });
  }

  function handlePlay(position: Position) {
    const clickedCell = board[position.y][position.x];

    if (clickedCell.state !== "EMPTY") {
      setSelectedCharacter(clickedCell.character);
      setSelectedPosition(position);
      setMessage(clickedCell.character ? `${clickedCell.character.name} selecionado no campo.` : "Unidade selecionada.");
      return;
    }

    if (mode !== "free" && hasPlayedCurrentRun) {
      setMessage("Rodada já concluída neste replay. Use Rejogar ou avance para outro desafio.");
      return;
    }

    const role =
      mode === "mission"
        ? getRoleForMission(mission.id)
        : mode === "puzzle"
          ? roleForPuzzle(puzzle.concept)
          : "SCOUT";

    const actor = createStoneCharacter(currentPlayer, role, position, progress.xp + captures[currentPlayer]);
    const result = playMove(board, position, currentPlayer, actor);

    setTutorEvents(result.tutorEvents);
    setSelectedEventIndex(Math.max(0, result.tutorEvents.length - 1));
    setMessage(result.message);

    if (!result.success) return;

    setBoard(result.board);
    setSelectedCharacter(actor);
    setSelectedPosition(position);
    setHasPlayedCurrentRun(mode !== "free");

    if (result.captured.length > 0) {
      setCaptures((current) => ({
        ...current,
        [currentPlayer]: current[currentPlayer] + result.captured.length
      }));
    }

    if (samePosition(position, targetMove) && mode === "mission") {
      completeMission();
      setMessage(mission.successMessage);
      return;
    }

    if (samePosition(position, targetMove) && mode === "puzzle") {
      completePuzzle();
      setMessage(puzzle.successMessage);
      return;
    }

    setCurrentPlayer(nextPlayer(currentPlayer));
  }

  function goToNextMission() {
    const nextMissionId = getNextMissionId(mission.id);
    loadMission(nextMissionId);
  }

  function goToNextPuzzle() {
    const index = puzzles.findIndex((item) => item.id === puzzle.id);
    const nextPuzzle = puzzles[Math.min(index + 1, puzzles.length - 1)];
    loadPuzzle(nextPuzzle.id);
  }

  return (
    <main className="app-shell app-shell--game">
      <header className="hero game-hero">
        <div>
          <p className="eyebrow">GoQuest Sprint 4.4</p>
          <h1>Reino do Tabuleiro</h1>
          <p>
            Uma arena viva de estratégia: Go, fantasia medieval, formações e lógica de programação.
          </p>
        </div>
        <div className="signature">Tehkné Solutions</div>
      </header>

      <nav className="game-menu" aria-label="Menu de jogo">
        <button type="button" onClick={() => loadMission(mission.id)}>Jornada</button>
        <button type="button" onClick={() => loadPuzzle(puzzle.id)}>Puzzles</button>
        <button type="button" onClick={openFreeMode}>Campo livre</button>
        <button type="button" onClick={() => setShowTarget((value) => !value)}>{showTarget ? "Dica ativa" : "Dica oculta"}</button>
        <button type="button" onClick={() => (mode === "mission" ? loadMission(mission.id) : mode === "puzzle" ? loadPuzzle(puzzle.id) : openFreeMode())}>Rejogar</button>
        <button type="button" onClick={clearProgress}>Limpar progresso</button>
      </nav>

      <section className="status-bar" aria-label="Estado do jogo">
        <div><strong>Turno</strong><span>{currentPlayer === "BLACK" ? "Preta" : "Branca"}</span></div>
        <div><strong>XP</strong><span>{progress.xp}</span></div>
        <div><strong>Missões</strong><span>{progress.completedMissions.length}/{missions.length}</span></div>
        <div><strong>Puzzles</strong><span>{progress.completedPuzzles.length}/{puzzles.length}</span></div>
      </section>

      <section className="journey-panel" aria-label="Mapa da campanha">
        <div>
          <p className="eyebrow">Mapa da campanha</p>
          <h2>{mode === "puzzle" ? "Arena de Puzzles" : mode === "free" ? "Campo Livre" : "O Tabuleiro Vivo"}</h2>
          <p>{mode === "puzzle" ? "Resolva desafios curtos de leitura estratégica." : "Aprenda a respirar, capturar e conectar."}</p>
        </div>

        <div className="mission-tabs">
          {mode === "puzzle"
            ? puzzles.map((item) => (
                <button
                  key={item.id}
                  className={item.id === puzzle.id ? "mission-tab mission-tab--active" : "mission-tab"}
                  type="button"
                  onClick={() => loadPuzzle(item.id)}
                >
                  <span>{progress.completedPuzzles.includes(item.id) ? "✓" : item.id.replace("p", "")}</span>
                  <strong>{item.title}</strong>
                </button>
              ))
            : missions.map((item) => (
                <button
                  key={item.id}
                  className={item.id === mission.id && mode === "mission" ? "mission-tab mission-tab--active" : "mission-tab"}
                  type="button"
                  onClick={() => loadMission(item.id)}
                >
                  <span>{progress.completedMissions.includes(item.id) ? "✓" : "•"}</span>
                  <strong>{item.title}</strong>
                </button>
              ))}
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
        <TutorGoPanel mission={activeLesson} message={message} />

        <section className="board-card board-card--cinematic">
          <div className="board-header">
            <div>
              <p className="eyebrow">Arena 2.5D</p>
              <h2>{activeLesson.concept}</h2>
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
            expectedMove={targetMove}
            selectedPosition={selectedPosition}
            showTarget={showTarget}
            camera={boardCamera}
            onCellClick={handlePlay}
          />

          <div className="board-actions">
            <button type="button" onClick={() => (mode === "mission" ? loadMission(mission.id) : mode === "puzzle" ? loadPuzzle(puzzle.id) : openFreeMode())}>
              Rejogar
            </button>
            {mode === "mission" && (
              <button type="button" onClick={goToNextMission} disabled={mission.id === missions[missions.length - 1].id}>
                Próxima missão
              </button>
            )}
            {mode === "puzzle" && (
              <button type="button" onClick={goToNextPuzzle} disabled={puzzle.id === puzzles[puzzles.length - 1].id}>
                Próximo puzzle
              </button>
            )}
          </div>

          {mode === "mission" && isMissionComplete && (
            <div className="success-card">
              <strong>Missão concluída</strong>
              <span>{mission.successMessage}</span>
            </div>
          )}

          {mode === "puzzle" && isPuzzleComplete && (
            <div className="success-card">
              <strong>Puzzle concluído</strong>
              <span>{puzzle.successMessage}</span>
            </div>
          )}
        </section>

        <RightPanelTabs
          board={board}
          selectedCharacter={selectedCharacter}
          selectedEvent={tutorEvents[selectedEventIndex]}
          devGoal={activeLesson.devGoal}
          events={tutorEvents}
          selectedEventIndex={selectedEventIndex}
          onSelectEvent={setSelectedEventIndex}
        />
      </section>
    </main>
  );
}
