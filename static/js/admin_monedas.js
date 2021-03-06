var csrftoken = $.cookie('csrftoken');
var idioma = $('#idioma').val();
var idiomaAux = "";
var msj ="";
var titulo ="";

if (idioma == 0){
    idiomaAux = "es";
    meses = "Meses";
    dias = "Días";
} else {
    idiomaAux = "en";
    meses = "Months";
    dias = "Days";
}

var tabla = iniciar_tabla(idiomaAux);

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

// chequear formato de los numeros
function chequearFornatoNumero(elem){
    if (idioma == 1){
        return (/^(\d{1})+(\.\d{1,2})?$/.test(elem))
    } else {
        return (/^(\d{1})+(\,\d{1,2})?$/.test(elem))
    }
}

function iniciar_tabla(idioma){

    if (idioma==="es"){

        return $('#table-mon').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            }
        })

    }else if (idioma==="en"){

        return $('#table-mon').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            }
        })
    };
};


//Mostrar Detalle al hacer click en código de banco
$('#table-mon').on('click','a[type=moneda]', function(event) {
    event.preventDefault();
    var a_idaux = $("#Id_moneda").val();
    var a_nom = $(this).attr("nombre");
    var a_cod = $(this).attr("codigo");
    var a_cam = $.formatNumber($(this).attr("cambio"),{locale:idiomaAux});
    var a_id = $(this).attr("id");
    $("#Cod_moneda").val(a_cod);
    $("#Nom_moneda").val(a_nom);
    $("#Cam_moneda").val(a_cam);
    $("#Id_moneda").val(a_id);
    $(".moneda-detalle").show();

    //Estilo de elemento elegido
    $('#'+a_idaux).parent().css("background-color","")
    $('#'+a_idaux).css("color","")
    $(this).parent().css("background-color","#337ab7")
    $(this).css("color","white")
});

