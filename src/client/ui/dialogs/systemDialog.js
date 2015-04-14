declare('SystemDialog', function() {
    include('Element');
    include('Dialog');
    include('CoreUtils');
    include('Resources');
    include('ProgressBar');
    include('Button');
    include('Game');
    include('GameData');
    include('InterfaceState');

    SystemDialog.prototype = dialog.prototype();
    SystemDialog.prototype.$super = parent;
    SystemDialog.prototype.constructor = SystemDialog;

    function SystemDialog() {
        dialog.construct(this);

        this.id = "systemDialog";

        this.canClose = false;

        this.inventoryWindowButton = undefined;
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

        this.inventoryWindowButton = button.create("inventoryWindowButton");
        this.inventoryWindowButton.callback = function(obj) { obj.data.arg.toggleInventoryWindow(); };
        this.inventoryWindowButton.callbackArgument = this;
        this.inventoryWindowButton.init(this.getContentArea());
        this.inventoryWindowButton.setImages(resources.ImageIconBackpack, resources.ImageIconBackpackHover, undefined);
        this.inventoryWindowButton.setTooltip("Inventory");
        this.addManagedChild(this.inventoryWindowButton);

        this.characterWindowButton = button.create("characterWindowButton");
        this.characterWindowButton.callback = function(obj) { obj.data.arg.toggleCharacterWindow(); };
        this.characterWindowButton.callbackArgument = this;
        this.characterWindowButton.init(this.getContentArea());
        this.characterWindowButton.setImages(resources.ImageIconCharacter, resources.ImageIconCharacterHover, undefined);
        this.characterWindowButton.setTooltip("Character");
        this.addManagedChild(this.characterWindowButton);

        this.questWindowButton = button.create("questWindowButton");
        this.questWindowButton.callback = function(obj) { obj.data.arg.toggleQuestWindow(); };
        this.questWindowButton.callbackArgument = this;
        this.questWindowButton.init(this.getContentArea());
        this.questWindowButton.setImages(resources.ImageIconQuest, resources.ImageIconQuestHover, undefined);
        this.questWindowButton.setTooltip("Quests");
        this.addManagedChild(this.questWindowButton);

        this.mercenaryWindowButton = button.create("mercenaryWindowButton");
        this.mercenaryWindowButton.callback = function(obj) { obj.data.arg.toggleMercenaryWindow(); };
        this.mercenaryWindowButton.callbackArgument = this;
        this.mercenaryWindowButton.init(this.getContentArea());
        this.mercenaryWindowButton.setImages(resources.ImageIconMercenary, resources.ImageIconMercenaryHover, undefined);
        this.mercenaryWindowButton.setTooltip("Mercenaries");
        this.addManagedChild(this.mercenaryWindowButton);

        this.upgradeWindowButton = button.create("upgradeWindowButton");
        this.upgradeWindowButton.callback = function(obj) { obj.data.arg.toggleUpgradeWindow(); };
        this.upgradeWindowButton.callbackArgument = this;
        this.upgradeWindowButton.init(this.getContentArea());
        this.upgradeWindowButton.setImages(resources.ImageIconUpgrade, resources.ImageIconUpgradeHover, undefined);
        this.upgradeWindowButton.setTooltip("Upgrades");
        this.addManagedChild(this.upgradeWindowButton);
    };

    SystemDialog.prototype.dialogUpdate = SystemDialog.prototype.update;
    SystemDialog.prototype.update = function(gameTime) {
        if(this.dialogUpdate(gameTime) !== true) {
            return false;
        }

        return true;
    }

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    SystemDialog.prototype.toggleInventoryWindow = function() {
        interfaceState.inventoryWindowShown = !interfaceState.inventoryWindowShown;
    }

    SystemDialog.prototype.toggleCharacterWindow = function() {
        interfaceState.characterWindowShown = !interfaceState.characterWindowShown;
    }

    SystemDialog.prototype.toggleMercenaryWindow = function() {
        interfaceState.mercenaryWindowShown = !interfaceState.mercenaryWindowShown;
    }

    SystemDialog.prototype.toggleUpgradeWindow = function() {
        interfaceState.upgradeWindowShown = !interfaceState.upgradeWindowShown;
    }

    SystemDialog.prototype.toggleQuestWindow = function() {
        interfaceState.questWindowShown = !interfaceState.questWindowShown;
    }

    SystemDialog.prototype.toggleUpdatesWindow = function() {
        interfaceState.updatesWindowShown = !interfaceState.updatesWindowShown;
    }

    SystemDialog.prototype.toggleOptionsWindow = function() {
        interfaceState.optionsWindowShown = !interfaceState.optionsWindowShown;
    }

    SystemDialog.prototype.toggleStatsWindow = function() {
        interfaceState.statsWindowShown = !interfaceState.statsWindowShown;
    }

    var surrogate = function(){};
    surrogate.prototype = SystemDialog.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { SystemDialog.call(self); },
        create: function() { return new SystemDialog(); }
    };

});
