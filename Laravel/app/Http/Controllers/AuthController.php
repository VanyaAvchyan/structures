<?php

namespace App\Http\Controllers;

use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\Role;
use App\Services\UserSevice;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class AuthController extends Controller
{
    /**
     * Contains main view directory
     * @var string
     */
    private $view = 'auth/';

    /**
     * User do logout
     *
     * @return RedirectResponse
     */
    public function logout(): RedirectResponse
    {
        auth()->logout();
        return redirect('/auth/login/');
    }

    /**
     * Show login form
     *
     * @return View | RedirectResponse
     */
    public function login()
    {
        if(auth()->check())
            return redirect('/users/');
        return $this->response($this->view.__FUNCTION__);
    }

    /**
     * User do-login
     *
     * @param LoginRequest $request
     * @return RedirectResponse
     */
    public function postLogin(LoginRequest $request): RedirectResponse
    {
        $credentials = $request->only('email', 'password');
        if (auth()->attempt($credentials))
        {
            $request->session()->regenerate();
            return redirect('/users/');
        }
        return redirect('/auth/login/')->with('error', 'Email or password is incorrect.');
    }

    /**
     * Show register form
     * @return View
     */
    public function register(): View {
        return $this->response($this->view.__FUNCTION__);
    }

    /**
     * User do-register
     * @param RegisterRequest $request
     * @param UserSevice $userSevice
     * @return RedirectResponse
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public function postRegister(RegisterRequest $request, UserSevice $userSevice): RedirectResponse
    {
        try {
            \DB::beginTransaction();
            $user = $request->only($userSevice->getFillables());
            $userSevice->register($user);
            \DB::commit();
            return redirect('/auth/register-success/')->with('success', 'Register success');
        } catch (\Exception $e) {
            \DB::rollback();
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Sho register success page
     * @return View
     */
    public function registerSuccess(): View
    {
        if(!session('success'))
            abort(404);
        return $this->response($this->view.__FUNCTION__);
    }
}
