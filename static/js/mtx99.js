var csrftoken = $.cookie('csrftoken');
var tabla_det = iniciar_tabla_detalle(idioma_tr);

//inicializar la tabla de destalles
function iniciar_tabla_detalle(idioma){

    if (idioma==="es"){

        return $('#table-detalle').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "scrollY": "200px",
            "dom": "frtiS",
            "scrollCollapse": true,
            "paging": false,
            "autoWidth": false,
            "columns": [
                { "width": "5%" },
                { "width": "10%" },
                { "width": "25%" },
                { "width": "5%" },
                { "width": "23%" },
                { "width": "23%" },
                { "width": "9%" },
              ],
        })

    }else if (idioma==="en"){

        return $('#table-detalle').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "scrollY": "200px",
            "dom": "frtiS",
            "scrollCollapse": true,
            "paging": false,
            "autoWidth": false,
            "columns": [
                 { "width": "5%" },
                { "width": "10%" },
                { "width": "25%" },
                { "width": "5%" },
                { "width": "23%" },
                { "width": "23%" },
                { "width": "9%" },
              ],
        })
    };
}

//Boton para buscar MTx99
$('#confButton').on('click', function () {
    var banco = $('#mtx99_banco').val()
    var tipo = $('#mtx99_tipo').val()
    $('#processing-modal').modal('toggle');
    buscarmtx99(banco,tipo);
});

//Buscar todos los MTx99 del banco y tipo seleccionados
function buscarmtx99(banco,tipo){
    $.ajax({
        type:"POST",
        url: "/mtx99/",
        data: {"banco99":banco, "tipo99":tipo, "action":"buscar"},
        success: function(data){
            tabla_det.clear().draw();
            var json_data = jQuery.parseJSON(data.mens);
            console.log(json_data)
            for (var i=0; i<json_data.length; i++){
    
                var td1 = '<td>' + json_data[i].fields.origen + '</td>';
                var td2 = '<td>' + json_data[i].fields.bic + '</td>';
                var td3 = '<td>' + json_data[i].fields.fecha.substring(0,10) + '</td>';
                var td4 = '<td>' + json_data[i].fields.tipo_mt + '</td>';
                var td5 = '<td>' + json_data[i].fields.codigo + '</td>';
                var td6 = '<td>' + json_data[i].fields.ref_relacion + '</td>';
                var td7 = '<td>' + json_data[i].fields.narrativa + '</td>';

                $('#table-detalle > tbody').append('<tr class="text-center" id ="tr-'+json_data[i].pk+"-"+i+'"></tr>');
                var jRow = $("#tr-"+json_data[i].pk+"-"+i).append(td1,td2,td3,td4,td5,td6,td7);
                tabla_det.row.add(jRow);

            }
            tabla_det.draw();
            $('#processing-modal').modal('toggle');
        },
        error: function(jqXHR, error){ 
            console.log("esta dando error")
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error procesando el archivo especificado.", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}
 