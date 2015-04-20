declare('LogDialog', function() {
    include('CoreUtils');
    include('Dialog');
    include('EventAggregate');
    include('StaticData');

    // Events
    var eventsCombatHit = [];
    var receiveEventCombatHit = function(eventData) { eventsCombatHit.push(eventData); }

    var eventsCombatDeath = [];
    var receiveEventCombatDeath = function(eventData) { eventsCombatDeath.push(eventData); }

    var eventsXpGain = [];
    var eventsGoldGain = [];
    var eventsItemGain = [];
    var receiveEventXpGain = function(eventData) { eventsXpGain.push(eventData); }
    var receiveEventGoldGain = function(eventData) { eventsGoldGain.push(eventData); }
    var receiveEventItemGain = function(eventData) { eventsItemGain.push(eventData); }

    LogDialog.prototype = dialog.prototype();
    LogDialog.prototype.$super = parent;
    LogDialog.prototype.constructor = LogDialog;

    function LogDialog(id) {
        dialog.construct(this);

        this.id = "logDialog";

        this.canScroll = true;
        this.canClose = false;

        this.maxEventCount = 100;

        this.currentTime;
    };

    // ---------------------------------------------------------------------------
    // main functions
    // ---------------------------------------------------------------------------
    LogDialog.prototype.dialogInit = LogDialog.prototype.init;
    LogDialog.prototype.init = function(parent, attributes) {
        this.dialogInit(parent, attributes);

        this.setHeaderText("Log");

        eventAggregate.subscribe(staticData.EventCombatHit, receiveEventCombatHit);
        eventAggregate.subscribe(staticData.EventCombatDeath, receiveEventCombatDeath);
        eventAggregate.subscribe(staticData.EventXpGain, receiveEventXpGain);
        eventAggregate.subscribe(staticData.EventGoldGain, receiveEventGoldGain);
        eventAggregate.subscribe(staticData.EventItemGain, receiveEventItemGain);

        this.getMainElement().resizable();
    };

    LogDialog.prototype.dialogUpdate = LogDialog.prototype.update;
    LogDialog.prototype.update = function(gameTime) {
        if(this.dialogUpdate(gameTime) !== true) {
            return false;
        }

        this.currentTime = gameTime.currentLocale;

        var eventAdded = false;
        var count = eventsCombatHit.length;
        for(var i = 0; i < count; i++) {
            var eventData = eventsCombatHit.shift();
            this.getContentArea().addContent(this.getCombatEventText(eventData));
            eventAdded = true;
        }

        count = eventsCombatDeath.length;
        for(var i = 0; i < count; i++) {
            var eventData = eventsCombatDeath.shift();
            this.getContentArea().addContent(this.getCombatDeathEventText(eventData));
            eventAdded = true;
        }

        count = eventsXpGain.length;
        for(var i = 0; i < count; i++) {
            var eventData = eventsXpGain.shift();
            this.getContentArea().addContent(this.getXpEventText(eventData));
            eventAdded = true;
        }

        count = eventsGoldGain.length;
        for(var i = 0; i < count; i++) {
            var eventData = eventsGoldGain.shift();
            this.getContentArea().addContent(this.getGoldEventText(eventData));
            eventAdded = true;
        }

        count = eventsItemGain.length;
        for(var i = 0; i < count; i++) {
            var eventData = eventsItemGain.shift();
            this.getContentArea().addContent(this.getItemEventText(eventData));
            eventAdded = true;
        }

        this.trimEvents();

        if(eventAdded !== false) {
            // Scroll to bottom
            this.getContentArea().scrollToBottom();
        }

        return true;
    }

    // ---------------------------------------------------------------------------
    // dialog functions
    // ---------------------------------------------------------------------------
    LogDialog.prototype.trimEvents = function(eventData) {
        var count = this.getContentArea().getChildCount();
        if(count <= this.maxEventCount) {
            return;
        }

        for(var i = this.maxEventCount; i < count; i++) {
            this.getContentArea().removeFirstChild();
        }
    }

    LogDialog.prototype.getBasicEventText = function(eventData) {
        var textElement = $('<div\>');
        textElement.append($('<span class="logEntryNormal">[' + coreUtils.getTimeDisplay(this.currentTime) + '] </span>'));
        return textElement;
    }

    LogDialog.prototype.getCombatEventText = function(eventData) {
        var textElement = this.getBasicEventText();
        textElement.append($('<span class="combatLogActor">' + eventData.sourceActorName + '</span>'));
        if(eventData.wasHit !== true) {
            textElement.append($('<span class="logEntryNormal"> missed</span>'));
            return textElement;
        }

        if(eventData.wasCrit !== true) {
            textElement.append($('<span class="logEntryNormal"> hit </span>'))
        } else {
            textElement.append($('<span class="combatLogCritical"> crit </span>'))
        }

        textElement.append($('<span class="combatLogActor">' + eventData.targetActorName + '</span>'));
        textElement.append($('<span class="logEntryNormal"> for </span>'));
        textElement.append($('<span class="combatLogDamage">' + eventData.damageTotal + '</span>'));
        textElement.append($('<span class="logEntryNormal"> damage</span>'));
        return textElement;
    }

    LogDialog.prototype.getCombatDeathEventText = function(eventData) {
        var textElement = this.getBasicEventText();
        textElement.append($('<span class="combatLogActor">' + eventData.actorName + ' was defeated!</span>'));
        return textElement;
    }

    LogDialog.prototype.getXpEventText = function(eventData) {
        var textElement = this.getBasicEventText();
        textElement.append($('<span class="logEntryNormal">earned </span>'));
        textElement.append($('<span class="logEntryXp">' + eventData.value + '</span>'));
        textElement.append($('<span class="logEntryNormal"> XP</span>'));
        return textElement;
    }

    LogDialog.prototype.getGoldEventText = function(eventData) {
        var textElement = this.getBasicEventText();
        textElement.append($('<span class="logEntryNormal">received </span>'));
        textElement.append($('<img class="logEntryGoldIcon" src="'+ ResImg(iconGold) +'"></img>'));
        textElement.append($('<span class="logEntryGold"> ' + eventData.value + ' </span>'));
        textElement.append($('<span class="logEntryNormal"> Gold</span>'));
        return textElement;
    }

    LogDialog.prototype.getItemEventText = function(eventData) {
        var textElement = this.getBasicEventText();
        textElement.append($('<span class="logEntryNormal">ITEM RECEIVED TODO!!</span>'));
        return textElement;
    }

    var surrogate = function(){};
    surrogate.prototype = LogDialog.prototype;

    return {
        prototype: function() { return new surrogate(); },
        construct: function(self) { LogDialog.call(self); },
        create: function(id) { return new LogDialog(id); }
    };

});
