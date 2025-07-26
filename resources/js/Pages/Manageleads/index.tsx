import React, { useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "react-beautiful-dnd";
import { Columns } from "../../components/kanban/types";
import { initialKanbanData } from "../../components/kanban/mock";

const Manageleads: React.FC = () => {
    const [columns, setColumns] = useState<Columns>(initialKanbanData);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceCol = columns[source.droppableId];
        const destCol = columns[destination.droppableId];
        const draggedTask = sourceCol.items[source.index];

        const updatedSourceItems = [...sourceCol.items];
        updatedSourceItems.splice(source.index, 1);

        const updatedDestItems = [...destCol.items];
        updatedDestItems.splice(destination.index, 0, {
            ...draggedTask,
            columnId: destination.droppableId, // update the column ID
        });

        setColumns({
            ...columns,
            [source.droppableId]: {
                ...sourceCol,
                items: updatedSourceItems,
            },
            [destination.droppableId]: {
                ...destCol,
                items: updatedDestItems,
            },
        });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 p-4 overflow-x-auto">
                {Object.entries(columns).map(([colId, col]) => (
                    <Droppable droppableId={colId} key={colId}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="bg-gray-100 rounded-lg p-4 w-64"
                            >
                                <h2 className="text-lg font-bold mb-2">{col.name}</h2>
                                {col.items.map((task, index) => (
                                    <Draggable
                                        draggableId={task.id.toString()}
                                        index={index}
                                        key={task.id}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                                className="bg-white p-3 mb-2 rounded shadow text-sm"
                                            >
                                                <div className="font-semibold">
                                                    {task.transactionCode}
                                                </div>
                                                <div>Qty: {task.quantity}</div>
                                                <div>Total: Rp{task.grandTotal.toLocaleString()}</div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
};

export default Manageleads;
