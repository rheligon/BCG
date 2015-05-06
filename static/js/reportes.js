var csrftoken = $.cookie('csrftoken');
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

//Initialization of treeviews
$('#treerep').treed({openedClass:'glyphicon-folder-open', closedClass:'glyphicon-folder-close'});


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
$('#pd_conc_fecha').pickadate({
  format: 'dd/mm/yyyy',
  selectYears: true,
  selectMonths: true,
})

//Inicializar el DatePicker partidas abiertas
$('#pd_partab_f-desde').pickadate({
  format: 'dd/mm/yyyy',
  selectYears: true,
  selectMonths: true,
})

//Inicializar el DatePicker partidas abiertas
$('#pd_partab_f-hasta').pickadate({
  format: 'dd/mm/yyyy',
  selectYears: true,
  selectMonths: true,
})

//Inicializar el DatePicker matches conf
$('#pd_mconf_f-desde').pickadate({
  format: 'dd/mm/yyyy',
  selectYears: true,
  selectMonths: true,
})

//Inicializar el DatePicker matches conf
$('#pd_mconf_f-hasta').pickadate({
  format: 'dd/mm/yyyy',
  selectYears: true,
  selectMonths: true,
})

//Inicializar el DatePicker historico
$('#pd_hist_fecha').pickadate({
  format: 'dd/mm/yyyy',
  selectYears: true,
  selectMonths: true,
})

//Inicializar el DatePicker Posicion Moneda
$('#pd_posmon_fecha').pickadate({
  format: 'dd/mm/yyyy',
  selectYears: true,
  selectMonths: true,
})

//Inicializar el DatePicker edocta
$('#pd_edcs_f-desde').pickadate({
  format: 'dd/mm/yyyy',
  selectYears: true,
  selectMonths: true,
})

//Inicializar el DatePicker edocta
$('#pd_edcs_f-hasta').pickadate({
  format: 'dd/mm/yyyy',
  selectYears: true,
  selectMonths: true,
})

//Inicializar el DatePicker ctas sobregiradas
$('#avz_ctas_fecha').pickadate({
  format: 'dd/mm/yyyy',
  selectYears: true,
  selectMonths: true,
})
//Inicializar el DatePicker saldos por conciliacion
$('#avz_sconc_fecha').pickadate({
  format: 'dd/mm/yyyy',
  selectYears: true,
  selectMonths: true,
})
//Inicializar el DatePicker observaciones
$('#avz_obs_fecha').pickadate({
  format: 'dd/mm/yyyy',
  selectYears: true,
  selectMonths: true,
})


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