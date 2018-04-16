var AboutLayer = cc.Layer.extend({
    init:function () {
        var flag = false;
        if (this._super()) {
            var about_pic = cc.Sprite.create(s_about);
            about_pic.setAnchorPoint(cc.PointZero());
            this.addChild(about_pic, 0, 1);

            var back_button = cc.Sprite.create(s_backButton, cc.RectMake(0, 0, 66, 64));
            var button_select = cc.Sprite.create(s_backButton, cc.RectMake(66, 0, 66, 64));
            var back = cc.MenuItemSprite.create(back_button , button_select, this, this.backCallback);
            var backcall = cc.Menu.create(back);
            this.addChild(backcall, 1);
            backcall.setAnchorPoint(cc.ccp(1, 1));
            backcall.setPosition(cc.ccp(winSize.width-60, winSize.height-70));
            flag = true;
        }

        return flag;
    },

    backCallback:function (pSender) {
        var scene = cc.Scene.create();
        scene.addChild(MenuLayer.create());
        cc.Director.sharedDirector().replaceScene(cc.TransitionFade.create(1.2, scene));
    },

    onExit: function() {
        this.removeAllChildrenWithCleanup();
    },
});

AboutLayer.create = function () {
    var sg = new AboutLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

AboutLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = AboutLayer.create();
    scene.addChild(layer, 1);
    return scene;
};
