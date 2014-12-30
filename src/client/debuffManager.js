declare("DebuffManager", function () {
    include('Component');

    DebuffManager.prototype = component.create();
    DebuffManager.prototype.$super = parent;
    DebuffManager.prototype.constructor = DebuffManager;

    function DebuffManager() {
        this.id = "DebuffManager";

        this.bleeding = false;
        this.bleedStacks = 0;
        this.bleedDamage = 0;
        this.bleedDuration = 0;
        this.bleedMaxDuration = 0;

        this.chilled = false;
        this.chillDuration = 0;
        this.chillMaxDuration = 0;

        this.burning = false;
        this.burningStacks = 0;
        this.burningDamage = 0;
        this.burningDuration = 0;
        this.burningMaxDuration = 0;
    }

    return {
        create: function() { return new DebuffManager(); }
    };
});