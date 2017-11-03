function buildFiguresMap (data) {
    var figures = {byID: {}, all: []},
        parent;

    data.forEach(function (figure) {
        figures.all.push(figure);
        figures.byID[figure.id] = figure;
    });

    data.forEach(function (figure) {
        if (figure.parentId) {
            parent = figures.byID[figure.parentId];
            if (parent) {
                parent.children = parent.children || [];
                parent.children.push(figure);
            }
        }
    });

    return figures.byID;
}