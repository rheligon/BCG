var tabla = iniciar_tabla(idioma_tr);
var csrftoken = $.cookie('csrftoken');

function iniciar_tabla(idioma){
    if (idioma==="es"){

        return $('#table-logs').DataTable({
            language: {
                url: '/static/json/Spanish-tables.json'
            }
        })

    }else if (idioma==="en"){

        return $('#table-logs').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            }
        })
    };
};

//Inicializar el DatePicker
$('#f-desde').pickadate({
  format: 'd/m/yyyy',
})

//Inicializar el DatePicker
$('#f-hasta').pickadate({
  format: 'd/m/yyyy',
})


// Spinner de la hora
$('#h-desde').timepicker({
    minuteStep: 5,
    showInputs: false,
    disableFocus: true
});

// Spinner de la hora
$('#h-hasta').timepicker({
    minuteStep: 5,
    showInputs: false,
    disableFocus: true
});

// cambiar unos iconos para que aparezcan
$('.icon-chevron-up').addClass('fa fa-chevron-up');
$('.icon-chevron-down').addClass('fa fa-chevron-down');

//Rellenar encajes de acuerdo a la seleccion de cuenta
function busqueda(desde,hasta,horas){
    $.ajax({
        type:"POST",
        url: "/seguridad/logs/",
        data: {"desde": desde, "hasta": hasta, "horas":horas},
        success: function(data){
            console.log(data);
        },
        error: function(q,error){
            alert(q.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error buscando el encaje de la cuenta especificada.", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};

$('#SearchButton').on('click', function () {
    event.preventDefault();

    var hd = $('#h-desde').val();
    var fd = $('#f-desde').val();
    var hh = $('#h-hasta').val();
    var fh = $('#f-hasta').val();
    var horas = $("#bhoras").prop('checked') ? 1 : 0;
    if (horas===0){
        var desde = fd;
        var hasta = fh;
    }else{
        var desde = fd+"-"+hd;
        var hasta = fh+"-"+hh; 
    }

    busqueda(desde,hasta,horas);

});