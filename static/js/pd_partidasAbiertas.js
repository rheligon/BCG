var csrftoken = $.cookie('csrftoken');
var faltacorr = false;
var matchArray = [];
var filterArray = [[],[],[],[],[],[]];
var edcArray = [[],[]];
var mt95Array=[];
var mt95Aux=[];
var copiaAux = [];
var copia = [];
var opcionChequeada = "";
var idioma = $('#idioma').val();
var idiomaAux = "";
var msj ="";
var centinela = true;

if (idioma == 0){
    idiomaAux = "es"
} else {
    idiomaAux = "en"
}

var tabla = iniciar_tabla(idiomaAux);

// chequear formato de los numeros
function chequearFornatoNumero(elem){
    if (idioma == 1){
        return (/^(\d{1})+(\.\d{1,2})?$/.test(elem))
    } else {
        return (/^(\d{1})+(\,\d{1,2})?$/.test(elem))
    }
};

// funcion para aceptar solo numeros
function solonumeroypunto(e) {
    var codigo;
    codigo = (document.all) ? e.keyCode : e.which;
    if (codigo == 46 || (codigo > 47 && codigo < 58) ) {
    return true;
    }
    return false;
}; 

// funcion para aceptar solo numeros
function solonumeroycoma(e) {
    var codigo;
    codigo = (document.all) ? e.keyCode : e.which;
    if (codigo == 44 || (codigo > 47 && codigo < 58) ) {
    return true;
    }
    return false;
}; 


function dateFormat(fecha){
    var date_final = "";
    var date = new Date(Date.parse(fecha));
    var res =date.setDate(date.getDate() + 1);
    res = date.toLocaleDateString();
    var date_aux = res.split("/");
    if (parseInt(date_aux[0]) < 10){
        date_aux[0] = '0' + date_aux[0];
    }
    if (parseInt(date_aux[1]) < 10){
        date_aux[1] = '0' + date_aux[1];
    }

    if (idioma == 0){
        date_final = date_aux.join("/");
    } else {
        date_final = date_aux.reverse().join("/");
    }

    return date_final;
}

function vacio(str){
    if (str===""){
        return str
    }else if (str==="None"){
        return ""
    }else if (str===null){
        return ""
    }
    return str
}

function check_falta(tipo){

    if (tipo === 'conta'){
        faltaconta = false;
    }else if(tipo==='corr'){
        faltacorr = false;
    }

    if (!faltaconta && !faltacorr){
        $('#pbar').addClass('progress-bar-success');
        setTimeout(
            function(){ 
                $('#pbardiv').prop('hidden', true);
            },
            8000
        );
        tabla.fnDraw();
        edcArray = [[],[]];
    }
}

function iniciar_tabla(idioma){

    if (idioma==="es"){

        return $('#table-pa').dataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "scrollY": "350px",
            "dom": "frtiS",
            "scrollCollapse": true,
            "scrollX": true,
            //"deferRender": true,
            //"orderClasses": false,
            "autoWidth": false,
            "columns": [
                { "width": "5%" },
                { "width": "5%" },
                { "width": "8%" },
                { "width": "8%" },
                { "width": "8%" },
                { "width": "8%" },
                { "width": "30%" },
                { "width": "5%" },
                { "width": "11%" },
                { "width": "5%" },
                { "width": "5%" },
                { "width": "5%" },
                { "width": "5%" },
              ],
        })

    }else if (idioma==="en"){

        return $('#table-pa').dataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "scrollY": "350px",
            "dom": "frtiS",
            "scrollCollapse": true,
            "scrollX": true,
            //"deferRender": true,
            //"orderClasses": false,
            "autoWidth": false,
            "columns": [
                { "width": "5%" },
                { "width": "5%" },
                { "width": "8%" },
                { "width": "8%" },
                { "width": "8%" },
                { "width": "8%" },
                { "width": "30%" },
                { "width": "5%" },
                { "width": "11%" },
                { "width": "5%" },
                { "width": "5%" },
                { "width": "5%" },
                { "width": "5%" },
            ],
        });
    }
};

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
    $('#f-desde').pickadate({
      format: 'dd/mm/yyyy',
      formatSubmit:'dd/mm/yyyy',
      selectYears: true,
      selectMonths: true,
      max: true,
    });
} else {
    $('#f-desde').pickadate({
      format: 'yyyy/mm/dd',
      formatSubmit:'dd/mm/yyyy',
      selectYears: true,
      selectMonths: true,
      max: true,
    });
}
//Inicializar el DatePicker
if (idioma == 0){
    $('#f-hasta').pickadate({
      format: 'dd/mm/yyyy',
      formatSubmit:'dd/mm/yyyy',
      selectYears: true,
      selectMonths: true,
      max: true,
    });
} else {
    $('#f-hasta').pickadate({
      format: 'yyyy/mm/dd',
      formatSubmit:'dd/mm/yyyy',
      selectYears: true,
      selectMonths: true,
      max: true,
    });
}

