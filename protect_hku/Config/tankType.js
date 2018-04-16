var tankType = {
    enemyTank: {
        // normal enemy tank
        type1: {
            speed: 100,
            hp: 1,
            dir: 'left',
            score: 10,
            bulletType: bulletType.type1,
            texture: s_tank2,
            rectLength: 60,
            itemType: null,
            factory: NormalEnemyTank,
        },

        // the strike back tank
        type2: {
            speed: 60,
            hp: 3,
            dir: 'left',
            score: 20,
            bulletType: bulletType.type2,
            texture: s_tank3,
            rectLength: 60,
            itemType: null,
            factory: StrikeBackTank,
        },

        // the invisibility tank
        type3: {
            speed: 500,
            hp: 2,
            dir: 'left',
            score: 15,
            bulletType: bulletType.type2,
            texture: s_tank4,
            rectLength: 60,
            itemType: null,
            factory: InvisibilityTank,
        },

        // the missile tank
        type4: {
            speed: 0,
            hp: 5,
            dir: 'left',
            score: 25,
            bulletType: bulletType.missile,
            texture: s_missileTank,
            rectLength: 60,
            itemType: null,
            factory: MissileTank,
            interval: 8,
        },

        // the boss1 tank
        boss1: {
            speed: 40,
            hp: 10,
            dir: 'left',
            score: 50,
            bulletType: bulletType.type2,
            bulletType2: bulletType.missile,
            texture: s_boss1,
            rectLength: 80,
            itemType: null,
            factory: Scene1Boss,
        },

        // the boss2 tank
        boss2: {
            speed: 200,
            hp: 10,
            dir: 'left',
            score: 50,
            bulletType: bulletType.rocket,
            bulletType2: bulletType.burst,
            texture: s_boss2,
            rectLength: 80,
            itemType: null,
            factory: Scene2Boss,
        },

        // the fly tank with burst
        type5: {
            speed: 225,
            hp: 5,
            dir: 'left',
            score: 15,
            bulletType: bulletType.burst,
            texture: s_tank5,
            rectLength: 60,
            itemType: null,
            factory: FlyTank,
        },

        // the fly tank with burst 2
        type6: {
            speed: 225,
            hp: 5,
            dir: 'left',
            score: 15,
            bulletType: bulletType.burst2,
            texture: s_tank6,
            rectLength: 60,
            itemType: null,
            factory: FlyTank2,
        },

        // the fly tracing tank
        type7: {
            speed: 125,
            hp: 5,
            dir: 'left',
            score: 20,
            bulletType: bulletType.burst,
            texture: s_tank7,
            rectLength: 60,
            itemType: null,
            factory: FlyTraceTank,
        },

        // rocket tank
        type8: {
            speed: 100,
            hp: 5,
            dir: 'left',
            score: 20,
            bulletType: bulletType.rocket,
            texture: s_tank8,
            rectLength: 60,
            itemType: null,
            factory: RocketTank,
        },
    },

    playerTank: {
        type1: {
            speed: 300,
            hp: 5,
            dir: 'right',
            bulletType: bulletType.type1,
            texture: s_tank0,
            rectLength: 40,
            factory: PlayerTank,
        }
    },
};
