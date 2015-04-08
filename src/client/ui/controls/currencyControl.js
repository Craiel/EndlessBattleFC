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

        this.imageAfterText = false;

        this.currencyControlHeight = 24;

        this.classPrefix = "currencyControlDefault";
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    CurrencyControl.prototype.elementInit = CurrencyControl.prototype.init;
    CurrencyControl.prototype.init = function(parent, attributes) {
        this.elementInit(parent, attributes);

        this.imageControl = element.create(this.id + "Image");
        this.imageControl.init(this);
        this.addManagedChild(this.imageControl);

        this.textControl = element.create(this.id + "Value");
        this.textControl.init(this);
        this.addManagedChild(this.textControl);

        if(this.showAffordable === true) {
            this.textControl.addClass(this.classPrefix + "CantAfford");
        } else {
            this.textControl.addClass(this.classPrefix + "Text");
        }

        if(this.imageAfterText === true) {
            this.imageControl.removeElementOnly();
            this.addContent(this.imageControl.getMainElement());
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
    };

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    CurrencyControl.prototype.setImage = function(image) {
        coreUtils.setBackgroundImage(this.imageControl.getMainElement(), image);

        this.applyLayout();
    };

    CurrencyControl.prototype.elementSetHeight = CurrencyControl.prototype.setHeight;
    CurrencyControl.prototype.setHeight = function(value) {
        this.currencyControlHeight = value;
        this.elementSetHeight(this.currencyControlHeight);

        this.applyLayout();
    };

    CurrencyControl.prototype.applyLayout = function() {
        // Set the font's style according to the new height
        this.textControl.setStyle({height: this.currencyControlHeight, "line-height": this.currencyControlHeight + "px", "font-size": this.currencyControlHeight - 2});

        // We set the image to be uniform in both directions
        var imageSize = this.currencyControlHeight;
        this.imageControl.setSize({x: imageSize, y: imageSize});
    };

    CurrencyControl.prototype.setValue = function(value) {
        this.currentValue = value;
    };

    CurrencyControl.prototype.setOwnedValue = function(value) {
        if(this.showAffordable !== true || this.currentValue === undefined) {
            return;
        }

        var canAfford = value >= this.currentValue;
        if(canAfford !== this.canAffordValue) {
            this.textControl.toggleClass(this.classPrefix + "CanAfford");
            this.textControl.toggleClass(this.classPrefix + "CantAfford");
            this.canAffordValue = canAfford;
        }
    };

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
    };

    var surrogate = function(){};
    surrogate.prototype = CurrencyControl.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { CurrencyControl.call(self); },
        create: function(id) { return new CurrencyControl(id); }
    };

});
