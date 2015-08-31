var csrftoken = $.cookie('csrftoken');
var idioma = $('#idioma').val();
var idiomaAux = "";
var msj ="";

if (idioma == 0){
    idiomaAux = "es"
} else {
    idiomaAux = "en"
}

var t_conta = iniciar_tabla(idiomaAux);

/*
$( document ).ready(function() {
        setInterval(function() {
            console.log("hola")
        }, 2000);   
    
});*/

//inicializamos la tabla
function iniciar_tabla(idioma){

    if (idioma==="es"){

        return $('#table-pa').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "autoWidth": false,
            "scrollY": "350px",
            "deferRender": true,
            "ordering":  false,
            "paging": false,
            
            "columns": [
                { "width": "11%" },//E/C
                { "width": "2%" },//Pagina
                { "width": "11%" },//Fecha 
                { "width": "5%" },//Tipo
                { "width": "14%" },//Ref Nostro
                { "width": "14%" },//Ref Vostro
                { "width": "21%" },//Detalles
                { "width": "4%" },//C/D
                { "width": "14%" },//Monto
                { "width": "4%" }//S/L
              ]
            })

    }else if (idioma==="en"){

        return $('#table-pa').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "autoWidth": false,
            "scrollY": "350px",
            "deferRender": true,
            "ordering":  false,
            "paging": false,
            
            "columns": [
                { "width": "11%" },//E/C
                { "width": "2%" },//Pagina
                { "width": "11%" },//Fecha 
                { "width": "5%" },//Tipo
                { "width": "14%" },//Ref Nostro
                { "width": "14%" },//Ref Vostro
                { "width": "21%" },//Detalles
                { "width": "4%" },//C/D
                { "width": "14%" },//Monto
                { "width": "4%" }//S/L
              ]
            })
    };
};

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
//inicializamos el DatePicker para Fecha ejecutar
if (idioma == 0){
    $('#fecha-ejecutar').pickadate({
    format: 'dd/mm/yyyy',
    formatSubmit:'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
    });
} else {
    $('#fecha-ejecutar').pickadate({
    format: 'yyyy/mm/dd',
    formatSubmit:'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
    });
}

//inicializamos el DatePicker para Fecha inicial
if (idioma == 0){
    $('#fecha-desde').pickadate({
    format: 'dd/mm/yyyy',
    formatSubmit:'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
    });
} else {
    $('#fecha-desde').pickadate({
    format: 'yyyy/mm/dd',
    formatSubmit:'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
    });
}

//inicializamos el DatePicker para Fecha Final
if (idioma == 0){
    $('#fecha-hasta').pickadate({
    format: 'dd/mm/yyyy',
    formatSubmit:'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
    });
} else {
    $('#fecha-hasta').pickadate({
    format: 'yyyy/mm/dd',
    formatSubmit:'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
    });
}

//dado un fecha en string la convierte en un objeto Date
function fechaStringtoDate(fecha){
    var arreglo= fecha.split("/");
    dia = parseInt(arreglo[0]);
    mes = parseInt(arreglo[1])-1;
    anio = parseInt(arreglo[2]);
    var nueva = new Date(anio,mes,dia);
    return nueva;
}

