var bulletType = {
    type1: {
        speed: 400,
        power: 1,
        texture: s_normalBullet,
        effect: null,
        isExploded: true,
    },

    type2: {
        speed: 800,
        power: 1,
        texture: s_normalBullet,
        effect: null,
        isExploded: true,
    },

    rocket: {
        speed: 0,
        power: 1,
        texture: s_rocket,
        rectLength:40,
        effect: null,
        isExploded: true,
        accelSpeed: 50,
    },

    missile: {
        speed: 50,
        power: 2,
        texture: s_missile,
        rectLength: 27,
        effect: null,
        isExploded: true,
    },

    burst: {
        power: 2,
        isExploded: true,
        effect: null,
        texture: s_bomb,
    },

    burst2: {
        power: 2,
        isExploded: true,
        effect: null,
        texture: s_timebomb,
    },
};
