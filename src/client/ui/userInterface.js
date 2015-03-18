declare('UserInterface', function () {
    include('Assert');
    include('Component');
    include('StaticData');
    include('TooltipManager');
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
        $("#characterWindow").hide();
        $("#mercenariesWindow").hide();
        $("#upgradesWindow").hide();
        $("#questsWindow").hide();
        $("#optionsWindow").hide();
        $("#statsWindow").hide();
        $("#updatesWindow").hide();

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

    }

    return new UserInterface();
});
