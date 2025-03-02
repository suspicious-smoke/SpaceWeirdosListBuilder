# Open Source Space Weirdos List Builder<img src="https://raw.githubusercontent.com/starbuck8844/SpaceWeirdosListBuilder/master/static/icon.svg" alt="Alt text" width="70" height="70">


## Overview
To start out, please support Garske Games for making this awesome game [Buy Space Weirdos](https://www.wargamevault.com/product/359157/Space-Weirdos). It is an one of my most played wargame. This is my Space Weirdos list builder site. It's currently hosted on the free tier on render, so be warned it may take some time and refreshes for it to load if the site has been sleeping. Once it does load, it should be fairly snappy. This is licensed by the  basic MIT open source license, so anyone is welcome to mess around with and copy the source code within that framework. Have fun!

[List Builder Hosted on Render Site](https://spaceweirdoslistbuilder.onrender.com/)

## Unique Features
Some things I wanted to include in this list builder that I hadn't seen elsewhere:

- **Print Options**: Options to print lists as double column or single column in the case of especially long descriptions.

- **Ability text while making the list**: I wanted to include the text for each of the given abilities so that I didn't have to constantly reference the rules pdf while making my list.

- **Allow Copies of individual weirdos**: This says more about how I make lists. I like to have 2-3 unique weirdos and then 3-4 basic troops. This allows you to only print the unique profiles and still get the benefits of the auto point calculation.

- **Copy Weirdos/Warbands**: Sometimes it's nice to start from something already completed and then make small adjustments.

## Test The Freeze Setup

Set-ExecutionPolicy Unrestricted -Scope Process in vscode 
Set-ExecutionPolicy RemoteSigned
run freeze.py

in terminal run
cd D:\Development\PythonDev\SpaceWeirdosListBuilder\build

py -m http.server

## Build Script
Build command: pip install -r requirements.txt && python freeze.py
publish directory: build

## Closing Thoughts
This was a hobby project to get me familiar with vanilla Javascript, so the frontend code could have been simplified by using a framework like Vue or React. The source code is on github. It was written in vanilla Javascript, Python with Flask, and Boostrap for the css. For storage, it uses your browsers Local Storage, so it is specific to the individual browser. You can also export your collection of warbands as json text that you can paste into the area to reload the list of warbands. Feel free to throw out any suggestions or if you find any bugs or typos.
