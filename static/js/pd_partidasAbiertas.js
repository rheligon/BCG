var csrftoken = $.cookie('csrftoken');
var tabla = iniciar_tabla(idioma_tr);
var faltaconta = false;
var faltacorr = false;
var matchArray = [];
var filterArray = [[],[],[],[],[],[]];
var edcArray = [[],[]];

function dateFormat(fecha){
    var date = new Date(Date.parse(fecha));
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString();
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
            "deferRender": true,
            "orderClasses": false,
            "ordering":  false,
        })

    }else if (idioma==="en"){

        return $('#table-pa').dataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "scrollY": "350px",
            "dom": "frtiS",
            "scrollCollapse": true,
            "deferRender": true,
            "orderClasses": false,
            "ordering":  false,
        })
    };
};

if (idioma_tr==="es"){
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
$('#f-desde').pickadate({
  format: 'd/m/yyyy',
  formatSubmit:'d/m/yyyy',
  selectYears: true,
  selectMonths: true,
})

//Inicializar el DatePicker
$('#f-hasta').pickadate({
  format: 'd/m/yyyy',
  formatSubmit:'d/m/yyyy',
  selectYears: true,
  selectMonths: true,
})

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
    var ctaid = $('#Cuenta-sel').val();

    if (ctaid<=0){
      swal("Ups!", "Porfavor elija una cuenta primero.", "error");
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
            filterArray[0].push($('#monto-desde').val());
            filterArray[0].push($('#monto-hasta').val());
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
            filterArray[3].push(fd);
            filterArray[3].push(fh);
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

      //Llamar funcion de busqueda
      busqueda(ctaid,filterArray);
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
        swal("","Debe elegir una pareja primero","error");
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
            if (idioma_tr === 'es'){
                var title = 'Montos Incorrectos:';

                var msg = 'Créditos:\nTotal Créditos: '+ $.formatNumber(montocredito,{locale:idioma_tr});
                msg += '\n\nDébitos:\nTotal Débitos: '+$.formatNumber((-montodebito),{locale:idioma_tr});
                msg += '\n\nDiferencia: '+$.formatNumber(diferencia,{locale:idioma_tr});
            }else if (idioma_tr === 'en'){
                var title = 'Incorrect ammounts:';

                var msg = 'Credits:\nCredits Total: '+ $.formatNumber(montocredito,{locale:idioma_tr});
                msg += '\n\nDebits:\nDebits Total: '+$.formatNumber((-montodebito),{locale:idioma_tr});
                msg += '\n\nDifference: '+$.formatNumber(diferencia,{locale:idioma_tr});
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
$('#just-submit').on('click', function(){
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
            swal("Ups!", "Hubo un error buscando las partidas para la cuenta especificada.", "error");
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
            swal("Ups!", "Hubo un error matcheando las partidas para la cuenta especificada.", "error");
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
    var td9 = '<td class="monto" monto="'+elem.fields.monto+'">' + $.formatNumber(elem.fields.monto,{locale:idioma_tr}) + '</td>';
    if (tipo==='conta'){
        var td10 = '<td>L</td>';
    }else{
        var td10 = '<td>S</td>';
    }
    var td11 = '<td style="text-align:center; width: 24px;"><input class="chkSelection" type="checkbox" id="cb-'+tipo+'-'+a_id+'"></td>';

    $('#table-pa > tbody').append('<tr id ="tr-'+tipo+'-'+a_id+'"></tr>');

    var jRow = $("#tr-"+tipo+"-"+a_id).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10,td11);
    //tabla.row.add(jRow);
    tabla.fnAddData(jRow,false);
}