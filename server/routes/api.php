<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DiceController;

use App\Http\Controllers\CollectionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CriteriaController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

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

