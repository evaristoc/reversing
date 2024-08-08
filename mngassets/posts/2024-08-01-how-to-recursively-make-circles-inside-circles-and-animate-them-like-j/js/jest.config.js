/** @type {import('jest').Config} */
//https://github.com/jestjs/jest/issues/11783
export default {
    verbose: true,
    //transform:{
    //     "^.+\\.[t|j]sx?$": "babel-jest"
    //}
    //transform: {}
    'transformIgnorePatterns': ["node_modules/(?!(lit-html|lit-element|lit|@lit)/)"],
    transform:{
        '^.+\\.(js|jsx)$': [
            'babel-jest', {
                'presets': ['@babel/preset-env'],
                "plugins": [
                    ["@babel/transform-runtime"]
                ]
	        }]
    }
  };
  
  //module.exports = config;