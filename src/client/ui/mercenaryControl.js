declare('MercenaryControl', function() {
    include('Log');
    include('Assert');
    include('StaticData');
    include('Element');
    include('CoreUtils');
    include('Resources');
    include('Panel');
    include('CurrencyControl');

    MercenaryControl.prototype = element.create();
    MercenaryControl.prototype.$super = parent;
    MercenaryControl.prototype.constructor = MercenaryControl;

    function MercenaryControl(id) {
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

        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;

        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
            this.elementInit(parent, attributes);

            assert.isDefined(this.mercenaryKey, "Mercenary key must be set");
            assert.isDefined(this.callback, "Callback must be set");

            this.backgroundPanel = panel.create(this.id + "Background");
            this.backgroundPanel.init(this);
            this.backgroundPanel.addClass("mercenaryBackground");
            this.backgroundPanel.addClass("globalNoDrag");

            this.imageElement = element.create(this.id + "Image");
            this.imageElement.init(this);

            this.nameElement = element.create(this.id + "Name");
            this.nameElement.init(this);

            this.currencyElement = currencyControl.create(this.id + "Currency");
            this.currencyElement.showAffordable = true;
            this.currencyElement.init(this);
            this.currencyElement.addClass("mercenaryCurrency");
            this.currencyElement.addClass("globalNoDrag");
            this.currencyElement.setImage(resources.ImageIconCoin);

            this.countElement = element.create(this.id + "Count");
            this.countElement.init(this);

            this.getMainElement().mousedown({self: this, arg: this.callbackArgument}, this.callback);

            this._setupEvents();
        };

        this.elementUpdate = this.update;
        this.update = function(gameTime) {
            if(this.elementUpdate(gameTime) !== true) {
                return false;
            }

            this.currencyElement.update(gameTime);

            return true;
        }

        this._setupEvents = function() {
            var hoverCallback = function (obj) {
                include('Resources');
                obj.data.self.backgroundPanel.setImages(resources.ImagePanelBeigeLightInsetLT, resources.ImagePanelBeigeLightInsetT, resources.ImagePanelBeigeLightInsetRT,
                    resources.ImagePanelBeigeLightInsetL, resources.ImagePanelBeigeLightInsetContent, resources.ImagePanelBeigeLightInsetR,
                    resources.ImagePanelBeigeLightInsetLB, resources.ImagePanelBeigeLightInsetB, resources.ImagePanelBeigeLightInsetRB);
            };
            this.getMainElement().mouseover({self: this}, hoverCallback );
            this.getMainElement().mouseup({self: this}, hoverCallback );

            var resetCallback = function (obj) {
                include('Resources');
                obj.data.self.backgroundPanel.setImages(resources.ImagePanelBeigeInsetLT, resources.ImagePanelBeigeInsetT, resources.ImagePanelBeigeInsetRT,
                    resources.ImagePanelBeigeInsetL, resources.ImagePanelBeigeInsetContent, resources.ImagePanelBeigeInsetR,
                    resources.ImagePanelBeigeInsetLB, resources.ImagePanelBeigeInsetB, resources.ImagePanelBeigeInsetRB);
            };
            this.getMainElement().mouseout({self: this}, resetCallback );

            // Fire once to set the image
            this.getMainElement().mouseout();
        }

        // ---------------------------------------------------------------------------
        // dialog functions
        // ---------------------------------------------------------------------------
        this.setMercenaryName = function(text) {
            this.nameElement.setText(text);
        }

        this.setMercenaryImage = function(path) {
            coreUtils.setBackgroundImage(this.imageElement.getMainElement(), path);
        }

        this.setMercenaryCost = function(value) {
            this.currencyElement.setValue(value);
        }

        this.setMercenaryCount = function(value) {
            this.countElement.setText(value);
        }

        this.setPlayerGold = function(value) {
            this.currencyElement.setOwnedValue(value);
        }
    };

    return {
        create: function(id) { return new MercenaryControl(id); }
    };

});
