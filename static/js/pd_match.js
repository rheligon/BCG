var csrftoken = $.cookie('csrftoken');

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
$('#f-match').pickadate({
  format: 'd/m/yyyy',
  formatSubmit:'d/m/yyyy',
  selectYears: true,
  selectMonths: true,
  max: new Date()
})

//Al cambiar la fecha se llama a buscar cuentas para esa fecha
$('#f-match').on('change', function () {
    $('#processing-modal').modal('toggle');
    busqueda($(this).val());
});

//Llamar a matcher con la cuenta elegida
$('#matchButton').on('click', function () {
    var ctaid = $('#Cuenta-sel').val();
    var fecha = $('#f-match').val();
    if (fecha===""){
      swal("Ups!", "Porfavor elija una fecha primero.", "error");
    }else if (ctaid<=0){
      swal("Ups!", "Porfavor elija una cuenta primero.", "error");
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
      swal("Ups!", "Porfavor elija una fecha primero.", "error");
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
      swal("Ups!", "Porfavor elija una fecha primero.", "error");
    }else if (ctaid<=0){
      swal("Ups!", "Porfavor elija una cuenta primero.", "error");
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
            swal("Ups!", "Hubo un error buscando las cuentas para la fecha especificada.", "error");
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
            swal("Ups!", "Hubo un error procesando la cuenta para la fecha especificada, verifique que el servidor este iniciado.", "error");
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
            swal("Ups!", "Hubo un error liberando la cuenta para la fecha especificada.", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};