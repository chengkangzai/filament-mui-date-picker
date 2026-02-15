import esbuild from 'esbuild'

const isDev = process.argv.includes('--dev')

async function compile(options) {
    const context = await esbuild.context(options)

    if (isDev) {
        await context.watch()
    } else {
        await context.rebuild()
        await context.dispose()
    }
}

const defaultOptions = {
    define: {
        'process.env.NODE_ENV': isDev ? `'development'` : `'production'`,
    },
    bundle: true,
    mainFields: ['module', 'main'],
    platform: 'neutral',
    sourcemap: isDev ? 'inline' : false,
    sourcesContent: isDev,
    treeShaking: true,
    target: ['es2020'],
    minify: !isDev,
    plugins: [{
        name: 'watchPlugin',
        setup: function (build) {
            build.onStart(() => {
                console.log(`Build started at ${new Date(Date.now()).toLocaleTimeString()}: ${build.initialOptions.outfile}`)
            })

            build.onEnd((result) => {
                if (result.errors.length > 0) {
                    console.log(`Build failed at ${new Date(Date.now()).toLocaleTimeString()}: ${build.initialOptions.outfile}`, result.errors)
                } else {
                    console.log(`Build finished at ${new Date(Date.now()).toLocaleTimeString()}: ${build.initialOptions.outfile}`)
                }
            })
        }
    }],
}

// Alpine bridge component (small, loaded via x-load-src)
compile({
    ...defaultOptions,
    entryPoints: ['./resources/js/components/mui-date-picker.js'],
    outfile: './resources/dist/components/mui-date-picker.js',
}).then(() => {
    console.log('Build completed for Alpine bridge')
})

// React bundle (IIFE format, loaded via x-load-js)
compile({
    ...defaultOptions,
    entryPoints: ['./resources/js/index.js'],
    outfile: './resources/dist/mui-date-picker.js',
    platform: 'browser',
    format: 'iife',
    globalName: 'MuiDatePickerReact',
    loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
    },
    jsx: 'automatic',
}).then(() => {
    console.log('Build completed for React bundle')
})

// CSS
compile({
    ...defaultOptions,
    entryPoints: ['./resources/css/index.css'],
    outfile: './resources/dist/mui-date-picker.css',
}).then(() => {
    console.log('Build completed for CSS')
})
