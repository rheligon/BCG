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



var idioma = $('#idioma').val();
var idiomaAux = "";
var msj ="";

if (idioma == 0){
    idiomaAux = "es"
} else {
    idiomaAux = "en"
}


var t_conta = iniciar_tabla(idiomaAux,'conta');

if (idiomaAux==="es"){
    $.extend($.fn.pickadate.defaults, {
      monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      today: 'Hoy',
      clear: 'Limpiar',
      close: 'Cerrar',
    });
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
        $( "div" ).removeClass( "has-success" );
        $( "div" ).removeClass( "has-error" );
        $( "span" ).removeClass( "glyphicon-remove" );
        $( "span" ).removeClass( "glyphicon-ok" );
        //$( "div ul li" ).remove();
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
        $( "div" ).removeClass( "has-success" );
        $( "div" ).removeClass( "has-error" );
        $( "span" ).removeClass( "glyphicon-remove" );
        $( "span" ).removeClass( "glyphicon-ok" );
        //$( "div ul li" ).remove();
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
        $('#fecha-valor').val("");
        $('#fecha-entrada').val("");
        $('#selector-cd').val("C");            
        $('#monto-tran').val("");
        $('#tipo-tran').val("");
        $('#nostro-tran').val("");
        $('#vostro-tran').val("");
        $('#detalle-tran').val("");

        $('#saldo-manual-cd-nuevo1').remove();
        $('#after').prepend('<span id="saldo-manual-cd-nuevo1" class="input-group-addon"></span>');
        $( "div" ).removeClass( "has-success" );
        $( "div" ).removeClass( "has-error" );
        $( "span" ).removeClass( "glyphicon-remove" );
        $( "span" ).removeClass( "glyphicon-ok" );
        //$( "div ul" ).remove();





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
        $('#fecha-valor').val("");
        $('#fecha-entrada').val("");
        $('#selector-cd').val("C");            
        $('#monto-tran').val("");
        $('#tipo-tran').val("");
        $('#nostro-tran').val("");
        $('#vostro-tran').val("");
        $('#detalle-tran').val("");
        $( "div" ).removeClass( "has-success" );
        $( "div" ).removeClass( "has-error" );
        $( "span" ).removeClass( "glyphicon-remove" );
        $( "span" ).removeClass( "glyphicon-ok" );
        //$( "div ul" ).remove();
    }

    buscarEstado(tipo,cuentaId,moneda);


     
});

//Mostramos como seria el nuevo estado de cuenta
$('#boton-nuevo').on('click', function () {

    var cuentaId = $('#edo-cuenta').val();
    var cuentaVacia = $('#Cuenta-sel').val();
    cuentaId = parseInt(cuentaId);
    var fechaEdo = $('#fecha-manual').val();
    pasa = verificarFecha(fechaEdo) 


    if(pasa){
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

            var minimaFecha = fechaStringtoDate(fecha)  ;
            $("#fecha-manual-nuevo2").prop('readonly', false);
            $("#fecha-manual-nuevo2").css('background-color', 'white');

            $('#fmn1').html(inputIni);

            //inicializamos el DatePicker para Fecha Final
            if (idioma == 0){
                $('#fecha-manual-nuevo2').pickadate({
                  format: 'dd/mm/yyyy',
                  formatSubmit:'dd/mm/yyyy',
                  selectYears: true,
                  selectMonths: true,
                  max: true,
                });
            } else {
                $('#fecha-manual-nuevo2').pickadate({
                  format: 'yyyy/mm/dd',
                  formatSubmit:'dd/mm/yyyy',
                  selectYears: true,
                  selectMonths: true,
                  max: true,
                });
            }

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


            //inicializamos el DatePicker para Fecha Inicial
            if (idioma == 0){
                dp1=$('#fecha-manual-nuevo1').pickadate({
                  format: 'dd/mm/yyyy',
                  formatSubmit:'dd/mm/yyyy',
                  selectYears: true,
                  selectMonths: true,
                  max: true,
                });
            } else {
                dp1=$('#fecha-manual-nuevo1').pickadate({
                  format: 'yyyy/mm/dd',
                  formatSubmit:'dd/mm/yyyy',
                  selectYears: true,
                  selectMonths: true,
                  max: true,
                });
            }

            $("#fecha-manual-nuevo2").prop('readonly', false);
            $("#fecha-manual-nuevo2").css('background-color', 'white');

            if (idioma == 0){
                dp2=$('#fecha-manual-nuevo2').pickadate({
                  format: 'dd/mm/yyyy',
                  formatSubmit:'dd/mm/yyyy',
                  selectYears: true,
                  selectMonths: true,
                  max: true,
                });
            } else {
                dp2=$('#fecha-manual-nuevo2').pickadate({
                  format: 'yyyy/mm/dd',
                  formatSubmit:'dd/mm/yyyy',
                  selectYears: true,
                  selectMonths: true,
                  max: true,
                });
            }

            $('#saldo-manual-cd-nuevo1').remove();
            $('#after').prepend('<select id="saldo-manual-cd-nuevo1" name="saldo-manual-nuevo1" class="form-control"style="width:70px"><option value="C">C</option><option value="D">D</option></select>');

            
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
            if (idioma == 0){
                swal("Ups!", "Debe Seleccionar el Código de la Cuenta", "error");
            } else {
                swal("Ups!", "You must select the account code", "error");
            }
        }
    }else{
        if (idioma == 0){
                swal("Ups!", "El estado de cuenta del Día ya ha sido cargado", "error");
            } else {
                swal("Ups!", "The statement of today is already loaded", "error");
            }
    }
});

