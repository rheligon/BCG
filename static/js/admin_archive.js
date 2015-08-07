var csrftoken = $.cookie('csrftoken');
var t_conta = iniciar_tabla(idioma_tr,'conta');

/*
$( document ).ready(function() {
        setInterval(function() {
            console.log("hola")
        }, 2000);   
    
});*/

//inicializamos la tabla
function iniciar_tabla(idioma,origen){

    if (idioma==="es"){

        return $('#table-'+ origen).DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/No-Filter-Tables-Spanish.json'
            },
            "autoWidth": false,
            "scrollCollapse": true,
            "scrollY": "350px",
            "dom": "frtiS",
            "deferRender": true,
            "orderClasses": false,
            "ordering":  false,
            
            "columns": [
                { "width": "11%" },//E/C
                { "width": "4%" },//Pagina
                { "width": "11%" },//Fecha 
                { "width": "5%" },//Tipo
                { "width": "14%" },//Ref Nostro
                { "width": "14%" },//Ref Vostro
                { "width": "19%" },//Detalles
                { "width": "4%" },//C/D
                { "width": "14%" },//Monto
                { "width": "4%" }//S/L
              ]
            })

    }else if (idioma==="en"){

        return $('#table-'+ origen).DataTable({
            language: {
                url: '/static/json/No-Filter-Tables-English.json'
            },
            "autoWidth": false,
            "scrollCollapse": true,
            "columns": [
                { "width": "11%" },//E/C
                { "width": "4%" },//Pagina
                { "width": "11%" },//Fecha 
                { "width": "5%" },//Tipo
                { "width": "14%" },//Ref Nostro
                { "width": "14%" },//Ref Vostro
                { "width": "19%" },//Detalles
                { "width": "4%" },//C/D
                { "width": "14%" },//Monto
                { "width": "4%" }//S/L
              ]
        })
    };
};

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
//inicializamos el DatePicker para Fecha Final
$('#fecha-ejecutar').pickadate({
    format: 'dd/mm/yyyy',
    formatSubmit:'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
});

//inicializamos el DatePicker para Fecha Final
$('#fecha-desde').pickadate({
    format: 'dd/mm/yyyy',
    formatSubmit:'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
});

//inicializamos el DatePicker para Fecha Final
$('#fecha-hasta').pickadate({
    format: 'dd/mm/yyyy',
    formatSubmit:'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
});

//Boton Buscar
$('#boton-buscar').on('click', function () {

    var cuentaId = $('#Cuenta-sel').val();
    
    if (cuentaId>=0){
        var fecha1 = $('#fecha-desde').val();
        var fecha2 = $('#fecha-hasta').val();
        var archivo = $('#selec_archivo').val();
        var codigoCuenta = $('#opt-'+cuentaId).attr("codigo");
        
        if(fecha1.length<1){ 
            swal("Ups!", "Debe introducir la Fecha Inicial para la Busqueda", "error");
        }else if(fecha2.length<1){ 
            swal("Ups!", "Debe introducir la Fecha Final para la Busqueda", "error");
        }else if(archivo=="-1"){ 
            swal("Ups!", "Debe Seleccionar el Archivo en el que se realizara la Busqueda", "error");
        }else{
            buscarEnArchivo(archivo,codigoCuenta);
        }
    }else{
        swal("Ups!", "Debe Seleccionar el Código de la Cuenta", "error");

    }
});



$('#Cuenta-sel').change(function() {
    
    var cuentaId = $('#Cuenta-sel').val();

    //si se selecciona una cuenta mostramos su info
    if (cuentaId>=0){
        var codigoCuenta = $('#opt-'+cuentaId).attr("codigo");
        $('#minima_fecha').val("");
        $('#fecha-ejecutar').val("");
        $('#fecha-desde').val("");
        $('#fecha-hasta').val("");

        $('#divselec_archivo option[value!="-1"]').remove();
        
        $('#processing-modal').modal('toggle')
        buscarArchivos(codigoCuenta);
    }else{

        //borramos los campos
        $('#minima_fecha').val("");
        $('#fecha-ejecutar').val("");
        $('#fecha-desde').val("");
        $('#fecha-hasta').val("");
        $('#divselec_archivo option[value!="-1"]').remove();

    }


});   

//Mostramos como seria el nuevo estado de cuenta
$('#boton-consulta').on('click', function () {

    var cuenta = $('#Cuenta-sel').val()
    
    
    if (cuenta>=0){
        var codigoCuenta = $('#opt-'+cuenta).attr("codigo");
        console.log(codigoCuenta);
        $('#processing-modal').modal('toggle')
        consultar(codigoCuenta);
        //$('#minima_fecha').val("soy Gay");
        
    }else{
        swal("Ups!", "Debe Seleccionar el Código de la Cuenta", "error");
    }
    
});

function buscarArchivos(cuenta){
        $.ajax({
            type:"POST",
            url: "/admin/archive/",
            data: {"cuenta":cuenta, "action": "buscarArchivos"},
            success: function(data){
                if (data.exito){
                    for (var i = 0; i < data.archivos.length;i++){
                         $('#selec_archivo').append($("<option></option>").attr("value",data.archivos[i]).text(data.archivos[i])); 
                    }
                }
            $('#processing-modal').modal('toggle')
                
                
            },
            error: function(q,error){
                alert(q.responseText) //debug
                $('#processing-modal').modal('toggle')
                swal("Ups!", "Hubo un error consultando los Archivos, intente de Nuevo.", "error");
        },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
};

function consultar(cuenta){
        $.ajax({
            type:"POST",
            url: "/admin/archive/",
            data: {"cuenta":cuenta, "action": "consultar"},
            success: function(data){
                $('#processing-modal').modal('toggle')
                if (data.exito){
                    $('#minima_fecha').val(data.fechaMinima);
                }else{
                    swal({   title: "",
                             text: data.msg,
                             type: "error"
                         });
                }
                
                
            },
            error: function(q,error){
                alert(q.responseText) //debug
                $('#processing-modal').modal('toggle')
                swal("Ups!", "Hubo un error consultando la Cuenta, intente de Nuevo.", "error");
        },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
};

function buscarEnArchivo(archivo,cuenta){
        $.ajax({
            type:"POST",
            url: "/admin/archive/",
            data: {"cuenta":cuenta,"archivo":archivo, "action": "buscarEnArchivo"},
            success: function(data){
                if (data.exito){
                }    
                
            },
            error: function(q,error){
                alert(q.responseText) //debug
               swal("Ups!", "Hubo un error consultando los Archivos, intente de Nuevo.", "error");
        },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
};

//Dar formato a un Date a string dd/mm/yyyy
function formatearFecha(fecha){
    dia = fecha.getDate();
    
    if (dia < 10){
        dia = "0"+ dia;
    }

    mes = fecha.getUTCMonth()+1;
    
    if (mes < 10){
        mes = "0"+ mes;
    }

    anio = fecha.getUTCFullYear();
    nueva = dia +"/" + mes + "/" +anio;
    return nueva;
}