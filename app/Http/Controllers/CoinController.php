<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CoinController extends Controller
{
    public function get()
    {
        return response()->json([
            'coins' => Auth::user()->coins,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'coins' => 'required|integer|min:0',
        ]);

        $user = Auth::user();
        $user->coins = $request->coins;
        $user->save();

        return response()->json([
            'coins' => $user->coins,
        ]);
    }
}
