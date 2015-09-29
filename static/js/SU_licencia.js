var csrftoken = $.cookie('csrftoken');
var idioma = $('#idioma').val();
var idiomaAux = "";
var msj ="";

if (idioma == 0){
    idiomaAux = "es"
} else {
    idiomaAux = "en"
}


//Cambiar el idioma del date picker a español si este es el seleccionado
if (idiomaAux==="es"){
    $.extend($.fn.pickadate.defaults, {
      monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      today: 'Hoy',
      clear: 'Limpiar',
      close: 'Cerrar',
    });
}

//Inicializar el DatePicker
if (idioma == 0){
    $('#expiracionLicencia').pickadate({
      format: 'dd/mm/yyyy',
      formatSubmit:'dd/mm/yyyy',
      selectYears: true,
      selectMonths: true,
      min: true,
    });
} else{
    $('#expiracionLicencia').pickadate({
      format: 'yyyy/mm/dd',
      formatSubmit:'dd/mm/yyyy',
      selectYears: true,
      selectMonths: true,
      min: true,
    });
}

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
    var version_lic = $('#versionID').val();
    var versionAux = $('#versionAuxID').val();

    if (numUsers === ""){
        numUsers = usersAux;
        if (usersAux < 1) {
            if (idioma == 0){
                swal("Ups!","Al menos debe tener 1 usuario en sistema.","error");        
            } else {
                swal("Ups!","The system must have at least one user.","error");        
            }
        }
    } 

    if (fecha===""){
        fecha = fechaAux
        if (fechaAux ===""){
            if (idioma == 0){
                swal("Ups!","Debe seleccionar una fecha de expiración para la licencia.","error");        
            } else {
                swal("Ups!","You must select a license expiration date.","error");        
            }
        }
    }

    if (version_lic===""){
        version_lic = versionAux
        if (versionAux ===""){
            if (idioma == 0){
                swal("Ups!","Debe introducir la versión de matcher.","error");        
            } else {
                swal("Ups!","You must introduce matcher version.","error");        
            }
        }
    }
    
    var auxdate = new Date();
    var dd = auxdate.getDate()+1;
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
    if (idioma == 1){
        bla = parseInt(aux[2])+1;
        bla2 = bla - 1
        if (bla < 10){
            bla = "0" + bla.toString();
            bla2 = "0" + bla2.toString();
        } else {
            bla = bla.toString();
            bla2 = bla2.toString();
        }
        fecha = day+"-"+month+"-"+ bla;
        var auxff = bla2 + "/" + month + "/" + day;
    } else {
         bla = parseInt(aux[0]);
        if (bla < 10){
            bla = "0" + bla.toString();
        } else {
            bla = bla,toString();
        }
        fecha = month+"-"+bla+"-"+ aux[2]; 
    }
    fecha = new Date(fecha);
    auxdate = new Date(auxdate);

    if (fecha <= auxdate){
        if (idioma == 0){
                swal("Ups!","La fecha seleccionada debe ser mayor a la fecha de hoy.","error");
        } else {
            swal("Ups!","Selected date must be greater than today","error");        
        }        
    } else {

        if (idioma == 0){
            msj = "¿Seguro que desea guardar los cambios en la licencia?";
        } else {
            msj = "Sure you want to save license changes?"
        } 
        swal({
            title: "",
            text: msj,
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Ok"},
            function(){
                $('#processing-modal').modal('toggle');
                //Llamar funcion de guardar cambios
                if (idioma == 0){
                    guardarCambios(numUsers,fecha0,version_lic);
                } else {
                    guardarCambios(numUsers,auxff,version_lic);
                }
            }
        ); 
    }

});

//Guardar Cambios en la base de datos 
function guardarCambios(numUsers,fecha,version){
    $.ajax({
        type:"POST",
        url: "/SU/licencia/",
        data: {"numUsers":numUsers, "action":"guardarCambios", "fecha":fecha, "version":version},
        success: function(data){
            var mensaje = data.mens;
            $('#processing-modal').modal('toggle');
            swal("OK", mensaje, "success");
        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("Ups!", "Hubo un error al guardar los cambios de la licencia", "error");
            } else {
                swal("Ups!", "Error occured trying to save license changes", "error");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}

//Boton para el reset de todos los passwords
$('#resetButton').on('click', function () {
    
    swal({
        title: "",
        text: "¿Está seguro de que desea continuar?. Le recordamos que todas las contraseñas en base de datos que no sean de usuarios LDAP serán cambiadas a '12345'",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Ok"},
        function(){
            $('#processing-modal').modal('toggle');
            //Llamar funcion de creación del mensaje
            resetPasswords();
        }
    );
});

//Resetear todos los passwords en la base de datos 
function resetPasswords(){
    $.ajax({
        type:"POST",
        url: "/SU/licencia/",
        data: {"action":"reset"},
        success: function(data){
            var mensaje = data.mens;
            if (mensaje === "Cambios realizados con éxito"){
                $('#processing-modal').modal('toggle');
                swal("OK", mensaje, "success");    
            } else {
                $('#processing-modal').modal('toggle');
                swal("Ups!", mensaje, "error");
            }
        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("Ups!", "Hubo un error al resetear los passwords", "error");
            } else {
                swal("Ups!", "Error occured trying to reset password", "error");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}