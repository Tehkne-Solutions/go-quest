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
import { puzzles } from "../data/puzzles";
import { createBoard } from "../engine/createBoard";
import { playMove } from "../engine/playMove";
import type { CharacterRole, StoneCharacter } from "../types/character";
import type { Board, CaptureCounter, MissionId, PlayerColor, Position } from "../types/game";
import type { TutorEvent } from "../types/tutor";

type MedalId = "breath-master" | "first-capture" | "squad-link" | "puzzle-initiate";
type GameMode = "mission" | "puzzle" | "free";

type ProgressState = {
  xp: number;
  completedMissions: MissionId[];
  completedPuzzles: string[];
  medals: MedalId[];
};

const progressStorageKey = "goquest-progress-v4-2";

const medalLabels: Record<MedalId, string> = {
  "breath-master": "Guardião das Liberdades",
  "first-capture": "Primeira Captura",
  "squad-link": "Conector de Squads",
  "puzzle-initiate": "Iniciado dos Puzzles"
};

const missionRewards: Record<MissionId, { xp: number; medal: MedalId }> = {
  breath: { xp: 50, medal: "breath-master" },
  capture: { xp: 75, medal: "first-capture" },
  squad: { xp: 75, medal: "squad-link" }
};

const freeLesson = {
  title: "Campo Livre",
  concept: "Experimentação",
  intro: "Teste unidades, cerco, conexão e captura sem objetivo fixo.",
  goal: "Coloque tropas no tabuleiro e observe o Tutor Dev.",
  successMessage: "Experimento registrado.",
  devGoal: "Explorar playMove(), findGroup(), getNeighbors() e removeGroup()."
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

function getNextPuzzleId(current: string): string {
  const index = puzzles.findIndex((puzzle) => puzzle.id === current);
  return puzzles[Math.min(index + 1, puzzles.length - 1)].id;
}

function emptyProgress(): ProgressState {
  return { xp: 0, completedMissions: [], completedPuzzles: [], medals: [] };
}

function loadProgress(): ProgressState {
  if (typeof window === "undefined") return emptyProgress();

  try {
    const saved = window.localStorage.getItem(progressStorageKey);
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
  if (text.includes("conect") || text.includes("corte")) return "LINK";
  if (text.includes("atari") || text.includes("salvar")) return "GUARD";
  if (text.includes("territ")) return "BUILDER";
  return "SCOUT";
}

export function BoardScreen() {
  const [mode, setMode] = useState<GameMode>("mission");
  const [missionId, setMissionId] = useState<MissionId>("breath");
  const [puzzleId, setPuzzleId] = useState(puzzles[0].id);
  const mission = useMemo(() => missions.find((item) => item.id === missionId) ?? missions[0], [missionId]);
  const puzzle = useMemo(() => puzzles.find((item) => item.id === puzzleId) ?? puzzles[0], [puzzleId]);
  const activeLesson = mode === "mission" ? mission : mode === "puzzle" ? puzzle : freeLesson;
  const targetMove = mode === "mission" ? mission.expectedMove : mode === "puzzle" ? puzzle.solution : undefined;

  const [board, setBoard] = useState<Board>(() => mission.createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<PlayerColor>("BLACK");
  const [message, setMessage] = useState("Sensei Grid: primeiro observe o mapa. Cada clique muda o estado do jogo.");
  const [tutorEvents, setTutorEvents] = useState<TutorEvent[]>([]);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [captures, setCaptures] = useState<CaptureCounter>({ BLACK: 0, WHITE: 0 });
  const [showTarget, setShowTarget] = useState(true);
  const [boardCamera, setBoardCamera] = useState<BoardCamera>("iso");
  const [selectedCharacter, setSelectedCharacter] = useState<StoneCharacter | undefined>();
  const [selectedPosition, setSelectedPosition] = useState<Position | undefined>();
  const [hasPlayedCurrentRun, setHasPlayedCurrentRun] = useState(false);
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  const selectedEvent = tutorEvents[selectedEventIndex];
  const isMissionComplete = progress.completedMissions.includes(mission.id);
  const isPuzzleComplete = progress.completedPuzzles.includes(puzzle.id);

  useEffect(() => {
    window.localStorage.setItem(progressStorageKey, JSON.stringify(progress));
  }, [progress]);

  function bootBoard(nextBoard: Board, player: PlayerColor, text: string) {
    setBoard(nextBoard);
    setCurrentPlayer(player);
    setTutorEvents([]);
    setSelectedEventIndex(0);
    setSelectedCharacter(undefined);
    setSelectedPosition(undefined);
    setHasPlayedCurrentRun(false);
    setMessage(text);
    setCaptures({ BLACK: 0, WHITE: 0 });
  }

  function loadMission(nextMissionId = mission.id) {
    const nextMission = missions.find((item) => item.id === nextMissionId) ?? missions[0];
    setMode("mission");
    setMissionId(nextMission.id);
    setShowTarget(true);
    bootBoard(nextMission.createInitialBoard(), nextMission.player, "Missão carregada. Observe o objetivo e teste no tabuleiro.");
  }

  function loadPuzzle(nextPuzzleId = puzzle.id) {
    const nextPuzzle = puzzles.find((item) => item.id === nextPuzzleId) ?? puzzles[0];
    setMode("puzzle");
    setPuzzleId(nextPuzzle.id);
    setShowTarget(true);
    bootBoard(nextPuzzle.createInitialBoard(), "BLACK", "Puzzle carregado. Resolva a melhor ordem no campo.");
  }

  function startFreeMode() {
    setMode("free");
    setShowTarget(false);
    bootBoard(createBoard(5), "BLACK", "Campo livre aberto. Experimente jogadas e leia a lógica no Tutor Dev.");
  }

  function replayCurrent() {
    if (mode === "mission") loadMission(mission.id);
    if (mode === "puzzle") loadPuzzle(puzzle.id);
    if (mode === "free") startFreeMode();
  }

  function clearProgress() {
    window.localStorage.removeItem(progressStorageKey);
    setProgress(emptyProgress());
    setMode("mission");
    setMissionId("breath");
    const firstMission = missions[0];
    setShowTarget(true);
    bootBoard(firstMission.createInitialBoard(), firstMission.player, "Progresso local limpo. Você pode testar as classes do zero.");
  }

  function completeMission() {
    const reward = missionRewards[mission.id];
    setProgress((current) => {
      if (current.completedMissions.includes(mission.id)) return current;
      return {
        ...current,
        xp: current.xp + reward.xp,
        completedMissions: [...current.completedMissions, mission.id],
        medals: current.medals.includes(reward.medal) ? current.medals : [...current.medals, reward.medal]
      };
    });
  }

  function completePuzzle() {
    setProgress((current) => {
      if (current.completedPuzzles.includes(puzzle.id)) return current;
      return {
        ...current,
        xp: current.xp + 35,
        completedPuzzles: [...current.completedPuzzles, puzzle.id],
        medals: current.medals.includes("puzzle-initiate") ? current.medals : [...current.medals, "puzzle-initiate"]
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

    if (mode !== "free" && hasPlayedCurrentRun && (isMissionComplete || isPuzzleComplete)) {
      setMessage("Rodada já concluída neste replay. Use Rejogar, avance para a próxima etapa ou entre no Campo Livre.");
      return;
    }

    const role = mode === "mission" ? getRoleForMission(mission.id) : mode === "puzzle" ? roleForPuzzle(puzzle.concept) : "SCOUT";
    const actor = createStoneCharacter(currentPlayer, role, position, progress.xp + captures[currentPlayer]);
    const result = playMove(board, position, currentPlayer, actor);

    setTutorEvents(result.tutorEvents);
    setSelectedEventIndex(Math.max(0, result.tutorEvents.length - 1));
    setMessage(result.message);

    if (!result.success) return;

    setBoard(result.board);
    setSelectedCharacter(actor);
    setSelectedPosition(position);
    setHasPlayedCurrentRun(true);

    if (result.captured.length > 0) {
      setCaptures((current) => ({ ...current, [currentPlayer]: current[currentPlayer] + result.captured.length }));
    }

    const completedExpectedMove = samePosition(position, targetMove);

    if (mode === "mission" && completedExpectedMove) {
      completeMission();
      setMessage(mission.successMessage);
      return;
    }

    if (mode === "puzzle" && completedExpectedMove) {
      completePuzzle();
      setMessage(puzzle.successMessage);
      return;
    }

    setCurrentPlayer(nextPlayer(currentPlayer));
  }

  return (
    <main className="app-shell app-shell--game">
      <header className="hero game-hero">
        <div>
          <p className="eyebrow">GoQuest Sprint 4.2</p>
          <h1>Reino do Tabuleiro</h1>
          <p>Go como campanha medieval: sprites reais entram no campo, formam companhias e revelam a lógica do motor.</p>
        </div>
        <div className="signature">Tehkné Solutions</div>
      </header>

      <nav className="game-menu" aria-label="Menu de jogo">
        <button type="button" className={mode === "mission" ? "is-active" : ""} onClick={() => loadMission(mission.id)}>Jornada</button>
        <button type="button" className={mode === "puzzle" ? "is-active" : ""} onClick={() => loadPuzzle(puzzle.id)}>Puzzles</button>
        <button type="button" className={mode === "free" ? "is-active" : ""} onClick={startFreeMode}>Campo livre</button>
        <button type="button" onClick={() => setShowTarget((value) => !value)}>{showTarget ? "Dica ativa" : "Dica oculta"}</button>
        <button type="button" onClick={replayCurrent}>Rejogar</button>
        <button type="button" onClick={clearProgress}>Limpar progresso</button>
      </nav>

      <section className="status-bar" aria-label="Estado do jogo">
        <div><strong>Turno</strong><span>{currentPlayer === "BLACK" ? "Preta" : "Branca"}</span></div>
        <div><strong>XP</strong><span>{progress.xp}</span></div>
        <div><strong>Missões</strong><span>{progress.completedMissions.length}/{missions.length}</span></div>
        <div><strong>Puzzles</strong><span>{progress.completedPuzzles.length}/{puzzles.length}</span></div>
      </section>

      <section className="journey-panel" aria-label="Jornada do Mundo 1">
        <div>
          <p className="eyebrow">Mapa da campanha</p>
          <h2>{mode === "puzzle" ? "Arena de Puzzles" : mode === "free" ? "Campo Livre" : "O Tabuleiro Vivo"}</h2>
          <p>{mode === "puzzle" ? "Resolva desafios curtos para dominar captura, conexão, atari e território." : "Complete as missões para liberar a base mental do Go: respirar, capturar e conectar."}</p>
        </div>

        <div className="mission-tabs">
          {mode === "puzzle"
            ? puzzles.map((item) => (
                <button key={item.id} className={`mission-tab ${item.id === puzzle.id ? "mission-tab--active" : ""}`} type="button" onClick={() => loadPuzzle(item.id)}>
                  <span>{progress.completedPuzzles.includes(item.id) ? "✓" : item.id.replace("p", "")}</span>
                  <strong>{item.title}</strong>
                </button>
              ))
            : missions.map((item) => (
                <button key={item.id} className={`mission-tab ${mode === "mission" && item.id === mission.id ? "mission-tab--active" : ""}`} type="button" onClick={() => loadMission(item.id)}>
                  <span>{progress.completedMissions.includes(item.id) ? "✓" : "•"}</span>
                  <strong>{item.title}</strong>
                </button>
              ))}
        </div>

        {progress.medals.length > 0 && (
          <div className="medal-row">
            {progress.medals.map((medal) => <span key={medal}>{medalLabels[medal]}</span>)}
          </div>
        )}
      </section>

      <section className="workspace workspace--cinematic">
        <TutorGoPanel mission={activeLesson} message={message} />

        <section className="board-card board-card--cinematic">
          <div className="board-header">
            <div>
              <p className="eyebrow">Campo 2.5D</p>
              <h2>{activeLesson.concept}</h2>
            </div>
            <div className="board-header-actions">
              <CameraControls value={boardCamera} onChange={setBoardCamera} />
              <button type="button" onClick={() => setShowTarget((value) => !value)}>{showTarget ? "Ocultar dica" : "Mostrar dica"}</button>
            </div>
          </div>

          <BoardGrid
            board={board}
            expectedMove={targetMove}
            showTarget={showTarget}
            camera={boardCamera}
            selectedPosition={selectedPosition}
            onCellClick={handlePlay}
          />

          <div className="board-actions">
            <button type="button" onClick={replayCurrent}>Rejogar</button>
            {mode === "mission" && <button type="button" onClick={() => loadMission(getNextMissionId(mission.id))} disabled={mission.id === missions[missions.length - 1].id}>Próxima missão</button>}
            {mode === "puzzle" && <button type="button" onClick={() => loadPuzzle(getNextPuzzleId(puzzle.id))} disabled={puzzle.id === puzzles[puzzles.length - 1].id}>Próximo puzzle</button>}
          </div>
        </section>

        <div className="tutor-stack tutor-stack--game">
          <CharacterPanel board={board} character={selectedCharacter} />
          <TutorDevPanel event={selectedEvent} devGoal={activeLesson.devGoal} />
          <TutorEventLog events={tutorEvents} selectedIndex={selectedEventIndex} onSelect={setSelectedEventIndex} />
          <CodexPanel />
        </div>
      </section>
    </main>
  );
}
