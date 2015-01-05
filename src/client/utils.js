declare("Utils", function () {

    function Utils() {
        this.Sigma = function(number) {
            total = 0;
            for (var x = 1; x <= number; x++) {
                total += x;
            }
            return total;
        }
    }

    return new Utils();
});