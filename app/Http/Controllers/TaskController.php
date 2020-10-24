<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tasks;

class TaskController extends Controller
{
    public function index() {
        return Tasks::all();
    }

    public function store( Request $request ) {
        return Tasks::create($request->all());
    }

    public function update( Request $request, $id ) {
        $task = Tasks::findOrFail($id);
        $task->update($request->all());
    }

    public function delete($id) {
        $task = Tasks::findOrFail($id);
        $task->delete();
        return 204;
    }
}