//Boton Buscar
$('#boton-buscar').on('click', function () {

    var cuentaId = $('#Cuenta-sel').val();
    
    if (cuentaId>=0){
        if (idioma != 0){
            var fechaIni2 = $('#fecha-desde').val().split("/");
            var fechaFin2 = $('#fecha-hasta').val().split("/");
            var fechaIni = fechaIni2[2] + "/" + fechaIni2[1] + "/" + fechaIni2[0];
            var fechaFin = fechaFin2[2] + "/" + fechaFin2[1] + "/" + fechaFin2[0];
        } else {
            var fechaIni = $('#fecha-desde').val();
            var fechaFin = $('#fecha-hasta').val();
        }
        var archivo = $('#selec_archivo').val();
        var codigoCuenta = $('#opt-'+cuentaId).attr("codigo");
        
        if(fechaIni.length<1){
            if (idioma == 0){ 
                swal("Ups!", "Debe introducir la Fecha Inicial para la Búsqueda", "error");
            } else {
                swal("Ups!", "You must introduce initial date for search", "error");
            }
        }else if(fechaFin.length<1){
            if (idioma == 0){ 
                swal("Ups!", "Debe introducir la Fecha Final para la Búsqueda", "error");
            } else {
                swal("Ups!", "You must introduce final date for search", "error");
            }
        }else if(archivo=="-1"){
            if (idioma == 0){ 
                swal("Ups!", "Debe Seleccionar el Archivo en el que se realizará la Búsqueda", "error");
            } else {
                swal("Ups!", "You must select the search file", "error");
            }
        }else{
            fecha1 = fechaStringtoDate(fechaIni);
            fecha2 = fechaStringtoDate(fechaFin);
            if(fecha1 > fecha2){
                if (idioma == 0){
                    swal("Ups!", "La fecha Final no puede ser menor a la Fecha Inicial", "error");
                } else {
                    swal("Ups!", "Initial date can not be greater than final date", "error");
                }
            }else{
                $('#processing-modal').modal('toggle');
                buscarEnArchivo(archivo,codigoCuenta,fechaIni,fechaFin);
            }
        }
    }else{
        if (idioma == 0){
            swal("Ups!", "Debe Seleccionar el Código de la Cuenta", "error");
        } else {
            swal("Ups!", "You must select the code account", "error");
        }
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
        t_conta.clear().draw();
                    
        $('#processing-modal').modal('toggle')
        buscarArchivos(codigoCuenta);
    }else{

        //borramos los campos
        $('#minima_fecha').val("");
        $('#fecha-ejecutar').val("");
        $('#fecha-desde').val("");
        $('#fecha-hasta').val("");
        $('#divselec_archivo option[value!="-1"]').remove();
        t_conta.clear().draw();
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
    }else{
        if (idioma == 0){
            swal("Ups!", "Debe Seleccionar el Código de la Cuenta", "error");
        } else {
            swal("Ups!", "You must select the code account", "error");
        }
    }
});

