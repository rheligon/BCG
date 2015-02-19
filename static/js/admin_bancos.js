//idioma_tr es una variable global definida en la pagina
var tabla = iniciar_tabla(idioma_tr);
var csrftoken = $.cookie('csrftoken');


function iniciar_tabla(idioma){

    if (idioma==="es"){

        return $('#table-bancos').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            }
        })

    }else if (idioma==="en"){

        return $('#table-bancos').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            }
        })
    };
};

//Eliminar Banco
$('#delButton').on('click', function () {
    var $btn;
   
    function del_banc(bancoId){
        $.ajax({
            type:"POST",
            url: "/admin/bancos/",
            data: {"bancoid": bancoId, "action": "del"},
            success: function(data){
                alert(data.msg);

                if (data.elim){
                    tabla.row($('#tr-'+ data.bancoid)).remove().draw();
                    $(".banco-detalle").hide();
                }

                $btn.button('reset')
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    if (confirm("Seguro que desea eliminar el banco?")){
        $btn = $(this).button('loading')
        del_banc($("#Id_banco").val());
    }
})

//Mostrar Detalle al hacer click en código de banco
$('#table-bancos').on('click','a[type=banco]', function(event) {
    event.preventDefault();
    var a_nom = $(this).attr("nombre");
    var a_cod = $(this).attr("codigo");
    var a_id = $(this).attr("id");
    $("#Cod_banco").val(a_cod);
    $("#Nom_banco").val(a_nom);
    $("#Id_banco").val(a_id);
    $(".banco-detalle").show();
});

//Resetear campos del formulario cuando se esconde
$('.modal').on('hidden.bs.modal', function(){
    $(this).find('form')[0].reset();
});

//Tooltip de ayuda en que debe ingresar en el campo
$('#form-add-bank [data-toggle="popover"]').popover({trigger: 'focus', placement: 'top'});

//Validar Campos del Formulario y agregar banco
$('#form-add-bank').validate({
    submit: {
        settings: {
            inputContainer: '.field',
            clear: false,
            display: 'block',
            insertion: 'prepend'
        },
        callback: {
            onBeforeSubmit: function (node) {


                $("#add-banco-modal").modal("toggle");
                $(node).find('input:not([type="submit"]), select, textarea').attr('readonly', 'true');

            },
            onSubmit: function (node) {

                var $btn = $('#addButton').button('loading')
                
                function add_banc(bancoCod, bancoNom){
                    $.ajax({
                        type:"POST",
                        url: "/admin/bancos/",
                        data: {"bancocod": bancoCod, "banconom": bancoNom, "action": "add"},
                        success: function(data){
                            if (data.creado){
                                $("#Cod_banco").val(data.bancoc);
                                $("#Nom_banco").val(data.bancon);
                                $("#Id_banco").val(data.bancoid);
                                $(".banco-detalle").show();

                                var td1 = '<td>'+ '<a href="/admin/bancos/'+ data.bancoid + '" nombre ="' + data.bancon + '" id="'+ data.bancoid + '" codigo = "' + data.bancoc + '" type="banco">' + data.bancoc + '</a></td>';

                                var td2 = '<td>' + data.bancon + '</td>';

                                $('#table-bancos > tbody').append('<tr id ="tr-'+data.bancoid+'"></tr>');

                                var jRow = $("#tr-"+data.bancoid).append(td1,td2);

                                tabla.row.add(jRow).draw();
                                alert("Banco agregado satisfactoriamente.");

                            }else{
                                alert("Ya ese Banco existe en la Base de Datos");
                                $("#Cod_banco").val(data.bancoc);
                                $("#Nom_banco").val(data.bancon);
                                $("#Id_banco").val(data.bancoid);
                                $(".banco-detalle").show();
                            }
                            
                            $btn.button('reset');
                        },
                        error: function(error){
                            alert("Hubo un error, por favor verificar que los campos esten correctos e intente nuevamente.")
                            $btn.button('reset');
                        },
                        dataType:'json',
                        headers:{
                            'X-CSRFToken':csrftoken
                        }
                    });
                    return false;
                }
                var codb_aux = $('#add-banco-codigo').val();
                var nomb_aux = $('#add-banco-nombre').val();
                add_banc(codb_aux,nomb_aux);

                $('#form-add-bank').trigger("reset").find('input:not([type="submit"]), select, textarea').removeAttr('readonly');

            }
        }
    },
});