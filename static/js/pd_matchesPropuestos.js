var csrftoken = $.cookie('csrftoken');
var tabla = iniciar_tabla(idioma_tr);


$('#Cuenta-sel').change(function() {
  var cuentaId = $('#Cuenta-sel').val();

  if (cuentaId!=''){
    var currenturl = $(location).attr("href");
    var aux = currenturl.split('/');
    var index = aux.indexOf('mPropuestos');

    if (aux[aux.length-1] != ""){
        //El url estaba incorrecto, falta / al final
        alert("URL incorrecto, falta '\/' al final.");
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

    console.log(rows.length);
     
    // Añade al POST los checkboxes que no estan visibles
    for ( var i = 0, len = rows.length; i < len; i++) {
        var $fields = $(rows[i]).find('input[type="checkbox"]:hidden:checked');
         
        $fields.each(function (idx, el) {
            inputs.push('<input type="hidden" name="' + $(el).attr('name') + '" value="' + $(el).val() +'">');
        });
    }
     
    $(this).append( inputs.join('') );
});
