// PERFIL ==============================================================================================

function consultarUsuarioPerfil() {
    var id = sessionStorage.getItem("idUser");
    console.log(id)
    $.ajax({
        url: "http://129.151.125.93:8080/api/user/"+id,
        type: "GET",
        datatype: "JSON",
        success: function (responseusuario) {
            $("#miTablaPerfil").empty();
            mostrarTablaPerfil(responseusuario);
        }
    });
}

function mostrarTablaPerfil(responseusuario) {
    let rows = '<tr>';
        rows += '<th scope="row">' + responseusuario.identification + '</th>';
        rows += '<td>' + responseusuario.name + '</td>';
        rows += '<td>' + responseusuario.email + '</td>';
        switch(responseusuario.type){
            case 'COORD':
                rows += '<td>' + "Coordinador de zona" + '</td>';
                break;
            case 'ADM':
                rows += '<td>' + "Administrador" + '</td>';
                break;
            case 'ASE':
                rows += '<td>' + "Asesor Comercial" + '</td>';
                break;
            default:
                rows += '<td>' + "Perfil no definido" + '</td>';
                break;
        }
        rows += '<td>' + responseusuario.zone + '</td>';
        rows += '</tr>';

    $("#miTablaPerfil").append(rows);
}

// ORDENES DE PEDIDO ==============================================================================================

function consultarProductos(){
    $.ajax({
        url: "http://129.151.125.93:8080/api/clothe/all",
        type: "GET",
        datatype: "JSON",
        success: function (response) {
            $("#miTablaOrder").empty();
            mostrarTablaOrder(response);
            console.log(response);
        }
    });
}

function mostrarTablaOrder(response) {
    let rows = '<tr>';
    for(i = 0; i < response.length; i++){
        rows += '<td class="dt">' + "<img src='"+response[i].photography+"' width='50%' height='50px'>";
        rows += '<td class="dt">' + response[i].reference + '</th>';
        rows += '<td class="dt">' + response[i].category + '</td>';
        rows += '<td class="dt">' + response[i].size + '</th>';
        rows += '<td class="dt">' + response[i].description + '</td>';
        rows += '<td class="dt">' + response[i].price + '</td>';
        rows += '<td class="dt">' + "<input id='inputCantidad' type='number' class='form-control text-center' min='1' value='"+response[i].quantity+"'></input>";
        rows += '</tr>';
    }

    $("#miTablaOrder").append(rows);
}

function consultarOrder(){
    $.ajax({
        url: "http://129.151.125.93:8080/api/order/all",
        type: "GET",
        datatype: "JSON",
        success: function (responseorder) {
            mensajePedido(responseorder);
        }
    });
}


function guardarOrder(responseusuario, idAutoincrementable){
    var items = {};
    var itemsCan = {};
    var idAuto = 1;
    $("#miTablaOrder tr").each(function(e) {
        var itemsProducts = {};
        var itemsCantidad = {};

        var tds = $(this).find(".dt");

        itemsProducts.id = idAuto;
        itemsProducts.reference = tds.filter(":eq(1)").text();
        itemsProducts.category = tds.filter(":eq(2)").text();
        itemsProducts.availability = true;
        itemsProducts.quantity = 10;
        itemsProducts.photography = tds.filter(":eq(0)").text();;
        itemsProducts.size = tds.filter(":eq(3)").text();
        itemsProducts.description = tds.filter(":eq(4)").text();
        itemsProducts.price = parseInt(tds.filter(":eq(5)").text());
        itemsCantidad = parseInt($(this).find("td:eq(7)input[type='number']").val());

        items[idAuto] = itemsProducts;
        itemsCan[itemsProducts.reference] = itemsCantidad;
        idAuto = idAuto+1;
    });

    let datos = {
        id: idAutoincrementable,
        registerDay: new Date(),
        status: "Pendiente",
        salesMan: responseusuario,
        products: items,
        quantities: itemsCan,
    }
    console.log(datos);
    var dataToSend = JSON.stringify(datos);
    console.log(dataToSend);
    $.ajax({
        datatype: 'json',
        data: dataToSend,
        contentType: 'application/json',
        url: "http://129.151.125.93:8080/api/order/new",
        type: 'POST',
        success: function(response){
            console.log(response);
            $("#ventanaSolicitarOrder").modal("show");
        },
        error: function(){
            alert("Fallo la conexion con la Base de datos");
        }
    });
}

function mensajePedido(responseorder){
    $("#enviarOrder").empty();
    let mensaje = $("<p>");
    console.log(responseorder.length);
    for(i=0; i<=responseorder.length; i++){
        if(responseorder.length == 0){
            let confirmar = confirm("¿Estas seguro de enviar la orden?");
            if(confirmar){
                var idAutoincrementable = 1;
                mensaje.text("Orden guardada correctamente: El codigo de tu pedido es " + idAutoincrementable);
                $("#enviarOrder").append(mensaje);
                consultar(idAutoincrementable);
            }
        }else{
            confirmar = confirm("¿Estas seguro de enviar la orden?");
            if(confirmar){
                idAutoincrementable = responseorder.length + 1;
                mensaje.text("Orden guardada correctamente: El codigo de tu pedido es " + idAutoincrementable);
                $("#enviarOrder").append(mensaje);
                consultar(idAutoincrementable);

                break;
            }
            break;
        }
    }
}

$("#cerrarSesion").click(function(){
    sessionStorage.clear();
    location.href = "http://129.151.125.93/frontciclo4/index.html";
});


$(document).ready(function(){
    consultarUsuarioPerfil();
    consultarProductos();
});