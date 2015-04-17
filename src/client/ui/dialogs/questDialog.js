declare('QuestDialog', function() {
    include('Dialog');

    QuestDialog.prototype = dialog.prototype();
    QuestDialog.prototype.$super = parent;
    QuestDialog.prototype.constructor = QuestDialog;

    function QuestDialog() {
        dialog.construct(this);

        this.id = "questDialog";
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    QuestDialog.prototype.dialogInit = QuestDialog.prototype.init;
    QuestDialog.prototype.init = function(parent, attributes) {
        this.dialogInit(parent, attributes);

        this.setHeaderText("Quests");

        this.hide();
    };

    QuestDialog.prototype.dialogUpdate = QuestDialog.prototype.update;
    QuestDialog.prototype.update = function(gameTime) {
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
    surrogate.prototype = QuestDialog.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { QuestDialog.call(self); },
        create: function() { return new QuestDialog(); }
    };

});
