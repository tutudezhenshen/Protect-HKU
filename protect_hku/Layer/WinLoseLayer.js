var WinLoseLayer= cc.Layer.extend({

    init:function (isWin) {
        var flag = false;
        this._state = isWin;
        if (this._super()) {
            var win_lose_bg = cc.Sprite.create(s_winLoseBG);
            win_lose_bg.setAnchorPoint(cc.PointZero());
            this.addChild(win_lose_bg, -10);

            var winSize = cc.Director.sharedDirector().getWinSize();
            if (global.sound) {
                cc.AudioManager.sharedEngine().setBackgroundMusicVolume(1.0);
                cc.AudioManager.sharedEngine().playBackgroundMusic(s_bgm3, true);
            }

            this.scoreLabel = cc.LabelBMFont.create("" + global.score, "Resources/font.fnt");
            this.scoreLabel.setPosition(cc.ccp(global.winSize.width/2+60, global.winSize.height/2-10));
            this.addChild(this.scoreLabel, global.zOrder.lifeHP, ++TAG_RANDOM);
            this.scoreLabel.setScale(1.5, 1.5);

            if (this._state) {
                this.statePanel = cc.Sprite.create(s_winLose, cc.RectMake(0, 0, 646, 255.5));
            } else {
                this.statePanel = cc.Sprite.create(s_winLose, cc.RectMake(0, 255.5, 646, 255.5));
                global.score = 0;
            }
            this.statePanel.setPosition(cc.ccp(winSize.width/2+80, winSize.height*2/3+60));
            this.addChild(this.statePanel, 10);

            var restart_game = cc.Sprite.create(s_winLoseButton, cc.RectMake(0, 0, 180, 97));
            var restart_select = cc.Sprite.create(s_winLoseButton, cc.RectMake(0, 97,180, 97));
            var restart= cc.MenuItemSprite.create(restart_game , restart_select, this, this.restartLevel);
            var restartcall= cc.Menu.create(restart);
            this.addChild(restartcall, 1);
            restartcall.setPosition(cc.ccp(1*winSize.width/4, winSize.height/2-150));

            var back_button = cc.Sprite.create(s_winLoseButton, cc.RectMake(366, 0, 180,97));
            var back_select = cc.Sprite.create(s_winLoseButton, cc.RectMake(366, 97, 180,97));
            var back = cc.MenuItemSprite.create(back_button , back_select, this, this.backCallback);
            var backcall= cc.Menu.create(back);
            this.addChild(backcall, 1);
            backcall.setPosition(cc.ccp(3*winSize.width/4, winSize.height/2-150));

            flag = true;
        }
        return flag;
    },
    backCallback:function (pSender) {
        var scene = MenuLayer.create();
        cc.Director.sharedDirector().replaceScene(cc.TransitionFade.create(1.2,scene));
    },
    restartLevel: function(pSender) {
        var scene = GameLayer.scene();
        cc.Director.sharedDirector().replaceScene(cc.TransitionSlideInT.create(1, scene));
    },
    onExit: function() {
        // clean work
        this.removeAllChildrenWithCleanup();    },
});

WinLoseLayer.create = function (isWin) {
    var sg = new WinLoseLayer();
    if (sg && sg.init(isWin)) {
        return sg;
    }
    return null;
};

WinLoseLayer.scene = function (isWin) {
    var scene = cc.Scene.create();
    var layer =WinLoseLayer.create(isWin);
    scene.addChild(layer, 1);
    return scene;
};
