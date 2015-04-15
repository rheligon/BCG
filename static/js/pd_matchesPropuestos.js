var csrftoken = $.cookie('csrftoken');
var tabla = iniciar_tabla(idioma_tr);

$('#Cuenta-sel').change(function() {
  var cuentaId = $('#Cuenta-sel').val();

  if (cuentaId!=''){
    tabla.clear().draw();
    $('#processing-modal').modal('toggle');
    busqueda(cuentaId);
  }else{
    tabla.clear().draw();
    //Poner todo en blanco
  }
});

function iniciar_tabla(idioma){

    if (idioma==="es"){

        return $('#table-pa').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "scrollY": "350px",
            "dom": "frtiS",
            "scrollCollapse": true,
            "deferRender": true,
            "orderClasses": false,
            "ordering":  false,
        })

    }else if (idioma==="en"){

        return $('#table-pa').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "scrollY": "350px",
            "dom": "frtiS",
            "scrollCollapse": true,
            "deferRender": true,
            "orderClasses": false,
            "ordering":  false,
        })
    };
};

//Buscar logs de acuerdo a la seleccion
function busqueda(ctaid){
    $.ajax({
        type:"POST",
        url: "/procd/mPropuestos/",
        data: {"ctaid": ctaid, 'action':'buscar'},
        success: function(data){
            var find = 'py\/reduce';
            var re = new RegExp(find, 'g');
            var json_mpf = jQuery.parseJSON(data.mpf.replace(re,'fields'));
            console.log(json_mpf[0].fields[2]._ta_conta_cache);
            for (var i = 0; i < 0; i++) {
                matchProp = json_mpf[i].fields[2];
                //Sacar _ta_conta_cache, _ta_corres_cache
            }

            //var edc_conta = jQuery.parseJSON(data.edcj_conta);
            //var edc_corr = jQuery.parseJSON(data.edcj_corr);

            // for (var i = 0; i < json_conta.length; i++) {
            //     var a_id = json_conta[i].pk;
            //     var a_cod = json_conta[i].fields.codigo;

            //     var td1 = '<td>' + json_conta[i].fields.campo86_940 + '</td>';
            //     var td2 = '<td>' + json_conta[i].fields.pagina + '</td>';
            //     var td3 = '<td>' + dateFormat(json_conta[i].fields.fecha_valor) + '</td>';
            //     var td4 = '<td>' + json_conta[i].fields.codigo_transaccion + '</td>';
            //     var td5 = '<td>' + vacio(json_conta[i].fields.referencianostro) + '</td>';
            //     var td6 = '<td>' + vacio(json_conta[i].fields.referenciacorresponsal) + '</td>';
            //     var td7 = '<td>' + vacio(json_conta[i].fields.descripcion) + '</td>';
            //     var td8 = '<td>' + json_conta[i].fields.credito_debito + '</td>';
            //     var td9 = '<td>' + json_conta[i].fields.monto + '</td>';
            //     var td10 = '<td>L</td>';
            //     var td11 = '<td>S</td>';

            //     $('#table-pa > tbody').append('<tr id ="trconta-'+a_id+'"></tr>');

            //     var jRow = $("#trconta-"+a_id).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10,td11);
            //     tabla.row.add(jRow);
            //     prog++;
            //     $('#proctxt').text(Math.round(max/prog)*100);
            // };

            //tabla.draw();
            $('#processing-modal').modal('toggle');
        },
        error: function(q,error){
            alert(q.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error buscando las cuentas para la fecha especificada.", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};
