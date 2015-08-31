var csrftoken = $.cookie('csrftoken');	
var idioma = $('#idioma').val();
var msj ="";

//Resetear campos del formulario cuando se esconde
$('.modal:not(.modal-static)').on('hidden.bs.modal', function(){
    
    $('.list-right-modal ul li, .list-left-modal ul li').remove();
    $(this).find('form')[0].reset();
    for (var i = 0; i<campos_disp.length; i++){
        $('.list-left-modal ul').append('<li class="list-group-item">'+ campos_disp[i] +'</li>');
    }
    $checkBox = $('.smodal');
    if ($checkBox.hasClass('selected')) {
        $checkBox.removeClass('selected');
        $checkBox.children('i').removeClass('glyphicon-check').addClass('glyphicon-unchecked');
    }
});

$(function () {

    //Elegir el archivo
    $('body').on('click', '.list-group[type=archivo] .list-group-item', function () {
        //Que solo uno este seleccionado
        $('.list-group[type=archivo] > .list-group-item ').each(function(){
            if ($(this).hasClass('active')){
                $(this).toggleClass('active');
            }
        });
        $(this).toggleClass('active');

        //Buscando los campos elegidos para el formato
        var campos_elegidos = [];
        var campos_el_index = [];
        var formato = $(this).attr('formato');

        for(var x = 0, c=''; c = formato.charAt(x); x++){ 
            if (c<10){
                campos_elegidos.push(campos_disp[c]);
                campos_el_index.push(parseInt(c));
            }else if (c==="A"){
                campos_elegidos.push(campos_disp[10]);
                campos_el_index.push(10);
            }else if (c==="B"){
                campos_elegidos.push(campos_disp[11]);
                campos_el_index.push(11);
            }
        }


        //Llenando los detalles
        var tipo = $(this).attr('tipo');

        $('#cuentaform').val($(this).attr('cuentanom'));
        $('#nomform').val($(this).attr('nombre'));
        $('#carsep').val($(this).attr('separador'));
        $('#'+tipo).prop('checked','checked');

        //Llenando las listas segun el formato guardado
        var $left =  $('.list-left ul');
        var $right =  $('.list-right ul');
        $left.html('');
        $right.html('');

        for (var i=0; i<campos_disp.length;i++){
            var sel = $.inArray(i,campos_el_index);
            if (sel<0){
                $left.append('<li class="list-group-item" pos="'+i+'" id="camp-'+i+ '">'+ campos_disp[i] +'</li>');
            };
        };

        for (var i=0; i<campos_el_index.length;i++){
            $right.append('<li class="list-group-item" pos="'+campos_el_index[i]+'" id="camp-'+campos_el_index[i]+ '">'+ campos_disp[campos_el_index[i]] +'</li>');
        };
    });            



    //Elegir los campos
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
        //Arriba
        } else if($button.hasClass('reorder-up')){
            $('.list-right ul li.active').each(function(){
              var $previous = $(this).prev('li:not(.active)');
                if($previous.length !== 0 ){
                    $(this).insertBefore($previous);
                }
            });
        //Abajo
        } else if ($button.hasClass('reorder-down')){
            $('.list-right ul li.active').each(function(){
              var $next = $(this).next('li:not(.active)');
              if($next.length !== 0){
                $(this).insertAfter($next);
              }
            });
        }
    });

    //Flechas MODAL
    $('.list-arrows-modal button').click(function () {
        var $button = $(this), actives = '';

        //Izquierda
        if ($button.hasClass('move-left-modal')) {
            actives = $('.list-right-modal ul li.active');
            actives.clone().appendTo('.list-left-modal ul');
            actives.remove();
        //Derecha
        } else if ($button.hasClass('move-right-modal')) {
            actives = $('.list-left-modal ul li.active');
            actives.clone().appendTo('.list-right-modal ul');
            actives.remove();
        //Arriba
        } else if ($button.hasClass('reorder-up-modal')){
            $('.list-right-modal ul li.active').each(function(){
                var $previous = $(this).prev('li:not(.active)');
                if($previous.length !== 0 ){
                    $(this).insertBefore($previous);
                }
            });
        //Abajo
        } else if ($button.hasClass('reorder-down-modal')){
            $('.list-right-modal ul li.active').each(function(){
              var $next = $(this).next('li:not(.active)');
              if($next.length !== 0){
                $(this).insertAfter($next);
              }
            });
        }
    });

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
});


