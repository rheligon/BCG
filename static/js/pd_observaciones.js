var csrftoken = $.cookie('csrftoken');
var idioma = $('#idioma').val();
var idiomaAux = "";
var msj ="";

if (idioma == 0){
    idiomaAux = "es";
} else {
    idiomaAux = "en";
}

var tabla_det = iniciar_tabla_detalle(idiomaAux);

//inicializar la tabla de destalles
function iniciar_tabla_detalle(idioma){

    if (idioma==="es"){

        return $('#table-observaciones').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "scrollY": "100px",
            "pageLength": 5,
            "lengthMenu": [5, 10, 25, 50, 75, 100 ],
            "paging": true,
            "autoWidth": false,
            "columns": [
                { "width": "20%" },
                { "width": "80%" },
              ],
        })

    }else if (idioma==="en"){

        return $('#table-observaciones').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "scrollY": "100px",
            "pageLength": 5,
            "lengthMenu": [5, 10, 25, 50, 75, 100 ],
            "paging": true,
            "autoWidth": false,
            "columns": [
                { "width": "20%" },
                { "width": "80%" },
              ],
        })
    };
}

//Boton para crear Observacion
$('#crearObservacion').on('click', function () {
    var descripcion = $('#observacion_desc_id').val()
    var clase = $('#tipo_transaccion').val();
    var id_transaccion = $('#id_transaccion').val();
    if (descripcion===""){
        if (idioma == 0){
            swal("Ups!","Debe Introducir la descripción de la observación.","error");        
        } else {
            swal("Ups!","You must introduce observation's description.","error");
        }
    }else{

        if (idioma == 0){
            msj ="¿Seguro que desea crear la observación para la transacción?";
        } else {
            msj= "Sure you want create the observation?";
        }
        swal({
            title: "",
            text: msj,
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Ok"},
            function(){
                $('#processing-modal').modal('toggle');
                //Llamar funcion de creación del mensaje
                crear_Ob(descripcion,clase,id_transaccion);
            }
        ); 
    };
});

//Crear observacion
function crear_Ob(descripcion,clase,id_transaccion){
    $.ajax({
        type:"POST",
        url: "/observaciones/"+id_transaccion+"/"+clase+"/",
        data: {"descripcion":descripcion, "clase":clase, "id_transaccion":id_transaccion, "action":"crear_ob"},
        success: function(data){
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("OK", "Observación agregada exitosamente", "success");    
            } else {
                swal("OK", "Successful aggregated observation", "success");
            }
            setTimeout(function(){
                window.location.reload();
            },1000);
        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("Ups!", "Hubo un error al intertar crear la observación", "error");
            } else {
                swal("Ups!", "Error occurred trying to create observation", "success");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}

//Boton para crear seguimiento
$('#crearSeguimiento').on('click', function () {
    var descripcion = $('#seguimiento_desc_id').val()
    var clase = $('#tipo_transaccion').val();
    var id_transaccion = $('#id_transaccion').val();
    if (descripcion===""){
        if (idioma == 0){
            swal("Ups!","Debe Introducir la descripción del seguimiento.","error");        
        } else {
            swal("Ups!","You must introduce tracing's description.","error");
        }
    }else{

        if (idioma == 0){
            msj ="¿Seguro que desea crear el seguimiento para la transacción?";
        } else {
            msj= "Sure you want create the tracing?";
        }
        swal({
            title: "",
            text: msj,
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Ok"},
            function(){
                $('#processing-modal').modal('toggle');
                //Llamar funcion de creación del mensaje
                crear_Seg(descripcion,clase,id_transaccion);
            }
        ); 
    };
});

//Crear seguimiento
function crear_Seg(descripcion,clase,id_transaccion){
    $.ajax({
        type:"POST",
        url: "/observaciones/"+id_transaccion+"/"+clase+"/",
        data: {"descripcion":descripcion, "clase":clase, "id_transaccion":id_transaccion, "action":"crear_Seg"},
        success: function(data){
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("OK", "Seguimiento agregado exitosamente", "success");    
            } else {
                swal("OK", "Successful aggregated tracing", "success");
            }
            setTimeout(function(){
                window.location.reload();
            },1000);
        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("Ups!", "Hubo un error al intertar crear el seguimiento", "error");
            } else {
                swal("Ups!", "Error occurred trying to create tracing", "success");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}

//Boton para modificar seguimiento
$('#modificarSeguimiento').on('click', function () {
    var descripcion = $('#seguimiento_desc_id').val()
    var clase = $('#tipo_transaccion').val();
    var id_transaccion = $('#id_transaccion').val();
    if (descripcion===""){
        if (idioma == 0){
            swal("Ups!","Debe Introducir la descripción del seguimiento.","error");        
        } else {
            swal("Ups!","You must introduce tracing's description.","error");
        }
    }else{

        if (idioma == 0){
            msj ="¿Seguro que desea modificar el seguimiento para la transacción?";
        } else {
            msj= "Sure you want modify the tracing?";
        }
        swal({
            title: "",
            text: msj,
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Ok"},
            function(){
                $('#processing-modal').modal('toggle');
                //Llamar funcion de creación del mensaje
                modificar_Seg(descripcion,clase,id_transaccion);
            }
        ); 
    };
});

//Modificar seguimiento
function modificar_Seg(descripcion,clase,id_transaccion){
    $.ajax({
        type:"POST",
        url: "/observaciones/"+id_transaccion+"/"+clase+"/",
        data: {"descripcion":descripcion, "clase":clase, "id_transaccion":id_transaccion, "action":"modificar_Seg"},
        success: function(data){
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("OK", "Seguimiento modificado exitosamente", "success");    
            } else {
                swal("OK", "Successful aggregated tracing", "success");
            }
            setTimeout(function(){
                window.location.reload();
            },1000);
        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("Ups!", "Hubo un error al intertar modificar el seguimiento", "error");
            } else {
                swal("Ups!", "Error occurred trying to modify tracing", "success");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}

