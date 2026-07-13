import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "public/assets/goquest/models";
const ROLES = ["scout", "hunter", "guard", "link", "builder", "raider"];
const FACTIONS = {
  horde: {
    stone: "#17120f",
    metal: "#4d4139",
    trim: "#b94636",
    cloth: "#421511",
    skin: "#9a6a43",
    head: "#8e6a4a",
    rune: "#ff6d55"
  },
  alliance: {
    stone: "#d4ccb9",
    metal: "#c6c1b6",
    trim: "#4777bf",
    cloth: "#263f73",
    skin: "#c69773",
    head: "#d0a27d",
    rune: "#8dc8ff"
  }
};

const ROLE_COLORS = {
  scout: { horde: "#26351f", alliance: "#3f6b43", accent: "#82d66f", glow: "#86f28d" },
  hunter: { horde: "#56341f", alliance: "#8a6138", accent: "#e2a75d", glow: "#f0c47a" },
  guard: { horde: "#2e3441", alliance: "#d8d7cc", accent: "#d8b868", glow: "#f3d58d" },
  link: { horde: "#382447", alliance: "#6553a5", accent: "#b887ff", glow: "#c69bff" },
  builder: { horde: "#563520", alliance: "#9a6a38", accent: "#e0a85c", glow: "#ffc26a" },
  raider: { horde: "#304522", alliance: "#6f7e55", accent: "#d76343", glow: "#f1785e" }
};

function hexToFactor(hex) {
  const cleaned = hex.replace("#", "");
  return [0, 2, 4].map((index) => parseInt(cleaned.slice(index, index + 2), 16) / 255).concat(1);
}

function qz(rad) {
  return [0, 0, Math.sin(rad / 2), Math.cos(rad / 2)];
}

function cubeShape() {
  const p = [];
  const n = [];
  const faces = [
    [[1, 0, 0], [[0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5]]],
    [[-1, 0, 0], [[-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5], [-0.5, -0.5, -0.5]]],
    [[0, 1, 0], [[-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5]]],
    [[0, -1, 0], [[-0.5, -0.5, 0.5], [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5]]],
    [[0, 0, 1], [[-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]]],
    [[0, 0, -1], [[0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5]]]
  ];
  const i = [];
  faces.forEach(([normal, verts], faceIndex) => {
    const start = faceIndex * 4;
    verts.forEach((v) => p.push(...v));
    for (let k = 0; k < 4; k += 1) n.push(...normal);
    i.push(start, start + 1, start + 2, start, start + 2, start + 3);
  });
  return { p, n, i };
}

function cylinderShape(segments = 18) {
  const p = [];
  const n = [];
  const i = [];
  for (let s = 0; s < segments; s += 1) {
    const a0 = (Math.PI * 2 * s) / segments;
    const a1 = (Math.PI * 2 * (s + 1)) / segments;
    const x0 = Math.cos(a0), z0 = Math.sin(a0), x1 = Math.cos(a1), z1 = Math.sin(a1);
    const start = p.length / 3;
    p.push(x0, -0.5, z0, x1, -0.5, z1, x1, 0.5, z1, x0, 0.5, z0);
    n.push(x0, 0, z0, x1, 0, z1, x1, 0, z1, x0, 0, z0);
    i.push(start, start + 1, start + 2, start, start + 2, start + 3);
    const top = p.length / 3;
    p.push(0, 0.5, 0, x0, 0.5, z0, x1, 0.5, z1);
    n.push(0, 1, 0, 0, 1, 0, 0, 1, 0);
    i.push(top, top + 1, top + 2);
    const bottom = p.length / 3;
    p.push(0, -0.5, 0, x1, -0.5, z1, x0, -0.5, z0);
    n.push(0, -1, 0, 0, -1, 0, 0, -1, 0);
    i.push(bottom, bottom + 1, bottom + 2);
  }
  return { p, n, i };
}

