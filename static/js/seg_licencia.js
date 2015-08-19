var csrftoken = $.cookie('csrftoken');

//Boton para cargar MTn96
$('#cargarLicButton').on('click', function () {
    var archivo = $('#archivoLic').val()

    if (archivo===("-1")){
        swal("Ups!","Debe seleccionar un archivo para cargar los datos.","error");        
    } else {
        
        $('#processing-modal').modal('toggle');
    
        //Llamar funcion de cargar licencia
        cargarLicencia(archivo);
    }

});

//Cargar licencia desde archivo
function cargarLicencia(archivo){
    $.ajax({
        type:"POST",
        url: "/seguridad/licencia/",
        data: {"action":"cargarLicencia", "archivo":archivo},
        success: function(data){
            var mensaje = data.mens;

            if (mensaje === "Problemas con el archivo"){

                $('#processing-modal').modal('toggle');
                swal("Ups!", mensaje, "error");

            } else {
           
                $('#processing-modal').modal('toggle');
                swal("OK", mensaje, "success");
            }
        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error al cargar el archivo", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}

 