// Undo/redo history manager for override pixel arrays.
(function () {
    function create(config) {
        const maxHistory = config.maxHistory || 50;
        const getOverrideArray = config.getOverrideArray;
        const setOverrideArray = config.setOverrideArray;
        const onStateChange = config.onStateChange || function () {};
        const afterApply = config.afterApply || function () {};

        let undoStack = [];
        let redoStack = [];

        function save() {
            undoStack.push(getOverrideArray().slice());
            if (undoStack.length > maxHistory) {
                undoStack.shift();
            }
            redoStack = [];
            onStateChange();
        }

        function undo() {
            if (undoStack.length === 0) return;
            redoStack.push(getOverrideArray().slice());
            setOverrideArray(undoStack.pop());
            onStateChange();
            afterApply();
        }

        function redo() {
            if (redoStack.length === 0) return;
            undoStack.push(getOverrideArray().slice());
            setOverrideArray(redoStack.pop());
            onStateChange();
            afterApply();
        }

        function clear() {
            undoStack = [];
            redoStack = [];
            onStateChange();
        }

        function canUndo() {
            return undoStack.length > 0;
        }

        function canRedo() {
            return redoStack.length > 0;
        }

        return {
            save,
            undo,
            redo,
            clear,
            canUndo,
            canRedo,
        };
    }

    window.LAROverrideHistory = {
        create,
    };
})();