//Resetear los filtros
$('#cancelButton').on('click', function () {

    //Checkear los filtros
    $('.cbfilter').each(function(){

    $(this).prop('checked', false); //descheckear checkbox
    
    var idaux = $(this).attr('id').split('-')[0];
    var id = '#filter-'+idaux;

    if (idaux==='monto'){
        $('#monto-desde').val('');
        $('#monto-hasta').val('');
    }

    if (idaux==='ref'){
        $(id+' input[type=radio]:checked').prop('checked', false);
        $('#ref-txt').val('');
    }

    if (idaux==='cod'){
        $(id+' input[type=radio]:checked').prop('checked', false);
    }

    if (idaux==='fecha'){
        $('#f-desde').val('');
        $('#f-hasta').val('');
    }

    if (idaux==='tipo'){
        $('#tipo-trans').val('');
    }

    if (idaux==='origen'){
        $(id+' input[type=radio]:checked').prop('checked', false);
    }
    });

    filterArray = [[],[],[],[],[],[]];
    $('#filter-div').hide();
});

//Buscar partidas con la cuenta y filtros elegidos
$('#srchButton').on('click', function () {
    var ctaid = $('#Cuenta-sel').val().split("-")[0];

    if (ctaid<=0){
        if (idioma == 0){
          swal("Ups!", "Por favor elija una cuenta primero.", "error");
        } else {
          swal("Ups!", "Select account first please.", "error");  
        }
    }else{

      $('#processing-modal').modal('toggle');

      //Inicializar todo de nuevo
      $('#pbar').removeClass('progress-bar-success');
      $('#pbar').attr('max', 0);
      $('#pbar').attr('current', 0);
      $('#pbartxt').text('0%');
      $('#pbar').css('width', '0%');
      //tabla.clear().draw();
      tabla.fnClearTable();
      faltaconta = false;
      faltacorr = false;
      matchArray =[];
      filterArray = [[],[],[],[],[],[]];
      edcArray = [[],[]];
      $('#checkAllButton').attr('selec',0);

      //Checkear los filtros
      $('.cbfilter:checked').each(function(){
        var idaux = $(this).attr('id').split('-')[0];
        var id = '#filter-'+idaux;

        if (idaux==='monto'){
            if ($('#monto-desde').val() === "" || $('#monto-hasta').val() === "" ){
                $('#processing-modal').modal('toggle');
                if (idioma == 0){
                    swal("Ups!", "Los montos deben tener valores asignados.", "error");
                } else {
                    swal("Ups!", "Amounts can not be empty.", "error");
                }
                centinela = false;
            } else {
                var p = chequearFornatoNumero($('#monto-desde').val());
                var q = chequearFornatoNumero($('#monto-hasta').val());
                if (p && q){
                    if (idioma == 0){
                        var desde = $('#monto-desde').val();
                        var hasta = $('#monto-hasta').val();
                    } else {
                        var desde = $('#monto-desde').val().replace(",",".");
                        var hasta = $('#monto-hasta').val().replace(",",".");
                    }
                    if (parseFloat(desde) > parseFloat(hasta)){
                        if (idioma == 0){
                            swal("Ups!", 'El monto "Desde" debe ser menor que el monto "Hasta".', "error");
                        } else {
                            swal("Ups!", '"Since" amount must be less than "Until" amount.', "error");
                        }
                        $('#processing-modal').modal('toggle');
                        centinela = false;
                    } else {
                        filterArray[0].push(desde);
                        filterArray[0].push(hasta);
                        centinela = true;
                    }
                } else {
                    if (idioma == 0){
                        swal("Ups!", "Los montos no cumplen el formato", "error");
                    } else {
                        swal("Ups!", "Wrong amount format", "error");
                    }
                    $('#processing-modal').modal('toggle');
                    centinela = false;
                }
            }
        }

        if (idaux==='ref'){
            var rad = $(id+' input[type=radio]:checked').val();
            if (rad != undefined ){
                filterArray[1].push(rad);
                filterArray[1].push($('#ref-txt').val());
            }
        }

        if (idaux==='cod'){
            var rad = $(id+' input[type=radio]:checked').val();
            if (rad != undefined ){
                filterArray[2].push(rad);
            }
        }

        if (idaux==='fecha'){
            var fd = $('#f-desde').val();
            var fh = $('#f-hasta').val();
            var aux_fd ="";
            var aux_fh ="";
            if(fh==="" || fd===""){
                $('#processing-modal').modal('toggle');
                if (idioma == 0){
                    swal("Ups!", "Las fechas no pueden estar vacías", "error");
                } else {
                    swal("Ups!", "Dates can not be empty.", "error");
                }
                centinela = false;
                $('#f-desde').val('');
                $('#f-hasta').val('');
            } else{
                if (idioma == 1){
                    aux_fd = new Date(fd);
                    aux_fh = new Date(fh);
                } else {
                    var aux1 = fd.split("/").reverse().join("/");
                    var aux2 = fh.split("/").reverse().join("/");
                    aux_fd = new Date(aux1);
                    aux_fh = new Date(aux2);
                }
                if (aux_fd >= aux_fh){
                    $('#processing-modal').modal('toggle');
                    if (idioma == 0){
                        swal("Ups!", 'La fecha "desde" debe ser menor que la fecha "hasta"', "error");
                    } else {
                        swal("Ups!", '"From" date must be less than "To" date', "error");
                    }
                    centinela = false;
                    $('#f-desde').val('');
                    $('#f-hasta').val('');
                } else {
                    if (idioma == 0){
                        filterArray[3].push(fd);
                        filterArray[3].push(fh);
                        centinela = true;
                    } else {
                        var fd_en = fd.split("/").reverse().join("/");
                        var fh_en = fh.split("/").reverse().join("/");
                        filterArray[3].push(fd_en);
                        filterArray[3].push(fh_en);
                        centinela = true;
                    }
                }
            }
        }

        if (idaux==='tipo'){
            var tipo = $('#tipo-trans').val();
            filterArray[4].push(tipo);
        }

        if (idaux==='origen'){
            var rad = $(id+' input[type=radio]:checked').val();
            if (rad != undefined ){
                filterArray[5].push(rad);
            }
        }        
      });

        if (centinela){
          //Llamar funcion de busqueda
          busqueda(ctaid,filterArray);
        }
    }
});


