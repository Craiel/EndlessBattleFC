declare('InventoryControl', function() {
    include('Log');
    include('Assert');
    include('StaticData');
    include('Element');
    include('CoreUtils');
    include('Resources');
    include('Panel');
    include('InventorySlotControl');

    InventoryControl.prototype = element.create();
    InventoryControl.prototype.$super = parent;
    InventoryControl.prototype.constructor = InventoryControl;

    function InventoryControl(id) {
        this.id = id;

        this.setTemplate("inventoryControl");

        this.backgroundPanel = undefined;
        this.minSlotSize = 32;

        this.elementSize = undefined;

        this.rows = [];
        this.slots = [];

        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;

        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
            this.elementInit(parent, attributes);

            assert.isDefined(this.storage, "Storage  must be set");

            this.backgroundPanel = panel.create(this.id + "Background");
            this.backgroundPanel.init(this);
            this.backgroundPanel.addClass("inventoryBackground");
            this.backgroundPanel.addClass("globalNoDrag");

            this._rebuildStorageSlots();
        };

        this.elementUpdate = this.update;
        this.update = function(gameTime) {
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

                // Update the clot item display
                for(var index = 0; index < this.slots.length; index++) {
                    this.slots[index].setSlot(this.storage.getSlotAt(index));
                    this.slots[index].update(gameTime);
                }
            }

            return true;
        }

        // ---------------------------------------------------------------------------
        // dialog functions
        // ---------------------------------------------------------------------------
        this._clearStorageSlots = function() {
            for(var i = 0; i < this.slots.length; i++) {
                this.slots[i].remove();
            }
            this.slots.length = 0;

            for(var i = 0; i < this.rows.length; i++) {
                this.rows[i].remove();
            }
            this.rows.length = 0;
        }

        this._rebuildStorageSlots = function() {
            console.log(this.getMainElement());
            var inventorySize = this.getSize();
            var slotCount = this.storage.getSize();
            var slotSize = this.getSlotSize(inventorySize.x, inventorySize.y, slotCount);
            var slotFullSize = slotSize + 1;
            var slotsPerRow = Math.floor(inventorySize.x / slotFullSize);
            var rowMargin = inventorySize.x - (slotsPerRow * slotFullSize);
            var rowCount = Math.ceil(slotCount / slotsPerRow);
            var padding = Math.floor((inventorySize.x - (slotsPerRow * slotFullSize)) / 2);            console.log(padding);

            this._clearStorageSlots();

            var slotCounter = 0;
            for(var row = 0; row < rowCount; row++) {
                var rowElement = element.create(this.id + "Row" + row);
                rowElement.templateName = "inventoryRow";
                rowElement.init(this);
                rowElement.setHeight(slotSize);
                rowElement.setPosition({x: padding, y: 2 + (row * slotFullSize)});
                this.rows.push(rowElement);

                for(var column = 0; column < slotsPerRow; column++) {
                    // Create the slots
                    var slot = inventorySlotControl.create(this.id + "Slot" + row + "_" + column);
                    slot.init(rowElement);
                    slot.setSize({x: slotSize, y: slotSize});
                    slot.setPosition({x: column * slotFullSize, y: 0});
                    this.slots.push(slot);
                    slotCounter++;

                    if(slotCounter >= slotCount) {
                        break;
                    }
                }
            }
        }

        this.getSlotSize = function(x, y, slotCount) {
            var side = x;
            if(x > y) {
                side = y;
            }

            var surface = Math.floor((side * side) / slotCount);
            return Math.floor(Math.sqrt(surface)) - 1;
        }
    };

    return {
        create: function(id) { return new InventoryControl(id); }
    };

});