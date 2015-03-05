declare('MercenaryControl', function() {
    include('Log');
    include('Assert');
    include('Static');
    include('Element');
    include('CoreUtils');
    include('Resources');
    include('Panel');

    MercenaryControl.prototype = element.create();
    MercenaryControl.prototype.$super = parent;
    MercenaryControl.prototype.constructor = MercenaryControl;

    function MercenaryControl(id) {
        this.id = id;

        this.setTemplate("mercenaryControl");

        this.backgroundPanel = undefined;
        this.imageElement = undefined;
        this.nameElement = undefined;

        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;

        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
            this.elementInit(parent, attributes);

            this.backgroundPanel = panel.create(this.id + "Background");
            this.backgroundPanel.init(this);

            this.imageElement = element.create(this.id + "Image");
            this.imageElement.templateName = "mercenaryControlImage";
            this.imageElement.init(this.backgroundPanel.getContentArea());

            this.nameElement = element.create(this.id + "Name");
            this.nameElement.templateName = "textElement";
            this.nameElement.init(this.backgroundPanel.getContentArea());
            this.nameElement.addClass("mercenaryName");

            this._setupEvents();
        };

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

        }

        this.setMercenaryCount = function(value) {

        }
    };

    return {
        create: function(id) { return new MercenaryControl(id); }
    };

});
