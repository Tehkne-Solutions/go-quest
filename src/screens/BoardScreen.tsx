import { useEffect, useMemo, useState } from "react";
import { CameraControls, type BoardCamera } from "../components/board/CameraControls";
import { RightPanelTabs } from "../components/panels/RightPanelTabs";
import { TutorGoPanel } from "../components/tutor/TutorGoPanel";
import { GoScene3D } from "../3d/scene/GoScene3D";
import type { BoardFxEvent, BoardFxType } from "../3d/types/render3d";
import { useSoundFx } from "../audio/useSoundFx";
import { createStoneCharacter, getRoleForMission, roleLabels } from "../data/characters";
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

const progressStorageKey = "goquest-progress-v64";
const FREE_ROLE_CYCLE: CharacterRole[] = ["SCOUT", "HUNTER", "GUARD", "LINK", "BUILDER", "RAIDER"];

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
  concept: "Arena livre",
  intro: "Monte companhias, compare facções e teste o visual das classes sem travar em jogadas inválidas.",
  goal: "Clique nos pedestais vazios para invocar múltiplas peças. Missões e puzzles continuam usando as regras do Go.",
  successMessage: "Experimento registrado.",
  devGoal: "Modo livre como sandbox visual estável; modo missão/puzzle preserva o motor oficial do Go."
};

function samePosition(a?: Position, b?: Position): boolean {
  return Boolean(a && b && a.x === b.x && a.y === b.y);
}

function nextPlayer(player: PlayerColor): PlayerColor {
  return player === "BLACK" ? "WHITE" : "BLACK";
}

function playerFaction(player: PlayerColor) {
  return player === "BLACK" ? "Horda" : "Aliança";
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
  if (text.includes("conex") || text.includes("conectar")) return "LINK";
  if (text.includes("territ")) return "BUILDER";
  if (text.includes("atari") || text.includes("salvar")) return "GUARD";
  return "SCOUT";
}

function hasAdjacentAlly(board: Board, position: Position, player: PlayerColor): boolean {
  const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 }
  ];

  return directions.some((direction) => {
    const y = position.y + direction.y;
    const x = position.x + direction.x;
    return board[y]?.[x]?.state === player;
  });
}

function placeStoneOnBoard(board: Board, position: Position, color: PlayerColor, character: StoneCharacter): Board {
  return board.map((row) =>
    row.map((cell) =>
      samePosition(cell.position, position)
        ? { ...cell, state: color, character }
        : cell
    )
  );
}

