var csrftoken = $.cookie('csrftoken');
var idioma = $('#idioma').val();
var msj = ""

//Boton para cargar MTn96
$('#cargarMT96Button').on('click', function () {
    var archivo = $('#mtn96_archivo').val()

    if (archivo===("-1")){
        if (idioma == 0){
            swal("Ups!","Debe seleccionar un archivo para cargar los datos.","error");        
        } else {
            swal("Ups!","You must select a file for the automatic load.","error");            
        }
    } else {
        
        if (idioma == 0){
            msj = "¿Seguro que desea cargar los mensajes MT desde el archivo seleccionado?";    
        } else {
            msj = "Sure you want load MTn96 messages from selected file?";             
        }
        swal({
            title: "",
            text: msj,
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Ok"},
            function(){
                $('#processing-modal').modal('toggle');
                //Llamar funcion de cargar del mensaje
                cargarmtn96(archivo);
            }
        ); 
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
            if (errorMensaje === "Caracter" || errorMensaje === "Unexpect" || errorMensaje === "No se ti"  || errorMensaje === "There ar" || errorMensaje === "El códig" || errorMensaje === "Response"  || errorMensaje === "El tipo " || errorMensaje === "Message "){

                $('#processing-modal').modal('toggle');
                swal("Ups", mensaje, "error");

            } else {
                $('#processing-modal').modal('toggle');
                if (idioma == 0){
                    swal("OK", "Archivo cargado exitosamente", "success");
                } else {
                    swal("OK", "Succesful loaded file", "success");
                }
                history.go(0);
                window.location.href = window.location.href;
            }
        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("Ups!", "Hubo un error al cargar el archivo", "error");
            } else { 
                swal("Ups!", "Error occurred at automatic load", "error");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}

 