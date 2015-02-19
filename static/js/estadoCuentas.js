//idioma_tr es una variable global definida en la pagina
var t_conta = iniciar_tabla(idioma_tr,'conta');
var t_corr = iniciar_tabla(idioma_tr, 'corr');
var csrftoken = $.cookie('csrftoken');

function iniciar_tabla(idioma,origen){

    if (idioma==="es"){

        return $('#table-'+ origen).DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "columns": [
                { "width": "16%" },
                null,
                null,
                null,
                null,
                null
              ],
            "order": [[ 2, "desc" ]]
        })

    }else if (idioma==="en"){

        return $('#table-'+ origen).DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "columns": [
                { "width": "16%" },
                null,
                null,
                null,
                null,
                null
              ],
            "order": [[ 2, "desc" ]]
        })
    };
};

function est_cuenta(cuentaId){
    $.ajax({
        type:"POST",
        url: "/cuentas/estado",
        data: {"cuentaid": cuentaId},
        success: function(data){
            var carg = 0;
            var proc = 1;

            var json_data = jQuery.parseJSON(data)
            if (json_data[carg].length<1){
                alert("cargados esta vacio")
            }else{

            }

            if (json_data[proc].length<1){
                alert("procesados esta vacio")
            }else{

                var bank = json_data[proc][0].fields.cuenta_idcuenta;
                var bankcod = $('#opt-'+bank).html();

                for (var i = 0; i < json_data[proc].length; i++) {

                    var date_ini = new Date(json_data[proc][i].fields.fecha_inicial)
                    var date_fin = new Date(json_data[proc][i].fields.fecha_final)
                    var cod = json_data[proc][i].fields.codigo

                    var td1 = '<td>'+ '<a id="'+ cod +'">' + bankcod + '</a></td>';
                    var td2 = '<td> procesado </td>';
                    var td3 = '<td>' + json_data[proc][i].fields.codigo + '</td>';
                    var td4 = '<td>' + json_data[proc][i].fields.pagina + '</td>';
                    var td5 = '<td>' + json_data[proc][i].fields.m_finicial + ' '+ json_data[proc][i].fields.c_dinicial + ' '+ date_ini.toLocaleDateString() + ' ' + json_data[proc][i].fields.balance_inicial +'</td>';
                    var td6 = '<td>' + json_data[proc][i].fields.m_ffinal + ' '+ json_data[proc][i].fields.c_dfinal + ' '+ date_fin.toLocaleDateString() + ' ' + json_data[proc][i].fields.balance_final +'</td>';



                    if (json_data[proc][i].fields.origen == "L"){
                        $('#table-conta > tbody').append('<tr id ="tr-'+cod+'"></tr>');
                        var jRow = $("#tr-"+cod).append(td1,td2,td3,td4,td5,td6);
                        t_conta.row.add(jRow).draw();
                    }else{
                        $('#table-corr > tbody').append('<tr id ="tr-'+cod+'"></tr>');
                        var jRow = $("#tr-"+cod).append(td1,td2,td3,td4,td5,td6);
                        t_corr.row.add(jRow).draw();
                    }
                }
                alert("agregados satisfactoriamente.");
            }
        },
        error: function(error){
            alert("Hubo un error buscando las cuentas especificadas")
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}