//Introducir en el arreglo las filas que se haya chequeado el checkbox
$('#table-pa').on('click','input[type=checkbox]', function(event) {
   if($(this).is(':checked')){
        matchArray.push($(this).closest('tr').attr('id'));
   }else{
        var index = matchArray.indexOf($(this).closest('tr').attr('id'));
        if (index >= 0) {
          matchArray.splice( index, 1 );
        }
   }

});

//Chequear todos los cb
$('#checkAllButton').on('click', function () {
    var selec = parseInt($(this).attr('selec'));
    var rows   = tabla.fnGetNodes();
    matchArray = [];

    if (selec === 0){
        $('#checkAllButton').attr('selec',1);

        //Añadir checks a los checkboxes no escondidos
        $('.chkSelection').each(function(){
            $(this).prop('checked',true);
            matchArray.push($(this).closest('tr').attr('id'));
        });

        // Añadir checks a los checkboxes escondidos
        for ( var i = 0, len = rows.length; i < len; i++) {
            var $fields = $(rows[i]).find('input[type="checkbox"]:hidden');
             
            $fields.each(function (idx, el) {
                    matchArray.push($(el).closest('tr').attr('id'));
                    $(el).prop('checked',true);
            });
        }

    }else{
        $('#checkAllButton').attr('selec',0);

        //Quitar checks a los checkboxes no escondidos
        $('.chkSelection').each(function(){
            $(this).prop('checked',false)

        });


        // Quitar checks de los checkboxes escondidos
        for ( var i = 0, len = rows.length; i < len; i++) {
            var $fields = $(rows[i]).find('input[type="checkbox"]:hidden:checked');
             
            $fields.each(function (idx, el) {
                    $(el).prop('checked',false);
            });
        }
    }
});

