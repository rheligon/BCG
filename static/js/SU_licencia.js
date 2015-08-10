var csrftoken = $.cookie('csrftoken');

//Cambiar el idioma del date picker a español si este es el seleccionado
if (idioma_tr==="es"){
    $.extend($.fn.pickadate.defaults, {
      monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      today: 'Hoy',
      clear: 'Limpiar',
      close: 'Cerrar',
    });
}

//Inicializar el DatePicker
$('#expiracionLicencia').pickadate({
  format: 'd/m/yyyy',
  formatSubmit:'d/m/yyyy',
  selectYears: true,
  selectMonths: true,
  max:true
})

//Inicializar el DatePicker
$('#expiracionLicencia').pickadate({
  format: 'd/m/yyyy',
  formatSubmit:'d/m/yyyy',
  selectYears: true,
  selectMonths: true,
  max:true
});
 //inicializar spinner para numero de usuarios
$( 'numUserLicencia' ).spinner({
});