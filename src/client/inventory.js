declare('Inventory', function () {
    include('Component');
    include('StaticData');
    include('Resources');
    include('Data');
    include('CoreUtils');

    Inventory.prototype = component.prototype();
    Inventory.prototype.$super = parent;
    Inventory.prototype.constructor = Inventory;

    function Inventory() {
        component.construct(this);

        this.id = "Inventory";
        this.slots = new Array();
        this.maxSlots = 25;

        // Initialize the slots
        for (var x = 0; x < this.maxSlots; x++) {
            this.slots[x] = null;
        }
    }

    // Loot an item if there is room
    Inventory.prototype.lootItem = function(item) {
        for (var x = 0; x < this.maxSlots; x++) {
            if (this.slots[x] == null) {
                this.slots[x] = item;
                $("#inventoryItem" + (x + 1)).css('background', (coreUtils.getImageUrl(resources.ImageItemSheet3) + ' ' + item.iconSourceX + 'px ' + item.iconSourceY + 'px'));
                game.stats.itemsLooted++;
                break;
            }
        }
    }

    // Swap the location of two items in the inventory
    Inventory.prototype.swapItems = function(index1, index2) {
        var savedItem = this.slots[index1];

        this.slots[index1] = this.slots[index2];
        if (this.slots[index1] != null) {
            $("#inventoryItem" + (index1 + 1)).css('background', coreUtils.getImageUrl(resources.ImageItemSheet3) + ' ' + this.slots[index1].iconSourceX + 'px ' + this.slots[index1].iconSourceY + 'px');
        }
        else {
            $("#inventoryItem" + (index1 + 1)).css('background', coreUtils.getImageUrl(resources.ImageNull));
        }

        this.slots[index2] = savedItem;
        if (this.slots[index2] != null) {
            $("#inventoryItem" + (index2 + 1)).css('background', coreUtils.getImageUrl(resources.ImageItemSheet3) + ' ' + savedItem.iconSourceX + 'px ' + savedItem.iconSourceY + 'px');
        }
        else {
            $("#inventoryItem" + (index2 + 1)).css('background', coreUtils.getImageUrl(resources.ImageNull));
        }
    }

    // Remove an item from the inventory
    Inventory.prototype.removeItem = function(index) {
        this.slots[index] = null;
        $("#inventoryItem" + (index + 1)).css('background', coreUtils.getImageUrl(resources.ImageNull));
    }

    // Add an item to a specified slot
    Inventory.prototype.addItemToSlot = function(item, index) {
        this.slots[index] = item;
        $("#inventoryItem" + (index + 1)).css('background', coreUtils.getImageUrl(resources.ImageItemSheet3) + ' ' + item.iconSourceX + 'px ' + item.iconSourceY + 'px');
    }

    // Sell an item in a specified slot
    Inventory.prototype.sellItem = function(slot) {
        if (this.slots[slot] != null) {
            // Get the sell value and give the gold to the player; don't use the gainGold function as it will include gold gain bonuses
            var value = this.slots[slot].sellValue;
            game.player.modifyStat(data.StatDefinition.gold.id, value);
            // Remove the item and hide the tooltip
            this.removeItem(slot);
            $('#itemTooltip').hide();
            game.stats.itemsSold++;
            game.stats.goldFromItems += value;
        }
    }

    // Sell every item in the player's inventory
    Inventory.prototype.sellAll = function() {
        for (var x = 0; x < this.slots.length; x++) {
            this.sellItem(x);
        }
    }

    Inventory.prototype.save = function() {
        localStorage.inventorySaved = true;
        localStorage.inventorySlots = JSON.stringify(this.slots);
    }

    Inventory.prototype.load = function() {
        if (localStorage.inventorySaved != null) {
            this.slots = JSON.parse(localStorage.inventorySlots);
            for (var x = 0; x < this.slots.length; x++) {
                if (this.slots[x] != null) {
                    if (this.slots[x].effects != null) {
                        for (var y = 0; y < this.slots[x].effects.length; y++) {
                            this.slots[x].effects[y] = new Effect(this.slots[x].effects[y].type, this.slots[x].effects[y].chance, this.slots[x].effects[y].value);
                        }
                    }
                    else {
                        this.slots[x].effects = new Array();
                    }
                    if (this.slots[x].evasion == null) {
                        this.slots[x].evasion = 0;
                    }
                }
            }

            // Go through all the slots and show their image in the inventory
            for (var x = 0; x < this.slots.length; x++) {
                if (this.slots[x] != null) {
                    $("#inventoryItem" + (x + 1)).css('background', coreUtils.getImageUrl(resources.ImageItemSheet3) + ' ' + this.slots[x].iconSourceX + 'px ' + this.slots[x].iconSourceY + 'px');
                }
            }
        }
    }

    var surrogate = function(){};
    surrogate.prototype = Inventory.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { Inventory.call(self); },
        create: function() { return new Inventory(); }
    }

});