//Eliminar Moneda
$('#delButton').on('click', function () {
    var $btn;
   
    function del_mon(monId){
        $.ajax({
            type:"POST",
            url: "/admin/monedas/",
            data: {"monedaid": monId, "action": "del"},
            success: function(data){
                if (data.elim){
                    tabla.row($('#tr-'+ data.monedaid)).remove().draw();
                    $(".moneda-detalle").hide();
                    $('#Id_moneda').val(-1);
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

    var codM = $('#Cod_moneda').val();
    var idM = $("#Id_moneda").val();

    if (idM>=0){
        if (idioma == 0){
            msj = "Seguro que desea eliminar la moneda "+codM+" ?";
        } else {
            msj = "Sure you want delete the currency "+codM+" ?";
        }
        swal({   title: "",
             text: msj,
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"},
             function(){
                $btn = $(this).button('loading')
                $('#processing-modal').modal('toggle');
                del_mon(idM);
             }
             );
    }else{
        if (idioma == 0){
            swal("Ups!","Por favor seleccionar una moneda a eliminar previamente.", "error");
        } else {
            swal("Ups!","Select a currency please.", "error");
        }
    }
})

//Modificar Moneda
$('#updButton').on('click', function () {
    var $btn;
   
    function upd_mon(monedaId, monedaNom, monedaCod, monedaCam){
        $.ajax({
            type:"POST",
            url: "/admin/monedas/",
            data: {"monedaid": monedaId, "monedanom":monedaNom, "monedacod":monedaCod, "monedacam":monedaCam, "action": "upd"},
            success: function(data){
                if (data.modif){
                    tabla.row($('#tr-'+ data.monedaid)).remove().draw();

                    var td1 = '<td>'+ '<a href="/admin/monedas/'+ data.monedaid + '" nombre ="' + data.monnom + '" id="'+ data.monedaid + '" codigo = "' + data.moncod + '" cambio = "' + data.moncam + '" type="moneda">' + data.moncod + '</a></td>';

                    var td2 = '<td>' + data.monnom + '</td>';

                    var td3 = '<td>' + data.moncam + '</td>';


                    $('#table-mon> tbody').append('<tr id ="tr-'+data.monedaid+'"></tr>');

                    var jRow = $("#tr-"+data.monedaid).append(td1,td2,td3);

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

    var codM = $('#Cod_moneda').val();
    var nomM = $('#Nom_moneda').val();
    var camM = $('#Cam_moneda').val();
    var idM = $("#Id_moneda").val();
    var p = chequearFornatoNumero(camM);
    if(idM>=0){
        if (codM.length===0 || nomM.length===0){
            if (idioma == 0){
                swal("Ups!", "Recuerde el codigo y el nombre son obligatorios por lo que no deben estar vacíos.", "info");
            } else {
                swal("Ups!", "Code and name fields are mandatory.", "info");
            }
        }else if (codM.length>3 || nomM.length>10){
            if (idioma == 0){
                swal("Ups!", "Recuerde el codigo y el nombre deben tener máximo 3 y 10 caracteres respectivamente", "info");
            } else {
                swal("Ups!", "Code and name fields must have 3 and 10 characters maximum.", "info");   
            }
        }else if (camM.length=== 0){
            if (idioma == 0){
                swal("Ups!", "Por favor introduzca el valor para el cambio", "info");
            } else {
                swal("Ups!", "Introduce Change value please.", "info");   
            }
        }else if (!p){
            if (idioma == 0){
                swal("Ups!", "Formato de campo cambio erróneo", "info");
            } else {
                swal("Ups!", "Bad change field format.", "info");   
            }
        }else{
            if (idioma == 0){
                msj = "Seguro que desea modificar la moneda "+ codM +" ?";
            } else {
                msj = "Sure you want modify the currency "+codM+" ?";
            }
            swal({   
             title: "",
             text: msj,
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"
            },
             function(){
                $btn = $(this).button('loading')
                $('#processing-modal').modal('toggle');
                upd_mon(idM, nomM, codM, camM);
             });
        }
    }else{
        if (idioma == 0) {
            swal("Ups!","Por favor seleccionar la moneda a modificar previamente.","error");
        } else {
            swal("Ups!","Select a currency please.","error");    
        }
    }
})




//Resetear campos del formulario cuando se esconde
$('.modal:not(.modal-static)').on('hidden.bs.modal', function(){
    $(this).find('form')[0].reset();
});

//Tooltip de ayuda en que debe ingresar en el campo
$('#form-add-moneda [data-toggle="popover"]').popover({trigger: 'focus', placement: 'top'});

//Validar Campos del Formulario y agregar banco
$('#form-add-moneda').validate({
    submit: {
        settings: {
            inputContainer: '.field',
            clear: false,
            display: 'block',
            insertion: 'prepend'
        },
        callback: {
            onBeforeSubmit: function (node) {

                $("#add-moneda-modal").modal("toggle");
                $('#processing-modal').modal('toggle');
                $(node).find('input:not([type="submit"]), select, textarea').attr('readonly', 'true');

            },
            onSubmit: function (node) {

                var $btn = $('#addButton').button('loading')
                
                function add_moneda(monedaCod, monedaNom, monedaCam){
                    $.ajax({
                        type:"POST",
                        url: "/admin/monedas/",
                        data: {"moncod": monedaCod, "monnom": monedaNom, "moncam": monedaCam, "action": "add"},
                        success: function(data){
                            var a_idaux = $("#Id_moneda").val();

                            if (data.creado){
                                    $("#Cod_moneda").val(data.moncod);
                                    $("#Nom_moneda").val(data.monnom);
                                    $("#Cam_moneda").val(data.moncam);
                                    $("#Id_moneda").val(data.monedaid);
                                    $(".moneda-detalle").show();

                                var td1 = '<td>'+ '<a href="/admin/moneda/'+ data.monedaid + '" nombre ="' + data.monnom + '" id="'+ data.monedaid + '" codigo = "' + data.moncod + '" cambio = "' + data.moncam + '" type="moneda">' + data.moncod + '</a></td>';

                                var td2 = '<td>' + data.monnom + '</td>';

                                var td3 = '<td>' + data.moncam + '</td>';


                                $('#table-mon> tbody').append('<tr id ="tr-'+data.monedaid+'"></tr>');

                                var jRow = $("#tr-"+data.monedaid).append(td1,td2,td3);

                                tabla.row.add(jRow).draw();
                                if (idioma == 0){
                                    msj = "Moneda agregada satisfactoriamente.";
                                    titulo = "Exito!";
                                } else {
                                    msj = "Sucessful aggregated currency.";
                                    titulo = "Success";
                                }
                                swal({   title: titulo,
                                         text: msj,
                                         type: "success",
                                         confirmButtonText: "Ok" });
                            }else{
                                if (idioma == 0){
                                    msj = "Ya esa Moneda existe en la Base de Datos";
                                } else {
                                    msj = "Currency alredy exist in data base.";
                                }
                                swal({   title: "",
                                         text: msj,
                                         type: "warning",
                                         confirmButtonText: "Ok" });
                                $("#Cod_moneda").val(data.moncod);
                                $("#Nom_moneda").val(data.monnom);
                                $("#Cam_moneda").val(data.moncam);
                                $("#Id_moneda").val(data.monedaid);
                                $(".moneda-detalle").show();
                            }

                            var a_id = $("#Id_moneda").val();
                            //Estilo de elemento elegido
                            $('#'+a_idaux).parent().css("background-color","")
                            $('#'+a_idaux).css("color","")
                            $('#'+a_id).parent().css("background-color","#337ab7")
                            $('#'+a_id).css("color","white")

                            $('#processing-modal').modal('toggle');
                            $btn.button('reset');

                            setTimeout(function(){
                                history.go(0);
                                window.location.href = window.location.href;
                            },1000);
                        },
                        error: function(jqXHR,error){
                            alert(jqXHR.responseText)
                            if (idioma == 0){
                                    msj = "Hubo un error, por favor verificar que los campos esten correctos e intente nuevamente.";
                                } else {
                                    msj = "Error occurred, verify fields and try again please.";
                                }
                            swal({   title: "",
                                     text: msj,
                                     type: "error",
                                     confirmButtonText: "Ok" });
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
                var codm_aux = $('#add-moneda-codigo').val();
                var nomm_aux = $('#add-moneda-nombre').val();
                var camm_aux = $('#add-moneda-cambio').val();
                add_moneda(codm_aux,nomm_aux,camm_aux);

                $('#form-add-moneda').trigger("reset").find('input:not([type="submit"]), select, textarea').removeAttr('readonly');

            }
        }
    },
});