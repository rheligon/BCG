//idioma_tr es una variable global definida en la pagina
var tabla = iniciar_tabla(idioma_tr);
var csrftoken = $.cookie('csrftoken');

function iniciar_tabla(idioma){

    if (idioma==="es"){

        return $('#table-reglas').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            }
        })

    }else if (idioma==="en"){

        return $('#table-reglas').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            }
        })
    };
};

$('#Cuenta-sel').change(function() {
  var cuentaId = $('#Cuenta-sel').val();

  if (cuentaId>=0){
    var sel = $('#opt-'+cuentaId);

    tabla.clear().draw();
    $('#processing-modal').modal('toggle');
    reglas(cuentaId);
  }
});

//Resaltar al hacer click en la regla
$('.table').on('click','a[type=edc]', function(event) {
    event.preventDefault();

    //Estilo de elemento elegido
    var a_id = $("#Id-regla").val();
    $('#'+a_id).parent().css("background-color","")
    $('#'+a_id).css("color","")
    $(this).parent().css("background-color","#337ab7")
    $(this).css("color","white")

    //asignacion de elemento seleccionado
    $("#Id-regla").val($(this).attr("id"));
});

//Rellenar pagina de acuerdo a la seleccion
function reglas(cuentaId){
    $.ajax({
        type:"POST",
        url: "/cuentas/estado",
        data: {"cuentaid": cuentaId},
        success: function(data){
            var carg = 0;
            var proc = 1;
            var ult_edc_conc = 0;
            var ult_edc_conp = 0;
            var ult_edc_corc = 0;
            var ult_edc_corp = 0;
            var ult_conc_existe = false;
            var ult_corc_existe = false;
            var ult_conp_existe = false;
            var ult_corp_existe = false;
            var json_data = jQuery.parseJSON(data)

            $('#processing-modal').modal('toggle');

        },
        error: function(error){
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error buscando la cuenta especificada.", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}