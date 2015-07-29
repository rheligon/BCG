//idioma_tr es una variable global definida en la pagina
var t_conta = iniciar_tabla(idioma_tr,'conta');
var csrftoken = $.cookie('csrftoken');
var num=1;
var pagina = 1;
var dp1;
var dp2;
var tipo;
var inputIni = $('#fecha-manual-nuevo1').detach();
$('#fmn1').html(inputIni);
var inputIni2 = $('#fecha-manual-nuevo2').detach();
$('#fmn2').html(inputIni2);

function commas (num) {
    var N = parseFloat(num).toFixed(2);
    return N.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

$('#Cuenta-sel').change(function() {

    $('#processing-modal').modal('toggle');
  
    var cuentaId = $('#Cuenta-sel').val();

    //si se selecciona una cuenta mostramos su info
    if (cuentaId>=0){
        
        var sel = $('#opt-'+cuentaId);
        var moneda = sel.attr('moneda');

        $('#cta_nostro').val(sel.attr('cn'));
        $('#cta_vostro').val(sel.attr('cv'));
        $('#banco').val(sel.attr('banco'));
        
        document.getElementById('cont-radio').checked = true;
        tipo = "cont-radio";

        $('#edo-cuenta-nuevo').val("");
        $('#paginas-nuevo').html("");
        
        $('#fecha-manual-nuevo1').val("");
        $('#fecha-manual-nuevo2').val("");
        
        $('#saldo-manual-cd-nuevo1').html("");
        $('#saldo-manual-cd-nuevo2').html("");
        
        $('#saldo-manual-moneda-nuevo1').html("");
        $('#saldo-manual-moneda-nuevo2').html("");
        
        $('#saldo-manual-nuevo1').val("");
        $('#saldo-manual-nuevo2').val("");
        
        $('#f-nuevo-ini').html("");
        $('#f-nuevo-fin').html("");

        $('#fecha-valor').val("");
        $('#fecha-entrada').val("");
        $('#selector-cd').val("C");            
        $('#monto-tran').val("");
        $('#tipo-tran').val("");
        $('#nostro-tran').val("");
        $('#vostro-tran').val("");
        $('#detalle-tran').val("");

        $("#fecha-manual-nuevo1").prop('readonly', true);
        $("#fecha-manual-nuevo1").css('background-color', '#eee');
        $("#fecha-manual-nuevo2").prop('readonly', true);
        $("#fecha-manual-nuevo2").css('background-color', '#eee');
        $("#saldo-manual-cd-nuevo1").prop('readonly', true);
        $("#saldo-manual-cd-nuevo1").css('background-color', '#eee');
        $("#saldo-manual-cd-nuevo2").prop('readonly', true);
        $("#saldo-manual-cd-nuevo2").css('background-color', '#eee');
        $("#saldo-manual-moneda-nuevo1").prop('readonly', true);
        $("#saldo-manual-moneda-nuevo1").css('background-color', '#eee');
        $("#saldo-manual-moneda-nuevo2").prop('readonly', true);
        $("#saldo-manual-moneda-nuevo2").css('background-color', '#eee');
        $("#saldo-manual-nuevo1").prop('readonly', true);
        $("#saldo-manual-nuevo1").css('background-color', '#eee');
        $("#saldo-manual-nuevo2").prop('readonly', true);
        $("#saldo-manual-nuevo2").css('background-color', '#eee');
        $("#edo-cuenta-nuevo").prop('readonly', true);
        $("#edo-cuenta-nuevo").css('background-color', '#eee');
        
        $('#fmn1').html(inputIni);
        $('#fmn2').html(inputIni2);

        $('#saldo-manual-cd-nuevo1').remove();
        $('#after').prepend('<span id="saldo-manual-cd-nuevo1" class="input-group-addon"></span>');

        //si cambiamos de cuenta borramos la tabla e inicializamos num
        t_conta.clear().draw();
        num=1;

        //Buscamos el ultimo estado de cuenta contable(primera vez)
        buscarEstado('cont-radio',cuentaId,moneda);
    }else{

        //borramos los campos

        $('#elim-data').attr('cod', "");
        $('#cta_nostro').val("");
        $('#cta_vostro').val("");
        $('#banco').val("");
        
        document.getElementById('cont-radio').checked = false;
        document.getElementById('corr-radio').checked = false;
        
        $('#saldo-manual-moneda').html("");
        $('#edo-cuenta').val("");
        $('#fecha-manual').val("");
        $('#saldo-manual-cd').html("");
        $('#saldo-manual').val("");
        $('#processing-modal').modal('toggle');

        $('#edo-cuenta-nuevo').val("");
        $('#paginas-nuevo').html("");
        
        $('#fecha-manual-nuevo1').val("");
        $('#fecha-manual-nuevo2').val("");
        
        $('#saldo-manual-cd-nuevo1').html("");
        $('#saldo-manual-cd-nuevo2').html("");
        
        $('#saldo-manual-moneda-nuevo1').html("");
        $('#saldo-manual-moneda-nuevo2').html("");
        
        $('#saldo-manual-nuevo1').val("");
        $('#saldo-manual-nuevo2').val("");
        
        $('#f-nuevo-ini').html("");
        $('#f-nuevo-fin').html("");

        $('#fecha-valor').val("");
        $('#fecha-entrada').val("");
        $('#selector-cd').val("C");            
        $('#monto-tran').val("");
        $('#tipo-tran').val("");
        $('#nostro-tran').val("");
        $('#vostro-tran').val("");
        $('#detalle-tran').val("");

        $("#fecha-manual-nuevo1").prop('readonly', true);
        $("#fecha-manual-nuevo1").css('background-color', '#eee');
        $("#fecha-manual-nuevo2").prop('readonly', true);
        $("#fecha-manual-nuevo2").css('background-color', '#eee');
        $("#saldo-manual-cd-nuevo1").prop('readonly', true);
        $("#saldo-manual-cd-nuevo1").css('background-color', '#eee');
        $("#saldo-manual-cd-nuevo2").prop('readonly', true);
        $("#saldo-manual-cd-nuevo2").css('background-color', '#eee');
        $("#saldo-manual-moneda-nuevo1").prop('readonly', true);
        $("#saldo-manual-moneda-nuevo1").css('background-color', '#eee');
        $("#saldo-manual-moneda-nuevo2").prop('readonly', true);
        $("#saldo-manual-moneda-nuevo2").css('background-color', '#eee');
        $("#saldo-manual-nuevo1").prop('readonly', true);
        $("#saldo-manual-nuevo1").css('background-color', '#eee');
        $("#saldo-manual-nuevo2").prop('readonly', true);
        $("#saldo-manual-nuevo2").css('background-color', '#eee');
        $("#edo-cuenta-nuevo").prop('readonly', true);
        $("#edo-cuenta-nuevo").css('background-color', '#eee');

        $('#saldo-manual-cd-nuevo1').remove();
        $('#after').prepend('<span id="saldo-manual-cd-nuevo1" class="input-group-addon"></span>');

        
        $('#fmn1').html(inputIni);
        $('#fmn2').html(inputIni2);
         //si cambiamos de cuenta borramos la tabla e inicializamos num
        t_conta.clear().draw();
        num=1;

    }
});


//Mostrar Detalle al hacer click en código de banco
$('.table').on('click','a[type=edc]', function(event) {
    event.preventDefault();

    //Estilo de elemento elegido
    var a_id = $("#elim-data").attr("cod")
    $('#'+a_id).parent().css("background-color","")
    $('#'+a_id).css("color","")
    $(this).parent().css("background-color","#337ab7")
    $(this).css("color","white")

    //asignacion de elemento a eliminar
    var a_modo = $(this).attr("modo");
    var e_id = $(this).attr("id").split('-')[1];
    var a_cod = $(this).attr("cod");
    $("#elim-data").attr("modo", a_modo);
    $("#elim-data").attr("eid", e_id);
    $("#elim-data").attr("cod", a_cod);
});

//Monstar ultimo estado de cuenta filtrando si viene de contabilidad o corresponsal
$('input[name=radiocuenta]').change(function(){
    $('#processing-modal').modal('toggle');
        
    tipo = $(this).attr('id');
    var cuentaId = $('#Cuenta-sel').val();

    if (cuentaId>=0){
        var sel = $('#opt-'+cuentaId);
        var moneda = sel.attr('moneda');

        $('#edo-cuenta-nuevo').val("");
        $('#paginas-nuevo').html("");
        
        $('#fecha-manual-nuevo1').val("");
        $('#fecha-manual-nuevo2').val("");
        
        $('#saldo-manual-cd-nuevo1').html("");
        $('#saldo-manual-cd-nuevo2').html("");
        
        $('#saldo-manual-moneda-nuevo1').html("");
        $('#saldo-manual-moneda-nuevo2').html("");
        
        $('#saldo-manual-nuevo1').val("");
        $('#saldo-manual-nuevo2').val("");
        
        $('#f-nuevo-ini').html("");
        $('#f-nuevo-fin').html("");

        $("#fecha-manual-nuevo1").prop('readonly', true);
        $("#fecha-manual-nuevo1").css('background-color', '#eee');
        $("#fecha-manual-nuevo2").prop('readonly', true);
        $("#fecha-manual-nuevo2").css('background-color', '#eee');
        $("#saldo-manual-cd-nuevo1").prop('readonly', true);
        $("#saldo-manual-cd-nuevo1").css('background-color', '#eee');
        $("#saldo-manual-cd-nuevo2").prop('readonly', true);
        $("#saldo-manual-cd-nuevo2").css('background-color', '#eee');
        $("#saldo-manual-moneda-nuevo1").prop('readonly', true);
        $("#saldo-manual-moneda-nuevo1").css('background-color', '#eee');
        $("#saldo-manual-moneda-nuevo2").prop('readonly', true);
        $("#saldo-manual-moneda-nuevo2").css('background-color', '#eee');
        $("#saldo-manual-nuevo1").prop('readonly', true);
        $("#saldo-manual-nuevo1").css('background-color', '#eee');
        $("#saldo-manual-nuevo2").prop('readonly', true);
        $("#saldo-manual-nuevo2").css('background-color', '#eee');
        $("#edo-cuenta-nuevo").prop('readonly', true);
        $("#edo-cuenta-nuevo").css('background-color', '#eee');

        $('#saldo-manual-cd-nuevo1').remove();
        $('#after').prepend('<span id="saldo-manual-cd-nuevo1" class="input-group-addon"></span>');



        t_conta.clear().draw();
        num=1;
        
        }else{

        $('#elim-data').attr('cod', "");
        $('#saldo-manual-moneda').html("");
        $('#edo-cuenta').val("");
        $('#fecha-manual').val("");
        $('#saldo-manual-cd').html("");
        $('#saldo-manual').val("");
        t_conta.clear().draw();
        num=1;
        
    }

    buscarEstado(tipo,cuentaId,moneda);
     
});

//Mostramos como seria el nuevo estado de cuenta
$('#boton-nuevo').on('click', function () {

    var cuentaId = $('#edo-cuenta').val();
    var cuentaVacia = $('#Cuenta-sel').val();
    cuentaId = parseInt(cuentaId);
    
    if (cuentaId>=0){
        

        var fecha = $('#fecha-manual').val();
        var cd = $('#saldo-manual-cd').html();
        var moneda = $('#saldo-manual-moneda').html();
        var saldo = $('#saldo-manual').val();
        var ffinal = $('#ffinal').html();
        cuentaId+=1;
        fecha = nuevaFecha(fecha);

        $('#edo-cuenta-nuevo').val(cuentaId);
        $('#paginas-nuevo').html(1);
        
        $('#fecha-manual-nuevo1').val(fecha);
        $('#fecha-manual-nuevo2').val(fecha);

        var minimaFecha = fechaStringtoDate(fecha);
        $("#fecha-manual-nuevo2").prop('readonly', false);
        $("#fecha-manual-nuevo2").css('background-color', 'white');

        $('#fmn1').html(inputIni);

        //inicializamos el DatePicker para Fecha Final
        $('#fecha-manual-nuevo2').pickadate({
            format: 'dd/mm/yyyy',
            formatSubmit:'dd/mm/yyyy',
            selectYears: true,
            selectMonths: true,
            min: minimaFecha,
            max: true,
        });

        $('#saldo-manual-cd-nuevo1').html(cd);
        $('#saldo-manual-cd-nuevo2').html(cd);
        
        $('#saldo-manual-moneda-nuevo1').html(moneda);
        $('#saldo-manual-moneda-nuevo2').html(moneda);
        
        $('#saldo-manual-nuevo1').val(saldo);
        $('#saldo-manual-nuevo2').val(saldo);
        
        $('#f-nuevo-ini').html(ffinal);
        $('#f-nuevo-fin').html(ffinal);

    }else{
        $("#edo-cuenta-nuevo").prop('readonly', false);
        $("#edo-cuenta-nuevo").css('background-color', 'white');

        $('#paginas-nuevo').html(1);
        
        $("#fecha-manual-nuevo1").prop('readonly', false);
        $("#fecha-manual-nuevo1").css('background-color', 'white');


        //inicializamos el DatePicker para Fecha Final
        dp1=$('#fecha-manual-nuevo1').pickadate({
            format: 'dd/mm/yyyy',
            formatSubmit:'dd/mm/yyyy',
            selectYears: true,
            selectMonths: true,
            max: true,
        });

        $("#fecha-manual-nuevo2").prop('readonly', false);
        $("#fecha-manual-nuevo2").css('background-color', 'white');

        dp2=$('#fecha-manual-nuevo2').pickadate({
            format: 'dd/mm/yyyy',
            formatSubmit:'dd/mm/yyyy',
            selectYears: true,
            selectMonths: true,
            max: true,
        });

        $('#saldo-manual-cd-nuevo1').remove();
        $('#after').prepend('<select id="saldo-manual-cd-nuevo1" name="saldo-manual-nuevo1" class="form-control"><option value="C">C</option><option value="D">D</option></select>');

        
        var selec = $('#opt-'+cuentaVacia);
        var monedaM = selec.attr('moneda');

        $('#saldo-manual-moneda-nuevo1').html(monedaM);
        $('#saldo-manual-moneda-nuevo2').html(monedaM);
        
        
        $("#saldo-manual-nuevo1").prop('readonly', false);
        $("#saldo-manual-nuevo1").css('background-color', 'white');
        $('#f-nuevo-ini').html("F");
        $('#f-nuevo-fin').html("F");
        
    }
    if(cuentaVacia<0){
        swal("Ups!", "Debe Seleccionar el Código de la Cuenta", "error");
    }
    
});

//agregamos las nuevas transacciones en la tabla
$('#boton-agregar').on('click', function () {

    var cuentaId = $('#edo-cuenta-nuevo').val();
    var dataP = t_conta.rows().data();
    console.log(dataP.length);
    cuentaId = parseInt(cuentaId);

    //si ya se habia seleccionado el nuevo edo de cuenta
    if (cuentaId>=0){
        var fecha1 = $('#fecha-manual-nuevo1').val();
        var fecha2 = $('#fecha-manual-nuevo2').val();
        var saldo1 = $('#saldo-manual-nuevo1').val();
        var saldo2 = $('#saldo-manual-nuevo2').val();
        
        if(fecha1.length<1){ 
            swal("Ups!", "Debe introducir la Fecha Inicial para el Nuevo Estado de Cuenta", "error");
        }else if(fecha2.length<1){ 
            swal("Ups!", "Debe introducir la Fecha Final para Nuevo Estado de Cuenta", "error");
        }else if(saldo1.length<1){ 
            swal("Ups!", "Debe introducir el Saldo Inicial para Nuevo Estado de Cuenta", "error");
        }else{
            var fechaValor = $('#fecha-valor').val();
            console.log(dataP.length)            
            if(dataP.length==0){
                var cdCuenta = $('#saldo-manual-cd-nuevo1').val();    
            }else{
                var cdCuenta = $('#saldo-manual-cd-nuevo2').html();
            }
            console.log(cdCuenta)
            var cdTrans = $('#selector-cd').val();
            var monto = $('#monto-tran').val();
            montoFloatPuro = parseFloat(monto)
            montoFloatPuroFixed = montoFloatPuro.toFixed(2);
            montoFloat = commas(montoFloatPuroFixed);
            var tipo = $('#tipo-tran').val();
            var nostro = $('#nostro-tran').val();
            var vostro = $('#vostro-tran').val();
            var detalle = $('#detalle-tran').val();

            //validaciones de campos obligatorios
            if(fechaValor.length<1){
                swal("Ups!", "Debe introducir la Fecha Valor de la Transacción", "error");
            }
            else if(monto.length<1){
                swal("Ups!", "Debe introducir el Monto de la Transacción", "error");
            }else if(tipo.length<1){
                swal("Ups!", "Debe introducir el Tipo de la Transacción", "error");
            }else{

                //creamos los elementos de cada fila
                var td1 = '<td id ="tran-'+num+'">'+cuentaId+'</td>';
                var td2 = '<td id ="tranNum-'+num+'">'+num+'</td>';
                var td3 = '<td id ="fecha-'+num+'">'+fechaValor+'</td>';
                var td4 = '<td id ="cd-'+num+'">'+cdTrans+'</td>';
                var td5 = '<td id ="monto-'+num+'">'+montoFloat+'</td>';
                var td6 = '<td id ="tipo-'+num+'">'+tipo+'</td>';
                var td7 = '<td id ="nos-'+num+'">'+nostro+'</td>';
                var td8 = '<td id ="vos-'+num+'">'+vostro+'</td>';
                var td9 = '<td id ="det-'+num+'">'+detalle+'</td>';

                //creamos la fila con los elementos y la mostramos
                $('#table-conta > tbody').append('<tr id ="tr-con-'+num+'"></tr>');
                var jRow = $("#tr-con-"+num).append(td1,td2,td3,td4,td5,td6,td7,td8,td9);
                t_conta.row.add(jRow);

                //por cada 15 transacciones creadas aumentamos el numero de paginas
                if(num % 16 == 0){
                    pagina=(num/16)+1;
                    $('#paginas-nuevo').html(pagina);
                }
                
                t_conta.draw();

                if(num > 10){
                    for(var i =0; i < parseInt(num / 10);i++){
                        t_conta.page( 'next' ).draw( false );    
                    }
                    
                }

                num++;

                var data2 = t_conta.rows().data();
                console.log(data2.length)
    
                if (data2.length==1){
                    $('#saldo-manual-cd-nuevo1').remove();
                    $('#after').prepend('<span id="saldo-manual-cd-nuevo1" class="input-group-addon"></span>');
                    $('#saldo-manual-cd-nuevo1').html(cdCuenta);
                }

                if(cdTrans=="RC"){
                    cdTrans="D";
                }
                else if(cdTrans=="RD"){
                    cdTrans="C";
                }

                if(cdCuenta==cdTrans){
                    if(dataP.length<1){
                        var saldo = $('#saldo-manual-nuevo1').val();
                        saldoFloatPuro = parseFloat(saldo);
                        primeroFixed = saldoFloatPuro.toFixed(2);
                        primero = commas(primeroFixed);
                        $('#saldo-manual-nuevo1').val(primero); 
                        $("#saldo-manual-nuevo1").prop('readonly', true);
                        $("#saldo-manual-nuevo1").css('background-color', '#eee');
        
                        total1 = saldoFloatPuro + montoFloatPuro;
                        totalFixed = total1.toFixed(2);
                        total = commas(totalFixed);
                        $('#saldo-manual-nuevo2').val(total);
                        $('#saldo-manual-cd-nuevo2').html(cdTrans);
                    }else{
                        var saldo = $('#saldo-manual-nuevo2').val();
                        saldo = parseFloat(monto_Float(saldo));
                        total = saldo + montoFloatPuro;
                        total = commas(total);
                        $('#saldo-manual-nuevo2').val(total);    
                    }
                        
                }else{
                    if(dataP.length<1){
                        var saldo = $('#saldo-manual-nuevo1').val();
                        saldoFloatPuro = parseFloat(saldo);
                        primeroFixed = saldoFloatPuro.toFixed(2);
                        primero = commas(primeroFixed);
                        $('#saldo-manual-nuevo1').val(primero); 
                        $("#saldo-manual-nuevo1").prop('readonly', true);
                        $("#saldo-manual-nuevo1").css('background-color', '#eee');
        
                        total1 = saldoFloatPuro - montoFloatPuro;
                        if(total1<=0){
                            total= Math.abs(total1);
                            total = commas(total);
                            $('#saldo-manual-nuevo2').val(total);
                            $('#saldo-manual-cd-nuevo2').html(cdTrans);
                        }else{
                            total = commas(total1);
                            $('#saldo-manual-nuevo2').val(total);
                            $('#saldo-manual-cd-nuevo2').html(cdTrans);
                        }   
                    }else{
                        var saldo = $('#saldo-manual-nuevo2').val();
                        saldo = parseFloat(monto_Float(saldo));
                        total = saldo - montoFloatPuro;
                        if(total<=0){
                            total= Math.abs(total);
                            total = commas(total);
                            $('#saldo-manual-nuevo2').val(total);
                            $('#saldo-manual-cd-nuevo2').html(cdTrans);
                        }else{
                            total = commas(total);
                            $('#saldo-manual-nuevo2').val(total);
                        }               
                    } 
                }

                $('#fecha-valor').val("");
                $('#fecha-entrada').val("");
                $('#selector-cd').val("C");            
                $('#monto-tran').val("");
                $('#tipo-tran').val("");
                $('#nostro-tran').val("");
                $('#vostro-tran').val("");
                $('#detalle-tran').val("");
            }
        }    
    }else{
       swal("Ups!", "Debe tener el Numero del Nuevo Estado de Cuenta a Crear", "error"); 
    }
    

});

//Procesamos todas las transacciones
$('#boton-procesar').on('click', function () {
    var $btn;
    var listaTrans = [];
    var listaCuenta = [];    
    var data = t_conta.rows().data();
    if(data.length>0){
        var fecha1 = $('#fecha-manual-nuevo1').val();
        var fecha2 = $('#fecha-manual-nuevo2').val();
        fecha1 = fechaStringtoDate(fecha1)
        fecha2 = fechaStringtoDate(fecha2)
        if(fecha2<fecha1){
            swal("Ups!", "La Fecha Inicial del Nuevo Estado de Cuenta no puede ser MAYOR a la Fecha Final", "error"); 
        }else{
            swal({
                title: "",
                text: "Seguro que desea crear el Estado de Cuenta ?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Ok"},
                function(){
                    $btn = $(this).button('loading')
                    $('#processing-modal').modal('toggle');
                    for(var i=0;i<num-1;i++){
                        var elem = data[i];
                        listaTrans.push(elem);
                    }
                    var numTrans = num-1;
                    var nroCuenta = $('#Cuenta-sel').val();
                    var codigo = $('#edo-cuenta-nuevo').val();
                    var pag = $('#paginas-nuevo').html();
                    var fechaIni = $('#fecha-manual-nuevo1').val();
                    var fechaFin = $('#fecha-manual-nuevo2').val();
                    var balIni = $('#saldo-manual-nuevo1').val();
                    var balFin = $('#saldo-manual-nuevo2').val();
                    var mIni = $('#f-nuevo-ini').html();
                    var mFin = $('#f-nuevo-fin').html();
                    var cdIni = $('#saldo-manual-cd-nuevo1').html();
                    var cdFin = $('#saldo-manual-cd-nuevo2').html();
                    var origen;
                    if (tipo =="corr-radio"){
                        origen = "S";
                    }else if (tipo =="cont-radio"){
                        origen = "L";
                    }
                    listaCuenta.push(nroCuenta);
                    listaCuenta.push(codigo);
                    listaCuenta.push(origen);
                    listaCuenta.push(pag);
                    listaCuenta.push(balIni);
                    listaCuenta.push(balFin);
                    listaCuenta.push(mIni);
                    listaCuenta.push(mFin);
                    listaCuenta.push(fechaIni);
                    listaCuenta.push(fechaFin);
                    listaCuenta.push(cdIni);
                    listaCuenta.push(cdFin);

                    cargar(listaCuenta,listaTrans,numTrans);
                }
            );
        }
    }else{
        swal("Ups!", "No existen transacciones para ser procesadas", "error"); 
    }
});

//Inicializar el DatePicker
$('#fecha-valor').pickadate({
  format: 'dd/mm/yyyy',
  formatSubmit:'dd/mm/yyyy',
  selectYears: true,
  selectMonths: true,
  max: true,
});

//Inicializar el DatePicker
$('#fecha-entrada').pickadate({
  format: 'dd/mm/yyyy',
  formatSubmit:'dd/mm/yyyy',
  selectYears: true,
  selectMonths: true,
  max: true,
});

function reiniciar_tablas(){
    t_conta.clear().draw();
    t_corr.clear().draw();
    return true;
};

// funcion para aceptar solo numerosy puntos (.)
function numero(e) {
    var codigo;
    codigo = (document.all) ? e.keyCode : e.which;
    if (codigo > 31 && ((codigo < 48 && codigo != 46) || codigo > 57) ) {
    return false;
    }
    return true;
};

// funcion para aceptar solo numeros
function solonumero(e) {
    var codigo;
    codigo = (document.all) ? e.keyCode : e.which;
    if (codigo > 31 && (codigo < 48 || codigo > 57) ) {
    return false;
    }
    return true;
};

//Dar formato a un Date a string dd/mm/yyyy
function formatearFecha(fecha){
    dia = fecha.getUTCDate();
    
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

//dado un fecha en string la convierte en un objeto Date +1 y luego a string
function nuevaFecha(fecha){
    var arreglo= fecha.split("/");
    dia = parseInt(arreglo[0]);
    mes = parseInt(arreglo[1])-1;
    anio = parseInt(arreglo[2]);
    var nueva = new Date(anio,mes,dia);
    nueva.setDate(nueva.getDate()+1);
    nueva = formatearFecha(nueva);
    return nueva;
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

//dado un monto en string la convierte en un float
function monto_Float(monto){
    var arreglo= monto.split(",");
    var flattened = arreglo.reduce(function(a, b) {
        return a.concat(b);
    });
    return flattened;
}


function iniciar_tabla(idioma,origen){

    if (idioma==="es"){

        return $('#table-'+ origen).DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/No-Filter-Tables-Spanish.json'
            },
            "autoWidth": false,
            "scrollCollapse": true,
            
            "columns": [
                { "width": "11%" },//Edo. Cuenta
                { "width": "11%" },//Num. Trans
                { "width": "11%" },//Fecha Valor
                { "width": "5%" },//C/D
                { "width": "11%" },//Monto
                { "width": "11%" },//Tipo
                { "width": "13%" },//Ref Nostro
                { "width": "13%" },//Ref Vostro
                { "width": "14%" }//Detalle
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
                { "width": "11%" },//Edo. Cuenta
                { "width": "11%" },//Num. Trans
                { "width": "11%" },//Fecha Valor
                { "width": "5%" },//C/D
                { "width": "11%" },//Monto
                { "width": "11%" },//Tipo
                { "width": "13%" },//Ref Nostro
                { "width": "13%" },//Ref Vostro
                { "width": "14%" }//Detalle
              ]
        })
    };
};