//Agregar Formato
$('#addfa-submit').on('click', function (event) {
    event.preventDefault();
    var $btn;
   
    function add_formarc(formCuenta, formNom, formCarsep, formTipo, formCampSel){
        $.ajax({
            type:"POST",
            url: "/conf/arc/",
            data: {"formcuenta":formCuenta ,"formnom":formNom, "formcarsep":formCarsep, "formtipo": formTipo, "formcampsel": formCampSel, "action": "add"},
            success: function(data){
                if (data.add){

                    //Que solo uno este seleccionado
                    $('ul[type=archivo] > li.active ').each(function(){
                        if ($(this).hasClass('active')){
                            $(this).toggleClass('active');
                        }
                    });

                    $('ul[type="archivo"]').append('<li class="list-group-item active" id="'+data.formid+'" tipo="'+data.formtipo+'" separador="'+data.formcarsep+'" nombre="'+data.formnom+'" cuenta="'+ data.formcuentaid +'" formato="'+data.formcampsel +'" cuentanom="'+ data.formcuentanom +'">'+data.formnom+'</li>');

                    //Buscando los campos elegidos para el formato
                    var campos_elegidos = [];
                    var campos_el_index = [];
                    var formato = data.formcampsel;

                    for(var x = 0, c=''; c = formato.charAt(x); x++){ 
                        if (c<10){
                            campos_elegidos.push(campos_disp[c]);
                            campos_el_index.push(parseInt(c));
                        }else if (c==="A"){
                            campos_elegidos.push(campos_disp[10]);
                            campos_el_index.push(10);
                        }else if (c==="B"){
                            campos_elegidos.push(campos_disp[11]);
                            campos_el_index.push(11);
                        }
                    };

                    //Llenando los detalles
                    var tipo = data.formtipo;

                    $('#cuentaform').val(data.formcuentanom);
                    $('#nomform').val(data.formnom);
                    $('#carsep').val(data.formcarsep);
                    $('#'+tipo).prop('checked','checked');

                    //Llenando las listas segun el formato guardado
                    var $left =  $('.list-left ul');
                    var $right =  $('.list-right ul');
                    $left.html('');
                    $right.html('');

                    for (var i=0; i<campos_disp.length;i++){
                        var sel = $.inArray(i,campos_el_index);
                        if (sel<0){
                            $left.append('<li class="list-group-item" pos="'+i+'" id="camp-'+i+ '">'+ campos_disp[i] +'</li>');
                        };
                    };

                    for (var i=0; i<campos_el_index.length;i++){
                        $right.append('<li class="list-group-item" pos="'+campos_el_index[i]+'" id="camp-'+campos_el_index[i]+ '">'+ campos_disp[campos_el_index[i]] +'</li>');
                    };

                    swal({   title: "",
                             text: data.msg,
                             type: "success",
                             confirmButtonText: "Ok" });
                }else{
                    swal({   title: "Ups!",
                             text: data.msg,
                             type: "error",
                             confirmButtonText: "Ok" });
                }
                $('#processing-modal').modal('toggle');
                $btn.button('reset');
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    var formCuenta = $('#cuentasformmodal').val();
    var formNom = $('#nomformmodal').val();
    var formCarsep = $('#carsepmodal').val();
    var formTipo = $('input.radio-modal:checked').val();
    var formCampSel = "";

    $('.list-right-modal ul li').each(function(){
        $prop = $(this).attr('pos');
        if ($prop<10){
            formCampSel+= $prop.toString();
        }else{
            if ($prop === "10"){
                formCampSel+= "A";
            }else if ($prop === "11"){
                formCampSel+= "B";
            }
        }
    });
    
    $btn = $(this).button('loading');
    $('#add-formato-modal').modal('toggle');
    $('#processing-modal').modal('toggle');
    add_formarc(formCuenta, formNom, formCarsep, formTipo, formCampSel);
})


//Eliminar formato
$('#delButton').on('click', function () {
    var $btn;
   
    function del_formarch(formId){
        $.ajax({
            type:"POST",
            url: "/conf/arc/",
            data: {"formid": formId, "action": "del"},
            success: function(data){

                if (data.elim){
                    $formato = $('ul[type="archivo"] > li.active');
                    $formato.remove();

                    swal({   title: "",
                             text: data.msg,
                             type: "success",
                             confirmButtonText: "Ok" });

                    //Reiniciando las listas
                    $left =  $('.list-left ul');
                    $right =  $('.list-right ul');
                    $left.html('');
                    $right.html('');

                    for (var i=0; i<campos_disp.length;i++){
                        $left.append('<li class="list-group-item" pos="'+i+'" id="camp-'+i+ '">'+ campos_disp[i] +'</li>');
                    };

                    $('#form-detalle-formato')[0].reset();

                }else{
                    swal({   title: "",
                             text: data.msg,
                             type: "error",
                             confirmButtonText: "Ok" });
                }
                
                $('#processing-modal').modal('toggle');
                $btn.button('reset')
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    var form_elim = $('ul[type="archivo"] > li.active');

    if (form_elim.length > 0){
        if (idioma == 0){
            msj = "Seguro que desea eliminar el formato "+ form_elim.attr("nombre") +" ?";
        } else {
            msj = "Sure you want delete format "+ form_elim.attr("nombre") +" ?";
        }
        swal({   title: "",
             text: msj,
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"},
             function(){
                $btn = $(this).button('loading')
                $('#processing-modal').modal('toggle');
                del_formarch(form_elim.attr("id"));
             }
             );
    }else{
        swal("","Por favor seleccionar un formato primero","error");
    }
})

//Modificar formato
$('#updButton').on('click', function () {
    var $btn;
   
    function upd_formarc(formId, formNom, formCarsep, formTipo, formCampSel){
        $.ajax({
            type:"POST",
            url: "/conf/arc/",
            data: {"formid": formId, "formnom":formNom, "formcarsep":formCarsep, "formtipo": formTipo, "formcampsel": formCampSel, "action": "upd"},
            success: function(data){
                if (data.modif){
                    $formato_old = $('ul[type="archivo"] > li.active');
                    $formato_old.remove();

                    $('ul[type="archivo"]').append('<li class="list-group-item" id="'+data.formid+'" tipo="'+data.formtipo+'" separador="'+data.formcarsep+'" nombre="'+data.formnom+'" cuenta="'+ $formato_old.attr("cuenta") +'" formato="'+data.formcampsel +'" cuentanom="'+ $formato_old.attr("cuentanom") +'">'+data.formnom+'</li>');

                    swal({   title: "",
                             text: data.msg,
                             type: "success",
                             confirmButtonText: "Ok" });
                }else{
                    swal({   title: "Ups!",
                             text: data.msg,
                             type: "error",
                             confirmButtonText: "Ok" });
                }

                $('.list-left ul > li.active, .list-right ul > li.active').each(function(){
                    if ($(this).hasClass('active')){
                        $(this).toggleClass('active');
                    }
                });

                $('#processing-modal').modal('toggle');
                $btn.button('reset')
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    var $formato = $('ul[type="archivo"] > li.active');

    if ($formato.length > 0){
        var $right =  $('.list-right ul');
        var formNom = $('#nomform').val();
        var formCarsep = $('#carsep').val();
        var formTipo = $('input[type=radio]:checked').val();
        var formCampSel = "";

        $('.list-right ul li').each(function(){
            $prop = $(this).attr('pos');
            if ($prop<10){
                formCampSel+= $prop.toString();
            }else{
                if ($prop === "10"){
                    formCampSel+= "A";
                }else if ($prop === "11"){
                    formCampSel+= "B";
                }
            }
        });
        if (idioma == 0){
            msj = "Seguro que desea modificar el formato "+ formNom +" ?";
        } else {
            msj = "Sure you want modify format "+ formNom +" ?";
        }
        swal({   title: "",
                 text: msj,
                 type: "warning",
                 showCancelButton: true,
                 confirmButtonText: "Ok"},
                 function(){
                    $btn = $(this).button('loading');
                    $('#processing-modal').modal('toggle');
                    upd_formarc($formato.attr("id"), formNom, formCarsep, formTipo, formCampSel);
                 }
                 );
    }else{
        if (idioma == 0){
            swal("","Por favor seleccionar un formato primero","error");
        } else {
            swal("","Select a format first please","error");
        }
    }
})
