declare('EquipmentSlot', function () {

    EquipmentSlot.prototype = component.prototype();
    EquipmentSlot.prototype.$super = parent;
    EquipmentSlot.prototype.constructor = EquipmentSlot;

    function EquipmentSlot(id) {
        component.construct(this);

        this.id = "EquipmentSlot" + id;

        this.type = undefined;

    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    EquipmentSlot.prototype.componentInit = EquipmentSlot.prototype.init;
    EquipmentSlot.prototype.init = function(baseStats) {
        this.componentInit();

    }

    EquipmentSlot.prototype.componentUpdate = EquipmentSlot.prototype.update;
    EquipmentSlot.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }


        return true;
    }

    var surrogate = function(){};
    surrogate.prototype = EquipmentSlot.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { EquipmentSlot.call(self); },
        create: function(id) { return new EquipmentSlot(id); }
    }

});