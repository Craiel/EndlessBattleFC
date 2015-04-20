declare('CurrencyDialog', function() {
    include('Dialog');
    include('Game');
    include('GameData');
    include('CurrencyControl');
    include('StaticData');

    CurrencyDialog.prototype = dialog.prototype();
    CurrencyDialog.prototype.$super = parent;
    CurrencyDialog.prototype.constructor = CurrencyDialog;

    function CurrencyDialog() {
        dialog.construct(this);

        this.id = "currencyDialog";

        this.canClose = false;

        this.currencyGoldControl = undefined;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    CurrencyDialog.prototype.dialogInit = CurrencyDialog.prototype.init;
    CurrencyDialog.prototype.init = function(parent, attributes) {
        this.dialogInit(parent, attributes);

        this.setHeaderText("Currencies");

        this.currencyGoldControl = currencyControl.create("currencyGold");
        this.currencyGoldControl.trackChanges = true;
        this.currencyGoldControl.init(this.getContentArea());
        this.currencyGoldControl.setImage(ResImg(iconGold));
        this.currencyGoldControl.addClass("currencyGoldControl");
        this.addManagedChild(this.currencyGoldControl);
    };

    CurrencyDialog.prototype.dialogUpdate = CurrencyDialog.prototype.update;
    CurrencyDialog.prototype.update = function(gameTime) {
        if(this.dialogUpdate(gameTime) !== true) {
            return false;
        }

        this.currencyGoldControl.setValue(game.player.getStat(gameData.StatDefinition.gold.id));

        return true;
    }

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------

    var surrogate = function(){};
    surrogate.prototype = CurrencyDialog.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { CurrencyDialog.call(self); },
        create: function() { return new CurrencyDialog(); }
    };

});
