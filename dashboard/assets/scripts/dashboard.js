(function() {

    window.fetch('anaylsis.json').then(function(response) {
        return response.json().then(createViewModel).then(drawThings);
    });

    function createViewModel(raw) {
        var files = [];

        for (var file in raw) {
            files.push(raw[file].map(function (obj) {
                obj.name = obj.filename.split('/').pop();
                obj.unit = 'kb';
                obj.id = 'chart-' + obj.name.replace(/\./g, '-');
                return obj;
            }));
        }

        function ViewModel() {
            this.files = files;
        }

        ko.applyBindings(new ViewModel());

        return files;
    }

    function drawThings(files) {
        files.forEach(function(file) {
            var el = document.getElementById(file[0].id);

            var data = file.map(function(obj, i) {
                return {
                    x: i,
                    y: obj.uncompressed
                };
            });

            var graph = new Rickshaw.Graph({
                element: el,
                series: [{
                    color: 'white',
                    data: data
                }]
            });

            var resize = function() {
                graph.configure({
                    width: el.clientWidth,
                    height: el.clientHeight
                });
                graph.render();
            };

            window.addEventListener('resize', resize);
            resize();
        });
    }

})();
