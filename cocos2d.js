var cc = cc = cc || {};
cc.Dir = '';
cc.loadQue = [];
cc.COCOS2D_DEBUG = 2;
cc._DEBUG = 1;
cc._IS_RETINA_DISPLAY_SUPPORTED = 0;

cc.$ = function (x) {
    return document.querySelector(x);
};
cc.$new = function (x) {
    return document.createElement(x);
};

cc.loadjs = function (filename) {
    var script = cc.$new('script');
    script.src = cc.Dir + filename;
    script.order = cc.loadQue.length;
    cc.loadQue.push(script);

    script.onload = function () {
        if (this.order + 1 < cc.loadQue.length) {
            cc.$('head').appendChild(cc.loadQue[this.order + 1]);
        }
        else {
            cc.setup("gameCanvas");
            cc.AudioManager.sharedEngine().init("mp3");
            cc.Loader.shareLoader().onloading = function () {
                cc.LoaderScene.shareLoaderScene().draw();
            };
            cc.Loader.shareLoader().onload = function () {
                cc.AppController.shareAppController().didFinishLaunchingWithOptions();
            };
            cc.Loader.shareLoader().preload(g_ressources);
        }
    };
    if (script.order === 0)
    {
        cc.$('head').appendChild(script);
    }
};

cc.loadjs('Cocos2d-html5-canvasmenu-min.js');
cc.loadjs('protect_hku/AppDelegate.js');
cc.loadjs('Resource.js');
cc.loadjs('protect_hku/Config/util.js');
cc.loadjs('protect_hku/Config/global.js');
cc.loadjs('protect_hku/Object/item.js');
cc.loadjs('protect_hku/Object/prop.js');
cc.loadjs('protect_hku/Object/tank.js');
cc.loadjs('protect_hku/Object/bullet.js');
cc.loadjs('protect_hku/Config/bulletType.js');
cc.loadjs('protect_hku/Config/tankType.js');
cc.loadjs('protect_hku/Config/map.js');
cc.loadjs('protect_hku/Config/game.js');
cc.loadjs('protect_hku/Effect/effect.js');
cc.loadjs('protect_hku/Effect/explosion.js');
cc.loadjs('protect_hku/Layer/MenuLayer.js');
cc.loadjs('protect_hku/Layer/AboutLayer.js');
cc.loadjs('protect_hku/Layer/WinLoseLayer.js');
cc.loadjs('protect_hku/Layer/GameLayer.js');
