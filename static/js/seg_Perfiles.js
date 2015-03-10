var tabla = iniciar_tabla(idioma_tr);
var csrftoken = $.cookie('csrftoken');

function EmptyNotNone(s){
    if (s==="None"){
        return ""
    }else{
        return s
    }
}

function iniciar_tabla(idioma){
    if (idioma==="es"){

        return $('#table-perfiles').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            }
        })

    }else if (idioma==="en"){

        return $('#table-perfiles').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            }
        })
    };
};

//Mostrar botones aceptar y cancelar
$('#addButton').on('click', function () {
    $('#acptButton').parent().toggle('hidden');
    $('#cancelButton').parent().toggle('hidden');
});

//Ocultar botones aceptar y cancelar
$('#cancelButton').on('click', function () {
    $('#acptButton').parent().toggle('hidden');
    $(this).parent().toggle('hidden');
});


//Elegir las opciones del dual list (que se ponga azul)
$('body').on('click', '.list-group[type=campos] .list-group-item', function () {
    $checkBox = $('.dual-list .selector');

    if ($(this).hasClass('active')){
        if ($checkBox.hasClass('selected')) {
            $checkBox.removeClass('selected');
            $checkBox.children('i').removeClass('glyphicon-check').addClass('glyphicon-unchecked');
        }
    }

    $(this).toggleClass('active');
});

//Flechas Pagina normal
$('.list-arrows button').click(function () {
    event.preventDefault();
    var $button = $(this), actives = '';
    //Izquierda
    if ($button.hasClass('move-left')) {
        actives = $('.list-right ul li.active');
        actives.clone().appendTo('.list-left ul');
        actives.remove();
    //Derecha
    } else if ($button.hasClass('move-right')) {
        actives = $('.list-left ul li.active');
        actives.clone().appendTo('.list-right ul');
        actives.remove();
    }
});

//Seleccionar todos o ninguno
$('.dual-list .selector').click(function () {
    var $checkBox = $(this);
    if (!$checkBox.hasClass('selected')) {
        $checkBox.addClass('selected').closest('.well').find('ul li:not(.active)').addClass('active');
        $checkBox.children('i').removeClass('glyphicon-unchecked').addClass('glyphicon-check');
    } else {
        $checkBox.removeClass('selected').closest('.well').find('ul li.active').removeClass('active');
        $checkBox.children('i').removeClass('glyphicon-check').addClass('glyphicon-unchecked');
    }
});

//Filtrar
$('[name="SearchDualList"]').keyup(function (e) {
    var code = e.keyCode || e.which;
    if (code == '9') return;
    if (code == '27') $(this).val(null);
    var $rows = $(this).closest('.dual-list').find('.list-group li');
    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
    $rows.show().filter(function () {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
    }).hide();
});