var csrftoken = $.cookie('csrftoken');

$('#mostrar_info').on('click', function () {
      tipo = $('#mostrar_info').attr("valor")
      mensaje = $('#mostrar_info').attr("mensaje")
      console.log(tipo)
      console.log(mensaje.idmt103)
      
      $('#cuerpo').append("<p>sadfsdfdsf</p>"); 
    });