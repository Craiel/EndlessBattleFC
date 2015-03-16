declare('PlayerDialog', function() {
    include('Element');
    include('Dialog');
    include('CoreUtils');
    include('Resources');
    include('ProgressBar');
    include('Button');
    include('Game');
    include('Data');

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
        this.playerHealthBar.setImages(resources.ImageProgressGreenHorizontalLeft, resources.ImageProgressGreenHorizontalMid, resources.ImageProgressGreenHorizontalRight);
        this.playerHealthBar.setBackgroundImages(resources.ImageProgressBackHorizontalLeft, resources.ImageProgressBackHorizontalMid, resources.ImageProgressBackHorizontalRight);

        this.playerManaBar = progressBar.create("playerManaBar");
        this.playerManaBar.init(this.getContentArea());
        this.playerManaBar.animate = true;
        this.playerManaBar.setImages(resources.ImageProgressBlueHorizontalLeft, resources.ImageProgressBlueHorizontalMid, resources.ImageProgressBlueHorizontalRight);
        this.playerManaBar.setBackgroundImages(resources.ImageProgressBackHorizontalLeft, resources.ImageProgressBackHorizontalMid, resources.ImageProgressBackHorizontalRight);

        this.experienceTitle = element.create("experienceTitle");
        this.experienceTitle.templateName = "globalTextElement";
        this.experienceTitle.init(this.getContentArea());
        this.experienceTitle.addClass("experienceTitle");
        this.experienceTitle.setText("XP to next Level: ");

        this.experienceBar = progressBar.create("experienceBar");
        this.experienceBar.init(this.getContentArea());
        this.experienceBar.animate = true;
        this.experienceBar.setImages(resources.ImageProgressPurpleHorizontalLeft, resources.ImageProgressPurpleHorizontalMid, resources.ImageProgressPurpleHorizontalRight);
        this.experienceBar.setBackgroundImages(resources.ImageProgressBackHorizontalLeft, resources.ImageProgressBackHorizontalMid, resources.ImageProgressBackHorizontalRight);
    };

    PlayerDialog.prototype.dialogUpdate = PlayerDialog.prototype.update;
    PlayerDialog.prototype.update = function(gameTime) {
        if(this.dialogUpdate(gameTime) !== true) {
            return false;
        }

        // No reason to hide them atm
        this.playerHealthBar.show();
        this.experienceBar.show();

        this.setHeaderText(game.player.getName());

        var hp = game.player.getStat(data.StatDefinition.hp.id);
        var hpMax = game.player.getStat(data.StatDefinition.hpMax.id);
        this.playerHealthBar.setProgress(hp, hpMax);
        this.playerHealthBar.setProgressText("{0} / {1}".format(hp, hpMax));

        var mp = game.player.getStat(data.StatDefinition.mp.id);
        var mpMax = game.player.getStat(data.StatDefinition.mpMax.id);
        this.playerManaBar.setProgress(mp, mpMax);
        this.playerManaBar.setProgressText("{0} / {1}".format(mp, mpMax));

        var requiredXP = game.player.experienceRequired;
        var xp = game.player.getStat(data.StatDefinition.xp.id);
        this.experienceBar.setProgress(xp, requiredXP);
        this.experienceBar.setProgressText("{0} / {1}".format(xp, requiredXP));

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