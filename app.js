requirejs.config({
    baseUrl: './lib',
    paths: {
        blockLib: './src/',
        app: 'app'
    }
});

requirejs(['app/main']);