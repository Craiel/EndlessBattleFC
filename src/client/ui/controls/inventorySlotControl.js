declare('InventorySlotControl', function() {
    include('Element');
    include('Panel');
    include('ItemTooltip');
    include('ItemIcon');

    InventorySlotControl.prototype = element.prototype();
    InventorySlotControl.prototype.$super = parent;
    InventorySlotControl.prototype.constructor = InventorySlotControl;

    function InventorySlotControl(id) {
        element.construct(this);

        this.id = id;

        this.setTemplate("inventorySlotControl");

        this.backgroundPanel = undefined;

        this.currentTooltip = undefined;

        this.slotChanged = true;
        this.slot = undefined;

        this.iconControl = undefined;
        this.countControl = undefined;
    }

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
        this.addManagedChild(this.backgroundPanel);

        this.iconControl = itemIcon.create(this.id + "Icon");
        this.iconControl.init(this);
        this.addManagedChild(this.iconControl);

        this.countControl = element.create(this.id + "Count");
        this.countControl.init(this);
        this.addManagedChild(this.countControl);
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
            // Avoid setting the same item again
            if(this.slot !== undefined && slot !== undefined && this.slot.id === slot.id) {
                return;
            }

            this.slot = slot;
            this.slotChanged = true;
        }
    };

    InventorySlotControl.prototype.updateSlotDisplay = function() {
        if (this.slot === undefined || this.slot.count <= 0) {
            this.countControl.setText(undefined);
            this.iconControl.setItem(undefined);
            this.setTooltip(undefined);
        } else {
            if(this.slot.count === 1 && this.slot.item !== undefined) {
                this.countControl.setText(undefined);
            } else {
                this.countControl.setText(this.slot.count);
            }

            // Slot Metadata
            this.iconControl.setItem(this.slot.item);
            this.updateTooltip(this.slot);
        }
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
