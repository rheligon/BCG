var csrftoken = $.cookie('csrftoken');
var idioma = $('#idioma').val();

if (idioma ==0) {
    var m2 = ['Mensajes SWIFT', 'Seguridad', 'Procesamiento Diario', 'Administración', 'Configuracion', 'Avanzados', 'Estadísticas'];
    var m3 = ['Enviar y Recibir MTn99', 'Enviar y Recibir MTn95/MTn96'];
    var m4 = ['Parámetros Generales Matcher', 'Parámetros de la Empresa'];
    var m5 = ['Insertar y Modificar Datos Laborales', 'Reset Contraseña', 'Agregar y Eliminar Usuario', 'Asignar Cuentas'];
    var m10 = ['Configurar Parámetros Generales', 'Eliminar Cuenta', 'Configurar Alertas', 'Asignar Reglas de Transformación', 'Agregar Cuenta', 'Asignar Criterios de Match']
} else {
    var m2 = ['SWIFT Messages', 'Security', 'Daily Processing', 'Administration', 'Configuration', 'Advanced', 'Statistics'];
    var m3 = ['Send an Receive MTn99', 'Send an Receive MTn95/MTn96'];
    var m4 = ['Matcher General Parameters', 'Company Setting'];
    var m5 = ['Insert and Modify Laboral Information', 'Password Reset', 'Add and Delete User', 'Assign Accounts'];
    var m10 = ['Set General Parameters', 'Delete Account', 'Set Alerts', 'Assign Transformation Rules', 'Add Account', 'Assign Match Criteria']
}

var m2id = ["1","3","4","30","33","35","36"];
var m3id = ["22","25"];
var m4id = ["11","29"];
var m5id= ["14","27","31","32"];
var m10id = ["6","7","12","16","17","23"];

var idiomaAux = "";
var msj ="";
var centinela = true;

if (idioma == 0){
    idiomaAux = "es"
} else {
    idiomaAux = "en"
}

