var csrftoken = $.cookie('csrftoken');
var t_conta = iniciar_tabla(idioma_tr);

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
                url: '/static/json/No-Filter-Tables-English.json'
            },
            "autoWidth": false,
            "scrollCollapse": true,
            "scrollY": "350px",
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
            fecha1 = fechaStringtoDate(fecha1);
            fecha2 = fechaStringtoDate(fecha2);
            if(fecha1 > fecha2){
                swal("Ups!", "La fecha Final no puede ser menor a la Fecha Inicial", "error");
            }else{
                $('#processing-modal').modal('toggle');
                buscarEnArchivo(archivo,codigoCuenta);

            }
            
            
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

                    fechaIni = $('#fecha-desde').val();
                    fechaFin = $('#fecha-hasta').val(); 

                    console.log(fechaIni + " " +fechaFin );   


                    
                    

                    var automaticas = data.transacciones['auto'];
                    var manuales = data.transacciones['manual'];
                    var contabilidades = data.transacciones['contabilidad'];
                    var corresponsales = data.transacciones['corresponsal'];

                    t_conta.clear().draw();

                    var contador = 1;
                    var td1 = '<td></td>';
                    var td2 = '<td></td>';
                    var td3 = '<td></td>';
                    var td4 = '<td></td>';
                    var td5 = '<td><h4>Match</h4></td>';
                    var td6 = '<td><h4>Automático</h4></td>';
                    var td7 = '<td></td>';
                    var td8 = '<td></td>';
                    var td9 = '<td></td>';
                    var td10 = '<td></td>';
                    //creamos la fila con los elementos y la mostramos
                    $('#table-pa > tbody').append('<tr class = "automatico" id ="tr-con-'+contador+'"></tr>');
                    var jRow = $("#tr-con-"+contador).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10);
                    t_conta.row.add(jRow);
                    contador++;

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
                            var td3 = '<td>'+fecha+'</td>';
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


                            //creamos los elementos de cada fila
                            var td1 = '<td>'+edoCta+'</td>';
                            var td2 = '<td>'+pagina+'</td>';
                            var td3 = '<td>'+fecha+'</td>';
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


                            //creamos los elementos de cada fila
                            var td1 = '<td>'+edoCta+'</td>';
                            var td2 = '<td>'+pagina+'</td>';
                            var td3 = '<td>'+fecha+'</td>';
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


                            //creamos los elementos de cada fila
                            var td1 = '<td>'+edoCta+'</td>';
                            var td2 = '<td>'+pagina+'</td>';
                            var td3 = '<td>'+fecha+'</td>';
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