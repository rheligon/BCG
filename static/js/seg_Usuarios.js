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

        return $('#table-usuarios').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            }
        })

    }else if (idioma==="en"){

        return $('#table-usuarios').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            }
        })
    };
};

function clean_cta_form(){
    //Datos Personales
    $("#usuario-nom").val("");
    $("#usuario-apell").val("");
    $("#usuario-ci").val("");
    $("#usuario-tlf").val("");
    $("#usuario-mail").val("");
    $("#usuario-dir").val("");

    //Datos Laborales
    $("#perf-sel").val(-1);
    $("#dl-obs").val("");

    //Cuentas
    var $left =  $('.list-left ul');
    var $right =  $('.list-right ul');
    $left.html('');
    $right.html('');

    $('#cuentas_disp > li').each(function(){
        var $aux = $(this).clone();
        $left.append($aux);
    });

    //Sesion
    $("#nomusr").val("");
    $("#nomusr").attr("readonly",false);
    $("#contusr").val("");
    $("#contusr2").val("");
    $("#ldapcb").attr("checked",false);

    //Estilo de elemento elegido previamente
    var a_idaux = $("#Id_usuario").val();
    $("#Id_usuario").val(-1);
    $('#'+a_idaux).parent().css("background-color","");
    $('#'+a_idaux).css("color","");
};

//Flechas dual-list
$('.list-arrows button').click(function () {
    event.preventDefault();
    var $button = $(this), actives = '';
    //Izquierda
    if ($button.hasClass('move-left')) {
        actives = $('.list-right ul li.active');
        actives.each(function(){
            $(this).removeClass("active")
        })
        actives.clone().appendTo('.list-left ul');
        actives.remove();
    //Derecha
    } else if ($button.hasClass('move-right')) {
        actives = $('.list-left ul li.active');
        actives.each(function(){
            $(this).removeClass("active")
        })
        actives.clone().appendTo('.list-right ul');
        actives.remove();
    }
});

//Filtrar dual-list
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

//Que se ponga azul al seleccionar la opcion en el dual-list
$('body').on('click', '.list-group[type=cuenta] .list-group-item', function () {
    $(this).toggleClass('active');
});

//Mostrar Detalle al hacer click en el usuario
$('#table-usuarios').on('click','a[type=usuario]', function(event) {
    event.preventDefault();
    var a_idaux = $("#Id_usuario").val();
    var a_nom = $(this).attr("nombres");
    var a_apell = $(this).attr("apellidos");
    var a_id = $(this).attr("id");
    var a_ci = $(this).attr("ci");
    var a_tlf = $(this).attr("tlf");
    var a_mail = $(this).attr("correo");
    var a_dir = $(this).attr("dir");
    var a_estado = $(this).attr("estado");
    var a_usrname = $(this).attr("login");
    var a_perf = $(this).attr("perf");
    var a_obs = $(this).attr("obs");
    var a_ldap = $(this).attr("ldap");
    var a_usr = $(this).attr("usr");

    $("#Id_usuario").val(a_id);

    //Datos personales
    $("#usuario-nom").val(a_nom);
    $("#usuario-apell").val(a_apell);
    $("#usuario-ci").val(a_ci);
    $("#usuario-tlf").val(a_tlf);
    $("#usuario-mail").val(a_mail);
    $("#usuario-dir").val(a_dir);

    //Datos Laborales
    $("#perf-sel").val(a_perf);
    $("#dl-obs").val(a_obs);

    //Cuentas
    $('#processing-modal').modal('toggle');
    cuentas(a_usr)
    $('#processing-modal').modal('toggle');

    //Sesion
    $("#nomusr").val(a_usrname);
    $("#nomusr").attr("readonly",true);
    $("#contusr").val("");
    $("#contusr2").val("");
    if (a_ldap==="0"){
        $("#ldapcb").prop("checked",false);
    }else if (a_ldap==="1"){
        $("#ldapcb").prop("checked",true);
    }

    //Estilo de elemento elegido
    $('#'+a_idaux).parent().css("background-color","");
    $('#'+a_idaux).css("color","");
    $(this).parent().css("background-color","#337ab7");
    $(this).css("color","white");


    //Esconder boton de aceptar y cancelar en caso de estar visibles
    if (!$('#acptButton').parent().is(':hidden')){
        $('#acptButton').parent().toggle('hidden');
        $('#cancelButton').parent().toggle('hidden');
    }
});

