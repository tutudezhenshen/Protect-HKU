var keys = [];
var obj;
var directions = ['up', 'down', 'left', 'right'];

// the global variables used to support the game.
var global = {
    zOrder: {
        prop: -2,
        playerTank: -1,
        item: -1,
        enemyTank: -1,
        flyTank: 3,
        explosion: 2,
        bullet: 3,
        life_HP_tool_column: 4,
        lifeHP: 5,
        ice_HPreduce: 6,
        gamebegin: 7,
    },

    winSize: {
        width: null,
        height: null
    },

    warMap: {
    },

    allScene: 2,
    nextLevel: 1,
    opacity: 25,
    freeze: false,
    propType: [],
    propNum: [],
    propTag: [],
    previous: {},
    score: 0,
    playerLife: 3,
    GameLayer: null,
    enemyCount: 0,
    enemyPlaceOrder: 0,
    enemyPlaces: [
        {x: 750, y: 360},
        {x: 750, y: 270},
        {x: 750, y: 180},
        {x: 750, y: 90},
        {x: 750, y: 450},
    ],
    playerPlace: {x: -120, y: 270},
    layer: {
        mudLayer: {},
        stoneLayer: null,
    },
    sound:true,
    stoneObjects: [],
    mudObjects: [],
    waterObjects: [],
    enemyTank: [],
    flyTank: [],
    playerTank: [],
    enemyBullet: [],
    rocketBullet: [],
    enemyMissile: [],
    enemyBurst: [],
    enemyBurst2: [],
    playerBullet: [],
    item: [],
};
