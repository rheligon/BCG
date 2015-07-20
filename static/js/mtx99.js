var csrftoken = $.cookie('csrftoken');
var tabla_det = iniciar_tabla_detalle(idioma_tr);
var fechaDesde = "";
var fechaHasta = "";

//inicializar la tabla de destalles
function iniciar_tabla_detalle(idioma){

    if (idioma==="es"){

        return $('#table-detalle').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "scrollY": "200px",
            "dom": "frtiS",
            "scrollCollapse": true,
            "paging": false,
            "autoWidth": false,
            "columns": [
                { "width": "5%" },
                { "width": "10%" },
                { "width": "25%" },
                { "width": "5%" },
                { "width": "23%" },
                { "width": "23%" },
                { "width": "9%" },
              ],
        })

    }else if (idioma==="en"){

        return $('#table-detalle').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "scrollY": "200px",
            "dom": "frtiS",
            "scrollCollapse": true,
            "paging": false,
            "autoWidth": false,
            "columns": [
                 { "width": "5%" },
                { "width": "10%" },
                { "width": "25%" },
                { "width": "5%" },
                { "width": "23%" },
                { "width": "23%" },
                { "width": "9%" },
              ],
        })
    };
}

//Boton para buscar MTx99
$('#confButton').on('click', function () {
    var banco = $('#mtx99_banco').val()
    var tipo = $('#mtx99_tipo').val()
    $('#processing-modal').modal('toggle');
    
    //Checkear los filtros
    $('.cbfilter:checked').each(function(){
        var idaux = $(this).attr('id').split('-')[0];
        var id = '#filter-'+idaux;

        if (idaux==='fecha'){
            var fd = "";
            var fh = "";

            //si se escogió una fecha limite inferior
            if ($('#f-desde').val() != ""){
                fd = $('#f-desde').val();    
            }
            // en caso contrario se toma la fecha actual 
            else {
                var auxdate = new Date();
                var dd = auxdate.getDate();
                var mm = auxdate.getMonth()+1; //January is 0!
                var yyyy = auxdate.getFullYear()-10;

                if(dd<10) {
                    dd='0'+dd
                } 

                if(mm<10) {
                    mm='0'+mm
                } 

                auxdate = dd+'/'+mm+'/'+yyyy;
                fd = auxdate;    
            }

            //si se escogió una fecha limite superior
            if ($('#f-hasta').val() != ""){
                fh = $('#f-hasta').val();    
            }
            // en caso contrario se toma la fecha actual 
            else {
                var today = new Date();
                var dd = today.getDate()+1;
                var mm = today.getMonth()+1; //January is 0!
                var yyyy = today.getFullYear();

                if(dd<10) {
                    dd='0'+dd
                } 

                if(mm<10) {
                    mm='0'+mm
                } 

                today = dd+'/'+mm+'/'+yyyy;
                fh = today;    
            }

            fechaDesde = fd;
            fechaHasta = fh;
        }

    });

      //Llamar funcion de busqueda
    buscarmtx99(banco,tipo,fechaDesde,fechaHasta);
});

//Buscar todos los MTx99 del banco y tipo seleccionados
function buscarmtx99(banco,tipo,fechaArray){
    $.ajax({
        type:"POST",
        url: "/mtx99/",
        data: {"banco99":banco, "tipo99":tipo, "action":"buscar", "fechaDesde99":fechaDesde, "fechaHasta99":fechaHasta},
        success: function(data){
            tabla_det.clear().draw();
            var json_data = jQuery.parseJSON(data.mens);
            console.log(json_data)
            for (var i=0; i<json_data.length; i++){

                var aux = json_data[i].fields.fecha.substring(0,10);
                var res = aux.split("-");
                var fin = res[2].concat("/").concat(res[1]).concat("/").concat(res[0]);
    
                var td1 = '<td>' + json_data[i].fields.origen + '</td>';
                var td2 = '<td>' + json_data[i].fields.bic + '</td>';
                var td3 = '<td>' + fin + '</td>';
                var td4 = '<td>' + json_data[i].fields.tipo_mt + '</td>';
                var td5 = '<td>' + json_data[i].fields.codigo + '</td>';
                var td6 = '<td>' + json_data[i].fields.ref_relacion + '</td>';
                var td7 = '<td>' + json_data[i].fields.narrativa + '</td>';

                $('#table-detalle > tbody').append('<tr class="text-center" id ="tr-'+json_data[i].pk+"-"+i+'"></tr>');
                var jRow = $("#tr-"+json_data[i].pk+"-"+i).append(td1,td2,td3,td4,td5,td6,td7);
                tabla_det.row.add(jRow);

            }
            tabla_det.draw();
            $('#processing-modal').modal('toggle');
        },
        error: function(jqXHR, error){ 
            console.log("esta dando error")
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error procesando la búsqueda", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}

//Cambiar el idioma del date picker a español si este es el seleccionado
if (idioma_tr==="es"){
    $.extend($.fn.pickadate.defaults, {
      monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      today: 'Hoy',
      clear: 'Limpiar',
      close: 'Cerrar',
    });
}

//Inicializar el DatePicker
$('#f-desde').pickadate({
  format: 'd/m/yyyy',
  formatSubmit:'d/m/yyyy',
  selectYears: true,
  selectMonths: true,
})

//Inicializar el DatePicker
$('#f-hasta').pickadate({
  format: 'd/m/yyyy',
  formatSubmit:'d/m/yyyy',
  selectYears: true,
  selectMonths: true,
})

//Mostrar o esconder filtros elegidos
$('.cbfilter').on('click', function(){

    $('#filter-div').show();
    $('#filter-div > div').hide();

    var idaux = $(this).attr('id').split('-')[0];
    var id = '#filter-'+idaux;

    if (!this.checked){
        document.getElementById('f-desde').value = "";
        document.getElementById('f-hasta').value = "";
        fechaDesde = "";
        fechaHasta = "";
        $(id).hide();
        $('#filter-div').hide();

    }else{
        $(id).show();
    }
});
 