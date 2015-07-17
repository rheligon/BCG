//Buscar MTx99
$('#confButton').on('click', function () {
    var banco = $('#mtx99_banco').val()
    var tipo = $('#mtx99_tipo').val()
    console.log(banco + " " + tipo)
   
    function buscarmtx99(banco,tipo){
        $.ajax({
            type:"POST",
            url: "/mtx99/",
            data: {"bancomtx99":banco, "tipometx99":tipo},
            success: function(data){
                console.log("aqui deberia ir")
                console.log(data.banco )
            },
            error: function(jqXHR, error){
                alert(jqXHR.responseText) //debug
                $('#processing-modal').modal('toggle');
            },
        });
        return false;
    }
     buscarmtx99(banco,tipo)
})