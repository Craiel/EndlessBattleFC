declare('SystemDialog', function() {
    include('Dialog');
    include('Button');
    include('InterfaceState');
    include('StaticData');

    SystemDialog.prototype = dialog.prototype();
    SystemDialog.prototype.$super = parent;
    SystemDialog.prototype.constructor = SystemDialog;

    function SystemDialog() {
        dialog.construct(this);

        this.id = "systemDialog";

        this.canClose = false;

        this.characterWindowButton = undefined;
        this.questWindowButton = undefined;
        this.mercenaryWindowButton = undefined;
        this.upgradeWindowButton = undefined;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    SystemDialog.prototype.dialogInit = SystemDialog.prototype.init;
    SystemDialog.prototype.init = function(parent, attributes) {
        this.dialogInit(parent, attributes);

        this.setHeaderText("System Menu");

        this.characterWindowButton = button.create("characterWindowButton");
        this.characterWindowButton.callback = function(obj) { obj.data.arg.toggleCharacterWindow(); };
        this.characterWindowButton.callbackArgument = this;
        this.characterWindowButton.init(this.getContentArea());
        this.characterWindowButton.setImages(ResImg(iconCharacter), ResImg(iconCharacterHover), undefined);
        this.characterWindowButton.setTooltip("Character");
        this.addManagedChild(this.characterWindowButton);

        this.questWindowButton = button.create("questWindowButton");
        this.questWindowButton.callback = function(obj) { obj.data.arg.toggleQuestWindow(); };
        this.questWindowButton.callbackArgument = this;
        this.questWindowButton.init(this.getContentArea());
        this.questWindowButton.setImages(ResImg(iconQuest), ResImg(iconQuestHover), undefined);
        this.questWindowButton.setTooltip("Quests");
        this.addManagedChild(this.questWindowButton);

        this.mercenaryWindowButton = button.create("mercenaryWindowButton");
        this.mercenaryWindowButton.callback = function(obj) { obj.data.arg.toggleMercenaryWindow(); };
        this.mercenaryWindowButton.callbackArgument = this;
        this.mercenaryWindowButton.init(this.getContentArea());
        this.mercenaryWindowButton.setImages(ResImg(iconMercenary), ResImg(iconMercenaryHover), undefined);
        this.mercenaryWindowButton.setTooltip("Mercenaries");
        this.addManagedChild(this.mercenaryWindowButton);

        this.upgradeWindowButton = button.create("upgradeWindowButton");
        this.upgradeWindowButton.callback = function(obj) { obj.data.arg.toggleUpgradeWindow(); };
        this.upgradeWindowButton.callbackArgument = this;
        this.upgradeWindowButton.init(this.getContentArea());
        this.upgradeWindowButton.setImages(ResImg(iconUpgrade), ResImg(iconUpgradeHover), undefined);
        this.upgradeWindowButton.setTooltip("Upgrades");
        this.addManagedChild(this.upgradeWindowButton);
    };

    SystemDialog.prototype.dialogUpdate = SystemDialog.prototype.update;
    SystemDialog.prototype.update = function(gameTime) {
        if(this.dialogUpdate(gameTime) !== true) {
            return false;
        }

        return true;
    };

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    SystemDialog.prototype.toggleCharacterWindow = function() {
        interfaceState.characterWindowShown = !interfaceState.characterWindowShown;
    };

    SystemDialog.prototype.toggleMercenaryWindow = function() {
        interfaceState.mercenaryWindowShown = !interfaceState.mercenaryWindowShown;
    };

    SystemDialog.prototype.toggleUpgradeWindow = function() {
        interfaceState.upgradeWindowShown = !interfaceState.upgradeWindowShown;
    };

    SystemDialog.prototype.toggleQuestWindow = function() {
        interfaceState.questWindowShown = !interfaceState.questWindowShown;
    };

    SystemDialog.prototype.toggleUpdatesWindow = function() {
        interfaceState.updatesWindowShown = !interfaceState.updatesWindowShown;
    };

    SystemDialog.prototype.toggleOptionsWindow = function() {
        interfaceState.optionsWindowShown = !interfaceState.optionsWindowShown;
    };

    SystemDialog.prototype.toggleStatsWindow = function() {
        interfaceState.statsWindowShown = !interfaceState.statsWindowShown;
    };

    var surrogate = function(){};
    surrogate.prototype = SystemDialog.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { SystemDialog.call(self); },
        create: function() { return new SystemDialog(); }
    };

});
