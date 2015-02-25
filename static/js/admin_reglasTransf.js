//idioma_tr es una variable global definida en la pagina
var tabla = iniciar_tabla(idioma_tr);
var csrftoken = $.cookie('csrftoken');

function iniciar_tabla(idioma){

    if (idioma==="es"){

        return $('#table-reglas').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "dom": 'rt<"col-md-6"li><"col-md-6"fp>'
        })

    }else if (idioma==="en"){

        return $('#table-reglas').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "dom": 'rt<"col-md-6"li><"col-md-6"fp>'
        })
    };
};

//Cuando cambie el selector se deben cargar las reglas de la cuenta especificada
$('#Cuenta-sel').change(function() {
  var cuentaId = $('#Cuenta-sel').val();

  if (cuentaId>=0){
    var sel = $('#opt-'+cuentaId);

    tabla.clear().draw();
    $('#processing-modal').modal('toggle');
    reglas(cuentaId);
  }else{
    $("#Id-regla").val(0);
    $('#nom-regla').val("");
    $('#sel-tipo-regla').val(0);
    $('#trans-conta').val("");
    $('#sel-ref-conta').val(0);
    $('#masc-conta').val("");

    $('#trans-corr').val("");
    $('#sel-ref-corr').val(0);
    $('#masc-corr').val("");
    tabla.clear().draw();
  }
});

//Resaltar al hacer click en la regla
$('.table').on('click','a[type=regla]', function(event) {
    event.preventDefault();

    //Estilo de elemento elegido
    var a_id = $("#Id-regla").val();
    $('#'+a_id).parent().css("background-color","");
    $('#'+a_id).css("color","");
    $(this).parent().css("background-color","#337ab7");
    $(this).css("color","white");

    //asignacion de elemento seleccionado
    $("#Id-regla").val($(this).attr("id"));

    //Asignacion de campos segun el elemento elegido
    $('#nom-regla').val($(this).attr("nombre"));
    $('#sel-tipo-regla').val($(this).attr("tipo"));

    $('#trans-conta').val($(this).attr("trans_conta"));
    $('#sel-ref-conta').val($(this).attr("ref_conta"));
    $('#masc-conta').val($(this).attr("masc_conta"));

    $('#trans-corr').val($(this).attr("trans_corr"));
    $('#sel-ref-corr').val($(this).attr("ref_corr"));
    $('#masc-corr').val($(this).attr("masc_corr"));


});

