var myclass1 = document.getElementById("myclass1");
var myclass2 = document.getElementById("myclass2");
var myclass3 = document.getElementById("myclass3");
var myclass4 = document.getElementById("myclass4");
var iTag1 = document.getElementById("iTag1");
var iTag2 = document.getElementById("iTag2");
var iTag3 = document.getElementById("iTag3");
var iTag4 = document.getElementById("iTag4");


myclass1.addEventListener("click", function () {
    if (iTag1.classList) {
        iTag1.classList.toggle("fa-chevron-up")
        iTag1.classList.toggle("fa-chevron-down")
    }
})

myclass2.addEventListener("click", function () {
    if (iTag2.classList) {
        iTag2.classList.toggle("fa-chevron-up")
        iTag2.classList.toggle("fa-chevron-down")
    }
})

myclass3.addEventListener("click", function () {
    if (iTag3.classList) {
        iTag3.classList.toggle("fa-chevron-up")
        iTag3.classList.toggle("fa-chevron-down")
    }
})

myclass4.addEventListener("click", function () {
    if (iTag4.classList) {
        iTag4.classList.toggle("fa-chevron-up")
        iTag4.classList.toggle("fa-chevron-down")
    }
})

myclass5.addEventListener("click", function () {
    if (iTag5.classList) {
        iTag5.classList.toggle("fa-chevron-up")
        iTag5.classList.toggle("fa-chevron-down")
    }
})

function validate() {
    if (document.getElementById('check').checked) {
        alert("checked");
    } else {
        alert("You didn't check it! Let me check it for you.");
    }
}

// age filter 

function ageFilter() {

    function addSeparator(nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + '.' + '$2');
        }
        return x1 + x2;
    }

    function rangeInputChangeEventHandler(e) {
        var rangeGroup = $(this).attr('name'),
            minBtn = $(this).parent().children('.min'),
            maxBtn = $(this).parent().children('.max'),
            range_min = $(this).parent().children('.range_min'),
            range_max = $(this).parent().children('.range_max'),
            minVal = parseInt($(minBtn).val()),
            maxVal = parseInt($(maxBtn).val()),
            origin = $(this).context.className;

        if (origin === 'min' && minVal > maxVal - 2) {
            $(minBtn).val(maxVal - 2);
        }
        var minVal = parseInt($(minBtn).val());
        $(range_min).html(addSeparator(minVal));


        if (origin === 'max' && maxVal - 2 < minVal) {
            $(maxBtn).val(2 + minVal);
        }
        var maxVal = parseInt($(maxBtn).val());
        $(range_max).html(addSeparator(maxVal));
    }

    $('input[type="range"]').on('input', rangeInputChangeEventHandler);
}
ageFilter();
// (function() {

//     function addSeparator(nStr) {
//         nStr += '';
//         var x = nStr.split('.');
//         var x1 = x[0];
//         var x2 = x.length > 1 ? '.' + x[1] : '';
//         var rgx = /(\d+)(\d{3})/;
//         while (rgx.test(x1)) {
//             x1 = x1.replace(rgx, '$1' + '.' + '$2');
//         }
//         return x1 + x2;
//     }

//     function rangeInputChangeEventHandler(e){
//         var rangeGroup = $(this).attr('name'),
//             minBtn = $(this).parent().children('.min'),
//             maxBtn = $(this).parent().children('.max'),
//             range_min = $(this).parent().children('.range_min'),
//             range_max = $(this).parent().children('.range_max'),
//             minVal = parseInt($(minBtn).val()),
//             maxVal = parseInt($(maxBtn).val()),
//             origin = $(this).context.className;

//         if(origin === 'min' && minVal > maxVal-2){
//             $(minBtn).val(maxVal-2);
//         }
//         var minVal = parseInt($(minBtn).val());
//         $(range_min).html(addSeparator(minVal) );


//         if(origin === 'max' && maxVal-2 < minVal){
//             $(maxBtn).val(2+ minVal);
//         }
//         var maxVal = parseInt($(maxBtn).val());
//         $(range_max).html(addSeparator(maxVal));
//     }

//  $('input[type="range"]').on( 'input', rangeInputChangeEventHandler);
// })();