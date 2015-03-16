declare('MercenaryDialog', function() {
    include('Element');
    include('Dialog');
    include('CoreUtils');
    include('Resources');
    include('ProgressBar');
    include('Button');
    include('Game');
    include('Data');
    include('StaticData');
    include('MercenaryControl');

    MercenaryDialog.prototype = dialog.prototype();
    MercenaryDialog.prototype.$super = parent;
    MercenaryDialog.prototype.constructor = MercenaryDialog;

    function MercenaryDialog() {
        dialog.construct(this);

        this.id = "mercenaryDialog";

        this.mercenaryControls = {};

        this.canScroll = true;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    MercenaryDialog.prototype.dialogInit = MercenaryDialog.prototype.init;
    MercenaryDialog.prototype.init = function(parent, attributes) {
        this.dialogInit(parent, attributes);

        this.setHeaderText("Mercenaries");

        // Create the control for each mercenary...
        for(key in data.Mercenaries) {
            var control = mercenaryControl.create("Mercenary_" + key);
            control.mercenaryKey = key;
            control.callback = function(obj) { obj.data.arg.purchaseMercenary(obj.data.self.mercenaryKey); };
            control.callbackArgument = game;
            control.init(this.getContentArea());
            control.setMercenaryName(data.Mercenaries[key].name);
            control.setMercenaryImage(staticData.imageRoot + data.Mercenaries[key].icon);
            this.mercenaryControls[key] = control;
        }

        this.hide();
    };

    MercenaryDialog.prototype.dialogUpdate = MercenaryDialog.prototype.update;
    MercenaryDialog.prototype.update = function(gameTime) {
        if(this.dialogUpdate(gameTime) !== true) {
            return false;
        }

        if(this.isVisible !== true) {
            return false;
        }

        for(key in data.Mercenaries) {
            var control = this.mercenaryControls[key];
            control.setMercenaryCost(game.getMercenaryCost(key));
            control.setMercenaryCount(game.getMercenaryCount(key));
            control.setPlayerGold(game.player.getStat(data.StatDefinition.gold.id));
            control.update(gameTime);
        }

        return true;
    }

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------

    var surrogate = function(){};
    surrogate.prototype = MercenaryDialog.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { MercenaryDialog.call(self); },
        create: function() { return new MercenaryDialog(); }
    };

});