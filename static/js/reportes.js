var csrftoken = $.cookie('csrftoken');
var idioma = $('#idioma').val();
var idiomaAux = "";
var msj ="";
var centinela = true;

if (idioma == 0){
    idiomaAux = "es"
} else {
    idiomaAux = "en"
}
var prevrep;
var prevrad;


//Funcion para crear el arbol
$.fn.extend({
    treed: function (o) {
      
      var openedClass = 'glyphicon-minus-sign';
      var closedClass = 'glyphicon-plus-sign';
      
      if (typeof o != 'undefined'){
        if (typeof o.openedClass != 'undefined'){
        openedClass = o.openedClass;
        }
        if (typeof o.closedClass != 'undefined'){
        closedClass = o.closedClass;
        }
      };
      
        //initialize each of the top levels
        var tree = $(this);
        tree.addClass("tree");
        tree.find('li').has("ul").each(function () {
            var branch = $(this); //li with children ul
            branch.prepend("<i class='indicator glyphicon " + closedClass + "'></i>");
            branch.addClass('branch');
            branch.on('click', function (e) {
                if (this == e.target) {
                    var icon = $(this).children('i:first');
                    icon.toggleClass(openedClass + " " + closedClass);
                    $(this).children().children().toggle();
                }
            })
            branch.children().children().toggle();
        });
        //fire event from the dynamically added icon
      tree.find('.branch .indicator').each(function(){
        $(this).on('click', function () {
            $(this).closest('li').click();
        });
      });
        //fire event to open branch if the li contains an anchor instead of text
        tree.find('.branch>a').each(function () {
            $(this).on('click', function (e) {
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
        //fire event to open branch if the li contains a button instead of text
        tree.find('.branch>button').each(function () {
            $(this).on('click', function (e) {
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
    }
});

//Initializacion del arbol
$('#treerep').treed({openedClass:'glyphicon-folder-open', closedClass:'glyphicon-folder-close'});


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

//Inicializar el DatePicker proc diario conciliacion
if (idioma == 0){
  $('#pd_conc_fecha').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else {
  $('#pd_conc_fecha').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}

//Inicializar el DatePicker partidas abiertas
if (idioma == 0){
  $('#pd_partab_f-desde').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else {
  $('#pd_partab_f-desde').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}

if (idioma == 0){
  $('#pd_partab_f-hasta').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else {
  $('#pd_partab_f-hasta').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}

//Inicializar el DatePicker matches conf
if (idioma == 0){
  $('#pd_mconf_f-desde').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#pd_mconf_f-desde').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}
if (idioma == 0){
  $('#pd_mconf_f-hasta').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#pd_mconf_f-hasta').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}

//Inicializar el DatePicker historico
if (idioma == 0){
  $('#pd_hist_fecha').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#pd_hist_fecha').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}

//Inicializar el DatePicker Posicion Moneda
if (idioma == 0){
  $('#pd_posmon_fecha').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#pd_posmon_fecha').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}

//Inicializar el DatePicker edocta
if (idioma == 0){
  $('#pd_edcs_f-desde').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#pd_edcs_f-desde').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}
if (idioma == 0){
  $('#pd_edcs_f-hasta').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#pd_edcs_f-hasta').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}

//Inicializar el DatePicker logs
if (idioma == 0){
  $('#seg_log_f-desde').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#seg_log_f-desde').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}

if (idioma == 0){
  $('#seg_log_f-hasta').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#seg_log_f-hasta').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}

// Spinner de la hora
$('#seg_log_h-desde').timepicker({
    minuteStep: 5,
    showInputs: false,
    disableFocus: true
});

// Spinner de la hora
$('#seg_log_h-hasta').timepicker({
    minuteStep: 5,
    showInputs: false,
    disableFocus: true
});

// cambiar unos iconos para que aparezcan en el timepicker
$('.icon-chevron-up').addClass('fa fa-chevron-up');
$('.icon-chevron-down').addClass('fa fa-chevron-down');


//Inicializar el DatePicker ctas sobregiradas
if (idioma == 0){
  $('#avz_ctas_fecha').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#avz_ctas_fecha').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}

//Inicializar el DatePicker saldos por conciliacion
if (idioma == 0){
  $('#avz_sconc_fecha').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#avz_sconc_fecha').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}

//Inicializar el DatePicker observaciones
if (idioma == 0){
  $('#avz_obs_fecha').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#avz_obs_fecha').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}

//Inicializar el DatePicker estadistica partidas abiertas
if (idioma == 0){
  $('#est_pa_f-desde').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#est_pa_f-desde').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}
if (idioma == 0){
  $('#est_pa_f-hasta').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#est_pa_f-hasta').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}

//Inicializar el DatePicker partidas abiertas avanzadas
if (idioma == 0){
  $('#avz_paavz_f-desde').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#avz_paavz_f-desde').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}
if (idioma == 0){
  $('#avz_paavz_f-hasta').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#avz_paavz_f-hasta').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}

if (idioma == 0){
  $('#est_pcon_f-desde').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#est_pcon_f-desde').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}
if (idioma == 0){
  $('#est_pcon_f-hasta').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#est_pcon_f-hasta').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}

if (idioma == 0){
  $('#est_pcar_f-desde').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#est_pcar_f-desde').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}
if (idioma == 0){
  $('#est_pcar_f-hasta').pickadate({
    format: 'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
} else{
  $('#est_pcar_f-hasta').pickadate({
    format: 'yyyy/mm/dd',
    selectYears: true,
    selectMonths: true,
    max: true,
  });
}




//Click en el reporte muestra los campos y oculta los otros
$('li[type="reporte"]').on('click',function(){
    var id = $(this).attr('id');

    if (prevrep!= undefined){
        $('#'+prevrep+'form').hide();
        $('#'+prevrep+'_radios').hide();
        $('#'+prevrep+'_campos').hide();
    }

    $('#formswell').show();
    $('#'+id+'form').show();

    $('#'+id+'_radios').show();
    $('#'+id+'_campos').show();

    $('#legend').html($(this).html());

    prevrep = id;
});

//Mostrar subcampos partidas abiertas
$('.pdpafilter').on('click',function(){
    var id = $(this).attr('id');
    var aux = id.split('-')[1];

    if (prevrad!= undefined){
        $('#pd_partab_campos_'+prevrad).hide();
    }

    prevrad = aux;

    $('#pd_partab_campos').show();
    $('#pd_partab_campos_'+aux).show();

});

//Mostrar subcampos matches confirmados
$('.pdmcfilter').on('click',function(){
    var id = $(this).attr('id');
    var aux = id.split('-')[1];

    if (prevrad!= undefined){
        $('#pd_mconf_campos_'+prevrad).hide();
    }

    prevrad = aux;

    $('#pd_mconf_campos').show();
    $('#pd_mconf_campos_'+aux).show();

});

//Mostrar subcampos partidas abiertas avanzadas
$('.avzpafilter').on('click',function(){
    var id = $(this).attr('id');
    var aux = id.split('-')[1];

    if (prevrad!= undefined){
        $('#avz_paavz_campos_'+prevrad).hide();
    }

    prevrad = aux;

    $('#avz_paavz_campos').show();
    $('#avz_paavz_campos_'+aux).show();

});

//Mostrar o esconder campo de codCP en conciliacion ya que es para cuentas propias
$('#pd_conc_tipocta').on('change', function(){
  if ($(this).val() === '2'){
    $('#codcpdiv').show();
  }else{
    $('#codcpdiv').hide();
  }
})

//Mostrar o esconder campo de codCP en paavanzadas ya que es para cuentas propias
$('#avz_paavz_tipocta').on('change', function(){
  if ($(this).val() === '2'){
    $('#codcpavzdiv').show();
  }else{
    $('#codcpavzdiv').hide();
  }
})

//Habilitar o desabilitar Datepicker Desde en Est partidas abiertas
$('#est_pa_fuente').on('change', function(){
    $('#est_pa_f-desde').prop('disabled',!$('#est_pa_f-desde').is(':disabled'));
})

//Al hacer click en ejecutar pdf
$('.pdf').on('click', function(){
  $('#tipoArch').val('pdf');
});

//Al hacer click en ejecutar excel
$('.xls').on('click', function(){
  $('#tipoArch').val('xls');
});

//Al hacer click en autorizar conciliacion
$('.autcon').on('click', function(e){
  e.preventDefault();
  $('#tipoArch').val('autcon');

  ufc = $('select option:selected').attr('ufc');
  ufh = $('select option:selected').attr('ufh');

  if (ufc === ufh){
    if (idioma == 0){
      swal("Ups!","La fecha del último histórico y de la ultima conciliacion son iguales.","error");
    } else {
      swal("Ups!","Last historic date and last reconciliation date are equals.","error");  
    }
  }else{
      if (idioma == 0){
        msj ="Seguro que desea autorizar la conciliacion al "+ ufc +" ?";
      } else {
        msj ="Sure you want authorize reconciliation at "+ ufc +" ?";
      }
      swal({   title: "",
               text: msj,
               type: "warning",
               showCancelButton: true,
               confirmButtonText: "Ok"},
               function(){
                    $('#pd_concform').submit();
                  }
          );
  }
});



//Funcion para añadir al POST el tipo de archivo
$('form').bind('submit', function(e) {

    if ($('#tipoArch').val() === 'autcon'){
      $(this).removeAttr("target");
    }
    
    $(this).append('<input type="hidden" name="tipoArch" value="' + $('#tipoArch').val() +'">');
});