//Modificar Regla
$('#updButton').on('click', function () {
    var $btn;
    function upd_regla(reglaid, nombre, tipo, transconta, transcorr, selrefconta, selrefcorr, mascconta, masccorr){
        $.ajax({
            type:"POST",
            url: "/admin/reglas_transf/",
            data: {"reglaid": reglaid, "nombre": nombre, "tipo": tipo, "transconta": transconta, "transcorr": transcorr, "selrefconta": selrefconta, "selrefcorr": selrefcorr, "mascconta": mascconta, "masccorr": masccorr, "action": 'upd'},
            success: function(data){
                if (data.modif){
                    var a_id = data.reglaid;
                    var a_nom = data.nombre;
                    var a_masc_conta = data.mascconta;
                    var a_masc_corr = data.masccorr;
                    var a_ref_conta = data.selrefconta;
                    var a_ref_corr = data.selrefcorr;
                    var a_trans_conta = data.transconta;
                    var a_trans_corr = data.transcorr;
                    var a_tipo = data.tipo;

                    var td1 = '<td>'+ '<a id="'+ a_id +'" type="regla" masc_conta="'+ a_masc_conta + '" masc_corr="' + a_masc_corr + '" nombre="' + a_nom + '" ref_conta="' + a_ref_conta + '" ref_corr="'+ a_ref_corr + '" tipo="'+ a_tipo + '" trans_conta="'+ a_trans_conta + '" trans_corr="'+ a_trans_corr +'">' + a_nom + '</a></td>';
                    var td2 = '<td>'+ a_tipo + '</td>';
                    var td3 = '<td>'+ a_trans_conta + '</td>';
                    var td4 = '<td>'+ a_ref_conta + '</td>';
                    var td5 = '<td>'+ a_masc_conta + '</td>';
                    var td6 = '<td>'+ a_trans_corr + '</td>';
                    var td7 = '<td>'+ a_ref_corr + '</td>';
                    var td8 = '<td>'+ a_masc_corr + '</td>';

                    tabla.row($('#tr-'+ a_id)).remove().draw();
                    $('#table-reglas > tbody').append('<tr id ="tr-'+a_id+'"></tr>');
                    var jRow = $("#tr-"+a_id).append(td1,td2,td3,td4,td5,td6,td7,td8);
                    tabla.row.add(jRow).draw();

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
                swal("Ups!", "Hubo un error modificando la regla especificada.", "error");
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    var cuenta_id = $("#Cuenta-sel").val();
    var a_nom = $('#nom-regla').val();
    var a_sel_tipo = $('#sel-tipo-regla').val();

    var a_trans_conta = $('#trans-conta').val();
    var a_ref_conta = $('#sel-ref-conta').val();
    var a_masc_conta = $('#masc-conta').val();

    var a_trans_corr = $('#trans-corr').val();
    var a_ref_corr = $('#sel-ref-corr').val();
    var a_masc_corr = $('#masc-corr').val();

    swal({   title: "",
             text: "Seguro que desea modificar la regla "+ a_nom +" ?",
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"},
             function(){
                $btn = $(this).button('loading');
                $('#processing-modal').modal('toggle');
                if (cuenta_id<0){
                    swal("Ups!", "Acuerdese de seleccionar una cuenta primero", "error");
                }else{
                upd_regla($("#Id-regla").val(), a_nom, a_sel_tipo, a_trans_conta, a_trans_corr, a_ref_conta, a_ref_corr, a_masc_conta, a_masc_corr);
                }
             }
             );
})

//Eliminar Regla
$('#delButton').on('click', function () {
    var $btn;
    function del_regla(reglaid){
        $.ajax({
            type:"POST",
            url: "/admin/reglas_transf/",
            data: {"reglaid": reglaid, "action": 'del'},
            success: function(data){
                if (data.elim){
                    tabla.row($('#tr-'+ data.reglaid)).remove().draw();
                    
                    $("#Id-regla").val(0);
                    $('#nom-regla').val("");
                    $('#sel-tipo-regla').val(0);
                    $('#trans-conta').val("");
                    $('#sel-ref-conta').val(0);
                    $('#masc-conta').val("");

                    $('#trans-corr').val("");
                    $('#sel-ref-corr').val(0);
                    $('#masc-corr').val("");

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
                swal("Ups!", "Hubo un error modificando la regla especificada.", "error");
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    var cuenta_id = $('#Cuenta-sel').val();
    var a_nom = $('#nom-regla').val();

    swal({   title: "",
             text: "Seguro que desea eliminar la regla "+ a_nom +" ?",
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"},
             function(){
                $btn = $(this).button('loading');
                $('#processing-modal').modal('toggle');
                if (cuenta_id<0){
                    swal("Ups!", "Acuerdese de seleccionar una cuenta primero", "error");
                }else{
                del_regla($("#Id-regla").val());
                }
             }
             );
})

//Resetear campos del formulario cuando se esconde
$('.modal:not(.modal-static)').on('hidden.bs.modal', function(){
    $(this).find('form')[0].reset();
});

//Tooltip de ayuda en que debe ingresar en el campo
$('#form-add-regla [data-toggle="popover"]').popover({trigger: 'focus', placement: 'top'});

//Validar Campos del Formulario y agregar banco
$('#form-add-regla').validate({
    submit: {
        settings: {
            inputContainer: '.field',
            clear: false,
            display: 'block',
            insertion: 'prepend'
        },
        callback: {
            onBeforeSubmit: function (node) {


                $("#add-regla-modal").modal("toggle");
                $('#processing-modal').modal('toggle');
                $(node).find('input:not([type="submit"]), select, textarea').attr('readonly', 'true');

            },
            onSubmit: function (node) {

                var $btn = $('#addButton').button('loading')
                
                function add_regla(cuentaid, nombre, tipo, transconta, transcorr, selrefconta, selrefcorr, mascconta, masccorr){
                    $.ajax({
                        type:"POST",
                        url: "/admin/reglas_transf/",
                        data: {"cuentaid": cuentaid, "nombre": nombre, "tipo": tipo, "transconta": transconta, "transcorr": transcorr, "selrefconta": selrefconta, "selrefcorr": selrefcorr, "mascconta": mascconta, "masccorr": masccorr, "action": 'add'},
                        success: function(data){
                            if (data.add){
                                var a_id = data.reglaid
                                var a_nom = data.nombre
                                var a_masc_conta = data.masccont
                                var a_masc_corr = data.masccorr
                                var a_ref_conta = data.selrefconta
                                var a_ref_corr = data.selrefcorr
                                var a_trans_conta = data.transconta
                                var a_trans_corr = data.transcorr
                                var a_tipo = data.tipo

                                var td1 = '<td>'+ '<a id="'+ a_id +'" type="regla" masc_conta="'+ a_masc_conta + '" masc_corr="' + a_masc_corr + '" nombre="' + a_nom + '" ref_conta="' + a_ref_conta + '" ref_corr="'+ a_ref_corr + '" tipo="'+ a_tipo + '" trans_conta="'+ a_trans_conta + '" trans_corr="'+ a_trans_corr +'">' + a_nom + '</a></td>';
                                var td2 = '<td>'+ a_tipo + '</td>';
                                var td3 = '<td>'+ a_trans_conta + '</td>';
                                var td4 = '<td>'+ a_ref_conta + '</td>';
                                var td5 = '<td>'+ a_masc_conta + '</td>';
                                var td6 = '<td>'+ a_trans_corr + '</td>';
                                var td7 = '<td>'+ a_ref_corr + '</td>';
                                var td8 = '<td>'+ a_masc_corr + '</td>';

                                $('#table-reglas > tbody').append('<tr id ="tr-'+a_id+'"></tr>');
                                var jRow = $("#tr-"+a_id).append(td1,td2,td3,td4,td5,td6,td7,td8);
                                tabla.row.add(jRow);

                                //Asignacion a los detalles
                                $('#Id-regla').val(a_id);
                                $('#nom-regla').val(a_nom);
                                $('#sel-tipo-regla').val(a_tipo);

                                $('#trans-conta').val(a_trans_conta);
                                $('#sel-ref-conta').val(a_ref_conta);
                                $('#masc-conta').val(a_masc_conta);

                                $('#trans-corr').val(a_trans_corr);
                                $('#sel-ref-corr').val(a_ref_corr);
                                $('#masc-corr').val(a_masc_corr);

                                swal({   title: "",
                                         text: data.msg,
                                         type: "success",
                                         confirmButtonText: "Ok" });

                            }else{
                                swal({   title: "",
                                         text: data.msg,
                                         type: "warning",
                                         confirmButtonText: "Ok" });
                            }
                            $('#processing-modal').modal('toggle');
                            $btn.button('reset');
                        },
                        error: function(jqXHR, error){
                            alert(jqXHR.responseText) //debug
                            swal({   title: "Ups!",
                                         text: "Hubo un error, por favor verificar que los campos esten correctos e intente nuevamente.",
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

                var a_nom = $('#add-regla-nombre').val();
                var a_sel_tipo = $('#add-regla-tipo').val();

                var a_trans_conta = $('#add-regla-trancont').val();
                var a_ref_conta = $('#add-regla-refcont').val();
                var a_masc_conta = $('#add-regla-masccont').val();

                var a_trans_corr = $('#add-regla-trancorr').val();
                var a_ref_corr = $('#add-regla-refcorr').val();
                var a_masc_corr = $('#add-regla-masccorr').val();

                var cuenta_id = $('#Cuenta-sel').val();

                if (cuenta_id<0){
                    swal("Ups!", "Acuerdese de seleccionar una cuenta primero", "error");
                }else{
                add_regla(cuenta_id, a_nom, a_sel_tipo, a_trans_conta, a_trans_corr, a_ref_conta, a_ref_corr, a_masc_conta, a_masc_corr);
                }
                $('#form-add-regla').trigger("reset").find('input:not([type="submit"]), select, textarea').removeAttr('readonly');

            }
        }
    },
});

//Rellenar pagina de acuerdo a la seleccion
function reglas(cuentaId){
    $.ajax({
        type:"POST",
        url: "/admin/reglas_transf/",
        data: {"cuentaid": cuentaId, "action": 'sel'},
        success: function(data){
            var json_data = jQuery.parseJSON(data);
            for (var i = 0; i < json_data.length; i++) {
                var a_id = json_data[i].pk
                var a_nom = json_data[i].fields.nombre
                var a_masc_conta = json_data[i].fields.mascara_contabilidad
                var a_masc_corr = json_data[i].fields.mascara_corresponsal
                var a_ref_conta = json_data[i].fields.ref_contabilidad
                var a_ref_corr = json_data[i].fields.ref_corresponsal
                var a_trans_conta = json_data[i].fields.transaccion_contabilidad
                var a_trans_corr = json_data[i].fields.transaccion_corresponsal
                var a_tipo = json_data[i].fields.tipo

                var td1 = '<td>'+ '<a id="'+ a_id +'" type="regla" masc_conta="'+ a_masc_conta + '" masc_corr="' + a_masc_corr + '" nombre="' + a_nom + '" ref_conta="' + a_ref_conta + '" ref_corr="'+ a_ref_corr + '" tipo="'+ a_tipo + '" trans_conta="'+ a_trans_conta + '" trans_corr="'+ a_trans_corr +'">' + a_nom + '</a></td>';
                var td2 = '<td>'+ a_tipo + '</td>';
                var td3 = '<td>'+ a_trans_conta + '</td>';
                var td4 = '<td>'+ a_ref_conta + '</td>';
                var td5 = '<td>'+ a_masc_conta + '</td>';
                var td6 = '<td>'+ a_trans_corr + '</td>';
                var td7 = '<td>'+ a_ref_corr + '</td>';
                var td8 = '<td>'+ a_masc_corr + '</td>';

                $('#table-reglas > tbody').append('<tr id ="tr-'+a_id+'"></tr>');
                var jRow = $("#tr-"+a_id).append(td1,td2,td3,td4,td5,td6,td7,td8);
                tabla.row.add(jRow);

                if (i===0){
                    //Que se haga en la primera iteración solamente
                    $('#Id-regla').val(a_id);
                    $('#nom-regla').val(a_nom);
                    $('#sel-tipo-regla').val(a_tipo);

                    $('#trans-conta').val(a_trans_conta);
                    $('#sel-ref-conta').val(a_ref_conta);
                    $('#masc-conta').val(a_masc_conta);

                    $('#trans-corr').val(a_trans_corr);
                    $('#sel-ref-corr').val(a_ref_corr);
                    $('#masc-corr').val(a_masc_corr);
                }   

            };
            tabla.draw();
            $('#processing-modal').modal('toggle');
        },
        error: function(jqXHR, error){
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error buscando la cuenta especificada.", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};