//Verificar suma de montos y enviar tds
$('#matchButton').on('click', function () {
    if (matchArray.length <2){
        if (idioma == 0){
          swal("", "Debe elegir una pareja primero.", "error");
        } else {
          swal("Ups!", "You must select a match couple first.", "error");  
        }
    }else{
        
        var montocredito = 0.0;
        var montodebito = 0.0;
        var rows = tabla.fnGetNodes();

        for (var i=0,len=rows.length;i<len;i++){

            var tds = $(rows[i]).find('td');

            if (tds.eq(10).children().prop('checked')){

                if (tds.eq(7).html() === 'C'){
                    montocredito += parseFloat(tds.eq(8).attr('monto'));

                }else if (tds.eq(7).html() === 'D'){
                    montodebito += parseFloat(tds.eq(8).attr('monto'));
                }

            }
        }

        //Verificar si los montos estan bien y llamar match, sino mostrar error
        var diferencia = montocredito-montodebito;
        diferencia = 0;

        if (Math.round(diferencia) != 0.0){
            if (idiomaAux === 'es'){
                var title = 'Montos Incorrectos:';

                var msg = 'Créditos:\nTotal Créditos: '+ $.formatNumber(montocredito,{locale:idiomaAux});
                msg += '\n\nDébitos:\nTotal Débitos: '+$.formatNumber((-montodebito),{locale:idiomaAux});
                msg += '\n\nDiferencia: '+$.formatNumber(diferencia,{locale:idiomaAux});
            }else if (idiomaAux === 'en'){
                var title = 'Incorrect ammounts:';

                var msg = 'Credits:\nCredits Total: '+ $.formatNumber(montocredito,{locale:idiomaAux});
                msg += '\n\nDebits:\nDebits Total: '+$.formatNumber((-montodebito),{locale:idiomaAux});
                msg += '\n\nDifference: '+$.formatNumber(diferencia,{locale:idiomaAux});
            }

            swal({  title: title,
                    text: msg,
                    type: "error",
                    confirmButtonText: "Ok" });
        }else{
            //Pedir justificacion
            $('#justificacion-modal').modal('toggle');
        }
    }


});

//Cuando se llena la justificacion, se llama a hacer match
$('#just-submit').on('click', function(event){
    event.preventDefault();

    var justificacion = $('#justificacion').val();

    $('#justificacion-modal').modal('toggle');
    $('#processing-modal').modal('toggle');
    
    hacer_match(matchArray, justificacion);
});

//Resetear campos del formulario cuando se esconde (la justificacion)
$('.modal:not(.modal-static)').on('hidden.bs.modal', function(){
    $(this).find('form')[0].reset();
});

//Mostrar o esconder filtros elegidos
$('.cbfilter').on('click', function(){

    $('#filter-div').show();
    $('#filter-div > div').hide();

    var idaux = $(this).attr('id').split('-')[0];
    var id = '#filter-'+idaux;

    if (!this.checked){
        $(id).hide();
        $('#filter-div').hide();

    }else{
        $(id).show();
    }
});

