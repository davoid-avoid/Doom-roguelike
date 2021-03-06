export default {
  pos: { x: 0, y: 0 },
  size: { x: 40, y: 40 },
  speedFactor: 6,
  speed: 0,
  color: "#add8e6",
  image: "marine",
  onStairs: true,
  movement: 0,
  baseMovement: 0,
  destinationPos: { x: 0, y: 0 },
  currentTile: { x: 0, y: 0 },
  nextTile: [],
  currentRooms: [],
  surroundingTiles: { up: 0, down: 0, left: 0, right: 0 },
  surroundingEntities: { up: "none", down: "none", left: "none", right: "none" },
  availableDirections: { up: { status: true, pos: { x: 0, y: 0 } }, down: { status: true, pos: { x: 0, y: 0 } }, left: { status: true, pos: { x: 0, y: 0 } }, right: { status: true, pos: { x: 0, y: 0 } } },
  moving: false,
  move: { x: 0, y: 0 },
  moveTick: 0,
  currentAttack: {},
  exp: 0,
  hp: 20,
  maxHp: 20,
  dead: false,
  handSize: 3,
  availableAttacks: [],
  drawDeck: [],
  hand: [],
  discardDeck: [],
  baseAvailableAttacks: [],
  cardsPlayed: 0,
  attackIDs: 0,
  mainCardPlayed: false,
  inCombat: false,
  playerTurn: false,
  gloryKillHp: 2,
  status: [],
  kills: 0
}