//Mostramos como seria el nuevo estado de cuenta
$('#boton-ejecutar').on('click', function () {
    var $btn;
    var cuenta = $('#Cuenta-sel').val()
    
    if (cuenta>=0){
        var codigoCuenta = $('#opt-'+cuenta).attr("codigo");
        if (idioma == 0){
            var fecha = $('#fecha-ejecutar').val()
        } else {
            var fechaAux = $('#fecha-ejecutar').val().split("/")
            var fecha = fechaAux[2] + "/" + fechaAux[1] + "/" + fechaAux[0]
        }
        var fechaMinima =$('#minima_fecha').val()

        if(fecha.length<1){
            if (idioma == 0){ 
                swal("Ups!", "Debe introducir la Fecha para ejecutar el proceso de Archive", "error");
            } else {
                swal("Ups!", "You must introduce the date for execute Archive process", "error");
            }
        }else{

            //caso en que no se ha consultado la fecha minima
            if(fechaMinima.length < 1){
                $('#processing-modal').modal('toggle')
                consultarEjecutar(codigoCuenta)
            }else{
                if (idioma == 0 ){
                    fecha1 = fechaStringtoDate(fechaMinima);
                } else {
                    fechaAux = fechaMinima.split("/");
                    fechaAux2 = fechaAux[2] + "/" + fechaAux[1] + "/" + fechaAux[0];
                    fecha1 = fechaStringtoDate(fechaAux2);
                }
                fecha2 = fechaStringtoDate(fecha);
                if(fecha1 > fecha2){
                    if (idioma == 0){ 
                        swal("Ups!", "La fecha Final no puede ser menor a la Fecha Mínima de Match", "error");
                    } else {
                        swal("Ups!", "Final date can not be less than Match minimum date", "error");
                    }
                }else{
                    var $btn;
                        if (idioma == 0){
                                msj= "Seguro que desea crear el Archive para la Cuenta: " + codigoCuenta + " entre las fechas "+fechaMinima+" y " +fecha+ " ?";
                             } else {
                                msj= "Sure you want to create Archive for the account : " + codigoCuenta + " between dates "+fechaMinima+" and " +fecha+ " ?";
                                var fechaAuxM = $('#minima_fecha').val().split("/");
                                fechaMinima = fechaAuxM[2] + "/" + fechaAuxM[1] + "/" + fechaAuxM[0]
                             }
                        swal({
                            title: "",
                            text: msj,
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Ok"},
                            function(){
                                $('#processing-modal').modal('toggle')
                                $btn = $(this).button('loading')
                                ejecutarArchive(codigoCuenta,fechaMinima,fecha)
                            }
                        );
                }            
            }
        }
    }else{
        if (idioma == 0){ 
            swal("Ups!", "Debe Seleccionar el Código de la Cuenta", "error");
        } else {
            swal("Ups!", "You must select the code account", "error");
        }
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
                if (idioma == 0){
                    swal("Ups!", "Hubo un error consultando los Archivos, intente de Nuevo.", "error");
                } else {
                    swal("Ups!", "Error at consulting files. Try again please.", "error");
                }
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
                
                if (data.exito){
                    if (idioma != 0){
                        var aux_f = data.fechaMinima.split("/");
                        var aux_f2 = aux_f[2] + "/" + aux_f[1] + "/" + aux_f[0] 
                        $('#minima_fecha').val(aux_f2);
                    } else {
                        $('#minima_fecha').val(data.fechaMinima);
                    }
                }else{
                    swal({   title: "",
                             text: data.msg,
                             type: "error"
                         });
                }
                $('#processing-modal').modal('toggle')
            },
            error: function(q,error){
                alert(q.responseText) //debug
                $('#processing-modal').modal('toggle')
                if (idioma == 0){
                    swal("Ups!", "Hubo un error consultando la Cuenta, intente de Nuevo.", "error");
                } else {
                    swal("Ups!", "Error at consulting account. Try again please.", "error");
                }
        },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
};

function consultarEjecutar(cuenta){
        $.ajax({
            type:"POST",
            url: "/admin/archive/",
            data: {"cuenta":cuenta, "action": "consultar"},
            success: function(data){
                
                if (data.exito){
                    var fecha = $('#fecha-ejecutar').val()
        
                    fecha1 = fechaStringtoDate(data.fechaMinima);
                    fecha2 = fechaStringtoDate(fecha);
                    if(fecha1 > fecha2){  
                        $('#processing-modal').modal('toggle')
                        if (idioma == 0){
                            swal("Ups!", "La fecha Final no puede ser menor a la Fecha Mínima de Match", "error");
                        } else {
                            swal("Ups!", "Final date can not be greater than match minimum date.", "error");
                        }
                    }else{
                        $('#processing-modal').modal('toggle')
                        var $btn;
                        if (idioma == 0){
                                msj= "Seguro que desea crear el Archive para la Cuenta: " + cuenta + " entre las fechas "+data.fechaMinima+" y " +fecha+ " ?";
                             } else {
                                msj= "Sure you want to create Archive for the account : " + cuenta + " between dates "+data.fechaMinima+" and " +fecha+ " ?";
                             }
                        swal({
                            title: "",
                            text: msj,
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Ok"},
                            function(){
                                $('#processing-modal').modal('toggle')
                                $btn = $(this).button('loading')
                                ejecutarArchive(data.cuenta,data.fechaMinima,fecha)
                            }
                        );
                    }
                              
                }else{
                    $('#processing-modal').modal('toggle')
                    swal({   title: "",
                             text: data.msg,
                             type: "error"
                         });
                }
                
                
            },
            error: function(q,error){
                alert(q.responseText) //debug
                $('#processing-modal').modal('toggle')
                if (idioma == 0){
                    swal("Ups!", "Hubo un error consultando la Cuenta, intente de Nuevo.", "error");
                } else {
                    swal("Ups!", "Error at consulting account, try again please.", "error");
                }
        },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
};

function ejecutarArchive(cuenta,fechaMinima,fechaMaxima){
        $.ajax({
            type:"POST",
            url: "/admin/archive/",
            data: {"cuenta":cuenta, "fechaMinima":fechaMinima, "fechaMaxima":fechaMaxima,"action": "ejecutarArchive"},
            success: function(data){
                if (data.exito){
                    $('#divselec_archivo option[value!="-1"]').remove();
                    for (var i = 0; i < data.archivos.length;i++){
                        $('#selec_archivo').append($("<option></option>").attr("value",data.archivos[i]).text(data.archivos[i])); 
                    }
                    if (idioma == 0){
                        msj= "El Archive se ha ejecutado con éxito";
                     } else {
                        msj= "Successful executed Archive.";
                     }
                    swal({   title: "",
                        text: msj,
                        type: "success"
                    }); 
                }else{
                    swal({   title: "",
                             text: data.msg,
                             type: "error"
                         });
                }
                $('#processing-modal').modal('toggle')
            },
            error: function(q,error){
                alert(q.responseText) //debug
                $('#processing-modal').modal('toggle')
                if (idioma == 0){
                    swal("Ups!", "Hubo un error ejecutando el Archive, intente de Nuevo.", "error");
                } else {
                    swal("Ups!", "Error at executing Archive, try again please.", "error");
                }
        },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
};


function buscarEnArchivo(archivo,cuenta,fechaIni,fechaFin){
        $.ajax({
            type:"POST",
            url: "/admin/archive/",
            data: {"cuenta":cuenta,"archivo":archivo,"fechaIni":fechaIni, "fechaFin":fechaFin, "action": "buscarEnArchivo"},
            success: function(data){
                if (data.exito){

                    var automaticas = data.transacciones['auto'];
                    var manuales = data.transacciones['manual'];
                    var contabilidades = data.transacciones['contabilidad'];
                    var corresponsales = data.transacciones['corresponsal'];

                    t_conta.clear().draw();
                    var contador = 1;

                    if(automaticas.length>0){
                        
                        var td1 = '<td></td>';
                        var td2 = '<td></td>';
                        var td3 = '<td></td>';
                        var td4 = '<td></td>';
                        if (idioma == 0) {
                            var td5 = '<td align ="center"><h4><strong>Matches</strong></h4></td>';
                            var td6 = '<td align ="center"><h4><strong>Automáticos</strong></h4></td>';
                        } else {
                            var td5 = '<td align ="center"><h4><strong>Automatic</strong></h4></td>';
                            var td6 = '<td align ="center"><h4><strong>Matches</strong></h4></td>';
                        }
                        var td7 = '<td></td>';
                        var td8 = '<td></td>';
                        var td9 = '<td></td>';
                        var td10 = '<td></td>';
                        //creamos la fila con los elementos y la mostramos
                        $('#table-pa > tbody').append('<tr class = "automatico" id ="tr-con-'+contador+'"></tr>');
                        var jRow = $("#tr-con-"+contador).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10);
                        t_conta.row.add(jRow);
                        contador++;

                    }
                    
                    for (var i = 0 ; i < automaticas.length ; i++){
                        var fechaMatch = automaticas[i][0][0][0];
                        var idMatch = automaticas[i][0][0][1];
                        //creamos los elementos de cada fila
                        var td1 = '<td>Match</td>';
                        var td2 = '<td>Id:</td>';
                        var td3 = '<td>'+idMatch+'</td>';
                        var td4 = '<td></td>';
                        var td5 = '<td></td>';
                        var td6 = '<td></td>';
                        var td7 = '<td></td>';
                        var td8 = '<td></td>';
                        var td9 = '<td></td>';
                        var td10 = '<td></td>';

                        //creamos la fila con los elementos y la mostramos
                        $('#table-pa > tbody').append('<tr class = "automatico" id ="tr-con-'+contador+'"></tr>');
                        var jRow = $("#tr-con-"+contador).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10);
                        t_conta.row.add(jRow);
                        contador++;
            
                        for(var j = 0; j < automaticas[i][1].length ; j++){
                            var edoCta = automaticas[i][1][j][0];
                            var pagina = automaticas[i][1][j][1];
                            var fecha = automaticas[i][1][j][2];
                            var tipo = automaticas[i][1][j][3];
                            var rNostro = automaticas[i][1][j][4];
                            var rVostro = automaticas[i][1][j][5];
                            var detalles = automaticas[i][1][j][6];
                            var credDeb = automaticas[i][1][j][7];
                            var monto = automaticas[i][1][j][8];
                            var contaCorr = automaticas[i][1][j][9];

                            if (detalles == "null"){
                                detalles = "";
                            }
                            if (rNostro == "null"){
                                rNostro = "";
                            }
                            if (rVostro == "null"){
                                rVostro = "";
                            }


                            //creamos los elementos de cada fila
                            var td1 = '<td>'+edoCta+'</td>';
                            var td2 = '<td>'+pagina+'</td>';
                            if (idioma == 0) {
                                var fechaAuxD = fecha;
                            } else {
                                var fechaAuxD2 = fecha.split("/");
                                var fechaAuxD = fechaAuxD2[2] + "/" + fechaAuxD2[1] + "/" + fechaAuxD2[0];
                            }
                            var td3 = '<td>'+fechaAuxD+'</td>';
                            var td4 = '<td>'+tipo+'</td>';
                            var td5 = '<td>'+rNostro+'</td>';
                            var td6 = '<td>'+rVostro+'</td>';
                            var td7 = '<td>'+detalles+'</td>';
                            var td8 = '<td>'+credDeb+'</td>';
                            var td9 = '<td>'+monto+'</td>';
                            var td10 = '<td>'+contaCorr+'</td>';

                            //creamos la fila con los elementos y la mostramos
                            $('#table-pa > tbody').append('<tr id ="tr-con-'+contador+'"></tr>');
                            var jRow = $("#tr-con-"+contador).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10);
                            t_conta.row.add(jRow);
                            contador++;   
                        }
                    }

                    if(manuales.length>0){
                        var td1 = '<td></td>';
                        var td2 = '<td></td>';
                        var td3 = '<td></td>';
                        var td4 = '<td></td>';
                        if (idioma == 0) {
                            var td5 = '<td align ="center"><h4><strong>Matches</strong></h4></td>';
                            var td6 = '<td align ="center"><h4><strong>Manuales</strong></h4></td>';
                        } else {
                            var td5 = '<td align ="center"><h4><strong>Manual</strong></h4></td>';
                            var td6 = '<td align ="center"><h4><strong>Matches</strong></h4></td>';
                        }
                        var td7 = '<td></td>';
                        var td8 = '<td></td>';
                        var td9 = '<td></td>';
                        var td10 = '<td></td>';
                        //creamos la fila con los elementos y la mostramos
                        $('#table-pa > tbody').append('<tr class = "success" id ="tr-con-'+contador+'"></tr>');
                        var jRow = $("#tr-con-"+contador).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10);
                        t_conta.row.add(jRow);
                        contador++;

                    }

                    for (var i = 0 ; i < manuales.length ; i++){
                        var fechaMatch = manuales[i][0][0][0];
                        var idMatch = manuales[i][0][0][1];
                        //creamos los elementos de cada fila
                        var td1 = '<td>Match</td>';
                        var td2 = '<td>Id:</td>';
                        var td3 = '<td>'+idMatch+'</td>';
                        var td4 = '<td></td>';
                        var td5 = '<td></td>';
                        var td6 = '<td></td>';
                        var td7 = '<td></td>';
                        var td8 = '<td></td>';
                        var td9 = '<td></td>';
                        var td10 = '<td></td>';

                        //creamos la fila con los elementos y la mostramos
                        $('#table-pa > tbody').append('<tr class = "success" id ="tr-con-'+contador+'"></tr>');
                        var jRow = $("#tr-con-"+contador).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10);
                        t_conta.row.add(jRow);
                        contador++;
                        
                        for(var j = 0; j < manuales[i][1].length ; j++){
                            var edoCta = manuales[i][1][j][0];
                            var pagina = manuales[i][1][j][1];
                            var fecha = manuales[i][1][j][2];
                            var tipo = manuales[i][1][j][3];
                            var rNostro = manuales[i][1][j][4];
                            var rVostro = manuales[i][1][j][5];
                            var detalles = manuales[i][1][j][6];
                            var credDeb = manuales[i][1][j][7];
                            var monto = manuales[i][1][j][8];
                            var contaCorr = manuales[i][1][j][9];

                            if (detalles == "null"){
                                detalles = "";
                            }
                            if (rNostro == "null"){
                                rNostro = "";
                            }
                            if (rVostro == "null"){
                                rVostro = "";
                            }

                            if (idioma == 0) {
                                var fechaAuxD = fecha;
                            } else {
                                var fechaAuxD2 = fecha.split("/");
                                var fechaAuxD = fechaAuxD2[2] + "/" + fechaAuxD2[1] + "/" + fechaAuxD2[0];
                            }

                            //creamos los elementos de cada fila
                            var td1 = '<td>'+edoCta+'</td>';
                            var td2 = '<td>'+pagina+'</td>';
                            var td3 = '<td>'+fechaAuxD+'</td>';
                            var td4 = '<td>'+tipo+'</td>';
                            var td5 = '<td>'+rNostro+'</td>';
                            var td6 = '<td>'+rVostro+'</td>';
                            var td7 = '<td>'+detalles+'</td>';
                            var td8 = '<td>'+credDeb+'</td>';
                            var td9 = '<td>'+monto+'</td>';
                            var td10 = '<td>'+contaCorr+'</td>';

                            //creamos la fila con los elementos y la mostramos
                            $('#table-pa > tbody').append('<tr id ="tr-con-'+contador+'"></tr>');
                            var jRow = $("#tr-con-"+contador).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10);
                            t_conta.row.add(jRow);
                            contador++; 
                        }
                    }
                    
                    if(contabilidades.length>0){
                        var td1 = '<td></td>';
                        var td2 = '<td></td>';
                        var td3 = '<td></td>';
                        if (idioma == 0) {
                            var td4 = '<td align ="center"><h4><strong>Matches</strong></h4></td>';
                            var td5 = '<td align ="center"><h4><strong>Reverso</strong></h4></td>';
                            var td6 = '<td align ="center"><h4><strong>Contabilidad</strong></h4></td>';
                        } else {
                            var td4 = '<td align ="center"><h4><strong>Accounting</strong></h4></td>';
                            var td5 = '<td align ="center"><h4><strong>Reverse</strong></h4></td>';
                            var td6 = '<td align ="center"><h4><strong>Matches</strong></h4></td>';
                        }
                        var td7 = '<td></td>';
                        var td8 = '<td></td>';
                        var td9 = '<td></td>';
                        var td10 = '<td></td>';
                        //creamos la fila con los elementos y la mostramos
                        $('#table-pa > tbody').append('<tr class = "warning" id ="tr-con-'+contador+'"></tr>');
                        var jRow = $("#tr-con-"+contador).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10);
                        t_conta.row.add(jRow);
                        contador++;

                    }

                    for (var i = 0 ; i < contabilidades.length ; i++){
                        var fechaMatch = contabilidades[i][0][0][0];
                        var idMatch = contabilidades[i][0][0][1];
                        //creamos los elementos de cada fila
                        var td1 = '<td>Match</td>';
                        var td2 = '<td>Id:</td>';
                        var td3 = '<td>'+idMatch+'</td>';
                        var td4 = '<td></td>';
                        var td5 = '<td></td>';
                        var td6 = '<td></td>';
                        var td7 = '<td></td>';
                        var td8 = '<td></td>';
                        var td9 = '<td></td>';
                        var td10 = '<td></td>';

                        //creamos la fila con los elementos y la mostramos
                        $('#table-pa > tbody').append('<tr class = "warning" id ="tr-con-'+contador+'"></tr>');
                        var jRow = $("#tr-con-"+contador).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10);
                        t_conta.row.add(jRow);
                        contador++;
             
                        for(var j = 0; j < contabilidades[i][1].length ; j++){
                            var edoCta = contabilidades[i][1][j][0];
                            var pagina = contabilidades[i][1][j][1];
                            var fecha = contabilidades[i][1][j][2];
                            var tipo = contabilidades[i][1][j][3];
                            var rNostro = contabilidades[i][1][j][4];
                            var rVostro = contabilidades[i][1][j][5];
                            var detalles = contabilidades[i][1][j][6];
                            var credDeb = contabilidades[i][1][j][7];
                            var monto = contabilidades[i][1][j][8];
                            var contaCorr = contabilidades[i][1][j][9];

                            if (detalles == "null"){
                                detalles = "";
                            }
                            if (rNostro == "null"){
                                rNostro = "";
                            }
                            if (rVostro == "null"){
                                rVostro = "";
                            }

                            if (idioma == 0) {
                                var fechaAuxD = fecha;
                            } else {
                                var fechaAuxD2 = fecha.split("/");
                                var fechaAuxD = fechaAuxD2[2] + "/" + fechaAuxD2[1] + "/" + fechaAuxD2[0];
                            }

                            //creamos los elementos de cada fila
                            var td1 = '<td>'+edoCta+'</td>';
                            var td2 = '<td>'+pagina+'</td>';
                            var td3 = '<td>'+fechaAuxD+'</td>';
                            var td4 = '<td>'+tipo+'</td>';
                            var td5 = '<td>'+rNostro+'</td>';
                            var td6 = '<td>'+rVostro+'</td>';
                            var td7 = '<td>'+detalles+'</td>';
                            var td8 = '<td>'+credDeb+'</td>';
                            var td9 = '<td>'+monto+'</td>';
                            var td10 = '<td>'+contaCorr+'</td>';

                            //creamos la fila con los elementos y la mostramos
                            $('#table-pa > tbody').append('<tr id ="tr-con-'+contador+'"></tr>');
                            var jRow = $("#tr-con-"+contador).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10);
                            t_conta.row.add(jRow);
                            contador++;
                        }
                    }

                    if(corresponsales.length>0){
                        var td1 = '<td></td>';
                        var td2 = '<td></td>';
                        var td3 = '<td></td>';
                        if (idioma == 0){
                            var td4 = '<td align ="center"><h4><strong>Matches</strong></h4></td>';
                            var td5 = '<td align ="center"><h4><strong>Reverso</strong></h4></td>';
                            var td6 = '<td align ="center"><h4><strong>Corresponsal</strong></h4></td>';
                        } else {
                            var td4 = '<td align ="center"><h4><strong>Correspondent</strong></h4></td>';
                            var td5 = '<td align ="center"><h4><strong>Reverse</strong></h4></td>';
                            var td6 = '<td align ="center"><h4><strong>Matches</strong></h4></td>';
                        }
                        var td7 = '<td></td>';
                        var td8 = '<td></td>';
                        var td9 = '<td></td>';
                        var td10 = '<td></td>';
                        //creamos la fila con los elementos y la mostramos
                        $('#table-pa > tbody').append('<tr class = "danger" id ="tr-con-'+contador+'"></tr>');
                        var jRow = $("#tr-con-"+contador).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10);
                        t_conta.row.add(jRow);
                        contador++;

                    }

                    for (var i = 0 ; i < corresponsales.length ; i++){
                        var fechaMatch = corresponsales[i][0][0][0];
                        var idMatch = corresponsales[i][0][0][1];
                        //creamos los elementos de cada fila
                        var td1 = '<td>Match</td>';
                        var td2 = '<td>Id:</td>';
                        var td3 = '<td>'+idMatch+'</td>';
                        var td4 = '<td></td>';
                        var td5 = '<td></td>';
                        var td6 = '<td></td>';
                        var td7 = '<td></td>';
                        var td8 = '<td></td>';
                        var td9 = '<td></td>';
                        var td10 = '<td></td>';

                        //creamos la fila con los elementos y la mostramos
                        $('#table-pa > tbody').append('<tr class = "danger" id ="tr-con-'+contador+'"></tr>');
                        var jRow = $("#tr-con-"+contador).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10);
                        t_conta.row.add(jRow);
                        contador++;
            
                        
                        for(var j = 0; j < corresponsales[i][1].length ; j++){
                            var edoCta = corresponsales[i][1][j][0];
                            var pagina = corresponsales[i][1][j][1];
                            var fecha = corresponsales[i][1][j][2];
                            var tipo = corresponsales[i][1][j][3];
                            var rNostro = corresponsales[i][1][j][4];
                            var rVostro = corresponsales[i][1][j][5];
                            var detalles = corresponsales[i][1][j][6];
                            var credDeb = corresponsales[i][1][j][7];
                            var monto = corresponsales[i][1][j][8];
                            var contaCorr = corresponsales[i][1][j][9];

                            if (detalles == "null"){
                                detalles = "";
                            }
                            if (rNostro == "null"){
                                rNostro = "";
                            }
                            if (rVostro == "null"){
                                rVostro = "";
                            }

                            if (idioma == 0) {
                                var fechaAuxD = fecha;
                            } else {
                                var fechaAuxD2 = fecha.split("/");
                                var fechaAuxD = fechaAuxD2[2] + "/" + fechaAuxD2[1] + "/" + fechaAuxD2[0];
                            }

                            //creamos los elementos de cada fila
                            var td1 = '<td>'+edoCta+'</td>';
                            var td2 = '<td>'+pagina+'</td>';
                            var td3 = '<td>'+fechaAuxD+'</td>';
                            var td4 = '<td>'+tipo+'</td>';
                            var td5 = '<td>'+rNostro+'</td>';
                            var td6 = '<td>'+rVostro+'</td>';
                            var td7 = '<td>'+detalles+'</td>';
                            var td8 = '<td>'+credDeb+'</td>';
                            var td9 = '<td>'+monto+'</td>';
                            var td10 = '<td>'+contaCorr+'</td>';

                            //creamos la fila con los elementos y la mostramos
                            $('#table-pa > tbody').append('<tr id ="tr-con-'+contador+'"></tr>');
                            var jRow = $("#tr-con-"+contador).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10);
                            t_conta.row.add(jRow);
                            contador++;
                        }
                    }
                    $('#processing-modal').modal('toggle')
                    t_conta.draw()

                    if(automaticas.length < 1 && manuales.length < 1 && contabilidades.length < 1 && corresponsales.length < 1){
                        
                        if (idioma == 0){
                            msj= "No existen Coincidencias con la busqueda realizada,Intente con fechas diferentes";
                         } else {
                            msj= "Not matches at search. Try with different dates please.";
                         }

                        swal({   title: "",
                             text: msj,
                             type: "error"
                         });
                    }
                    
                }else{
                    $('#processing-modal').modal('toggle')
                    swal({   title: "",
                             text: data.msg,
                             type: "error"
                         });
                }    
                
            },
            error: function(q,error){
                alert(q.responseText) //debug
                $('#processing-modal').modal('toggle')
               if (idioma == 0){
                    swal("Ups!", "Hubo un error consultando los Archivos, intente de Nuevo.", "error");
                } else {
                    swal("Ups!", "Error at consulting files. Try again please.", "error");
                }
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