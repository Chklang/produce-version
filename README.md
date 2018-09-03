# Produce-version
This program permit to create a new version with un argument

# How to use it
Declare into your package.json :
```
"scripts": {
    "set_version": "node node_modules/produce-version"
}
```
And execute `npm run set_version -- --tagversion=1.0.8`