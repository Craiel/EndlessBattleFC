declare('InventoryDialog', function() {
    include('Element');
    include('Dialog');
    include('CoreUtils');
    include('Resources');
    include('ProgressBar');
    include('Button');
    include('Game');
    include('InventoryControl');

    InventoryDialog.prototype = dialog.prototype();
    InventoryDialog.prototype.$super = parent;
    InventoryDialog.prototype.constructor = InventoryDialog;

    function InventoryDialog() {
        dialog.construct(this);

        this.id = "inventoryDialog";

        this.characterInventory = undefined;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    InventoryDialog.prototype.dialogInit = InventoryDialog.prototype.init;
    InventoryDialog.prototype.init = function(parent, attributes) {
        this.dialogInit(parent, attributes);

        this.setHeaderText("Inventory");

        this.characterInventory = inventoryControl.create("characterInventoryDialog");
        this.characterInventory.isDynamic = true;
        this.characterInventory.storage = game.player.storage;
        this.characterInventory.init(this.getContentArea());
        this.addManagedChild(this.characterInventory);

        this.hide();
    };

    InventoryDialog.prototype.dialogUpdate = InventoryDialog.prototype.update;
    InventoryDialog.prototype.update = function(gameTime) {
        if(this.dialogUpdate(gameTime) !== true) {
            return false;
        }

        return true;
    }

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    var surrogate = function(){};
    surrogate.prototype = InventoryDialog.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { InventoryDialog.call(self); },
        create: function() { return new InventoryDialog(); }
    };

});
