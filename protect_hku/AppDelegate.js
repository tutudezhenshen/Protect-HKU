var cc = cc = cc || {};

cc.AppDelegate = cc.Application.extend({
    ctor:function () {
        this._super();
    },
    /**
     @brief    Implement for initialize OpenGL instance, set source path, etc...
     */
    initInstance:function () {
        return true;
    },

    /**
     @brief    Implement CCDirector and CCScene init code here.
     @return true    Initialize success, app continue.
     @return false   Initialize failed, app terminate.
     */
    applicationDidFinishLaunching:function () {
        var pDirector = cc.Director.sharedDirector();
        pDirector.setDisplayFPS(true);
        pDirector.setAnimationInterval(0.1);

        var pScene = MenuLayer.scene();
        pDirector.runWithScene(pScene);
        return true;
    },

    /**
     @brief  The function be called when the application enter background
     @param  the pointer of the application
     */
    applicationDidEnterBackground:function () {
        cc.Director.sharedDirector().pause();
    },

    /**
     @brief  The function be called when the application enter foreground
     @param  the pointer of the application
     */
    applicationWillEnterForeground:function () {
        cc.Director.sharedDirector().resume();
    }
});
