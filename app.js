requirejs.config({
    baseUrl: './lib',
    paths: {
        blockLib: '../src/',
        data: '../data',
        app: '../app'
    }
});

requirejs(['app/main']);