//Buscar partidas de acuerdo a la seleccion
function buscarEstado(tipo,cuentaid,moneda){
    $.ajax({
        type:"POST",
        url: "/procd/cargMan/",
        data: {'moneda':moneda,'tipo':tipo,'cuentaid':cuentaid ,'action':'buscar'},
        success: function(data){
            var carg = 0;
            var proc = 1;
            var ult_edc_conc = 0;
            var ult_edc_conp = 0;
            var ult_edc_corc = 0;
            var ult_edc_corp = 0;
            var ult_conc_existe = false;
            var ult_corc_existe = false;
            var ult_conp_existe = false;
            var ult_corp_existe = false;
            var tipo = data.tipo;
            var moneda = data.moneda;
            var json_data = jQuery.parseJSON(data.query);
           
            if (json_data[carg].length>=1){
                  
                for (var i = 0; i < json_data[carg].length; i++) {

                    if (json_data[carg][i].fields.origen === "L"){
   
                        if (!ult_conc_existe){
                            ult_edc_conc = i;
                            ult_conc_existe = true;
                        }

                    }else{
   
                        if (!ult_corc_existe){
                            ult_edc_corc = i;
                            ult_corc_existe = true;
                        }
                    }
                }
            }

            if (json_data[proc].length>=1){
            
                for (var i = 0; i < json_data[proc].length; i++) {

                    if (json_data[proc][i].fields.origen === "L"){
                        
                        if (!ult_conp_existe){
                            ult_edc_conp = i;
                            ult_conp_existe = true;
                        }

                    }else{

                        if (!ult_corp_existe){
                            ult_edc_corp = i;
                            ult_corp_existe = true;
                        }
                    }
                }
            }
            
            if (ult_conc_existe && tipo =="cont-radio"){
               
                var fecha_conc = new Date(json_data[carg][ult_edc_conc].fields.fecha_final);
                fecha_conc = formatearFecha(fecha_conc);
                $('#edo-cuenta').val(json_data[carg][ult_edc_conc].fields.codigo);
                $('#fecha-manual').val(fecha_conc);
                $('#saldo-manual-moneda').html(moneda);
                $('#saldo-manual-cd').html(json_data[carg][ult_edc_conc].fields.c_dfinal);
                $('#ffinal').html(json_data[carg][ult_edc_conc].fields.m_ffinal);
                $('#saldo-manual').val(commas(json_data[carg][ult_edc_conc].fields.balance_final));
            }

            else if (ult_conp_existe && !ult_conc_existe && tipo =="cont-radio"){
                var fecha_conp = new Date(json_data[proc][ult_edc_conp].fields.fecha_final);
                fecha_conp = formatearFecha(fecha_conp);
                
                $('#edo-cuenta').val(json_data[proc][ult_edc_conp].fields.codigo);
                $('#fecha-manual').val(fecha_conp);
                $('#saldo-manual-moneda').html(moneda);
                $('#saldo-manual-cd').html(json_data[proc][ult_edc_conp].fields.c_dfinal);
                $('#ffinal').html(json_data[proc][ult_edc_conp].fields.m_ffinal);
                $('#saldo-manual').val(commas(json_data[proc][ult_edc_conp].fields.balance_final));
            
            }

            else if (ult_corc_existe && tipo =="corr-radio"){
               
                var fecha_corc = new Date(json_data[carg][ult_edc_corc].fields.fecha_final)
                fecha_corc = formatearFecha(fecha_corc);
                $('#edo-cuenta').val(json_data[carg][ult_edc_corc].fields.codigo);
                $('#fecha-manual').val(fecha_corc);
                $('#saldo-manual-moneda').html(moneda);
                $('#saldo-manual-cd').html(json_data[carg][ult_edc_corc].fields.c_dfinal);
                $('#ffinal').html(json_data[carg][ult_edc_corc].fields.m_ffinal);
                $('#saldo-manual').val(commas(json_data[carg][ult_edc_corc].fields.balance_final));
            }

            else if (ult_corp_existe && !ult_corc_existe && tipo =="corr-radio"){
               
                var fecha_corp = new Date(json_data[proc][ult_edc_corp].fields.fecha_final)
                fecha_corp = formatearFecha(fecha_corp);
                $('#edo-cuenta').val(json_data[proc][ult_edc_corp].fields.codigo);
                $('#fecha-manual').val(fecha_corp);
                $('#saldo-manual-moneda').html(moneda);
                $('#saldo-manual-cd').html(json_data[proc][ult_edc_corp].fields.c_dfinal);
                $('#ffinal').html(json_data[proc][ult_edc_corp].fields.m_ffinal);
                $('#saldo-manual').val(commas(json_data[proc][ult_edc_corp].fields.balance_final));
            
            }else{
                
                $('#edo-cuenta').val("");
                $('#fecha-manual').val("");
                $('#saldo-manual-moneda').html("");
                $('#saldo-manual-cd').html("");
                $('#ffinal').html("");
                $('#saldo-manual').val("");
            }

            $('#processing-modal').modal('toggle');
        },
        error: function(q,error){
            alert(q.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error buscando las partidas para la cuenta especificada.", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};

function cargar(listaCuenta,listaTrans,numTrans){
        listaTrans = JSON.stringify(listaTrans);
        console.log(listaTrans)
        listaCuenta = JSON.stringify(listaCuenta);
        console.log(listaCuenta)
        $.ajax({
            type:"POST",
            url: "/procd/cargMan/",
            data: {"listaCuenta":listaCuenta, "listaTrans":listaTrans, "numTrans":numTrans, "action": "cargar"},
            success: function(data){

                if (data.exito){
                    swal({   title: "",
                             text: data.msg,
                             type: "success"
                         });
                }else{
                    swal({   title: "",
                             text: data.msg,
                             type: "error"
                         });
                }
                $('#processing-modal').modal('toggle');
                setTimeout(function(){
                    window.location.reload();
                }, 2000);
                
            },
            error: function(q,error){
                alert(q.responseText) //debug
                $('#processing-modal').modal('toggle');
                swal("Ups!", "Hubo un error con la Carga Manual, intente de Nuevo.", "error");
        },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
};
