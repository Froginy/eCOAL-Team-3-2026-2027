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
        Schema::create('dice_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dice_id')->constrained('dices')->onDelete('cascade');
            $table->string('image_url', 255);
            $table->timestamps();
        });

        \Illuminate\Support\Facades\DB::unprepared('
            CREATE TRIGGER enforce_max_dice_images
            BEFORE INSERT ON dice_images
            FOR EACH ROW
            WHEN (SELECT COUNT(*) FROM dice_images WHERE dice_id = NEW.dice_id) >= 3
            BEGIN
                SELECT RAISE(ABORT, "Un dé ne peut avoir que 3 photos maximum.");
            END;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::unprepared('DROP TRIGGER IF EXISTS enforce_max_dice_images');
        Schema::dropIfExists('dice_images');
    }
};
