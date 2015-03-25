declare('TooltipControl', function() {
    include('Log');
    include('Assert');
    include('StaticData');
    include('Element');
    include('CoreUtils');
    include('Resources');

    ItemControl.prototype = element.prototype();
    ItemControl.prototype.$super = parent;
    ItemControl.prototype.constructor = ItemControl;

    function ItemControl() {
        element.construct(this);

        this.id = "tooltip";

        this.setTemplate("itemControl");
    }

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    ItemControl.prototype.elementInit = ItemControl.prototype.init;
    ItemControl.prototype.init = function(parent, attributes) {
        this.elementInit(parent, attributes);

    };

    ItemControl.prototype.elementUpdate = ItemControl.prototype.update;
    ItemControl.prototype.update = function(gameTime) {
        if(this.elementUpdate(gameTime) !== true) {
            return false;
        }

        return true;
    };

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------

    var surrogate = function(){};
    surrogate.prototype = ItemControl.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { ItemControl.call(self); },
        create: function() { return new ItemControl(); }
    };

});
