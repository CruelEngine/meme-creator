require('dotenv').config();
const webpack = require('webpack');
const isProduction = (process.env.NODE_ENV === 'production');
console.log(isProduction);
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const fileNamePrefix = isProduction ? '[hash].' : '';
const CleanWebpackPlugin = require('clean-webpack-plugin');

const extractLess = new ExtractTextPlugin({
    filename: fileNamePrefix + "[name].css"
});


const pathsToClean = [
    'dist'
];

const cleanOptions = {
    root : __dirname,
    verbose : true,
    dry : false,
    exclude : []
};

module.exports = {
    context : __dirname,
    entry:{
        general : './src/js/general.js',
        memes: './src/js/memes.js'
    },
    output : {
        path : __dirname + "/dist",
        filename: fileNamePrefix + '[name].js',
        publicPath : '/dist/'
    },
    devServer : {
        compress : true,
        port : 8080,
        hot : true,
    },
    devtool : 'source-map',
    module : {
        rules : [
            {
                test : /\.js$/,
                exclude : /(node_modules)/,
                use: {
                    loader : 'babel-loader',
                    options : {
                        presets : ['env' , 'es2015'],
                    }
                }
            },
            {
                test: /\.(less|css)$/,
                use: extractLess.extract({
                use:[
                    {
                        loader : 'css-loader',
                        options : {
                            sourceMap : true
                        }
                    },
                    {
                        loader : 'less-loader',
                        options : {
                            sourceMap : true
                        }
                    }
                ],
                fallback: 'style-loader',
            }),
            },
            {
                test : /\.(svg|eot|ttf|woff|woff2)$/,
                loader : 'url-loader',
                options:{
                    limit : 10000,
                    name : 'fonts/[name].[ext]'
                }
            }
        ],
    },
    plugins:[
        new webpack.ProvidePlugin({
            jQuery : 'jquery',
            $ : 'jquery',
            jquery : 'jquery'
        }),

        new webpack.DefinePlugin({
            ENVIRONMENT : JSON.stringify(process.env.NODE_ENV),
            CONSTANT_VALUE : JSON.stringify(process.env.CONSTANT_VALUE)
        }),
        extractLess,
        new PurifyCSSPlugin({
            paths : glob.sync(__dirname + '/*.html'),
            minimize : true,
        }), 
    ],
}

if(!isProduction){
    module.exports.plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
}
if (isProduction) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
        function(){
            this.plugin("done" , function(status){
                console.log('Hi : ');
                // console.log(status);
                console.log(__dirname);
                require("fs").mkdirSync(
                    __dirname + "/dist/");
                require("fs").writeFileSync(__dirname + "/dist/manifest.json" , 
                    JSON.stringify(status.toJson().assets),function(err){
                        if(err){
                            console.log(err);
                        }
                    }
                );
            });
        },
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
    );
}