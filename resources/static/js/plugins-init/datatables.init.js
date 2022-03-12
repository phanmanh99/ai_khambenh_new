let dataSet = [
];

var table = $("#example").DataTable({
  createdRow: function (row, data, index) {
    $(row).addClass("selected");
  },
});


(function($) {
    "use strict"
    //example 1
    
    table.rows().every(function () {
      this.nodes().to$().removeClass("selected");
    });
})(jQuery);
