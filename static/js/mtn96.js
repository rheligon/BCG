    var csrftoken = $.cookie('csrftoken');

//Boton para cargar MTn96
$('#cargarMT96Button').on('click', function () {
    var archivo = $('#mtn96_archivo').val()

    if (archivo===("-1")){
        swal("Ups!","Debe seleccionar un archivo para cargar los datos.","error");        
    } else {
        
        $('#processing-modal').modal('toggle');
    
        //Llamar funcion de cargar del mensaje
        cargarmtn96(archivo);
    }

});

//Cargar mensajes desde archivo
function cargarmtn96(archivo){
    $.ajax({
        type:"POST",
        url: "/mtn96/",
        data: {"action":"cargar", "archivo96":archivo},
        success: function(data){
            var errorMensaje = data.mens.substring(0,8);
            var mensaje = data.mens;
            if (errorMensaje === "Caracter" || errorMensaje === "No se ti"  || errorMensaje === "El códig" || errorMensaje === "El tipo "){

                $('#processing-modal').modal('toggle');
                swal("Ups", mensaje, "error");

            } else {
                $('#processing-modal').modal('toggle');
                swal("OK", "Archivo cargado exitosamente", "success");
                window.location.reload();
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

 