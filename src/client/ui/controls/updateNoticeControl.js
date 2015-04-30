declare('UpdateNoticeControl', function() {
    include('StaticData');
    include('Element');
    include('Panel');

    UpdateNoticeControl.prototype = element.prototype();
    UpdateNoticeControl.prototype.$super = parent;
    UpdateNoticeControl.prototype.constructor = UpdateNoticeControl;

    function UpdateNoticeControl() {
        element.construct(this);

        this.id = "updateNotice";

        this.setTemplate("updateNoticeControl");

        this.backgroundPanel = undefined;
        this.content = undefined;
    }

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    UpdateNoticeControl.prototype.elementInit = UpdateNoticeControl.prototype.init;
    UpdateNoticeControl.prototype.init = function(parent, attributes) {
        this.elementInit(parent, attributes);

        this.backgroundPanel = panel.create(this.id + "Background");
        this.backgroundPanel.init(this);
        this.backgroundPanel.setStyle("Tooltip");
        this.addManagedChild(this.backgroundPanel);

        this.content = element.create(this.id + "Content");
        this.content.init(this);
        this.content.setText("TODO");
        this.addManagedChild(this.content);

        this.hide();
    };

    UpdateNoticeControl.prototype.elementUpdate = UpdateNoticeControl.prototype.update;
    UpdateNoticeControl.prototype.update = function(gameTime) {
        if(this.elementUpdate(gameTime) !== true) {
            return false;
        }

        return true;
    };

    // ---------------------------------------------------------------------------
    // control functions
    // ---------------------------------------------------------------------------
    UpdateNoticeControl.prototype.setVersionData = function(data) {
        this.content.removeContent();
        this.content.addContent($('<div>Version {0} available</div>'.format(data.version)));
        this.content.addContent($('<div>{0}</div>'.format(data.changeTitle)));

        this.setTooltip(data.changeDetails);
    };

    var surrogate = function(){};
    surrogate.prototype = UpdateNoticeControl.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { UpdateNoticeControl.call(self); },
        create: function() { return new UpdateNoticeControl(); }
    };

});
