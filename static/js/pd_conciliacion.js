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

//Inicializar el DatePicker proc diario conciliacion
$('#pd_conc_fecha').pickadate({
  format: 'dd/mm/yyyy',
  selectYears: true,
  selectMonths: true,
})

//Al hacer click en ejecutar pdf
$('.pdf').on('click', function(){
  $('#tipoArch').val('pdf');
});

//Al hacer click en ejecutar excel
$('.xls').on('click', function(){
  $('#tipoArch').val('xls');
});

//Al hacer click en autorizar conciliacion
$('.autcon').on('click', function(e){
  e.preventDefault();
  
  $('#tipoArch').val('autcon');

  ufc = $('select option:selected').attr('ufc');
  ufh = $('select option:selected').attr('ufh');

  if (ufc === ufh){
      swal("Ups!","La fecha del último histórico y de la ultima conciliacion son iguales.","error");
  }else{
      swal({   title: "",
               text: "Seguro que desea autorizar la conciliacion al "+ ufc +" ?",
               type: "warning",
               showCancelButton: true,
               confirmButtonText: "Ok"},
               function(){
                    $('#pd_concform').submit();
                  }
          );
  }
});



//Funcion para añadir al POST el tipo de archivo
$('form').bind('submit', function(e) {

    if ($('#tipoArch').val() === 'autcon'){
      $(this).removeAttr("target");
    }

    $(this).attr('action', "/reportes/");
    
    $(this).append('<input type="hidden" name="tipoArch" value="' + $('#tipoArch').val() +'">');
});