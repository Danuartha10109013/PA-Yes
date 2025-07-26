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
        Schema::table('columns', function (Blueprint $table) {
            $table->string('bg_color')->nullable();
            $table->string('border_color')->nullable();
            $table->string('title_color')->nullable();
            $table->string('dot_border_color')->nullable();
            $table->string('dot_bg_color')->nullable();
            $table->string('dot_text_color')->nullable();
            $table->string('add_lead_color')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('columns', function (Blueprint $table) {
            $table->dropColumn([
                'bg_color',
                'border_color',
                'title_color',
                'dot_border_color',
                'dot_bg_color',
                'dot_text_color',
                'add_lead_color'
            ]);
        });
    }
};
