<?php
namespace App\Services;

use App\Models\ForgotPassword;
use App\Models\Lang;
use App\Models\SoldierData;
use App\Models\SoldierDataI18n;
use App\Models\SponsorData;
use App\Models\User;
use App\Models\UserFile;
use App\Models\UserI18n;
use App\Models\VolunteerData;
use App\Models\Gallery;
use App\Models\SoldierServiceTimefraame;

/**
 * Class UserSevice
 * @package App\Services
 */
class UserSevice extends AServcie {
    const GALLERY = 'static/uploads/galleries/';
    const GALLERY_THUMB = 'static/uploads/galleries/thumbs/';

    /**
     * UserSevice constructor.
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->model = $user;
    }

    /**
     * @param $items
     * @param int $perPage
     * @param null $page
     * @param array $options
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    private function paginateCollection($items, $perPage = 15, $page = null, $options = [])
    {
        $page = $page ?: (\Illuminate\Pagination\Paginator::resolveCurrentPage() ?: 1);
        $items = $items instanceof \Illuminate\Support\Collection ? $items : collect($items);
        return new \Illuminate\Pagination\LengthAwarePaginator($items->forPage($page, $perPage), $items->count(), $perPage, $page, $options);
    }

    /**
     * @param array $data
     * @return array
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public function register(array $data): array
    {
        $data = $this->correctData($data);
        $user = $this->create($data);
        $code = $this->mailService->registrationEmail($user['email']);
        $this->unconfirmedEmailService->create([
            'user_id' => $user['id'],
            'code' => $code
        ]);
        return $user;
    }

    /**
     * @param $code
     * @return bool
     * @throws \Exception
     */
    public function completeRegistration($code) : bool
    {
        try {
            \DB::beginTransaction();
            $unconfirmedEmail = $this->unconfirmedEmailService->one(['code' => $code]);
            if(!$unconfirmedEmail){
                throw new \Exception('Unconfirmed Email Not Found');
            }
            $this->update(['id' => $unconfirmedEmail['user_id']], ['register_completed' => 1]);
            $this->unconfirmedEmailService->delete(['code' => $code]);
            \DB::commit();
            return true;
        } catch (\Exception $e) {
            \DB::rollback();
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Correct Data for right save
     *
     * @param array $data User data
     * @return array
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    private function correctData(array $data): array
    {
        $data['password'] = app('hash')->make($data['password']);
        $data['uuid'] = (string) \Illuminate\Support\Str::uuid();
        $data['phone'] = preg_replace("/\D/", "", $data['phone']);
        return $data;
    }

    /**
     * @param array $data
     * @return array
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public function createUser(array $data): array
    {
        $data = $this->correctData($data);
        return parent::create($data);
    }

    /**
     * @param int $user_id
     * @param array $files
     * @return bool
     */
    public function savePhotos(int $user_id, array $files): bool
    {
        $result = false;
        foreach ($files as $file)
        {
            //todo add user name as photos dir
            $document = FileService::upload($file, ['path' => self::GALLERY]);
            FileService::upload($file, [
                'path' => self::GALLERY_THUMB,
                'uniqueFileName' => $document['uniqueName'],
                'fitParams' => [185, 143]]);
            $this->modelGallery->create([
                'user_id' => $user_id,
                'image' => $document['uniqueName'],
            ]);
            $result = true;
        }
        return $result;
    }
}