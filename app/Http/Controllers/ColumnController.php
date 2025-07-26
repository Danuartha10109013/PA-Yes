<?php

namespace App\Http\Controllers;

use App\Models\Column;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ColumnController extends Controller
{
    public function index()
    {
        $columns = Column::all();
        return response()->json($columns);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:columns,name',
                'bg_color' => 'nullable|string|max:50',
                'border_color' => 'nullable|string|max:50',
                'title_color' => 'nullable|string|max:50',
                'dot_border_color' => 'nullable|string|max:50',
                'dot_bg_color' => 'nullable|string|max:50',
                'dot_text_color' => 'nullable|string|max:50',
                'add_lead_color' => 'nullable|string|max:50',
            ]);

            $column = Column::create($validated);

            Log::info("✅ Column created: {$column->name}");

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Column created successfully.',
                    'column' => $column
                ]);
            }

            return back()->with('success', 'Column created successfully.');

        } catch (ValidationException $e) {
            Log::warning('⚠️ Column validation failed:', $e->errors());
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'errors' => $e->errors()
                ], 422);
            }
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('❌ Error creating column: ' . $e->getMessage());
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create column.'
                ], 500);
            }
            return back()->with('error', 'Failed to create column.');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $column = Column::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:columns,name,' . $id,
                'bg_color' => 'nullable|string|max:50',
                'border_color' => 'nullable|string|max:50',
                'title_color' => 'nullable|string|max:50',
                'dot_border_color' => 'nullable|string|max:50',
                'dot_bg_color' => 'nullable|string|max:50',
                'dot_text_color' => 'nullable|string|max:50',
                'add_lead_color' => 'nullable|string|max:50',
            ]);

            $column->update($validated);

            Log::info("✅ Column updated: {$column->name}");

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Column updated successfully.',
                    'column' => $column
                ]);
            }

            return back()->with('success', 'Column updated successfully.');

        } catch (ValidationException $e) {
            Log::warning('⚠️ Column validation failed:', $e->errors());
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'errors' => $e->errors()
                ], 422);
            }
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('❌ Error updating column: ' . $e->getMessage());
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to update column.'
                ], 500);
            }
            return back()->with('error', 'Failed to update column.');
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
            $column = Column::findOrFail($id);

            // Check if column has transactions
            $transactionCount = $column->transactions()->count();
            if ($transactionCount > 0) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'success' => false,
                        'message' => "Cannot delete column. It has {$transactionCount} transaction(s)."
                    ], 400);
                }
                return back()->with('error', "Cannot delete column. It has {$transactionCount} transaction(s).");
            }

            $columnName = $column->name;
            $column->delete();

            Log::info("✅ Column deleted: {$columnName}");

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Column deleted successfully.'
                ]);
            }

            return back()->with('success', 'Column deleted successfully.');

        } catch (\Exception $e) {
            Log::error('❌ Error deleting column: ' . $e->getMessage());
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to delete column.'
                ], 500);
            }
            return back()->with('error', 'Failed to delete column.');
        }
    }

    public function duplicate(Request $request, $id)
    {
        try {
            $originalColumn = Column::findOrFail($id);

            // Create duplicate with "Copy" suffix
            $duplicateData = $originalColumn->toArray();
            unset($duplicateData['id']);
            unset($duplicateData['created_at']);
            unset($duplicateData['updated_at']);
            
            $duplicateData['name'] = $originalColumn->name . ' Copy';

            $newColumn = Column::create($duplicateData);

            Log::info("✅ Column duplicated: {$originalColumn->name} -> {$newColumn->name}");

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Column duplicated successfully.',
                    'column' => $newColumn
                ]);
            }

            return back()->with('success', 'Column duplicated successfully.');

        } catch (\Exception $e) {
            Log::error('❌ Error duplicating column: ' . $e->getMessage());
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to duplicate column.'
                ], 500);
            }
            return back()->with('error', 'Failed to duplicate column.');
        }
    }
} 