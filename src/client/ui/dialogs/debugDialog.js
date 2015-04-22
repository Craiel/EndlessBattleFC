declare('DebugDialog', function() {
    include('Dialog');
    include('Debug');

    DebugDialog.prototype = dialog.prototype();
    DebugDialog.prototype.$super = parent;
    DebugDialog.prototype.constructor = DebugDialog;

    function DebugDialog() {
        dialog.construct(this);

        this.id = "debugDialog";

        this.canClose = true;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    DebugDialog.prototype.dialogInit = DebugDialog.prototype.init;
    DebugDialog.prototype.init = function(parent, attributes) {
        this.dialogInit(parent, attributes);

        this.setHeaderText("Debug");

        this.getMainElement().resizable();
    };

    DebugDialog.prototype.dialogUpdate = DebugDialog.prototype.update;
    DebugDialog.prototype.update = function(gameTime) {
        if(this.dialogUpdate(gameTime) !== true) {
            return false;
        }

        return true;
    }

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------

    var surrogate = function(){};
    surrogate.prototype = DebugDialog.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { DebugDialog.call(self); },
        create: function() { return new DebugDialog(); }
    };

});
