declare('CharacterDialog', function() {
    include('Debug');
    include('Element');
    include('Dialog');
    include('Button');
    include('Game');
    include('GameData');
    include('Panel');
    include('InventoryControl');
    include('InventorySlotControl');
    include('StaticData');

    CharacterDialog.prototype = dialog.prototype();
    CharacterDialog.prototype.$super = parent;
    CharacterDialog.prototype.constructor = CharacterDialog;

    function CharacterDialog() {
        dialog.construct(this);

        this.id = "characterDialog";

        this.equipBackground = undefined;
        this.statsBackground = undefined;
        this.inventoryBackground = undefined;

        this.equipSlots = {};

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
        this.equipBackground.setStyle("BeigeInset");
        this.equipBackground.addClass('characterEquipBackGround');
        this.addManagedChild(this.equipBackground);

        this.statsBackground = panel.create(this.id + 'StatsBackground');
        this.statsBackground.init(this.getContentArea());
        this.statsBackground.setStyle("BeigeInset");
        this.statsBackground.addClass('characterStatsBackground');
        this.statsBackground.getContentArea().setStyle({"overflow-y": "scroll"});
        this.addManagedChild(this.statsBackground);

        this.inventoryBackground = panel.create(this.id + 'InventoryBackground');
        this.inventoryBackground.init(this.getContentArea());
        this.inventoryBackground.setStyle("BeigeInset");
        this.inventoryBackground.addClass('characterInventoryBackground');
        this.addManagedChild(this.inventoryBackground);

        // For now we just assume there's only the one player
        this.initEquipmentSlots(game.player);

        this.characterInventory = inventoryControl.create("characterInventory");
        this.characterInventory.storage = game.player.storage;
        this.characterInventory.mode = staticData.InventoryModePlayer;
        this.characterInventory.init(this.inventoryBackground.getContentArea());
        this.addManagedChild(this.characterInventory);

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
        this.updateEquipment(gameTime, game.player);

        return true;
    };

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    CharacterDialog.prototype.updateInventory = function(gameTime) {
        // Make the inventory scrollable if there are too many slots (Temporary)
        if(game.player.storage.getSize() > 36) {
            this.inventoryBackground.getContentArea().setStyle({"overflow-y": "scroll"});
        } else {
            this.inventoryBackground.getContentArea().setStyle({"overflow-y": "none"});
        }
    };

    CharacterDialog.prototype.updateStats = function(gameTime) {
        if(this.statUpdateTime === 0) {
            this.statUpdateTime = gameTime.current + this.statUpdateDelay;
            return;
        }

        if(gameTime.current < this.statUpdateTime) {
            return;
        }

        for(var category in this.statElements) {
            var playerHasStatPoints = game.player.getStatPoints() > 0;
            for(var i = 0; i < this.statElements[category].length; i++) {
                var statKey = this.statElements[category][i].id;
                var element = this.statElements[category][i].value;
                var button = this.statElements[category][i].button;

                var stat = gameData.StatDefinition[statKey];
                var value = game.player.getStat(stat.id);
                if(stat.isMultiplier === true) {
                    value = Math.floor((value - 1) * 100);
                }

                element.setText(stat.displayValue.format(value));

                if(button !== undefined) {
                    button.setVisibility(playerHasStatPoints);
                }
            }
        }

        this.statUpdateTime = gameTime.current + this.statUpdateDelay;
    };

    CharacterDialog.prototype.initStats = function(gameTime) {
        var categories = {};
        for(var key in gameData.StatDefinition) {
            var stat = gameData.StatDefinition[key];
            if(stat.displayCategory === undefined) {
                continue;
            }

            if(categories[stat.displayCategory] === undefined) {
                categories[stat.displayCategory] = [];
            }

            categories[stat.displayCategory].push(stat);
        }

        var sortedCategories = Object.keys(categories).sort();
        console.log(sortedCategories);
        console.log(sortedCategories.length);
        for(var i = 0; i < sortedCategories.length; i++) {
            var category = sortedCategories[i];
            console.log(category);
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
                if(stat.tooltip !== undefined) {
                    characterStatLine.setTooltip(stat.tooltip);
                }

                var statElement = element.create("playerStatValue" + stat.id);
                statElement.templateName = "characterStatDisplayValue";
                statElement.init(characterStatLine);
                statElement.setText(stat.displayValue);

                var statButton = undefined;
                if(stat.canSpendStatPoints === true) {
                    statButton = button.create("playerStatButton" + stat.id);
                    statButton.callbackArgument = {game: game, statId: stat.id};
                    statButton.callback = function(obj) { obj.data.arg.game.spendStatPoint(obj.data.arg.statId); }
                    statButton.init(characterStatLine);
                    statButton.addClass("characterStatButton");
                    statButton.setImages(ResImg(iconPlusBlue), undefined, undefined);
                }

                var statHeader = element.create("playerStatHeader" + stat.id);
                statHeader.templateName = "characterStatDisplayHeader";
                statHeader.init(characterStatLine);
                statHeader.setText(stat.displayHeader);

                if(this.statElements[category] === undefined) {
                    this.statElements[category] = [];
                }

                this.statElements[category].push({id: stat.id, header: statHeader, value: statElement, button: statButton});
            }
        }
    };

    CharacterDialog.prototype.initEquipmentSlots = function(actor) {
        for (var type in actor.equipmentSlots) {
            debug.logDebug("CreateEquipSlot: " + type);
            this.equipSlots[type] = this.createEquipSlot('equipSlot_' + type.replace('|', "_"));
        }
    };

    CharacterDialog.prototype.createEquipSlot = function(id) {
        var slot = inventorySlotControl.create(this.id + id);
        slot.init(this.equipBackground);
        slot.addClass(id);
        slot.setOnDoubleClick(this.onEquipSlotDoubleClick);
        slot.setOnClick(this.onSlotClick);
        return slot;
    };

    CharacterDialog.prototype.onEquipSlotDoubleClick = function(slotElement, event)
    {
        // Todo: Check parent relations
        //staticData.InventoryModeUnknown
        if(slotElement.slot !== undefined) {
            game.handlePlayerSlotUnequipAction(slotElement.slot);
            //this.self.parent.clearTooltip();
        }
    };

    CharacterDialog.prototype.onSlotClick = function(slotElement, event)
    {
        // We don't really want to sell directly from the equipped inventory...
        /*if(event.shiftKey === true) {
            game.handleSlotSellAction(this.self.parent.mode, slotElement.slot);
            this.self.parent.clearTooltip();
        }*/
    };

    CharacterDialog.prototype.updateEquipment = function(gameTime, actor) {
        for (var type in actor.equipmentSlots) {
            var item = actor.getEquippedItem(type);
            var slot = {id: undefined, item: undefined, count: 0};
            if(item !== undefined) {
                slot.id = item.id;
                slot.item = item;
                slot.count = 1;
            }

            this.equipSlots[type].setSlot(slot);
            this.equipSlots[type].update(gameTime);
        }
    };

    var surrogate = function(){};
    surrogate.prototype = CharacterDialog.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { CharacterDialog.call(self); },
        create: function() { return new CharacterDialog(); }
    };

});
