declare('InventorySlotControl', function() {
    include('Log');
    include('Assert');
    include('StaticData');
    include('Element');
    include('CoreUtils');
    include('Resources');
    include('Panel');
    include('ItemTooltip');
    include('ItemUtils');

    InventorySlotControl.prototype = element.prototype();
    InventorySlotControl.prototype.$super = parent;
    InventorySlotControl.prototype.constructor = InventorySlotControl;

    function InventorySlotControl(id) {
        element.construct(this);

        this.id = id;

        this.setTemplate("inventorySlotControl");

        this.backgroundPanel = undefined;
        this.currentRarityClass = undefined;

        this.currentTooltip = undefined;

        this.slotChanged = true;
        this.slot = undefined;

        this.borderControl = undefined;
        this.imageControl = undefined;
        this.countControl = undefined;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    InventorySlotControl.prototype.elementInit = InventorySlotControl.prototype.init;
    InventorySlotControl.prototype.init = function(parent, attributes) {
        this.elementInit(parent, attributes);

        this.backgroundPanel = panel.create(this.id + "Background");
        this.backgroundPanel.init(this);
        this.backgroundPanel.addClass("inventorySlotBackground");
        this.backgroundPanel.addClass("globalNoDrag");

        this.borderControl = element.create(this.id + "Border");
        this.borderControl.init(this);

        this.imageControl = element.create(this.id + "Image");
        this.imageControl.init(this);

        this.countControl = element.create(this.id + "Count");
        this.countControl.init(this);

        this.updateRarityClass(undefined);
    };

    InventorySlotControl.prototype.elementUpdate = InventorySlotControl.prototype.update;
    InventorySlotControl.prototype.update = function(gameTime) {
        if(this.elementUpdate(gameTime) !== true) {
            return false;
        }

        if(this.slotChanged === true) {
            this.updateSlotDisplay();
            this.slotChanged = false;
        }

        // Update the tooltip so we can update stats, effects and other things while the game is running
        if(this.currentTooltip !== undefined) {
            this.currentTooltip.update(gameTime);
        }

        return true;
    };

    InventorySlotControl.prototype.elementRemove = InventorySlotControl.prototype.remove;
    InventorySlotControl.prototype.remove = function() {
        this.backgroundPanel.remove();
        this.borderControl.remove();
        this.imageControl.remove();
        this.countControl.remove();

        if(this.currentTooltip !== undefined) {
            this.currentTooltip.remove();
        }

        this.elementRemove();
    };

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    InventorySlotControl.prototype.setSlot = function(slot) {
        if(this.slot !== slot) {
            this.slot = slot;
            this.slotChanged = true;
        }
    };

    InventorySlotControl.prototype.updateSlotDisplay = function() {
        if (this.slot === undefined || this.slot.count <= 0) {
            this.countControl.setText(undefined);
            this.updateRarityClass(undefined);
            this.updateIcon(undefined);

            this.setTooltip(undefined);
        } else {
            if(this.slot.count === 1 && this.slot.metaData !== undefined) {
                this.countControl.setText(undefined);
            } else {
                this.countControl.setText(this.slot.count);
            }

            // Slot Metadata
            this.updateRarityClass(this.slot.metaData.rarity);
            this.updateIcon(this.slot.metaData.type);
            this.updateTooltip(this.slot);
        }
    };

    InventorySlotControl.prototype.updateRarityClass = function(rarity) {
        if(this.currentRarityClass !== undefined) {
            this.removeClass(this.currentRarityClass);
        }

        if(rarity === undefined) {
            this.currentRarityClass = "inventorySlotRarityDefault";
        } else {
            this.currentRarityClass = "inventorySlotRarity_" + rarity;
        }

        this.addClass(this.currentRarityClass);
    };

    InventorySlotControl.prototype.updateIcon = function(type) {
        var style = {'background-repeat': 'no-repeat', 'background-size': '70% 70%', 'background-position': "center"};

        if(type === undefined) {
            style['background-image'] = undefined;
        } else {
            style['background-image'] = itemUtils.getItemIconUrl(type);
        }

        this.imageControl.setStyle(style);
    };

    InventorySlotControl.prototype.updateTooltip = function(slot) {
        if(this.currentTooltip !== undefined) {
            this.currentTooltip.remove();
        }

        this.currentTooltip = itemTooltip.create();
        this.currentTooltip.init();
        this.currentTooltip.setSlotData(slot);

        this.setTooltip(this.currentTooltip);
    };

    var surrogate = function(){};
    surrogate.prototype = InventorySlotControl.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { InventorySlotControl.call(self); },
        create: function(id) { return new InventorySlotControl(id); }
    };

});
