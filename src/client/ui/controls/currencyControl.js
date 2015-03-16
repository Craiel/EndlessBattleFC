declare('CurrencyControl', function() {
    include('Element');
    include('CoreUtils');

    CurrencyControl.prototype = element.prototype();
    CurrencyControl.prototype.$super = parent;
    CurrencyControl.prototype.constructor = CurrencyControl;

    function CurrencyControl(id) {
        element.construct(this);

        this.id = id;

        this.setTemplate("currencyControl");

        this.showAffordable = false;
        this.trackChanges = false;

        this.imageControl = undefined;
        this.textControl = undefined;

        this.currentValue = undefined;
        this.canAffordValue = false;

        this.changeTrackingStartValue = 0;
        this.changeTrackingTime = 0;
        this.changeTrackingDelay = 1000;
        this.changeTrackingValue = 0;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    CurrencyControl.prototype.elementInit = CurrencyControl.prototype.init;
    CurrencyControl.prototype.init = function(parent, attributes) {
        this.elementInit(parent, attributes);

        this.imageControl = element.create(this.id + "Image");
        this.imageControl.init(this);

        this.textControl = element.create(this.id + "Value");
        this.textControl.init(this);

        if(this.showAffordable === true) {
            this.textControl.addClass("currencyControlCantAfford");
        }
    };

    CurrencyControl.prototype.elementUpdate = CurrencyControl.prototype.update;
    CurrencyControl.prototype.update = function(gameTime) {
        if(this.elementUpdate(gameTime) !== true) {
            return false;
        }

        var formatter = coreUtils.formatters['shortName'];
        var formattedCurrency = formatter(this.currentValue);
        if(this.trackChanges === true) {
            this._trackChange(gameTime);
            var formattedChange = formatter(this.changeTrackingValue);
            if(this.changeTrackingValue >= 0) {
                formattedCurrency = "{0} (+{1}/s)".format(formattedCurrency, formattedChange);
            } else {
                formattedCurrency = "{0} ({1}/s)".format(formattedCurrency, formattedChange);
            }

        }

        this.textControl.setText(formattedCurrency);
        return true;
    }

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    CurrencyControl.prototype.setImage = function(image) {
        coreUtils.setBackgroundImage(this.imageControl.getMainElement(), image);
    }

    CurrencyControl.prototype.setValue = function(value) {
        this.currentValue = value;
    }

    CurrencyControl.prototype.setOwnedValue = function(value) {
        if(this.showAffordable !== true || this.currentValue === undefined) {
            return;
        }

        var canAfford = value >= this.currentValue;
        if(canAfford !== this.canAffordValue) {
            this.textControl.toggleClass("currencyControlCanAfford");
            this.textControl.toggleClass("currencyControlCantAfford");
            this.canAffordValue = canAfford;
        }
    }

    CurrencyControl.prototype._trackChange = function(gameTime) {
        if(this.changeTrackingTime === 0) {
            this.changeTrackingTime = gameTime.current + this.changeTrackingDelay;
            this.changeTrackingStartValue = this.currentValue;
            return;
        }

        if(this.changeTrackingTime < gameTime.current) {
            this.changeTrackingValue = this.currentValue - this.changeTrackingStartValue;
            this.changeTrackingStartValue = this.currentValue;
            this.changeTrackingTime = gameTime.current + this.changeTrackingDelay;
        }
    }

    var surrogate = function(){};
    surrogate.prototype = CurrencyControl.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { CurrencyControl.call(self); },
        create: function(id) { return new CurrencyControl(id); }
    };

});