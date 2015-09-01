var csrftoken = $.cookie('csrftoken');
var idioma = $('#idioma').val();
var idiomaAux = "";
var msj ="";

if (idioma == 0){
    idiomaAux = "es"
} else {
    idiomaAux = "en"
}

if (idiomaAux==="es"){
    //Cambiar el idioma del date picker a español si este es el seleccionado
    $.extend($.fn.pickadate.defaults, {
      monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      today: 'Hoy',
      clear: 'Limpiar',
      close: 'Cerrar',
    });
}

//inicializamos el DatePicker para Fecha ejecutar
if (idioma == 0){
    $('#f-match').pickadate({
    format: 'dd/mm/yyyy',
    formatSubmit:'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
    });
} else {
    $('#f-match').pickadate({
    format: 'yyyy/mm/dd',
    formatSubmit:'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
    });
}

//Al cambiar la fecha se llama a buscar cuentas para esa fecha
$('#f-match').on('change', function () {
    $('#processing-modal').modal('toggle');
    if (idioma != 0){
      var Aux = $(this).val().split("/");
      var fecha_aux = Aux[2] + "/" + Aux[1] + "/" + Aux[0];
      busqueda(fecha_aux);
    } else {
      busqueda($(this).val());
    }
});

//Llamar a matcher con la cuenta elegida
$('#matchButton').on('click', function () {
    var ctaid = $('#Cuenta-sel').val();
    var fecha = $('#f-match').val();
    if (fecha===""){
      if (idioma == 0) {
        swal("Ups!", "Por favor elija una fecha primero.", "error");
      } else {
        swal("Ups!", "Select a date first please.", "error");
      }
    }else if (ctaid<=0){
      if (idioma == 0) {
        swal("Ups!", "Por favor elija una cuenta primero.", "error");
      } else {
        swal("Ups!", "Select an account first please.", "error");
      }
    }else{
      $('#processing-modal').modal('toggle');
      matcher(ctaid,fecha,'match');
    }
});

//Llamar a matcher con cuentas propias
$('#cpButton').on('click', function () {
    var ctaid = $('#Cuenta-sel').val();
    var fecha = $('#f-match').val();
    if (fecha === ""){
      if (idioma == 0) {
        swal("Ups!", "Por favor elija una fecha primero.", "error");
      } else {
        swal("Ups!", "Select a date first please.", "error");
      }
    }else{
      $('#processing-modal').modal('toggle');
      matcher(0,fecha,'matchcp');
    }
});

//Liberar una cuenta tomada
$('#liberarButton').on('click', function () {
    var ctaid = $('#Cuenta-sel').val();
    var fecha = $('#f-match').val();
    if (fecha === ""){
      if (idioma == 0) {
        swal("Ups!", "Por favor elija una fecha primero.", "error");
      } else {
        swal("Ups!", "Select a date first please.", "error");
      }
    }else if (ctaid<=0){
      if (idioma == 0) {
        swal("Ups!", "Por favor elija una cuenta primero.", "error");
      } else {
        swal("Ups!", "Select an account first please.", "error");
      }
    }else{
      $('#processing-modal').modal('toggle');
      liberar(ctaid);
    }
});

//Buscar logs de acuerdo a la seleccion
function busqueda(fecha){
    $.ajax({
        type:"POST",
        url: "/procd/match/",
        data: {"fecha": fecha, 'action':'buscar'},
        success: function(data){
            var json_data = jQuery.parseJSON(data);
            
            $('#Cuenta-sel > option').remove();
            $('#Cuenta-sel').append('<option value="-1">----------</option>');

            for (var i = 0; i < json_data.length; i++) {
                var a_id = json_data[i].pk
                var a_cod = json_data[i].fields.codigo

                $('#Cuenta-sel').append('<option value="'+a_id+'">'+a_cod+'</option>');
                if (i==0){
                  $('#Cuenta-sel').val(a_id);
                };
            };
            $('#processing-modal').modal('toggle');
        },
        error: function(q,error){
            //alert(q.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
              swal("Ups!", "Hubo un error buscando las cuentas para la fecha especificada.", "error");
            } else {
               swal("Ups!", "Error occurred searching the accounts on date value.", "error");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};

//Llamar a matcher
function matcher(ctaid,fecha,action){
    $.ajax({
        type:"POST",
        url: "/procd/match/",
        data: {"fecha": fecha,'ctaid':ctaid, 'action':action},
        success: function(data){
            var msg = data.msg.split('*');
            msg.splice(0,1);
            if (data.match){
            swal({   title: "",
                     text: msg.join('\n'),
                     type: "success",
                     confirmButtonText: "Ok" });
            }else{
              swal({   title: "",
                       text: msg.join('\n'),
                       type: "error",
                       confirmButtonText: "Ok" });
            }

            $('#processing-modal').modal('toggle');
        },
        error: function(q,error){
            //alert(q.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
              swal("Ups!", "Hubo un error procesando la cuenta para la fecha especificada, verifique que el servidor de match se encuentre en correcto funcionamiento.", "error");
            } else {
               swal("Ups!", "Error occurred processing the account on date value, please verify the match server status.", "error");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};

//Buscar logs de acuerdo a la seleccion
function liberar(ctaid){
    $.ajax({
        type:"POST",
        url: "/procd/match/",
        data: {'ctaid':ctaid, 'action':'liberar'},
        success: function(data){
            var msg = data.msg;
            swal({   title: "",
                     text: msg,
                     type: "success",
                     confirmButtonText: "Ok" });
            $('#processing-modal').modal('toggle');
        },
        error: function(q,error){
            //alert(q.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
              swal("Ups!", "Hubo un error liberando la cuenta para la fecha especificada.", "error");
            } else {
               swal("Ups!", "Error occurred seting free the account on date value.", "error");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};