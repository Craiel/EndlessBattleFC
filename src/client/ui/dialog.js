declare('Dialog', function() {
    include('Log');
    include('Assert');
    include('Static');
    include('Element');
    include('CoreUtils');
    include('Resources');
    include('Panel');
    include('Button');

    Dialog.prototype = element.create();
    Dialog.prototype.$super = parent;
    Dialog.prototype.constructor = Dialog;

    function Dialog(id) {
        this.id = id;

        this.setTemplate("dialog");

        this.headerPanel = undefined;
        this.contentPanel = undefined;

        this.headerText = undefined;
        this.closeButton = undefined;

        // ---------------------------------------------------------------------------
        // overrides
        // ---------------------------------------------------------------------------
        this.elementInit = this.init;

        // ---------------------------------------------------------------------------
        // main functions
        // ---------------------------------------------------------------------------
        this.init = function(parent, attributes) {
            this.elementInit(parent, attributes);

            this.headerPanel = panel.create(this.id + "Header");
            this.headerPanel.init(this);
            this.headerPanel.setImages(resources.ImagePanelBrownLT, resources.ImagePanelBrownT, resources.ImagePanelBrownRT,
                resources.ImagePanelBrownL, resources.ImagePanelBrownContent, resources.ImagePanelBrownR,
                resources.ImagePanelBrownLB, resources.ImagePanelBrownB, resources.ImagePanelBrownRB);
            this.headerPanel.addClass("dialogHeaderPanel");

            this.headerText = element.create(this.id + "HeaderText");
            this.headerText.templateName = "textElement";
            this.headerText.init(this.headerPanel.getContentArea());
            this.headerText.addClass("dialogHeaderText");

            this.contentPanel = panel.create(this.id + "Content");
            this.contentPanel.init(this);
            this.contentPanel.setImages(resources.ImagePanelBrownLT, resources.ImagePanelBrownT, resources.ImagePanelBrownRT,
                resources.ImagePanelBrownL, resources.ImagePanelBrownContent, resources.ImagePanelBrownR,
                resources.ImagePanelBrownLB, resources.ImagePanelBrownB, resources.ImagePanelBrownRB);
            this.contentPanel.addClass("dialogContentPanel");

            this.closeButton = button.create(this.id + "Close");
            this.closeButton.callback = function(obj) { obj.data.arg.onDialogClose(); };
            this.closeButton.callbackArgument = this;
            this.closeButton.init(this);
            this.closeButton.setImages(undefined, undefined, resources.ImageCloseButton);
            this.closeButton.addClass("dialogCloseButton");
        };

        // ---------------------------------------------------------------------------
        // dialog functions
        // ---------------------------------------------------------------------------
        this.setHeaderText = function(text) {
            this.headerText.setText(text);
        }

        this.getContentArea = function() {
            return this.contentPanel.getContentArea();
        }

        this.onDialogClose = function(obj) {
            log.warning("onDialogClose not implemented for " + this.id);
        }
    };

    return {
        create: function(id) { return new Dialog(id); }
    };

});
