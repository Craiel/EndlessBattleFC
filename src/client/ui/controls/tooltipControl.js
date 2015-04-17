declare('TooltipControl', function() {
    include('StaticData');
    include('Element');
    include('Resources');
    include('Panel');
    include('EventAggregate');

    var eventsTooltip = [];
    var receiveEventTooltip = function(eventData) { eventsTooltip.push(eventData); }

    TooltipControl.prototype = element.prototype();
    TooltipControl.prototype.$super = parent;
    TooltipControl.prototype.constructor = TooltipControl;

    function TooltipControl() {
        element.construct(this);

        this.id = "tooltip";

        this.setTemplate("tooltipControl");

        this.backgroundPanel = undefined;
        this.content = undefined;
        this.backupContent = undefined;
    }

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    TooltipControl.prototype.elementInit = TooltipControl.prototype.init;
    TooltipControl.prototype.init = function(parent, attributes) {
        this.elementInit(parent, attributes);

        eventAggregate.subscribe(staticData.EventTooltip, receiveEventTooltip);

        this.backgroundPanel = panel.create(this.id + "Background");
        this.backgroundPanel.init(this);
        resources.setPanelImages(this.backgroundPanel, "Tooltip");
        this.addManagedChild(this.backgroundPanel);

        this.content = element.create(this.id + "Content");
        this.content.init(this);
        this.content.setText("TODO");
        this.addManagedChild(this.content);

        this.hide();
    };

    TooltipControl.prototype.elementUpdate = TooltipControl.prototype.update;
    TooltipControl.prototype.update = function(gameTime) {
        var length = eventsTooltip.length;
        for(var i = 0; i < length; i++) {
            var event = eventsTooltip.shift();
            if(event.content !== null) {
                if(event.content.id === undefined) {
                    this.setStringContent(event.content);
                } else {
                    this.setElementContent(event.content);
                }

                this.show();
            } else {
                this.content.setContent('NONE');
                this.hide();
            }
        }

        if(this.elementUpdate(gameTime) !== true) {
            return false;
        }

        return true;
    };

    TooltipControl.prototype.setStringContent = function(content) {
        if(this.backupContent !== undefined) {
            this.setContent(this.backupContent);
        }

        this.content.setText(content);
        var width = this.content.getMainElement().textWidth();
        this.setSize({x: 20 + width, y: 40});
    };

    TooltipControl.prototype.setElementContent = function(content) {
        if(this.backupContent === undefined) {
            this.backupContent = this.getContent();
        }

        this.setContent(content.getMainElement());
        this.setSize(content.getSize());
    };

    // ---------------------------------------------------------------------------
    // tooltip functions
    // ---------------------------------------------------------------------------
    TooltipControl.prototype.setMousePosition = function(position) {
        var wnd = $(window);
        var windowWidth = wnd.width();
        var windowHeight = wnd.height();
        var size = this.getSize();
        var tooltipPosition = {x: 0, y: 0};

        if(position.x > windowWidth / 2) {
            tooltipPosition.x = position.x - size.x - staticData.tooltipOffset;
        } else {
            tooltipPosition.x = position.x + staticData.tooltipOffset;
        }

        if(position.y > windowHeight / 2) {
            tooltipPosition.y = position.y - size.y - staticData.tooltipOffset;
        } else {
            tooltipPosition.y = position.y + staticData.tooltipOffset;
        }

        this.setPosition(tooltipPosition);
    };

    var surrogate = function(){};
    surrogate.prototype = TooltipControl.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { TooltipControl.call(self); },
        create: function() { return new TooltipControl(); }
    };

});