//agregamos las nuevas transacciones en la tabla
$('#boton-agregar').on('click', function () {

    var cuentaId = $('#edo-cuenta-nuevo').val();
    var cuentaCaso2 = $('#edo-cuenta').val();
    var dataP = t_conta.rows().data();
    cuentaId = parseInt(cuentaId);

     var error = $( "div" ).hasClass( "has-error" )
    //si ya se habia seleccionado el nuevo edo de cuenta
    if (cuentaId>=0 && !error){
        var fecha1 = $('#fecha-manual-nuevo1').val();
        var fecha2 = $('#fecha-manual-nuevo2').val();
        var saldo1 = $('#saldo-manual-nuevo1').val();
        var saldo2 = $('#saldo-manual-nuevo2').val();
        
        if(fecha1.length<1){
            if (idioma == 0){ 
                swal("Ups!", "Debe introducir la Fecha Inicial para el Nuevo Estado de Cuenta", "error");
            }  else {
                swal("Ups!", "You must introduce the new account statement initial date", "error");
            }
        }else if(fecha2.length<1){ 
            if (idioma == 0){ 
                swal("Ups!", "Debe introducir la Fecha Final para Nuevo Estado de Cuenta", "error");
             }  else {
                swal("Ups!", "You must introduce the new account statement final date", "error");
            }
        }else if(saldo1.length<1){
            if (idioma == 0){  
                swal("Ups!", "Debe introducir el Saldo Inicial para Nuevo Estado de Cuenta", "error");
            }  else {
                swal("Ups!", "You must introduce the new account statement initial balance", "error");
            }
        }else{
            var fechaValor = $('#fecha-valor').val();
            if(dataP.length==0){
                if(cuentaCaso2.length<1){
                    var cdCuenta = $('#saldo-manual-cd-nuevo1').val();    
                }else{
                    var cdCuenta = $('#saldo-manual-cd-nuevo2').html();
                }
                    
            }else{
                var cdCuenta = $('#saldo-manual-cd-nuevo2').html();
            }

            var cdTrans = $('#selector-cd').val();
            var monto = $('#monto-tran').val();
            if(idiomaAux == "es"){
                monto = monto.replace(",",".")
            }
            montoFloatPuro = parseFloat(monto)
            montoFloatPuroFixed = montoFloatPuro.toFixed(2);
            montoFloat = $.formatNumber(montoFloatPuroFixed,{locale:idiomaAux})
            var tipo = $('#tipo-tran').val();
            var nostro = $('#nostro-tran').val();
            var vostro = $('#vostro-tran').val();
            var detalle = $('#detalle-tran').val();

            //validaciones de campos obligatorios
            if(fechaValor.length<1){
                if (idioma == 0){ 
                    swal("Ups!", "Debe introducir la Fecha Valor de la Transacción", "error");
                }  else {
                    swal("Ups!", "You must introduce the transaction value date", "error");
                }
            }
            else if(monto.length<1){
                if (idioma == 0){
                    swal("Ups!", "Debe introducir el Monto de la Transacción", "error");
                }  else {
                    swal("Ups!", "You must introduce the transaction amount", "error");
                }
            }else if(tipo.length<1){
                if (idioma == 0){
                    swal("Ups!", "Debe introducir el Tipo de la Transacción", "error");
                }  else {
                    swal("Ups!", "You must introduce the transaction type", "error");
                }
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
                        if(cuentaCaso2.length<1){
                            if(idiomaAux=="es"){
                                saldo = saldo.replace(",",".");
                                saldoFloatPuro = parseFloat(saldo);    
                            }else{
                                saldoFloatPuro = parseFloat(saldo);    
                            }
                        }else{
                            if(idiomaAux == "es"){
                                saldo = saldo.replace(/\./g,"");
                                saldo = saldo.replace(",",".");
                            }else{
                                saldo = saldo.replace(/,/g,"");
                            }
                            saldoFloatPuro = parseFloat(saldo);
                        }
                        primeroFixed = saldoFloatPuro.toFixed(2);
                        primero = $.formatNumber(primeroFixed,{locale:idiomaAux}) 

                        $('#saldo-manual-nuevo1').val(primero); 
                        $("#saldo-manual-nuevo1").prop('readonly', true);
                        $("#saldo-manual-nuevo1").css('background-color', '#eee');
                        $("#edo-cuenta-nuevo").prop('readonly', true);
                        $("#edo-cuenta-nuevo").css('background-color', '#eee');
        
                        total1 = saldoFloatPuro + montoFloatPuro;
                        totalFixed = total1.toFixed(2);
                        total = $.formatNumber(totalFixed,{locale:idiomaAux});
                        $('#saldo-manual-nuevo2').val(total);
                        $('#saldo-manual-cd-nuevo2').html(cdTrans);
                    }else{
                        var saldo = $('#saldo-manual-nuevo2').val();
                        if(idiomaAux == "es"){
                            saldo = saldo.replace(/\./g,"");
                            saldo = saldo.replace(",",".");
                        }else{
                            saldo = saldo.replace(/,/g,"");
                        }
                        saldo = parseFloat(saldo);
                        total = saldo + montoFloatPuro;
                        total = $.formatNumber(total,{locale:idiomaAux});
                        $('#saldo-manual-nuevo2').val(total);    
                    }
                        
                }else{
                    if(dataP.length<1){
                        var saldo = $('#saldo-manual-nuevo1').val();
                        if(cuentaCaso2.length<1){
                            if(idiomaAux=="es"){
                                saldo = saldo.replace(",",".");
                                saldoFloatPuro = parseFloat(saldo);    
                            }else{
                                saldoFloatPuro = parseFloat(saldo);    
                            }
                        }else{
                            if(idiomaAux == "es"){
                                saldo = saldo.replace(/\./g,"");
                                saldo = saldo.replace(",",".");
                            }else{
                                saldo = saldo.replace(/,/g,"");
                            }
                            saldoFloatPuro = parseFloat(saldo);
                        }
                        primeroFixed = saldoFloatPuro.toFixed(2);
                        primero = $.formatNumber(primeroFixed,{locale:idiomaAux});
                        $('#saldo-manual-nuevo1').val(primero); 
                        $("#saldo-manual-nuevo1").prop('readonly', true);
                        $("#saldo-manual-nuevo1").css('background-color', '#eee');
                        $("#edo-cuenta-nuevo").prop('readonly', true);
                        $("#edo-cuenta-nuevo").css('background-color', '#eee');
        
                        total1 = saldoFloatPuro - montoFloatPuro;
                        if(total1<=0){
                            total= Math.abs(total1);
                            total = $.formatNumber(total,{locale:idiomaAux});
                            $('#saldo-manual-nuevo2').val(total);
                            $('#saldo-manual-cd-nuevo2').html(cdTrans);
                        }else{
                            total = $.formatNumber(total1,{locale:idiomaAux});
                            $('#saldo-manual-nuevo2').val(total);
                            $('#saldo-manual-cd-nuevo2').html(cdCuenta);
                        }   
                    }else{
                        var saldo = $('#saldo-manual-nuevo2').val();
                        if(idiomaAux == "es"){
                            saldo = saldo.replace(/\./g,"");
                            saldo = saldo.replace(",",".");
                        }else{
                            saldo = saldo.replace(/,/,"");
                        }
                        saldo = parseFloat(monto_Float(saldo));
                        total = saldo - montoFloatPuro;
                        if(total<=0){
                            total= Math.abs(total);
                            total = $.formatNumber(total,{locale:idiomaAux});
                            $('#saldo-manual-nuevo2').val(total);
                            $('#saldo-manual-cd-nuevo2').html(cdTrans);
                        }else{
                            total = $.formatNumber(total,{locale:idiomaAux});
                            $('#saldo-manual-nuevo2').val(total);
                            $('#saldo-manual-cd-nuevo2').html(cdCuenta);
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
                $( "div" ).removeClass( "has-success" );
                $( "div" ).removeClass( "has-error" );
                $( "span" ).removeClass( "glyphicon-remove" );
                $( "span" ).removeClass( "glyphicon-ok" );
                //$( "div ul li" ).remove();
                
            }
        }    
    }else{
        if (idioma == 0){ 
            if(error){
                swal("Ups!", "Debe corregir el error mostrado.", "error");
            }else{
                swal("Ups!", "Debe tener el Numero del Nuevo Estado de Cuenta a Crear", "error"); 
            }
            
        } else {

            if(error){
                swal("Ups!", "You must correct The error.", "error");
            }else{
                swal("Ups!", "You must have the number of the new account statement to create", "error");
            }
        }
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
            if (idioma == 0){ 
                swal("Ups!", "La Fecha Inicial del Nuevo Estado de Cuenta no puede ser MAYOR a la Fecha Final", "error"); 
            } else {
                swal("Ups!", "The new account statement initial date can not be greater than initial date", "error");
            }
        }else{
            if (idioma == 0){
                msj = "Seguro que desea crear el Estado de Cuenta ?";
            } else {
                msj = "Sure you want create new account statement";
            }
            swal({
                title: "",
                text: msj,
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
        if (idioma == 0){
            swal("Ups!", "No existen transacciones para ser procesadas", "error"); 
        } else {
            swal("Ups!", "There are not transactions to be process", "error");
        }
    }
});

//Inicializar el DatePicker
if (idioma == 0){
    $('#fecha-valor').pickadate({
      format: 'dd/mm/yyyy',
      formatSubmit:'dd/mm/yyyy',
      selectYears: true,
      selectMonths: true,
      max: true,
    });
} else {
    $('#fecha-valor').pickadate({
      format: 'yyyy/mm/dd',
      formatSubmit:'dd/mm/yyyy',
      selectYears: true,
      selectMonths: true,
      max: true,
    });
}

//Inicializar el DatePicker
if (idioma == 0){
    $('#fecha-entrada').pickadate({
      format: 'dd/mm/yyyy',
      formatSubmit:'dd/mm/yyyy',
      selectYears: true,
      selectMonths: true,
      max: true,
    });
} else {
    $('#fecha-entrada').pickadate({
      format: 'yyyy/mm/dd',
      formatSubmit:'dd/mm/yyyy',
      selectYears: true,
      selectMonths: true,
      max: true,
    });
}

function reiniciar_tablas(){
    t_conta.clear().draw();
    t_corr.clear().draw();
    return true;
};

// funcion para aceptar solo numerosy puntos (.)
function numero(e) {
    var codigo;
    codigo = (document.all) ? e.keyCode : e.which;
    if (codigo > 31 && ((codigo < 48 && codigo != 44) || codigo > 57) ) {
    return false;
    }
    return true;
};

function number(e) {
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
    if (idioma == 0){
        nueva = dia +"/" + mes + "/" +anio;
    } else {
        nueva = anio +"/" + mes + "/" +dia;
    }
    return nueva;
}

//dado un fecha en string la convierte en un objeto Date +1 y luego a string
function nuevaFecha(fecha){
    var arreglo= fecha.split("/");
    if (idioma == 0){
        dia = parseInt(arreglo[0]);
        mes = parseInt(arreglo[1])-1;
        anio = parseInt(arreglo[2]);
    } else {
        dia = parseInt(arreglo[2]);
        mes = parseInt(arreglo[1])-1;
        anio = parseInt(arreglo[0]);
    }
    var nueva = new Date(anio,mes,dia);
    var hoy = new Date();
    
    diaN = hoy.getUTCDate();
    mesN = hoy.getUTCMonth();
    anioN = hoy.getUTCFullYear();

    var fechaHoy = new Date(anioN,mesN,diaN);
    
    if(fechaHoy.getTime() == nueva.getTime()){
        nueva = formatearFecha(nueva);    
    }else{
        nueva.setDate(nueva.getDate()+1);
        nueva = formatearFecha(nueva); 
    }
    return nueva;
}

function verificarFecha(fecha){
    var arreglo= fecha.split("/");
    if (idioma == 0){
        dia = parseInt(arreglo[0]);
        mes = parseInt(arreglo[1])-1;
        anio = parseInt(arreglo[2]);
    } else {
        dia = parseInt(arreglo[2]);
        mes = parseInt(arreglo[1])-1;
        anio = parseInt(arreglo[0]);
    }
    var nueva = new Date(anio,mes,dia);
    var hoy = new Date();
    
    diaN = hoy.getUTCDate();
    mesN = hoy.getUTCMonth();
    anioN = hoy.getUTCFullYear();

    var fechaHoy = new Date(anioN,mesN,diaN);
    
    if(fechaHoy.getTime() == nueva.getTime()){
        pasa = false;    
    }else{
        pasa = true;
    }
    return pasa;
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
            if(data.edocuenta != ""){
                var json_edocuenta = jQuery.parseJSON(data.edocuenta);
                json_edocuenta = json_edocuenta[0].fields;
            }
    
            if (json_edocuenta){  
                var fecha_conc = new Date(json_edocuenta.fecha_final);
                fecha_conc = formatearFecha(fecha_conc);
                $('#edo-cuenta').val(json_edocuenta.codigo);
                $('#fecha-manual').val(fecha_conc);
                $('#saldo-manual-moneda').html(moneda);
                $('#saldo-manual-cd').html(json_edocuenta.c_dfinal);
                $('#ffinal').html(json_edocuenta.m_ffinal);
                $('#saldo-manual').val($.formatNumber((json_edocuenta.balance_final),{locale:idiomaAux}));
            }else{
                
                $('#edo-cuenta').val("");
                $('#fecha-manual').val("");
                $('#saldo-manual-moneda').html("");
                $('#saldo-manual-cd').html("");
                $('#ffinal').html("");
                $('#saldo-manual').val("");
            }

            $( "div" ).removeClass( "has-success" );
            $( "div" ).removeClass( "has-error" );
            $( "span" ).removeClass( "glyphicon-remove" );
            $( "span" ).removeClass( "glyphicon-ok" );
            //$( "div ul" ).remove();

            $('#processing-modal').modal('toggle');
        },
        error: function(q,error){
            alert(q.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("Ups!", "Hubo un error buscando las partidas para la cuenta especificada.", "error");
            } else {
                swal("Ups!", "Error occurred trying to search entries for the account.", "error");
            }
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
        listaCuenta = JSON.stringify(listaCuenta);
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
                }, 1000);
                
            },
            error: function(q,error){
                alert(q.responseText) //debug
                $('#processing-modal').modal('toggle');
                if (idioma == 0){
                    swal("Ups!", "Hubo un error con la Carga Manual, intente de Nuevo.", "error");
                } else {
                    swal("Ups!", "Error occurred. Try againg plase.", "error");
                }
        },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
};
