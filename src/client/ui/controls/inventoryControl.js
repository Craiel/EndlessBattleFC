declare('InventoryControl', function() {
    include('Log');
    include('Assert');
    include('Element');
    include('Panel');
    include('StaticData');
    include('InventorySlotControl');
    include('Game');

    InventoryControl.prototype = element.prototype();
    InventoryControl.prototype.$super = parent;
    InventoryControl.prototype.constructor = InventoryControl;

    function InventoryControl(id) {
        element.construct(this);

        this.id = id;

        this.setTemplate("inventoryControl");

        this.backgroundPanel = undefined;
        this.minSlotSize = 32;
        this.isDynamic = false;

        this.mode = staticData.InventoryModeUnknown;

        this.fixedSlotSize = 36;
        this.fixedSlotRowCount = 14;

        this.elementSize = undefined;

        this.rows = [];
        this.slots = [];
    }

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    InventoryControl.prototype.elementInit = InventoryControl.prototype.init;
    InventoryControl.prototype.init = function(parent, attributes) {
        this.elementInit(parent, attributes);

        assert.isDefined(this.storage, "Storage must be set");

        this.backgroundPanel = panel.create(this.id + "Background");
        this.backgroundPanel.init(this);
        this.backgroundPanel.addClass("inventoryBackground");
        this.backgroundPanel.addClass("globalNoDrag");
        this.addManagedChild(this.backgroundPanel);

        this._rebuildStorageSlots();
    };

    InventoryControl.prototype.elementUpdate = InventoryControl.prototype.update;
    InventoryControl.prototype.update = function(gameTime) {
        if(this.elementUpdate(gameTime) !== true) {
            return false;
        }

        if(this.isVisible) {
            var controlSize = this.getSize();
            if (this.elementSize === undefined || this.elementSize.x !== controlSize.x || this.elementSize.y !== controlSize.y) {
                // Our size changed, need to update the slots
                this._rebuildStorageSlots();
                this.elementSize = controlSize;
            }

            // Update the slot item display
            for(var index = 0; index < this.slots.length; index++) {
                this.slots[index].setSlot(this.storage.getSlotAt(index));
                this.slots[index].update(gameTime);
            }
        }

        return true;
    };

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    InventoryControl.prototype._clearStorageSlots = function() {
        for(var i = 0; i < this.slots.length; i++) {
            this.slots[i].remove();
        }
        this.slots.length = 0;

        for(var i = 0; i < this.rows.length; i++) {
            this.rows[i].remove();
        }
        this.rows.length = 0;
    };

    InventoryControl.prototype._rebuildStorageSlots = function() {
        var inventorySize = this.getSize();
        var slotCount = this.storage.getSize();
        var slotSize = this.fixedSlotSize;
        var slotFullSize = slotSize + 4;
        var slotsPerRow = this.fixedSlotRowCount;
        if(this.isDynamic === true) {
            slotSize = this.getSlotSize(inventorySize.x, inventorySize.y, slotCount);
            slotFullSize = slotSize + 4;
            slotsPerRow = Math.floor(inventorySize.x / slotFullSize);
        }

        var rowCount = Math.ceil(slotCount / slotsPerRow);
        var padding = Math.floor((inventorySize.x - (slotsPerRow * slotFullSize)) / 2);

        this._clearStorageSlots();

        var slotCounter = 0;
        for(var row = 0; row < rowCount; row++) {
            var rowElement = element.create(this.id + "Row" + row);
            rowElement.templateName = "inventoryControlRow";
            rowElement.init(this);
            rowElement.setHeight(slotSize);
            rowElement.setPosition({x: padding, y: 2 + (row * slotFullSize)});
            this.rows.push(rowElement);

            for(var column = 0; column < slotsPerRow; column++) {
                // Create the slots
                var slot = inventorySlotControl.create(this.id + "Slot" + row + "_" + column);
                slot.init(rowElement);
                slot.parent = this;
                slot.setSize({x: slotSize, y: slotSize});
                slot.setPosition({x: column * slotFullSize, y: 0});
                slot.setOnDoubleClick(this.onSlotDoubleClick);
                this.slots.push(slot);
                slotCounter++;

                if(slotCounter >= slotCount) {
                    break;
                }
            }
        }
    };

    InventoryControl.prototype.getSlotSize = function(x, y, slotCount) {
        var side = x;
        if(x > y) {
            side = y;
        }

        var surface = Math.floor((side * side) / slotCount);
        return Math.floor(Math.sqrt(surface)) - 1;
    };

    InventoryControl.prototype.onSlotDoubleClick = function(slotElement)
    {
        if(slotElement.slot !== undefined) {
            game.handleSlotAction(this.self.parent.mode, slotElement.slot)
        }
    };

    var surrogate = function(){};
    surrogate.prototype = InventoryControl.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { InventoryControl.call(self); },
        create: function(id) { return new InventoryControl(id); }
    };

});
