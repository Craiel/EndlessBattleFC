declare('Dialog', function() {
    include('Log');
    include('Assert');
    include('StaticData');
    include('Element');
    include('CoreUtils');
    include('Resources');
    include('Panel');
    include('Button');

    Dialog.prototype = element.prototype();
    Dialog.prototype.$super = parent;
    Dialog.prototype.constructor = Dialog;

    function Dialog(id) {
        element.construct(this);

        this.id = id;

        this.setTemplate("dialog");

        this.isVisible = true;
        this.canClose = true;
        this.canDrag = true;
        this.canScroll = false;

        this.headerPanel = undefined;
        this.contentPanel = undefined;

        this.headerText = undefined;
        this.closeButton = undefined;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    Dialog.prototype.elementInit = Dialog.prototype.init;
    Dialog.prototype.init = function(parent, attributes) {
        this.elementInit(parent, attributes);

        this.headerPanel = panel.create(this.id + "Header");
        this.headerPanel.init(this);
        resources.setPanelImages(this.headerPanel, "Brown");
        this.headerPanel.addClass("dialogHeaderPanel");

        this.headerText = element.create(this.id + "HeaderText");
        this.headerText.templateName = "globalTextElement";
        this.headerText.init(this.headerPanel.getContentArea());
        this.headerText.addClass("dialogHeaderText");

        this.contentPanel = panel.create(this.id + "Content");
        this.contentPanel.init(this);
        resources.setPanelImages(this.contentPanel, "Brown");
        this.contentPanel.addClass("dialogContentPanel");
        this.contentPanel.addClass("globalNoDrag");
        if(this.canScroll === true) {
            this.contentPanel.getContentArea().setStyle({"overflow-y": "scroll"});
        }

        if(this.canClose === true) {
            this.closeButton = button.create(this.id + "Close");
            this.closeButton.callback = function (obj) { obj.data.arg.onDialogClose(); };
            this.closeButton.callbackArgument = this;
            this.closeButton.init(this);
            this.closeButton.setImages(resources.ImageIconClose, resources.ImageIconCloseHover, undefined);
            this.closeButton.addClass("dialogCloseButton");
        }

        if(this.canDrag === true) {
            this.setStyle({"zIndex": staticData.dialogDefaultZIndex});
            this.getMainElement().draggable({ self: this, cancel: ".globalNoDrag", zIndex: staticData.dragZIndex, drag: function () { }});
        }
    };

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    Dialog.prototype.setHeaderText = function(text) {
        this.headerText.setText(text);
    }

    Dialog.prototype.getContentArea = function() {
        return this.contentPanel.getContentArea();
    }

    Dialog.prototype.onDialogClose = function(obj) {
        this.getMainElement().hide();
        this.isVisible = false;
    }

    Dialog.prototype.toggle = function(obj) {
        if(this.isVisible === true) {
            this.getMainElement().hide();
            this.isVisible = false;
        } else {
            this.getMainElement().show();
            this.isVisible = true;
        }
    }

    var surrogate = function(){};
    surrogate.prototype = Dialog.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { Dialog.call(self); },
        create: function(id) { return new Dialog(id); }
    };

});
