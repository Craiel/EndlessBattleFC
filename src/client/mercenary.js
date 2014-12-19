declare("BaseGame", function () {

    function Mercenary(type) {
        this.type = type;
    }

    return {
        create: function() { return new Mercenary(); }
    }

});