#!/bin/bash
# execute from within graphics/ like so:
# ./prepare.sh

URI_origin=$(pwd)

cp icon.png ../resources
cp splash.png ../resources

cd ../
ionic cordova resources

cd $URI_origin
