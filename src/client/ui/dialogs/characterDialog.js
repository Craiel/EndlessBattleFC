declare('CharacterDialog', function() {
    include('Element');
    include('Dialog');
    include('CoreUtils');
    include('Resources');
    include('ProgressBar');
    include('Button');
    include('Game');
    include('Data');

    CharacterDialog.prototype = dialog.prototype();
    CharacterDialog.prototype.$super = parent;
    CharacterDialog.prototype.constructor = CharacterDialog;

    function CharacterDialog() {
        dialog.construct(this);

        this.id = "characterDialog";

    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    CharacterDialog.prototype.dialogInit = CharacterDialog.prototype.init;
    CharacterDialog.prototype.init = function(parent, attributes) {
        this.dialogInit(parent, attributes);

        this.setHeaderText("Character");

        this.hide();
    };

    CharacterDialog.prototype.dialogUpdate = CharacterDialog.prototype.update;
    CharacterDialog.prototype.update = function(gameTime) {
        if(this.dialogUpdate(gameTime) !== true) {
            return false;
        }

        if(this.isVisible !== true) {
            return false;
        }


        return true;
    }

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------

    var surrogate = function(){};
    surrogate.prototype = CharacterDialog.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { CharacterDialog.call(self); },
        create: function() { return new CharacterDialog(); }
    };

});
