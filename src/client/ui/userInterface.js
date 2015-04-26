declare('UserInterface', function () {
    include('Component');
    include('Save');
    include('SaveKeys');
    include('GameData');
    include('CoreUtils');
    include('InterfaceState');

    // UI Components
    include('SystemDialog');
    include('BattleDialog');
    include('PlayerDialog');
    include('CurrencyDialog');
    include('MercenaryDialog');
    include('InventoryDialog');
    include('QuestDialog');
    include('CharacterDialog');
    include('LogDialog');
    include('DebugDialog');
    include('TooltipControl');

    UserInterface.prototype = component.prototype();
    UserInterface.prototype.$super = parent;
    UserInterface.prototype.constructor = UserInterface;

    function UserInterface() {
        component.construct(this);

        this.id = "UserInterface";

        this.mousePosition = { x: 0, y: 0};

        this.playerDialog = undefined;
        this.currencyDialog = undefined;
        this.systemDialog = undefined;
        this.battleDialog = undefined;
        this.mercenaryDialog = undefined;
        this.inventoryDialog = undefined;
        this.questDialog = undefined;
        this.characterDialog = undefined;
        this.logDialog = undefined;
        this.debugDialog = undefined;

        this.characterArea = undefined;

        this.questArea = undefined;

        this.tooltip = undefined;
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

        if(Endless.isDebug === true) {
            this.debugDialog = debugDialog.create();
            this.debugDialog.init();
        }

        this.tooltip = tooltipControl.create();
        this.tooltip.init();

        $('#version').text("Version " + game[saveKeys.idnGameVersion]);
        $('#resetButton').click({game: game}, function(args) { args.data.game.reset(); });
        $('#saveButton').click({game: game}, function(args) { args.data.game.save(); });
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
        if(Endless.isDebug === true) {
            this.debugDialog.update(gameTime);
        }

        this.updateTooltip(gameTime);

        return true;
    }

    // ---------------------------------------------------------------------------
    // event handlers
    // ---------------------------------------------------------------------------
    UserInterface.prototype.handleMouseMove = function(obj) {
        var self = obj.data.self;

        // event.clientX and event.clientY contain the mouse position
        self.mousePosition.x = obj.clientX;
        self.mousePosition.y = obj.clientY;
    }

    // ---------------------------------------------------------------------------
    // init functions
    // ---------------------------------------------------------------------------

    // ---------------------------------------------------------------------------
    // update functions
    // ---------------------------------------------------------------------------
    UserInterface.prototype.updateTooltip = function(gameTime) {
        this.tooltip.setMousePosition(this.mousePosition);
        this.tooltip.update(gameTime);
    };

    UserInterface.prototype.updateDialogVisibility = function() {
        this.mercenaryDialog.setVisibility(interfaceState.mercenaryWindowShown);
        this.inventoryDialog.setVisibility(interfaceState.inventoryWindowShown);
        this.questDialog.setVisibility(interfaceState.questWindowShown);
        this.characterDialog.setVisibility(interfaceState.characterWindowShown);
        if(Endless.isDebug === true) {
            this.debugDialog.setVisibility(interfaceState.debugWindowShown);
        }
    };

    // ---------------------------------------------------------------------------
    // utility functions
    // ---------------------------------------------------------------------------

    return new UserInterface();
});
