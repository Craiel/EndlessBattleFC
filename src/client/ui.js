declare("Static", function () {

    function Static() {

        this.mouseX = 0;
        this.mouseY = 0;

        this.itemTooltipButtonHovered = false;
        this.sellButtonActive = false;

        this.slotTypeSelected;
        this.slotNumberSelected;

        this.characterWindowShown = false;
        this.mercenariesWindowShown = false;
        this.upgradesWindowShown = false;
        this.questsWindowShown = false;
        this.inventoryWindowShown = false;
        this.inventoryWindowVisible = false;

        this.WindowOrder = new Array("characterWindow", "mercenariesWindow", "upgradesWindow", "questsWindow", "inventoryWindow");
        this.WindowIds = new Array("characterWindow", "mercenariesWindow", "upgradesWindow", "questsWindow", "inventoryWindow");

        this.init = function() {

            // setup Mouse position tracking
            (function () {
                window.onmousemove = handleMouseMove;
                function handleMouseMove(event) {
                    event = event || window.event; // IE-ism
                    // event.clientX and event.clientY contain the mouse position
                    game.ui.mouseX = event.clientX;
                    game.ui.mouseY = event.clientY;
                }
            })();

        };

        // When one of the sell all checkboxes are clicked, update the player's auto sell preferance
        this.sellAllCheckboxClicked = function(checkbox, id) {
            switch (id) {
                case 1:
                    game.inventory.autoSellCommons = checkbox.checked;
                    break;
                case 2:
                    game.inventory.autoSellUncommons = checkbox.checked;
                    break;
                case 3:
                    game.inventory.autoSellRares = checkbox.checked;
                    break;
                case 4:
                    game.inventory.autoSellEpics = checkbox.checked;
                    break;
                case 5:
                    game.inventory.autoSellLegendaries = checkbox.checked;
                    break;
            }
        }

        this.clickEventButton = function(obj, id) {
            game.eventManager.startEvent(obj, id);
        }

        this.skullParticlesOptionClick = function() {
            game.options.displaySkullParticles = !game.options.displaySkullParticles;
            if (game.options.displaySkullParticles) {
                document.getElementById("skullParticlesOption").innerHTML = "Monster death particles: ON";
            }
            else {
                document.getElementById("skullParticlesOption").innerHTML = "Monster death particles: OFF";
            }
        }

        this.goldParticlesOptionClick = function() {
            game.options.displayGoldParticles = !game.options.displayGoldParticles;
            if (game.options.displayGoldParticles) {
                document.getElementById("goldParticlesOption").innerHTML = "Gold particles: ON";
            }
            else {
                document.getElementById("goldParticlesOption").innerHTML = "Gold particles: OFF";
            }
        }

        this.experienceParticlesOptionClick = function() {
            game.options.displayExpParticles = !game.options.displayExpParticles;
            if (game.options.displayExpParticles) {
                document.getElementById("experienceParticlesOption").innerHTML = "Experience particles: ON";
            }
            else {
                document.getElementById("experienceParticlesOption").innerHTML = "Experience particles: OFF";
            }
        }

        this.playerDamageParticlesOptionClick = function() {
            game.options.displayPlayerDamageParticles = !game.options.displayPlayerDamageParticles;
            if (game.options.displayPlayerDamageParticles) {
                document.getElementById("playerDamageParticlesOption").innerHTML = "Player damage particles: ON";
            }
            else {
                document.getElementById("playerDamageParticlesOption").innerHTML = "Player damage particles: OFF";
            }
        }

        this.monsterDamageParticlesOptionClick = function() {
            game.options.displayMonsterDamageParticles = !game.options.displayMonsterDamageParticles;
            if (game.options.displayMonsterDamageParticles) {
                document.getElementById("monsterDamageParticlesOption").innerHTML = "Monster damage particles: ON";
            }
            else {
                document.getElementById("monsterDamageParticlesOption").innerHTML = "Monster damage particles: OFF";
            }
        }

        this.playerHealthOptionClick = function() {
            game.options.alwaysDisplayPlayerHealth = !game.options.alwaysDisplayPlayerHealth;
            if (game.options.alwaysDisplayPlayerHealth) {
                document.getElementById("playerHealthOption").innerHTML = "Always display player health: ON";
                $("#playerHealthBarText").show();
            }
            else {
                document.getElementById("playerHealthOption").innerHTML = "Always display player health: OFF";
                $("#playerHealthBarText").hide();
            }
        }

        this.monsterHealthOptionClick = function() {
            game.options.alwaysDisplayMonsterHealth = !game.options.alwaysDisplayMonsterHealth;
            if (game.options.alwaysDisplayMonsterHealth) {
                document.getElementById("monsterHealthOption").innerHTML = "Always display monster health: ON";
                game.displayMonsterHealth = true;
            }
            else {
                document.getElementById("monsterHealthOption").innerHTML = "Always display monster health: OFF";
                game.displayMonsterHealth = false;
            }
        }

        this.expBarOptionClick = function() {
            game.options.alwaysDisplayExp = !game.options.alwaysDisplayExp;
            if (game.options.alwaysDisplayExp) {
                document.getElementById("expBarOption").innerHTML = "Always display experience: ON";
                $("#expBarText").show();
            }
            else {
                document.getElementById("expBarOption").innerHTML = "Always display experience: OFF";
                $("#expBarText").hide();
            }
        }

        this.upgradeButtonMouseOverFactory = function(obj, id) {
            return function () {
                upgradeButtonMouseOver(obj, id);
            }
        }

        this.upgradeButtonMouseDownFactory = function(id) {
            return function () {
                upgradeButtonMouseDown(id);
            }
        }

        this.upgradeButtonMouseOutFactory = function(id) {
            return function () {
                upgradeButtonMouseOut(id);
            }
        }

        this.upgradeButtonMouseOver = function(obj, buttonId) {
            var upgradeId = game.upgradeManager.purchaseButtonUpgradeIds[buttonId - 1];
            var upgrade = game.upgradeManager.upgrades[upgradeId];
            $("#upgradePurchaseButton" + buttonId).css('background', 'url("includes/images/buyButtonBase.png") 0 92px');

            $("#otherTooltipTitle").html(upgrade.name);
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html(upgrade.description);
            $("#otherTooltip").show();

            // Set the item tooltip's location
            var rect = obj.getBoundingClientRect();
            $("#otherTooltip").css('top', rect.top - 70);
            var leftReduction = document.getElementById("otherTooltip").scrollWidth;
            $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
        }

        this.upgradeButtonMouseDown = function(buttonId) {
            var upgradeId = game.upgradeManager.purchaseButtonUpgradeIds[buttonId - 1];
            var upgrade = game.upgradeManager.upgrades[upgradeId];
            $("#upgradePurchaseButton" + buttonId).css('background', 'url("includes/images/buyButtonBase.png") 0 46px');
            game.upgradeManager.purchaseUpgrade(buttonId - 1);
        }

        this.upgradeButtonMouseOut = function(buttonId) {
            var upgradeId = game.upgradeManager.purchaseButtonUpgradeIds[buttonId - 1];
            var upgrade = game.upgradeManager.upgrades[upgradeId];
            $("#upgradePurchaseButton" + buttonId).css('background', 'url("includes/images/buyButtonBase.png") 0 0');
            $("#otherTooltip").hide();
        }

        this.attackButtonHover = function(obj) {
            // Display a different tooltip depending on the player's attack
            switch (game.player.attackType) {
                case AttackType.BASIC_ATTACK:
                    $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 150px 0');
                    $("#otherTooltipTitle").html('Attack');
                    $("#otherTooltipCooldown").html('');
                    $("#otherTooltipLevel").html('');
                    $("#otherTooltipDescription").html('A basic attack.');
                    $("#otherTooltip").show();
                    break;
                case AttackType.POWER_STRIKE:
                    $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 150px 100px');
                    $("#otherTooltipTitle").html('Power Strike');
                    $("#otherTooltipCooldown").html('');
                    $("#otherTooltipLevel").html('');
                    $("#otherTooltipDescription").html('Strike your target with a powerful blow, dealing 1.5x normal damage.');
                    $("#otherTooltip").show();
                    break;
                case AttackType.DOUBLE_STRIKE:
                    $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 150px 50px');
                    $("#otherTooltipTitle").html('Double Strike');
                    $("#otherTooltipCooldown").html('');
                    $("#otherTooltipLevel").html('');
                    $("#otherTooltipDescription").html('Attack your target with two fast strikes.');
                    $("#otherTooltip").show();
                    break;
            }

            // Set the item tooltip's location
            var rect = obj.getBoundingClientRect();
            $("#otherTooltip").css('top', rect.top + 10);
            var leftReduction = document.getElementById("otherTooltip").scrollWidth;
            $("#otherTooltip").css('left', (rect.left - leftReduction - 10));
        }

        this.attackButtonReset = function() {
            switch (game.player.attackType) {
                case AttackType.BASIC_ATTACK:
                    $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 0 0');
                    break;
                case AttackType.POWER_STRIKE:
                    $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 0 100px');
                    break;
                case AttackType.DOUBLE_STRIKE:
                    $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 0 50px');
                    break;
            }
            $("#otherTooltip").hide();
        }

        this.attackButtonClick = function() {
            switch (game.player.attackType) {
                case AttackType.BASIC_ATTACK:
                    $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 100px 0');
                    break;
                case AttackType.POWER_STRIKE:
                    $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 100px 100px');
                    break;
                case AttackType.DOUBLE_STRIKE:
                    $("#attackButton").css('background', 'url("includes/images/attackButtons.png") 100px 50px');
                    break;
            }
            if (game.inBattle == true) {
                game.attack();
            }
        }

        this.enterBattleButtonHover = function(obj) {
            if (game.inBattle == false && game.player.alive) {
                $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 75px');
            }
        }

        this.enterBattleButtonReset = function(obj) {
            if (game.inBattle == false && game.player.alive) {
                $("#enterBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 0px');
            }
        }

        this.enterBattleButtonClick = function(obj) {
            if (game.inBattle == false && game.player.alive) {
                game.enterBattle();
            }
        }

        this.leaveBattleButtonHover = function(obj) {
            if (game.inBattle == true) {
                $("#leaveBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 75px');
            }
        }

        this.leaveBattleButtonReset = function(obj) {
            if (game.inBattle == true) {
                $("#leaveBattleButton").css('background', 'url("includes/images/stoneButton1.png") 0 0px');
            }
        }

        this.leaveBattleButtonClick = function(obj) {
            // If a battle is active
            if (game.inBattle == true) {
                game.leaveBattle();
            }
        }

        this.battleLevelUpButtonHover = function(obj) {
            if (!game.maxBattleLevelReached()) {
                obj.style.background = 'url("includes/images/battleLevelButton.png") 0 75px';
            }
        }

        this.battleLevelUpButtonClick = function(obj) {
            obj.style.background = 'url("includes/images/battleLevelButton.png") 0 50px';

            if (!game.maxBattleLevelReached()) {
                game.increaseBattleLevel();
                $("#battleLevelDownButton").css('background', 'url("includes/images/battleLevelButton.png") 0 0px');
                if (game.maxBattleLevelReached()) {
                    obj.style.background = 'url("includes/images/battleLevelButton.png") 0 25px';
                }
            }
        }

        this.battleLevelUpButtonReset = function(obj) {
            if (!game.maxBattleLevelReached()) {
                obj.style.background = 'url("includes/images/battleLevelButton.png") 0 0px';
            }
        }

        this.battleLevelDownButtonHover = function(obj) {
            if (game.battleLevel != 1) {
                obj.style.background = 'url("includes/images/battleLevelButton.png") 0 75px';
            }
        }

        this.battleLevelDownButtonClick = function(obj) {
            obj.style.background = 'url("includes/images/battleLevelButton.png") 0 50px';

            if (game.battleLevel != 1) {
                game.decreaseBattleLevel();
                $("#battleLevelUpButton").css('background', 'url("includes/images/battleLevelButton.png") 0 0px');
                if (game.battleLevel == 1) {
                    obj.style.background = 'url("includes/images/battleLevelButton.png") 0 25px';
                }
            }
        }

        this.battleLevelDownButtonReset = function(obj) {
            if (game.battleLevel != 1) {
                obj.style.background = 'url("includes/images/battleLevelButton.png") 0 0px';
            }
        }

        this.equipItemHover = function(obj, index) {
            var item = game.equipment.slots[index - 1];
            // If there is an item in this slot then show the item tooltip
            if (item != null) {
                var rect = obj.getBoundingClientRect();
                game.tooltipManager.displayItemTooltip(item, null, null, rect.left, rect.top, false);
            }
        }

        this.equipItemReset = function(obj, index) {
            $("#itemTooltip").hide();
            $(".equipItem" + index).css('z-index', '1');
        }

        this.equipItemClick = function(obj, index) {
            // If the left mouse button was clicked
            if (event.which == 1) {
                // Store the information about this item
                slotTypeSelected = SLOT_TYPE.EQUIP;
                slotNumberSelected = index;

                var rect = $(".equipItem" + index).position();
                $(".equipItem" + index).css('z-index', '200');
            }
        }

        this.inventoryItemHover = function(obj, index) {
            var item = game.inventory.slots[index - 1];
            // If there is an item in this slot then show the item tooltip
            if (item != null) {
                // If there is already an item equipped in the slot this item would go into, then get that item
                // Get the slot Id if there is an item equipped
                var equippedSlot = -1
                var twoTrinkets = false;
                switch (item.type) {
                    case ItemType.HELM:
                        if (game.equipment.helm() != null) {
                            equippedSlot = 0
                        }
                        break;
                    case ItemType.SHOULDERS:
                        if (game.equipment.shoulders() != null) {
                            equippedSlot = 1;
                        }
                        break;
                    case ItemType.CHEST:
                        if (game.equipment.chest() != null) {
                            equippedSlot = 2;
                        }
                        break;
                    case ItemType.LEGS:
                        if (game.equipment.legs() != null) {
                            equippedSlot = 3;
                        }
                        break;
                    case ItemType.WEAPON:
                        if (game.equipment.weapon() != null) {
                            equippedSlot = 4;
                        }
                        break;
                    case ItemType.GLOVES:
                        if (game.equipment.gloves() != null) {
                            equippedSlot = 5;
                        }
                        break;
                    case ItemType.BOOTS:
                        if (game.equipment.boots() != null) {
                            equippedSlot = 6;
                        }
                        break;
                    case ItemType.TRINKET:
                        if (game.equipment.trinket1() != null || game.equipment.trinket2() != null) {
                            equippedSlot = 7;
                            // Check to see if there are two trinkets equipped, then we will need to show two compare tooltips
                            if (game.equipment.trinket1() != null && game.equipment.trinket2() != null) {
                                twoTrinkets = true;
                            }
                        }
                        break;
                    case ItemType.OFF_HAND:
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
                var rect = obj.getBoundingClientRect();

                // Display the tooltip
                game.tooltipManager.displayItemTooltip(item, item2, item3, rect.left, rect.top, true);
            }
        }

        this.inventoryItemReset = function(obj, index) {
            $("#itemTooltip").hide();
            $("#itemCompareTooltip").hide();
            $("#itemCompareTooltip2").hide();
            $("#inventoryItem" + index).css('z-index', '1');
        }

        this.inventoryItemClick = function(obj, index, event) {
            // If the shift key is down then sell this item
            if (event.shiftKey == 1) {
                game.inventory.sellItem(index - 1);
            }
            // If the left mouse button was clicked
            else if (event.which == 1) {
                // Store the information about this item
                slotTypeSelected = SLOT_TYPE.INVENTORY;
                slotNumberSelected = index;

                var rect = $("#inventoryItem" + index).position();
                $("#inventoryItem" + index).css('z-index', '200');
            }
        }

        this.sellAllButtonClick = function() {
            game.inventory.sellAll();
        }

        this.equipInventoryItem = function(event, index) {
            // If the alt key was pressed try to equip this item as a second trinket
            if (event.altKey == 1) {
                game.equipment.equipSecondTrinket(game.inventory.slots[index - 1], index - 1);
            }
            else {
                game.equipment.equipItem(game.inventory.slots[index - 1], index - 1);
            }
        }

        this.equipItemRightClick = function(event, index) {
            game.equipment.unequipItem(index - 1);
        }

        this.sellButtonHover = function(obj) {
            // If the button is not active, then highlight it
            if (!sellButtonActive) {
                obj.setAttribute("src", "includes/images/sellButtonHover.png");
            }
        }

        this.sellButtonReset = function(obj) {
            // If the button is not active then reset it
            if (!sellButtonActive) {
                obj.setAttribute("src", "includes/images/sellButton.png");
            }
        }

        this.sellButtonClick = function(obj) {
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

        this.levelUpButtonHover = function() {
            $("#levelUpButton").css('background', 'url("includes/images/stoneButton1.png") 0 75px');
        }

        this.levelUpButtonReset = function() {
            $("#levelUpButton").css("background", 'url("includes/images/stoneButton1.png") 0 0px');
        }

        this.levelUpButtonClick = function() {
            $("#levelUpButton").css("background", 'url("includes/images/stoneButton1.png") 0 50px');

            game.displayLevelUpWindow();
        }

        this.characterWindowButtonHover = function(obj) {
            $(".characterWindowButton").css('background', 'url("includes/images/windowButtons.png") 117px 78px');
            game.tooltipManager.displayBasicTooltip(obj, "Character");
        }

        this.characterWindowButtonClick = function(obj) {
            if (characterWindowShown) {
                $("#characterWindow").hide();
                characterWindowShown = false;
            }
            else {
                updateWindowDepths(document.getElementById("characterWindow"));
                $("#characterWindow").show();
                characterWindowShown = true;
                // Update the tutorial
                game.tutorialManager.equipmentOpened = true;
            }
        }

        this.characterWindowButtonReset = function(obj) {
            $(".characterWindowButton").css('background', 'url("includes/images/windowButtons.png") 0px 78px');
            $("#basicTooltip").hide();
        }

        this.mercenariesWindowButtonHover = function(obj) {
            $(".mercenariesWindowButton").css('background', 'url("includes/images/windowButtons.png") 117px 117px');
            game.tooltipManager.displayBasicTooltip(obj, "Mercenaries");
        }

        this.mercenariesWindowButtonClick = function(obj) {
            if (mercenariesWindowShown) {
                $("#mercenariesWindow").hide();
                mercenariesWindowShown = false;
            }
            else {
                $("#mercenariesWindow").show();
                mercenariesWindowShown = true;
                updateWindowDepths(document.getElementById("mercenariesWindow"));
            }

            if (game.tutorialManager.currentTutorial == 9) {
                game.tutorialManager.hideTutorial();
            }
        }

        this.mercenariesWindowButtonReset = function(obj) {
            $(".mercenariesWindowButton").css('background', 'url("includes/images/windowButtons.png") 0px 117px');
            $("#basicTooltip").hide();
        }

        this.upgradesWindowButtonHover = function(obj) {
            $("#upgradesWindowButtonGlow").css('background', 'url("includes/images/windowButtons.png") 39px 0');
            $(".upgradesWindowButton").css('background', 'url("includes/images/windowButtons.png") 117px 0');
            game.tooltipManager.displayBasicTooltip(obj, "Upgrades");
        }

        this.upgradesWindowButtonClick = function(obj) {
            game.upgradeManager.stopGlowingUpgradesButton();
            if (upgradesWindowShown) {
                $("#upgradesWindow").hide();
                upgradesWindowShown = false;
            }
            else {
                $("#upgradesWindow").show();
                upgradesWindowShown = true;
                updateWindowDepths(document.getElementById("upgradesWindow"));
            }

            if (game.tutorialManager.currentTutorial == 10) {
                game.tutorialManager.hideTutorial();
            }
        }

        this.upgradesWindowButtonReset = function(obj) {
            $("#upgradesWindowButtonGlow").css('background', 'url("includes/images/windowButtons.png") 78px 0');
            $(".upgradesWindowButton").css('background', 'url("includes/images/windowButtons.png") 0px 0');
            $("#basicTooltip").hide();
        }

        this.questsWindowButtonHover = function(obj) {
            $("#questsWindowButtonGlow").css('background', 'url("includes/images/windowButtons.png") 39px 195px');
            $(".questsWindowButton").css('background', 'url("includes/images/windowButtons.png") 117px 195px');
            game.tooltipManager.displayBasicTooltip(obj, "Quests");
        }

        this.questsWindowButtonClick = function(obj) {
            game.questsManager.stopGlowingQuestsButton();
            if (questsWindowShown) {
                $("#questsWindow").hide();
                questsWindowShown = false;
            }
            else {
                $("#questsWindow").show();
                questsWindowShown = true;
                updateWindowDepths(document.getElementById("questsWindow"));
            }

            // Hide the tutorial if this is the first quests tutorial
            if (game.tutorialManager.currentTutorial == 6) {
                game.tutorialManager.hideTutorial();
            }
        }

        this.questsWindowButtonReset = function(obj) {
            $("#questsWindowButtonGlow").css('background', 'url("includes/images/windowButtons.png") 78px 195px');
            $(".questsWindowButton").css('background', 'url("includes/images/windowButtons.png") 0px 195px');
            $("#basicTooltip").hide();
        }

        this.questNameClick = function(id) {
            game.questsManager.selectedQuest = id;
        }

        this.inventoryWindowButtonHover = function(obj) {
            $(".inventoryWindowButton").css('background', 'url("includes/images/windowButtons.png") 117px 39px');
            game.tooltipManager.displayBasicTooltip(obj, "Inventory");
        }

        this.inventoryWindowButtonClick = function(obj) {
            if (inventoryWindowShown) {
                $("#inventoryWindow").hide();
                inventoryWindowShown = false;
            }
            else {
                updateWindowDepths(document.getElementById("inventoryWindow"));
                $("#inventoryWindow").show();
                inventoryWindowShown = true;
                // Update the 6th tutorial
                game.tutorialManager.inventoryOpened = true;
            }
        }

        this.inventoryWindowButtonReset = function(obj) {
            $(".inventoryWindowButton").css('background', 'url("includes/images/windowButtons.png") 0px 39px');
            $("#basicTooltip").hide();
        }

        this.closeButtonHover = function(obj) {
            obj.style.background = 'url("includes/images/closeButton.png") 14px 0';
        }

        this.closeButtonClick = function(obj) {
            switch (obj.id) {
                case "statUpgradesWindowCloseButton":
                    $("#statUpgradesWindow").hide();
                    $("#levelUpButton").show();
                    break;
                case "abilityUpgradesWindowCloseButton":
                    $("#abilityUpgradesWindow").hide();
                    $("#levelUpButton").show();
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
                    characterWindowShown = false;
                    break;
                case "mercenariesWindowCloseButton":
                    $("#mercenariesWindow").hide();
                    mercenariesWindowShown = false;
                    break;
                case "upgradesWindowCloseButton":
                    $("#upgradesWindow").hide();
                    upgradesWindowShown = false;
                    break;
                case "questsWindowCloseButton":
                    $("#questsWindow").hide();
                    questsWindowShown = false;
                    break;
                case "inventoryWindowCloseButton":
                    $("#inventoryWindow").hide();
                    inventoryWindowShown = false;
                    break;
            }
        }

        this.closeButtonReset = function(obj) {
            obj.style.background = 'url("includes/images/closeButton.png") 0 0';
        }

        this.updateWindowDepths = function(obj) {
            // Go through the window order and remove the id
            for (var x = 0; x < WindowOrder.length; x++) {
                if (WindowOrder[x] == obj.id) {
                    WindowOrder.splice(x, 1);
                    break;
                }
            }

            // Add the id again
            WindowOrder.push(obj.id);

            // Order the window depths
            for (var x = 0; x < WindowOrder.length; x++) {
                document.getElementById(WindowOrder[x]).style.zIndex = 5 + x;
            }
        }

        this.footmanBuyButtonMouseOver = function(obj) {
            $("#footmanBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 92px');

            $("#otherTooltipTitle").html('Footman');
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html('GPS: ' + game.mercenaryManager.getMercenaryBaseGps(MercenaryType.FOOTMAN));
            $("#otherTooltip").show();

            // Set the item tooltip's location
            var rect = obj.getBoundingClientRect();
            $("#otherTooltip").css('top', rect.top - 70);
            var leftReduction = document.getElementById("otherTooltip").scrollWidth;
            $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
        }

        this.footmanBuyButtonMouseDown = function(obj) {
            $("#footmanBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 46px');
            game.mercenaryManager.purchaseMercenary(MercenaryType.FOOTMAN);
        }

        this.footmanBuyButtonMouseOut = function(obj) {
            $("#footmanBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 0');
            $("#otherTooltip").hide();
        }

        this.clericBuyButtonMouseOver = function(obj) {
            $("#clericBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 92px');

            $("#otherTooltipTitle").html('Cleric');
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html('GPS: ' + game.mercenaryManager.getMercenaryBaseGps(MercenaryType.CLERIC).formatMoney() +
            '<br>Clerics increase your hp5 by ' + game.mercenaryManager.getClericHp5PercentBonus() + '%.');
            $("#otherTooltip").show();

            // Set the item tooltip's location
            var rect = obj.getBoundingClientRect();
            $("#otherTooltip").css('top', rect.top - 70);
            var leftReduction = document.getElementById("otherTooltip").scrollWidth;
            $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
        }

        this.clericBuyButtonMouseDown = function(obj) {
            $("#clericBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 46px');
            game.mercenaryManager.purchaseMercenary(MercenaryType.CLERIC);
        }

        this.clericBuyButtonMouseOut = function(obj) {
            $("#clericBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 0');
            $("#otherTooltip").hide();
        }

        this.commanderBuyButtonMouseOver = function(obj) {
            $("#commanderBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 92px');

            $("#otherTooltipTitle").html('Commander');
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html('GPS: ' + game.mercenaryManager.getMercenaryBaseGps(MercenaryType.COMMANDER).formatMoney() +
            '<br>Commanders increase your health by ' + game.mercenaryManager.getCommanderHealthPercentBonus() + '%.');
            $("#otherTooltip").show();

            // Set the item tooltip's location
            var rect = obj.getBoundingClientRect();
            $("#otherTooltip").css('top', rect.top - 70);
            var leftReduction = document.getElementById("otherTooltip").scrollWidth;
            $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
        }

        this.commanderBuyButtonMouseDown = function(obj) {
            $("#commanderBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 46px');
            game.mercenaryManager.purchaseMercenary(MercenaryType.COMMANDER);
        }

        this.commanderBuyButtonMouseOut = function(obj) {
            $("#commanderBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 0');
            $("#otherTooltip").hide();
        }

        this.mageBuyButtonMouseOver = function(obj) {
            $("#mageBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 92px');

            $("#otherTooltipTitle").html('Mage');
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html('GPS: ' + game.mercenaryManager.getMercenaryBaseGps(MercenaryType.MAGE).formatMoney() +
            '<br>Mages increase your damage by ' + game.mercenaryManager.getMageDamagePercentBonus() + '%.');
            $("#otherTooltip").show();

            // Set the item tooltip's location
            var rect = obj.getBoundingClientRect();
            $("#otherTooltip").css('top', rect.top - 70);
            var leftReduction = document.getElementById("otherTooltip").scrollWidth;
            $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
        }

        this.mageBuyButtonMouseDown = function(obj) {
            $("#mageBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 46px');
            game.mercenaryManager.purchaseMercenary(MercenaryType.MAGE);
        }

        this.mageBuyButtonMouseOut = function(obj) {
            $("#mageBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 0');
            $("#otherTooltip").hide();
        }

        this.assassinBuyButtonMouseOver = function(obj) {
            $("#assassinBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 92px');

            $("#otherTooltipTitle").html('Assassin');
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html('GPS: ' + game.mercenaryManager.getMercenaryBaseGps(MercenaryType.ASSASSIN).formatMoney() +
            '<br>Assassins increase your evasion by ' + game.mercenaryManager.getAssassinEvasionPercentBonus() + '%.');
            $("#otherTooltip").show();

            // Set the item tooltip's location
            var rect = obj.getBoundingClientRect();
            $("#otherTooltip").css('top', rect.top - 70);
            var leftReduction = document.getElementById("otherTooltip").scrollWidth;
            $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
        }

        this.assassinBuyButtonMouseDown = function(obj) {
            $("#assassinBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 46px');
            game.mercenaryManager.purchaseMercenary(MercenaryType.ASSASSIN);
        }

        this.assassinBuyButtonMouseOut = function(obj) {
            $("#assassinBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 0');
            $("#otherTooltip").hide();
        }

        this.warlockBuyButtonMouseOver = function(obj) {
            $("#warlockBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 92px');

            $("#otherTooltipTitle").html('Warlock');
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html('GPS: ' + game.mercenaryManager.getMercenaryBaseGps(MercenaryType.WARLOCK).formatMoney() +
            '<br>Warlocks increase your critical strike damage by ' + game.mercenaryManager.getWarlockCritDamageBonus() + '%.');
            $("#otherTooltip").show();

            // Set the item tooltip's location
            var rect = obj.getBoundingClientRect();
            $("#otherTooltip").css('top', rect.top - 70);
            var leftReduction = document.getElementById("otherTooltip").scrollWidth;
            $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
        }

        this.warlockBuyButtonMouseDown = function(obj) {
            $("#warlockBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 46px');
            game.mercenaryManager.purchaseMercenary(MercenaryType.WARLOCK);
        }

        this.warlockBuyButtonMouseOut = function(obj) {
            $("#warlockBuyButton").css('background', 'url("includes/images/buyButtonBase.png") 0 0');
            $("#otherTooltip").hide();
        }
    }

    return new Static();
});