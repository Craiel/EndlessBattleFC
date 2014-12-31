declare("BaseGame", function () {

    function Mercenary(type) {
        this.type = type;
    }

    return {
        create: function(type) { return new Mercenary(type); }
    }

});