function coneShape(segments = 18) {
  const p = [];
  const n = [];
  const i = [];
  for (let s = 0; s < segments; s += 1) {
    const a0 = (Math.PI * 2 * s) / segments;
    const a1 = (Math.PI * 2 * (s + 1)) / segments;
    const x0 = Math.cos(a0), z0 = Math.sin(a0), x1 = Math.cos(a1), z1 = Math.sin(a1);
    const mid = (a0 + a1) / 2;
    const normal = [Math.cos(mid), 0.55, Math.sin(mid)];
    const start = p.length / 3;
    p.push(0, 0.5, 0, x0, -0.5, z0, x1, -0.5, z1);
    n.push(...normal, ...normal, ...normal);
    i.push(start, start + 1, start + 2);
    const bottom = p.length / 3;
    p.push(0, -0.5, 0, x1, -0.5, z1, x0, -0.5, z0);
    n.push(0, -1, 0, 0, -1, 0, 0, -1, 0);
    i.push(bottom, bottom + 1, bottom + 2);
  }
  return { p, n, i };
}

function sphereShape(segments = 14, rings = 8) {
  const p = [];
  const n = [];
  const i = [];
  for (let y = 0; y <= rings; y += 1) {
    const v = y / rings;
    const phi = v * Math.PI;
    for (let x = 0; x <= segments; x += 1) {
      const u = x / segments;
      const theta = u * Math.PI * 2;
      const px = Math.sin(phi) * Math.cos(theta);
      const py = Math.cos(phi);
      const pz = Math.sin(phi) * Math.sin(theta);
      p.push(px, py, pz);
      n.push(px, py, pz);
    }
  }
  for (let y = 0; y < rings; y += 1) {
    for (let x = 0; x < segments; x += 1) {
      const a = y * (segments + 1) + x;
      const b = a + segments + 1;
      i.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  return { p, n, i };
}

const SHAPES = {
  cube: cubeShape(),
  cylinder: cylinderShape(),
  cone: coneShape(),
  sphere: sphereShape()
};

class Builder {
  constructor() {
    this.bufferViews = [];
    this.accessors = [];
    this.meshes = [];
    this.materials = [];
    this.nodes = [];
    this.parts = [];
    this.offset = 0;
    this.meshCache = new Map();
  }
  push(buf) {
    const pad = (4 - (this.offset % 4)) % 4;
    if (pad) {
      this.parts.push(Buffer.alloc(pad));
      this.offset += pad;
    }
    const byteOffset = this.offset;
    this.parts.push(buf);
    this.offset += buf.length;
    return byteOffset;
  }
  accessor(arr, componentType, type, itemSize, minMax = false) {
    const typed = componentType === 5126 ? new Float32Array(arr) : new Uint16Array(arr);
    const byteOffset = this.push(Buffer.from(typed.buffer));
    const bufferView = this.bufferViews.length;
    this.bufferViews.push({ buffer: 0, byteOffset, byteLength: typed.byteLength });
    const accessor = { bufferView, componentType, count: arr.length / itemSize, type };
    if (minMax && type === "VEC3") {
      const min = [Infinity, Infinity, Infinity];
      const max = [-Infinity, -Infinity, -Infinity];
      for (let k = 0; k < arr.length; k += 3) {
        min[0] = Math.min(min[0], arr[k]); min[1] = Math.min(min[1], arr[k + 1]); min[2] = Math.min(min[2], arr[k + 2]);
        max[0] = Math.max(max[0], arr[k]); max[1] = Math.max(max[1], arr[k + 1]); max[2] = Math.max(max[2], arr[k + 2]);
      }
      accessor.min = min;
      accessor.max = max;
    }
    this.accessors.push(accessor);
    return this.accessors.length - 1;
  }
  material(name, color, metal = 0.12, rough = 0.78, emissive) {
    this.materials.push({
      name,
      pbrMetallicRoughness: { baseColorFactor: hexToFactor(color), metallicFactor: metal, roughnessFactor: rough },
      emissiveFactor: emissive ? hexToFactor(emissive).slice(0, 3) : [0, 0, 0]
    });
    return this.materials.length - 1;
  }
  mesh(shapeName, material) {
    const key = `${shapeName}_${material}`;
    if (this.meshCache.has(key)) return this.meshCache.get(key);
    const shape = SHAPES[shapeName];
    const position = this.accessor(shape.p, 5126, "VEC3", 3, true);
    const normal = this.accessor(shape.n, 5126, "VEC3", 3);
    const indices = this.accessor(shape.i, 5123, "SCALAR", 1);
    const mesh = this.meshes.length;
    this.meshes.push({ primitives: [{ attributes: { POSITION: position, NORMAL: normal }, indices, material }] });
    this.meshCache.set(key, mesh);
    return mesh;
  }
  node(name, shape, mat, translation, scale, rotation) {
    const node = { name, mesh: this.mesh(shape, mat), translation, scale };
    if (rotation) node.rotation = rotation;
    this.nodes.push(node);
    return this.nodes.length - 1;
  }
  finish() {
    const buffer = Buffer.concat(this.parts);
    return {
      asset: { version: "2.0", generator: "GoQuest procedural GLTF generator - Tehkne Solutions" },
      scene: 0,
      scenes: [{ nodes: this.nodes.map((_, index) => index) }],
      nodes: this.nodes,
      meshes: this.meshes,
      materials: this.materials,
      accessors: this.accessors,
      bufferViews: this.bufferViews,
      buffers: [{ byteLength: buffer.byteLength, uri: `data:application/octet-stream;base64,${buffer.toString("base64")}` }]
    };
  }
}

function addBase(b, mats) {
  b.node("round stone pedestal", "cylinder", mats.stone, [0, 0.09, 0], [0.55, 0.18, 0.55]);
  b.node("metal rim", "cylinder", mats.metal, [0, 0.22, 0], [0.47, 0.08, 0.47]);
  b.node("class rune disk", "cylinder", mats.accent, [0, 0.29, 0], [0.36, 0.06, 0.36]);
}

function addHumanoid(b, mats, role) {
  if (role === "scout") {
    b.node("lean leather torso", "cylinder", mats.body, [0, 0.78, 0], [0.18, 0.62, 0.18]);
    b.node("hood", "cone", mats.body, [0, 1.19, 0], [0.22, 0.3, 0.22]);
    b.node("cape", "cube", mats.cloth, [0, 0.75, -0.14], [0.42, 0.62, 0.05]);
    b.node("left dagger", "cube", mats.accent, [-0.32, 0.73, 0.02], [0.04, 0.48, 0.04], qz(0.75));
    b.node("right dagger", "cube", mats.accent, [0.32, 0.73, 0.02], [0.04, 0.48, 0.04], qz(-0.75));
  } else if (role === "hunter") {
    b.node("ranger torso", "cylinder", mats.body, [0, 0.76, 0], [0.2, 0.58, 0.2]);
    b.node("head", "sphere", mats.skin, [0, 1.13, 0], [0.18, 0.18, 0.18]);
    b.node("quiver", "cube", mats.cloth, [-0.18, 0.94, -0.12], [0.12, 0.62, 0.08], qz(-0.25));
    b.node("bow upper", "cube", mats.accent, [0.38, 0.88, 0.02], [0.035, 0.52, 0.035], qz(-0.42));
    b.node("bow lower", "cube", mats.accent, [0.42, 0.58, 0.02], [0.035, 0.48, 0.035], qz(0.42));
    b.node("arrow", "cube", mats.metal, [0.32, 0.72, 0.05], [0.025, 0.66, 0.025], qz(-1.35));
  } else if (role === "guard") {
    b.node("heavy armor", "cylinder", mats.body, [0, 0.81, 0], [0.29, 0.72, 0.24]);
    b.node("helmet", "cube", mats.metal, [0, 1.26, 0], [0.36, 0.28, 0.3]);
    b.node("shield", "cube", mats.trim, [0.4, 0.8, 0.05], [0.3, 0.6, 0.09]);
    b.node("sword blade", "cube", mats.metal, [-0.36, 0.77, 0.04], [0.04, 0.78, 0.04], qz(0.22));
    b.node("crossguard", "cube", mats.accent, [-0.22, 0.66, 0.06], [0.28, 0.04, 0.05]);
  } else if (role === "link") {
    b.node("arcane robe", "cone", mats.body, [0, 0.78, 0], [0.33, 0.82, 0.33]);
    b.node("mage head", "sphere", mats.skin, [0, 1.23, 0], [0.17, 0.17, 0.17]);
    b.node("staff", "cube", mats.metal, [-0.38, 0.82, 0.03], [0.04, 0.9, 0.04]);
    b.node("left orb", "sphere", mats.glow, [-0.38, 1.28, 0.02], [0.1, 0.1, 0.1]);
    b.node("right orb", "sphere", mats.rune, [0.36, 1.05, 0.02], [0.09, 0.09, 0.09]);
    b.node("arcane collar", "cylinder", mats.accent, [0, 1.02, 0], [0.29, 0.045, 0.29]);
  } else if (role === "builder") {
    b.node("dwarf body", "cylinder", mats.body, [0, 0.7, 0], [0.29, 0.5, 0.25]);
    b.node("dwarf head", "sphere", mats.skin, [0, 1.05, 0], [0.21, 0.21, 0.21]);
    b.node("beard", "cone", mats.cloth, [0, 0.88, 0.06], [0.17, 0.34, 0.13]);
    b.node("hammer handle", "cube", mats.metal, [-0.35, 0.78, 0.03], [0.05, 0.65, 0.05], qz(0.65));
    b.node("hammer head", "cube", mats.accent, [-0.5, 1.02, 0.04], [0.26, 0.14, 0.14], qz(0.65));
    b.node("blueprint", "cube", mats.trim, [0.33, 0.72, 0.04], [0.22, 0.32, 0.04]);
  } else {
    b.node("orc torso", "cylinder", mats.body, [0, 0.82, 0], [0.33, 0.72, 0.27]);
    b.node("orc head", "sphere", mats.skin, [0, 1.28, 0], [0.22, 0.2, 0.22]);
    b.node("left horn", "cone", mats.accent, [-0.23, 1.34, 0], [0.07, 0.28, 0.07], qz(-0.75));
    b.node("right horn", "cone", mats.accent, [0.23, 1.34, 0], [0.07, 0.28, 0.07], qz(0.75));
    b.node("axe handle", "cube", mats.metal, [0.36, 0.86, 0.05], [0.055, 0.85, 0.055], qz(-0.52));
    b.node("axe blade", "cone", mats.accent, [0.55, 1.08, 0.06], [0.2, 0.32, 0.08], qz(-0.52));
    b.node("spiked bracer", "cube", mats.trim, [-0.38, 0.78, 0.04], [0.2, 0.46, 0.08]);
  }
}

function makeModel(factionKey, role) {
  const faction = FACTIONS[factionKey];
  const roleColor = ROLE_COLORS[role];
  const b = new Builder();
  const mats = {
    stone: b.material("pedestal stone", faction.stone, 0.04, 0.9),
    metal: b.material("army metal", faction.metal, 0.38, 0.42),
    trim: b.material("faction trim", faction.trim, 0.18, 0.5, faction.rune),
    cloth: b.material("army cloth", faction.cloth, 0.02, 0.86),
    skin: b.material("skin", role === "raider" ? (factionKey === "horde" ? "#6f9746" : "#8b9c68") : faction.skin, 0.02, 0.78),
    body: b.material("class armor", roleColor[factionKey], role === "guard" ? 0.35 : 0.1, 0.64),
    accent: b.material("class weapon accent", roleColor.accent, 0.25, 0.44, roleColor.glow),
    rune: b.material("faction rune", faction.rune, 0.08, 0.4, faction.rune),
    glow: b.material("magic glow", roleColor.glow, 0, 0.35, roleColor.glow)
  };
  addBase(b, mats);
  addHumanoid(b, mats, role);
  return b.finish();
}

for (const faction of Object.keys(FACTIONS)) {
  mkdirSync(join(OUT, faction), { recursive: true });
  for (const role of ROLES) {
    const model = makeModel(faction, role);
    writeFileSync(join(OUT, faction, `${role}.gltf`), JSON.stringify(model), "utf8");
  }
}

console.log("GoQuest GLTF character assets generated:", ROLES.length * Object.keys(FACTIONS).length);
