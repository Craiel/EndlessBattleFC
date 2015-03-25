declare('InventorySlotControl', function() {
    include('Log');
    include('Assert');
    include('StaticData');
    include('Element');
    include('CoreUtils');
    include('Resources');
    include('Panel');

    InventorySlotControl.prototype = element.prototype();
    InventorySlotControl.prototype.$super = parent;
    InventorySlotControl.prototype.constructor = InventorySlotControl;

    function InventorySlotControl(id) {
        element.construct(this);

        this.id = id;

        this.setTemplate("inventorySlotControl");

        this.backgroundPanel = undefined;

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

        return true;
    }

    InventorySlotControl.prototype.elementRemove = InventorySlotControl.prototype.remove;
    InventorySlotControl.prototype.remove = function() {
        this.backgroundPanel.remove();
        this.borderControl.remove();
        this.imageControl.remove();
        this.countControl.remove();

        this.elementRemove();
    }

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    InventorySlotControl.prototype.setSlot = function(slot) {
        if(this.slot !== slot) {
            this.slot = slot;
            this.slotChanged = true;
        }
    }

    InventorySlotControl.prototype.updateSlotDisplay = function() {
        if (this.slot === undefined || this.slot.count <= 0) {
            this.countControl.setText(undefined);
        } else {
            if(this.slot.count === 1 && this.slot.metaData !== undefined) {
                this.countControl.setText(undefined);
            } else {
                this.countControl.setText(this.slot.count);
            }

            // Slot Metadata
        }
    }

    var surrogate = function(){};
    surrogate.prototype = InventorySlotControl.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { InventorySlotControl.call(self); },
        create: function(id) { return new InventorySlotControl(id); }
    };

});
