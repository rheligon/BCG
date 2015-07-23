var csrftoken = $.cookie('csrftoken');
var tabla_det = iniciar_tabla_detalle(idioma_tr);
var fechaDesde = "";
var fechaHasta = "";
var narrativas = []; //Para almacenar las narrativas
var largo = 0; //Para almacenar el largo de los mensajes filtrados
var botonNarrativa = "" //Para almacenar el id de cada boton de ver narrativa

//inicializar la tabla de destalles
function iniciar_tabla_detalle(idioma){

    if (idioma==="es"){

        return $('#table-detalle').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            //"scrollY": "200px",
            //"dom": "frtiS",
            //"scrollCollapse": true,
            "pageLength": 5,
            "lengthMenu": [5, 10, 25, 50, 75, 100 ],
            "paging": true,
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
            //"scrollY": "200px",
            //"dom": "frtiS",
            //"scrollCollapse": true,
            "pageLength": 5,
            "lengthMenu": [5, 10, 25, 50, 75, 100 ],
            "paging": true,
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



// Para esconder los div de crear y cargar la primera vez que se entra a la vista
if($('#buscar-cb:checked')){
    document.getElementById("MT99-crear").style.display = "none";
    document.getElementById("MT99-cargar").style.display = "none";
    document.getElementById("MT99-cargar").style.display = "none";
    document.getElementById("MT99-verDetalle").style.display = "none";
    document.getElementById("MT99-buscar").style.display = "block";
}

//Mostrar div de opciones dependiendo del filtro (buscar, crear o cargar MT)
$('.cbfilter1').on('click', function(){

    var idaux = $(this).attr('id').split('-')[0];
    var id = '#MT99-'+idaux;

    if (idaux==='buscar'){

        document.getElementById("MT99-crear").style.display = "none";
        document.getElementById("MT99-cargar").style.display = "none";
        document.getElementById("MT99-verDetalle").style.display = "none";
        document.getElementById("MT99-buscar").style.display = "block";
    }

    if (idaux==='crear'){
        document.getElementById("MT99-buscar").style.display = "none";
        document.getElementById("MT99-cargar").style.display = "none";
        document.getElementById("MT99-verDetalle").style.display = "none";
        document.getElementById("MT99-crear").style.display = "block";
    }

    if (idaux==='cargar'){
        
        document.getElementById("MT99-buscar").style.display = "none";
        document.getElementById("MT99-crear").style.display = "none";
        document.getElementById("MT99-verDetalle").style.display = "none";
        document.getElementById("MT99-cargar").style.display = "block";
    }

});

//Boton para buscar MTx99
$('#confButton').on('click', function () {
    var banco = $('#mtx99_banco').val()
    var tipo = $('#mtx99_tipo').val()
    
    if (banco===("-1")){
        swal("Ups!","Debe seleccionar un banco.","error");        
    }else if (tipo===("-1")){
        swal("Ups!","Debe seleccionar una categoría.","error");
    } else {
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
    };
});

//Buscar todos los MTx99 del banco y tipo seleccionados
function buscarmtx99(banco,tipo,fechaArray){
    $.ajax({
        type:"POST",
        url: "/mtn99/",
        data: {"banco99":banco, "tipo99":tipo, "action":"buscar", "fechaDesde99":fechaDesde, "fechaHasta99":fechaHasta},
        success: function(data){
            narrativas = []; //Cada vez que se busque hay que inicializar el arreglo en vacio
            tabla_det.clear().draw();
            var json_data = jQuery.parseJSON(data.mens);
            largo = json_data.length;
            console.log(json_data);
            for (var i=0; i<json_data.length; i++){

                var aux = json_data[i].fields.fecha.substring(0,10);
                var res = aux.split("-");
                var fin = res[2].concat("/").concat(res[1]).concat("/").concat(res[0]);
                var org="";

                //Para ver si son mensajes enviados o recibidos
                if (json_data[i].fields.origen === 0 || json_data[i].fields.origen === "0" ){
                    org = "E"
                } else {
                    org = "R"
                };
                
                //Se construyen las filas de la tabla con la información pertinente
                var td1 = '<td>' + org + '</td>';
                var td2 = '<td>' + json_data[i].fields.bic + '</td>';
                var td3 = '<td>' + fin + '</td>';
                var td4 = '<td>' + json_data[i].fields.tipo_mt + '</td>';
                var td5 = '<td>' + json_data[i].fields.codigo + '</td>';
                var td6 = '<td>' + json_data[i].fields.ref_relacion + '</td>';
                var td7 = '<td>' + '<a class="btn btn-default btn-xs"  role="button" id="verNarrativa-'+i+'"><span class="glyphicon glyphicon-search" aria-hidden="true"></span>Ver</a>' + '</td>';
                narrativas.push(json_data[i].fields.narrativa);
                

                $('#table-detalle > tbody').append('<tr class="text-center" id ="tr-'+json_data[i].pk+"-"+i+'"></tr>');
                var jRow = $("#tr-"+json_data[i].pk+"-"+i).append(td1,td2,td3,td4,td5,td6,td7);
                tabla_det.row.add(jRow);

            }
            console.log(narrativas);
            tabla_det.draw();
            verDetalle();
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

//Para mostrar la narrativa
function verDetalle(){
    
    for (var i=0; i<largo; i++){

        botonNarrativa = '#'+'verNarrativa-'+i
        var aux = i;
        $(botonNarrativa).on('click', function () {

            document.getElementById("MT99-buscar").style.display = "none";
            document.getElementById("MT99-crear").style.display = "none";
            document.getElementById("MT99-cargar").style.display = "none";

            $(".content .value").html(narrativas[aux]);
            document.getElementById("MT99-verDetalle").style.display = "block";

            //$('.results').html(narrativas[i]);
        });    

    }
}

//Para regresar desde la vista de las narrativas
$('#regresarMTButton').on('click', function () {

    document.getElementById("MT99-verDetalle").style.display = "none";
    document.getElementById("MT99-crear").style.display = "none";
    document.getElementById("MT99-cargar").style.display = "none";
    document.getElementById("MT99-buscar").style.display = "block";

});    

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


//Boton para crear MTx99
$('#crearMTButton').on('click', function () {
    var banco = $('#mtx99crear_banco').val()
    var tipo = $('#mtx99crear_tipo').val()
    var ref_mensaje = $('#refmensaje').val()
    var ref_mensaje_original = $('#refmensajeoriginal').val()
    var narrativa = $('#narrativa').val()
    
    if (banco===("-1")){
        swal("Ups!","Debe seleccionar un banco.","error");        
    }else if (tipo===("-1")){
        swal("Ups!","Debe seleccionar una categoría.","error");
    }else if (ref_mensaje.length===0){
        swal("Ups!","Debe colocar la referencia.","error");
    }else if(ref_mensaje_original.length===0){
        swal("Ups!","Debe colocar la referencia del mensaje original","error");
    }else if(narrativa.length===0 ){
        swal("Ups!","Debe colocar la narrativa","error");
    }else{

        $('#processing-modal').modal('toggle');
    
        //Llamar funcion de creación del mensaje
        agregarmtx99(banco,tipo,ref_mensaje,ref_mensaje_original,narrativa);
    };
});

//Crear mensajes MT99
function agregarmtx99(banco,tipo,ref_mensaje,ref_mensaje_original, narrativa){
    $.ajax({
        type:"POST",
        url: "/mtn99/",
        data: {"banco99":banco, "tipo99":tipo, "action":"crear", "ref_mensaje99":ref_mensaje, "ref_mensaje_original99":ref_mensaje_original, "narrativa99":narrativa},
        success: function(data){
            $('#processing-modal').modal('toggle');
            swal("OK", "Mensaje agregado exitosamente", "success");
            $('#mtx99crear_banco').val("--------------");
            $('#mtx99crear_tipo').val("---");
            $('#refmensaje').val("");
            $('#refmensajeoriginal').val("");
            $('#narrativa').val("");

        },
        error: function(jqXHR, error){ 
            console.log("esta dando error")
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error al intertar crear el mensaje", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}

//Boton para cargar MTx99
$('#cargarMTButton').on('click', function () {
    var archivo = $('#mtx99_archivo').val()

    if (archivo===("-1")){
        swal("Ups!","Debe seleccionar un archivo para cargar datos.","error");        
    } else {
        
        $('#processing-modal').modal('toggle');
    
        //Llamar funcion de cargar del mensaje
        cargarmtx99(archivo);
    }

});

//Cargar mensajes desde archivo
function cargarmtx99(archivo){
    $.ajax({
        type:"POST",
        url: "/mtn99/",
        data: {"action":"cargar", "archivo99":archivo},
        success: function(data){
            var mensaje = data.mens;
            if (mensaje === "Caracter inesperado en archivo"){

                $('#processing-modal').modal('toggle');
                swal("Ups", "Caracter inesperado en archivo", "error");

            } else {
                $('#processing-modal').modal('toggle');
                swal("OK", "Archivo cargado exitosamente", "success");
            }
        },
        error: function(jqXHR, error){ 
            console.log("esta dando error")
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error al cargar el archivo", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}

 