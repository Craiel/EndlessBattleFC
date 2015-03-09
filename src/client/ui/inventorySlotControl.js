declare('InventorySlotControl', function() {
    include('Log');
    include('Assert');
    include('StaticData');
    include('Element');
    include('CoreUtils');
    include('Resources');
    include('Panel');

    InventorySlotControl.prototype = element.create();
    InventorySlotControl.prototype.$super = parent;
    InventorySlotControl.prototype.constructor = InventorySlotControl;

    function InventorySlotControl(id) {
        this.id = id;

        this.setTemplate("inventorySlotControl");

        this.backgroundPanel = undefined;

        this.slotChanged = true;
        this.slot = undefined;

        this.borderControl = undefined;
        this.imageControl = undefined;
        this.countControl = undefined;

        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;

        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
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

        this.elementUpdate = this.update;
        this.update = function(gameTime) {
            if(this.elementUpdate(gameTime) !== true) {
                return false;
            }

            if(this.slotChanged === true) {
                this.updateSlotDisplay();
                this.slotChanged = false;
            }

            return true;
        }

        this.elementRemove = this.remove;
        this.remove = function() {
            this.backgroundPanel.remove();
            this.borderControl.remove();
            this.imageControl.remove();
            this.countControl.remove();

            this.elementRemove();
        }

        // ---------------------------------------------------------------------------
        // dialog functions
        // ---------------------------------------------------------------------------
        this.setSlot = function(slot) {
            if(this.slot !== slot) {
                this.slot = slot;
                this.slotChanged = true;
            }
        }

        this.updateSlotDisplay = function() {
            if (this.slot === undefined) {
                this.countControl.setText(undefined);
            } else {
                this.countControl.setText(this.slot.count);
                this.setLegacySlotProperties(this.slot.metaData);
            }
        }

        this.setLegacySlotProperties = function(metaData) {
            console.log(metaData);
            this.borderControl.addClass("inventorySlotRarity" + metaData.rarity);
        }
    };

    return {
        create: function(id) { return new InventorySlotControl(id); }
    };

});