export function BoardScreen() {
  const [mode, setMode] = useState<Mode>("mission");
  const [missionId, setMissionId] = useState<MissionId>("breath");
  const [puzzleId, setPuzzleId] = useState(puzzles[0].id);
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  const mission = useMemo(() => missions.find((item) => item.id === missionId) ?? missions[0], [missionId]);
  const puzzle = useMemo(() => puzzles.find((item) => item.id === puzzleId) ?? puzzles[0], [puzzleId]);
  const activeLesson = mode === "mission" ? mission : mode === "puzzle" ? puzzle : freeLesson;
  const targetMove = mode === "mission" ? mission.expectedMove : mode === "puzzle" ? puzzle.solution : undefined;

  const [board, setBoard] = useState<Board>(() => mission.createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<PlayerColor>("BLACK");
  const [message, setMessage] = useState("A arena está pronta. Clique em um pedestal.");
  const [tutorEvents, setTutorEvents] = useState<TutorEvent[]>([]);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [captures, setCaptures] = useState<CaptureCounter>({ BLACK: 0, WHITE: 0 });
  const [showTarget, setShowTarget] = useState(true);
  const [boardCamera, setBoardCamera] = useState<BoardCamera>("iso");
  const [selectedCharacter, setSelectedCharacter] = useState<StoneCharacter | undefined>();
  const [selectedPosition, setSelectedPosition] = useState<Position | undefined>();
  const [hasPlayedCurrentRun, setHasPlayedCurrentRun] = useState(false);
  const [fxEvents, setFxEvents] = useState<BoardFxEvent[]>([]);
  const [freeRoleIndex, setFreeRoleIndex] = useState(0);
  const { muted, play, toggleMuted } = useSoundFx();

  const freeRole = FREE_ROLE_CYCLE[freeRoleIndex % FREE_ROLE_CYCLE.length];
  const isMissionComplete = progress.completedMissions.includes(mission.id);
  const isPuzzleComplete = progress.completedPuzzles.includes(puzzle.id);

  useEffect(() => {
    window.localStorage.setItem(progressStorageKey, JSON.stringify(progress));
  }, [progress]);

  function pushFx(type: BoardFxType, position: Position, color?: PlayerColor, role?: CharacterRole) {
    const event: BoardFxEvent = {
      id: `${type}_${position.x}_${position.y}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      type,
      position,
      color,
      role,
      createdAt: Date.now()
    };

    setFxEvents((current) => [...current.slice(-10), event]);
    window.setTimeout(() => {
      setFxEvents((current) => current.filter((item) => item.id !== event.id));
    }, type === "mission" ? 1300 : 900);
  }

  function resetShared() {
    setTutorEvents([]);
    setSelectedEventIndex(0);
    setSelectedCharacter(undefined);
    setSelectedPosition(undefined);
    setHasPlayedCurrentRun(false);
    setCaptures({ BLACK: 0, WHITE: 0 });
    setFxEvents([]);
  }

  function loadMission(nextMissionId = mission.id) {
    const nextMission = missions.find((item) => item.id === nextMissionId) ?? missions[0];
    setMode("mission");
    setMissionId(nextMission.id);
    setBoard(nextMission.createInitialBoard());
    setCurrentPlayer(nextMission.player);
    resetShared();
    setShowTarget(true);
    play("ui");
    setMessage("Missão carregada. Convoque no pedestal indicado e observe os FX.");
  }

  function loadPuzzle(nextPuzzleId = puzzle.id) {
    const nextPuzzle = puzzles.find((item) => item.id === nextPuzzleId) ?? puzzles[0];
    setMode("puzzle");
    setPuzzleId(nextPuzzle.id);
    setBoard(nextPuzzle.createInitialBoard());
    setCurrentPlayer("BLACK");
    resetShared();
    setShowTarget(true);
    play("ui");
    setMessage("Puzzle carregado. Encontre a melhor interseção.");
  }

  function openFreeMode() {
    setMode("free");
    setBoard(createBoard(5));
    setCurrentPlayer("BLACK");
    setFreeRoleIndex(0);
    resetShared();
    setShowTarget(false);
    play("ui");
    setMessage("Campo livre sandbox aberto. Clique em vários pedestais vazios para montar companhias.");
  }

  function clearProgress() {
    window.localStorage.removeItem(progressStorageKey);
    setProgress(emptyProgress());
    loadMission("breath");
    setMessage("Progresso local limpo. A campanha reiniciou.");
  }

  function completeMission(position: Position, color: PlayerColor, role: CharacterRole) {
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
    pushFx("mission", position, color, role);
    play("mission");
  }

  function completePuzzle(position: Position, color: PlayerColor, role: CharacterRole) {
    setProgress((current) => {
      if (current.completedPuzzles.includes(puzzle.id)) return current;
      return { ...current, xp: current.xp + 35, completedPuzzles: [...current.completedPuzzles, puzzle.id] };
    });
    pushFx("mission", position, color, role);
    play("mission");
  }

  function handleFreePlacement(position: Position) {
    const role = freeRole;
    const actor = createStoneCharacter(currentPlayer, role, position, progress.xp + captures[currentPlayer] + freeRoleIndex);
    const sandboxBoard = placeStoneOnBoard(board, position, currentPlayer, actor);
    const joinedGroup = hasAdjacentAlly(sandboxBoard, position, currentPlayer);

    setBoard(sandboxBoard);
    setTutorEvents([]);
    setSelectedEventIndex(0);
    setSelectedCharacter(actor);
    setSelectedPosition(position);
    setHasPlayedCurrentRun(false);
    pushFx("spawn", position, currentPlayer, role);
    play("spawn");

    if (joinedGroup) {
      pushFx("group", position, currentPlayer, role);
      play("group");
    }

    setMessage(`${playerFaction(currentPlayer)} invocou ${roleLabels[role]} em x:${position.x}, y:${position.y}.`);
    setFreeRoleIndex((index) => (index + 1) % FREE_ROLE_CYCLE.length);
    setCurrentPlayer(nextPlayer(currentPlayer));
  }

  function handlePlay(position: Position) {
    const clickedCell = board[position.y][position.x];

    if (clickedCell.state !== "EMPTY") {
      setSelectedCharacter(clickedCell.character);
      setSelectedPosition(position);
      pushFx("select", position, clickedCell.state, clickedCell.character?.role);
      play("select");
      setMessage(clickedCell.character ? `${clickedCell.character.name} selecionado no campo.` : "Unidade selecionada.");
      return;
    }

    if (mode === "free") {
      handleFreePlacement(position);
      return;
    }

    if (hasPlayedCurrentRun) {
      setMessage("Rodada já concluída neste replay. Use Rejogar ou avance para outro desafio.");
      return;
    }

    const role = mode === "mission" ? getRoleForMission(mission.id) : roleForPuzzle(puzzle.concept);
    const actor = createStoneCharacter(currentPlayer, role, position, progress.xp + captures[currentPlayer]);
    const result = playMove(board, position, currentPlayer, actor);

    setTutorEvents(result.tutorEvents);
    setSelectedEventIndex(Math.max(0, result.tutorEvents.length - 1));
    setMessage(result.message);

    if (!result.success) return;

    const joinedGroup = hasAdjacentAlly(result.board, position, currentPlayer);
    setBoard(result.board);
    setSelectedCharacter(actor);
    setSelectedPosition(position);
    setHasPlayedCurrentRun(true);
    pushFx("spawn", position, currentPlayer, role);
    play("spawn");

    if (joinedGroup) {
      pushFx("group", position, currentPlayer, role);
      play("group");
    }

    if (result.captured.length > 0) {
      setCaptures((current) => ({ ...current, [currentPlayer]: current[currentPlayer] + result.captured.length }));
      result.captured.forEach((capturedPosition) => pushFx("capture", capturedPosition, nextPlayer(currentPlayer), role));
      play("capture");
    }

    if (samePosition(position, targetMove) && mode === "mission") {
      completeMission(position, currentPlayer, role);
      setMessage(mission.successMessage);
      return;
    }

    if (samePosition(position, targetMove) && mode === "puzzle") {
      completePuzzle(position, currentPlayer, role);
      setMessage(puzzle.successMessage);
      return;
    }

    setCurrentPlayer(nextPlayer(currentPlayer));
  }

  function goToNextMission() {
    loadMission(getNextMissionId(mission.id));
  }

  function goToNextPuzzle() {
    const index = puzzles.findIndex((item) => item.id === puzzle.id);
    loadPuzzle(puzzles[Math.min(index + 1, puzzles.length - 1)].id);
  }

  return (
    <main className="app-shell app-shell--game app-shell--3d app-shell--hud">
      <header className="game-hud-topbar">
        <div className="hud-brand">
          <div className="hud-crest">GQ</div>
          <div>
            <p className="eyebrow">GoQuest Sprint 6.4</p>
            <h1>Reino do Tabuleiro 3D</h1>
            <span>HUD tático, facções, partículas, texturas procedurais e sandbox livre estável.</span>
          </div>
        </div>

        <div className={`hud-turn hud-turn--${currentPlayer === "BLACK" ? "horde" : "alliance"}`}>
          <small>Turno</small>
          <strong>{playerFaction(currentPlayer)}</strong>
          <span>{currentPlayer === "BLACK" ? "Pretas" : "Brancas"}</span>
        </div>

        <div className="hud-resources">
          <div><small>XP</small><strong>{progress.xp}</strong></div>
          <div><small>Missões</small><strong>{progress.completedMissions.length}/{missions.length}</strong></div>
          <div><small>Puzzles</small><strong>{progress.completedPuzzles.length}/{puzzles.length}</strong></div>
        </div>

        <button type="button" className="hud-sound" onClick={() => { toggleMuted(); play("ui"); }}>
          {muted ? "Som OFF" : "Som ON"}
        </button>
      </header>

      <nav className="game-menu game-menu--hud" aria-label="Menu de jogo">
        <button type="button" onClick={() => loadMission(mission.id)}>Jornada</button>
        <button type="button" onClick={() => loadPuzzle(puzzle.id)}>Puzzles</button>
        <button type="button" onClick={openFreeMode}>Campo livre</button>
        <button type="button" onClick={() => setShowTarget((value) => !value)}>{showTarget ? "Dica ativa" : "Dica oculta"}</button>
        <button type="button" onClick={() => (mode === "mission" ? loadMission(mission.id) : mode === "puzzle" ? loadPuzzle(puzzle.id) : openFreeMode())}>Rejogar</button>
        <button type="button" onClick={clearProgress}>Limpar progresso</button>
      </nav>

      {mode === "free" && (
        <section className="free-role-selector" aria-label="Seletor de classe no campo livre">
          <span>Próxima classe:</span>
          {FREE_ROLE_CYCLE.map((role, index) => (
            <button
              key={role}
              type="button"
              className={index === freeRoleIndex ? "free-role-selector__button free-role-selector__button--active" : "free-role-selector__button"}
              onClick={() => { setFreeRoleIndex(index); play("ui"); }}
            >
              {roleLabels[role]}
            </button>
          ))}
        </section>
      )}

      <section className="journey-panel journey-panel--hud">
        <div>
          <p className="eyebrow">Mapa da campanha</p>
          <h2>{mode === "puzzle" ? "Arena de Puzzles" : mode === "free" ? "Campo Livre" : "O Tabuleiro Vivo"}</h2>
          <p>{mode === "free" ? "Sandbox visual para montar companhias sem bloquear múltiplas invocações." : mode === "puzzle" ? "Resolva desafios curtos de leitura estratégica." : "Aprenda a respirar, capturar e conectar."}</p>
        </div>

        <div className="mission-tabs">
          {mode === "puzzle"
            ? puzzles.map((item) => (
                <button key={item.id} className={item.id === puzzle.id ? "mission-tab mission-tab--active" : "mission-tab"} type="button" onClick={() => loadPuzzle(item.id)}>
                  <span>{progress.completedPuzzles.includes(item.id) ? "✓" : item.id.replace("p", "")}</span>
                  <strong>{item.title}</strong>
                </button>
              ))
            : missions.map((item) => (
                <button key={item.id} className={item.id === mission.id && mode === "mission" ? "mission-tab mission-tab--active" : "mission-tab"} type="button" onClick={() => loadMission(item.id)}>
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

      <section className="workspace workspace--cinematic workspace--3d workspace--game-hud">
        <TutorGoPanel mission={activeLesson} message={message} />

        <section className="board-card board-card--cinematic board-card--3d board-card--hud">
          <div className="board-header board-header--hud">
            <div>
              <p className="eyebrow">Arena de pedestais</p>
              <h2>{activeLesson.concept}</h2>
            </div>
            <div className="board-header-actions">
              <CameraControls value={boardCamera} onChange={(camera) => { setBoardCamera(camera); play("ui"); }} />
              <button type="button" onClick={() => setShowTarget((value) => !value)}>
                {showTarget ? "Ocultar dica" : "Mostrar dica"}
              </button>
            </div>
          </div>

          <GoScene3D
            board={board}
            expectedMove={targetMove}
            selectedPosition={selectedPosition}
            showTarget={showTarget}
            camera={boardCamera}
            fxEvents={fxEvents}
            onIntersectionClick={handlePlay}
          />

          <div className="bottom-action-hud">
            <button type="button" onClick={() => (mode === "mission" ? loadMission(mission.id) : mode === "puzzle" ? loadPuzzle(puzzle.id) : openFreeMode())}>Rejogar</button>
            {mode === "mission" && <button type="button" onClick={goToNextMission} disabled={mission.id === missions[missions.length - 1].id}>Próxima missão</button>}
            {mode === "puzzle" && <button type="button" onClick={goToNextPuzzle} disabled={puzzle.id === puzzles[puzzles.length - 1].id}>Próximo puzzle</button>}
            <span>{message}</span>
          </div>

          {mode === "mission" && isMissionComplete && <div className="success-card"><strong>Missão concluída</strong><span>{mission.successMessage}</span></div>}
          {mode === "puzzle" && isPuzzleComplete && <div className="success-card"><strong>Puzzle concluído</strong><span>{puzzle.successMessage}</span></div>}
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
