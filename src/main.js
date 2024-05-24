import kaboom from "kaboom"

kaboom({
	background: [200, 200, 200],
})

loadSprite("bean", "./sprites/bean.png")
loadSprite("grass", "./sprites/grass.png")
loadSprite("spike", "./sprites/spike.png")
loadSprite("portal", "./sprites/portal.png")

const SPEED = 320
const JUMP_FORCE = 720
const FALL_DEATH = 800

setGravity(2000)

// Level configuration
const levelConf = {
	tileWidth: 64,
	tileHeight: 64,
	tiles: {
		"=": () => [
			sprite("grass"),
			area(),
			body({ isStatic: true }),
			anchor("bot"),
			offscreen({ hide: true }),
			"platform",
		],
		"0": () => [
			sprite("spike"),
			area(),
			body({ isStatic: true }),
			anchor("bot"),
			offscreen({ hide: true }),
			"danger",
		],
		"x": () => [
			sprite("portal"),
			area({ scale: 0.5 }),
			anchor("bot"),
			offscreen({ hide: true }),
			"portal",
		],
	},
};

// Levels
const levels = [
	[
		"                                                                 ",
		"                                                                 ",
		"                                                                 ",
		"                                                                 ",
		"                                                                 ",
		"                                                                  ",
		"      =         ==                                  =    x       ",
		"     ==  0     =     0                    =    =   =              ",
		"   ==      ===            =   0   00    =                              ",
		"===                   == ==  =  =   =                               ",
	],
	[
		"                                                                 ",
		"                                                                 ",
		"                                                                 ",
		"   ===                                                           ",
		"           ===                               0                   ",
		"                                             =  =                ",
		"      =         ==            =                    =            ",
		"    = ==        ==           ==      0   =            x         ",
		"   ==     0  ==     ==   ==    ==   ==0  0       =           ",
		"===      ===      ===        ==       ==== =  =  =           ",
	]
];

let currentLevel = 0;


function startGame(index) {
	
	destroyAll();

	const level = levels[index];

	
	const player = add([
		sprite("bean"),
		pos(100, 0),
		area(),
		body(),
	])

	onKeyDown("left", () => {
		player.move(-SPEED, 0)
	})

	onKeyDown("right", () => {
		player.move(SPEED, 0)
	})

	onKeyPress("space", () => {
		if (player.isGrounded()) {
			player.jump(JUMP_FORCE)
		}
	})
  

	player.onUpdate(() => {
		camPos(player.pos)

		if (player.pos.y > FALL_DEATH) {
			destroy(player)
			go("lose")
		}
	})

	player.onPhysicsResolve(() => {
		camPos(player.pos)
	})

	
	level.forEach((row, y) => {
		row.split('').forEach((char, x) => {
			if (levelConf.tiles[char]) {
				add([
					pos(x * levelConf.tileWidth, y * levelConf.tileHeight),
					...levelConf.tiles[char]()
				])
			}
		})
	})

	
	player.onCollide("danger", () => {
		destroy(player)
		go("lose")
	})

	
	player.onCollide("portal", () => {
		if (index + 1 < levels.length) {
			go("game", index + 1)
		} else {
			go("win")
		}
	})
}


scene("lose", () => {
	add([
		text("Game Over\nTrykk space for å starte på nytt", { size: 32 }),
		pos(center()),
	])

	onKeyPress("space", () => {
		currentLevel = 0
		go("game", currentLevel)
	})
})


scene("win", () => {
	add([
		text("You Win!\nTrykk space for å starte på nytt", { size: 32 }),
		pos(center()),
	])

	onKeyPress("space", () => {
		currentLevel = 0
		go("game", currentLevel)
	})
})


scene("game", (index) => startGame(index))


go("game", currentLevel)
