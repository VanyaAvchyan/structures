<?php
namespace App\Services;

use App\Models\Lang;

/**
 * Class LangService
 * @package App\Services
 */
class LangService extends \App\Services\AServcie {
    /**
     * LangService constructor.
     * @param Lang $model
     */
    public function __construct(Lang $model)
    {
        $this->model = $model;
    }
}