//Buscar partidas de acuerdo a la seleccion
function busqueda(ctaid,filterArray){
    $.ajax({
        type:"POST",
        url: "/procd/pAbiertas/",
        data: {"ctaid": ctaid, 'filterArray':filterArray ,'action':'buscar'},
        success: function(data){
            var json_conta = jQuery.parseJSON(data.r_conta);
            var json_corr = jQuery.parseJSON(data.r_corr);
            edcArray = data.r_edcn;
            var json_mt95 = jQuery.parseJSON(data.r_95);
            mt95Array = json_mt95;
            copiaAux = mt95Array;

            $('#pbardiv').prop('hidden', false);
            $('#pbar').attr('max', json_corr.length+json_conta.length);

            // Initalize and start iterating
            var contaIter = new heavyLifter(json_conta,'conta');
            contaIter.startCalculation();

            // Initalize and start iterating
            var corrIter = new heavyLifter(json_corr,'corr');
            corrIter.startCalculation();

            $('#processing-modal').modal('toggle');
        },
        error: function(q,error){
            alert(q.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("Ups!", "Hubo un error buscando las partidas para la cuenta especificada.", "error");
            } else {
                swal("Ups!", "Error occured searching entries for the account.", "error");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};

//Hacer match de acuerdo a la seleccion
function hacer_match(matchArray,justificacion){
    $.ajax({
        type:"POST",
        url: "/procd/pAbiertas/",
        data: {'matchArray':matchArray,'justificacion':justificacion, 'action':'match'},
        success: function(data){
            $('#processing-modal').modal('toggle');
            swal({  title: '',
                    text: data.msg,
                    type: "success",
                    confirmButtonText: "Ok" });
            tabla.fnClearTable();
        },
        error: function(q,error){
            alert(q.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("Ups!", "Hubo un error matcheando las partidas para la cuenta especificada.", "error");
            } else {
                swal("Ups!", "Error occurred matching entries for the account.", "error");     
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};


function heavyLifter(jsonArr,tipo) {
 
    this.elementsLength = jsonArr.length; // Amount of operations
    this.currentPosition = 0;   // Current position
    this.array = jsonArr;
    this.tipo = tipo;
    this.inter = undefined;
 
    // Initializer to start the iterator
    this.startCalculation = function() {
        // Reset current position to zero
        this.currentPosition = 0;
        // Start looping
        this.inter = setInterval(
            this.calculate.bind(this),
            4000
        );

        if (tipo === 'conta'){
            faltaconta = true;
        }else if(tipo==='corr'){
            faltacorr = true;
        }

    }
 
    this.calculate = function(){
        // Check that we still have iterations left, otherwise, return
        // out of function without calling a new one.
        if( this.currentPosition > this.elementsLength ){
            check_falta(this.tipo);
            return;
        } 
 
        // save currentposition, because we'll alter it
        // in the loop
        var n = this.currentPosition;
        var current = parseInt($('#pbar').attr('current'));


        // Batch process 50 elements at a time
        for( var i = n; i < n+350; i++ ){
            // Check that we haven't run out of elements
            if( this.currentPosition >= this.elementsLength ){
                clearInterval(this.inter);
                check_falta(this.tipo);
                //tabla.draw();
                break;
            }
            // Add to counter
            this.currentPosition++;
            current++;
            copia = mt95Array;
            if (this.tipo==='conta'){
                calcularfila(this.array[i],this.tipo,edcArray[0][i]);
            }else{
                calcularfila(this.array[i],this.tipo,edcArray[1][i]);
            }
        }

        //Barra de progreso
        var max = $('#pbar').attr('max');
        
        if (max === '0'){
            var prog = 100;
        }else{
            var prog = Math.round(current/max*100);
        }
        var width = prog+'%';

        $('#pbartxt').text(width);
        $('#pbar').css('width', width);
        $('#pbar').attr('current', current);
        
        if( n === 0 ){
            //tabla.draw();
            tabla.fnDraw();
        }

    }
}

function calcularfila(elem,tipo,edc){
    var a_id = elem.pk;
    var a_cod = elem.fields.codigo;

    var td1 = '<td>' + edc + '</td>';
    var td2 = '<td>' + elem.fields.pagina + '</td>';
    var td3 = '<td>' + dateFormat(elem.fields.fecha_valor) + '</td>';
    var td4 = '<td>' + elem.fields.codigo_transaccion + '</td>';
    var td5 = '<td>' + vacio(elem.fields.referencianostro) + '</td>';
    var td6 = '<td>' + vacio(elem.fields.referenciacorresponsal) + '</td>';
    var td7 = '<td>' + vacio(elem.fields.descripcion) + '</td>';
    var td8 = '<td class="cod">' + elem.fields.credito_debito + '</td>';
    var td9 = '<td class="monto" monto="'+elem.fields.monto+'">' + $.formatNumber(elem.fields.monto,{locale:idiomaAux}) + '</td>';
    if (tipo==='conta'){
        var td10 = '<td>L</td>';
    }else{
        var td10 = '<td>S</td>';
    }
    var td11 = '<td style="text-align:center; width: 24px;"><input class="chkSelection" type="checkbox" id="cb-'+tipo+'-'+a_id+'"></td>';
    var td12 = '<td style="text-align:center; width: 24px;"></td>';
    var td13 = '<td style="text-align:center; width: 24px;"><input class="chkSelection3" name="mtopc" type="radio" id="cb-'+elem.pk+"-"+tipo+'" onclick="habilitar(this)"></td>';

    
    var cuentaVeces = 0;
    var key = 0;
    for (var i = 0 ; i < copia.length; i++) {

        
        if (copia[i].fields.ta_conta === elem.pk || copia[i].fields.ta_corres === elem.pk){

            cuentaVeces = cuentaVeces + 1;
            key = copia[i].pk;
            td12 = '<td style="text-align:center; width: 24px;"><span class="fa fa-envelope" id="cb-'+elem.pk+'"></span></td>';
    
        }

    }

    if (key!=0){
        findAndRemove(mt95Array, 'pk', key);
    }

    
    $('#table-pa > tbody').append('<tr id ="tr-'+tipo+'-'+a_id+'"></tr>');

    var jRow = $("#tr-"+tipo+"-"+a_id).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10,td11,td12,td13);
    //tabla.row.add(jRow);
    tabla.fnAddData(jRow,false);
}

//para quitar una entrada de un arreglo de json
function findAndRemove(array, property, value) {
   $.each(array, function(index, result) {
        if (result != undefined) {
          if(result[property] == value) {
              //Remove from array
              array.splice(index, 1);
          }
      }    
   });
}

//Habilitar los botones de crear y ver MT
function habilitar(element){
    $('#verMTButton').removeAttr('disabled');
    $('#crearMTButton').removeAttr('disabled');
    este = $(element).attr('id');
}

//para cambiar div
$('#regresarCMT95Button').on('click', function () {
    

    document.getElementById("MT95-crear").style.display = "none";
    document.getElementById("MT95-verTabla").style.display = "block";

});

//Crear un mensaje MTn95
$('#crearMTButton').on('click', function () {
    
    document.getElementById("MT95-verTabla").style.display = "none";
    document.getElementById("MT95-crear").style.display = "block";

});

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
    var codigo = $('#mt95cod').val().split("-")[0];
    var codigo2 = $('#mt95cod').val().split("-")[2];
    var narrativa = $('#mt95cod').val().split("-")[1];
    var original = $('#narrativa').val();
    var tipoOriginal = $('#claseOriginal').val();
    var pregunta = codigo2;
    var transaccion = este.split('-')[1];
    var cuenta = $('#Cuenta-sel').val().split("-")[1];
    var clase = este.split('-')[2];
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
        url: "/procd/pAbiertas/",
        data: {"ref95":ref_mensaje, "refOrg95":ref_mensaje_original, "tipo95":tipo, "fecha95":fecha, "cod95":codigo, "preg95":pregunta, "narrativa95":narrativa, "original95":original, "transaccion":transaccion, "action":"crearMT95", "clase":clase, "cuenta":cuenta, "codigo2":codigo2, "tipoOriginal":tipoOriginal},
        success: function(data){
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("OK", "Mensaje creado exitosamente", "success");
            } else {
                swal("OK", "Successful created message", "success");
            }
            window.location.reload();
            

        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma == 0){
                swal("Ups!", "Hubo un error al intertar crear el mensaje", "error");
            } else {
                swal("OK", "Error occurred trying to create the message", "success");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}

//Boton para ver los MTn95/96 asociados a una transaccion
$('#verMTButton').on('click', function () {

    var transaccion = este.split('-')[1];
    var clase = este.split('-')[2];
    var currenturl = $(location).attr("href");
    var aux = currenturl.split('/');
    aux.pop();
    aux.pop();
    aux.push("detallesMT");
    aux.push(transaccion);
    aux.push(clase);
    var url = aux.join('/');
    //Redireccionar
    console.log(url);
    $(location).attr("href", url);
    
    //$('#processing-modal').modal('toggle');
    
});