//Rellenar cuentas de acuerdo a la seleccion de usuario
function cuentas(usrId){
    $.ajax({
        type:"POST",
        url: "/seguridad/usuarios/",
        data: {"usrid": usrId, "action": 'sel'},
        success: function(data){
            var json_data = jQuery.parseJSON(data);
            var cuentas_asig = [];
            
            for (var i = 0; i < json_data.length; i++) {
                if (json_data[i].fields.cuenta_idcuenta){
                    cuentas_asig.push("cta-"+json_data[i].fields.cuenta_idcuenta);
                }else{
                    cuentas_asig.push("cta-"+json_data[i].pk);
                }               
            }; 

            //Cuentas
            var $left =  $('.list-left ul');
            var $right =  $('.list-right ul');
            $left.html('');
            $right.html('');

            $('#cuentas_disp > li').each(function(){
                var id = $(this).attr('id');
                var sel = $.inArray(id,cuentas_asig);
                var $aux = $(this).clone();

                if (sel<0){
                    $left.append($aux);
                }else{
                    $right.append($aux);
                };
            });     
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};

//Desbloquear usuario
function desb_usr(sessId){
    $.ajax({
        type:"POST",
        url: "/seguridad/usuarios/",
        data: {"sessid": sessId, "action": 'desb'},
        success: function(data){
            if (data.desb){
                var sessid = data.sessid;
                $('#tr-'+sessid+' > td').eq(3).html("Activo");

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
};

//Cerrar sesion usuario
function cerrar_usr(sessId){
    $.ajax({
        type:"POST",
        url: "/logout/",
        data: {"sessid": sessId},
        success: function(data){
            var sessid = data.sessid;
            $('#tr-'+sessid+' > td').eq(4).html("Logout");
            $('#processing-modal').modal('toggle');
            $btn.button('reset');
        },
        error: function(jqXHR, error){
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            $btn.button('reset');
            swal("Ups!", "Hubo un error en la clave", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};

//Cambiar Contraseña
$('#contrRstButton').on('click', function () {
    event.preventDefault();
    var $btn;
   
    function reset_pass(newpass,sessid){
        $.ajax({
            type:"POST",
            url: "/seguridad/usuarios/",
            data: {"newpass":newpass, "sessid":sessid, "action": "pwd"},
            success: function(data){
                if (data.pwd){
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
            error: function(jqXHR, error){
                alert(jqXHR.responseText) //debug
                $('#processing-modal').modal('toggle');
                $btn.button('reset');
                swal("Ups!", "Hubo un error en la clave", "error");
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    var newpass = $('#contusr').val();
    var newpass2 = $('#contusr2').val();
    var sessid = $('#Id_usuario').val();
    
    if (newpass === newpass2 && sessid>=0){
        $btn = $(this).button('loading');
        $('#processing-modal').modal('toggle');
        reset_pass(newpass,sessid);
    }else{
        if (sessid<0){
            swal("Ups!","Elija un usuario primero para resetear su contraseña.","error");
        }else{
            swal("Ups!","Las contraseñas no coinciden.","error");
        }
    }
});

//Eliminar usuario
$('#delButton').on('click', function () {
    var $btn;
   
    function del_usr(sessId){
        $.ajax({
            type:"POST",
            url: "/seguridad/usuarios/",
            data: {"sessid": sessId, "action": "del"},
            success: function(data){

                if (data.elim){
                    tabla.row($('#tr-'+ data.sessid)).remove().draw();

                    swal({   title: "",
                             text: data.msg,
                             type: "success",
                             confirmButtonText: "Ok" });

                    clean_cta_form();
                    $('#Id_usuario').val(-1);

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

    var usr_elim = $('#Id_usuario').val();
    var usr_nom = $('#'+usr_elim).attr("login");

    if (usr_elim > 0){
        swal({   title: "",
             text: "Seguro que desea eliminar el usuario "+ usr_nom +" ?",
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"},
             function(){
                $btn = $(this).button('loading')
                $('#processing-modal').modal('toggle');
                del_usr(usr_elim);
             }
             );
    }else{
        swal("","Por favor seleccionar un usuario primero","error");
    }
})

//Mostrar botones aceptar y cancelar
$('#addButton').on('click', function () {
    clean_cta_form();
    $('#acptButton').parent().toggle('hidden');
    $('#cancelButton').parent().toggle('hidden');
});

//Ocultar botones aceptar y cancelar
$('#cancelButton').on('click', function () {
    $('#acptButton').parent().toggle('hidden');
    $(this).parent().toggle('hidden');
});

//Desbloquear usuario
$('#desbButton').on('click', function () {
    var sessid = $('#Id_usuario').val();
    if (sessid>=0){
        $btn = $(this).button('loading')
        $('#processing-modal').modal('toggle');
        desb_usr(sessid);
    }else{
        swal('Ups!','Por favor seleccione el usuario a desbloquear primero.','error');
    }
});

//Cerrar sesion de usuario
$('#logoutButton').on('click', function () {
    var sessid = $('#Id_usuario').val();
    if (sessid>=0){
        $btn = $(this).button('loading')
        $('#processing-modal').modal('toggle');
        cerrar_usr(sessid);
    }else{
        swal('Ups!','Por favor seleccione el usuario al que se desea cerrar la sesion primero.','error');
    }
});

//Agregar Cuenta
$('#acptButton').on('click', function () {
    var $btn;
   
    function add_usr(usrnom,usrapell,usrci,usrtlf,usrmail,usrdir,usrperf,usrobs,usrctas,usrlogin,usrpwd,usrldap){
        $.ajax({
            type:"POST",
            url: "/seguridad/usuarios/",
            data: {"usrnom":usrnom, "usrapell":usrapell, "usrci":usrci, "usrtlf":usrtlf, "usrmail":usrmail, "usrdir":usrdir, "usrperf":usrperf, "usrobs":usrobs, "usrctas":usrctas, "usrlogin":usrlogin, "usrpwd":usrpwd, "usrldap":usrldap,"action": "add"},
            success: function(data){

                if (data.add){

                    clean_cta_form();
                    var a_idaux = $("#Id_usuario").val();

                    var a_nom = data.usrnom;
                    var a_apell = data.usrapell;
                    var a_id = data.sessid;
                    var a_ci = data.usrci;
                    var a_tlf = data.usrtlf;
                    var a_mail = data.usrmail;
                    var a_dir = data.usrdir;
                    var a_estado = "Pendiente";
                    var a_login = data.usrlogin;
                    var a_perf = data.usrperf;
                    var a_obs = data.usrobs;
                    var a_ldap = data.usrldap;
                    var a_usr = data.usrid;

                    $("#Id_usuario").val(a_id);

                    //Datos personales
                    $("#usuario-nom").val(a_nom);
                    $("#usuario-apell").val(a_apell);
                    $("#usuario-ci").val(a_ci);
                    $("#usuario-tlf").val(a_tlf);
                    $("#usuario-mail").val(a_mail);
                    $("#usuario-dir").val(a_dir);

                    //Datos Laborales
                    $("#perf-sel").val(a_perf);
                    $("#dl-obs").val(a_obs);

                    //Cuentas
                    var $left =  $('.list-left ul');
                    var $right =  $('.list-right ul');
                    $left.html('');
                    $right.html('');

                    $('#cuentas_disp > li').each(function(){
                        var $aux = $(this).clone();
                        $left.append($aux);
                    });

                    //Sesion
                    $("#nomusr").val(a_login);
                    $("#nomusr").attr("readonly",true);
                    $("#contusr").val("");
                    $("#contusr2").val("");
                    if (a_ldap==="0"){
                        $("#ldapcb").prop("checked",false);
                    }else if (a_ldap==="1"){
                        $("#ldapcb").prop("checked",true);
                    }

                    var td1 = '<td><a ci="'+a_ci+'" id="'+a_id+'" nombres="'+a_nom+'" apellidos="'+a_apell+'" tlf="'+a_tlf+'" correo="'+a_mail+'" dir="'+a_dir+'" conexion="0" estado="Pendiente" ldap="'+a_ldap+'" login="'+a_login+'" perf="'+a_perf+'" obs="'+a_obs+'" usr="'+a_usr+'" type="usuario">'+a_login+'</a></td>';
                    var td2 = '<td>' + a_nom+', '+a_apell + '</td>';
                    var td3 = '<td>' + $('#perf-sel > option[value='+a_perf+']').html() + '</td>';
                    var td4 = '<td> Pendiente </td>';
                    var td5 = '<td> Logout </td>';

                    $('#table-usuarios > tbody').append('<tr id ="tr-'+a_id+'"></tr>');

                    var jRow = $("#tr-"+a_id).append(td1,td2,td3,td4,td5);

                    tabla.row.add(jRow).draw();

                    //Estilo de elemento elegido
                    $('#'+a_idaux).parent().css("background-color","");
                    $('#'+a_idaux).css("color","");
                    $('#'+a_id).parent().css("background-color","#337ab7");
                    $('#'+a_id).css("color","white");

                    //Readonly para el nombre de Usuario
                    $("#nomusr").attr("readonly",true);

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
            error: function(jqXHR, error){
                alert(jqXHR.responseText) //debug
                $('#processing-modal').modal('toggle');
                swal("Ups!", "Hubo un error creando la cuenta especificada.", "error");
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    var a_nom = $("#usuario-nom").val();
    var a_apell = $("#usuario-apell").val();
    var a_ci = $("#usuario-ci").val();
    var a_tlf = $("#usuario-tlf").val();
    var a_mail = $("#usuario-mail").val();
    var a_dir = $("#usuario-dir").val();
    var a_perf = $("#perf-sel").val();
    var a_obs = $("#dl-obs").val();
    var a_ldap = $("#ldapcb").prop('checked');
    var a_login = $("#nomusr").val();
    var a_pass = $("#contusr").val();
    var a_pass2 = $("#contusr2").val();
    var a_ctas = [];
    $('.list-right ul > li').each(function(){
        a_ctas.push($(this).attr('id'));
    });

    if (a_ldap){
        a_ldap = 1;
    }else{
        a_ldap = 0;
    };

    if (a_perf>=0 && a_pass === a_pass2 && a_pass.length>0 && a_login.length>0 && a_login.length<=20 && a_nom.length>0 && a_nom.length<=20 && a_apell.length>0 && a_apell.length<=20 && a_ci.length>0 && a_ci.length<=20){
        swal({   title: "",
             text: "Seguro que desea agregar el usuario "+ a_login +" ?",
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"},
             function(){
                $btn = $(this).button('loading')
                $('#processing-modal').modal('toggle');
                add_usr(a_nom,a_apell,a_ci,a_tlf,a_mail,a_dir,a_perf,a_obs,a_ctas,a_login,a_pass,a_ldap);
             }
             );
    }else{
      if (a_nom.length===0 || a_nom.length>20){
        swal("Ups!","Por favor colocar un nombre para el usuario con un máximo de 20 caracteres.","error");
      }else if(a_apell.length===0 || a_apell.length>20){
        swal("Ups!","Por favor colocar un apellido para el usuario con un máximo de 20 caracteres.","error");
      }else if(a_ci.length===0 || a_ci.length>20){
        swal("Ups!","Por favor colocar la C.I para el usuario con un máximo de 20 caracteres.","error");
      }else if(a_perf<0){
        swal("Ups!","Por favor elegir un perfil para el usuario.","error");
      }else if(a_login.length===0 || a_login.length>20){
        swal("Ups!","Por favor colocar un login para el usuario con un máximo de 20 caracteres.","error");
      }else if (a_pass.length === 0){
        swal("Ups!","Por favor introducir una contraseña.","error");
      }else if (a_pass != a_pass2){
        swal("Ups!","Las contraseñas no coinciden.","error");
      };
    }
})

//Modificar Cuenta
$('#updButton').on('click', function () {
    var $btn;
   
    function upd_usr(usrnom,usrapell,usrci,usrtlf,usrmail,usrdir,usrperf,usrobs,usrctas,usrldap,sessid){
        $.ajax({
            type:"POST",
            url: "/seguridad/usuarios/",
            data: {"usrnom":usrnom, "usrapell":usrapell, "usrci":usrci, "usrtlf":usrtlf, "usrmail":usrmail, "usrdir":usrdir, "usrperf":usrperf, "usrobs":usrobs, "usrctas":usrctas, "usrldap":usrldap, "sessid":sessid , "action": "upd"},
            success: function(data){

                if (data.modif){

                    var a_nom = data.usrnom;
                    var a_apell = data.usrapell;
                    var a_id = data.sessid;
                    var a_ci = data.usrci;
                    var a_tlf = data.usrtlf;
                    var a_mail = data.usrmail;
                    var a_dir = data.usrdir;
                    var a_estado = data.usrestado;
                    var a_login = data.usrlogin;
                    var a_perf = data.usrperf;
                    var a_obs = data.usrobs;
                    var a_ldap = data.usrldap;
                    var a_usr = data.usrid;

                    var td1 = '<td><a ci="'+a_ci+'" id="'+a_id+'" nombres="'+a_nom+'" apellidos="'+a_apell+'" tlf="'+a_tlf+'" correo="'+a_mail+'" dir="'+a_dir+'" conexion="0" estado="Pendiente" ldap="'+a_ldap+'" login="'+a_login+'" perf="'+a_perf+'" obs="'+a_obs+'" usr="'+a_usr+'" type="usuario">'+a_login+'</a></td>';
                    var td2 = '<td>' + a_nom+', '+a_apell + '</td>';
                    var td3 = '<td>' + $('#perf-sel > option[value='+a_perf+']').html() + '</td>';
                    var td4 = '<td>'+ a_estado +'</td>';
                    var td5 = '<td> Logout </td>';
                    
                    tabla.row($('#tr-'+ a_id)).remove().draw();

                    $('#table-usuarios > tbody').append('<tr id ="tr-'+a_id+'"></tr>');

                    var jRow = $("#tr-"+a_id).append(td1,td2,td3,td4,td5);

                    tabla.row.add(jRow).draw();

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
            error: function(jqXHR, error){
                alert(jqXHR.responseText) //debug
                $('#processing-modal').modal('toggle');
                swal("Ups!", "Hubo un error creando la cuenta especificada.", "error");
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    var a_sessid = $("#Id_usuario").val();
    var a_nom = $("#usuario-nom").val();
    var a_apell = $("#usuario-apell").val();
    var a_ci = $("#usuario-ci").val();
    var a_tlf = $("#usuario-tlf").val();
    var a_mail = $("#usuario-mail").val();
    var a_dir = $("#usuario-dir").val();
    var a_perf = $("#perf-sel").val();
    var a_obs = $("#dl-obs").val();
    var a_login = $("#nomusr").val();
    var a_ldap = $("#ldapcb").prop('checked');
    var a_ctas = [];
    $('.list-right ul > li').each(function(){
        a_ctas.push($(this).attr('id'));
    });

    if (a_ldap){
        a_ldap = 1;
    }else{
        a_ldap = 0;
    };

    if (a_perf>=0 && a_nom.length>0 && a_nom.length<=20 && a_apell.length>0 && a_apell.length<=20 && a_ci.length>0 && a_ci.length<=20){
        swal({   title: "",
             text: "Seguro que desea modificar el usuario "+ a_login +" ?",
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"},
             function(){
                $btn = $(this).button('loading')
                $('#processing-modal').modal('toggle');
                upd_usr(a_nom,a_apell,a_ci,a_tlf,a_mail,a_dir,a_perf,a_obs,a_ctas,a_ldap,a_sessid);
             }
             );
    }else{
      if (a_nom.length===0 || a_nom.length>20){
        swal("Ups!","Por favor colocar un nombre para el usuario con un máximo de 20 caracteres.","error");
      }else if(a_apell.length===0 || a_apell.length>20){
        swal("Ups!","Por favor colocar un apellido para el usuario con un máximo de 20 caracteres.","error");
      }else if(a_ci.length===0 || a_ci.length>20){
        swal("Ups!","Por favor colocar la C.I para el usuario con un máximo de 20 caracteres.","error");
      }else if(a_perf<0){
        swal("Ups!","Por favor elegir un perfil para el usuario.","error");
      };
    }
})