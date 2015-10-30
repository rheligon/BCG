var csrftoken = $.cookie('csrftoken');
var idioma = $('#idioma').val();
var idiomaAux = "";

if (idioma == 0){
    idiomaAux = "es";
} else {
    idiomaAux = "en";
}

var tabla_det = iniciar_tabla_detalle(idiomaAux);
var tabla_det96 = iniciar_tabla_detalle96(idiomaAux);

//inicializar la tabla de destalles
function iniciar_tabla_detalle(idioma){

    if (idioma==="es"){

        return $('#table-mtn95').DataTable({
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
                { "width": "5%" },
                { "width": "15%" },
                { "width": "10%" },
                { "width": "10%" },
                { "width": "5%" },
                { "width": "28%" },
                { "width": "27%" },
              ],
        })

    }else if (idioma==="en"){

        return $('#table-mtn95').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "scrollY": "100px",
            "pageLength": 5,
            "lengthMenu": [5, 10, 25, 50, 75, 100 ],
            "paging": true,
            "autoWidth": false,
            "columns": [
                { "width": "5%" },
                { "width": "15%" },
                { "width": "10%" },
                { "width": "10%" },
                { "width": "5%" },
                { "width": "28%" },
                { "width": "27%" },
              ],
        })
    };
}

//inicializar la tabla de destalles96
function iniciar_tabla_detalle96(idioma){

    if (idioma==="es"){

        return $('#table-mtn96').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "scrollY": "100px",
            "pageLength": 5,
            "lengthMenu": [5, 10, 25, 50, 75, 100 ],
            "paging": true,
            "autoWidth": true,
            "columns": [
                { "width": "5%" },
                { "width": "15%" },
                { "width": "10%" },
                { "width": "10%" },
                { "width": "5%" },
                { "width": "28%" },
                { "width": "27%" },
              ],
        })

    }else if (idioma==="en"){

        return $('#table-mtn96').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "scrollY": "100px",
            "pageLength": 5,
            "lengthMenu": [5, 10, 25, 50, 75, 100 ],
            "paging": true,
            "autoWidth": true,
            "columns": [
                { "width": "5%" },
                { "width": "15%" },
                { "width": "10%" },
                { "width": "10%" },
                { "width": "5%" },
                { "width": "28%" },
                { "width": "27%" },
              ],
        })
    };
}

if (idiomaAux==="es"){
    //Cambiar el idioma del date picker a español si este es el seleccionado
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
    $('#f-desdeMT').pickadate({
      format: 'dd/mm/yyyy',
      formatSubmit:'d/m/yyyy',
      selectYears: true,
      selectMonths: true,
      max: true,
    });
} else {
    $('#f-desdeMT').pickadate({
      format: 'yyyy/mm/dd',
      formatSubmit:'dd/mm/yyyy',
      selectYears: true,
      selectMonths: true,
      max: true,
    });
}

//Boton para crear MTn95
$('#crearMT95Button').on('click', function () {
    var ref_mensaje = $('#refmensaje').val();
    var ref_mensaje_original = $('#refmensajeoriginal').val();
    var tipo = $('#tipo').val();
    var fecha = $('#f-desdeMT').val();
    if (($('#mt95cod').val())==undefined){
        var codigo = "-1";
    } else {
        var codigo = $('#mt95cod').val().split("-")[0];
    }
    var codigo2 = $('#mt95cod').val().split("-")[2];
    var narrativa = $('#mt95cod').val().split("-")[1];
    var original = $('#narrativa').val();
    var tipoOriginal = $('#claseOriginal').val();
    var pregunta = codigo2;
    var transaccion = $('#partida').val();
    var cuenta = $('#cta').val();
    var clase = $('#tipo_trans').val();
    if (fecha !=""){
        var arregloFecha = fecha.split("/")
        if (arregloFecha[0].length == 1){
            arregloFecha[0] = "0" + arregloFecha[0];
        }
        if (arregloFecha[1].length == 1){

            arregloFecha[1] = "0" + arregloFecha[1];
        }

        if (idioma == 0){
            fecha = arregloFecha[0]+"/"+arregloFecha[1]+"/"+arregloFecha[2];
        } else {
            fecha = arregloFecha[2]+"/"+arregloFecha[1]+"/"+arregloFecha[0];
        }
    }
    if (ref_mensaje.length===0){
        if (idioma == 0 ){
            swal("Ups!","Debe colocar la referencia del mensaje.","error");    
        } else {
             swal("Ups!","Message reference can not be empty.","error");
        }
    }else if(ref_mensaje_original.length===0){
        if (idioma == 0 ){
            swal("Ups!","Debe colocar la referencia del mensaje original","error");
        } else {
             swal("Ups!","Original message reference can not be empty.","error");
        }       
    }else if (codigo ===("-1")){
        if (idioma == 0 ){
            swal("Ups!","Debe seleccionar un codigo de Mensaje MT.","error");  
         } else {
             swal("Ups!","You must select a MT message code.","error");
        }        
    }else{

        if (idioma == 0){
            msj ="¿Seguro que desea crear el mensaje MT?";
        } else{
            msj ="Sure you want to create MT message?";
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
                crearmt95(ref_mensaje,ref_mensaje_original,tipo,fecha,codigo,pregunta,narrativa,original,transaccion,clase,cuenta,codigo2,tipoOriginal);
    
            }
        );
    };
});

//Crear mensajes MT95
function crearmt95(ref_mensaje,ref_mensaje_original,tipo,fecha,codigo,pregunta,narrativa,original,transaccion,clase,cuenta,codigo2,tipoOriginal){
    $.ajax({
        type:"POST",
        url: "/procd/detallesMT/"+transaccion+"/"+clase+"/"+cuenta+"/",
        data: {"ref95":ref_mensaje, "refOrg95":ref_mensaje_original, "tipo95":tipo, "fecha95":fecha, "cod95":codigo, "preg95":pregunta, "narrativa95":narrativa, "original95":original, "transaccion":transaccion, "action":"crearMT95", "clase":clase, "cuenta":cuenta, "codigo2":codigo2, "tipoOriginal":tipoOriginal},
        success: function(data){
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("OK", "Mensaje creado exitosamente", "success");
            } else {
                swal("OK", "Successful created message", "success");
            }
            setTimeout(function(){
                history.go(0);
                window.location.href = window.location.href;
            },1000);
            

        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("Ups!", "Hubo un error al intertar crear el mensaje", "error");
            } else {
                swal("Ups!", "Error occurred trying to create the message", "error");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}
