declare('CurrencyControl', function() {
    include('Element');
    include('CoreUtils');

    CurrencyControl.prototype = element.create();
    CurrencyControl.prototype.$super = parent;
    CurrencyControl.prototype.constructor = CurrencyControl;

    function CurrencyControl(id) {
        this.id = id;

        this.setTemplate("currencyControl");

        this.isVisible = true;
        this.canClose = true;
        this.canDrag = true;
        this.canScroll = false;

        this.imageControl = undefined;
        this.textControl = undefined;

        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;

        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
            this.elementInit(parent, attributes);

            this.imageControl = element.create(this.id + "Image");
            this.imageControl.init(this);

            this.textControl = element.create(this.id + "Value");
            this.textControl.init(this);
        };

        // ---------------------------------------------------------------------------
        // dialog functions
        // ---------------------------------------------------------------------------
        this.setImage = function(image) {
            coreUtils.setBackgroundImage(this.imageControl.getMainElement(), image);
        }

        this.setValue = function(value) {
            this.textControl.setText(coreUtils.formatters['shortName'](value));
        }
    };

    return {
        create: function(id) { return new CurrencyControl(id); }
    };

});
