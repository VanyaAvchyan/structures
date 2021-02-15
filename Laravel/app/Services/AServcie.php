<?php
namespace App\Services;
use Illuminate\Database\Eloquent\Model;

/**
 * Class AServcie
 * @package App\Services
 */
class AServcie {
    /**
     * @var Model
     */
    protected $model;

    /**
     * @param array $conditions Where filter conditions
     * @param array $includes Relations
     * @return array
     */
    public function get(array $conditions=[],array $includes = []): array {
        return $this->model
            ->where($conditions)
            ->with($includes)
            ->get()
            ->toArray();
    }

    /**
     * @param array $conditions Where filter conditions
     * @param array $includes Relations
     * @return array
     */
    public function one(array $conditions=[], array $includes = []): array
    {
        $model = $this->model->where($conditions)->with($includes)->first();
        if(!$model)
            return [];
        return $model->toArray();
    }

    /**
     * @param array $conditions Where filter conditions
     * @param array $data Data for update
     * @return bool
     */
    public function create(array $data): array
    {
        $user = $this->model->create($data);
        return $user->toArray();
    }

    /**
     * @param array $conditions Where filter conditions
     * @param array $data Data for update
     * @return bool
     */
    public function update(array $conditions=[], array $data): bool {
        return (bool)$this->model->where($conditions)->update($data);
    }

    /**
     * @param array $conditions
     * @return bool
     */
    public function delete(array $conditions): bool {
        return (bool)$this->model->where($conditions)->delete();
    }


    /**
     * Get model's fillable fields
     * @return array
     */
    public function getFillables()
    {
        return $this->model->getFillable();
    }
}