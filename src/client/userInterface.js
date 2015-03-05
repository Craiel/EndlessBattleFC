declare('UserInterface', function () {
    include('Assert');
    include('Component');
    include('Static');
    include('EventManager');
    include('MercenaryManager');
    include('QuestManager');
    include('StatUpgradeManager');
    include('TooltipManager');
    include('GameState');
    include('UpgradeManager');
    include('Resources');
    include('Save');
    include('SaveKeys');
    include('Data');
    include('CoreUtils');

    // UI Components
    include('Element');
    include('ProgressBar');
    include('Panel');
    include('Button');
    include('Dialog');
    include('MercenaryControl');

    UserInterface.prototype = component.create();
    UserInterface.prototype.$super = parent;
    UserInterface.prototype.constructor = UserInterface;

    function UserInterface() {
        this.id = "UserInterface";

        this.mouseX = 0;
        this.mouseY = 0;

        this.characterWindowShown = false;
        this.mercenaryWindowShown = false;
        this.upgradeWindowShown = false;
        this.questWindowShown = false;
        this.inventoryWindowShown = false;
        this.updatesWindowShown = false;
        this.statsWindowShown = false;
        this.optionsWindowShown = false;

        this.playerArea = undefined;
        this.playerHealthBar = undefined;
        this.playerManaBar = undefined;
        this.experienceTitle = undefined;
        this.experienceBar = undefined;

        this.systemArea = undefined;
        this.inventoryWindowButton = undefined;
        this.characterWindowButton = undefined;
        this.questWindowButton = undefined;
        this.mercenaryWindowButton = undefined;
        this.upgradeWindowButton = undefined;

        this.battleArea = undefined;
        this.monsterName = undefined;
        this.monsterHealthBar = undefined;
        this.resurrectionBar = undefined;
        this.enterBattleButton = undefined;
        this.leaveBattleButton = undefined;
        this.battleLevelDownButton = undefined;
        this.battleLevelUpButton = undefined;
        this.levelUpButton = undefined;
        this.attackButton = undefined;

        this.mercenaryArea = undefined;
        this.mercenaryControls = {}

        // ---------------------------------------------------------------------------
        // basic functions
        // ---------------------------------------------------------------------------
        this.componentInit = this.init;
        this.init = function() {
            this.componentInit();

            $(document).mousemove({self: this}, this.handleMouseMove);

            this.initPlayerArea();
            this.initSystemArea();
            this.initBattleArea();

            // Dialogs
            this.initMercenaryDialog();

            this.setupWindowState();
        };

        this.componentUpdate = this.update;
        this.update = function(gameTime) {
            if(this.componentUpdate(gameTime) !== true) {
                return false;
            }

            this.updatePlayerUI(gameTime);
            this.updateSystemMenu(gameTime);
            this.updateBattleUI(gameTime);

            this.updateMercenaryDialog(gameTime);

            $('#version').text("Version " + game[saveKeys.idnGameVersion]);

            return true;
        }

        // ---------------------------------------------------------------------------
        // event handlers
        // ---------------------------------------------------------------------------
        this.handleMouseMove = function(obj) {
            var self = obj.data.self;

            // event.clientX and event.clientY contain the mouse position
            self.mouseX = obj.clientX;
            self.mouseY = obj.clientY;
        }

        // ---------------------------------------------------------------------------
        // init functions
        // ---------------------------------------------------------------------------
        this.initPlayerArea = function() {
            this.playerArea = dialog.create("playerArea");
            this.playerArea.canClose = false;
            this.playerArea.init();

            this.playerHealthBar = progressBar.create("playerHealthBar");
            this.playerHealthBar.init(this.playerArea.getContentArea());
            this.playerHealthBar.animate = true;
            this.playerHealthBar.setImages(resources.ImageProgressGreenHorizontalLeft, resources.ImageProgressGreenHorizontalMid, resources.ImageProgressGreenHorizontalRight);
            this.playerHealthBar.setBackgroundImages(resources.ImageProgressBackHorizontalLeft, resources.ImageProgressBackHorizontalMid, resources.ImageProgressBackHorizontalRight);

            this.playerManaBar = progressBar.create("playerManaBar");
            this.playerManaBar.init(this.playerArea.getContentArea());
            this.playerManaBar.animate = true;
            this.playerManaBar.setImages(resources.ImageProgressBlueHorizontalLeft, resources.ImageProgressBlueHorizontalMid, resources.ImageProgressBlueHorizontalRight);
            this.playerManaBar.setBackgroundImages(resources.ImageProgressBackHorizontalLeft, resources.ImageProgressBackHorizontalMid, resources.ImageProgressBackHorizontalRight);

            this.experienceTitle = element.create("experienceTitle");
            this.experienceTitle.templateName = "textElement";
            this.experienceTitle.init(this.playerArea.getContentArea());
            this.experienceTitle.addClass("experienceTitle");
            this.experienceTitle.setText("XP to next Level: ");

            this.experienceBar = progressBar.create("experienceBar");
            this.experienceBar.init(this.playerArea.getContentArea());
            this.experienceBar.animate = true;
            this.experienceBar.setImages(resources.ImageProgressPurpleHorizontalLeft, resources.ImageProgressPurpleHorizontalMid, resources.ImageProgressPurpleHorizontalRight);
            this.experienceBar.setBackgroundImages(resources.ImageProgressBackHorizontalLeft, resources.ImageProgressBackHorizontalMid, resources.ImageProgressBackHorizontalRight);
        }

        this.initSystemArea = function() {
            this.systemArea = dialog.create("systemArea");
            this.systemArea.canClose = false;
            this.systemArea.init();
            this.systemArea.setHeaderText("System Menu");

            this.inventoryWindowButton = button.create("inventoryWindowButton");
            this.inventoryWindowButton.callback = function(obj) { obj.data.arg.toggleInventoryWindow(); };
            this.inventoryWindowButton.callbackArgument = this;
            this.inventoryWindowButton.init(this.systemArea.getContentArea());
            this.inventoryWindowButton.setImages(resources.ImageIconBackpack, resources.ImageIconBackpackHover, undefined);

            this.characterWindowButton = button.create("characterWindowButton");
            this.characterWindowButton.callback = function(obj) { obj.data.arg.toggleCharacterWindow(); };
            this.characterWindowButton.callbackArgument = this;
            this.characterWindowButton.init(this.systemArea.getContentArea());
            this.characterWindowButton.setImages(resources.ImageIconCharacter, resources.ImageIconCharacterHover, undefined);

            this.questWindowButton = button.create("questWindowButton");
            this.questWindowButton.callback = function(obj) { obj.data.arg.toggleQuestWindow(); };
            this.questWindowButton.callbackArgument = this;
            this.questWindowButton.init(this.systemArea.getContentArea());
            this.questWindowButton.setImages(resources.ImageIconQuest, resources.ImageIconQuestHover, undefined);

            this.mercenaryWindowButton = button.create("mercenaryWindowButton");
            this.mercenaryWindowButton.callback = function(obj) { obj.data.arg.toggleMercenaryWindow(); };
            this.mercenaryWindowButton.callbackArgument = this;
            this.mercenaryWindowButton.init(this.systemArea.getContentArea());
            this.mercenaryWindowButton.setImages(resources.ImageIconMercenary, resources.ImageIconMercenaryHover, undefined);

            this.upgradeWindowButton = button.create("upgradeWindowButton");
            this.upgradeWindowButton.callback = function(obj) { obj.data.arg.toggleUpgradeWindow(); };
            this.upgradeWindowButton.callbackArgument = this;
            this.upgradeWindowButton.init(this.systemArea.getContentArea());
            this.upgradeWindowButton.setImages(resources.ImageIconUpgrade, resources.ImageIconUpgradeHover, undefined);
        }

        this.initBattleArea = function() {
            this.battleArea = dialog.create("battleArea");
            this.battleArea.canClose = false;
            this.battleArea.init();
            this.battleArea.setHeaderText("Battle");

            // Just a plain element for the monster name for now...
            this.monsterName = element.create("monsterName");
            this.monsterName.templateName = "textElement";
            this.monsterName.init(this.battleArea.getContentArea());
            this.monsterName.addClass("monsterName");

            this.monsterHealthBar = progressBar.create("monsterHealthBar");
            this.monsterHealthBar.init(this.battleArea.getContentArea());
            this.monsterHealthBar.animate = true;
            this.monsterHealthBar.setImages(resources.ImageProgressRedHorizontalLeft, resources.ImageProgressRedHorizontalMid, resources.ImageProgressRedHorizontalRight);
            this.monsterHealthBar.setBackgroundImages(resources.ImageProgressBackHorizontalLeft, resources.ImageProgressBackHorizontalMid, resources.ImageProgressBackHorizontalRight);

            this.resurrectionBar = progressBar.create("resurrectionBar");
            this.resurrectionBar.init(this.battleArea.getContentArea());
            this.resurrectionBar.setImages(resources.ImageProgressGreenHorizontalLeft, resources.ImageProgressGreenHorizontalMid, resources.ImageProgressGreenHorizontalRight);
            this.resurrectionBar.setBackgroundImages(resources.ImageProgressBackHorizontalLeft, resources.ImageProgressBackHorizontalMid, resources.ImageProgressBackHorizontalRight);

            this.enterBattleButton = button.create('enterBattleButton');
            this.enterBattleButton.callback = function(obj) { game.enterBattle(); };
            this.enterBattleButton.init(this.battleArea.getContentArea());
            this.enterBattleButton.setImages(resources.ImageButton, resources.ImageButtonHover);

            this.leaveBattleButton = button.create('leaveBattleButton');
            this.leaveBattleButton.callback = function(obj) { game.leaveBattle(); };
            this.leaveBattleButton.init(this.battleArea.getContentArea());
            this.leaveBattleButton.setImages(resources.ImageButton, resources.ImageButtonHover);

            this.battleLevelDownButton = button.create('battleLevelDownButton');
            this.battleLevelDownButton.callback = function(obj) { game.decreaseBattleLevel(); };
            this.battleLevelDownButton.init(this.battleArea.getContentArea());
            this.battleLevelDownButton.setImages(resources.ImageButton, resources.ImageButtonHover);
            this.battleLevelDownButton.setButtonText("-");

            this.battleLevelUpButton = button.create('battleLevelUpButton');
            this.battleLevelUpButton.callback = function(obj) { game.increaseBattleLevel(); };
            this.battleLevelUpButton.init(this.battleArea.getContentArea());
            this.battleLevelUpButton.setImages(resources.ImageButton, resources.ImageButtonHover);
            this.battleLevelUpButton.setButtonText("+");

            this.attackButton = button.create('attackButton');
            this.attackButton.callback = function(obj) { game.attack(); };
            this.attackButton.init(this.battleArea.getContentArea());
            this.attackButton.setImages(resources.ImageButton, resources.ImageButtonHover, resources.ImageIconAttack);

            this.levelUpButton = button.create('levelUpButton');
            this.levelUpButton.callback = function(obj) { if(game.player.getSkillPoints() > 0) { include('UserInterface'); userInterface.displayLevelUpWindow(); }};
            this.levelUpButton.init(this.battleArea.getContentArea());
            this.levelUpButton.setImages(resources.ImageButton, resources.ImageButtonHover);
            this.levelUpButton.setButtonText("Level Up");
        }

        this.initMercenaryDialog = function() {
            this.mercenaryArea = dialog.create("mercenaryDialog");
            this.mercenaryArea.canScroll = true;
            this.mercenaryArea.init();
            this.mercenaryArea.setHeaderText("Mercenaries");

            // Create the control for each mercenary...
            for(key in data.Mercenaries) {
                var control = mercenaryControl.create("Mercenary_" + key);
                control.init(this.mercenaryArea.getContentArea());
                control.setMercenaryName(data.Mercenaries[key].name);
                control.setMercenaryImage(static.imageRoot + data.Mercenaries[key].icon);
                control.setMercenaryCost(0);
                control.setMercenaryCount(0);
                this.mercenaryControls[key] = control;
            }
        }

        // ---------------------------------------------------------------------------
        // update functions
        // ---------------------------------------------------------------------------
        this.updatePlayerUI = function(gameTime) {
            // No reason to hide them atm
            this.playerHealthBar.show();
            this.experienceBar.show();

            this.playerArea.setHeaderText(game.player.name);

            var hp = game.player.getStat(data.StatDefinition.hp.id);
            var hpMax = game.player.getStat(data.StatDefinition.hpMax.id);
            this.playerHealthBar.setProgress(hp, hpMax);
            this.playerHealthBar.setProgressText("{0} / {1}".format(hp, hpMax));

            var mp = game.player.getStat(data.StatDefinition.mp.id);
            var mpMax = game.player.getStat(data.StatDefinition.mpMax.id);
            this.playerManaBar.setProgress(mp, mpMax);
            this.playerManaBar.setProgressText("{0} / {1}".format(mp, mpMax));

            var requiredXP = game.player.experienceRequired;
            var xp = game.player.getStat(data.StatDefinition.xp.id);
            this.experienceBar.setProgress(xp, requiredXP);
            this.experienceBar.setProgressText("{0} / {1}".format(xp, requiredXP));
        }

        this.updateSystemMenu = function(gameTime) {
            $("#inventoryWindow").hide();
            $("#characterWindow").hide();
            $("#mercenariesWindow").hide();
            $("#upgradesWindow").hide();
            $("#questsWindow").hide();
            $("#optionsWindow").hide();
            $("#statsWindow").hide();
            $("#updatesWindow").hide();

            if(this.inventoryWindowShown === true) {
                $("#inventoryWindow").show();
            }

            if(this.characterWindowShown === true) {
                $("#characterWindow").show();
            }

            if(this.mercenaryWindowShown === true) {
                $("#mercenariesWindow").show();
            }

            if(this.upgradeWindowShown === true) {
                $("#upgradesWindow").show();
            }

            if(this.questWindowShown === true) {
                $("#questsWindow").show();
            }

            if(this.optionsWindowShown === true) {
                $("#optionsWindow").show();
            }

            if(this.statsWindowShown === true) {
                $("#statsWindow").show();
            }

            if(this.updatesWindowShown === true) {
                $("#updatesWindow").show();
            }
        }

        this.updateBattleUI = function(gameTime) {

            // First we just hide everything, makes it easier
            this.resurrectionBar.hide();
            this.monsterName.hide();
            this.monsterHealthBar.hide();
            this.enterBattleButton.hide();
            this.leaveBattleButton.hide();
            this.battleLevelDownButton.hide();
            this.battleLevelUpButton.hide();
            this.levelUpButton.hide();
            this.attackButton.hide();

            // Check the alive state
            var isAlive = game.player.alive === true;
            if(isAlive === false) {
                this.resurrectionBar.show();

                var remainingResurrectionTime = game.player.getResurrectionTimeRemaining(gameTime);
                var totalResurrectionTime = game.player.getResurrectionTime();
                var progress = totalResurrectionTime - remainingResurrectionTime;
                this.resurrectionBar.setProgress(progress, totalResurrectionTime);
                this.resurrectionBar.setProgressText("Resurrecting in " + coreUtils.getDurationDisplay(remainingResurrectionTime));
            }

            if(isAlive === true && game.player.getSkillPoints() > 0) {
                this.levelUpButton.show();
            }

            var currentLevel = game.getBattleLevel();
            this.enterBattleButton.setButtonText("Enter Level {0}".format(currentLevel));
            this.leaveBattleButton.setButtonText("Leave Level {0}".format(currentLevel));

            if(game.inBattle === true) {
                this.monsterName.show();
                this.monsterHealthBar.show();
                this.leaveBattleButton.show();
                this.attackButton.show();

                var monsterRarityColor = this.getMonsterRarityColor(game.monster.rarity);
                this.monsterName.setText(game.monster.name);
                this.monsterName.getMainElement().css({ 'color': monsterRarityColor });

                // Update the monster health bar
                this.monsterHealthBar.setProgress(game.monster.getStat(data.StatDefinition.hp.id), game.monster.maxHealth);
                this.monsterHealthBar.setProgressText("{0} / {1}".format(game.monster.getStat(data.StatDefinition.hp.id), game.monster.maxHealth));

            } else if(isAlive === true) {
                this.enterBattleButton.show();
                this.battleLevelDownButton.show();
                this.battleLevelUpButton.show();
            }
        }

        this.updateMercenaryDialog = function(gameTime) {
            //Todo
        }


        // ---------------------------------------------------------------------------
        // utility functions
        // ---------------------------------------------------------------------------
        this.getMonsterRarityColor = function(rarity) {
            switch (rarity) {
                case static.MonsterRarity.COMMON:
                    return '#ffffff';
                    break;
                case static.MonsterRarity.RARE:
                    return '#00fff0';
                    break;
                case static.MonsterRarity.ELITE:
                    return '#ffd800';
                    break;
                case static.MonsterRarity.BOSS:
                    return '#ff0000';
                    break;
            }
        }

        this.toggleInventoryWindow = function() {
            this.inventoryWindowShown = !this.inventoryWindowShown;
        }

        this.toggleCharacterWindow = function() {
            this.characterWindowShown = !this.characterWindowShown;
        }

        this.toggleMercenaryWindow = function() {
            this.mercenaryWindowShown = !this.mercenaryWindowShown;
            this.mercenaryArea.toggle();
        }

        this.toggleUpgradeWindow = function() {
            this.upgradeWindowShown = !this.upgradeWindowShown;
        }

        this.toggleQuestWindow = function() {
            this.questWindowShown = !this.questWindowShown;
        }

        this.toggleUpdatesWindow = function() {
            this.updatesWindowShown = !this.updatesWindowShown;
        }

        this.toggleOptionsWindow = function() {
            this.optionsWindowShown = !this.optionsWindowShown;
        }

        this.toggleStatsWindow = function() {
            this.statsWindowShown = !this.statsWindowShown;
        }



        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /// Unchecked code below
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        this.itemTooltipButtonHovered = false;
        this.sellButtonActive = false;

        this.slotTypeSelected;
        this.slotNumberSelected;


        this.questsButtonGlowing = false;

        this.fullReset = false;

        this.WindowOrder = new Array("characterWindow", "mercenariesWindow", "upgradesWindow", "questsWindow", "inventoryWindow");
        this.WindowIds = new Array("characterWindow", "mercenariesWindow", "upgradesWindow", "questsWindow", "inventoryWindow");

        this.displayAlert = function displayAlert(text) {
            $("#battleLevelText").stop(true);
            var battleLevelText = document.getElementById("battleLevelText");
            battleLevelText.style.opacity = '1';
            battleLevelText.style.top = '600px';
            battleLevelText.innerHTML = text;
            $("#battleLevelText").animate({top: '-=50px', opacity: '0'}, 1000);
        }

        this.clickEventButton = function(obj, id) {
            eventManager.startEvent(obj, id);
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

        this.upgradeButtonMouseDown = function(buttonId) {
            var upgradeId = upgradeManager.purchaseButtonUpgradeIds[buttonId - 1];
            var upgrade = upgradeManager.upgrades[upgradeId];
            $("#upgradePurchaseButton" + buttonId).css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px');
            upgradeManager.purchaseUpgrade(buttonId - 1);
        }

        this.upgradeButtonMouseOut = function(buttonId) {
            var upgradeId = upgradeManager.purchaseButtonUpgradeIds[buttonId - 1];
            var upgrade = upgradeManager.upgrades[upgradeId];
            $("#upgradePurchaseButton" + buttonId).css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase)+' 0 0');
            $("#otherTooltip").hide();
        }

        /*this.attackButtonHover = function(obj) {
            // Display a different tooltip depending on the player's attack
            switch (game.player.attackType) {
                case static.AttackType.BASIC_ATTACK:
                    $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 150px 0');
                    $("#otherTooltipTitle").html('Attack');
                    $("#otherTooltipCooldown").html('');
                    $("#otherTooltipLevel").html('');
                    $("#otherTooltipDescription").html('A basic attack.');
                    $("#otherTooltip").show();
                    break;
                case static.AttackType.POWER_STRIKE:
                    $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 150px 100px');
                    $("#otherTooltipTitle").html('Power Strike');
                    $("#otherTooltipCooldown").html('');
                    $("#otherTooltipLevel").html('');
                    $("#otherTooltipDescription").html('Strike your target with a powerful blow, dealing 1.5x normal damage.');
                    $("#otherTooltip").show();
                    break;
                case static.AttackType.DOUBLE_STRIKE:
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
                case static.AttackType.BASIC_ATTACK:
                    $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 0 0');
                    break;
                case static.AttackType.POWER_STRIKE:
                    $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 0 100px');
                    break;
                case static.AttackType.DOUBLE_STRIKE:
                    $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 0 50px');
                    break;
            }
            $("#otherTooltip").hide();
        }

        this.attackButtonClick = function(obj) {
            switch (game.player.attackType) {
                case static.AttackType.BASIC_ATTACK:
                    $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 100px 0');
                    break;
                case static.AttackType.POWER_STRIKE:
                    $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 100px 100px');
                    break;
                case static.AttackType.DOUBLE_STRIKE:
                    $("#attackButton").css('background', 'url("' + resources.ImageAttackButtons + '") 100px 50px');
                    break;
            }
            if (game.inBattle == true) {
                game.attack();
            }
        }*/

        this.stoneButtonHover = function(obj) {
            $(this).css('background', 'url("' + resources.ImageStoneButtons + '") 0 75px');
        }

        this.stoneButtonReset = function(obj) {
            $(this).css('background', 'url("' + resources.ImageStoneButtons + '") 0 0px');
        }

        this.equipItemHover = function(obj) {
            var index = obj.data.index;
            var item = game.equipment.slots[index - 1];
            // If there is an item in this slot then show the item tooltip
            if (item != null) {
                var rect = obj.currentTarget.getBoundingClientRect();
                tooltipManager.displayItemTooltip(item, null, null, rect.left, rect.top, false);
            }
        }

        this.equipItemReset = function(obj) {
            var index = obj.data.index;
            $("#itemTooltip").hide();
            $(".equipItem" + index).css('z-index', '1');
        }

        this.equipItemClick = function(obj) {
            var index = obj.data.index;
            // If the left mouse button was clicked
            if (event.which == 1) {
                // Store the information about this item
                slotTypeSelected = static.SLOT_TYPE.EQUIP;
                slotNumberSelected = index;

                var rect = $(".equipItem" + index).position();
                $(".equipItem" + index).css('z-index', '200');
            }
        }

        this.inventoryItemHover = function(obj) {
            var index = obj.data.index;
            var item = game.inventory.slots[index - 1];
            // If there is an item in this slot then show the item tooltip
            if (item != null) {
                // If there is already an item equipped in the slot this item would go into, then get that item
                // Get the slot Id if there is an item equipped
                var equippedSlot = -1
                var twoTrinkets = false;
                switch (item.type) {
                    case static.ItemType.HELM:
                        if (game.equipment.helm() != null) {
                            equippedSlot = 0
                        }
                        break;
                    case static.ItemType.SHOULDERS:
                        if (game.equipment.shoulders() != null) {
                            equippedSlot = 1;
                        }
                        break;
                    case static.ItemType.CHEST:
                        if (game.equipment.chest() != null) {
                            equippedSlot = 2;
                        }
                        break;
                    case static.ItemType.LEGS:
                        if (game.equipment.legs() != null) {
                            equippedSlot = 3;
                        }
                        break;
                    case static.ItemType.WEAPON:
                        if (game.equipment.weapon() != null) {
                            equippedSlot = 4;
                        }
                        break;
                    case static.ItemType.GLOVES:
                        if (game.equipment.gloves() != null) {
                            equippedSlot = 5;
                        }
                        break;
                    case static.ItemType.BOOTS:
                        if (game.equipment.boots() != null) {
                            equippedSlot = 6;
                        }
                        break;
                    case static.ItemType.TRINKET:
                        if (game.equipment.trinket1() != null || game.equipment.trinket2() != null) {
                            equippedSlot = 7;
                            // Check to see if there are two trinkets equipped, then we will need to show two compare tooltips
                            if (game.equipment.trinket1() != null && game.equipment.trinket2() != null) {
                                twoTrinkets = true;
                            }
                        }
                        break;
                    case static.ItemType.OFF_HAND:
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

        this.inventoryItemReset = function(obj) {
            var index = obj.data.index;

            $("#itemTooltip").hide();
            $("#itemCompareTooltip").hide();
            $("#itemCompareTooltip2").hide();
            $("#inventoryItem" + index).css('z-index', '1');
        }

        this.inventoryItemClick = function(obj) {
            var index = obj.data.index;
            // If the shift key is down then sell this item
            if (obj.shiftKey == 1) {
                game.inventory.sellItem(index - 1);
            }
            // If the left mouse button was clicked
            else if (obj.which == 1) {
                // Store the information about this item
                slotTypeSelected = static.SLOT_TYPE.INVENTORY;
                slotNumberSelected = index;

                var rect = $("#inventoryItem" + index).position();
                $("#inventoryItem" + index).css('z-index', '200');
            }
        }

        this.sellAllButtonClick = function() {
            game.inventory.sellAll();
        }

        this.equipInventoryItem = function(obj) {
            var index = obj.data.self;

            // If the alt key was pressed try to equip this item as a second trinket
            if (obj.altKey == 1) {
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

        // Triggered when the Level Up button is clicked
        this.displayLevelUpWindow = function displayLevelUpWindow() {
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
                    case static.StatUpgradeType.DAMAGE:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Damage";
                        break;
                    case static.StatUpgradeType.STRENGTH:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Strength";
                        break;
                    case static.StatUpgradeType.AGILITY:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Agility";
                        break;
                    case static.StatUpgradeType.STAMINA:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Stamina";
                        break;
                    case static.StatUpgradeType.ARMOUR:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Armour";
                        break;
                    case static.StatUpgradeType.HP5:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + " Hp5";
                        break;
                    case static.StatUpgradeType.CRIT_DAMAGE:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Crit Damage";
                        break;
                    case static.StatUpgradeType.ITEM_RARITY:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Item Rarity";
                        break;
                    case static.StatUpgradeType.GOLD_GAIN:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Gold Gain";
                        break;
                    case static.StatUpgradeType.EXPERIENCE_GAIN:
                        document.getElementById("statUpgradeName1").innerHTML = "+" + upgrades[0].amount + "% Experience Gain";
                        break;
                }

                switch (upgrades[1].type) {
                    case static.StatUpgradeType.DAMAGE:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Damage";
                        break;
                    case static.StatUpgradeType.STRENGTH:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Strength";
                        break;
                    case static.StatUpgradeType.AGILITY:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Agility";
                        break;
                    case static.StatUpgradeType.STAMINA:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Stamina";
                        break;
                    case static.StatUpgradeType.ARMOUR:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Armour";
                        break;
                    case static.StatUpgradeType.HP5:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + " Hp5";
                        break;
                    case static.StatUpgradeType.CRIT_DAMAGE:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Crit Damage";
                        break;
                    case static.StatUpgradeType.ITEM_RARITY:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Item Rarity";
                        break;
                    case static.StatUpgradeType.GOLD_GAIN:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Gold Gain";
                        break;
                    case static.StatUpgradeType.EXPERIENCE_GAIN:
                        document.getElementById("statUpgradeName2").innerHTML = "+" + upgrades[1].amount + "% Experience Gain";
                        break;
                }

                switch (upgrades[2].type) {
                    case static.StatUpgradeType.DAMAGE:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Damage";
                        break;
                    case static.StatUpgradeType.STRENGTH:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Strength";
                        break;
                    case static.StatUpgradeType.AGILITY:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Agility";
                        break;
                    case static.StatUpgradeType.STAMINA:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Stamina";
                        break;
                    case static.StatUpgradeType.ARMOUR:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Armour";
                        break;
                    case static.StatUpgradeType.HP5:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + " Hp5";
                        break;
                    case static.StatUpgradeType.CRIT_DAMAGE:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Crit Damage";
                        break;
                    case static.StatUpgradeType.ITEM_RARITY:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Item Rarity";
                        break;
                    case static.StatUpgradeType.GOLD_GAIN:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Gold Gain";
                        break;
                    case static.StatUpgradeType.EXPERIENCE_GAIN:
                        document.getElementById("statUpgradeName3").innerHTML = "+" + upgrades[2].amount + "% Experience Gain";
                        break;
                }
            }
        }

        this.questNameClick = function(id) {
            questManager.selectedQuest = id;
        }

        this.closeButtonHover = function(obj) {
            obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageCloseButton) + ' 14px 0';
        }

        this.closeButtonClick = function(obj) {
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
                case "mercenariesWindowCloseButton":
                    $("#mercenariesWindow").hide();
                    this.mercenariesWindowShown = false;
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

        this.closeButtonReset = function(obj) {
            obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageCloseButton) + ' 0 0';
        }

        this.updateWindowDepths = function(obj) {
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

        this.footmanBuyButtonMouseOver = function(obj) {
            $("#footmanBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 92px');

            $("#otherTooltipTitle").html('Footman');
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html('GPS: ' + mercenaryManager.getMercenaryBaseGps(static.MercenaryType.FOOTMAN));
            $("#otherTooltip").show();

            // Set the item tooltip's location
            var rect = $(this)[0].getBoundingClientRect();
            $("#otherTooltip").css('top', rect.top - 70);
            var leftReduction = document.getElementById("otherTooltip").scrollWidth;
            $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
        }

        this.footmanBuyButtonMouseDown = function(obj) {
            $("#footmanBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px');
            mercenaryManager.purchaseMercenary(static.MercenaryType.FOOTMAN);
        }

        this.footmanBuyButtonMouseOut = function(obj) {
            $("#footmanBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 0');
            $("#otherTooltip").hide();
        }

        this.clericBuyButtonMouseOver = function(obj) {
            $("#clericBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 92px');

            $("#otherTooltipTitle").html('Cleric');
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html('GPS: ' + mercenaryManager.getMercenaryBaseGps(static.MercenaryType.CLERIC).formatMoney() +
            '<br>Clerics increase your hp5 by ' + mercenaryManager.getClericHp5PercentBonus() + '%.');
            $("#otherTooltip").show();

            // Set the item tooltip's location
            var rect = $(this)[0].getBoundingClientRect();
            $("#otherTooltip").css('top', rect.top - 70);
            var leftReduction = document.getElementById("otherTooltip").scrollWidth;
            $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
        }

        this.clericBuyButtonMouseDown = function(obj) {
            $("#clericBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px');
            mercenaryManager.purchaseMercenary(static.MercenaryType.CLERIC);
        }

        this.clericBuyButtonMouseOut = function(obj) {
            $("#clericBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 0');
            $("#otherTooltip").hide();
        }

        this.commanderBuyButtonMouseOver = function(obj) {
            $("#commanderBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 92px');

            $("#otherTooltipTitle").html('Commander');
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html('GPS: ' + mercenaryManager.getMercenaryBaseGps(static.MercenaryType.COMMANDER).formatMoney() +
            '<br>Commanders increase your health by ' + mercenaryManager.getCommanderHealthPercentBonus() + '%.');
            $("#otherTooltip").show();

            // Set the item tooltip's location
            var rect = $(this)[0].getBoundingClientRect();
            $("#otherTooltip").css('top', rect.top - 70);
            var leftReduction = document.getElementById("otherTooltip").scrollWidth;
            $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
        }

        this.commanderBuyButtonMouseDown = function(obj) {
            $("#commanderBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px');
            mercenaryManager.purchaseMercenary(static.MercenaryType.COMMANDER);
        }

        this.commanderBuyButtonMouseOut = function(obj) {
            $("#commanderBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 0');
            $("#otherTooltip").hide();
        }

        this.mageBuyButtonMouseOver = function(obj) {
            $("#mageBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 92px');

            $("#otherTooltipTitle").html('Mage');
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html('GPS: ' + mercenaryManager.getMercenaryBaseGps(static.MercenaryType.MAGE).formatMoney() +
            '<br>Mages increase your damage by ' + mercenaryManager.getMageDamagePercentBonus() + '%.');
            $("#otherTooltip").show();

            // Set the item tooltip's location
            var rect = $(this)[0].getBoundingClientRect();
            $("#otherTooltip").css('top', rect.top - 70);
            var leftReduction = document.getElementById("otherTooltip").scrollWidth;
            $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
        }

        this.mageBuyButtonMouseDown = function(obj) {
            $("#mageBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px');
            mercenaryManager.purchaseMercenary(static.MercenaryType.MAGE);
        }

        this.mageBuyButtonMouseOut = function(obj) {
            $("#mageBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 0');
            $("#otherTooltip").hide();
        }

        this.assassinBuyButtonMouseOver = function(obj) {
            $("#assassinBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 92px');

            $("#otherTooltipTitle").html('Assassin');
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html('GPS: ' + mercenaryManager.getMercenaryBaseGps(static.MercenaryType.ASSASSIN).formatMoney() +
            '<br>Assassins increase your evasion by ' + mercenaryManager.getAssassinEvasionPercentBonus() + '%.');
            $("#otherTooltip").show();

            // Set the item tooltip's location
            var rect = $(this)[0].getBoundingClientRect();
            $("#otherTooltip").css('top', rect.top - 70);
            var leftReduction = document.getElementById("otherTooltip").scrollWidth;
            $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
        }

        this.assassinBuyButtonMouseDown = function(obj) {
            $("#assassinBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px');
            mercenaryManager.purchaseMercenary(static.MercenaryType.ASSASSIN);
        }

        this.assassinBuyButtonMouseOut = function(obj) {
            $("#assassinBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 0');
            $("#otherTooltip").hide();
        }

        this.warlockBuyButtonMouseOver = function(obj) {
            $("#warlockBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 92px');

            $("#otherTooltipTitle").html('Warlock');
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html('GPS: ' + mercenaryManager.getMercenaryBaseGps(static.MercenaryType.WARLOCK).formatMoney() +
            '<br>Warlocks increase your critical strike damage by ' + mercenaryManager.getWarlockCritDamageBonus() + '%.');
            $("#otherTooltip").show();

            // Set the item tooltip's location
            var rect = $(this)[0].getBoundingClientRect();
            $("#otherTooltip").css('top', rect.top - 70);
            var leftReduction = document.getElementById("otherTooltip").scrollWidth;
            $("#otherTooltip").css('left', (rect.left - leftReduction - 40));
        }

        this.warlockBuyButtonMouseDown = function(obj) {
            $("#warlockBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px');
            mercenaryManager.purchaseMercenary(static.MercenaryType.WARLOCK);
        }

        this.warlockBuyButtonMouseOut = function(obj) {
            $("#warlockBuyButton").css('background', coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 0');
            $("#otherTooltip").hide();
        }

        this.statUpgradeButtonHover = function(obj) {
            obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 92px';
            var index = obj.data.index;

            // Show a tooltip describing what the hovered stat does if neccessary
            var upgrade = statUpgradeManager.upgrades[0][index - 1];

            switch (upgrade.type) {
                case static.StatUpgradeType.DAMAGE:
                    $("#otherTooltipTitle").html("Damage");
                    $("#otherTooltipDescription").html("Increases the damage you deal with basic attacks.");
                    break;
                case static.StatUpgradeType.STRENGTH:
                    $("#otherTooltipTitle").html("Strength");
                    $("#otherTooltipDescription").html("Increases your Health by 5 and Damage by 1%.");
                    break;
                case static.StatUpgradeType.AGILITY:
                    $("#otherTooltipTitle").html("Agility");
                    $("#otherTooltipDescription").html("Increases your Crit Damage by 0.2% and Evasion by 1%.");
                    break;
                case static.StatUpgradeType.STAMINA:
                    $("#otherTooltipTitle").html("Stamina");
                    $("#otherTooltipDescription").html("Increases your Hp5 by 1 and your Armour by 1%.");
                    break;
                case static.StatUpgradeType.ARMOUR:
                    $("#otherTooltipTitle").html("Armour");
                    $("#otherTooltipDescription").html("Reduces the damage you take from monsters.");
                    break;
                case static.StatUpgradeType.EVASION:
                    $("#otherTooltipTitle").html("Evasion");
                    $("#otherTooltipDescription").html("Increases your chance to dodge a monster's attack.");
                    break;
                case static.StatUpgradeType.HP5:
                    $("#otherTooltipTitle").html("Hp5");
                    $("#otherTooltipDescription").html("The amount of health you regenerate over 5 seconds.");
                    break;
                case static.StatUpgradeType.CRIT_DAMAGE:
                    $("#otherTooltipTitle").html("Crit Damage");
                    $("#otherTooltipDescription").html("The amount of damage your critical strikes will cause");
                    break;
                case static.StatUpgradeType.ITEM_RARITY:
                    $("#otherTooltipTitle").html("Item Rarity");
                    $("#otherTooltipDescription").html("Increases the chance that rarer items will drop from monsters");
                    break;
                case static.StatUpgradeType.EXPERIENCE_GAIN:
                    $("#otherTooltipTitle").html("Experience Gain");
                    $("#otherTooltipDescription").html("Increases the experience earned from killing monsters");
                    break;
                case static.StatUpgradeType.GOLD_GAIN:
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

        this.statUpgradeButtonClick = function(obj) {
            var index = obj.data.index;
            obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px';
            $("#statUpgradesWindow").hide();

            // Upgrade a player's stat depending on which button was clicked
            var upgrade = statUpgradeManager.upgrades[0][index - 1];
            switch (upgrade.type) {
                case static.StatUpgradeType.DAMAGE:
                    game.player.chosenLevelUpBonuses.damageBonus += upgrade.amount;
                    break;
                case static.StatUpgradeType.STRENGTH:
                    game.player.chosenLevelUpBonuses.strength += upgrade.amount;
                    break;
                case static.StatUpgradeType.AGILITY:
                    game.player.chosenLevelUpBonuses.agility += upgrade.amount;
                    break;
                case static.StatUpgradeType.STAMINA:
                    game.player.chosenLevelUpBonuses.stamina += upgrade.amount;
                    break;
                case static.StatUpgradeType.ARMOUR:
                    game.player.chosenLevelUpBonuses.armour += upgrade.amount;
                    break;
                case static.StatUpgradeType.EVASION:
                    game.player.chosenLevelUpBonuses.evasion += upgrade.amount;
                    break;
                case static.StatUpgradeType.HP5:
                    game.player.chosenLevelUpBonuses.hp5 += upgrade.amount;
                    break;
                case static.StatUpgradeType.CRIT_DAMAGE:
                    game.player.chosenLevelUpBonuses.critDamage += upgrade.amount;
                    break;
                case static.StatUpgradeType.ITEM_RARITY:
                    game.player.chosenLevelUpBonuses.itemRarity += upgrade.amount;
                    break;
                case static.StatUpgradeType.EXPERIENCE_GAIN:
                    game.player.chosenLevelUpBonuses.experienceGain += upgrade.amount;
                    break;
                case static.StatUpgradeType.GOLD_GAIN:
                    game.player.chosenLevelUpBonuses.goldGain += upgrade.amount;
                    break;
            }

            // Remove the upgrade
            statUpgradeManager.upgrades.splice(0, 1);

            // Alter the player's skill points
            game.player.modifySkillPoints(-1);
            game.player.skillPointsSpent++;
        }

        this.statUpgradeButtonReset = function(obj) {
            obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 0';
            $("#otherTooltip").hide();
        }

        this.rendUpgradeButtonHover = function(obj) {
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

        this.rendUpgradeButtonClick = function(obj) {
            obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px';
            $("#abilityUpgradesWindow").hide();
            game.player.increaseAbilityPower(static.AbilityName.REND);
        }

        this.rendUpgradeButtonReset = function(obj) {
            obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 0';
            $("#abilityUpgradeTooltip").hide();
        }

        this.rejuvenatingStrikesUpgradeButtonHover = function(obj) {
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

        this.rejuvenatingStrikesUpgradeButtonClick = function(obj) {
            obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px';
            $("#abilityUpgradesWindow").hide();
            game.player.increaseAbilityPower(static.AbilityName.REJUVENATING_STRIKES);
        }

        this.rejuvenatingStrikesUpgradeButtonReset = function(obj) {
            obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 0';
            $("#abilityUpgradeTooltip").hide();
        }

        this.iceBladeUpgradeButtonHover = function(obj) {
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

        this.iceBladeUpgradeButtonClick = function(obj) {
            obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px';
            $("#abilityUpgradesWindow").hide();
            game.player.increaseAbilityPower(static.AbilityName.ICE_BLADE);
        }

        this.iceBladeUpgradeButtonReset = function(obj) {
            obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 0';
            $("#abilityUpgradeTooltip").hide();
        }

        this.fireBladeUpgradeButtonHover = function(obj) {
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

        this.fireBladeUpgradeButtonClick = function(obj) {
            obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 46px';
            $("#abilityUpgradesWindow").hide();
            game.player.increaseAbilityPower(static.AbilityName.FIRE_BLADE);
        }

        this.fireBladeUpgradeButtonReset = function(obj) {
            obj.currentTarget.style.background = coreUtils.getImageUrl(resources.ImageBuyButtonBase) + ' 0 0';
            $("#abilityUpgradeTooltip").hide();
        }

        this.expBarAreaMouseOver = function() {
            $("#expBarText").show();
        }

        this.expBarAreaMouseOut = function() {
            if (!game.options.alwaysDisplayExp) {
                $("#expBarText").hide();
            }
        }

        this.bleedingIconMouseOver = function(obj) {
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

        this.bleedingIconMouseOut = function() {
            $("#otherTooltip").hide();
        }

        this.burningIconMouseOver = function(obj) {
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

        this.burningIconMouseOut = function() {
            $("#otherTooltip").hide();
        }

        this.chilledIconMouseOver = function(obj) {
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

        this.chilledIconMouseOut = function() {
            $("#otherTooltip").hide();
        }

        this.damageBonusStatHover = function(obj) {
            $("#otherTooltipTitle").html("Damage Bonus");
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html("Increases the damage you deal with basic attacks.");
            $("#otherTooltip").show();
            obj.data.self.setTooltipLocation(obj);
        }

        this.hp5StatHover = function(obj) {
            $("#otherTooltipTitle").html("Hp5");
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html("The amount of health you regenerate over 5 seconds.");
            $("#otherTooltip").show();
            obj.data.self.setTooltipLocation(obj);
        }

        this.armourStatHover = function(obj) {
            $("#otherTooltipTitle").html("Armour");
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html("Reduces the damage you take from monsters.");
            $("#otherTooltip").show();
            obj.data.self.setTooltipLocation(obj);
        }

        this.evasionStatHover = function(obj) {
            $("#otherTooltipTitle").html("Evasion");
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html("Increases your chance to dodge a monster's attack.");
            $("#otherTooltip").show();
            obj.data.self.setTooltipLocation(obj);
        }

        this.strengthStatHover = function(obj) {
            $("#otherTooltipTitle").html("Strength");
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html("Increases your Health by 5 and Damage by 1%.");
            $("#otherTooltip").show();
            obj.data.self.setTooltipLocation(obj);
        }

        this.agilityStatHover = function(obj) {
            $("#otherTooltipTitle").html("Agility");
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html("Increases your Crit Damage by 0.2% and Evasion by 1%.");
            $("#otherTooltip").show();
            obj.data.self.setTooltipLocation(obj);
        }

        this.staminaStatHover = function(obj) {
            $("#otherTooltipTitle").html("Stamina");
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html("Increases your Hp5 by 1 and Armour by 1%.");
            $("#otherTooltip").show();
            obj.data.self.setTooltipLocation(obj);
        }

        this.critChanceStatHover = function(obj) {
            $("#otherTooltipTitle").html("Crit Chance");
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html("Increases your chance to get a critical strike.");
            $("#otherTooltip").show();
            obj.data.self.setTooltipLocation(obj);
        }

        this.critDamageStatHover = function(obj) {
            $("#otherTooltipTitle").html("Crit Damage");
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html("The amount of damage your critical strikes will cause.");
            $("#otherTooltip").show();
            obj.data.self.setTooltipLocation(obj);
        }

        this.itemRarityStatHover = function(obj) {
            $("#otherTooltipTitle").html("Item Rarity");
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html("Increases the chance that rarer items will drop from monsters.");
            $("#otherTooltip").show();
            obj.data.self.setTooltipLocation(obj);
        }

        this.goldGainStatHover = function(obj) {
            $("#otherTooltipTitle").html("Gold Gain");
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html("Increases the gold gained from monsters and mercenaries.");
            $("#otherTooltip").show();
            obj.data.self.setTooltipLocation(obj);
        }

        this.expGainStatHover = function(obj) {
            $("#otherTooltipTitle").html("Experience Gain");
            $("#otherTooltipCooldown").html('');
            $("#otherTooltipLevel").html('');
            $("#otherTooltipDescription").html("Increases the experience earned from killing monsters.");
            $("#otherTooltip").show();
            obj.data.self.setTooltipLocation(obj);
        }

        this.setTooltipLocation = function(obj) {
            var rect = obj.currentTarget.getBoundingClientRect();
            $("#otherTooltip").css('top', rect.top + 10);
            var leftReduction = document.getElementById("otherTooltip").scrollWidth;
            $("#otherTooltip").css('left', (rect.left - leftReduction - 10));
        }

        this.statTooltipReset = function() {
            $("#otherTooltip").hide();
        }

        this.updatesWindowButtonClick = function(obj) {
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

        this.statsWindowButtonClick = function(obj) {
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

        this.optionsWindowButtonClick = function(obj) {
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

        this.resetButtonClick = function() {
            fullReset = false;
            var powerShardsAvailable = game.calculatePowerShardReward();
            document.getElementById('resetDescription').innerHTML = 'This will erase all progress and not be recoverable. Are you sure you want to reset?';
            $("#resetConfirmWindowPowerShard").show();
            document.getElementById('powerShardsDescription').innerHTML = "You will earn " + powerShardsAvailable + " Power Shards from resetting.";
            $("#powerShardsDescription").show();
            $("#resetConfirmWindow").show();
        }

        this.resetConfirmWindowYesButtonClick = function() {
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

        this.resetConfirmWindowNoButtonClick = function() {
            $("#resetConfirmWindow").hide();
        }

        this.fullResetButtonClick = function() {
            fullReset = true;
            document.getElementById('resetDescription').innerHTML = 'This will erase all progress and not be recoverable, including Power Shards. Are you sure you want to reset?';
            $("#resetConfirmWindowPowerShard").hide();
            $("#powerShardsDescription").hide();

            $("#resetConfirmWindow").show();
        }

        this.optionsWindowExitButtonClick = function() {
            $("#optionsWindow").hide();
        }

        this.setupStatUpgradeButton = function(name, index) {
            $("#" + name).mouseover({self: this, index: index}, this.statUpgradeButtonHover);
            $("#" + name).mouseup({self: this, index: index}, this.statUpgradeButtonHover);
            $("#" + name).mousedown({self: this, index: index}, this.statUpgradeButtonClick);
            $("#" + name).mouseout({self: this}, this.statUpgradeButtonReset);
        }

        this.setupCloseButton = function(name) {
            $("#" + name).mouseover({self: this}, this.closeButtonHover);
            $("#" + name).mouseup({self: this}, this.closeButtonHover);
            $("#" + name).mousedown({self: this}, this.closeButtonClick);
            $("#" + name).mouseout({self: this}, this.closeButtonReset);
        }

        this.setupItemSlots = function(index) {
            $("#equipItem" + index).mouseover({self: this, index: index}, this.equipItemHover);
            $("#equipItem" + index).mouseout({self: this, index: index}, this.equipItemReset);
            $("#equipItem" + index).mousedown({self: this, index: index}, this.equipItemClick);

            // TODO:
            //$("#equipItem" + index).rightContext({self: this, index: index}, this.equipItemRightClick);
        }

        this.setupInventorySlots = function(index) {
            $("#inventoryItem" + index).mouseover({self: this, index: index}, this.inventoryItemHover);
            $("#inventoryItem" + index).mouseout({self: this, index: index}, this.inventoryItemReset);
            $("#inventoryItem" + index).mousedown({self: this, index: index}, this.inventoryItemClick);

            // TODO
            //$("#inventoryItem" + index).rightContext({self: this, index: index}, this.equipInventoryItem)
        }

        this.glowQuestsButton = function() {
            this.questsButtonGlowing = true;
            $("#questsWindowButtonGlow").animate({opacity: '+=0.5'}, 400);
            $("#questsWindowButtonGlow").animate({opacity: '-=0.5'}, 400, function () {
                include('UserInterface').glowQuestsButton();
            });
        }

        this.setupWindowState = function() {
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
            $('#statArmour').mouseover({self: this}, this.armourStatHover );
            $('#statArmour').mouseout({self: this}, this.statTooltipReset );
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

        this.onItemDragStop = function (event, ui) {
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

        this.onInventoryDragStop = function (event, ui) {
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
    }

    return new UserInterface();
});