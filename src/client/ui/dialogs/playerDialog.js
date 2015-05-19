declare('PlayerDialog', function() {
    include('Element');
    include('Dialog');
    include('ProgressBar');
    include('Game');
    include('GameData');
    include('CurrencyControl');
    include('StaticData');

    PlayerDialog.prototype = dialog.prototype();
    PlayerDialog.prototype.$super = parent;
    PlayerDialog.prototype.constructor = PlayerDialog;

    function PlayerDialog() {
        dialog.construct(this);

        this.id = "playerDialog";

        this.canClose = false;

        this.playerHealthBar = undefined;
        this.playerManaBar = undefined;
        this.experienceTitle = undefined;
        this.experienceBar = undefined;

        this.currencyGoldControl = undefined;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    PlayerDialog.prototype.dialogInit = PlayerDialog.prototype.init;
    PlayerDialog.prototype.init = function(parent, attributes) {
        this.dialogInit(parent, attributes);

        this.playerHealthBar = progressBar.create("playerHealthBar");
        this.playerHealthBar.init(this.getContentArea());
        this.playerHealthBar.animate = true;
        this.playerHealthBar.setStyle("Green");
        this.playerHealthBar.setBackgroundStyle("Back");
        this.addManagedChild(this.playerHealthBar);

        this.playerManaBar = progressBar.create("playerManaBar");
        this.playerManaBar.init(this.getContentArea());
        this.playerManaBar.animate = true;
        this.playerManaBar.setStyle("Blue");
        this.playerManaBar.setBackgroundStyle("Back");
        this.addManagedChild(this.playerManaBar);

        this.experienceTitle = element.create("experienceTitle");
        this.experienceTitle.templateName = "globalTextElement";
        this.experienceTitle.init(this.getContentArea());
        this.experienceTitle.addClass("experienceTitle");
        this.experienceTitle.setText("XP to next Level: ");
        this.addManagedChild(this.experienceTitle);

        this.experienceBar = progressBar.create("experienceBar");
        this.experienceBar.init(this.getContentArea());
        this.experienceBar.animate = true;
        this.experienceBar.setStyle("Purple");
        this.experienceBar.setBackgroundStyle("Back");
        this.addManagedChild(this.experienceBar);

        this.currencyGoldControl = currencyControl.create("currencyGold");
        this.currencyGoldControl.trackChanges = true;
        this.currencyGoldControl.init(this.getContentArea());
        this.currencyGoldControl.setImage(ResImg(iconGold));
        this.currencyGoldControl.addClass("playerCurrencyGoldControl");
        this.addManagedChild(this.currencyGoldControl);
    };

    PlayerDialog.prototype.dialogUpdate = PlayerDialog.prototype.update;
    PlayerDialog.prototype.update = function(gameTime) {
        if(this.dialogUpdate(gameTime) !== true) {
            return false;
        }

        // No reason to hide them atm
        this.playerHealthBar.show();
        this.experienceBar.show();

        this.setHeaderText("{0} - Level {1}".format(game.player.getName(), game.player.getLevel()));

        var hp = game.player.getStat(gameData.StatDefinition.hp.id);
        var hpMax = game.player.getStat(gameData.StatDefinition.hpMax.id);
        this.playerHealthBar.setProgress(hp, hpMax);
        this.playerHealthBar.setProgressText("{0} / {1}".format(hp, hpMax));

        var mp = game.player.getStat(gameData.StatDefinition.mp.id);
        var mpMax = game.player.getStat(gameData.StatDefinition.mpMax.id);
        this.playerManaBar.setProgress(mp, mpMax);
        this.playerManaBar.setProgressText("{0} / {1}".format(mp, mpMax));

        var requiredXP = game.player.experienceRequired;
        var xp = game.player.getStat(gameData.StatDefinition.xp.id);
        this.experienceBar.setProgress(xp, requiredXP);
        this.experienceBar.setProgressText("{0} / {1}".format(xp, requiredXP));

        this.currencyGoldControl.setValue(game.player.getStat(gameData.StatDefinition.gold.id));

        return true;
    }

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------

    var surrogate = function(){};
    surrogate.prototype = PlayerDialog.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { PlayerDialog.call(self); },
        create: function() { return new PlayerDialog(); }
    };

});
