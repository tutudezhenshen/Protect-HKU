var MenuLayer = cc.Layer.extend({
    init:function () {
        var flag = false;
        if (this._super) {
            winSize = cc.Director.sharedDirector().getWinSize();
               if (global.sound) {
                cc.AudioManager.sharedEngine().setBackgroundMusicVolume(1.0);
                cc.AudioManager.sharedEngine().playBackgroundMusic(s_bgm2, true);
            }
            this.setIsTouchEnabled(true);

            var sp = cc.Sprite.create(s_loading);
            sp.setAnchorPoint(cc.PointZero());
            this.addChild(sp, 0, 1);

            var logo = cc.Sprite.create(s_logo);
            this.addChild(logo, 4);
            logo.setPosition(cc.ccp(winSize.width - 100, winSize.height - 100));

            var start_game = cc.Sprite.create(s_menubutton, cc.RectMake(0, 40, 230, 90));
            var game_select = cc.Sprite.create(s_menubutton, cc.RectMake(0, 125, 230, 90));

            var about_game = cc.Sprite.create(s_menubutton, cc.RectMake(250, 40, 230, 90));
            var about_select = cc.Sprite.create(s_menubutton, cc.RectMake(250, 125, 230, 90));

            var new_game = cc.MenuItemSprite.create(start_game, game_select, this, this.onnew_game);
            var action1 = cc.ScaleBy.create(1, 1.1);
            new_game.runAction(cc.RepeatForever.create(cc.Sequence.create(action1, action1.reverse())));

            var about = cc.MenuItemSprite.create(about_game, about_select ,this,this.onNewAbout);
            var action2 = cc.ScaleBy.create(1, 1.1);
            about.runAction(cc.RepeatForever.create(cc.Sequence.create(action2, action2.reverse())));

            var menu1 = cc.Menu.create(new_game);
            this.addChild(menu1, 3);
            menu1.setPosition(cc.ccp(winSize.width/2-200, winSize.height/2-150));

            var menu2 = cc.Menu.create(about);
            this.addChild(menu2, 1);
            menu2.setAnchorPoint(cc.ccp(1, 1));
            menu2.setPosition(cc.ccp(winSize.width/2+200, winSize.height/2-150));

            flag = true;
        }
        return flag;
    },

    onnew_game:function (pSender) {
        this.onButtonEffect();
        var scene = GameLayer.scene();
        cc.Director.sharedDirector().replaceScene(cc.TransitionFade.create(1.2, scene));

    },

    onNewAbout:function (pSender) {
        this.onButtonEffect();
        var scene = AboutLayer.scene();
        cc.Director.sharedDirector().replaceScene(cc.TransitionFade.create(1.2, scene));
    },

    onExit: function() {
        this.removeAllChildrenWithCleanup();
    },
    
    onButtonEffect:function(){
        if (global.sound) {
            var s = cc.AudioManager.sharedEngine().playEffect(s_mouseClickSound);
        }
    }
});

MenuLayer.create = function () {
    var sg = new MenuLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

MenuLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = MenuLayer.create();
    scene.addChild(layer);
    return scene;
};
