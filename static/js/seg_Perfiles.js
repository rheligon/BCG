var tabla = iniciar_tabla(idioma_tr);
var csrftoken = $.cookie('csrftoken');

var m2 = ['Mensajes SWIFT', 'Seguridad', 'Procesamiento Diario', 'Administración', 'Configuracion', 'Avanzados', 'Estadísticas'];
var m2id = ["1","3","4","30","33","35","36"];
var m3 = ['Enviar y Recibir MT99', 'Enviar y Recibir MT95/MT96'];
var m3id = ["22","25"];
var m4 = ['Parámetros Generales Matcher', 'Parámetros de la Empresa'];
var m4id = ["11","29"];
var m5 = ['Insertar y Modificar Datos Laborales', 'Reset Contraseña', 'Agregar y Eliminar Usuario', 'Asignar Cuentas'];
var m5id= ["14","27","31","32"];
var m10 = ['Configurar Parámetros Generales', 'Eliminar Cuenta', 'Configurar Alertas', 'Asignar Reglas de Transformación', 'Agregar Cuenta', 'Asignar Criterios de Match']
var m10id = ["6","7","12","16","17","23"];


Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};


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

function clean_all(){
    var $left =  $('.list-left ul');
    var $right =  $('.list-right ul');
    var $leftacc = $('.list-left-acc ul');
    var $rightacc = $('.list-right-acc ul');
    $left.html('');
    $right.html('');
    $leftacc.html('');
    $rightacc.html('');
    $('#acc-rep').val("");
    $('#acc-MT').val("");
    $('#acc-conf').val("");
    $('#acc-musr').val("");
    $('#acc-mcta').val("");
    $('#Id_perfil').val(-1);
    $('#perf-nom').val("");

    $left.append('<li class="list-group-item subindex" sub="1" name="rep">Reportes</li>');
    $left.append('<li class="list-group-item subindex" sub="1" name="MT">Mensajes SWIFT</li>');
    $left.append('<li class="list-group-item subindex" sub="1" name="conf">Configuración</li>');
    $left.append('<li class="list-group-item subindex" sub="1" name="musr">Manejo de Usuarios</li>');
    $left.append('<li class="list-group-item subindex" sub="1" name="mcta">Manejo de Cuentas</li>');

    for (var i=0;i<nosub.length;i++){
        $left.append('<li class="list-group-item" sub="0" id="op-'+nosubid[i]+'">'+nosub[i]+'</li>');
    };
};

