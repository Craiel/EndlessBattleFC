declare('InterfaceState', function() {

    function InterfaceState() {
        this.characterWindowShown = false;
        this.mercenaryWindowShown = false;
        this.upgradeWindowShown = false;
        this.questWindowShown = false;
        this.inventoryWindowShown = false;
        this.updatesWindowShown = false;
        this.statsWindowShown = false;
        this.optionsWindowShown = false;
        this.debugWindowShown = false;
    }

    return new InterfaceState();
});