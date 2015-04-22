declare('Settings', function () {
    include('Component');
    include('Save');
    include('SaveKeys');
    include('Type');

    Settings.prototype = component.prototype();
    Settings.prototype.$super = parent;
    Settings.prototype.constructor = Settings;

    function Settings() {
        component.construct(this);

        this.id = "Settings";

        save.register(this, saveKeys.idnSettingsInternalInfoToConsole).asBool().withDefault(false);
        save.register(this, saveKeys.idnSettingsInternalWarningToConsole).asBool().withDefault(false);
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    Settings.prototype.componentInit = Settings.prototype.init;
    Settings.prototype.init = function(baseStats) {
        this.componentInit();

    };

    Settings.prototype.componentUpdate = Settings.prototype.update;
    Settings.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }


        return true;
    };

    // ---------------------------------------------------------------------------
    // setting functions
    // ---------------------------------------------------------------------------
    Settings.prototype.getInternalVerboseElements = function() {
        return this[saveKeys.idnSettingsInternalVerboseElements];
    };

    Settings.prototype.setInternalVerboseElements = function(value) {
        this[saveKeys.idnSettingsInternalVerboseElements] = value;
    };

    return new Settings();

});