//Rellenar reglas de acuerdo a la seleccion de cuenta
function get_func(perfId){
    $.ajax({
        type:"POST",
        url: "/seguridad/perfiles/",
        data: {"perfid": perfId, "action": 'sel'},
        success: function(data){
            var json_data = jQuery.parseJSON(data);
            var funcs = [];
            var funcs2 = [];
            var funcs3 = [];
            var funcs4 = [];
            var funcs5 = [];
            var funcs10 = [];

            //Reseteando las listas
            var $left =  $('.list-left ul');
            var $right =  $('.list-right ul');
            var $leftacc = $('.list-left-acc ul');
            var $rightacc = $('.list-right-acc ul');
            $left.html('');
            $right.html('');
            $leftacc.html('');
            $rightacc.html('');

            //Asignar las subfunciones a cada arreglo correspondiente
            for (var i = 0; i < json_data.length; i++){
                var id = ""+json_data[i].pk;
                var sel2 = $.inArray(id,m2id);
                var sel3 = $.inArray(id,m3id);
                var sel4 = $.inArray(id,m4id);
                var sel5 = $.inArray(id,m5id);
                var sel10 = $.inArray(id,m10id);
                if (sel2<0 && sel3<0 && sel4<0 && sel5<0 && sel10<0){
                    funcs.push(id);
                }else if (sel2>=0){
                    funcs2.push(id);
                }else if (sel3>=0){
                    funcs3.push(id);
                }else if (sel4>=0){
                    funcs4.push(id);
                }else if (sel5>=0){
                    funcs5.push(id);
                }else if (sel10>=0){
                    funcs10.push(id);
                }
            };

            if (funcs2.length>0){
                $('#acc-rep').val(funcs2.join("-"));
                $right.append('<li class="list-group-item subindex" sub="1" name="rep">Reportes</li>');
            }
            if (funcs3.length>0){
                $('#acc-MT').val(funcs3.join("-"));
                $right.append('<li class="list-group-item subindex" sub="1" name="MT">Mensajes SWIFT</li>');
            }
            if (funcs4.length>0){
                $('#acc-conf').val(funcs4.join("-"));
                $right.append('<li class="list-group-item subindex" sub="1" name="conf">Configuración</li>');
            }
            if (funcs5.length>0){
                $('#acc-musr').val(funcs5.join("-"));
                $right.append('<li class="list-group-item subindex" sub="1" name="musr">Manejo de Usuarios</li>');
            }
            if (funcs10.length>0){
                $('#acc-mcta').val(funcs10.join("-"));
                $right.append('<li class="list-group-item subindex" sub="1" name="mcta">Manejo de Cuentas</li>');
            }
            
            //Asignar a la izquierda los que esten disponibles
            var to_left = nosubid.diff(funcs);
            for (var i=0;i<to_left.length;i++){
                var index = nosubid.indexOf(to_left[i]);
                var nom = nosub[index];
                $left.append('<li class="list-group-item" sub="0" id="op-'+to_left[i]+'">'+nom+'</li>');
            };

            //Asignar a la derecha los Asignados
            for (var i=0;i<funcs.length;i++){
                var index = nosubid.indexOf(funcs[i]);
                var nom = nosub[index];
                $right.append('<li class="list-group-item" sub="0" id="op-'+funcs[i]+'">'+nom+'</li>');
            };

            $('#processing-modal').modal('toggle');
        },
        error: function(error){
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error buscando las funciones del perfil especificado.", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
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


//Elegir las opciones del dual list izquierdo funciones(que se ponga azul)
$('body').on('click', '.list-group[type=camposl] .list-group-item, .list-group[type=accl] .list-group-item, .list-group[type=accr] .list-group-item', function () {
    $checkBox = $('.dual-list .selector');

    if ($(this).hasClass('active')){
        if ($checkBox.hasClass('selected')) {
            $checkBox.removeClass('selected');
            $checkBox.children('i').removeClass('glyphicon-check').addClass('glyphicon-unchecked');
        }
    }

    $(this).toggleClass('active');
});

//Elegir las opciones del dual list derecho funciones (desplegar subopciones si tiene)
$('body').on('click', '.list-group[type=camposr] .list-group-item', function () {
    
    $('.list-right ul li.active').each(function(){
        $(this).toggleClass('active');
    });

    $(this).toggleClass('active');

    $('ul[type="accr"] > li').remove();
    $('ul[type="accl"] > li').remove();

    if ($(this).attr("sub")==="1"){
        var nom = $(this).attr("name");
        var acc = $('#acc-'+nom).val().split("-");
        var acc_comp = $('#acc-'+nom).attr("accesos").split("-");
        var no_asig = acc_comp.diff(acc);
        var arreglo,arregloid;

        if (nom==="rep"){
            arreglo = m2;
            arregloid = m2id;
        }else if (nom==="MT"){
            arreglo = m3;
            arregloid=m3id;
        }else if (nom==="conf"){
            arreglo = m4;
            arregloid=m4id;
        }else if (nom==="musr"){
            arreglo = m5;
            arregloid=m5id;
        }else if (nom==="mcta"){
            arreglo = m10;
            arregloid=m10id;
        };
        //Asignados
        for (var i=0;i<acc.length;i++){
            if (acc[0]!=""){
                var acc_asig = arregloid.indexOf(acc[i]);
                var li = '<li class="list-group-item" nombre="'+nom+'" id="'+acc[i]+'">'+ arreglo[acc_asig] +'</li>';
                $('ul[type="accr"]').append(li);
            }
        };
        //No asignados
        for (var i=0;i<no_asig.length;i++){
            var acc_asig = arregloid.indexOf(no_asig[i]);
            var li = '<li class="list-group-item" nombre="'+nom+'" id="'+no_asig[i]+'">'+ arreglo[acc_asig] +'</li>';
            $('ul[type="accl"]').append(li);
        };
    }
});

//Flechas
$('.list-arrows button').click(function () {
    event.preventDefault();
    var $button = $(this), actives = '';
    //Izquierda funciones
    if ($button.hasClass('move-left')) {
        var actives = $('.list-right ul li.active');
        actives.removeClass('active').clone().appendTo('.list-left ul');
        actives.each(function(){
            if ($(this).attr("sub")==="1"){
                var nom = $(this).attr("name");
                $('#acc-'+nom).val("");
            }
        });
        actives.remove();
    //Derecha funciones
    } else if ($button.hasClass('move-right')) {
        var actives = $('.list-left ul li.active');
        actives.removeClass('active').clone().appendTo('.list-right ul');
        actives.each(function(){
            if ($(this).attr("sub")==="1"){
                var nom = $(this).attr("name");
                var accesos = $('#acc-'+nom).attr("accesos");
                $('#acc-'+nom).val(accesos);
            }
        });
        actives.remove();
    //Izquierda accesos
    } else if ($button.hasClass('move-left-acc')) {
        var actives = $('.list-right-acc ul li.active');
        var rmv = [];
        var nom = $(actives[0]).attr("nombre");
        if (nom){
            var val = $('#acc-'+nom).val().split("-");

            actives.each(function(){
                rmv.push($(this).attr("id"));
            });

            var aux = val.diff(rmv);
            $('#acc-'+nom).val(aux.join("-"));
        };
        actives.removeClass('active').clone().appendTo('.list-left-acc ul');
        actives.remove();
    //Derecha accesos
    } else if ($button.hasClass('move-right-acc')) {
        var actives = $('.list-left-acc ul li.active');
        var add = [];
        var nom = $(actives[0]).attr("nombre");
        if (nom){
            var val = $('#acc-'+nom).val().split("-");
            var arreglo, arregloid;
            
            actives.each(function(){
                var auxid = $(this).attr("id");
                var auxindex;
                if (nom==="rep"){
                    arreglo = m2;
                    arregloid = m2id;
                }else if (nom==="MT"){
                    arreglo = m3;
                    arregloid=m3id;
                }else if (nom==="conf"){
                    arreglo = m4;
                    arregloid=m4id;
                }else if (nom==="musr"){
                    arreglo = m5;
                    arregloid=m5id;
                }else if (nom==="mcta"){
                    arreglo = m10;
                    arregloid=m10id;
                };

                auxindex = arregloid.indexOf(auxid);
                val.splice(auxindex,0,auxid);
            });
            $('#acc-'+nom).val(val.join("-"));
        };

        actives.removeClass('active').clone().appendTo('.list-right-acc ul');
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



//Elegir el archivo
$('#table-perfiles').on('click','a[type=perfil]', function () {
    event.preventDefault();
    var a_idaux = $("#Id_perfil").val();
    //Estilo de elemento elegido
    $('#'+a_idaux).parent().css("background-color","")
    $('#'+a_idaux).css("color","")
    $(this).parent().css("background-color","#337ab7")
    $(this).css("color","white")

    //Buscando los campos elegidos para el formato
    var id = $(this).attr('id').split("-")[1];
    $('#processing-modal').modal('toggle');
    $("#Id_perfil").val(id);
    $('#perf-nom').val($(this).attr("name"));
    get_func(id);
}); 

//Eliminar perfil
$('#delButton').on('click', function () {
    var $btn;
   
    function del_perf(perfId){
        $.ajax({
            type:"POST",
            url: "/seguridad/perfiles/",
            data: {"perfid": perfId, "action": "del"},
            success: function(data){

                if (data.elim){
                    tabla.row($('#tr-'+ data.perfid)).remove().draw();
                    clean_all();
                    swal({   title: "",
                             text: data.msg,
                             type: "success",
                             confirmButtonText: "Ok" });
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

    var nom = $('#perf-nom').val();
    var idp = $("#Id_perfil").val();
    if (idp>=0){
        swal({   title: "",
             text: "Seguro que desea eliminar el perfil "+ nom +" ?",
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"},
             function(){
                $btn = $(this).button('loading')
                $('#processing-modal').modal('toggle');
                del_perf(idp);
             }
             );
    }else{
        swal("Ups!","Por favor seleccionar el perfil a eliminar previamente.","error");
    }

})




var menu2 = [
    { name: m2[0], func: function (element) { $(element).css("color", "red"); } },
    { name: m2[1], func: function (element) { $(element).css("color", "black"); } },
    { name: m2[2], func: function (element) { $(element).css("color", "black"); } },
    { name: m2[3], func: function (element) { $(element).css("color", "black"); } },
    { name: m2[4], func: function (element) { $(element).css("color", "black"); } },
    { name: m2[5], func: function (element) { $(element).css("color", "black"); } },
    { name: m2[6], func: function (element) { $(element).css("color", "black"); } }
];

//$(".subindex").rightClickMenu(menu2);