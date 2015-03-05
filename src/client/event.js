declare('Event', function () {

    function Event(id) {
        this.id = id;
        this.type = null;
        this.quest = null;
        this.velY = 0;
    }

    return {
        create: function(id) { return new Event(id); }
    }

});