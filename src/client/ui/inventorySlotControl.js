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

        this.storage = undefined;

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


        };

        this.elementUpdate = this.update;
        this.update = function(gameTime) {
            if(this.elementUpdate(gameTime) !== true) {
                return false;
            }

            return true;
        }

        // ---------------------------------------------------------------------------
        // dialog functions
        // ---------------------------------------------------------------------------
        this.setItem = function(item) {
            // Todo
        }
    };

    return {
        create: function(id) { return new InventorySlotControl(id); }
    };

});
