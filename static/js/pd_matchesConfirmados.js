var csrftoken = $.cookie('csrftoken');
var tabla = iniciar_tabla(idioma_tr);
var filterArray = [[],[],[],[],[]];

$(document).ready(function() {
    //Al cargar la pagina se coloca en el select el valor de la cuenta elegida
    $('#Cuenta-sel').val($('#id-cuenta').val());

    //Se coloca un timeout para la alerta si existe        
    setTimeout(
        function(){ 
            $('#msgAlert').prop('hidden', true);
        },
        6000
    );
});


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

//Inicializar el DatePicker
$('#fm-desde').pickadate({
  format: 'd/m/yyyy',
  formatSubmit:'d/m/yyyy',
  selectYears: true,
  selectMonths: true,
})

//Inicializar el DatePicker
$('#fm-hasta').pickadate({
  format: 'd/m/yyyy',
  formatSubmit:'d/m/yyyy',
  selectYears: true,
  selectMonths: true,
})

//Boton de buscar matches para la cuenta elegida
$('#srchButton').on('click', function() {

  var cuentaId = $('#Cuenta-sel').val();

  if (cuentaId!=''){

    $('#processing-modal').modal('toggle');

      //Inicializar todo de nuevo
      tabla.fnClearTable();
      filterArray = [[],[],[],[],[]];

        $('#checkAllButton').attr('selec',0);

    //Checkear los filtros
    $('.cbfilter:checked').each(function(){

        var idaux = $(this).attr('id').split('-')[0];
        var id = '#filter-'+idaux;

        if (idaux==='monto'){
            filterArray[0].push($('#monto-desde').val());
            filterArray[0].push($('#monto-hasta').val());
        }

        if (idaux==='match'){
            var match = $('#match-id').val();
            filterArray[1].push(match);
        }

        if (idaux==='ref'){
            var rad = $(id+' input[type=radio]:checked').val();
            if (rad != undefined ){
                filterArray[2].push(rad);
                filterArray[2].push($('#ref-txt').val());
            }
        }

        if (idaux==='fecham'){
            var fd = $('#fm-desde').val();
            var fh = $('#fm-hasta').val();
            filterArray[3].push(fd);
            filterArray[3].push(fh);
        }

        if (idaux==='fecha'){
            var fd = $('#f-desde').val();
            var fh = $('#f-hasta').val();
            filterArray[4].push(fd);
            filterArray[4].push(fh);
        }   
    });

    var url = '/procd/mConfirmados/'+cuentaId+'\/';
    var serialFilter = JSON.stringify(filterArray);

    busqueda(url,'POST',{
        ctaid: cuentaId,
        filterArray: serialFilter,
        csrfmiddlewaretoken: csrftoken,
        action: 'buscar'
    });

  }else{

    tabla.fnClearTable();
  
  }
});

//Buscar matches de acuerdo a la seleccion
//Esta funcion crea un form para poder hacer post de la cuenta y el arreglo de filtros
function busqueda(action, method, input) {
    'use strict';
    var form;
    form = $('<form />', {
        action: action,
        method: method,
        style: 'display: none;'
    });
    if (typeof input !== 'undefined' && input !== null) {
        $.each(input, function (name, value) {
            $('<input />', {
                type: 'hidden',
                name: name,
                value: value
            }).appendTo(form);
        });
    }
    form.appendTo('body').submit();
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

        if (idaux==='match'){
            $('#match-id').val('');
        }

        if (idaux==='ref'){
            $(id+' input[type=radio]:checked').prop('checked', false);
            $('#ref-txt').val('');
        }

        if (idaux==='fecham'){
            $('#fm-desde').val('');
            $('#fm-hasta').val('');
        }

        if (idaux==='fecha'){
            $('#f-desde').val('');
            $('#f-hasta').val('');
        }
    });

    filterArray = [[],[],[],[],[]];
    $('#filter-div').hide();
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

//Chequear todos los cb
$('#checkAllButton').on('click', function () {
    var selec = parseInt($(this).attr('selec'));
    var rows   = tabla.fnGetNodes();

    if (selec === 0){
        $('#checkAllButton').attr('selec',1);

        // Añadir checks a los checkboxes
        for ( var i = 0, len = rows.length; i < len; i++) {
            var $fields = $(rows[i]).find('input[type="checkbox"]');
             
            $fields.each(function (idx, el) {
                    $(el).prop('checked',true);
            });
        }

    }else{
        $('#checkAllButton').attr('selec',0);

        // Quitar checks de los checkboxes
        for ( var i = 0, len = rows.length; i < len; i++) {
            var $fields = $(rows[i]).find('input[type="checkbox"]:checked');
             
            $fields.each(function (idx, el) {
                    $(el).prop('checked',false);
            });
        }
    }
});

//Funcion para añadir los checkboxes que no estan visibles
$('#romperButton').on('click', function() {
    var rows = tabla.fnGetNodes(), inputs = [];
     
    // Añade al POST los checkboxes que no estan visibles
    for ( var i = 0, len = rows.length; i < len; i++) {
        var $fields = $(rows[i]).find('input[type="checkbox"]');
         
        $fields.each(function (idx, el) {
            if (!$(this).is(':checked')){
                inputs.push($(this).val());
            }
        });
    }

    var ctaid = $('#id-cuenta').val();
    $('#processing-modal').modal('toggle');

    //Tengo en inputs los codigomatches
    romper_match(inputs,ctaid);
});

//Hacer match de acuerdo a la seleccion
function romper_match(matchArray,ctaid){
    $.ajax({
        type:"POST",
        url: "/procd/mConfirmados/"+ctaid+"\/",
        data: {'matchArray':matchArray, 'action':'romper'},
        success: function(data){
            $('#processing-modal').modal('toggle');
            console.log(matchArray);
            
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

