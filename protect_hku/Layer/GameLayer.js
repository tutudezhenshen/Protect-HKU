var TAG_TILE_MAP = 1;
var TAG_BACKGROUND = 2;
var TAG_RANDOM = 11;
var TAG_PAUSE = 100;

var GameLayer = cc.Layer.extend({
    ctor: function() {
        this.setIsTouchEnabled(true);
        this.setIsKeypadEnabled(true);
        this.pauseflag=true;
    },

    init: function() {
        Explosion.sharedExplosion();
        this.gameManager();
        this.loadTank();
        this.loadItem();
        this.initLife_HP_score();
        this.initProp.call(this, {});
        this.schedule(this.update);
        this.schedule(this.begin);
        this.schedule(this.loadItem, 90);

        if (global.sound) {
            cc.AudioManager.sharedEngine().setBackgroundMusicVolume(1.0);
            cc.AudioManager.sharedEngine().playBackgroundMusic(s_bgm1, true);
        }
        return true;
    },

    begin: function() {
        this.unschedule(this.begin);
        var gamebegin = cc.Sprite.create(s_gamebegin);
        gamebegin.setPosition(cc.ccp(global.winSize.width/2, global.winSize.height/2));
        this.addChild(gamebegin, global.zOrder.gamebegin, TAG_RANDOM++);

        var remove = cc.CallFunc.create(this, function () {
            this.removeChild(gamebegin);
        });
        this.pause();

        var delay = cc.DelayTime.create(2);
        var resume = cc.CallFunc.create(this, this.resume);
        this.runAction(cc.Sequence.create(delay, remove, resume, null));
    },

    pause: function() {
        cc.Scheduler.sharedScheduler().pauseTarget(this);
        for (var i = 0; i < global.enemyTank.length; i++) {
            cc.Scheduler.sharedScheduler().pauseTarget(global.enemyTank[i]);
        }
        for (var i = 0; i < global.flyTank.length; i++) {
            cc.Scheduler.sharedScheduler().pauseTarget(global.flyTank[i]);
        }
        for (var i = 0; i < global.enemyBurst.length; i++) {
            cc.Scheduler.sharedScheduler().pauseTarget(global.enemyBurst[i]);
        }
    },

    pauseControl:function(){
        this.onButtonEffect();
        if(this.pauseflag){
            this.pause();
            this._pausebg = cc.Sprite.create(s_pausebg);
            this.addChild(this._pausebg, 10,TAG_PAUSE);
            this._pausebg.setPosition(cc.ccp(global.winSize.width/2, global.winSize.height/2));

            var button1 = cc.Sprite.create(s_pausebutton, cc.RectMake(0, 0, 180, 100));
            var button2 = cc.Sprite.create(s_pausebutton, cc.RectMake(0, 100, 180, 100));
            var continue_game = cc.MenuItemSprite.create(button1 , button2, this, this.resumeCallback);
            this.menu1 = cc.Menu.create(continue_game);
            this.addChild(this .menu1, 11, TAG_PAUSE++)
            this.menu1.setPosition(cc.ccp(global.winSize.width/2, global.winSize.height/2+100));

            var button3 = cc.Sprite.create(s_pausebutton,cc.RectMake(360, 0, 180, 100));
            var button4= cc.Sprite.create(s_pausebutton,cc.RectMake(360, 100, 180, 100));
            var leave_game= cc.MenuItemSprite.create(button3 , button4, this, this.backCallback);
            this.menu2 = cc.Menu.create(leave_game);
            this.addChild( this.menu2, 11,TAG_PAUSE++);
            this.menu2.setPosition(cc.ccp(global.winSize.width/2, global.winSize.height/2-100));
        }
        this.pauseflag=false;
    },

    resume: function() {
        cc.Scheduler.sharedScheduler().resumeTarget(this);
        for (var i = 0; i < global.enemyTank.length; i++) {
            cc.Scheduler.sharedScheduler().resumeTarget(global.enemyTank[i]);
        }
        for (var i = 0; i < global.flyTank.length; i++) {
            cc.Scheduler.sharedScheduler().resumeTarget(global.flyTank[i]);
        }
        for (var i = 0; i < global.enemyBurst.length; i++) {
            cc.Scheduler.sharedScheduler().resumeTarget(global.enemyBurst[i]);
        }
    },

    resumeCallback:function (pSender) {
        this.onButtonEffect();
        this.resume();
        this.removeChild(this._pausebg );
        this.removeChild(this.menu1);
        this.removeChild(this.menu2);
        this.pauseflag=true;
    },

    backCallback:function (pSender) {
        this.onButtonEffect();
        var scene = cc.Scene.create();
        scene.addChild(MenuLayer.create());
        cc.Director.sharedDirector().replaceScene(cc.TransitionFade.create(1.2, scene));
    },

    freeze: function() {
        console.log("freeze");
        this.unschedule(this.unfreeze);
        global.freeze = true;
        for (var i = 0; i < global.enemyTank.length; i++) {
            try {
                var ice = cc.Sprite.create(s_ice);
                var tmp = global.enemyTank[i].getPosition();
                ice.setPosition(cc.ccp(tmp.x+180, tmp.y+50));
                this.getParent().addChild(ice, global.zOrder.ice_HPreduce);
                ice.runAction(cc.Sequence.create(cc.FadeOut.create(10), cc.CallFunc.create(ice, ice.removeFromParentAndCleanup)));
            } catch (ex) {
                cc.Log("ice error");
            }
            cc.Scheduler.sharedScheduler().pauseTarget(global.enemyTank[i]);
        }
        for (var i = 0; i < global.flyTank.length; i++) {
            try {
                var ice = cc.Sprite.create(s_ice);
                var tmp = global.flyTank[i].getPosition();
                ice.setPosition(cc.ccp(tmp.x + 180, tmp.y + 50));
                this.getParent().addChild(ice, global.zOrder.ice_HPreduce);
                ice.runAction(cc.Sequence.create(cc.FadeOut.create(10), cc.CallFunc.create(ice, ice.removeFromParentAndCleanup)));
            } catch (ex) {
                cc.Log("ice error");
            }
            cc.Scheduler.sharedScheduler().pauseTarget(global.flyTank[i]);
        }
        this.schedule(this.unfreeze, 10);
    },

    unfreeze: function() {
        this.unschedule(this.unfreeze);
        global.freeze = false;
        for (var i = 0; i < global.enemyTank.length; i++) {
            cc.Scheduler.sharedScheduler().resumeTarget(global.enemyTank[i]);
        }
        for (var i = 0; i < global.flyTank.length; i++) {
            cc.Scheduler.sharedScheduler().resumeTarget(global.flyTank[i]);
        }
    },

    initGlobal: function() {
        global.GameLayer = this;
        global.winSize.width = this.winSize.width;
        global.winSize.height = this.winSize.height;
        global.warMap.width = this.map.getMapSize().width * this.map.getTileSize().width;
        global.warMap.height = this.map.getMapSize().height * this.map.getTileSize().height;
        global.warMap.tileWidth = this.map.getTileSize().width;
        global.warMap.tileHeight = this.map.getTileSize().height;
    },

    updateGlobalOpacity: function() {
        this.schedule(this.setGlobalOpacity, 15);
    },

    setGlobalOpacity: function() {
        global.opacity = 25;
        this.unschedule(this.setGlobalOpacity);
    },

    gameManager: function() {
        this.game = game;
        this.winSize = cc.Director.sharedDirector().getWinSize();

        if (this.game.bgImage) {
            this.image = cc.Sprite.create(this.game.bgImage);
            this.addChild(this.image, -1, TAG_BACKGROUND);
            this.image.setAnchorPoint(cc.ccp(0.5, 0.5));
            this.image.setPosition(cc.ccp(this.winSize.width/2, this.winSize.height/2));
        } else {
            var image = cc.Sprite.create(s_mapBackground);
            this.addChild(image, -1, TAG_BACKGROUND);
            image.setAnchorPoint(cc.ccp(0.5, 0.5));
            image.setPosition(cc.ccp(this.winSize.width/2, this.winSize.height/2));
        }

        this.map = cc.TMXTiledMap.create(this.game.map.src);
        mapp = this.map;
        this.addChild(this.map, 0, TAG_TILE_MAP);
        this.map.setAnchorPoint(cc.ccp(0.5, 0.5));
        this.map.setPosition(cc.ccp(this.winSize.width/2, this.winSize.height/2));

        this.initGlobal();

        try {
            if (this.game.map.layers.mudLayer) {
                var mudTile;
                var mudLayer = this.map.layerNamed("mudLayer");
                for (var i = 0; i < mudLayer._children.length; i++) {
                    mudTile = mudLayer._children[i];
                    global.layer.mudLayer[
                    ""+Math.ceil(mudTile._position.x / global.warMap.tileWidth)+"-"+Math.ceil(10 - mudTile._position.y / global.warMap.tileHeight - 1)
                        ] = mudTile;
                }
            }

            if (this.game.map.objects.stoneObjects) {
                var stoneObjects = this.map.objectGroupNamed("stoneObjects").getObjects();
                for (var i = 0; i < stoneObjects.length; i++) {
                    global.stoneObjects.push(new cc.Rect(stoneObjects[i].x, stoneObjects[i].y, stoneObjects[i].width, stoneObjects[i].height));
                }
            }

            if (this.game.map.objects.mudObjects) {
                var mudObjects = this.map.objectGroupNamed("mudObjects").getObjects();
                for (var i = 0; i < mudObjects.length; i++) {
                    global.mudObjects.push(new cc.Rect(mudObjects[i].x, mudObjects[i].y, mudObjects[i].width, mudObjects[i].height));
                }
            }
        } catch (ex) {
            cc.Log("init layers/objects error!");
        }

        var pause_game = cc.Sprite.create(s_pausebutton, cc.RectMake(540, 0, 60,60));
        var pause_select = cc.Sprite.create(s_pausebutton, cc.RectMake(540, 100, 60,60));
        var pause = cc.MenuItemSprite.create(pause_game , pause_select, this, this.pauseControl);
        var pausecall = cc.Menu.create(pause);
        pausecall.setAnchorPoint(cc.ccp(1,0));
        pausecall.setPosition(cc.ccp(global.winSize.width-40, 65));
        this.addChild(pausecall, 9);
    },

    loadTank: function() {
        this.enemyTankCount = 0;
        this.MaxTank = this.game.MaxTank;
        this.enemyTankType = [];
        for (var i = 0; i < this.game.enemyTankType.length; i++) {
            this.enemyTankType.push(this.game.enemyTankType[i]);
        }
        this.enemyTankNum = [];
        for (var i = 0; i < this.game.enemyTankNum.length; i++) {
            this.enemyTankNum.push(this.game.enemyTankNum[i]);
            this.enemyTankCount += this.game.enemyTankNum[i];
        }

        var tmp = tankType.playerTank.type1.Clone();
        var tank = new tmp.factory(tmp);
        this.map.addChild(tank, tank._zOrder, ++TAG_RANDOM);
        global.playerLife--;

        for (var i = 0; i < this.MaxTank; i++) {
            for (var j = 0; j < this.enemyTankType.length; j++) {
                if (this.enemyTankNum[j] > 0) {
                    var tmp = this.enemyTankType[j].Clone();
                    tank = new tmp.factory(tmp);
                    this.enemyTankNum[j]--;
                    this.enemyTankCount--;
                    this.map.addChild(tank, tank._zOrder, ++TAG_RANDOM);
                    break;
                } else {
                    continue;
                }
            }
        }
    },

    loadItem: function() {
        var item, tmp = {
            appearPosition: cc.ccp(0, 0)
        };
        for (var i = 0; i < this.game.itemType.length; i++) {
            tmp.appearPosition = cc.ccp(this.game.itemPosition[i].x, this.game.itemPosition[i].y);
            item = new this.game.itemType[i](tmp);
            this.map.addChild(item, global.zOrder.prop, ++TAG_RANDOM);
            global.item.push(item);
        }
    },

    initLife_HP_score: function() {
        this.LifePanel = [];

        var LifeAndHP = cc.Sprite.create(s_lifeHp);
        LifeAndHP.setAnchorPoint(cc.ccp(0, 1));
        LifeAndHP.setPosition(cc.ccp(0, global.winSize.height));
        this.addChild(LifeAndHP, global.zOrder.life_HP_tool_column, ++TAG_RANDOM);

        this.hp_green = cc.Sprite.create(s_hpGreen);
        this.hp_green.setAnchorPoint(cc.ccp(0, 1));
        this.hp_green.setPosition(cc.ccp(69, global.winSize.height-41));
        this.addChild(this.hp_green, global.zOrder.lifeHP, ++TAG_RANDOM);

        this.hp_red = cc.Sprite.create(s_hpRed);
        this.hp_red.setAnchorPoint(cc.ccp(0, 1));
        this.hp_red.setPosition(cc.ccp(69, global.winSize.height-41));
        this.hp_red.setOpacity(0);
        this.addChild(this.hp_red, global.zOrder.lifeHP, ++TAG_RANDOM);

        var tool_column = cc.Sprite.create(s_toolColumn);
        tool_column.setAnchorPoint(cc.ccp(0, 1));
        tool_column.setPosition(cc.ccp(0, global.winSize.height-60));
        this.addChild(tool_column, global.zOrder.life_HP_tool_column, ++TAG_RANDOM);

        for (var i = 0; i < global.playerLife; i++) {
            var life = cc.Sprite.create(s_life);
            life.setAnchorPoint(cc.ccp(0, 1));
            life.setPosition(cc.ccp(56.999+i*37, global.winSize.height-5));
            this.addChild(life, global.zOrder.lifeHP, ++TAG_RANDOM);
            this.LifePanel.push(life);
        }

        this.scoreLabel = cc.LabelBMFont.create("Score: " + global.score, "Resources/font.fnt");
        this.scoreLabel.setPosition(cc.ccp(global.winSize.width-90, global.winSize.height-30));
        this.addChild(this.scoreLabel, global.zOrder.lifeHP, ++TAG_RANDOM);
    },

    updateScore: function() {
        this.scoreLabel.setString("Score: " + global.score);
    },

    AddReduceLifePanel: function(flag) {
        if (flag) {
            var life = cc.Sprite.create(s_life);
            life.setAnchorPoint(cc.ccp(0, 1));
            life.setPosition(cc.ccp(56.999 + this.LifePanel.length*37, global.winSize.height-5));
            this.addChild(life, global.zOrder.lifeHP, ++TAG_RANDOM);
            this.LifePanel.push(life);
        } else {
            try {
                this.LifePanel[this.LifePanel.length - 1].removeFromParentAndCleanup(true);
                this.LifePanel.pop();
            } catch (ex) {
                //
            }
        }
    },

    updateHPpanel: function(percent) {
        this.hp_green.setScaleX(percent);
        this.hp_red.setScaleX(percent);
        this.hp_red.setOpacity((1-percent)*255);
    },

    initProp: function() {
        this.PropLabel = [];

        this.PropLabel1 = cc.LabelTTF.create("", cc.SizeMake(60, 50), cc.TEXT_ALIGNMENT_RIGHT, "Comic Sans MS", 32);
        this.PropLabel1.setPosition(cc.ccp(30, global.winSize.height-90));
        this.addChild(this.PropLabel1, 10, ++TAG_RANDOM);
        this.PropLabel.push(this.PropLabel1);

        this.PropLabel2 = cc.LabelTTF.create("", cc.SizeMake(60, 50), cc.TEXT_ALIGNMENT_RIGHT, "Comic Sans MS", 32);
        this.PropLabel2.setPosition(cc.ccp(30, global.winSize.height-145));
        this.addChild(this.PropLabel2, 10, ++TAG_RANDOM);
        this.PropLabel.push(this.PropLabel2);

        this.PropLabel3 = cc.LabelTTF.create("", cc.SizeMake(60, 50), cc.TEXT_ALIGNMENT_RIGHT, "Comic Sans MS", 32);
        this.PropLabel3.setPosition(cc.ccp(30, global.winSize.height-205));
        this.addChild(this.PropLabel3, 10, ++TAG_RANDOM);
        this.PropLabel.push(this.PropLabel3);
        this.propTag = new Array();

        for (var i = 0; i < global.propType.length; i++) {
            if (global.propNum[i] && global.propNum[i] >= 1) {
                var prop = new global.propType[i]( {
                    appearPosition: cc.ccp(44, 544-i*56)
                } );
                this.addChild(prop, global.zOrder.lifeHP, ++TAG_RANDOM);
                this.propTag.push(prop._tag);
                this.PropLabel[i].setString("*" + global.propNum[i]);
            }
        }
    },

    updateProp: function() {
        if (this.propTag.length >= 1) {
            for (var i = 0; i < this.propTag.length; i++) {
                this.removeChildByTag(this.propTag[i]);
            }
        }
        for (var i = 0; i < this.PropLabel.length; i++) {
            this.PropLabel[i].setString("");
        }
        this.propTag = [];
        for (var i = 0; i < global.propType.length; i++) {
            if (global.propNum[i] && global.propNum[i] >= 1) {
                var prop = new global.propType[i]( {
                    appearPosition: cc.ccp(44, 544 - i * 56)
                } );
                this.addChild(prop, global.zOrder.lifeHP, ++TAG_RANDOM);
                this.propTag.push(prop._tag);
                this.PropLabel[i].setString("*" + global.propNum[i]);
            }
        }
    },

    useProp: function(index) {
        if (global.propNum[index - 1] >= 1) {
            var tmp = new global.propType[index - 1]( {
                appearPosition: cc.ccp(0,0)
            } );
            tmp.use();
            tmp = null;
            global.propNum[index - 1] -= 1;
            if (global.propNum[index - 1] <= 0) {
                global.propType.splice(index - 1, 1);
                global.propNum.splice(index - 1, 1);
            }
            this.updateProp.call(this, {});
        }
    },

    playerTankKill: function() {
        this.AddReduceLifePanel(false);
        if ((--global.playerLife) < 0) {
            this.updateHPpanel(0);
            var delay = cc.DelayTime.create(2);
            var win = cc.CallFunc.create(this, this.losegame);
            this.runAction(cc.Sequence.create(delay, win, null));
        } else {
            this.updateHPpanel(1);
            var tmp = tankType.playerTank.type1.Clone();
            var tank = new tmp.factory(tmp);
            this.map.addChild(tank, tank._zOrder, ++TAG_RANDOM);
        }
    },

    anEnemyTankKill: function(enemyTank) {
        global.score += enemyTank._score;
        this.updateScore();
        var tank;
        if (this.enemyTankCount > 0 && (global.enemyTank.length + global.flyTank.length) < this.MaxTank) {
            for (var j = 0; j < this.enemyTankType.length; j++) {
                if (this.enemyTankNum[j] > 0) {
                    var tmp = this.enemyTankType[j];
                    tank = new tmp.factory(tmp);
                    this.enemyTankNum[j]--;
                    this.enemyTankCount--;
                    this.map.addChild(tank, tank._zOrder, ++TAG_RANDOM);
                    break;
                } else {
                    continue;
                }
            }
        } else if (global.playerLife >= 0 && global.enemyTank.length == 0 && global.flyTank.length == 0) {
            var delay = cc.DelayTime.create(2);
            var win = cc.CallFunc.create(this, this.wingame);
            this.runAction(cc.Sequence.create(delay, win, null));
        }
    },

    keyDown: function(e) {
        if (e == 80) {
            this.pause();
        } else if (e == 82) {
            this.resume();
        }
        keys[e] = true;
    },

    keyUp: function(e) {
        if (e == 49 && this == global.GameLayer) {
            global.GameLayer.useProp(1);
        }
        if (e == 50 && this == global.GameLayer) {
            global.GameLayer.useProp(2);
        }
        if (e == 51 && this == global.GameLayer) {
            global.GameLayer.useProp(3);
        }
        keys[e] = false;
    },

    update: function (dt) {
        for (var i = 0; i < global.playerTank.length; ++i) {
            global.playerTank[i].move(dt);
        }

        if (!global.freeze) {
            for (var i = 0; i < global.enemyTank.length; ++i) {
                global.enemyTank[i].move(dt);
            }
            for (var j = 0; j < global.flyTank.length; ++j) {
                global.flyTank[j].move(dt);
            }
        }

        for (var i = 0; i < global.enemyMissile.length; ++i) {
            global.enemyMissile[i].move(dt);
        }

        outerLoop3:
            for (var i = 0; i < global.rocketBullet.length; i++) {
                var rocket = global.rocketBullet[i];
                if (rocket.getPosition().x <= -170 || Math.abs(rocket.getPosition().x - global.winSize.width) < 190 || rocket.getPosition().y <= -40 || Math.abs(rocket.getPosition().y - global.winSize.height) <= 60) {
                    rocket.destroy();
                    continue;
                }
                for (var m = 0; m < global.playerTank.length; ++m) {
                    tank = global.playerTank[m];
                    if (collide(rocket, tank)) {
                        rocket.destroy();
                        tank.hit(rocket);
                        continue outerLoop3;
                    }
                }
                rocket.move(dt);
            }

        for (var i = 0; i < global.enemyBurst2.length; i++) {
            var burst2 = global.enemyBurst2[i];
            for (var j = 0; j < global.playerTank.length; j++) {
                var tank = global.playerTank[j];
                if (collide(tank, burst2)) {
                    burst2.setOff();
                    break;
                }
            }
        }

        var bullet, stoneObj, mudObj, tank, item, missile;
        for (var m = 0; m < global.item.length; ++m) {
            item = global.item[m] ;
            for (var n = 0; n < global.playerTank.length; ++n) {
                tank = global.playerTank[n];
                if (collide(tank, item)) {
                    item.eatenBy(tank);
                    item.destroy();
                    break;
                } else {
                    continue;
                }
            }
        }

        outerLoop:
            for (var i = 0; i < global.playerBullet.length; ++i) {
                bullet = global.playerBullet[i];
                for (var k = 0; k < global.mudObjects.length; ++k) {
                    mudObj = global.mudObjects[k];
                    if (collide(bullet, mudObj)) {
                        bullet.destroy();
                        cc.ArrayRemoveObject(global.mudObjects, mudObj);
                        var tx = Math.ceil((mudObj.origin.x + global.warMap.tileWidth / 2) / global.warMap.tileWidth - 1);
                        var ty = Math.ceil(10 - (mudObj.origin.y + global.warMap.tileHeight / 2) / global.warMap.tileHeight - 1);
                        try {
                            this.map.layerNamed("mudLayer").removeChild(global.layer.mudLayer[""+tx+"-"+ty]);
                            global.layer.mudLayer[""+tx+"-"+ty] = null;
                        } catch (ex) {
                            cc.Log("remove mudLayer error!");
                        }
                        continue outerLoop;
                    }
                }

                for (var j = 0; j < global.stoneObjects.length; ++j) {
                    stoneObj = global.stoneObjects[j];
                    if (collide(bullet, stoneObj)) {
                        cc.Log("collide with stoneObj");
                        bullet.destroy();
                        continue outerLoop;
                    }
                }
                var s = bullet.getPosition();
                if (s.x <= -170 || Math.abs(s.x - global.winSize.width) < 190 || s.y <= -40 || Math.abs(s.y - global.winSize.height) <= 60) {
                    bullet.destroy();
                    continue outerLoop;
                }

                for (var m = 0; m < global.enemyTank.length; ++m) {
                    tank = global.enemyTank[m];
                    if (collide(bullet, tank)) {
                        bullet.destroy();
                        tank.hit(bullet);
                        continue outerLoop;
                    }
                }

                for (var n = 0; n < global.flyTank.length; ++n) {
                    tank = global.flyTank[n];
                    if (collide(bullet, tank)) {
                        bullet.destroy();
                        tank.hit(bullet);
                        continue outerLoop;
                    }
                }

                bullet.move(dt);

                for (var n = 0; n < global.enemyMissile.length; ++n) {
                    missile = global.enemyMissile[n];
                    if (collide(bullet, missile)) {
                        bullet.destroy();
                        missile.destroy();
                        continue outerLoop;
                    }
                }
            }

        outerLoop2:
            for (var i = 0; i < global.enemyBullet.length; ++i) {
                bullet = global.enemyBullet[i];
                for (var k = 0; k < global.mudObjects.length; ++k) {
                    mudObj = global.mudObjects[k];
                    if (collide(bullet, mudObj)) {
                        bullet.destroy();
                        cc.ArrayRemoveObject(global.mudObjects, mudObj);
                        var tx = Math.ceil((mudObj.origin.x + global.warMap.tileWidth / 2) / global.warMap.tileWidth - 1);
                        var ty = Math.ceil(10 - (mudObj.origin.y + global.warMap.tileHeight / 2) / global.warMap.tileHeight - 1);
                        try {
                            this.map.layerNamed("mudLayer").removeChild(global.layer.mudLayer[""+tx+"-"+ty]);
                            global.layer.mudLayer[""+tx+"-"+ty] = null;
                        } catch (ex) {
                            cc.Log("remove mudLayer error!");
                        }
                        continue outerLoop2;
                    }
                }

                for (var j = 0; j < global.stoneObjects.length; ++j) {
                    stoneObj = global.stoneObjects[j];
                    if (collide(bullet, stoneObj)) {
                        bullet.destroy();
                        continue outerLoop2;
                    }
                }
                var s = bullet.getPosition();

                if (s.x <= -170 || Math.abs(s.x - global.winSize.width) < 190 || s.y <= -40 || Math.abs(s.y - global.winSize.height) <= 60) {
                    bullet.destroy();
                    continue outerLoop2;
                }

                for (var m = 0; m < global.playerTank.length; ++m) {
                    tank = global.playerTank[m];
                    if (collide(bullet, tank)) {
                        bullet.destroy();
                        tank.hit(bullet);
                        continue outerLoop2;
                    }
                }
                bullet.move(dt);
            }
    },

    losegame: function() {
        obj = this;
        cc.Log("you lose!");
        this._gameState = 'lose';
        var scene = WinLoseLayer.scene(false);
        cc.Director.sharedDirector().replaceScene(cc.TransitionSlideInB.create(1, scene));
    },

    wingame: function() {
        cc.Log("you win!");
        this._gameState = 'win';
        var scene = WinLoseLayer.scene(true);
        cc.Director.sharedDirector().replaceScene(cc.TransitionSlideInB.create(1, scene));
    },

    onExit: function() {
        this.setIsKeypadEnabled(false);
        this.setIsTouchEnabled(false);
        global.winSize = {
            width: null,
            height: null
        };
        global.warMap = {};
        global.opacity = 25;
        global.freeze = false;
        global.nextgame = 1;

        if (this._gameState == 'win') {
            global.previous.speed = global.playerTank[0]._speed;
            global.previous.maxBullet = global.playerTank[0]._maxBullet;
            global.previous.bulletType = global.playerTank[0]._bulletType;
            global.previous.factory = global.playerTank[0] ._factory;
        } else {
            global.playerLife = 3;
            global.previous = {};
        }

        global.playerTank = [];
        global.GameLayer = null;
        global.enemyCount = 0;
        global.enemyPlaceOrder = 0;
        global.layer.mudLayer = {};
        global.layer.stoneLayer = null;
        global.stoneObjects = [];
        global.mudObjects = [];
        global.waterObjects = [];
        global.enemyTank = [];
        global.flyTank = [];
        global.enemyBullet = [];
        global.rocketBullet = [];
        global.enemyBurst = [];
        global.enemyBurst2 = [];
        global.enemyMissile = [];
        global.playerBullet = [];
        global.item = [];

        TAG_RANDOM = 11;
        this.removeAllChildrenWithCleanup();
    },
    onButtonEffect:function(){
        if (global.sound) {
            var s = cc.AudioManager.sharedEngine().playEffect(s_mouseClickSound);
        }
    }
});

GameLayer.create = function() {
    var gl = new GameLayer();
    if (gl && gl.init()) {
        return gl;
    }
};

GameLayer.scene = function() {
    var scene = cc.Scene.create();
    var layer = GameLayer.create();
    scene.addChild(layer);
    return scene;
};
