var tabla = iniciar_tabla(idioma_tr);
var csrftoken = $.cookie('csrftoken');

function iniciar_tabla(idioma){
    if (idioma==="es"){

        return $('#table-logs').DataTable({
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "bSort": false
        })

    }else if (idioma==="en"){

        return $('#table-logs').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "bSort": false
        })
    };
};

function formatdate(date) {
  var strp = date.split("T");
  var fecha = strp[0].split("-");
  var tiempo = strp[1].split(":");
  var hours = tiempo[0]
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  if (idioma_tr==="es"){
    var strTime = fecha[2]+"/"+fecha[1]+"/"+fecha[0]+" "+hours + ':' + tiempo[1] + ':' + tiempo[2] + ' ' + ampm;
  }else{
    var strTime = fecha[1]+"/"+fecha[2]+"/"+fecha[0]+" "+hours + ':' + tiempo[1] + ':' + tiempo[2] + ' ' + ampm;
  }
  return strTime;
}

if (idioma_tr==="es"){
    //Cambiar el idioma del date picker a español si este es el seleccionado
    $.extend($.fn.pickadate.defaults, {
      monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      today: 'Hoy',
      clear: 'Limpiar',
      close: 'Cerrar',
    });
}

//Inicializar el DatePicker
$('#f-desde').pickadate({
  format: 'd/m/yyyy',
  formatSubmit:'d/m/yyyy',
  selectYears: true,
  selectMonths: true,
})

//Inicializar el DatePicker
$('#f-hasta').pickadate({
  format: 'd/m/yyyy',
  formatSubmit:'d/m/yyyy',
  selectYears: true,
  selectMonths: true,
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

// cambiar unos iconos para que aparezcan en el timepicker
$('.icon-chevron-up').addClass('fa fa-chevron-up');
$('.icon-chevron-down').addClass('fa fa-chevron-down');


//Buscar logs de acuerdo a la seleccion
function busqueda(desde,hasta,horas,usr,evento){
    $.ajax({
        type:"POST",
        url: "/seguridad/logs/",
        data: {"desde": desde, "hasta": hasta, "horas":horas, "usr":usr, "evento":evento},
        success: function(data){
            var json_data = jQuery.parseJSON(data);
            
            //Limpiamos valores anteriores
            tabla.clear().draw();
            $("#Id_log").val("");
            $("#evento_detalle").val("");
            $("#fyh_detalle").val("");
            $("#terminal_detalle").val("");
            $("#usr_detalle").val("");
            $("#detalles_detalle").val("");

            //Manejamos los valores recibidos
            for (var i = 0; i < json_data.length; i++) {
                var a_id = json_data[i].pk
                var a_ev = json_data[i].fields.evento_idevento
                var a_terminal = json_data[i].fields.terminal
                var a_usuario = json_data[i].fields.usuario
                var a_detalles = json_data[i].fields.detalles
                //Transformar la fecha
                var fecha_data = json_data[i].fields.fecha_hora

                var a_fecha = formatdate(fecha_data)

                var td1 = '<td>'+ '<a evento ="' + a_ev + '" id="td-'+a_id + '" fecha = "' + a_fecha + '" terminal = "' + a_terminal + '" usuario = "' + a_usuario + '" detalles = "' + a_detalles + '" type="traza">' + a_fecha + '</a></td>';
                var td2 = '<td>' + a_usuario + '</td>';
                var td3 = '<td>' + eventos[a_ev-1] + '</td>';
                var td4 = '<td>' + a_detalles + '</td>';
                var td5 = '<td>' + a_terminal + '</td>';

                $('#table-logs > tbody').append('<tr id ="tr-'+a_id+'"></tr>');

                var jRow = $("#tr-"+a_id).append(td1,td2,td3,td4,td5);

                tabla.row.add(jRow).draw();
            }; 
            $('#processing-modal').modal('toggle');
        },
        error: function(q,error){
            alert(q.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error buscando los logs especificados.", "error");
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

    var usr = $('#usr-sel option:selected').text();
    var evento = $('#ev-sel').val();

    $('#processing-modal').modal('toggle');
    busqueda(desde,hasta,horas,usr,evento);
});

$('#cleanButton').on('click', function () {
    $('#h-desde').val("");
    $('#f-desde').val("");
    $('#h-hasta').val("");
    $('#f-hasta').val("");
    $('#usr-sel').val(-1);
    $('#ev-sel').val(-1);
    $("#bhoras").prop('checked',false);

    tabla.clear().draw();
    $("#Id_log").val("");

    $("#evento_detalle").val("");
    $("#fyh_detalle").val("");
    $("#terminal_detalle").val("");
    $("#usr_detalle").val("");
    $("#detalles_detalle").val("");
});

//Mostrar Detalle al hacer click en código de cuenta
$('#table-logs').on('click','a[type=traza]', function(event) {
    event.preventDefault();

    var a_idaux = $("#Id_log").val();
    var a_id = $(this).attr("id");
    var a_ev = $(this).attr("evento");
    var a_fecha = $(this).attr("fecha");
    var a_terminal = $(this).attr("terminal");
    var a_usr = $(this).attr("usuario");
    var a_detalles = $(this).attr("detalles");
    
    //Estilo de elemento elegido
    $('#'+a_idaux).parent().css("background-color","")
    $('#'+a_idaux).css("color","")
    $(this).parent().css("background-color","#337ab7")
    $(this).css("color","white")

    $("#Id_log").val(a_id);

    $("#evento_detalle").val(eventos[a_ev-1]);
    $("#fyh_detalle").val(a_fecha);
    $("#terminal_detalle").val(a_terminal);
    $("#usr_detalle").val(a_usr);
    $("#detalles_detalle").val(a_detalles);
});