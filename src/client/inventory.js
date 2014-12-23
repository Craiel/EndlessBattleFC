declare("Inventory", function () {
    include('Component');

    Inventory.prototype = component.create();
    Inventory.prototype.$super = parent;
    Inventory.prototype.constructor = Inventory;

    function Inventory() {
        this.id = "Inventory";
        this.slots = new Array();
        this.maxSlots = 25;
        this.autoSellCommons = false;
        this.autoSellUncommons = false;
        this.autoSellRares = false;
        this.autoSellEpics = false;
        this.autoSellLegendaries = false;
        this.autoSellTimeRemaining = 5000;
        this.autoSellInterval = 5000;

        // Initialize the slots
        for (var x = 0; x < this.maxSlots; x++) {
            this.slots[x] = null;
        }

        // Loot an item if there is room
        this.lootItem = function lootItem(item) {
            for (var x = 0; x < this.maxSlots; x++) {
                if (this.slots[x] == null) {
                    this.slots[x] = item;
                    $("#inventoryItem" + (x + 1)).css('background', ('url("includes/images/itemSheet3.png") ' + item.iconSourceX + 'px ' + item.iconSourceY + 'px'));
                    game.stats.itemsLooted++;
                    break;
                }
            }
        }

        // Swap the location of two items in the inventory
        this.swapItems = function swapItems(index1, index2) {
            var savedItem = this.slots[index1];

            this.slots[index1] = this.slots[index2];
            if (this.slots[index1] != null) {
                $("#inventoryItem" + (index1 + 1)).css('background', 'url("includes/images/itemSheet3.png") ' + this.slots[index1].iconSourceX + 'px ' + this.slots[index1].iconSourceY + 'px');
            }
            else {
                $("#inventoryItem" + (index1 + 1)).css('background', 'url("includes/images/NULL.png")');
            }

            this.slots[index2] = savedItem;
            if (this.slots[index2] != null) {
                $("#inventoryItem" + (index2 + 1)).css('background', 'url("includes/images/itemSheet3.png") ' + savedItem.iconSourceX + 'px ' + savedItem.iconSourceY + 'px');
            }
            else {
                $("#inventoryItem" + (index2 + 1)).css('background', 'url("includes/images/NULL.png")');
            }
        }

        // Remove an item from the inventory
        this.removeItem = function removeItem(index) {
            this.slots[index] = null;
            $("#inventoryItem" + (index + 1)).css('background', 'url("includes/images/NULL.png")');
        }

        // Add an item to a specified slot
        this.addItemToSlot = function addItemToSlot(item, index) {
            this.slots[index] = item;
            $("#inventoryItem" + (index + 1)).css('background', 'url("includes/images/itemSheet3.png") ' + item.iconSourceX + 'px ' + item.iconSourceY + 'px');
        }

        // Sell an item in a specified slot
        this.sellItem = function sellItem(slot) {
            if (this.slots[slot] != null) {
                // Get the sell value and give the gold to the player; don't use the gainGold function as it will include gold gain bonuses
                var value = this.slots[slot].sellValue;
                game.player.gold += value;
                // Remove the item and hide the tooltip
                this.removeItem(slot);
                $('#itemTooltip').hide();
                game.stats.itemsSold++;
                game.stats.goldFromItems += value;
            }
        }

        // Sell every item in the player's inventory
        this.sellAll = function sellAll() {
            for (var x = 0; x < this.slots.length; x++) {
                this.sellItem(x);
            }
        }

        // Unlock the ability to auto sell an item rarity
        this.unlockAutoSell = function unlockAutoSell(rarity) {
            switch (rarity) {
                case ItemRarity.COMMON:
                    $("#checkboxWhite").show();
                    break;
                case ItemRarity.UNCOMMON:
                    $("#checkboxGreen").show();
                    break;
                case ItemRarity.RARE:
                    $("#checkboxBlue").show();
                    break;
                case ItemRarity.EPIC:
                    $("#checkboxPurple").show();
                    break;
                case ItemRarity.LEGENDARY:
                    $("#checkboxOrange").show();
                    break;
            }
        }

        this.save = function save() {
            localStorage.inventorySaved = true;
            localStorage.inventorySlots = JSON.stringify(this.slots);
        }

        this.load = function load() {
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
                if (localStorage.version != null) {
                    for (var x = 0; x < this.slots.length; x++) {
                        if (this.slots[x] != null) {
                            $("#inventoryItem" + (x + 1)).css('background', 'url("includes/images/itemSheet3.png") ' + this.slots[x].iconSourceX + 'px ' + this.slots[x].iconSourceY + 'px');
                        }
                    }
                }
                else {
                    for (var x = 0; x < this.slots.length; x++) {
                        if (this.slots[x] != null) {
                            this.slots[x].iconSourceX = (this.slots[x].iconSourceX / 4) * 3.5;
                            this.slots[x].iconSourceY = (this.slots[x].iconSourceY / 4) * 3.5;
                            $("#inventoryItem" + (x + 1)).css('background', 'url("includes/images/itemSheet3.png") ' + this.slots[x].iconSourceX + 'px ' + this.slots[x].iconSourceY + 'px');
                        }
                    }
                }
            }
        }

        this.update = function update(ms) {
            // If enough time has passed ell any items the player wants auto selling
            this.autoSellTimeRemaining -= ms;
            if (this.autoSellTimeRemaining <= 0) {
                this.autoSellTimeRemaining = this.autoSellInterval;
                for (var x = 0; x < this.slots.length; x++) {
                    if (this.slots[x] != null) {
                        if ((this.slots[x].rarity == ItemRarity.COMMON && this.autoSellCommons) || (this.slots[x].rarity == ItemRarity.UNCOMMON && this.autoSellUncommons) ||
                            (this.slots[x].rarity == ItemRarity.RARE && this.autoSellRares) || (this.slots[x].rarity == ItemRarity.EPIC && this.autoSellEpics) ||
                            (this.slots[x].rarity == ItemRarity.LEGENDARY && this.autoSellLegendaries)) {
                            this.sellItem(x);
                        }
                    }
                }
            }
        }
    }

    return {
        create: function() { return new Inventory(); }
    }

});