declare('CharacterDialog', function() {
    include('Element');
    include('Dialog');
    include('CoreUtils');
    include('Resources');
    include('ProgressBar');
    include('Button');
    include('Game');
    include('Data');
    include('Panel');
    include('InventoryControl');
    include('InventorySlotControl');

    CharacterDialog.prototype = dialog.prototype();
    CharacterDialog.prototype.$super = parent;
    CharacterDialog.prototype.constructor = CharacterDialog;

    function CharacterDialog() {
        dialog.construct(this);

        this.id = "characterDialog";

        this.equipBackground = undefined;
        this.statsBackground = undefined;
        this.inventoryBackground = undefined;

        this.headSlot = undefined;
        this.chestSlot = undefined;
        this.waistSlot = undefined;
        this.legSlot = undefined;
        this.feetSlot = undefined;
        this.shoulderSlot = undefined;
        this.wristSlot = undefined;
        this.armSlot = undefined;
        this.neckSlot = undefined;
        this.ring1Slot = undefined;
        this.ring2Slot = undefined;
        this.mainHandSlot = undefined;
        this.offHandSlot = undefined;
        this.trinket1Slot = undefined;
        this.trinket2Slot = undefined;

        this.characterInventory = undefined;

        this.statCategoryHeaders = {};
        this.statElements = {};

        this.statUpdateTime = 0;
        this.statUpdateDelay = 250;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    CharacterDialog.prototype.dialogInit = CharacterDialog.prototype.init;
    CharacterDialog.prototype.init = function(parent, attributes) {
        this.dialogInit(parent, attributes);

        this.setHeaderText("Character");

        this.equipBackground = panel.create(this.id + 'EquipBackGround');
        this.equipBackground.init(this.getContentArea());
        resources.setPanelImages(this.equipBackground, "BeigeInset");
        this.equipBackground.addClass('characterEquipBackGround');

        this.statsBackground = panel.create(this.id + 'StatsBackground');
        this.statsBackground.init(this.getContentArea());
        resources.setPanelImages(this.statsBackground, "BeigeInset");
        this.statsBackground.addClass('characterStatsBackground');
        this.statsBackground.getContentArea().setStyle({"overflow-y": "scroll"});

        this.inventoryBackground = panel.create(this.id + 'InventoryBackground');
        this.inventoryBackground.init(this.getContentArea());
        resources.setPanelImages(this.inventoryBackground, "BeigeInset");
        this.inventoryBackground.addClass('characterInventoryBackground');

        this.initEquipmentSlots();

        this.characterInventory = inventoryControl.create("characterInventory");
        this.characterInventory.storage = game.player.storage;
        this.characterInventory.init(this.inventoryBackground.getContentArea());

        this.initStats();

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

        // Update the child components if the window is visible
        this.updateInventory(gameTime);
        this.updateStats(gameTime);

        return true;
    }

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    CharacterDialog.prototype.updateInventory = function(gameTime) {

        this.characterInventory.update(gameTime);

        // Make the inventory scrollable if there are too many slots (Temporary)
        if(game.player.storage.getSize() > 36) {
            this.inventoryBackground.getContentArea().setStyle({"overflow-y": "scroll"});
        } else {
            this.inventoryBackground.getContentArea().setStyle({"overflow-y": "none"});
        }
    }

    CharacterDialog.prototype.updateStats = function(gameTime) {
        if(this.statUpdateTime === 0) {
            this.statUpdateTime = gameTime.current + this.statUpdateDelay;
            return;
        }

        if(gameTime.current < this.statUpdateTime) {
            return;
        }

        for(var category in this.statElements) {
            for(var i = 0; i < this.statElements[category].length; i++) {
                var statKey = this.statElements[category][i][0];
                var element = this.statElements[category][i][2];
                var stat = data.StatDefinition[statKey];
                var value = game.player.getStat(stat.id);
                if(stat.isMultiplier === true) {
                    value = Math.floor((value - 1) * 100);
                }

                element.setText(stat.displayValue.format(value));
            }
        }

        this.statUpdateTime = gameTime.current + this.statUpdateDelay;
    }

    CharacterDialog.prototype.initStats = function(gameTime) {
        var categories = {};
        for(var key in data.StatDefinition) {
            var stat = data.StatDefinition[key];
            if(stat.displayCategory === undefined) {
                continue;
            }

            if(categories[stat.displayCategory] === undefined) {
                categories[stat.displayCategory] = [];
            }

            categories[stat.displayCategory].push(stat);
        }

        for(var category in categories) {
            console.log(categories[category]);
            var categoryHeader = element.create("playerStatCategory_" + category);
            categoryHeader.templateName = "characterStatDisplayCategory";
            categoryHeader.init(this.statsBackground.getContentArea());
            categoryHeader.setText(category);
            this.statCategoryHeaders[category] = categoryHeader;

            for(var i = 0; i < categories[category].length; i++) {
                var stat = categories[category][i];

                var characterStatLine = element.create("playerStat" + stat.id);
                characterStatLine.templateName = "characterStatDisplayLine";
                characterStatLine.init(this.statsBackground.getContentArea());

                var statElement = element.create("playerStatValue" + stat.id);
                statElement.templateName = "characterStatDisplayValue";
                statElement.init(characterStatLine);
                statElement.setText(stat.displayValue);

                var statHeader = element.create("playerStatHeader" + stat.id);
                statHeader.templateName = "characterStatDisplayHeader";
                statHeader.init(characterStatLine);
                statHeader.setText(stat.displayHeader);

                if(this.statElements[category] === undefined) {
                    this.statElements[category] = [];
                }

                this.statElements[category].push([stat.id, statHeader, statElement]);
            }
        }
    }

    CharacterDialog.prototype.initEquipmentSlots = function() {
        this.headSlot = this.createEquipSlot('equipSlotHead');
        this.chestSlot = this.createEquipSlot('equipSlotChest');
        this.waistSlot = this.createEquipSlot('equipSlotWaist');
        this.legSlot = this.createEquipSlot('equipSlotLegs');
        this.feetSlot = this.createEquipSlot('equipSlotFeet');
        this.shoulderSlot = this.createEquipSlot('equipSlotShoulder');
        this.wristSlot = this.createEquipSlot('equipSlotWrist');
        this.armSlot = this.createEquipSlot('equipSlotArms');
        this.neckSlot = this.createEquipSlot('equipSlotNeck');
        this.ring1Slot = this.createEquipSlot('equipSlotRing1');
        this.ring2Slot = this.createEquipSlot('equipSlotRing2');
        this.mainHandSlot = this.createEquipSlot('equipSlotMainHand');
        this.offHandSlot = this.createEquipSlot('equipSlotOffHand');
        this.trinket1Slot = this.createEquipSlot('equipSlotTrinket1');
        this.trinket2Slot = this.createEquipSlot('equipSlotTrinket2');
    }

    CharacterDialog.prototype.createEquipSlot = function(id) {
        var slot = inventorySlotControl.create(this.id + id);
        slot.init(this.equipBackground);
        slot.addClass(id);
        return slot;
    }


    var surrogate = function(){};
    surrogate.prototype = CharacterDialog.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { CharacterDialog.call(self); },
        create: function() { return new CharacterDialog(); }
    };

});
