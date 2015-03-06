declare('Equipment', function () {
    include('Component');
    include('TooltipManager');
    include('Resources');
    include('StaticData');
    include('CoreUtils');

    Equipment.prototype = component.create();
    Equipment.prototype.$super = parent;
    Equipment.prototype.constructor = Equipment;

    function Equipment() {
        this.id = "Equipment";

        this.slots = new Array();

        for (var x = 0; x < 10; x++) {
            this.slots[x] = null;
        }

        this.helm = function() {
            return this.slots[0];
        };
        this.shoulders = function() {
            return this.slots[1];
        };
        this.chest = function() {
            return this.slots[2];
        };
        this.legs = function() {
            return this.slots[3];
        };
        this.weapon = function() {
            return this.slots[4];
        };
        this.gloves = function() {
            return this.slots[5];
        };
        this.boots = function() {
            return this.slots[6];
        };
        this.trinket1 = function() {
            return this.slots[7];
        };
        this.trinket2 = function() {
            return this.slots[8];
        };
        this.off_hand = function() {
            return this.slots[9];
        };

        this.equipItem = function(item, currentSlotIndex) {
            if (item == null) {
                return;
            }

            // Check that the item can be equipped
            var equippable = false;
            if (item.type == staticData.ItemType.HELM || item.type == staticData.ItemType.SHOULDERS || item.type == staticData.ItemType.CHEST ||
                item.type == staticData.ItemType.LEGS || item.type == staticData.ItemType.WEAPON || item.type == staticData.ItemType.GLOVES ||
                item.type == staticData.ItemType.BOOTS || item.type == staticData.ItemType.TRINKET || item.type == staticData.ItemType.TRINKET ||
                item.type == staticData.ItemType.OFF_HAND) {
                equippable = true;
            }

            // Calculate which slot this item will go into
            var newSlotIndex = 0;
            switch (item.type) {
                case staticData.ItemType.HELM:
                    newSlotIndex = 0;
                    break;
                case staticData.ItemType.SHOULDERS:
                    newSlotIndex = 1;
                    break;
                case staticData.ItemType.CHEST:
                    newSlotIndex = 2;
                    break;
                case staticData.ItemType.LEGS:
                    newSlotIndex = 3;
                    break;
                case staticData.ItemType.WEAPON:
                    newSlotIndex = 4;
                    break;
                case staticData.ItemType.GLOVES:
                    newSlotIndex = 5;
                    break;
                case staticData.ItemType.BOOTS:
                    newSlotIndex = 6;
                    break;
                case staticData.ItemType.TRINKET:
                    // Either select the first empty trinket slot, or the first one if both arre occupied
                    if (this.slots[7] == null) {
                        newSlotIndex = 7;
                    }
                    else if (this.slots[8] == null) {
                        newSlotIndex = 8;
                    }
                    else {
                        newSlotIndex = 7;
                    }
                    break;
                case staticData.ItemType.OFF_HAND:
                    newSlotIndex = 9;
                    break;
            }

            // If the item is equippable then equip it
            if (equippable) {
                // If the slot is empty then just equip it
                if (this.slots[newSlotIndex] == null) {
                    this.slots[newSlotIndex] = item;
                    $(".equipItem" + (newSlotIndex + 1)).css('background', coreUtils.getImageUrl(resources.ImageItemSheet3) + ' ' + item.iconSourceX + 'px ' + item.iconSourceY + 'px');
                    game.inventory.removeItem(currentSlotIndex);

                    game.player.gainItemsStats(item);
                }
                // If there is already an item in this slot, then swap the two items
                else {
                    // Save the equipped item
                    var savedItem = this.slots[newSlotIndex];

                    // Change the equipped item
                    this.slots[newSlotIndex] = item;
                    $(".equipItem" + (newSlotIndex + 1)).css('background', coreUtils.getImageUrl(resources.ImageItemSheet3) + ' ' + item.iconSourceX + 'px ' + item.iconSourceY + 'px');
                    game.player.gainItemsStats(item);

                    // Change the inventory item
                    game.inventory.addItemToSlot(savedItem, currentSlotIndex);
                    game.player.loseItemsStats(savedItem);
                }

                // If there is a new item in the old slot, change the tooltip
                if (game.inventory.slots[currentSlotIndex] != null) {
                    var slotItem = game.inventory.slots[currentSlotIndex];
                    // If there is already an item equipped in the slot this item would go into, then get that item
                    // Get the slot Id if there is an item equipped
                    var equippedSlot = -1
                    var twoTrinkets = false;
                    switch (slotItem.type) {
                        case staticData.ItemType.HELM:
                            if (game.equipment.helm() != null) {
                                equippedSlot = 0
                            }
                            break;
                        case staticData.ItemType.SHOULDERS:
                            if (game.equipment.shoulders() != null) {
                                equippedSlot = 1;
                            }
                            break;
                        case staticData.ItemType.CHEST:
                            if (game.equipment.chest() != null) {
                                equippedSlot = 2;
                            }
                            break;
                        case staticData.ItemType.LEGS:
                            if (game.equipment.legs() != null) {
                                equippedSlot = 3;
                            }
                            break;
                        case staticData.ItemType.WEAPON:
                            if (game.equipment.weapon() != null) {
                                equippedSlot = 4;
                            }
                            break;
                        case staticData.ItemType.GLOVES:
                            if (game.equipment.gloves() != null) {
                                equippedSlot = 5;
                            }
                            break;
                        case staticData.ItemType.BOOTS:
                            if (game.equipment.boots() != null) {
                                equippedSlot = 6;
                            }
                            break;
                        case staticData.ItemType.TRINKET:
                            if (game.equipment.trinket1() != null || game.equipment.trinket2() != null) {
                                equippedSlot = 7;
                                // Check to see if there are two trinkets equipped, then we will need to show two compare tooltips
                                if (game.equipment.trinket1() != null && game.equipment.trinket2() != null) {
                                    twoTrinkets = true;
                                }
                            }
                            break;
                        case staticData.ItemType.OFF_HAND:
                            if (game.equipment.off_hand() != null) {
                                equippedSlot = 9;
                            }
                            break;
                    }
                    var item2 = game.equipment.slots[equippedSlot];

                    // If the item type is a trinket and there are two trinkets equipped then we need to display two compare tooltips
                    if (twoTrinkets) {
                        var item3 = game.equipment.trinket2();
                    }

                    // Get the item slot's location
                    var slot = document.getElementById("inventoryItem" + (currentSlotIndex + 1));
                    var rect = slot.getBoundingClientRect();

                    // Display the tooltip
                    tooltipManager.displayItemTooltip(slotItem, item2, item3, rect.left, rect.top, true);
                }
                // Else hide the tooltip
                else {
                    $("#itemTooltip").hide();
                    $("#itemCompareTooltip").hide();
                    $("#itemCompareTooltip2").hide();
                }
            }
        }

        // Equip a trinket into the second slot
        this.equipSecondTrinket = function(item, itemSlot) {
            if (item.type == staticData.ItemType.TRINKET) {
                this.equipItemInSlot(item, 8, itemSlot);

                // If there is a new item in the old slot, change the tooltip
                if (game.inventory.slots[itemSlot] != null) {
                    var slotItem = game.inventory.slots[itemSlot];
                    // If there is already an item equipped in the slot this item would go into, then get that item
                    // Get the slot Id if there is an item equipped
                    var equippedSlot = -1
                    var twoTrinkets = false;
                    switch (slotItem.type) {
                        case staticData.ItemType.HELM:
                            if (game.equipment.helm() != null) {
                                equippedSlot = 0
                            }
                            break;
                        case staticData.ItemType.SHOULDERS:
                            if (game.equipment.shoulders() != null) {
                                equippedSlot = 1;
                            }
                            break;
                        case staticData.ItemType.CHEST:
                            if (game.equipment.chest() != null) {
                                equippedSlot = 2;
                            }
                            break;
                        case staticData.ItemType.LEGS:
                            if (game.equipment.legs() != null) {
                                equippedSlot = 3;
                            }
                            break;
                        case staticData.ItemType.WEAPON:
                            if (game.equipment.weapon() != null) {
                                equippedSlot = 4;
                            }
                            break;
                        case staticData.ItemType.GLOVES:
                            if (game.equipment.gloves() != null) {
                                equippedSlot = 5;
                            }
                            break;
                        case staticData.ItemType.BOOTS:
                            if (game.equipment.boots() != null) {
                                equippedSlot = 6;
                            }
                            break;
                        case staticData.ItemType.TRINKET:
                            if (game.equipment.trinket1() != null || game.equipment.trinket2() != null) {
                                equippedSlot = 7;
                                // Check to see if there are two trinkets equipped, then we will need to show two compare tooltips
                                if (game.equipment.trinket1() != null && game.equipment.trinket2() != null) {
                                    twoTrinkets = true;
                                }
                            }
                            break;
                        case staticData.ItemType.OFF_HAND:
                            if (game.equipment.off_hand() != null) {
                                equippedSlot = 9;
                            }
                            break;
                    }
                    var item2 = game.equipment.slots[equippedSlot];

                    // If the item type is a trinket and there are two trinkets equipped then we need to display two compare tooltips
                    if (twoTrinkets) {
                        var item3 = game.equipment.trinket2();
                    }

                    // Get the item slot's location
                    var slot = document.getElementById("inventoryItem" + (itemSlot + 1));
                    var rect = slot.getBoundingClientRect();

                    // Display the tooltip
                    tooltipManager.displayItemTooltip(slotItem, item2, item3, rect.left, rect.top, true);
                }
                // Else hide the tooltip
                else {
                    $("#itemTooltip").hide();
                    $("#itemCompareTooltip").hide();
                    $("#itemCompareTooltip2").hide();
                }
            }
        }

        this.equipItemInSlot = function(item, newSlotIndex, currentSlotIndex) {
            // Check that the item can be equipped in this slot
            var equippable = false;
            switch (newSlotIndex) {
                case 0:
                    if (item.type == staticData.ItemType.HELM) {
                        equippable = true;
                    }
                    break;
                case 1:
                    if (item.type == staticData.ItemType.SHOULDERS) {
                        equippable = true;
                    }
                    break;
                case 2:
                    if (item.type == staticData.ItemType.CHEST) {
                        equippable = true;
                    }
                    break;
                case 3:
                    if (item.type == staticData.ItemType.LEGS) {
                        equippable = true;
                    }
                    break;
                case 4:
                    if (item.type == staticData.ItemType.WEAPON) {
                        equippable = true;
                    }
                    break;
                case 5:
                    if (item.type == staticData.ItemType.GLOVES) {
                        equippable = true;
                    }
                    break;
                case 6:
                    if (item.type == staticData.ItemType.BOOTS) {
                        equippable = true;
                    }
                    break;
                case 7:
                    if (item.type == staticData.ItemType.TRINKET) {
                        equippable = true;
                    }
                    break;
                case 8:
                    if (item.type == staticData.ItemType.TRINKET) {
                        equippable = true;
                    }
                    break;
                case 9:
                    if (item.type == staticData.ItemType.OFF_HAND) {
                        equippable = true;
                    }
                    break;
            }

            // If the item is equippable then equip it
            if (equippable) {
                // If the slot is empty then just equip it
                if (this.slots[newSlotIndex] == null) {
                    this.slots[newSlotIndex] = item;
                    $(".equipItem" + (newSlotIndex + 1)).css('background', coreUtils.getImageUrl(resources.ImageItemSheet3) + ' ' + item.iconSourceX + 'px ' + item.iconSourceY + 'px');
                    game.inventory.removeItem(currentSlotIndex);

                    game.player.gainItemsStats(item);
                }
                // If there is already an item in this slot, then swap the two items
                else {
                    // Save the equipped item
                    var savedItem = this.slots[newSlotIndex];

                    // Change the equipped item
                    this.slots[newSlotIndex] = item;
                    $(".equipItem" + (newSlotIndex + 1)).css('background', coreUtils.getImageUrl(resources.ImageItemSheet3) + ' ' + item.iconSourceX + 'px ' + item.iconSourceY + 'px');
                    game.player.gainItemsStats(item);

                    // Change the inventory item
                    game.inventory.addItemToSlot(savedItem, currentSlotIndex);
                    game.player.loseItemsStats(savedItem);
                }
            }
        }

        this.removeItem = function(index) {
            game.player.loseItemsStats(this.slots[index]);
            this.slots[index] = null;
            $(".equipItem" + (index + 1)).css('background', 'url("' + resources.ImageNull + '")');
        }

        // Unequip an item to the first available slot
        this.unequipItem = function(slot) {
            // Find the first available slot
            var newSlot = -1;
            for (var x = 0; x < game.inventory.slots.length; x++) {
                if (game.inventory.slots[x] == null) {
                    newSlot = x;
                    break;
                }
            }

            // If there was an available slot; unequip the item
            if (newSlot != -1) {
                game.inventory.addItemToSlot(this.slots[slot], newSlot);
                this.removeItem(slot);
            }
        }

        // Attempt to remove an item from the equipment into a designated inventory slot
        this.unequipItemToSlot = function(currentSlotIndex, newSlotIndex) {
            var inventorySlotItem = game.inventory.slots[newSlotIndex];

            // If the inventory slot contains no item, just send the item to it
            if (inventorySlotItem == null) {
                game.inventory.addItemToSlot(this.slots[currentSlotIndex], newSlotIndex);
                this.removeItem(currentSlotIndex);
            }
            // Else; check to see if the items are the same type
            else if (this.slots[currentSlotIndex].type == inventorySlotItem.type) {
                // If they are then swap them
                // Save the equipped item
                var savedItem = this.slots[currentSlotIndex];

                // Change the equipped item
                this.slots[currentSlotIndex] = inventorySlotItem;
                game.player.gainItemsStats(inventorySlotItem);
                $(".equipItem" + (currentSlotIndex + 1)).css('background', coreUtils.getImageUrl(resources.ImageItemSheet3) + ' ' + inventorySlotItem.iconSourceX + 'px ' + inventorySlotItem.iconSourceY + 'px');

                // Change the inventory item
                game.inventory.addItemToSlot(savedItem, newSlotIndex);
                game.player.loseItemsStats(savedItem);
            }
        }

        // Swap the two trinket items
        this.swapTrinkets = function() {
            // Save the first trinket
            var savedItem = this.slots[7];

            // Change the first slot item
            this.slots[7] = this.slots[8];
            if (this.slots[7] != null) {
                $(".equipItem" + 8).css('background', coreUtils.getImageUrl(resources.ImageItemSheet3) + ' ' + this.slots[7].iconSourceX + 'px ' + this.slots[7].iconSourceY + 'px');
            }
            else {
                $(".equipItem" + 8).css('background', 'url("' + resources.ImageNull + '")');
            }

            // Change the second slot item
            this.slots[8] = savedItem;
            if (savedItem != null) {
                $(".equipItem" + 9).css('background', coreUtils.getImageUrl(resources.ImageItemSheet3) + ' ' + savedItem.iconSourceX + 'px ' + savedItem.iconSourceY + 'px');
            }
            else {
                $(".equipItem" + 9).css('background', 'url("' + resources.ImageNull + '")');
            }
        }

        this.save = function() {
            localStorage.equipmentSaved = true;
            localStorage.equipmentSlots = JSON.stringify(this.slots);
        }

        this.load = function() {
            if (localStorage.equipmentSaved != null) {
                this.slots = JSON.parse(localStorage.equipmentSlots);
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

                // Display the equipment in the window for all these slots
                for (var x = 0; x < this.slots.length; x++) {
                    if (this.slots[x] != null) {
                        $(".equipItem" + (x + 1)).css('background', coreUtils.getImageUrl(resources.ImageItemSheet3) + ' ' + this.slots[x].iconSourceX + 'px ' + this.slots[x].iconSourceY + 'px');
                    }
                }
            }
        }
    }

    return {
        create: function() { return new Equipment(); }
    }

});
