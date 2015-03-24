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
})

$('#f-match').on('change', function () {
    $('#processing-modal').modal('toggle');
    busqueda($(this).val());
});


//Buscar logs de acuerdo a la seleccion
function busqueda(fecha){
    $.ajax({
        type:"POST",
        url: "/procd/match/",
        data: {"fecha": fecha},
        success: function(data){
            var json_data = jQuery.parseJSON(data);
            console.log(json_data);
            
            $('#Cuenta-sel > option').remove();
            $('#Cuenta-sel').append('<option value="-1">----------</option>');

            for (var i = 0; i < json_data.length; i++) {
                var a_id = json_data[i].pk
                var a_cod = json_data[i].fields.codigo

                $('#Cuenta-sel').append('<option value="'+a_id+'">'+a_cod+'</option>');
            };   
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