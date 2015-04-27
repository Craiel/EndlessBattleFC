declare('DebugDialog', function() {
    include('Log');
    include('Element');
    include('Dialog');
    include('Button');
    include('Panel');
    include('EventAggregate');
    include('StaticData');
    include('CoreUtils');
    include('InterfaceState');

    // Events
    var eventsDebugLog = [];
    var receiveEventLog = function(eventData) { eventsDebugLog.push(eventData); }
    eventAggregate.subscribe(staticData.EventDebugLog, receiveEventLog);

    DebugDialog.prototype = dialog.prototype();
    DebugDialog.prototype.$super = parent;
    DebugDialog.prototype.constructor = DebugDialog;

    function DebugDialog() {
        dialog.construct(this);

        this.id = "debugDialog";

        this.buttons = {};
        this.levelText = {};
        this.levelCount = {};
        this.contentButtons = {};
        this.contentPanels = {};

        this.canClose = true;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    DebugDialog.prototype.dialogInit = DebugDialog.prototype.init;
    DebugDialog.prototype.init = function(parent, attributes) {
        this.dialogInit(parent, attributes);

        this.setHeaderText("Debug");

        var buttonPanel = element.create(this.id + 'ButtonPanel');
        buttonPanel.templateName = "emptyElement";
        buttonPanel.init(this.getContentArea());
        this.addManagedChild(buttonPanel);

        var contentPanel = panel.create(this.id + 'ContentPanel');
        contentPanel.init(this.getContentArea());
        this.addManagedChild(contentPanel);

        for(var level in log.level) {
            var key = log.level[level];
            this.levelText[key] = coreUtils.capitalizeString(level);
            this.levelCount[key] = 0;

            var levelButton = button.create(this.id + 'Button' + level);
            levelButton.callback = function(obj) { obj.data.arg.self.enableLevel(obj.data.arg.level); };
            levelButton.callbackArgument = { self: this, level: key};
            levelButton.init(buttonPanel);
            levelButton.setText(this.levelText[key]);
            levelButton.setImages(ResImg(interfaceButtonLongBlue), ResImg(interfaceButtonLongBlueHover));
            levelButton.addClass("debugDialogLevelButton");
            this.contentButtons[key] = levelButton;
            this.addManagedChild(levelButton);

            this.contentPanels[key] = panel.create(this.id + 'Panel' + level);
            this.contentPanels[key].init(contentPanel.getContentArea());
            this.contentPanels[key].addClass("debugDialogContentPanelContent");
            this.contentPanels[key].getContentArea().setStyle({"overflow-y": "scroll"});
            this.addManagedChild(this.contentPanels[key]);
        }

        this.enableLevel(log.level.error);

        this.getMainElement().resizable();
    };

    DebugDialog.prototype.dialogUpdate = DebugDialog.prototype.update;
    DebugDialog.prototype.update = function(gameTime) {
        if(this.dialogUpdate(gameTime) !== true) {
            return false;
        }

        var eventAdded = false;
        var count = eventsDebugLog.length;
        for(var i = 0; i < count; i++) {
            var eventData = eventsDebugLog.shift();
            var level = eventData.level;
            this.contentPanels[level].getContentArea().addContent(this.getDebugEventText(eventData));
            this.levelCount[level]++;
            this.contentButtons[level].setText("{0} ({1})".format(this.levelText[level], this.levelCount[level]));
            eventAdded = true;
        }

        this.trimEvents();

        if(eventAdded !== false) {
            // Scroll to bottom
            this.getContentArea().scrollToBottom();
        }

        return true;
    };

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    DebugDialog.prototype.dialogOnDialogClose = DebugDialog.prototype.onDialogClose;
    DebugDialog.prototype.onDialogClose = function(obj) {
        interfaceState.debugWindowShown = false;
        this.dialogOnDialogClose(obj);
    };

    DebugDialog.prototype.enableLevel = function(targetLevel) {
        for(var level in log.level) {
            var key = log.level[level];
            if(key === targetLevel) {
                this.contentPanels[key].show();
            } else {
                this.contentPanels[key].hide();
            }
        }
    };

    DebugDialog.prototype.trimEvents = function() {
        var count = this.getContentArea().getChildCount();
        if(count <= this.maxEventCount) {
            return;
        }

        for(var i = this.maxEventCount; i < count; i++) {
            this.getContentArea().removeFirstChild();
        }
    };

    DebugDialog.prototype.getDebugEventText = function(eventData) {
        var className = "debugLogEntry" + eventData.level;
        var textElement = $('<div\>');
        textElement.append($('<span class="{0}">[{1}] {2} {3}</span>'.format(className, coreUtils.getTimeDisplay(eventData.time), eventData.context, eventData.message)));
        return textElement;
    };

    var surrogate = function(){};
    surrogate.prototype = DebugDialog.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { DebugDialog.call(self); },
        create: function() { return new DebugDialog(); }
    };

});
