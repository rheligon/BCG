var csrftoken = $.cookie('csrftoken');
var filterArray = [[],[],[],[],[]];
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

//inicializamos el DatePicker para fecha desde
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

//inicializamos el DatePicker para fecha hasta
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

//inicializamos el DatePicker para fecha m desde
if (idioma == 0){
    $('#fm-desde').pickadate({
    format: 'dd/mm/yyyy',
    formatSubmit:'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
    });
} else {
    $('#fm-desde').pickadate({
    format: 'yyyy/mm/dd',
    formatSubmit:'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
    });
}

//inicializamos el DatePicker para fecha m hasta
if (idioma == 0){
    $('#fm-hasta').pickadate({
    format: 'dd/mm/yyyy',
    formatSubmit:'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
    });
} else {
    $('#fm-hasta').pickadate({
    format: 'yyyy/mm/dd',
    formatSubmit:'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
    });
}

//Boton de buscar matches para la cuenta elegida
$('#srchButton').on('click', function() {

  var cuentaId = $('#Cuenta-sel').val();

  if (cuentaId!=''){
    if (cuentaId!='-1'){
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
                var p = chequearFornatoNumero($('#monto-desde').val());
                var q = chequearFornatoNumero($('#monto-hasta').val());
                if (p && q ){
                    if (idioma == 0){
                        var desde = $('#monto-desde').val();
                        var m_aux = desde.replace(",", ".");
                        var hasta = $('#monto-hasta').val();
                        var m_aux2 = hasta.replace(",", ".");
                        if (parseFloat(m_aux2) > parseFloat(m_aux)){
                            filterArray[0].push(m_aux);
                            filterArray[0].push(m_aux2);
                            centinela = true;
                        } else {
                            $('#processing-modal').modal('toggle');
                            if (idioma == 0){
                                swal("Ups!", "Monto desde debe ser estrictamente menor que monto hasta.", "error");
                            } else {
                                swal("Ups!", '"Since" amount shloud be strict less than "Until" amount', "error");
                            }
                            centinela = false;
                        }
                    } else {
                        if (parseFloat($('#monto-hasta').val()) > parseFloat($('#monto-desde').val())){
                            filterArray[0].push($('#monto-desde').val());
                            filterArray[0].push($('#monto-hasta').val());
                            centinela = true;
                        } else {
                            $('#processing-modal').modal('toggle');
                            if (idioma == 0){
                                swal("Ups!", "Monto desde debe ser estrictamente menor que monto hasta.", "error");
                            } else {
                                swal("Ups!", '"Since" amount shloud be strict less than "Until" amount', "error");
                            }
                            centinela = false;
                        }
                    }
                } else {
                    $('#processing-modal').modal('toggle');
                    if (idioma == 0){
                        swal("Ups!", "Formato de montos erróneo", "error");
                    } else {
                        swal("Ups!", "Wrong amount format", "error");
                    }
                    centinela = false;
                }
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
                if ($('#fm-desde').val() != "" && $('#fm-hasta').val()){
                    var fd = "";
                    var fh = "";
                    var fd_aux = "";
                    var fh_aux = "";
                    if (idioma == 0){
                        fd = $('#fm-desde').val();
                        fh = $('#fm-hasta').val();
                        fd_aux = $('#fm-desde').val().split("/").reverse().join("/");
                        fh_aux = $('#fm-hasta').val().split("/").reverse().join("/");
                        filterArray[3].push(fd);
                        filterArray[3].push(fh);
                        
                    } else {
                        fd_aux = $('#fm-desde').val().split("/");
                        fh_aux = $('#fm-hasta').val().split("/");
                        fd = fd_aux.reverse().join("/");
                        fh = fh_aux.reverse().join("/");
                        fd_aux = fd_aux.reverse().join("/");
                        fh_aux = fh_aux.reverse().join("/");
                        filterArray[3].push(fd);
                        filterArray[3].push(fh);
                       
                    }
                    
                    var fd_date = new Date(fd_aux);
                    var fh_date = new Date(fh_aux);
                    if (fh_date < fd_date){
                        $('#processing-modal').modal('toggle');
                        if (idioma == 0){
                            swal("Ups!", "Fecha inicial de match no puede ser mayor que la final", "error");
                        } else {
                            swal("Ups!", "Match initial date can not be greater than final", "error");
                        }
                        centinela = false;
                    }
                } else {
                    $('#processing-modal').modal('toggle');
                    if (idioma == 0){
                        swal("Ups!", "Las fechas de match no pueden ser vacías", "error");
                    } else {
                        swal("Ups!", "Match dates can not be empty", "error");
                    }
                    centinela = false;
                }
            }

            if (idaux==='fecha'){
                if ($('#f-desde').val() != "" && $('#f-hasta').val()){
                    var fd = "";
                    var fh = "";
                    var fd_aux = "";
                    var fh_aux = "";
                    if (idioma == 0){
                        fd = $('#f-desde').val();
                        fh = $('#f-hasta').val();
                        fd_aux = $('#f-desde').val().split("/").reverse().join("/");
                        fh_aux = $('#f-hasta').val().split("/").reverse().join("/");
                        filterArray[4].push(fd);
                        filterArray[4].push(fh);
                        
                    } else {
                        fd_aux = $('#f-desde').val().split("/");
                        fh_aux = $('#f-hasta').val().split("/");
                        fd = fd_aux.reverse().join("/");
                        fh = fh_aux.reverse().join("/");
                        fd_aux = fd_aux.reverse().join("/");
                        fh_aux = fh_aux.reverse().join("/");
                        filterArray[4].push(fd);
                        filterArray[4].push(fh);
                       
                    }
                    
                    var fd_date = new Date(fd_aux);
                    var fh_date = new Date(fh_aux);
                    if (fh_date < fd_date){
                        $('#processing-modal').modal('toggle');
                        if (idioma == 0){
                            swal("Ups!", "Fecha inicial no puede ser mayor que la final", "error");
                        } else {
                            swal("Ups!", "Initial date can not be greater than final", "error");
                        }
                        centinela = false;
                    }
                } else {
                    $('#processing-modal').modal('toggle');
                    if (idioma == 0){
                        swal("Ups!", "Las fechas no pueden ser vacías", "error");
                    } else {
                        swal("Ups!", "Dates can not be empty", "error");
                    }
                    centinela = false;
                }    
            }
        });
    
        if (centinela) {
            var url = '/procd/mConfirmados/'+cuentaId+'\/';
            var serialFilter = JSON.stringify(filterArray);

            busqueda(url,'POST',{
                ctaid: cuentaId,
                filterArray: serialFilter,
                csrfmiddlewaretoken: csrftoken,
                action: 'buscar'
            });
        }
    } else {
        if (idioma == 0){
            swal("Ups!", "Debe seleccionar una cuenta", "error");
        } else {
            swal("Ups!", "Select an account please", "error");
        }
    }
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
        data: {'matchArray':matchArray, 'codcta':ctaid ,'action':'romper'},
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
            if (idioma == 0){
                swal("Ups!", "Hubo un error matcheando las partidas para la cuenta especificada.", "error");
            } else {
                swal("Ups!", "Error occurred in matching process.", "error");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};

// chequear formato de los numeros
function chequearFornatoNumero(elem){
    if (idioma == 1){
        return (/^(\d{1})+(\.\d{1,2})?$/.test(elem))
    } else {
        return (/^(\d{1})+(\,\d{1,2})?$/.test(elem))
    }
}

