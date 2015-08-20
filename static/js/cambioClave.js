var csrftoken = $.cookie('csrftoken');


//Boton guardar clave
$('#guardarButton').on('click', function () {
    var clave1 = $('#clave1').val();
    var clave2 = $('#clave2').val();
    
    if (clave1===("")){
        swal("Ups!","Debe introducir su nueva contraseña.","error");        
    }else if (clave2===("")){
        swal("Ups!","Debe introducir la verificación de la contraseña.","error");
    } else if (clave1 != clave2) {
        swal("Ups!","Las contraseñas deben coincidir","error");
    } else if (clave1.length < 6 || clave2.length < 6) {
        swal("Ups!","Las contraseñas deben tener una longitud de al menos seis (6) caractéres","error");
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
            if (mensaje === "Contraseña actualizada exitosamente"){
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
            swal("Ups!", "Hubo un error al guardar los cambios de la licencia", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}