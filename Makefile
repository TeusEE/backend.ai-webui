EP = electron-packager ./build/es6-unbundled --ignore=node_modules/electron-packager --icon=manifest/backend-ai.icns --ignore=.git --overwrite --ignore="\.git(ignore|modules)" --out=app

mac:
	cp ./main.electron-packager.js ./build/es6-unbundled/main.js
	cd build/es6-unbundled
	npm install
	cd ../..
	$(EP) --platform=darwin