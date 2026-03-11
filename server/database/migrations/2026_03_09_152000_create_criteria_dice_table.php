<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('criteria_dice', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dice_id')->constrained('dices')->onDelete('cascade');
            $table->foreignId('criteria_id')->constrained('criterias')->onDelete('cascade');
            $table->integer('value')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('criteria_dice');
    }
};
