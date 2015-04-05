declare('BattleDialog', function() {
    include('Element');
    include('Dialog');
    include('CoreUtils');
    include('Resources');
    include('ProgressBar');
    include('Button');
    include('Game');
    include('Data');
    include('InterfaceState');
    include('EventAggregate');
    include('StaticData');



    BattleDialog.prototype = dialog.prototype();
    BattleDialog.prototype.$super = parent;
    BattleDialog.prototype.constructor = BattleDialog;

    function BattleDialog() {
        dialog.construct(this);

        this.id = "battleDialog";

        this.canClose = false;

        this.monsterName = undefined;
        this.monsterHealthBar = undefined;
        this.resurrectionBar = undefined;
        this.enterBattleButton = undefined;
        this.leaveBattleButton = undefined;
        this.battleLevelDownButton = undefined;
        this.battleLevelUpButton = undefined;
        this.levelUpButton = undefined;
        this.attackButton = undefined;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    BattleDialog.prototype.dialogInit = BattleDialog.prototype.init;
    BattleDialog.prototype.init = function(parent, attributes) {
        this.dialogInit(parent, attributes);

        this.setHeaderText("Battle");

        // Just a plain element for the monster name for now...
        this.monsterName = element.create("monsterName");
        this.monsterName.templateName = "globalTextElement";
        this.monsterName.init(this.getContentArea());
        this.monsterName.addClass("monsterName");
        this.addManagedChild(this.monsterName);

        this.monsterHealthBar = progressBar.create("monsterHealthBar");
        this.monsterHealthBar.init(this.getContentArea());
        this.monsterHealthBar.animate = true;
        this.monsterHealthBar.setImages(resources.ImageProgressRedHorizontalLeft, resources.ImageProgressRedHorizontalMid, resources.ImageProgressRedHorizontalRight);
        this.monsterHealthBar.setBackgroundImages(resources.ImageProgressBackHorizontalLeft, resources.ImageProgressBackHorizontalMid, resources.ImageProgressBackHorizontalRight);
        this.addManagedChild(this.monsterHealthBar);

        this.resurrectionBar = progressBar.create("resurrectionBar");
        this.resurrectionBar.init(this.getContentArea());
        this.resurrectionBar.setImages(resources.ImageProgressGreenHorizontalLeft, resources.ImageProgressGreenHorizontalMid, resources.ImageProgressGreenHorizontalRight);
        this.resurrectionBar.setBackgroundImages(resources.ImageProgressBackHorizontalLeft, resources.ImageProgressBackHorizontalMid, resources.ImageProgressBackHorizontalRight);
        this.addManagedChild(this.resurrectionBar);

        this.enterBattleButton = button.create('enterBattleButton');
        this.enterBattleButton.callback = function(obj) { game.enterBattle(); };
        this.enterBattleButton.init(this.getContentArea());
        this.enterBattleButton.setImages(resources.ImageButton, resources.ImageButtonHover);
        this.addManagedChild(this.enterBattleButton);

        this.leaveBattleButton = button.create('leaveBattleButton');
        this.leaveBattleButton.callback = function(obj) { game.leaveBattle(); };
        this.leaveBattleButton.init(this.getContentArea());
        this.leaveBattleButton.setImages(resources.ImageButton, resources.ImageButtonHover);
        this.addManagedChild(this.leaveBattleButton);

        this.battleLevelDownButton = button.create('battleLevelDownButton');
        this.battleLevelDownButton.callback = function(obj) { game.changeBattleLevel(-1); };
        this.battleLevelDownButton.init(this.getContentArea());
        this.battleLevelDownButton.setImages(resources.ImageButton, resources.ImageButtonHover);
        this.battleLevelDownButton.setButtonText("-");
        this.addManagedChild(this.battleLevelDownButton);

        this.battleLevelUpButton = button.create('battleLevelUpButton');
        this.battleLevelUpButton.callback = function(obj) { game.changeBattleLevel(1); };
        this.battleLevelUpButton.init(this.getContentArea());
        this.battleLevelUpButton.setImages(resources.ImageButton, resources.ImageButtonHover);
        this.battleLevelUpButton.setButtonText("+");
        this.addManagedChild(this.battleLevelUpButton);

        this.attackButton = button.create('attackButton');
        this.attackButton.callback = function(obj) { game.attack(); };
        this.attackButton.init(this.getContentArea());
        this.attackButton.setImages(resources.ImageButton, resources.ImageButtonHover, resources.ImageIconAttack);
        this.addManagedChild(this.attackButton);

        this.levelUpButton = button.create('levelUpButton');
        this.levelUpButton.callback = function(obj) { if(game.player.getSkillPoints() > 0) { include('UserInterface'); userInterface.displayLevelUpWindow(); }};
        this.levelUpButton.init(this.getContentArea());
        this.levelUpButton.setImages(resources.ImageButton, resources.ImageButtonHover);
        this.levelUpButton.setButtonText("Level Up");
        this.addManagedChild(this.levelUpButton);
    };

    BattleDialog.prototype.dialogUpdate = BattleDialog.prototype.update;
    BattleDialog.prototype.update = function(gameTime) {
        if(this.dialogUpdate(gameTime) !== true) {
            return false;
        }

        // First we just hide everything, makes it easier
        this.resurrectionBar.hide();
        this.monsterName.hide();
        this.monsterHealthBar.hide();
        this.enterBattleButton.hide();
        this.leaveBattleButton.hide();
        this.battleLevelDownButton.hide();
        this.battleLevelUpButton.hide();
        this.levelUpButton.hide();
        this.attackButton.hide();

        // Check the alive state
        var isAlive = game.player.alive === true;
        if(isAlive === false) {
            this.resurrectionBar.show();

            var remainingResurrectionTime = game.player.getResurrectionTimeRemaining(gameTime);
            var totalResurrectionTime = game.player.getResurrectionTime();
            var progress = totalResurrectionTime - remainingResurrectionTime;
            this.resurrectionBar.setProgress(progress, totalResurrectionTime);
            this.resurrectionBar.setProgressText("Resurrecting in " + coreUtils.getDurationDisplay(remainingResurrectionTime));
        }

        if(isAlive === true && game.player.getSkillPoints() > 0) {
            this.levelUpButton.show();
        }

        var currentLevel = game.getBattleLevel();
        this.enterBattleButton.setButtonText("Enter Level {0}".format(currentLevel));
        this.leaveBattleButton.setButtonText("Leave Level {0}".format(currentLevel));

        if(game.inBattle === true) {
            this.monsterName.show();
            this.monsterHealthBar.show();
            this.leaveBattleButton.show();
            this.attackButton.show();

            this.updateMonsters();

        } else if(isAlive === true) {
            this.enterBattleButton.show();
            this.battleLevelDownButton.show();
            this.battleLevelUpButton.show();
        }

        return true;
    }

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    BattleDialog.prototype.updateMonsters = function() {
        var monster = game.monsters.Center;
        if(monster !== undefined) {
            //var monsterRarityColor = this.getMonsterRarityColor(game.monster.rarity);
            this.monsterName.setText(monster.getName());

            // Todo: rarity display
            this.monsterName.getMainElement().css({ 'color': '#FFFFFF' });

            // Update the monster health bar
            var monsterHp = monster.getStat(data.StatDefinition.hp.id);
            var monsterHpMax = monster.getStat(data.StatDefinition.hpMax.id);
            this.monsterHealthBar.setProgress(monsterHp, monsterHpMax);
            this.monsterHealthBar.setProgressText("{0} / {1}".format(monsterHp, monsterHpMax));
        } else {
            this.monsterName.setText("");
            this.monsterHealthBar.setProgress(0, 100);
            this.monsterHealthBar.setProgressText("DEAD");
        }
    }

    var surrogate = function(){};
    surrogate.prototype = BattleDialog.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { BattleDialog.call(self); },
        create: function() { return new BattleDialog(); }
    };

});
