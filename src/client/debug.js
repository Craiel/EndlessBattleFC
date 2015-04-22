declare('Debug', function () {
    include('Component');
    include('Settings');

    Debug.prototype = component.prototype();
    Debug.prototype.$super = parent;
    Debug.prototype.constructor = Debug;

    function Debug() {
        component.construct(this);

        this.id = "Debug";

        this.infos = [];
        this.warnings = [];
        this.errors = [];
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    Debug.prototype.componentInit = Debug.prototype.init;
    Debug.prototype.init = function(baseStats) {
        this.componentInit();

    };

    Debug.prototype.componentUpdate = Debug.prototype.update;
    Debug.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }


        return true;
    };

    // ---------------------------------------------------------------------------
    // setting functions
    // ---------------------------------------------------------------------------


    return new Debug();

});