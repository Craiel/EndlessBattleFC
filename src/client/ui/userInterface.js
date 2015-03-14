declare('UserInterface', function () {
    include('Assert');
    include('Component');
    include('StaticData');
    include('QuestManager');
    include('StatUpgradeManager');
    include('TooltipManager');
    include('UpgradeManager');
    include('Resources');
    include('Save');
    include('SaveKeys');
    include('Data');
    include('CoreUtils');
    include('InterfaceState');

    // UI Components
    include('Dialog');
    include('InventoryControl');
    include('SystemDialog');
    include('BattleDialog');
    include('PlayerDialog');
    include('CurrencyDialog');
    include('MercenaryDialog');
    include('InventoryDialog');
    include('QuestDialog');
    include('CharacterDialog');
    include('LogDialog');

    UserInterface.prototype = component.prototype();
    UserInterface.prototype.$super = parent;
    UserInterface.prototype.constructor = UserInterface;

    function UserInterface() {
        component.construct(this);

        this.id = "UserInterface";

        this.mouseX = 0;
        this.mouseY = 0;

        this.playerDialog = undefined;
        this.currencyDialog = undefined;
        this.systemDialog = undefined;
        this.battleDialog = undefined;
        this.mercenaryDialog = undefined;
        this.inventoryDialog = undefined;
        this.questDialog = undefined;
        this.characterDialog = undefined;
        this.logDialog = undefined;

        this.characterArea = undefined;

        this.questArea = undefined;

        this.legacyConstruct();
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    UserInterface.prototype.componentInit = UserInterface.prototype.init;
    UserInterface.prototype.init = function() {
        this.componentInit();

        $(document).mousemove({self: this}, this.handleMouseMove);

        // Dialogs
        this.systemDialog = systemDialog.create();
        this.systemDialog.init();

        this.battleDialog = battleDialog.create();
        this.battleDialog.init();

        this.playerDialog = playerDialog.create();
        this.playerDialog.init();

        this.currencyDialog = currencyDialog.create();
        this.currencyDialog.init();

        this.mercenaryDialog = mercenaryDialog.create();
        this.mercenaryDialog.init();

        this.inventoryDialog = inventoryDialog.create();
        this.inventoryDialog.init();

        this.questDialog = questDialog.create();
        this.questDialog.init();

        this.characterDialog = characterDialog.create();
        this.characterDialog.init();

        this.logDialog = logDialog.create();
        this.logDialog.init();

        this.setupWindowState();
    };

    UserInterface.prototype.componentUpdate = UserInterface.prototype.update;
    UserInterface.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }

        this.updateDialogVisibility();

        this.systemDialog.update(gameTime);
        this.battleDialog.update(gameTime);
        this.playerDialog.update(gameTime);
        this.currencyDialog.update(gameTime);
        this.mercenaryDialog.update(gameTime);
        this.inventoryDialog.update(gameTime);
        this.questDialog.update(gameTime);
        this.characterDialog.update(gameTime);
        this.logDialog.update(gameTime);

        // Legacy:
        this.updateLegacyWindowVisibility();
        this.updateGameInterface(gameTime.elapsed);

        $('#version').text("Version " + game[saveKeys.idnGameVersion]);

        return true;
    }

    // ---------------------------------------------------------------------------
    // event handlers
    // ---------------------------------------------------------------------------
    UserInterface.prototype.handleMouseMove = function(obj) {
        var self = obj.data.self;

        // event.clientX and event.clientY contain the mouse position
        self.mouseX = obj.clientX;
        self.mouseY = obj.clientY;
    }

    // ---------------------------------------------------------------------------
    // init functions
    // ---------------------------------------------------------------------------

    // ---------------------------------------------------------------------------
    // update functions
    // ---------------------------------------------------------------------------
    UserInterface.prototype.updateDialogVisibility = function() {
        this.mercenaryDialog.setVisibility(interfaceState.mercenaryWindowShown);
        this.inventoryDialog.setVisibility(interfaceState.inventoryWindowShown);
        this.questDialog.setVisibility(interfaceState.questWindowShown);
        this.characterDialog.setVisibility(interfaceState.characterWindowShown);
    }

    UserInterface.prototype.updateLegacyWindowVisibility = function() {
        $("#inventoryWindow").hide();
        $("#characterWindow").hide();
        $("#mercenariesWindow").hide();
        $("#upgradesWindow").hide();
        $("#questsWindow").hide();
        $("#optionsWindow").hide();
        $("#statsWindow").hide();
        $("#updatesWindow").hide();

        if(interfaceState.inventoryWindowShown === true) {
            $("#inventoryWindow").show();
        }

        if(interfaceState.characterWindowShown === true) {
            $("#characterWindow").show();
        }

        if(interfaceState.mercenaryWindowShown === true) {
            $("#mercenariesWindow").show();
        }

        if(interfaceState.upgradeWindowShown === true) {
            $("#upgradesWindow").show();
        }

        if(interfaceState.questWindowShown === true) {
            $("#questsWindow").show();
        }

        if(interfaceState.optionsWindowShown === true) {
            $("#optionsWindow").show();
        }

        if(interfaceState.statsWindowShown === true) {
            $("#statsWindow").show();
        }

        if(interfaceState.updatesWindowShown === true) {
            $("#updatesWindow").show();
        }
    }

    // ---------------------------------------------------------------------------
    // utility functions
    // ---------------------------------------------------------------------------




    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Unchecked code below
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    UserInterface.prototype.legacyConstruct = function() {
        this.itemTooltipButtonHovered = false;
        this.sellButtonActive = false;

        this.slotNumberSelected = false;

        this.questsButtonGlowing = false;

        this.fullReset = false;

        this.WindowOrder = new Array("characterWindow", "mercenariesWindow", "upgradesWindow", "questsWindow", "inventoryWindow");
        this.WindowIds = new Array("characterWindow", "mercenariesWindow", "upgradesWindow", "questsWindow", "inventoryWindow");
    }

    UserInterface.prototype.displayAlert = function displayAlert(text) {
        $("#battleLevelText").stop(true);
        var battleLevelText = document.getElementById("battleLevelText");
        battleLevelText.style.opacity = '1';
        battleLevelText.style.top = '600px';
        battleLevelText.innerHTML = text;
        $("#battleLevelText").animate({top: '-=50px', opacity: '0'}, 1000);
    }

    UserInterface.prototype.skullParticlesOptionClick = function() {
        game.options.displaySkullParticles = !game.options.displaySkullParticles;
        if (game.options.displaySkullParticles) {
            document.getElementById("skullParticlesOption").innerHTML = "Monster death particles: ON";
        }
        else {
            document.getElementById("skullParticlesOption").innerHTML = "Monster death particles: OFF";
        }
    }

    UserInterface.prototype.goldParticlesOptionClick = function() {
        game.options.displayGoldParticles = !game.options.displayGoldParticles;
        if (game.options.displayGoldParticles) {
            document.getElementById("goldParticlesOption").innerHTML = "Gold particles: ON";
        }
        else {
            document.getElementById("goldParticlesOption").innerHTML = "Gold particles: OFF";
        }
    }

    UserInterface.prototype.experienceParticlesOptionClick = function() {
        game.options.displayExpParticles = !game.options.displayExpParticles;
        if (game.options.displayExpParticles) {
            document.getElementById("experienceParticlesOption").innerHTML = "Experience particles: ON";
        }
        else {
            document.getElementById("experienceParticlesOption").innerHTML = "Experience particles: OFF";
        }
    }

    UserInterface.prototype.playerDamageParticlesOptionClick = function() {
        game.options.displayPlayerDamageParticles = !game.options.displayPlayerDamageParticles;
        if (game.options.displayPlayerDamageParticles) {
            document.getElementById("playerDamageParticlesOption").innerHTML = "Player damage particles: ON";
        }
        else {
            document.getElementById("playerDamageParticlesOption").innerHTML = "Player damage particles: OFF";
        }
    }

    UserInterface.prototype.monsterDamageParticlesOptionClick = function() {
        game.options.displayMonsterDamageParticles = !game.options.displayMonsterDamageParticles;
        if (game.options.displayMonsterDamageParticles) {
            document.getElementById("monsterDamageParticlesOption").innerHTML = "Monster damage particles: ON";
        }
        else {
            document.getElementById("monsterDamageParticlesOption").innerHTML = "Monster damage particles: OFF";
        }
    }

    UserInterface.prototype.upgradeButtonMouseOverFactory = function(obj, id) {
        return function () {
            upgradeButtonMouseOver(obj, id);
        }
    }

    UserInterface.prototype.upgradeButtonMouseDownFactory = function(id) {
        return function () {
            upgradeButtonMouseDown(id);
        }
    }

    UserInterface.prototype.upgradeButtonMouseOutFactory = function(id) {
        return function () {
            upgradeButtonMouseOut(id);
        }
    }

    UserInterface.prototype.upgradeButtonMouseOver = function(obj, buttonId) {
        var upgradeId = upgradeManager.purchaseButtonUpgradeIds[buttonId - 1];
        var upgrade = upgradeManager.upgrades[upgradeId];
        $("#upgradePurchaseButton" + buttonId).css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 92px');

        $("#otherTooltipTitle").html(upgrade.name);
        $("#otherTooltipCooldown").html('');
        $("#otherTooltipLevel").html('');
        $("#otherTooltipDescription").html(upgrade.description);
        $("#otherTooltip").show();

        // Set the item tooltip's location
        var rect = $(this)[0].getBoundingClientRect();
        $("#otherTooltip").css('top', rect.top - 70);
        var leftReduction = document.getElementById("otherTooltip").scrollWidth;
        $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
    }

    UserInterface.prototype.upgradeButtonMouseDown = function(buttonId) {
        var upgradeId = upgradeManager.purchaseButtonUpgradeIds[buttonId - 1];
        var upgrade = upgradeManager.upgrades[upgradeId];
        $("#upgradePurchaseButton" + buttonId).css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px');
        upgradeManager.purchaseUpgrade(buttonId - 1);
    }

    UserInterface.prototype.upgradeButtonMouseOut = function(buttonId) {
        var upgradeId = upgradeManager.purchaseButtonUpgradeIds[buttonId - 1];
        var upgrade = upgradeManager.upgrades[upgradeId];
        $("#upgradePurchaseButton" + buttonId).css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase)+' 0 0');
        $("#otherTooltip").hide();
    }

    /*this.attackButtonHover = function(obj) {
     // Display a different tooltip depending on the player's attack
     switch (game.player.attackType) {
     case staticData.AttackType.BASIC_ATTACK:
     $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 150px 0');
     $("#otherTooltipTitle").html('Attack');
     $("#otherTooltipCooldown").html('');
     $("#otherTooltipLevel").html('');
     $("#otherTooltipDescription").html('A basic attack.');
     $("#otherTooltip").show();
     break;
     case staticData.AttackType.POWER_STRIKE:
     $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 150px 100px');
     $("#otherTooltipTitle").html('Power Strike');
     $("#otherTooltipCooldown").html('');
     $("#otherTooltipLevel").html('');
     $("#otherTooltipDescription").html('Strike your target with a powerful blow, dealing 1.5x normal damage.');
     $("#otherTooltip").show();
     break;
     case staticData.AttackType.DOUBLE_STRIKE:
     $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 150px 50px');
     $("#otherTooltipTitle").html('Double Strike');
     $("#otherTooltipCooldown").html('');
     $("#otherTooltipLevel").html('');
     $("#otherTooltipDescription").html('Attack your target with two fast strikes.');
     $("#otherTooltip").show();
     break;
     }

     // Set the item tooltip's location
     var rect = $(this)[0].getBoundingClientRect();
     $("#otherTooltip").css('top', rect.top + 10);
     var leftReduction = document.getElementById("otherTooltip").scrollWidth;
     $("#otherTooltip").css('left', (rect.left - leftReduction - 10));
     }

     this.attackButtonReset = function() {
     switch (game.player.attackType) {
     case staticData.AttackType.BASIC_ATTACK:
     $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 0 0');
     break;
     case staticData.AttackType.POWER_STRIKE:
     $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 0 100px');
     break;
     case staticData.AttackType.DOUBLE_STRIKE:
     $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 0 50px');
     break;
     }
     $("#otherTooltip").hide();
     }

     this.attackButtonClick = function(obj) {
     switch (game.player.attackType) {
     case staticData.AttackType.BASIC_ATTACK:
     $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 100px 0');
     break;
     case staticData.AttackType.POWER_STRIKE:
     $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 100px 100px');
     break;
     case staticData.AttackType.DOUBLE_STRIKE:
     $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 100px 50px');
     break;
     }
     if (game.inBattle == true) {
     game.attack();
     }
     }*/

    UserInterface.prototype.stoneButtonHover = function(obj) {
        $(this).css('background', 'url("' + resources.ImageStoneButtons + '") 0 75px');
    }

    UserInterface.prototype.stoneButtonReset = function(obj) {
        $(this).css('background', 'url("' + resources.ImageStoneButtons + '") 0 0px');
    }

    UserInterface.prototype.equipItemHover = function(obj) {
        var index = obj.data.index;
        var item = game.equipment.slots[index - 1];
        // If there is an item in this slot then show the item tooltip
        if (item != null) {
            var rect = obj.currentTarget.getBoundingClientRect();
            tooltipManager.displayItemTooltip(item, null, null, rect.left, rect.top, false);
        }
    }

    UserInterface.prototype.equipItemReset = function(obj) {
        var index = obj.data.index;
        $("#itemTooltip").hide();
        $(".equipItem" + index).css('z-index', '1');
    }

    UserInterface.prototype.equipItemClick = function(obj) {
        var index = obj.data.index;
        // If the left mouse button was clicked
        if (event.which == 1) {
            // Store the information about this item
            slotTypeSelected = staticData.SLOT_TYPE.EQUIP;
            slotNumberSelected = index;

            var rect = $(".equipItem" + index).position();
            $(".equipItem" + index).css('z-index', '200');
        }
    }

    UserInterface.prototype.inventoryItemHover = function(obj) {
        var index = obj.data.index;
        var item = game.inventory.slots[index - 1];
        // If there is an item in this slot then show the item tooltip
        if (item != null) {
            // If there is already an item equipped in the slot this item would go into, then get that item
            // Get the slot Id if there is an item equipped
            var equippedSlot = -1
            var twoTrinkets = false;
            switch (item.type) {
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
            var rect = $(this)[0].getBoundingClientRect();

            // Display the tooltip
            tooltipManager.displayItemTooltip(item, item2, item3, rect.left, rect.top, true);
        }
    }

    UserInterface.prototype.inventoryItemReset = function(obj) {
        var index = obj.data.index;

        $("#itemTooltip").hide();
        $("#itemCompareTooltip").hide();
        $("#itemCompareTooltip2").hide();
        $("#inventoryItem" + index).css('z-index', '1');
    }

    UserInterface.prototype.inventoryItemClick = function(obj) {
        var index = obj.data.index;
        // If the shift key is down then sell this item
        if (obj.shiftKey == 1) {
            game.inventory.sellItem(index - 1);
        }
        // If the left mouse button was clicked
        else if (obj.which == 1) {
            // Store the information about this item
            slotTypeSelected = staticData.SLOT_TYPE.INVENTORY;
            slotNumberSelected = index;

            var rect = $("#inventoryItem" + index).position();
            $("#inventoryItem" + index).css('z-index', '200');
        }
    }

    UserInterface.prototype.sellAllButtonClick = function() {
        game.inventory.sellAll();
    }

    UserInterface.prototype.equipInventoryItem = function(obj) {
        var index = obj.data.self;

        // If the alt key was pressed try to equip this item as a second trinket
        if (obj.altKey == 1) {
            game.equipment.equipSecondTrinket(game.inventory.slots[index - 1], index - 1);
        }
        else {
            game.equipment.equipItem(game.inventory.slots[index - 1], index - 1);
        }
    }

    UserInterface.prototype.equipItemRightClick = function(event, index) {
        game.equipment.unequipItem(index - 1);
    }

    UserInterface.prototype.sellButtonHover = function(obj) {
        // If the button is not active, then highlight it
        if (!sellButtonActive) {
            obj.setAttribute("src", "includes/images/sellButtonHover.png");
        }
    }

    UserInterface.prototype.sellButtonReset = function(obj) {
        // If the button is not active then reset it
        if (!sellButtonActive) {
            obj.setAttribute("src", "includes/images/sellButton.png");
        }
    }

    UserInterface.prototype.sellButtonClick = function(obj) {
        // If the button is not active, then make it active
        if (!sellButtonActive) {
            sellButtonActive = true;
            obj.setAttribute("src", "includes/images/sellButtonDown.png");
        }
        // Else; make it not active
        else {
            sellButtonActive = false;
            obj.setAttribute("src", "includes/images/sellButtonHover.png");
        }
    }

    // Triggered when the Level Up button is clicked
    UserInterface.prototype.displayLevelUpWindow = function displayLevelUpWindow() {
        // Hide the Level Up button
        $("#levelUpButton").hide();

        // Display the stat upgrade window or the ability upgrade window depending on the level
        // If the number is divisible by 5 then the player can choose an ability
        if ((game.player.skillPointsSpent + 2) % 5 == 0) {
            $("#abilityUpgradesWindow").show();
        }
        // Else the player can upgrade a stat
        else {
            // Set the upgrade names on the window's buttons
            var upgrades = statUpgradeManager.upgrades[0];
            $("#statUpgradesWindow").show();

            switch (upgrades[0].type) {
                case staticData.StatUpgradeType.DAMAGE:
                    document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Damage";
                    break;
                case staticData.StatUpgradeType.STRENGTH:
                    document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Strength";
                    break;
                case staticData.StatUpgradeType.AGILITY:
                    document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Agility";
                    break;
                case staticData.StatUpgradeType.STAMINA:
                    document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Stamina";
                    break;
                case staticData.StatUpgradeType.ARMOR:
                    document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Armor";
                    break;
                case staticData.StatUpgradeType.HP5:
                    document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Hp5";
                    break;
                case staticData.StatUpgradeType.CRIT_DAMAGE:
                    document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Crit Damage";
                    break;
                case staticData.StatUpgradeType.ITEM_RARITY:
                    document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Item Rarity";
                    break;
                case staticData.StatUpgradeType.GOLD_GAIN:
                    document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Gold Gain";
                    break;
                case staticData.StatUpgradeType.EXPERIENCE_GAIN:
                    document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Experience Gain";
                    break;
            }

            switch (upgrades[1].type) {
                case staticData.StatUpgradeType.DAMAGE:
                    document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Damage";
                    break;
                case staticData.StatUpgradeType.STRENGTH:
                    document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Strength";
                    break;
                case staticData.StatUpgradeType.AGILITY:
                    document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Agility";
                    break;
                case staticData.StatUpgradeType.STAMINA:
                    document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Stamina";
                    break;
                case staticData.StatUpgradeType.ARMOR:
                    document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Armor";
                    break;
                case staticData.StatUpgradeType.HP5:
                    document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Hp5";
                    break;
                case staticData.StatUpgradeType.CRIT_DAMAGE:
                    document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Crit Damage";
                    break;
                case staticData.StatUpgradeType.ITEM_RARITY:
                    document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Item Rarity";
                    break;
                case staticData.StatUpgradeType.GOLD_GAIN:
                    document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Gold Gain";
                    break;
                case staticData.StatUpgradeType.EXPERIENCE_GAIN:
                    document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Experience Gain";
                    break;
            }

            switch (upgrades[2].type) {
                case staticData.StatUpgradeType.DAMAGE:
                    document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Damage";
                    break;
                case staticData.StatUpgradeType.STRENGTH:
                    document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Strength";
                    break;
                case staticData.StatUpgradeType.AGILITY:
                    document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Agility";
                    break;
                case staticData.StatUpgradeType.STAMINA:
                    document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Stamina";
                    break;
                case staticData.StatUpgradeType.ARMOR:
                    document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Armor";
                    break;
                case staticData.StatUpgradeType.HP5:
                    document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Hp5";
                    break;
                case staticData.StatUpgradeType.CRIT_DAMAGE:
                    document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Crit Damage";
                    break;
                case staticData.StatUpgradeType.ITEM_RARITY:
                    document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Item Rarity";
                    break;
                case staticData.StatUpgradeType.GOLD_GAIN:
                    document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Gold Gain";
                    break;
                case staticData.StatUpgradeType.EXPERIENCE_GAIN:
                    document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Experience Gain";
                    break;
            }
        }
    }

    UserInterface.prototype.questNameClick = function(id) {
        questManager.selectedQuest = id;
    }

    UserInterface.prototype.closeButtonHover = function(obj) {
        obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageCloseButton) + ' 14px 0';
    }

    UserInterface.prototype.closeButtonClick = function(obj) {
        switch (obj.id) {
            case "statUpgradesWindowCloseButton":
                $("#statUpgradesWindow").hide();
                break;
            case "abilityUpgradesWindowCloseButton":
                $("#abilityUpgradesWindow").hide();
                break;
            case "updatesWindowCloseButton":
                $("#updatesWindow").hide();
                break;
            case "statsWindowCloseButton":
                $("#statsWindow").hide();
                break;
            case "optionsWindowCloseButton":
                $("#optionsWindow").hide();
                break;
            case "characterWindowCloseButton":
                $("#characterWindow").hide();
                this.characterWindowShown = false;
                break;
            case "upgradesWindowCloseButton":
                $("#upgradesWindow").hide();
                this.upgradesWindowShown = false;
                break;
            case "questsWindowCloseButton":
                $("#questsWindow").hide();
                this.questsWindowShown = false;
                break;
            case "inventoryWindowCloseButton":
                $("#inventoryWindow").hide();
                this.inventoryWindowShown = false;
                break;
        }
    }

    UserInterface.prototype.closeButtonReset = function(obj) {
        obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageCloseButton) + ' 0 0';
    }

    UserInterface.prototype.updateWindowDepths = function(obj) {
        // Go through the window order and remove the id
        for (var x = 0; x < this.WindowOrder.length; x++) {
            if (this.WindowOrder[x] == obj.id) {
                this.WindowOrder.splice(x, 1);
                break;
            }
        }

        // Add the id again
        this.WindowOrder.push(obj.id);

        // Order the window depths
        for (var x = 0; x < this.WindowOrder.length; x++) {
            document.getElementById(this.WindowOrder[x]).style.zIndex = 5 + x;
        }
    }

    UserInterface.prototype.statUpgradeButtonHover = function(obj) {
        obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 92px';
        var index = obj.data.index;

        // Show a tooltip describing what the hovered stat does if neccessary
        var upgrade = statUpgradeManager.upgrades[0][index - 1];

        switch (upgrade.type) {
            case staticData.StatUpgradeType.DAMAGE:
                $("#otherTooltipTitle").html("Damage");
                $("#otherTooltipDescription").html("Increases the damage you deal with basic attacks.");
                break;
            case staticData.StatUpgradeType.STRENGTH:
                $("#otherTooltipTitle").html("Strength");
                $("#otherTooltipDescription").html("Increases your Health by 5 and Damage by 1%.");
                break;
            case staticData.StatUpgradeType.AGILITY:
                $("#otherTooltipTitle").html("Agility");
                $("#otherTooltipDescription").html("Increases your Crit Damage by 0.2% and Evasion by 1%.");
                break;
            case staticData.StatUpgradeType.STAMINA:
                $("#otherTooltipTitle").html("Stamina");
                $("#otherTooltipDescription").html("Increases your Hp5 by 1 and your Armor by 1%.");
                break;
            case staticData.StatUpgradeType.ARMOR:
                $("#otherTooltipTitle").html("Armor");
                $("#otherTooltipDescription").html("Reduces the damage you take from monsters.");
                break;
            case staticData.StatUpgradeType.EVASION:
                $("#otherTooltipTitle").html("Evasion");
                $("#otherTooltipDescription").html("Increases your chance to dodge a monster's attack.");
                break;
            case staticData.StatUpgradeType.HP5:
                $("#otherTooltipTitle").html("Hp5");
                $("#otherTooltipDescription").html("The amount of health you regenerate over 5 seconds.");
                break;
            case staticData.StatUpgradeType.CRIT_DAMAGE:
                $("#otherTooltipTitle").html("Crit Damage");
                $("#otherTooltipDescription").html("The amount of damage your critical strikes will cause");
                break;
            case staticData.StatUpgradeType.ITEM_RARITY:
                $("#otherTooltipTitle").html("Item Rarity");
                $("#otherTooltipDescription").html("Increases the chance that rarer items will drop from monsters");
                break;
            case staticData.StatUpgradeType.EXPERIENCE_GAIN:
                $("#otherTooltipTitle").html("Experience Gain");
                $("#otherTooltipDescription").html("Increases the experience earned from killing monsters");
                break;
            case staticData.StatUpgradeType.GOLD_GAIN:
                $("#otherTooltipTitle").html("Gold Gain");
                $("#otherTooltipDescription").html("Increases the gold gained from monsters and mercenaries");
                break;
        }

        // Set the item tooltip's location
        $("#otherTooltipCooldown").html('');
        $("#otherTooltipLevel").html('');
        $("#otherTooltip").show();
        var rect = $(this)[0].getBoundingClientRect();
        $("#otherTooltip").css('top', rect.top - 70);
        var leftReduction = document.getElementById("otherTooltip").scrollWidth;
        $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
    }

    UserInterface.prototype.statUpgradeButtonClick = function(obj) {
        var index = obj.data.index;
        obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px';
        $("#statUpgradesWindow").hide();

        // Upgrade a player's stat depending on which button was clicked
        var upgrade = statUpgradeManager.upgrades[0][index - 1];
        switch (upgrade.type) {
            case staticData.StatUpgradeType.DAMAGE:
                game.player.chosenLevelUpBonuses.damageBonus += upgrade.amount;
                break;
            case staticData.StatUpgradeType.STRENGTH:
                game.player.chosenLevelUpBonuses.strength += upgrade.amount;
                break;
            case staticData.StatUpgradeType.AGILITY:
                game.player.chosenLevelUpBonuses.agility += upgrade.amount;
                break;
            case staticData.StatUpgradeType.STAMINA:
                game.player.chosenLevelUpBonuses.stamina += upgrade.amount;
                break;
            case staticData.StatUpgradeType.ARMOR:
                game.player.chosenLevelUpBonuses.armor += upgrade.amount;
                break;
            case staticData.StatUpgradeType.EVASION:
                game.player.chosenLevelUpBonuses.evasion += upgrade.amount;
                break;
            case staticData.StatUpgradeType.HP5:
                game.player.chosenLevelUpBonuses.hp5 += upgrade.amount;
                break;
            case staticData.StatUpgradeType.CRIT_DAMAGE:
                game.player.chosenLevelUpBonuses.critDamage += upgrade.amount;
                break;
            case staticData.StatUpgradeType.ITEM_RARITY:
                game.player.chosenLevelUpBonuses.itemRarity += upgrade.amount;
                break;
            case staticData.StatUpgradeType.EXPERIENCE_GAIN:
                game.player.chosenLevelUpBonuses.experienceGain += upgrade.amount;
                break;
            case staticData.StatUpgradeType.GOLD_GAIN:
                game.player.chosenLevelUpBonuses.goldGain += upgrade.amount;
                break;
        }

        // Remove the upgrade
        statUpgradeManager.upgrades.splice(0, 1);

        // Alter the player's skill points
        game.player.modifySkillPoints(-1);
        game.player.skillPointsSpent++;
    }

    UserInterface.prototype.statUpgradeButtonReset = function(obj) {
        obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 0';
        $("#otherTooltip").hide();
    }

    UserInterface.prototype.rendUpgradeButtonHover = function(obj) {
        obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 92px';

        $("#abilityUpgradeTooltipTitle").html('Rend');
        $("#abilityUpgradeTooltipCooldown").html('');
        // If there is already a level in this ability then show the current version as well
        if (game.player.abilities.getRendLevel() > 0) {
            $("#abilityUpgradeTooltipLevel").html('Level ' + game.player.abilities.getRendLevel());
            $("#abilityUpgradeTooltipDescription").html('Your attacks cause your opponent to bleed for <span class="yellowText">' + game.player.abilities.getRendDamage(0) +
            '</span> damage after every round for ' + game.player.abilities.rendDuration + ' rounds. Stacks up to 5 times.');
            $("#abilityUpgradeTooltipLevel2").html('Next Level');
        }
        else {
            $("#abilityUpgradeTooltipLevel").html('');
            $("#abilityUpgradeTooltipDescription").html('');
            $("#abilityUpgradeTooltipLevel2").html('Level 1');
        }
        $("#abilityUpgradeTooltipDescription2").html('Your attacks cause your opponent to bleed for <span class="yellowText">' + game.player.abilities.getRendDamage(1) +
        '</span> damage after every round for ' + game.player.abilities.rendDuration + ' rounds. Stacks up to 5 times.');
        $("#abilityUpgradeTooltip").show();

        // Set the item tooltip's location
        var rect = $(this)[0].getBoundingClientRect();
        $("#abilityUpgradeTooltip").css('top', rect.top - 70);
        var leftReduction = document.getElementById("abilityUpgradeTooltip").scrollWidth;
        $("#abilityUpgradeTooltip").css('left', (rect.left - leftReduction - 40));
    }

    UserInterface.prototype.rendUpgradeButtonClick = function(obj) {
        obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px';
        $("#abilityUpgradesWindow").hide();
        game.player.increaseAbilityPower(staticData.AbilityName.REND);
    }

    UserInterface.prototype.rendUpgradeButtonReset = function(obj) {
        obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 0';
        $("#abilityUpgradeTooltip").hide();
    }

    UserInterface.prototype.rejuvenatingStrikesUpgradeButtonHover = function(obj) {
        obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 92px';

        $("#abilityUpgradeTooltipTitle").html('Rejuvenating Strikes');
        $("#abilityUpgradeTooltipCooldown").html('');
        // If there is already a level in this ability then show the current version as well
        if (game.player.abilities.getRejuvenatingStrikesLevel() > 0) {
            $("#abilityUpgradeTooltipLevel").html('Level ' + game.player.abilities.getRejuvenatingStrikesLevel());
            $("#abilityUpgradeTooltipDescription").html('Your attacks heal you for <span class="greenText">' + game.player.abilities.getRejuvenatingStrikesHealAmount(0) +
            '</span> health.');
            $("#abilityUpgradeTooltipLevel2").html('Next Level');
        }
        else {
            $("#abilityUpgradeTooltipLevel").html('');
            $("#abilityUpgradeTooltipDescription").html('');
            $("#abilityUpgradeTooltipLevel2").html('Level 1');
        }
        $("#abilityUpgradeTooltipDescription2").html('Your attacks heal you for <span class="greenText">' + game.player.abilities.getRejuvenatingStrikesHealAmount(1) +
        '</span> health.');
        $("#abilityUpgradeTooltip").show();

        // Set the item tooltip's location
        var rect = $(this)[0].getBoundingClientRect();
        $("#abilityUpgradeTooltip").css('top', rect.top + 10);
        var leftReduction = document.getElementById("abilityUpgradeTooltip").scrollWidth;
        $("#abilityUpgradeTooltip").css('left', (rect.left - leftReduction - 10));
    }

    UserInterface.prototype.rejuvenatingStrikesUpgradeButtonClick = function(obj) {
        obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px';
        $("#abilityUpgradesWindow").hide();
        game.player.increaseAbilityPower(staticData.AbilityName.REJUVENATING_STRIKES);
    }

    UserInterface.prototype.rejuvenatingStrikesUpgradeButtonReset = function(obj) {
        obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 0';
        $("#abilityUpgradeTooltip").hide();
    }

    UserInterface.prototype.iceBladeUpgradeButtonHover = function(obj) {
        obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 92px';

        $("#abilityUpgradeTooltipTitle").html('Ice Blade');
        $("#abilityUpgradeTooltipCooldown").html('');
        // If there is already a level in this ability then show the current version as well
        if (game.player.abilities.getIceBladeLevel() > 0) {
            $("#abilityUpgradeTooltipLevel").html('Level ' + game.player.abilities.getIceBladeLevel());
            $("#abilityUpgradeTooltipDescription").html('Your attacks deal <span class="yellowText">' + game.player.abilities.getIceBladeDamage(0) +
            '</span> bonus damage and chill them for ' + game.player.abilities.iceBladeChillDuration + ' rounds.');
            $("#abilityUpgradeTooltipLevel2").html('Next Level');
        }
        else {
            $("#abilityUpgradeTooltipLevel").html('');
            $("#abilityUpgradeTooltipDescription").html('');
            $("#abilityUpgradeTooltipLevel2").html('Level 1');
        }
        $("#abilityUpgradeTooltipDescription2").html('Your attacks deal <span class="yellowText">' + game.player.abilities.getIceBladeDamage(1) +
        '</span> damage and chill them for ' + game.player.abilities.iceBladeChillDuration + ' rounds.');
        $("#abilityUpgradeTooltip").show();

        // Set the item tooltip's location
        var rect = $(this)[0].getBoundingClientRect();
        $("#abilityUpgradeTooltip").css('top', rect.top + 10);
        var leftReduction = document.getElementById("abilityUpgradeTooltip").scrollWidth;
        $("#abilityUpgradeTooltip").css('left', (rect.left - leftReduction - 10));
    }

    UserInterface.prototype.iceBladeUpgradeButtonClick = function(obj) {
        obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px';
        $("#abilityUpgradesWindow").hide();
        game.player.increaseAbilityPower(staticData.AbilityName.ICE_BLADE);
    }

    UserInterface.prototype.iceBladeUpgradeButtonReset = function(obj) {
        obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 0';
        $("#abilityUpgradeTooltip").hide();
    }

    UserInterface.prototype.fireBladeUpgradeButtonHover = function(obj) {
        obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 92px';

        $("#abilityUpgradeTooltipTitle").html('Fire Blade');
        $("#abilityUpgradeTooltipCooldown").html('');
        // If there is already a level in this ability then show the current version as well
        if (game.player.abilities.getFireBladeLevel() > 0) {
            $("#abilityUpgradeTooltipLevel").html('Level ' + game.player.abilities.getFireBladeLevel());
            $("#abilityUpgradeTooltipDescription").html('Your attacks deal <span class="yellowText">' + game.player.abilities.getFireBladeDamage(0) +
            '</span> bonus damage and burn them for <span class="yellowText">' + game.player.abilities.getFireBladeBurnDamage(0) +
            '</span> damage after every round for ' + game.player.abilities.fireBladeBurnDuration + ' rounds.');
            $("#abilityUpgradeTooltipLevel2").html('Next Level');
        }
        else {
            $("#abilityUpgradeTooltipLevel").html('');
            $("#abilityUpgradeTooltipDescription").html('');
            $("#abilityUpgradeTooltipLevel2").html('Level 1');
        }
        $("#abilityUpgradeTooltipDescription2").html('Your attacks deal <span class="yellowText">' + game.player.abilities.getFireBladeDamage(1) +
        '</span> bonus damage and burn them for <span class="yellowText">' + game.player.abilities.getFireBladeBurnDamage(1) +
        '</span> damage after every round for ' + game.player.abilities.fireBladeBurnDuration + ' rounds.');
        $("#abilityUpgradeTooltip").show();

        // Set the item tooltip's location
        var rect = $(this)[0].getBoundingClientRect();
        $("#abilityUpgradeTooltip").css('top', rect.top + 10);
        var leftReduction = document.getElementById("abilityUpgradeTooltip").scrollWidth;
        $("#abilityUpgradeTooltip").css('left', (rect.left - leftReduction - 10));
    }

    UserInterface.prototype.fireBladeUpgradeButtonClick = function(obj) {
        obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px';
        $("#abilityUpgradesWindow").hide();
        game.player.increaseAbilityPower(staticData.AbilityName.FIRE_BLADE);
    }

    UserInterface.prototype.fireBladeUpgradeButtonReset = function(obj) {
        obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 0';
        $("#abilityUpgradeTooltip").hide();
    }

    UserInterface.prototype.expBarAreaMouseOver = function() {
        $("#expBarText").show();
    }

    UserInterface.prototype.expBarAreaMouseOut = function() {
        if (!game.options.alwaysDisplayExp) {
            $("#expBarText").hide();
        }
    }

    UserInterface.prototype.bleedingIconMouseOver = function(obj) {
        $("#otherTooltipTitle").html("Bleeding");
        $("#otherTooltipCooldown").html((game.monster.buffs.bleedMaxDuration - game.monster.buffs.bleedDuration) + ' rounds remaining');
        $("#otherTooltipLevel").html('');
        $("#otherTooltipDescription").html('This monster is bleeding, causing damage at the end of every round');
        $("#otherTooltip").show();

        // Set the item tooltip's location
        var rect = $(this)[0].getBoundingClientRect();
        $("#otherTooltip").css('top', rect.top + 10);
        var leftReduction = document.getElementById("otherTooltip").scrollWidth;
        $("#otherTooltip").css('left', (rect.left - leftReduction - 10));
    }

    UserInterface.prototype.bleedingIconMouseOut = function() {
        $("#otherTooltip").hide();
    }

    UserInterface.prototype.burningIconMouseOver = function(obj) {
        $("#otherTooltipTitle").html("Burning");
        $("#otherTooltipCooldown").html((game.monster.buffs.burningMaxDuration - game.monster.buffs.burningDuration) + ' rounds remaining');
        $("#otherTooltipLevel").html('');
        $("#otherTooltipDescription").html('This monster is burning, causing damage at the end of every round');
        $("#otherTooltip").show();

        // Set the item tooltip's location
        var rect = $(this)[0].getBoundingClientRect();
        $("#otherTooltip").css('top', rect.top + 10);
        var leftReduction = document.getElementById("otherTooltip").scrollWidth;
        $("#otherTooltip").css('left', (rect.left - leftReduction - 10));
    }

    UserInterface.prototype.burningIconMouseOut = function() {
        $("#otherTooltip").hide();
    }

    UserInterface.prototype.chilledIconMouseOver = function(obj) {
        $("#otherTooltipTitle").html("Chilled");
        $("#otherTooltipCooldown").html((game.monster.buffs.chillMaxDuration - game.monster.buffs.chillDuration) + ' rounds remaining');
        $("#otherTooltipLevel").html('');
        $("#otherTooltipDescription").html('This monster is chilled, causing it to attack twice as slow');
        $("#otherTooltip").show();

        // Set the item tooltip's location
        var rect = $(this)[0].getBoundingClientRect();
        $("#otherTooltip").css('top', rect.top + 10);
        var leftReduction = document.getElementById("otherTooltip").scrollWidth;
        $("#otherTooltip").css('left', (rect.left - leftReduction - 10));
    }

    UserInterface.prototype.chilledIconMouseOut = function() {
        $("#otherTooltip").hide();
    }

    UserInterface.prototype.damageBonusStatHover = function(obj) {
        $("#otherTooltipTitle").html("Damage Bonus");
        $("#otherTooltipCooldown").html('');
        $("#otherTooltipLevel").html('');
        $("#otherTooltipDescription").html("Increases the damage you deal with basic attacks.");
        $("#otherTooltip").show();
        obj.data.self.setTooltipLocation(obj);
    }

    UserInterface.prototype.hp5StatHover = function(obj) {
        $("#otherTooltipTitle").html("Hp5");
        $("#otherTooltipCooldown").html('');
        $("#otherTooltipLevel").html('');
        $("#otherTooltipDescription").html("The amount of health you regenerate over 5 seconds.");
        $("#otherTooltip").show();
        obj.data.self.setTooltipLocation(obj);
    }

    UserInterface.prototype.armorStatHover = function(obj) {
        $("#otherTooltipTitle").html("Armor");
        $("#otherTooltipCooldown").html('');
        $("#otherTooltipLevel").html('');
        $("#otherTooltipDescription").html("Reduces the damage you take from monsters.");
        $("#otherTooltip").show();
        obj.data.self.setTooltipLocation(obj);
    }

    UserInterface.prototype.evasionStatHover = function(obj) {
        $("#otherTooltipTitle").html("Evasion");
        $("#otherTooltipCooldown").html('');
        $("#otherTooltipLevel").html('');
        $("#otherTooltipDescription").html("Increases your chance to dodge a monster's attack.");
        $("#otherTooltip").show();
        obj.data.self.setTooltipLocation(obj);
    }

    UserInterface.prototype.strengthStatHover = function(obj) {
        $("#otherTooltipTitle").html("Strength");
        $("#otherTooltipCooldown").html('');
        $("#otherTooltipLevel").html('');
        $("#otherTooltipDescription").html("Increases your Health by 5 and Damage by 1%.");
        $("#otherTooltip").show();
        obj.data.self.setTooltipLocation(obj);
    }

    UserInterface.prototype.agilityStatHover = function(obj) {
        $("#otherTooltipTitle").html("Agility");
        $("#otherTooltipCooldown").html('');
        $("#otherTooltipLevel").html('');
        $("#otherTooltipDescription").html("Increases your Crit Damage by 0.2% and Evasion by 1%.");
        $("#otherTooltip").show();
        obj.data.self.setTooltipLocation(obj);
    }

    UserInterface.prototype.staminaStatHover = function(obj) {
        $("#otherTooltipTitle").html("Stamina");
        $("#otherTooltipCooldown").html('');
        $("#otherTooltipLevel").html('');
        $("#otherTooltipDescription").html("Increases your Hp5 by 1 and Armor by 1%.");
        $("#otherTooltip").show();
        obj.data.self.setTooltipLocation(obj);
    }

    UserInterface.prototype.critChanceStatHover = function(obj) {
        $("#otherTooltipTitle").html("Crit Chance");
        $("#otherTooltipCooldown").html('');
        $("#otherTooltipLevel").html('');
        $("#otherTooltipDescription").html("Increases your chance to get a critical strike.");
        $("#otherTooltip").show();
        obj.data.self.setTooltipLocation(obj);
    }

    UserInterface.prototype.critDamageStatHover = function(obj) {
        $("#otherTooltipTitle").html("Crit Damage");
        $("#otherTooltipCooldown").html('');
        $("#otherTooltipLevel").html('');
        $("#otherTooltipDescription").html("The amount of damage your critical strikes will cause.");
        $("#otherTooltip").show();
        obj.data.self.setTooltipLocation(obj);
    }

    UserInterface.prototype.itemRarityStatHover = function(obj) {
        $("#otherTooltipTitle").html("Item Rarity");
        $("#otherTooltipCooldown").html('');
        $("#otherTooltipLevel").html('');
        $("#otherTooltipDescription").html("Increases the chance that rarer items will drop from monsters.");
        $("#otherTooltip").show();
        obj.data.self.setTooltipLocation(obj);
    }

    UserInterface.prototype.goldGainStatHover = function(obj) {
        $("#otherTooltipTitle").html("Gold Gain");
        $("#otherTooltipCooldown").html('');
        $("#otherTooltipLevel").html('');
        $("#otherTooltipDescription").html("Increases the gold gained from monsters and mercenaries.");
        $("#otherTooltip").show();
        obj.data.self.setTooltipLocation(obj);
    }

    UserInterface.prototype.expGainStatHover = function(obj) {
        $("#otherTooltipTitle").html("Experience Gain");
        $("#otherTooltipCooldown").html('');
        $("#otherTooltipLevel").html('');
        $("#otherTooltipDescription").html("Increases the experience earned from killing monsters.");
        $("#otherTooltip").show();
        obj.data.self.setTooltipLocation(obj);
    }

    UserInterface.prototype.setTooltipLocation = function(obj) {
        var rect = obj.currentTarget.getBoundingClientRect();
        $("#otherTooltip").css('top', rect.top + 10);
        var leftReduction = document.getElementById("otherTooltip").scrollWidth;
        $("#otherTooltip").css('left', (rect.left - leftReduction - 10));
    }

    UserInterface.prototype.statTooltipReset = function() {
        $("#otherTooltip").hide();
    }

    UserInterface.prototype.updatesWindowButtonClick = function(obj) {
        var self = obj.data.self;
        if (!self.updatesWindowShown) {
            self.updatesWindowShown = true;
            self.statsWindowShown = false;
            self.optionsWindowShown = false;
            $("#updatesWindow").show();
            $("#statsWindow").hide();
            $("#optionsWindow").hide();
        }
        else {
            self.updatesWindowShown = false;
            $("#updatesWindow").hide();
        }
    }

    UserInterface.prototype.statsWindowButtonClick = function(obj) {
        var self = obj.data.self;
        if (!self.statsWindowShown) {
            self.updatesWindowShown = false;
            self.statsWindowShown = true;
            self.optionsWindowShown = false;
            $("#updatesWindow").hide();
            $("#statsWindow").show();




            $("#optionsWindow").hide();
        }
        else {
            self.statsWindowShown = false;
            $("#statsWindow").hide();
        }
    }

    UserInterface.prototype.optionsWindowButtonClick = function(obj) {
        var self = obj.data.self;
        if (!self.optionsWindowShown) {
            self.updatesWindowShown = false;
            self.statsWindowShown = false;
            self.optionsWindowShown = true;
            $("#updatesWindow").hide();
            $("#statsWindow").hide();
            $("#optionsWindow").show();
        }
        else {
            self.optionsWindowShown = false;
            $("#optionsWindow").hide();
        }
    }

    UserInterface.prototype.resetButtonClick = function() {
        fullReset = false;
        var powerShardsAvailable = game.calculatePowerShardReward();
        document.getElementById('resetDescription').innerHTML = 'This will erase all progress and not be recoverable. Are you sure you want to reset?';
        $("#resetConfirmWindowPowerShard").show();
        document.getElementById('powerShardsDescription').innerHTML = "You will earn " + powerShardsAvailable + " Power Shards from resetting.";
        $("#powerShardsDescription").show();
        $("#resetConfirmWindow").show();
    }

    UserInterface.prototype.resetConfirmWindowYesButtonClick = function() {
        $("#resetConfirmWindow").hide();
        if (fullReset) {
            game.reset();
        }
        else {
            var powerShards = game.player.getStat(data.StatDefinition.shards.id) + game.calculatePowerShardReward();
            game.reset();
            game.player.setStat(data.StatDefinition.shards.id, powerShards);
        }
    }

    UserInterface.prototype.resetConfirmWindowNoButtonClick = function() {
        $("#resetConfirmWindow").hide();
    }

    UserInterface.prototype.fullResetButtonClick = function() {
        fullReset = true;
        document.getElementById('resetDescription').innerHTML = 'This will erase all progress and not be recoverable, including Power Shards. Are you sure you want to reset?';
        $("#resetConfirmWindowPowerShard").hide();
        $("#powerShardsDescription").hide();

        $("#resetConfirmWindow").show();
    }

    UserInterface.prototype.optionsWindowExitButtonClick = function() {
        $("#optionsWindow").hide();
    }

    UserInterface.prototype.setupStatUpgradeButton = function(name, index) {
        $("#" + name).mouseover({self: this, index: index}, this.statUpgradeButtonHover);
        $("#" + name).mouseup({self: this, index: index}, this.statUpgradeButtonHover);
        $("#" + name).mousedown({self: this, index: index}, this.statUpgradeButtonClick);
        $("#" + name).mouseout({self: this}, this.statUpgradeButtonReset);
    }

    UserInterface.prototype.setupCloseButton = function(name) {
        $("#" + name).mouseover({self: this}, this.closeButtonHover);
        $("#" + name).mouseup({self: this}, this.closeButtonHover);
        $("#" + name).mousedown({self: this}, this.closeButtonClick);
        $("#" + name).mouseout({self: this}, this.closeButtonReset);
    }

    UserInterface.prototype.setupItemSlots = function(index) {
        $("#equipItem" + index).mouseover({self: this, index: index}, this.equipItemHover);
        $("#equipItem" + index).mouseout({self: this, index: index}, this.equipItemReset);
        $("#equipItem" + index).mousedown({self: this, index: index}, this.equipItemClick);

        // TODO:
        //$("#equipItem" + index).rightContext({self: this, index: index}, this.equipItemRightClick);
    }

    UserInterface.prototype.setupInventorySlots = function(index) {
        $("#inventoryItem" + index).mouseover({self: this, index: index}, this.inventoryItemHover);
        $("#inventoryItem" + index).mouseout({self: this, index: index}, this.inventoryItemReset);
        $("#inventoryItem" + index).mousedown({self: this, index: index}, this.inventoryItemClick);

        // TODO
        //$("#inventoryItem" + index).rightContext({self: this, index: index}, this.equipInventoryItem)
    }

    UserInterface.prototype.glowQuestsButton = function() {
        this.questsButtonGlowing = true;
        $("#questsWindowButtonGlow").animate({opacity: '+=0.5'}, 400);
        $("#questsWindowButtonGlow").animate({opacity: '-=0.5'}, 400, function () {
            include('UserInterface').glowQuestsButton();
        });
    }

    UserInterface.prototype.setupWindowState = function() {
        // Wire up all the events

        this.setupStatUpgradeButton("statUpgradeButton1", 1);
        this.setupStatUpgradeButton("statUpgradeButton2", 2);
        this.setupStatUpgradeButton("statUpgradeButton3", 3);

        this.setupCloseButton("updatesWindowCloseButton");
        this.setupCloseButton("statsWindowCloseButton");
        this.setupCloseButton("optionsWindowCloseButton");
        this.setupCloseButton("inventoryWindowCloseButton");
        this.setupCloseButton("characterWindowCloseButton");
        this.setupCloseButton("mercenariesWindowCloseButton");
        this.setupCloseButton("upgradesWindowCloseButton");
        this.setupCloseButton("questsWindowCloseButton");
        this.setupCloseButton("statUpgradesWindowCloseButton");
        this.setupCloseButton("abilityUpgradesWindowCloseButton")

        $("#resetConfirmWindowYesButton").mousedown({self: this}, this.resetConfirmWindowYesButtonClick);
        $("#resetConfirmWindowNoButtonClick").mousedown({self: this}, this.resetConfirmWindowNoButtonClick);

        $("#updates").mousedown({self: this}, this.updatesWindowButtonClick);
        $("#options").mousedown({self: this}, this.optionsWindowButtonClick);
        $("#stats").mousedown({self: this}, this.statsWindowButtonClick);

        $("#save").mousedown({self: this}, function(obj) { game.save(); });
        $("#reset").mousedown({self: this}, this.resetButtonClick);
        $("#fullReset").mousedown({self: this}, this.fullResetButtonClick);

        /*$("#attackButton").mouseover({self: this}, this.attackButtonHover);
         $("#attackButton").mouseup({self: this}, this.attackButtonHover);
         $("#attackButton").mousedown({self: this}, this.attackButtonClick);
         $("#attackButton").mouseout({self: this}, this.attackButtonReset);*/

        /*$("#inventoryWindowButton").mouseover({self: this}, this.inventoryWindowButtonHover);
         $("#inventoryWindowButton").mouseout({self: this}, this.inventoryWindowButtonReset);
         $("#inventoryWindowButton").mousedown({self: this}, this.inventoryWindowButtonClick);
         $("#inventoryWindowButton").mouseup({self: this}, this.inventoryWindowButtonHover);*/

        // item slots in paper doll
        for(var i = 1; i <= 10; i++) {
            this.setupItemSlots(i);
        }

        // item slots in inventory
        for(var i = 1; i <= 24; i++) {
            this.setupInventorySlots(i);
        }

        $('#rendUpgradeButton').mouseover({self: this}, this.rendUpgradeButtonHover);
        $('#rendUpgradeButton').mouseout({self: this}, this.rendUpgradeButtonReset);
        $('#rendUpgradeButton').mousedown({self: this}, this.rendUpgradeButtonClick);
        $('#rendUpgradeButton').mouseup({self: this}, this.rendUpgradeButtonReset);

        $('#rejuvenatingStrikesUpgradeButton').mouseover({self: this}, this.rejuvenatingStrikesUpgradeButtonHover);
        $('#rejuvenatingStrikesUpgradeButton').mouseout({self: this}, this.rejuvenatingStrikesUpgradeButtonReset);
        $('#rejuvenatingStrikesUpgradeButton').mousedown({self: this}, this.rejuvenatingStrikesUpgradeButtonClick);
        $('#rejuvenatingStrikesUpgradeButton').mouseup({self: this}, this.rejuvenatingStrikesUpgradeButtonReset);

        $('#iceBladeUpgradeButton').mouseover({self: this}, this.iceBladeUpgradeButtonHover);
        $('#iceBladeUpgradeButton').mouseout({self: this}, this.iceBladeUpgradeButtonReset);
        $('#iceBladeUpgradeButton').mousedown({self: this}, this.iceBladeUpgradeButtonClick);
        $('#iceBladeUpgradeButton').mouseup({self: this}, this.iceBladeUpgradeButtonReset);

        $('#fireBladeUpgradeButton').mouseover({self: this}, this.fireBladeUpgradeButtonHover);
        $('#fireBladeUpgradeButton').mouseout({self: this}, this.fireBladeUpgradeButtonReset);
        $('#fireBladeUpgradeButton').mousedown({self: this}, this.fireBladeUpgradeButtonClick);
        $('#fireBladeUpgradeButton').mouseup({self: this}, this.fireBladeUpgradeButtonReset);

        $('#monsterBleedingIcon').mouseover({self: this}, this.bleedingIconMouseOver);
        $('#monsterBleedingIcon').mouseout({self: this}, this.bleedingIconMouseOut);

        $('#monsterBurningIcon').mouseover({self: this}, this.burningIconMouseOver);
        $('#monsterBurningIcon').mouseout({self: this}, this.burningIconMouseOut);

        $('#monsterChilledIcon').mouseover({self: this}, this.chilledIconMouseOver);
        $('#monsterChilledIcon').mouseout({self: this}, this.chilledIconMouseOut);

        $('#particleOptionsTitle').mousedown({self: this}, this.skullParticlesOptionClick );
        $('#skullParticlesOption').mousedown({self: this}, this.skullParticlesOptionClick );
        $('#goldParticlesOption').mousedown({self: this}, this.goldParticlesOptionClick );
        $('#experienceParticlesOption').mousedown({self: this}, this.experienceParticlesOptionClick );
        $('#playerDamageParticlesOption').mousedown({self: this}, this.playerDamageParticlesOptionClick );
        $('#monsterDamageParticlesOption').mousedown({self: this}, this.monsterDamageParticlesOptionClick );
        $('#playerHealthOption').mousedown({self: this}, this.playerHealthOptionClick );
        $('#monsterHealthOption').mousedown({self: this}, this.monsterHealthOptionClick );
        $('#expBarOption').mousedown({self: this}, this.expBarOptionClick );

        $('#statHp5').mouseover({self: this}, this.hp5StatHover );
        $('#statHp5').mouseout({self: this}, this.statTooltipReset );
        $('#statDamageBonus').mouseover({self: this}, this.damageBonusStatHover );
        $('#statDamageBonus').mouseout({self: this}, this.statTooltipReset );
        $('#statArmor').mouseover({self: this}, this.armorStatHover );
        $('#statArmor').mouseout({self: this}, this.statTooltipReset );
        $('#statEvasion').mouseover({self: this}, this.evasionStatHover );
        $('#statEvasion').mouseout({self: this}, this.statTooltipReset );
        $('#statStrength').mouseover({self: this}, this.strengthStatHover );
        $('#statStrength').mouseout({self: this}, this.statTooltipReset );
        $('#statStamina').mouseover({self: this}, this.staminaStatHover );
        $('#statStamina').mouseout({self: this}, this.statTooltipReset );
        $('#statAgility').mouseover({self: this}, this.agilityStatHover );
        $('#statAgility').mouseout({self: this}, this.statTooltipReset );
        $('#statCritChance').mouseover({self: this}, this.critChanceStatHover );
        $('#statCritChance').mouseout({self: this}, this.statTooltipReset );
        $('#statCritDamage').mouseover({self: this}, this.critDamageStatHover );
        $('#statCritDamage').mouseout({self: this}, this.statTooltipReset );
        $('#statItemRarity').mouseover({self: this}, this.itemRarityStatHover );
        $('#statItemRarity').mouseout({self: this}, this.statTooltipReset );
        $('#statGoldGain').mouseover({self: this}, this.goldGainStatHover );
        $('#statGoldGain').mouseout({self: this}, this.statTooltipReset );
        $('#statExperienceGain').mouseover({self: this}, this.expGainStatHover );
        $('#statExperienceGain').mouseout({self: this}, this.statTooltipReset );

        $('#footmanBuyButton').mouseover({self: this}, this.footmanBuyButtonMouseOver );
        $('#footmanBuyButton').mouseout({self: this}, this.footmanBuyButtonMouseOut );
        $('#footmanBuyButton').mousedown({self: this}, this.footmanBuyButtonMouseDown );
        $('#footmanBuyButton').mouseup({self: this}, this.footmanBuyButtonMouseOver );

        $('#clericBuyButton').mouseover({self: this}, this.clericBuyButtonMouseOver );
        $('#clericBuyButton').mouseout({self: this}, this.clericBuyButtonMouseOut );
        $('#clericBuyButton').mousedown({self: this}, this.clericBuyButtonMouseDown );
        $('#clericBuyButton').mouseup({self: this}, this.clericBuyButtonMouseOver );

        $('#commanderBuyButton').mouseover({self: this}, this.commanderBuyButtonMouseOver );
        $('#commanderBuyButton').mouseout({self: this}, this.commanderBuyButtonMouseOut );
        $('#commanderBuyButton').mousedown({self: this}, this.commanderBuyButtonMouseDown );
        $('#commanderBuyButton').mouseup({self: this}, this.commanderBuyButtonMouseOver );

        $('#mageBuyButton').mouseover({self: this}, this.mageBuyButtonMouseOver );
        $('#mageBuyButton').mouseout({self: this}, this.mageBuyButtonMouseOut );
        $('#mageBuyButton').mousedown({self: this}, this.mageBuyButtonMouseDown );
        $('#mageBuyButton').mouseup({self: this}, this.mageBuyButtonMouseOver );

        $('#assassinBuyButton').mouseover({self: this}, this.assassinBuyButtonMouseOver );
        $('#assassinBuyButton').mouseout({self: this}, this.assassinBuyButtonMouseOut );
        $('#assassinBuyButton').mousedown({self: this}, this.assassinBuyButtonMouseDown );
        $('#assassinBuyButton').mouseup({self: this}, this.assassinBuyButtonMouseOver );

        $('#warlockBuyButton').mouseover({self: this}, this.warlockBuyButtonMouseOver );
        $('#warlockBuyButton').mouseout({self: this}, this.warlockBuyButtonMouseOut );
        $('#warlockBuyButton').mousedown({self: this}, this.warlockBuyButtonMouseDown );
        $('#warlockBuyButton').mouseup({self: this}, this.warlockBuyButtonMouseOver );

        $("#inventoryWindowSellAllButton").mousedown({self: this}, this.sellAllButtonClick);

        // Set the startup visibility of things
        $("#itemTooltip").hide();
        $("#itemCompareTooltip").hide();
        $("#itemCompareTooltip2").hide();
        $("#otherTooltip").hide();
        $("#abilityUpgradeTooltip").hide();
        $("#basicTooltip").hide();
        $("#mouseIcon").hide();
        $("#mercenaryArea").hide();

        $("#otherArea").hide();
        $("#inventoryArea").hide();

        $("#questTextArea").hide();
        $("#mapWindow").hide();
        $("#actionButtonsContainer").hide();
        $("#actionCooldownsArea").hide();
        $("#statUpgradesWindow").hide();
        $("#abilityUpgradesWindow").hide();
        $(".bleedingIcon").hide();
        $(".burningIcon").hide();
        $(".chilledIcon").hide();

        $("#healButton").hide();
        $("#iceboltButton").hide();
        $("#fireballButton").hide();
        $("#powerStrikeButton").hide();
        $("#rendCooldownContainer").hide();
        $("#healCooldownContainer").hide();
        $("#iceboltCooldownContainer").hide();
        $("#fireballCooldownContainer").hide();
        $("#powerStrikeCooldownContainer").hide();

        /*$(".characterWindowButton").hide();
         $(".mercenariesWindowButton").hide();
         $(".upgradesWindowButton").hide();
         $("#upgradesWindowButtonGlow").hide();
         $(".questsWindowButton").hide();
         $("#questsWindowButtonGlow").hide();*/

        $("#resetConfirmWindow").hide();


        // Make the equipment slots draggable
        for (var x = 1; x < 11; x++) {
            $(".equipItem" + x).draggable({
                // When an equip item is no longer being dragged
                self: this,
                stop: this.onItemDragStop,
                revert: true,
                scroll: false,
                revertDuration: 0,
                cursorAt: { top: 0, left: 0 }
            });
        }

        // Make the inventory slots draggable
        for (var x = 1; x < (game.inventory.maxSlots + 1); x++) {
            $("#inventoryItem" + x).data('self', this).draggable({
                // When an inventory item is no longer being dragged
                self: this,
                stop: this.onInventoryDragStop,
                revert: true,
                scroll: false,
                revertDuration: 0,
                cursorAt: { top: 0, left: 0 }
            });
        }

        // Todo: redo this part once we are rid of jquery ui
        $("#characterWindow").draggable({self: this, drag: function() { include('UserInterface'); userInterface.updateWindowDepths(document.getElementById("characterWindow")); }});
        $("#mercenariesWindow").draggable({self: this, drag: function() { include('UserInterface'); userInterface.updateWindowDepths(document.getElementById("mercenariesWindow")); } });
        $("#upgradesWindow").draggable({self: this, drag: function() { include('UserInterface'); userInterface.updateWindowDepths(document.getElementById("upgradesWindow")); } });
        $("#questsWindow").draggable({self: this, drag: function() { include('UserInterface'); userInterface.updateWindowDepths(document.getElementById("questsWindow")); } });
        $("#inventoryWindow").draggable({self: this, drag: function() { include('UserInterface'); userInterface.updateWindowDepths(document.getElementById("inventoryWindow")); }});
    }

    UserInterface.prototype.onItemDragStop = function (event, ui) {
        // Move the item to a different slot if it was dragged upon one
        var top = ui.offset.top;
        var left = ui.offset.left;

        // Check if the mouse is over a inventory slot
        var offset;
        var itemMoved = false;
        for (var y = 1; y < (game.inventory.maxSlots + 1); y++) {
            offset = $("#inventoryItem" + y).offset();
            // Check if the mouse is within the slot
            if (left >= offset.left && left < offset.left + 40 && top >= offset.top && top < offset.top + 40) {
                // If it is; move the item
                game.equipment.unequipItemToSlot(slotNumberSelected - 1, y - 1);
                itemMoved = true;
            }
        }

        // Check if the current slot is a trinket slot and the new slot is the other trinket slot
        if (!itemMoved && (slotNumberSelected == 8 || slotNumberSelected == 9)) {
            var otherSlot;
            if (slotNumberSelected == 9) {
                otherSlot = 8;
            }
            else {
                otherSlot = 9;
            }

            offset = $(".equipItem" + otherSlot).offset();
            // Check if the mouse is within the slot
            if (left >= offset.left && left < offset.left + 40 && top >= offset.top && top < offset.top + 40) {
                // If it is; swap the items
                game.equipment.swapTrinkets();
                itemMoved = true;
            }
        }
    }

    UserInterface.prototype.onInventoryDragStop = function (event, ui) {
        // Move the item to a different slot if it was dragged upon one
        var top = ui.offset.top;
        var left = ui.offset.left;

        // Check if the mouse is over a new inventory slot
        var offset;
        var itemMoved = false;
        for (var y = 1; y < (game.inventory.maxSlots + 1); y++) {
            // If this slot is not the one the item is already in
            if (y != slotNumberSelected) {
                offset = $("#inventoryItem" + y).offset();
                // Check if the mouse is within the slot
                if (left >= offset.left && left < offset.left + 40 && top >= offset.top && top < offset.top + 40) {
                    // If it is; move the item
                    game.inventory.swapItems(slotNumberSelected - 1, y - 1);
                    itemMoved = true;
                }
            }
        }

        // Check if the mouse is over a new equip slot
        if (!itemMoved) {
            for (var y = 1; y < 11; y++) {
                offset = $(".equipItem" + y).offset();
                // Check if the mouse is within the slot
                if (left >= offset.left && left < offset.left + 40 && top >= offset.top && top < offset.top + 40) {
                    // If it is; move the item
                    game.equipment.equipItemInSlot(game.inventory.slots[slotNumberSelected - 1], y - 1, slotNumberSelected - 1);
                    itemMoved = true;
                }
            }
        }

        // Check if the mouse is over the character icon area
        if (!itemMoved) {
            offset = $("#characterIconArea").offset();
            // Check if the mouse is within the area
            // Todo: This kinda sucks but no choice for now
            include('UserInterface');
            if (left >= offset.left && left < offset.left + 124 && userInterface.mouseY >= top.top && userInterface.mouseY < top.top + 204) {
                // If it is; move the item
                game.equipment.equipItem(game.inventory.slots[slotNumberSelected - 1], slotNumberSelected - 1);
                itemMoved = true;
            }
        }
    }

    UserInterface.prototype.updateGameInterface = function(ms) {

        // Update the player's stats
        document.getElementById("levelValue").innerHTML = game.player.getLevel();
        document.getElementById("healthValue").innerHTML = Math.floor(game.player.getStat(data.StatDefinition.hp.id)) + '/' + game.player.getStat(data.StatDefinition.hpMax.id);
        document.getElementById("hp5Value").innerHTML = game.player.getStat(data.StatDefinition.hp5.id).toFixed(2);
        document.getElementById("damageValue").innerHTML = game.player.getStat(data.StatDefinition.dmgMin.id) + ' - ' + game.player.getStat(data.StatDefinition.dmgMax.id);
        document.getElementById("damageBonusValue").innerHTML = game.player.getStat(data.StatDefinition.dmgMult.id) + '%';
        //document.getElementById("armorValue").innerHTML = game.player.getStat(data.StatDefinition.armor.id).toFixed(2) + ' (' + game.player.calculateDamageReduction().toFixed(2) + '%)';
        //document.getElementById("evasionValue").innerHTML = game.player.getStat(data.StatDefinition.evaRate.id).toFixed(2) + ' (' + game.player.calculateEvasionChance().toFixed(2) + '%)';

        document.getElementById("strengthValue").innerHTML = game.player.getStat(data.StatDefinition.str.id);
        document.getElementById("staminaValue").innerHTML = game.player.getStat(data.StatDefinition.sta.id);
        document.getElementById("agilityValue").innerHTML = game.player.getStat(data.StatDefinition.agi.id);
        document.getElementById("critChanceValue").innerHTML = game.player.getStat(data.StatDefinition.critRate.id).toFixed(2) + '%';
        document.getElementById("critDamageValue").innerHTML = game.player.getStat(data.StatDefinition.critDmg.id).toFixed(2) + '%';

        document.getElementById("itemRarityValue").innerHTML = game.player.getStat(data.StatDefinition.magicFind.id).toFixed(2) + '%';
        document.getElementById("goldGainValue").innerHTML = game.player.getStat(data.StatDefinition.goldMult.id).toFixed(2) + '%';
        document.getElementById("experienceGainValue").innerHTML = game.player.getStat(data.StatDefinition.xpMult.id).toFixed(2) + '%';

        // Update the select quest display
        var quest = questManager.getSelectedQuest();
        if (quest != null) {
            var newText = '';
            // Name
            document.getElementById("questTitle").innerHTML = quest.name;
            // Create the quest goal
            switch (quest.type) {
                case staticData.QuestType.KILL:
                    if (quest.typeAmount == 1) {
                        newText = "Slay " + quest.typeAmount + " Level " + quest.typeId + " Monster.";
                    }
                    else {
                        newText = "Slay " + quest.typeAmount + " Level " + quest.typeId + " Monsters.";
                    }
                    break;
                case staticData.QuestType.UPGRADE:
                    newText = "Purchase the " + upgradeManager.upgrades[quest.typeId].name + " upgrade.";
                    break;
            }
            document.getElementById("questGoal").innerHTML = newText;
            // Create the quest progress text
            switch (quest.type) {
                case staticData.QuestType.KILL:
                    newText = quest.killCount + "/" + quest.typeAmount + " Monsters slain.";
                    break;
                case staticData.QuestType.UPGRADE:
                    break;
            }
            document.getElementById("questProgress").innerHTML = newText;
            // Add the description
            document.getElementById("questDescription").innerHTML = "<br>" + quest.description;
            // Add the reward
            document.getElementById("questReward").innerHTML = "<br>Reward:";
            if (quest.buffReward != null) {
                document.getElementById("questRewardText").innerHTML = "Completing this quest will empower you with a powerful buff.";
            }
            document.getElementById("questGold").innerHTML = quest.goldReward;
            document.getElementById("questExperience").innerHTML = quest.expReward;
        }
        else {
            $("#questNamesArea").hide();
            $("#questTextArea").hide();
        }
    }

    return new UserInterface();
});
