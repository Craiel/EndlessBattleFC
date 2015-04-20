declare('MercenaryControl', function() {
    include('Assert');
    include('Element');
    include('CoreUtils');
    include('Panel');
    include('CurrencyControl');
    include('StaticData');

    MercenaryControl.prototype = element.prototype();
    MercenaryControl.prototype.$super = parent;
    MercenaryControl.prototype.constructor = MercenaryControl;

    function MercenaryControl(id) {
        element.construct(this);

        this.id = id;

        this.setTemplate("mercenaryControl");

        this.backgroundPanel = undefined;
        this.imageElement = undefined;
        this.nameElement = undefined;
        this.currencyElement = undefined;
        this.countElement = undefined;

        this.mercenaryKey = undefined;
        this.callback = undefined;
        this.callbackArgument = undefined;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    MercenaryControl.prototype.elementInit = MercenaryControl.prototype.init;
    MercenaryControl.prototype.init = function(parent, attributes) {
        this.elementInit(parent, attributes);

        assert.isDefined(this.mercenaryKey, "Mercenary key must be set");
        assert.isDefined(this.callback, "Callback must be set");

        this.backgroundPanel = panel.create(this.id + "Background");
        this.backgroundPanel.init(this);
        this.backgroundPanel.addClass("mercenaryBackground");
        this.backgroundPanel.addClass("globalNoDrag");
        this.addManagedChild(this.backgroundPanel);

        this.imageElement = element.create(this.id + "Image");
        this.imageElement.init(this);
        this.addManagedChild(this.imageElement);

        this.nameElement = element.create(this.id + "Name");
        this.nameElement.init(this);
        this.addManagedChild(this.nameElement);

        this.currencyElement = currencyControl.create(this.id + "Currency");
        this.currencyElement.showAffordable = true;
        this.currencyElement.init(this);
        this.currencyElement.addClass("mercenaryCurrency");
        this.currencyElement.addClass("globalNoDrag");
        this.currencyElement.setImage(ResImg(iconGold));
        this.addManagedChild(this.currencyElement);

        this.countElement = element.create(this.id + "Count");
        this.countElement.init(this);
        this.addManagedChild(this.countElement);

        this.getMainElement().mousedown({self: this, arg: this.callbackArgument}, this.callback);

        this._setupEvents();
    };

    MercenaryControl.prototype.elementUpdate = MercenaryControl.prototype.update;
    MercenaryControl.prototype.update = function(gameTime) {
        if(this.elementUpdate(gameTime) !== true) {
            return false;
        }

        return true;
    }

    MercenaryControl.prototype._setupEvents = function() {
        var hoverCallback = function (obj) {
            obj.data.self.backgroundPanel.setStyle("BeigeLightInset");
        };
        this.getMainElement().mouseover({self: this}, hoverCallback );
        this.getMainElement().mouseup({self: this}, hoverCallback );

        var resetCallback = function (obj) {
            obj.data.self.backgroundPanel.setStyle("BeigeInset");
        };
        this.getMainElement().mouseout({self: this}, resetCallback );

        // Fire once to set the image
        this.getMainElement().mouseout();
    }

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    MercenaryControl.prototype.setMercenaryName = function(text) {
        this.nameElement.setText(text);
    }

    MercenaryControl.prototype.setMercenaryImage = function(path) {
        coreUtils.setBackgroundImage(this.imageElement.getMainElement(), path);
    }

    MercenaryControl.prototype.setMercenaryCost = function(value) {
        this.currencyElement.setValue(value);
    }

    MercenaryControl.prototype.setMercenaryCount = function(value) {
        this.countElement.setText(value);
    }

    MercenaryControl.prototype.setPlayerGold = function(value) {
        this.currencyElement.setOwnedValue(value);
    }

    var surrogate = function(){};
    surrogate.prototype = MercenaryControl.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { MercenaryControl.call(self); },
        create: function(id) { return new MercenaryControl(id); }
    };

});
