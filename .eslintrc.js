module.exports = {
    "extends": "eslint:recommended",
    "rules": {
        // enable additional rules
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],

        // override default options for rules from base configurations
        "comma-dangle": ["error", "never"],
        "no-cond-assign": ["error", "always"],

        // disable rules from base configurations
        "no-console": "off",

        "no-unused-vars": [2, {"vars": "local", "args": "after-used"}],
    },
    "globals": {
        "jQuery": true,
        "$": true,
        "console": true,
        "window": true,
        "document": true,
        "e": true,
        "setInterval": true,
        "clearInterval": true,
        "setTimeout": true,
        "clearTimeout": true,
        "alert": true
    }    
};