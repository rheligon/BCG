var csrftoken = $.cookie('csrftoken');
var idiomaAux = "";
var msj ="";
var centinela = true;

if (idioma == 0){
    idiomaAux = "es"
} else {
    idiomaAux = "en"
}

var tabla = iniciar_tabla(idiomaAux);


$('#Cuenta-sel').change(function() {
  var cuentaId = $('#Cuenta-sel').val();

  if (cuentaId!=''){
    var currenturl = $(location).attr("href");
    var aux = currenturl.split('/');
    var index = aux.indexOf('mPropuestos');

    if (aux[aux.length-1] != ""){
        if (idioma == 0){
            //El url estaba incorrecto, falta / al final
            alert("URL incorrecto, falta '\/' al final.");
        } else{
            //El url estaba incorrecto, falta / al final
            alert("Wrong URL, missing '\/' at the end.");
        }
    }else{

        $('#processing-modal').modal('toggle');
        
        if (index != aux.length-2){
            //Existe una cuenta

            //Eliminar cuenta existente
            aux.pop();
            aux.pop();
            //Agregar nueva cuenta
            aux.push(cuentaId);
            aux.push('');

            //Crear url
            var url = aux.join('/');
            //Redireccionar
            $(location).attr("href", url);
        }else{
            var url = currenturl + cuentaId + '\/'
            $(location).attr("href", url);
        }

    }
  }else{
    tabla.fnClearTable();
  }
});

$(document).ready(function() {
    //Al cargar la pagina se coloca en el select el valor de la cuenta elegida
    $('#Cuenta-sel').val($('#id-cuenta').val());

    //Se coloca un timeout para la alerta si existe        
    setTimeout(
        function(){ 
            $('#msgAlert').prop('hidden', true);
        },
        6000
    );
});


function iniciar_tabla(idioma){

    if (idioma==="es"){

        return $('#table-pa').dataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "scrollY": "350px",
            "dom": "frtS",
            "scrollCollapse": true,
            "deferRender": true,
            "orderClasses": false,
            "ordering":  false,
        })

    }else if (idioma==="en"){

        return $('#table-pa').dataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "scrollY": "350px",
            "dom": "frtS",
            "scrollCollapse": true,
            "deferRender": true,
            "orderClasses": false,
            "ordering":  false,
        })
    };
};


//Funcion para añadir al POST los checkboxes que no estan visibles
$('form').bind('submit', function(e) {
    var rows   = tabla.fnGetNodes(), inputs = [];

    //Obtener el csrf token 
    var csrf = $(this).find('input[name="csrfmiddlewaretoken"]');
    //Incluir el token en el form para que se acepte el post
    inputs.push('<input type="hidden" name="' + csrf.attr('name') + '" value="' + csrf.val() +'">');

    // Añade al POST los checkboxes que no estan visibles
    for ( var i = 0, len = rows.length; i < len; i++) {
        var $fields = $(rows[i]).find('input[type="checkbox"]');
         
        $fields.each(function (idx, el) {
            if (!$(this).is(':checked')){
                inputs.push('<input type="hidden" name="' + $(el).attr('name') + '" value="' + $(el).val() +'">');
            }
        });
    }

    //Quito del form todos los checkboxes seleccionados
    $(this).empty();

    //Añado el token csrf y los checkboxes que no estan seleccionados
    $(this).append(inputs.join(''));
});
