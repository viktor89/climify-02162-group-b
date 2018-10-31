<?php
namespace API\V2;

use Exception;

class AuthorizationException extends Exception
{
    public function __construct($message, $code = 0, Exception $previous = null) {
        parent::__construct($message, $code, $previous);
    }
}