var tabla = iniciar_tabla(idiomaAux);

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
    var a_idaux = $('#Id_perfil').val();
    $('#perf-'+a_idaux).parent().css("background-color","");
    $('#perf-'+a_idaux).css("color","");

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

    if (idioma == 0){
        if (!pertenece(subindex,2)){
            $left.append('<li class="list-group-item subindex" sub="1" name="rep">Reportes</li>');
        }
        if (!pertenece(subindex,3)){
            $left.append('<li class="list-group-item subindex" sub="1" name="MT">Mensajes SWIFT</li>');
        }
        if (!pertenece(subindex,4)){
            $left.append('<li class="list-group-item subindex" sub="1" name="conf">Configuración</li>');
        }
        if (!pertenece(subindex,5)){
            $left.append('<li class="list-group-item subindex" sub="1" name="musr">Manejo de Usuarios</li>');
        }
        if (!pertenece(subindex,10)){
            $left.append('<li class="list-group-item subindex" sub="1" name="mcta">Manejo de Cuentas</li>');
        }
    } else {
        if (!pertenece(subindex,2)){
            $left.append('<li class="list-group-item subindex" sub="1" name="rep">Reports</li>');
        }
        if (!pertenece(subindex,3)){
            $left.append('<li class="list-group-item subindex" sub="1" name="MT">SWIFT Messages</li>');
        }
        if (!pertenece(subindex,4)){
            $left.append('<li class="list-group-item subindex" sub="1" name="conf">Configuration</li>');
        }
        if (!pertenece(subindex,5)){
            $left.append('<li class="list-group-item subindex" sub="1" name="musr">Users Management</li>');
        }
        if (!pertenece(subindex,10)){
            $left.append('<li class="list-group-item subindex" sub="1" name="mcta">Accounts Management</li>');    
        }
    }
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
                if (!pertenece(subindex,2)){
                    if (idioma == 0){
                        $right.append('<li class="list-group-item subindex" sub="1" name="rep">Reportes</li>');
                    } else {
                        $right.append('<li class="list-group-item subindex" sub="1" name="rep">Reports</li>');    
                    }
                }
            }else if (funcs2.length===0){
                if (!pertenece(subindex,2)){
                    if (idioma == 0){
                        $left.append('<li class="list-group-item subindex" sub="1" name="rep">Reportes</li>');
                    } else {
                        $left.append('<li class="list-group-item subindex" sub="1" name="rep">Reports</li>');
                    }
                }
            }

            if (funcs3.length>0){
                $('#acc-MT').val(funcs3.join("-"));
                if (!pertenece(subindex,3)){
                    if (idioma == 0){
                        $right.append('<li class="list-group-item subindex" sub="1" name="MT">Mensajes SWIFT</li>');
                    } else {
                        $right.append('<li class="list-group-item subindex" sub="1" name="MT">SWIFT Messages</li>');
                    }
                }
            }else if (funcs3.length===0){
                if (!pertenece(subindex,3)){
                    if (idioma == 0){
                        $left.append('<li class="list-group-item subindex" sub="1" name="MT">Mensajes SWIFT</li>');
                    } else {
                        $left.append('<li class="list-group-item subindex" sub="1" name="MT">SWIFT Messages</li>');
                    }
                }
            }

            if (funcs4.length>0){
                $('#acc-conf').val(funcs4.join("-"));
                if (!pertenece(subindex,4)){
                    if (idioma == 0){
                        $right.append('<li class="list-group-item subindex" sub="1" name="conf">Configuración</li>');
                    } else {
                         $right.append('<li class="list-group-item subindex" sub="1" name="conf">Configuratiom</li>');
                    }
                }
            }else if (funcs4.length===0){
                if (!pertenece(subindex,4)){
                    if (idioma == 0){
                        $left.append('<li class="list-group-item subindex" sub="1" name="conf">Configuración</li>');
                    } else {
                        $left.append('<li class="list-group-item subindex" sub="1" name="conf">Configuratiom</li>');
                    }
                }
            }

            if (funcs5.length>0){
                $('#acc-musr').val(funcs5.join("-"));
                if (!pertenece(subindex,5)){
                    if (idioma == 0){
                        $right.append('<li class="list-group-item subindex" sub="1" name="musr">Manejo de Usuarios</li>');
                    } else {
                        $right.append('<li class="list-group-item subindex" sub="1" name="conf">Users Management</li>');
                    }
                }
            }else if (funcs5.length===0){
                if (!pertenece(subindex,5)){
                    if (idioma == 0){
                        $left.append('<li class="list-group-item subindex" sub="1" name="musr">Manejo de Usuarios</li>');
                    } else {
                        $left.append('<li class="list-group-item subindex" sub="1" name="conf">Users Management</li>');
                    }
                }
            }

            if (funcs10.length>0){
                $('#acc-mcta').val(funcs10.join("-"));
                if (!pertenece(subindex,10)){
                    if (idioma == 0){
                        $right.append('<li class="list-group-item subindex" sub="1" name="mcta">Manejo de Cuentas</li>');
                    } else {
                        $right.append('<li class="list-group-item subindex" sub="1" name="mcta">Accounts Management</li>');
                    }
                }
            }else if (funcs10.length===0){
                if (!pertenece(subindex,10)){
                    if (idioma == 0){
                        $left.append('<li class="list-group-item subindex" sub="1" name="mcta">Manejo de Cuentas</li>');
                    } else {
                        $left.append('<li class="list-group-item subindex" sub="1" name="mcta">Accounts Management</li>');
                    }
                }
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
        error: function(jqXHR,error){
            $('#processing-modal').modal('toggle');
            alert(jqXHR.responseText) //debug
            if (idioma == 0){
                swal("Ups!", "Hubo un error buscando las funciones del perfil especificado.", "error");
            } else {
                swal("Ups!", "Error occurred searching functions.", "error");    
            }
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
    clean_all();
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
$('.list-arrows button').click(function(event) {
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
$('#table-perfiles').on('click','a[type=perfil]', function(event) {
    event.preventDefault();
    var a_idaux = $("#Id_perfil").val();
    //Estilo de elemento elegido
    $('#perf-'+a_idaux).parent().css("background-color","")
    $('#perf-'+a_idaux).css("color","")
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
        if (idioma == 0){
            msj = "Seguro que desea eliminar el perfil "+ nom +" ?";
        } else {
            msj = "Sure you want delete profile"+nom+" ?";
        }
        swal({   title: "",
             text: msj,
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
        if (idioma ==0){
            swal("Ups!","Por favor seleccionar el perfil a eliminar previamente.","error");
        } else {
            swal("Ups!","Select a profile first please.","error");   
        }
    }

});

//Agregar perfil
$('#acptButton').on('click', function () {
    var $btn;
   
    function add_perf(perfNom,perfFuncs){
        $.ajax({
            type:"POST",
            url: "/seguridad/perfiles/",
            data: {"perfNom": perfNom, "perfFuncs":perfFuncs, "action": "add"},
            success: function(data){

                if (data.add){
                    var a_id = data.perfid;
                    var a_nom = data.perfnom;
                    $('#Id_perfil').val(a_id);

                    var td1 = '<td><a name="'+a_nom+'" id="perf-'+a_id+'" type="perfil">'+a_nom+'</a></td>';
                    
                    $('#table-perfiles > tbody').append('<tr id ="tr-'+a_id+'"></tr>');

                    var jRow = $("#tr-"+a_id).append(td1);

                    tabla.row.add(jRow).draw();

                    //Estilo de elemento elegido
                    $('#perf-'+a_id).parent().css("background-color","#337ab7")
                    $('#perf-'+a_id).css("color","white")
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
                
                $('#acptButton').parent().toggle('hidden');
                $('#cancelButton').parent().toggle('hidden');
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
    var funcs = [];

    $('.list-right ul li').each(function(){
        if ($(this).attr("sub")==="1"){
            var nom = $(this).attr("name");
            var acc = $('#acc-'+nom).val().split("-");
            for (var i=0;i<acc.length;i++){
                if (acc[i]!=""){
                    funcs.push(acc[i]);
                }
            }
        }else{
            funcs.push($(this).attr("id").split("-")[1]);
        }  
    });

    if (nom.length>0 && nom.length<50){
        if (idioma == 0){
            msj ="Seguro que desea agregar el perfil "+ nom +" ?";
        } else {
            msj ="Sure you want add profile "+ nom +" ?";
        }
        swal({   title: "",
             text: msj,
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"},
             function(){
                $btn = $(this).button('loading')
                $('#processing-modal').modal('toggle');
                add_perf(nom,funcs);
             }
             );
    }else{
        if (nom.length===0){
            if (idioma == 0){
                swal("Ups!","Por favor indicar un nombre para el perfil.","error");
            } else {
                swal("Ups!","Introduce a profile name first please.","error");
            }
        }else{
            if (idioma == 0){
                swal("Ups!","El nombre del perfil tiene un máximo de 50 caracteres.","error");
             } else {
                swal("Ups!","Profile name has a 50 characters maximum length.","error");
            }
        }
    }
});

//Modificar perfil
$('#updButton').on('click', function () {
    var $btn;
   
    function upd_perf(perfId,perfNom,perfFuncs){
        $.ajax({
            type:"POST",
            url: "/seguridad/perfiles/",
            data: {"perfid":perfId, "perfNom": perfNom, "perfFuncs":perfFuncs, "action": "upd"},
            success: function(data){

                if (data.modif){
                    var a_id = data.perfid;
                    var a_nom = data.perfnom;
                    $('#Id_perfil').val(a_id);
                    $('#perf-'+a_id).html(a_nom);
                    $('#perf-'+a_id).attr("name",a_nom);

                    tabla.draw();

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
                $btn.button('reset');
                setTimeout(function(){
                    history.go(0);
                    window.location.href = window.location.href;
                },1000);
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    var pId = $('#Id_perfil').val();
    var nom = $('#perf-nom').val();
    var funcs = [];

    if (pId>=0){
        $('.list-right ul li').each(function(){
            if ($(this).attr("sub")==="1"){
                var nom = $(this).attr("name");
                var acc = $('#acc-'+nom).val().split("-");
                for (var i=0;i<acc.length;i++){
                    if (acc[i]!=""){
                        funcs.push(acc[i]);
                    }
                }
            }else{
                funcs.push($(this).attr("id").split("-")[1]);
            }  
        });
    };

    if (pId>=0 && nom.length>0 && nom.length<50){
        if (idioma == 0){
            msj ="Seguro que desea modificar el perfil "+ nom +" ?";
        } else {
            msj ="Sure you want modify profile "+ nom +" ?";
        }
        swal({   title: "",
             text: msj,
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"},
             function(){
                $btn = $(this).button('loading')
                $('#processing-modal').modal('toggle');
                upd_perf(pId,nom,funcs);
             }
             );
    }else{
        if (pId<0){
            if (idioma == 0){
                swal("Ups!","Por favor elija el perfil a modificar.","error");
            } else {
                swal("Ups!","Select a profile first please.","error");
            }
        }else if (nom.length===0){
            if (idioma == 0){
                swal("Ups!","Por favor indicar un nombre para el perfil.","error");
            } else {
                swal("Ups!","Introduce a profile name pelase.","error");
            }
        }else{
            if (idioma == 0){
                swal("Ups!","El nombre del perfil tiene un máximo de 50 caracteres.","error");
            } else {
                swal("Ups!","Profile name has a 50 characters maximum length.","error");
            }
        }
    }
});

//chequea pertenencia a rreglo de un elemento
function pertenece(arr,obj) {
    return (arr.indexOf(obj) != -1);
};