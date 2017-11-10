function buildFiguresCache (data) {
    var figures = {byID: {}, all: [], tree: [], folders: {}},
        byPreviousID = {},
        folder, keys,
        parent;

    data.forEach(function (figure) {
        figures.all.push(figure);
        figures.byID[figure.id] = figure;
    });

    data.forEach(function (figure) {
        if (figure.parentId) {
            parent = figures.byID[figure.parentId];
            if (parent) {
                figures.folders[parent.id] = parent;
                parent.children = parent.children || [];
                parent.children.push(figure);
            } 
        } else {
            figures.tree.push(figure);
        }
    });

    keys = Object.keys(figures.folders);
    keys.forEach(function (key) {
        folder = figures.folders[key];
        folder.children = orderChildren(folder.children);
    });

    return figures;
}

function orderChildren(children) {
    var sorted = [],
        byPreviousID = {},
        next;

        children.forEach(function (figure) {
            byPreviousID[figure.previousId] = figure;
            if (figure.previousId === null) {
                next = figure;
            }
        });

        while (next) {
            sorted.push(next);
            next = byPreviousID[next.id];
        }
        return sorted;
}