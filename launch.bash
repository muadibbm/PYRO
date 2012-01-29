#!/bin/bash
echo 'compiling coffeescript...'
./compile_coffee.bash
echo 'launching server...'
coffee app.coffee
