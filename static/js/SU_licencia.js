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
  min: true,
});

$("#numUserLicencia").TouchSpin({
    verticalbuttons: true,
    verticalupclass: 'glyphicon glyphicon-plus',
    verticaldownclass: 'glyphicon glyphicon-minus',
    min: 1,
    max: 100,
    step: 1,
});


// funcion para aceptar solo numeros
function solonumero(e) {
    var codigo;
    codigo = (document.all) ? e.keyCode : e.which;
    if (codigo > 31 && (codigo < 48 || codigo > 57) ) {
    return false;
    }
    return true;
};

//Boton para salvar los cambios realizados
$('#guardarCambiosButton').on('click', function () {
    
    var numUsers = $('#numUserLicencia').val();
    var fecha = $('#expiracionLicencia').val();
    var fechaAux = $('#expiracionLicenciaAux').val();
    var usersAux = $('#numUserLicenciaAux').val();
    console.log(numUsers);
    console.log(usersAux);
    console.log(fecha);
    console.log(fechaAux);

    if (numUsers === ""){
        numUsers = usersAux;
        if (usersAux < 1) {
            swal("Ups!","Al menos debe tener 1 usuario en sistema.","error");        
        }
    } 

    if (fecha===""){
        fecha = fechaAux
        if (fechaAux ===""){
            swal("Ups!","Debe seleccionar una fecha de expiración para la licencia.","error");
        }
    }
    
    var auxdate = new Date();
    var dd = auxdate.getDate();
    var mm = auxdate.getMonth()+1; //January is 0!
    var yyyy = auxdate.getFullYear();
    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    }

    var aux = fecha.split("/");
    var day = "";
    var month = "";
    
    if (aux[0].length < 2 && parseInt(aux[0])<10){
        day = '0'+aux[0];
    } else {
        day = aux[0];
    }

    if (aux[1].length < 2 && parseInt(aux[1])<10){
        month = '0'+aux[1];
    } else {
        month = aux[1];
    }        

    var fecha0 = day+"/"+month+"/"+aux[2];
    fecha = aux[2]+"-"+month+"-"+day;
    auxdate = yyyy+'-'+mm+'-'+dd;
    fecha = new Date(fecha);
    auxdate = new Date(auxdate);

    if (fecha < auxdate){
        swal("Ups!","La fecha seleccionada debe ser mayor a la fecha de hoy.","error");        
    } else {

        swal({
            title: "",
            text: "¿Seguro que desea guardar los cambios en la licencia?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Ok"},
            function(){
                $('#processing-modal').modal('toggle');
                //Llamar funcion de guardar cambios
                guardarCambios(numUsers,fecha0);
            }
        ); 
    }

});

//Guardar Cambios en la base de datos 
function guardarCambios(numUsers,fecha){
    $.ajax({
        type:"POST",
        url: "/SU/licencia/",
        data: {"numUsers":numUsers, "action":"guardarCambios", "fecha":fecha},
        success: function(data){
            var mensaje = data.mens;
            $('#processing-modal').modal('toggle');
            swal("OK", mensaje, "success");
        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error al guardar los cambios de la licencia", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}