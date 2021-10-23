<?php

namespace Controllers;

use Classes\Email;
use Model\Usuario;
use MVC\Router;

class LoginController {
    public static function login(Router $router) {
        
        $router->render('auth/login');
    }

    public static function logout() {
        echo 'Desde Logout';
    }

    public static function olvide(Router $router) {
        
        $router->render('auth/olvide-password', [

        ]);
    }

    public static function recuperar() {
        echo 'Desde Recuperar';
    }

    public static function crear(Router $router) {
        $usuario = new Usuario;
        // Alertas vacias
        $alertas = [];
        if($_SERVER['REQUEST_METHOD'] == 'POST') {

            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarNuevaCuenta();

            // Validar que alertas este vacio

            if(empty($alertas)) {
                // Verificar que el usuario no este registrado
                $resultado = $usuario->existeUsuario();

                if($resultado->num_rows) {
                    $alertas = Usuario::getAlertas();
                } else {
                    // Hashear el password
                    $usuario->hashPassword();

                    // Generar un tocken único
                    $usuario->crearToken();

                    // Enviar el email
                    $email = new Email($usuario->nombre, $usuario->email, $usuario->token);
                    $email->enviarConfirmacion();
                    
                    // Crear el usuario
                    $resultado = $usuario->guardar();
                    if($resultado) {
                        header('Location: /mensaje');
                    }
                    //debuguear($usuario);
                }
            }
        }
        
        $router->render('auth/crear-cuenta', [
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }

    public static function mensaje(Router $router) {


        $router->render('auth/mensaje');
    }

    public static function confirmar(Router $router) {
        $alertas = [];

        $token = s($_GET['token']);
        $usuario = Usuario::where('token', $token);
        if(empty($usuario)) {
            // Mostrar mensaje de error
            Usuario::setAlerta('error', 'Token No Válido');
        } else {
            // Modificar a usuario confirmado.
            $usuario->confirmado = "1";
            // Elimnar el token confirmado
            $usuario->token = null;
            // Guardar cambios en la base de datos
            $usuario->guardar();
            // Añadir mensaje de alerta
            Usuario::setAlerta('exito', 'Cuenta Confirmada Correctamente');
        }
        // Obtener alertas para mostrar
        $alertas = Usuario::getAlertas();
        $router->render('auth/confirmar-cuenta', [
            'alertas' => $alertas
        ]);
    }
}