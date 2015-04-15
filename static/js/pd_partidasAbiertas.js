var csrftoken = $.cookie('csrftoken');
var tabla = iniciar_tabla(idioma_tr);
var faltaconta = false;
var faltacorr = false;
var matchArray = [];

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
    }
}

function iniciar_tabla(idioma){

    if (idioma==="es"){

        return $('#table-pa').DataTable({
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

        return $('#table-pa').DataTable({
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
$('#f-match').pickadate({
  format: 'd/m/yyyy',
  formatSubmit:'d/m/yyyy',
  selectYears: true,
  selectMonths: true,
  max: new Date()
})

//Llamar a matcher con la cuenta elegida
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
      tabla.clear().draw();
      faltaconta = false;
      faltacorr = false;
      matchArray =[];

      //Llamar funcion de busqueda
      busqueda(ctaid);
    }
});

$('#table-pa').on('click','input[type=checkbox]', function(event) {
    console.log($(this));

   if($(this).is(':checked')){
        matchArray.push($(this).closest('tr').attr('id'));
   }else{
        var index = matchArray.indexOf($(this).closest('tr').attr('id'));
        if (index >= 0) {
          matchArray.splice( index, 1 );
        }
   }
});

//Buscar logs de acuerdo a la seleccion
function busqueda(ctaid){
    $.ajax({
        type:"POST",
        url: "/procd/pAbiertas/",
        data: {"ctaid": ctaid, 'action':'buscar'},
        success: function(data){
            var json_conta = jQuery.parseJSON(data.r_conta);
            var json_corr = jQuery.parseJSON(data.r_corr);

            $('#pbardiv').prop('hidden', false);
            $('#pbar').attr('max', json_corr.length+json_conta.length);

            // Initalize and start iterating
            var contaIter = new heavyLifter(json_conta,'conta');
            contaIter.startCalculation();

            // Initalize and start iterating
            var corrIter = new heavyLifter(json_corr,'corr');
            corrIter.startCalculation();

            //var edc_conta = jQuery.parseJSON(data.edcj_conta);
            //var edc_corr = jQuery.parseJSON(data.edcj_corr);

            // for (var i = 0; i < json_conta.length; i++) {
            //     var a_id = json_conta[i].pk;
            //     var a_cod = json_conta[i].fields.codigo;

            //     var td1 = '<td>' + json_conta[i].fields.campo86_940 + '</td>';
            //     var td2 = '<td>' + json_conta[i].fields.pagina + '</td>';
            //     var td3 = '<td>' + dateFormat(json_conta[i].fields.fecha_valor) + '</td>';
            //     var td4 = '<td>' + json_conta[i].fields.codigo_transaccion + '</td>';
            //     var td5 = '<td>' + vacio(json_conta[i].fields.referencianostro) + '</td>';
            //     var td6 = '<td>' + vacio(json_conta[i].fields.referenciacorresponsal) + '</td>';
            //     var td7 = '<td>' + vacio(json_conta[i].fields.descripcion) + '</td>';
            //     var td8 = '<td>' + json_conta[i].fields.credito_debito + '</td>';
            //     var td9 = '<td>' + json_conta[i].fields.monto + '</td>';
            //     var td10 = '<td>L</td>';
            //     var td11 = '<td>S</td>';

            //     $('#table-pa > tbody').append('<tr id ="trconta-'+a_id+'"></tr>');

            //     var jRow = $("#trconta-"+a_id).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10,td11);
            //     tabla.row.add(jRow);
            //     prog++;
            //     $('#proctxt').text(Math.round(max/prog)*100);
            // };


            // for (var i = 0; i < json_corr.length; i++) {
            //     console.log(i);
            //     var a_id = json_corr[i].pk;
            //     var a_cod = json_corr[i].fields.codigo;

            //     var td1 = '<td>' + json_corr[i].fields.campo86_940 + '</td>';
            //     var td2 = '<td>' + json_corr[i].fields.pagina + '</td>';
            //     var td3 = '<td>' + dateFormat(json_corr[i].fields.fecha_valor) + '</td>';
            //     var td4 = '<td>' + json_corr[i].fields.codigo_transaccion + '</td>';
            //     var td5 = '<td>' + vacio(json_corr[i].fields.referencianostro) + '</td>';
            //     var td6 = '<td>' + vacio(json_corr[i].fields.referenciacorresponsal) + '</td>';
            //     var td7 = '<td>' + vacio(json_corr[i].fields.descripcion) + '</td>';
            //     var td8 = '<td>' + json_corr[i].fields.credito_debito + '</td>';
            //     var td9 = '<td>' + json_corr[i].fields.monto + '</td>';
            //     var td10 = '<td>S</td>';
            //     var td11 = '<td>S</td>';

            //     $('#table-pa > tbody').append('<tr id ="trcorr-'+a_id+'"></tr>');

            //     var jRow = $("#trcorr-"+a_id).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10,td11);
            //     tabla.row.add(jRow);
            //     prog++;
            //     $('#proctxt').text(Math.round(max/prog)*100);
            // };

            //tabla.draw();
            $('#processing-modal').modal('toggle');
        },
        error: function(q,error){
            alert(q.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error buscando las cuentas para la fecha especificada.", "error");
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
                tabla.draw();
                break;
            }
            // Add to counter
            this.currentPosition++;
            current++;
            
            calcularfila(this.array[i],this.tipo );
        }

        //Barra de progreso
        var max = $('#pbar').attr('max');
        var prog = Math.round(current/max*100);
        var width = prog+'%';

        $('#pbartxt').text(width);
        $('#pbar').css('width', width);
        $('#pbar').attr('current', current);
        
        if( n === 0 ){
            tabla.draw();
        }

    }
}

function calcularfila(elem,tipo){
    var a_id = elem.pk;
    var a_cod = elem.fields.codigo;

    var td1 = '<td>' + elem.fields.estado_cuenta_idedocuenta[1] + '</td>';
    var td2 = '<td>' + elem.fields.pagina + '</td>';
    var td3 = '<td>' + dateFormat(elem.fields.fecha_valor) + '</td>';
    var td4 = '<td>' + elem.fields.codigo_transaccion + '</td>';
    var td5 = '<td>' + vacio(elem.fields.referencianostro) + '</td>';
    var td6 = '<td>' + vacio(elem.fields.referenciacorresponsal) + '</td>';
    var td7 = '<td>' + vacio(elem.fields.descripcion) + '</td>';
    var td8 = '<td>' + elem.fields.credito_debito + '</td>';
    var td9 = '<td>' + $.formatNumber(elem.fields.monto,{locale:idioma_tr}) + '</td>';
    var td10 = '<td>S</td>';
    var td11 = '<td style="text-align:center; width: 24px;"><input class="chkSelection" type="checkbox" id="cb-'+tipo+'-'+a_id+'"></td>';

    $('#table-pa > tbody').append('<tr id ="tr-'+tipo+'-'+a_id+'"></tr>');

    var jRow = $("#tr-"+tipo+"-"+a_id).append(td1,td2,td3,td4,td5,td6,td7,td8,td9,td10,td11);
    tabla.row.add(jRow);
}