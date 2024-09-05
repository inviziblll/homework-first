<?php
// разрешаем CORS pfghjcs
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json; charset=utf-8');

$data = json_decode(file_get_contents('php://input'), 512);

// данные получаемые из формы регистрации
if ( ! trim($data['email']) || ! trim($data['password']) ) {
    echo json_encode([
        'error' => true,
        'message' => 'Вы заполнили не все поля формы!'
    ]);
    die();
}
else{
    $request = [];
    $request['email'] = htmlspecialchars(trim($data['email']));
    $request['password'] = htmlspecialchars(trim($data['password']));
}

$email = "russalex05@gmail.com";
$password = "77777777";

http_response_code(200);
if($email == $request['email'] && $password == $request['password']){
    echo json_encode([
        'error' => false,
        'email'=>$request['email']
    ]);
}
else{
    echo json_encode([
        'error' => true,
        'message' => 'User not found.'
    ]);
}
exit();

?>
