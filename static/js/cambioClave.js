var csrftoken = $.cookie('csrftoken');
var idioma = $('#idioma').val();
var msj ="";


//Boton guardar clave
$('#guardarButton').on('click', function () {
    var clave1 = $('#clave1').val();
    var clave2 = $('#clave2').val();
    
    if (clave1===("")){
        if (idioma == 0){
            swal("Ups!","Debe introducir su nueva contraseña.","error");        
        } else {
            swal("Ups!","You must introduce the new password.","error");
        }
    }else if (clave2===("")){
        if (idioma == 0){
            swal("Ups!","Debe introducir la verificación de la contraseña.","error");
        } else {
            swal("Ups!","You must introduce the password verification.","error");
        }
    } else if (clave1 != clave2) {
        if (idioma == 0){
            swal("Ups!","Las contraseñas deben coincidir","error");
        } else {
            swal("Ups!","Password and verification field must match","error");
        }
    } else if (clave1.length < 5 || clave2.length < 5) {
        if (idioma == 0){
            swal("Ups!","Las contraseñas deben tener una longitud de al menos cinco (5) caractéres","error");
        } else {
            swal("Ups!","Password and verification field must have a minimum of five (5) characters length","error");
        }
    }
    else {
        $('#processing-modal').modal('toggle');
        //Llamar funcion que guarda la contraseña
        guardarContraseña(clave1);
    };
});

//Guardar la contraseña
function guardarContraseña(clave){
    $.ajax({
        type:"POST",
        url: "/cambioClave/",
        data: {"clave":clave,"action":"guardarContraseña"},
        success: function(data){
            var mensaje = data.mens;
            if (mensaje === "Contraseña actualizada exitosamente" || mensaje === "Successfully updated password"){
                $('#processing-modal').modal('toggle');
                swal("OK", mensaje, "success");
                setTimeout(function(){
                    $(location).attr("href", '/');
                },2500);
            } else {
                $('#processing-modal').modal('toggle');
                swal("Ups!", mensaje, "error");
            }
        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma ==0){
                swal("Ups!", "Hubo un error tratando de guardar la nueva contraseña", "error");
            } else {
                swal("Ups!", "Error occurred trying to save the new password", "error");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}