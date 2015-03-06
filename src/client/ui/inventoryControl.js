declare('InventoryControl', function() {
    include('Log');
    include('Assert');
    include('StaticData');
    include('Element');
    include('CoreUtils');
    include('Resources');
    include('Panel');

    InventoryControl.prototype = element.create();
    InventoryControl.prototype.$super = parent;
    InventoryControl.prototype.constructor = InventoryControl;

    function InventoryControl(id) {
        this.id = id;

        this.setTemplate("inventoryControl");

        this.backgroundPanel = undefined;

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
        this.setStorage = function(storage) {
            // Todo
        }
    };

    return {
        create: function(id) { return new InventoryControl(id); }
    };

});
