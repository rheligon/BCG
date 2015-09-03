var csrftoken = $.cookie('csrftoken');
var idioma = $('#idioma').val();
var msj ="";



//Boton para cargar MTn96
$('#cargarLicButton').on('click', function () {
    var archivo = $('#archivoLic').val()

    if (archivo===("-1")){
        if (idioma == 0){
            swal("Ups!","Debe seleccionar un archivo para cargar los datos.","error");        
        } else {
            swal("Ups!","You must select a load file first.","error");            
        }
    } else {
        if (idioma == 0){
            msj = "¿Seguro que desea cargar la licencia desde el archivo seleccionado?";
        } else {
            msj ="Sure you want load license from selected file?";
        }
        swal({
            title: "",
            text: msj,
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Ok"},
            function(){
                $('#processing-modal').modal('toggle');
                //Llamar funcion de cargar licencia
                cargarLicencia(archivo);
            }
        ); 
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
            if (mensaje === "Problemas con el archivo" || mensaje == "Wrong file data"){

                $('#processing-modal').modal('toggle');
                swal("Ups!", mensaje, "error");

            } else if (mensaje == "Los datos del archivo han sido corrompidos. Por lo tanto no podrá cargar la licencia." || mensaje == "License data corrupted. Therefore you can not load the license."){
        
                $('#processing-modal').modal('toggle');
                swal("Ups!", mensaje, "error");

            }else if (mensaje == "El campo Bic no coincide con el registrado para su empresa." || mensaje == "File bic does not match with your company bic."){
        
                $('#processing-modal').modal('toggle');
                swal("Ups!", mensaje, "error");

            }else {
           
                $('#processing-modal').modal('toggle');
                swal("OK", mensaje, "success");
            }
        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("Ups!", "Hubo un error al cargar el archivo", "error");
            } else {
                swal("Ups!", "Error occurred trying to load the file data", "error");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}

 