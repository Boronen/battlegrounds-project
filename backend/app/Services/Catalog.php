<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class Catalog
{
    public static function current(bool $enabledOnly = true): array
    {
        $latest = DB::table('character_versions')->selectRaw('character_id, MAX(id) AS latest')->groupBy('character_id');

        return DB::table('characters as c')->joinSub($latest, 'v', 'c.id', '=', 'v.character_id')
            ->join('character_versions as d', 'v.latest', '=', 'd.id')
            ->when($enabledOnly, fn ($q) => $q->where('enabled', true))->orderBy('c.id')
            ->get(['c.id', 'enabled', 'd.definition', 'd.id as version'])->map(function ($row) {
                return ['id' => $row->id, 'version' => $row->version, 'enabled' => (bool) $row->enabled, 'definition' => json_decode($row->definition, true)];
            })->all();
    }
}
