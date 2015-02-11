$('#form-add-bank [data-toggle="popover"]').popover({trigger: 'focus', placement: 'top'});
    
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

                console.log('#' + node.attr("id") + ' has a submit override.');

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

                                var td1 = '<td>'+ '<a href="/admin/banco/'+ data.bancoid + '" nombre ="' + data.bancon + '" id="'+ data.bancoid + '" codigo = "' + data.bancoc + '" type="banco">' + data.bancoc + '</a></td>';

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