<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DiceController;

use App\Http\Controllers\CollectionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CriteriaController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::post('/logout', [AuthController::class, 'logout']);
});

// --- SUBSCRIPTIONS ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/users/{id}/subscribe', [SubscriptionController::class, 'subscribe']);
    Route::delete('/users/{id}/subscribe', [SubscriptionController::class, 'unsubscribe']);
});

// --- COLLECTIONS ---
Route::prefix('collections')->group(function () {
    Route::get('/', [CollectionController::class, 'index']);
    Route::post('/', [CollectionController::class, 'store']);
    Route::get('/{id}', [CollectionController::class, 'show']);
    Route::put('/{id}', [CollectionController::class, 'update']);
    Route::delete('/{id}', [CollectionController::class, 'destroy']);
});

// --- DICES ---
Route::prefix('dices')->group(function () {
    Route::get('/', [DiceController::class, 'index']);
    Route::post('/', [DiceController::class, 'store']);
    Route::get('/{id}', [DiceController::class, 'show']);
    Route::put('/{id}', [DiceController::class, 'update']);
    Route::delete('/{id}', [DiceController::class, 'destroy']);

    // Auth routes for dices
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/{id}/like', [LikeController::class, 'like']);
        Route::delete('/{id}/like', [LikeController::class, 'unlike']);
    });
});

// --- CATEGORIES ---
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store']);
    Route::get('/{id}', [CategoryController::class, 'show']);
    Route::put('/{id}', [CategoryController::class, 'update']);
    Route::delete('/{id}', [CategoryController::class, 'destroy']);
});

// --- CRITERIAS ---
Route::prefix('criterias')->group(function () {
    Route::get('/', [CriteriaController::class, 'index']);
    Route::post('/', [CriteriaController::class, 'store']);
    Route::get('/{id}', [CriteriaController::class, 'show']);
    Route::put('/{id}', [CriteriaController::class, 'update']);
    Route::delete('/{id}', [CriteriaController::class, 'destroy']);
});

