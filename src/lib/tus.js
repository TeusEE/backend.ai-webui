(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tus=f()}})(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(_dereq_,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default=fingerprint;var _isReactNative=_dereq_("./isReactNative");var _isReactNative2=_interopRequireDefault(_isReactNative);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}function fingerprint(file,options,callback){if((0,_isReactNative2.default)()){return callback(null,reactNativeFingerprint(file,options))}return callback(null,["tus-br",file.name,file.type,file.size,file.lastModified,options.endpoint].join("-"))}function reactNativeFingerprint(file,options){var exifHash=file.exif?hashCode(JSON.stringify(file.exif)):"noexif";return["tus-rn",file.name||"noname",file.size||"nosize",exifHash,options.endpoint].join("/")}function hashCode(str){var hash=0;if(str.length===0){return hash}for(var i=0;i<str.length;i++){var char=str.charCodeAt(i);hash=(hash<<5)-hash+char;hash=hash&hash}return hash}},{"./isReactNative":3}],2:[function(_dereq_,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var isCordova=function isCordova(){return typeof window!="undefined"&&(typeof window.PhoneGap!="undefined"||typeof window.Cordova!="undefined"||typeof window.cordova!="undefined")};exports.default=isCordova},{}],3:[function(_dereq_,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var isReactNative=function isReactNative(){return typeof navigator!=="undefined"&&typeof navigator.product==="string"&&navigator.product.toLowerCase()==="reactnative"};exports.default=isReactNative},{}],4:[function(_dereq_,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});function readAsByteArray(chunk,callback){var reader=new FileReader;reader.onload=function(){callback(null,new Uint8Array(reader.result))};reader.onerror=function(err){callback(err)};reader.readAsArrayBuffer(chunk)}exports.default=readAsByteArray},{}],5:[function(_dereq_,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.newRequest=newRequest;exports.resolveUrl=resolveUrl;var _urlParse=_dereq_("url-parse");var _urlParse2=_interopRequireDefault(_urlParse);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}function newRequest(){return new window.XMLHttpRequest}function resolveUrl(origin,link){return new _urlParse2.default(link,origin).toString()}},{"url-parse":16}],6:[function(_dereq_,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();exports.getSource=getSource;var _isReactNative=_dereq_("./isReactNative");var _isReactNative2=_interopRequireDefault(_isReactNative);var _uriToBlob=_dereq_("./uriToBlob");var _uriToBlob2=_interopRequireDefault(_uriToBlob);var _isCordova=_dereq_("./isCordova");var _isCordova2=_interopRequireDefault(_isCordova);var _readAsByteArray=_dereq_("./readAsByteArray");var _readAsByteArray2=_interopRequireDefault(_readAsByteArray);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}var FileSource=function(){function FileSource(file){_classCallCheck(this,FileSource);this._file=file;this.size=file.size}_createClass(FileSource,[{key:"slice",value:function slice(start,end,callback){if((0,_isCordova2.default)()){(0,_readAsByteArray2.default)(this._file.slice(start,end),function(err,chunk){if(err)return callback(err);callback(null,chunk)});return}callback(null,this._file.slice(start,end))}},{key:"close",value:function close(){}}]);return FileSource}();var StreamSource=function(){function StreamSource(reader,chunkSize){_classCallCheck(this,StreamSource);this._chunkSize=chunkSize;this._buffer=undefined;this._bufferOffset=0;this._reader=reader;this._done=false}_createClass(StreamSource,[{key:"slice",value:function slice(start,end,callback){if(start<this._bufferOffset){callback(new Error("Requested data is before the reader's current offset"));return}return this._readUntilEnoughDataOrDone(start,end,callback)}},{key:"_readUntilEnoughDataOrDone",value:function _readUntilEnoughDataOrDone(start,end,callback){var _this=this;var hasEnoughData=end<=this._bufferOffset+len(this._buffer);if(this._done||hasEnoughData){var value=this._getDataFromBuffer(start,end);callback(null,value,value==null?this._done:false);return}this._reader.read().then(function(_ref){var value=_ref.value,done=_ref.done;if(done){_this._done=true}else if(_this._buffer===undefined){_this._buffer=value}else{_this._buffer=concat(_this._buffer,value)}_this._readUntilEnoughDataOrDone(start,end,callback)}).catch(function(err){callback(new Error("Error during read: "+err))})}},{key:"_getDataFromBuffer",value:function _getDataFromBuffer(start,end){if(start>this._bufferOffset){this._buffer=this._buffer.slice(start-this._bufferOffset);this._bufferOffset=start}var hasAllDataBeenRead=len(this._buffer)===0;if(this._done&&hasAllDataBeenRead){return null}return this._buffer.slice(0,end-start)}},{key:"close",value:function close(){if(this._reader.cancel){this._reader.cancel()}}}]);return StreamSource}();function len(blobOrArray){if(blobOrArray===undefined)return 0;if(blobOrArray.size!==undefined)return blobOrArray.size;return blobOrArray.length}function concat(a,b){if(a.concat){return a.concat(b)}if(a instanceof Blob){return new Blob([a,b],{type:a.type})}if(a.set){var c=new a.constructor(a.length+b.length);c.set(a);c.set(b,a.length);return c}throw new Error("Unknown data type")}function getSource(input,chunkSize,callback){if((0,_isReactNative2.default)()&&input&&typeof input.uri!=="undefined"){(0,_uriToBlob2.default)(input.uri,function(err,blob){if(err){return callback(new Error("tus: cannot fetch `file.uri` as Blob, make sure the uri is correct and accessible. "+err))}callback(null,new FileSource(blob))});return}if(typeof input.slice==="function"&&typeof input.size!=="undefined"){callback(null,new FileSource(input));return}if(typeof input.read==="function"){chunkSize=+chunkSize;if(!isFinite(chunkSize)){callback(new Error("cannot create source for stream without a finite value for the `chunkSize` option"));return}callback(null,new StreamSource(input,chunkSize));return}callback(new Error("source object may only be an instance of File, Blob, or Reader in this environment"))}},{"./isCordova":2,"./isReactNative":3,"./readAsByteArray":4,"./uriToBlob":8}],7:[function(_dereq_,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();exports.getStorage=getStorage;function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}var hasStorage=false;try{hasStorage="localStorage"in window;var key="tusSupport";localStorage.setItem(key,localStorage.getItem(key))}catch(e){if(e.code===e.SECURITY_ERR||e.code===e.QUOTA_EXCEEDED_ERR){hasStorage=false}else{throw e}}var canStoreURLs=exports.canStoreURLs=hasStorage;var LocalStorage=function(){function LocalStorage(){_classCallCheck(this,LocalStorage)}_createClass(LocalStorage,[{key:"setItem",value:function setItem(key,value,cb){cb(null,localStorage.setItem(key,value))}},{key:"getItem",value:function getItem(key,cb){cb(null,localStorage.getItem(key))}},{key:"removeItem",value:function removeItem(key,cb){cb(null,localStorage.removeItem(key))}}]);return LocalStorage}();function getStorage(){return hasStorage?new LocalStorage:null}},{}],8:[function(_dereq_,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});function uriToBlob(uri,done){var xhr=new XMLHttpRequest;xhr.responseType="blob";xhr.onload=function(){var blob=xhr.response;done(null,blob)};xhr.onerror=function(err){done(err)};xhr.open("GET",uri);xhr.send()}exports.default=uriToBlob},{}],9:[function(_dereq_,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return call&&(typeof call==="object"||typeof call==="function")?call:self}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}var DetailedError=function(_Error){_inherits(DetailedError,_Error);function DetailedError(error){var causingErr=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;var xhr=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;_classCallCheck(this,DetailedError);var _this=_possibleConstructorReturn(this,(DetailedError.__proto__||Object.getPrototypeOf(DetailedError)).call(this,error.message));_this.originalRequest=xhr;_this.causingError=causingErr;var message=error.message;if(causingErr!=null){message+=", caused by "+causingErr.toString()}if(xhr!=null){message+=", originated from request (response code: "+xhr.status+", response text: "+xhr.responseText+")"}_this.message=message;return _this}return DetailedError}(Error);exports.default=DetailedError},{}],10:[function(_dereq_,module,exports){"use strict";var _upload=_dereq_("./upload");var _upload2=_interopRequireDefault(_upload);var _storage=_dereq_("./node/storage");var storage=_interopRequireWildcard(_storage);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key]}}newObj.default=obj;return newObj}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}var defaultOptions=_upload2.default.defaultOptions;var moduleExport={Upload:_upload2.default,canStoreURLs:storage.canStoreURLs,defaultOptions:defaultOptions};if(typeof window!=="undefined"){var _window=window,XMLHttpRequest=_window.XMLHttpRequest,Blob=_window.Blob;moduleExport.isSupported=XMLHttpRequest&&Blob&&typeof Blob.prototype.slice==="function"}else{moduleExport.isSupported=true;moduleExport.FileStorage=storage.FileStorage}module.exports=moduleExport},{"./node/storage":7,"./upload":11}],11:[function(_dereq_,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _error=_dereq_("./error");var _error2=_interopRequireDefault(_error);var _extend=_dereq_("extend");var _extend2=_interopRequireDefault(_extend);var _jsBase=_dereq_("js-base64");var _request=_dereq_("./node/request");var _source=_dereq_("./node/source");var _storage=_dereq_("./node/storage");var _fingerprint=_dereq_("./node/fingerprint");var _fingerprint2=_interopRequireDefault(_fingerprint);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}var defaultOptions={endpoint:null,fingerprint:_fingerprint2.default,resume:true,onProgress:null,onChunkComplete:null,onSuccess:null,onError:null,headers:{},chunkSize:Infinity,withCredentials:false,uploadUrl:null,uploadSize:null,overridePatchMethod:false,retryDelays:null,removeFingerprintOnSuccess:false,uploadLengthDeferred:false,urlStorage:null,fileReader:null,uploadDataDuringCreation:false};var Upload=function(){function Upload(file,options){_classCallCheck(this,Upload);this.options=(0,_extend2.default)(true,{},defaultOptions,options);this._storage=this.options.urlStorage;this.file=file;this.url=null;this._xhr=null;this._fingerprint=null;this._offset=null;this._aborted=false;this._size=null;this._source=null;this._retryAttempt=0;this._retryTimeout=null;this._offsetBeforeRetry=0}_createClass(Upload,[{key:"start",value:function start(){var _this=this;var file=this.file;if(!file){this._emitError(new Error("tus: no file or stream to upload provided"));return}if(!this.options.endpoint&&!this.options.uploadUrl){this._emitError(new Error("tus: neither an endpoint or an upload URL is provided"));return}if(this.options.resume&&this._storage==null){this._storage=(0,_storage.getStorage)()}if(this._source){this._start(this._source)}else{var fileReader=this.options.fileReader||_source.getSource;fileReader(file,this.options.chunkSize,function(err,source){if(err){_this._emitError(err);return}_this._source=source;_this._start(source)})}}},{key:"_start",value:function _start(source){var _this2=this;var file=this.file;if(this.options.uploadLengthDeferred){this._size=null}else if(this.options.uploadSize!=null){this._size=+this.options.uploadSize;if(isNaN(this._size)){this._emitError(new Error("tus: cannot convert `uploadSize` option into a number"));return}}else{this._size=source.size;if(this._size==null){this._emitError(new Error("tus: cannot automatically derive upload's size from input and must be specified manually using the `uploadSize` option"));return}}var retryDelays=this.options.retryDelays;if(retryDelays!=null){if(Object.prototype.toString.call(retryDelays)!=="[object Array]"){this._emitError(new Error("tus: the `retryDelays` option must either be an array or null"));return}else{var errorCallback=this.options.onError;this.options.onError=function(err){_this2.options.onError=errorCallback;var shouldResetDelays=_this2._offset!=null&&_this2._offset>_this2._offsetBeforeRetry;if(shouldResetDelays){_this2._retryAttempt=0}var isOnline=true;if(typeof window!=="undefined"&&"navigator"in window&&window.navigator.onLine===false){isOnline=false}var status=err.originalRequest?err.originalRequest.status:0;var isServerError=!inStatusCategory(status,400)||status===409||status===423;var shouldRetry=_this2._retryAttempt<retryDelays.length&&err.originalRequest!=null&&isServerError&&isOnline;if(!shouldRetry){_this2._emitError(err);return}var delay=retryDelays[_this2._retryAttempt++];_this2._offsetBeforeRetry=_this2._offset;_this2.options.uploadUrl=_this2.url;_this2._retryTimeout=setTimeout(function(){_this2.start()},delay)}}}this._aborted=false;if(this.url!=null){this._resumeUpload();return}if(this.options.uploadUrl!=null){this.url=this.options.uploadUrl;this._resumeUpload();return}if(this._hasStorage()){this.options.fingerprint(file,this.options,function(err,fingerprintValue){if(err){_this2._emitError(err);return}_this2._fingerprint=fingerprintValue;_this2._storage.getItem(_this2._fingerprint,function(err,resumedUrl){if(err){_this2._emitError(err);return}if(resumedUrl!=null){_this2.url=resumedUrl;_this2._resumeUpload()}else{_this2._createUpload()}})})}else{this._createUpload()}}},{key:"abort",value:function abort(shouldTerminate,cb){var _this3=this;if(this._xhr!==null){this._xhr.abort();this._source.close()}this._aborted=true;if(this._retryTimeout!=null){clearTimeout(this._retryTimeout);this._retryTimeout=null}cb=cb||function(){};if(shouldTerminate){Upload.terminate(this.url,this.options,function(err,xhr){if(err){return cb(err,xhr)}_this3._hasStorage()?_this3._storage.removeItem(_this3._fingerprint,cb):cb()})}else{cb()}}},{key:"_hasStorage",value:function _hasStorage(){return this.options.resume&&this._storage}},{key:"_emitXhrError",value:function _emitXhrError(xhr,err,causingErr){this._emitError(new _error2.default(err,causingErr,xhr))}},{key:"_emitError",value:function _emitError(err){if(typeof this.options.onError==="function"){this.options.onError(err)}else{throw err}}},{key:"_emitSuccess",value:function _emitSuccess(){if(typeof this.options.onSuccess==="function"){this.options.onSuccess()}}},{key:"_emitProgress",value:function _emitProgress(bytesSent,bytesTotal){if(typeof this.options.onProgress==="function"){this.options.onProgress(bytesSent,bytesTotal)}}},{key:"_emitChunkComplete",value:function _emitChunkComplete(chunkSize,bytesAccepted,bytesTotal){if(typeof this.options.onChunkComplete==="function"){this.options.onChunkComplete(chunkSize,bytesAccepted,bytesTotal)}}},{key:"_setupXHR",value:function _setupXHR(xhr){this._xhr=xhr;setupXHR(xhr,this.options)}},{key:"_createUpload",value:function _createUpload(){var _this4=this;if(!this.options.endpoint){this._emitError(new Error("tus: unable to create upload because no endpoint is provided"));return}var xhr=(0,_request.newRequest)();xhr.open("POST",this.options.endpoint,true);xhr.onload=function(){if(!inStatusCategory(xhr.status,200)){_this4._emitXhrError(xhr,new Error("tus: unexpected response while creating upload"));return}var location=xhr.getResponseHeader("Location");if(location==null){_this4._emitXhrError(xhr,new Error("tus: invalid or missing Location header"));return}_this4.url=(0,_request.resolveUrl)(_this4.options.endpoint,location);if(_this4._size===0){_this4._emitSuccess();_this4._source.close();return}if(_this4._hasStorage()){_this4._storage.setItem(_this4._fingerprint,_this4.url,function(err){if(err){_this4._emitError(err)}})}if(_this4.options.uploadDataDuringCreation){_this4._handleUploadResponse(xhr)}else{_this4._offset=0;_this4._startUpload()}};xhr.onerror=function(err){_this4._emitXhrError(xhr,new Error("tus: failed to create upload"),err)};this._setupXHR(xhr);if(this.options.uploadLengthDeferred){xhr.setRequestHeader("Upload-Defer-Length",1)}else{xhr.setRequestHeader("Upload-Length",this._size)}var metadata=encodeMetadata(this.options.metadata);if(metadata!==""){xhr.setRequestHeader("Upload-Metadata",metadata)}if(this.options.uploadDataDuringCreation&&!this.options.uploadLengthDeferred){this._offset=0;this._addChunkToRequest(xhr)}else{xhr.send(null)}}},{key:"_resumeUpload",value:function _resumeUpload(){var _this5=this;var xhr=(0,_request.newRequest)();xhr.open("HEAD",this.url,true);xhr.onload=function(){if(!inStatusCategory(xhr.status,200)){if(_this5._hasStorage()&&inStatusCategory(xhr.status,400)){_this5._storage.removeItem(_this5._fingerprint,function(err){if(err){_this5._emitError(err)}})}if(xhr.status===423){_this5._emitXhrError(xhr,new Error("tus: upload is currently locked; retry later"));return}if(!_this5.options.endpoint){_this5._emitXhrError(xhr,new Error("tus: unable to resume upload (new upload cannot be created without an endpoint)"));return}_this5.url=null;_this5._createUpload();return}var offset=parseInt(xhr.getResponseHeader("Upload-Offset"),10);if(isNaN(offset)){_this5._emitXhrError(xhr,new Error("tus: invalid or missing offset value"));return}var length=parseInt(xhr.getResponseHeader("Upload-Length"),10);if(isNaN(length)&&!_this5.options.uploadLengthDeferred){_this5._emitXhrError(xhr,new Error("tus: invalid or missing length value"));return}if(offset===length){_this5._emitProgress(length,length);_this5._emitSuccess();return}_this5._offset=offset;_this5._startUpload()};xhr.onerror=function(err){_this5._emitXhrError(xhr,new Error("tus: failed to resume upload"),err)};this._setupXHR(xhr);xhr.send(null)}},{key:"_startUpload",value:function _startUpload(){var _this6=this;if(this._aborted){return}var xhr=(0,_request.newRequest)();if(this.options.overridePatchMethod){xhr.open("POST",this.url,true);xhr.setRequestHeader("X-HTTP-Method-Override","PATCH")}else{xhr.open("PATCH",this.url,true)}xhr.onload=function(){if(!inStatusCategory(xhr.status,200)){_this6._emitXhrError(xhr,new Error("tus: unexpected response while uploading chunk"));return}_this6._handleUploadResponse(xhr)};xhr.onerror=function(err){if(_this6._aborted){return}_this6._emitXhrError(xhr,new Error("tus: failed to upload chunk at offset "+_this6._offset),err)};this._setupXHR(xhr);xhr.setRequestHeader("Upload-Offset",this._offset);this._addChunkToRequest(xhr)}},{key:"_addChunkToRequest",value:function _addChunkToRequest(xhr){var _this7=this;if("upload"in xhr){xhr.upload.onprogress=function(e){if(!e.lengthComputable){return}_this7._emitProgress(start+e.loaded,_this7._size)}}xhr.setRequestHeader("Content-Type","application/offset+octet-stream");var start=this._offset;var end=this._offset+this.options.chunkSize;if((end===Infinity||end>this._size)&&!this.options.uploadLengthDeferred){end=this._size}this._source.slice(start,end,function(err,value,complete){if(err){_this7._emitError(err);return}if(_this7.options.uploadLengthDeferred){if(complete){_this7._size=_this7._offset+(value&&value.size?value.size:0);xhr.setRequestHeader("Upload-Length",_this7._size)}}if(value===null){xhr.send()}else{xhr.send(value);_this7._emitProgress(_this7._offset,_this7._size)}})}},{key:"_handleUploadResponse",value:function _handleUploadResponse(xhr){var _this8=this;var offset=parseInt(xhr.getResponseHeader("Upload-Offset"),10);if(isNaN(offset)){this._emitXhrError(xhr,new Error("tus: invalid or missing offset value"));return}this._emitProgress(offset,this._size);this._emitChunkComplete(offset-this._offset,offset,this._size);this._offset=offset;if(offset==this._size){if(this.options.removeFingerprintOnSuccess&&this.options.resume){this._storage.removeItem(this._fingerprint,function(err){if(err){_this8._emitError(err)}})}this._emitSuccess();this._source.close();return}this._startUpload()}}],[{key:"terminate",value:function terminate(url,options,cb){if(typeof options!=="function"&&typeof cb!=="function"){throw new Error("tus: a callback function must be specified")}if(typeof options==="function"){cb=options;options={}}var xhr=(0,_request.newRequest)();xhr.open("DELETE",url,true);xhr.onload=function(){if(xhr.status!==204){cb(new _error2.default(new Error("tus: unexpected response while terminating upload"),null,xhr));return}cb()};xhr.onerror=function(err){cb(new _error2.default(err,new Error("tus: failed to terminate upload"),xhr))};setupXHR(xhr,options);xhr.send(null)}}]);return Upload}();function encodeMetadata(metadata){var encoded=[];for(var key in metadata){encoded.push(key+" "+_jsBase.Base64.encode(metadata[key]))}return encoded.join(",")}function inStatusCategory(status,category){return status>=category&&status<category+100}function setupXHR(xhr,options){xhr.setRequestHeader("Tus-Resumable","1.0.0");var headers=options.headers||{};for(var name in headers){xhr.setRequestHeader(name,headers[name])}xhr.withCredentials=options.withCredentials}Upload.defaultOptions=defaultOptions;exports.default=Upload},{"./error":9,"./node/fingerprint":1,"./node/request":5,"./node/source":6,"./node/storage":7,extend:12,"js-base64":13}],12:[function(_dereq_,module,exports){"use strict";var hasOwn=Object.prototype.hasOwnProperty;var toStr=Object.prototype.toString;var defineProperty=Object.defineProperty;var gOPD=Object.getOwnPropertyDescriptor;var isArray=function isArray(arr){if(typeof Array.isArray==="function"){return Array.isArray(arr)}return toStr.call(arr)==="[object Array]"};var isPlainObject=function isPlainObject(obj){if(!obj||toStr.call(obj)!=="[object Object]"){return false}var hasOwnConstructor=hasOwn.call(obj,"constructor");var hasIsPrototypeOf=obj.constructor&&obj.constructor.prototype&&hasOwn.call(obj.constructor.prototype,"isPrototypeOf");if(obj.constructor&&!hasOwnConstructor&&!hasIsPrototypeOf){return false}var key;for(key in obj){}return typeof key==="undefined"||hasOwn.call(obj,key)};var setProperty=function setProperty(target,options){if(defineProperty&&options.name==="__proto__"){defineProperty(target,options.name,{enumerable:true,configurable:true,value:options.newValue,writable:true})}else{target[options.name]=options.newValue}};var getProperty=function getProperty(obj,name){if(name==="__proto__"){if(!hasOwn.call(obj,name)){return void 0}else if(gOPD){return gOPD(obj,name).value}}return obj[name]};module.exports=function extend(){var options,name,src,copy,copyIsArray,clone;var target=arguments[0];var i=1;var length=arguments.length;var deep=false;if(typeof target==="boolean"){deep=target;target=arguments[1]||{};i=2}if(target==null||typeof target!=="object"&&typeof target!=="function"){target={}}for(;i<length;++i){options=arguments[i];if(options!=null){for(name in options){src=getProperty(target,name);copy=getProperty(options,name);if(target!==copy){if(deep&&copy&&(isPlainObject(copy)||(copyIsArray=isArray(copy)))){if(copyIsArray){copyIsArray=false;clone=src&&isArray(src)?src:[]}else{clone=src&&isPlainObject(src)?src:{}}setProperty(target,{name:name,newValue:extend(deep,clone,copy)})}else if(typeof copy!=="undefined"){setProperty(target,{name:name,newValue:copy})}}}}}return target}},{}],13:[function(_dereq_,module,exports){(function(global){(function(global,factory){typeof exports==="object"&&typeof module!=="undefined"?module.exports=factory(global):typeof define==="function"&&define.amd?define(factory):factory(global)})(typeof self!=="undefined"?self:typeof window!=="undefined"?window:typeof global!=="undefined"?global:this,function(global){"use strict";var _Base64=global.Base64;var version="2.4.9";var buffer;if(typeof module!=="undefined"&&module.exports){try{buffer=eval("require('buffer').Buffer")}catch(err){buffer=undefined}}var b64chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var b64tab=function(bin){var t={};for(var i=0,l=bin.length;i<l;i++)t[bin.charAt(i)]=i;return t}(b64chars);var fromCharCode=String.fromCharCode;var cb_utob=function(c){if(c.length<2){var cc=c.charCodeAt(0);return cc<128?c:cc<2048?fromCharCode(192|cc>>>6)+fromCharCode(128|cc&63):fromCharCode(224|cc>>>12&15)+fromCharCode(128|cc>>>6&63)+fromCharCode(128|cc&63)}else{var cc=65536+(c.charCodeAt(0)-55296)*1024+(c.charCodeAt(1)-56320);return fromCharCode(240|cc>>>18&7)+fromCharCode(128|cc>>>12&63)+fromCharCode(128|cc>>>6&63)+fromCharCode(128|cc&63)}};var re_utob=/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;var utob=function(u){return u.replace(re_utob,cb_utob)};var cb_encode=function(ccc){var padlen=[0,2,1][ccc.length%3],ord=ccc.charCodeAt(0)<<16|(ccc.length>1?ccc.charCodeAt(1):0)<<8|(ccc.length>2?ccc.charCodeAt(2):0),chars=[b64chars.charAt(ord>>>18),b64chars.charAt(ord>>>12&63),padlen>=2?"=":b64chars.charAt(ord>>>6&63),padlen>=1?"=":b64chars.charAt(ord&63)];return chars.join("")};var btoa=global.btoa?function(b){return global.btoa(b)}:function(b){return b.replace(/[\s\S]{1,3}/g,cb_encode)};var _encode=buffer?buffer.from&&Uint8Array&&buffer.from!==Uint8Array.from?function(u){return(u.constructor===buffer.constructor?u:buffer.from(u)).toString("base64")}:function(u){return(u.constructor===buffer.constructor?u:new buffer(u)).toString("base64")}:function(u){return btoa(utob(u))};var encode=function(u,urisafe){return!urisafe?_encode(String(u)):_encode(String(u)).replace(/[+\/]/g,function(m0){return m0=="+"?"-":"_"}).replace(/=/g,"")};var encodeURI=function(u){return encode(u,true)};var re_btou=new RegExp(["[À-ß][-¿]","[à-ï][-¿]{2}","[ð-÷][-¿]{3}"].join("|"),"g");var cb_btou=function(cccc){switch(cccc.length){case 4:var cp=(7&cccc.charCodeAt(0))<<18|(63&cccc.charCodeAt(1))<<12|(63&cccc.charCodeAt(2))<<6|63&cccc.charCodeAt(3),offset=cp-65536;return fromCharCode((offset>>>10)+55296)+fromCharCode((offset&1023)+56320);case 3:return fromCharCode((15&cccc.charCodeAt(0))<<12|(63&cccc.charCodeAt(1))<<6|63&cccc.charCodeAt(2));default:return fromCharCode((31&cccc.charCodeAt(0))<<6|63&cccc.charCodeAt(1))}};var btou=function(b){return b.replace(re_btou,cb_btou)};var cb_decode=function(cccc){var len=cccc.length,padlen=len%4,n=(len>0?b64tab[cccc.charAt(0)]<<18:0)|(len>1?b64tab[cccc.charAt(1)]<<12:0)|(len>2?b64tab[cccc.charAt(2)]<<6:0)|(len>3?b64tab[cccc.charAt(3)]:0),chars=[fromCharCode(n>>>16),fromCharCode(n>>>8&255),fromCharCode(n&255)];chars.length-=[0,0,2,1][padlen];return chars.join("")};var atob=global.atob?function(a){return global.atob(a)}:function(a){return a.replace(/[\s\S]{1,4}/g,cb_decode)};var _decode=buffer?buffer.from&&Uint8Array&&buffer.from!==Uint8Array.from?function(a){return(a.constructor===buffer.constructor?a:buffer.from(a,"base64")).toString()}:function(a){return(a.constructor===buffer.constructor?a:new buffer(a,"base64")).toString()}:function(a){return btou(atob(a))};var decode=function(a){return _decode(String(a).replace(/[-_]/g,function(m0){return m0=="-"?"+":"/"}).replace(/[^A-Za-z0-9\+\/]/g,""))};var noConflict=function(){var Base64=global.Base64;global.Base64=_Base64;return Base64};global.Base64={VERSION:version,atob:atob,btoa:btoa,fromBase64:decode,toBase64:encode,utob:utob,encode:encode,encodeURI:encodeURI,btou:btou,decode:decode,noConflict:noConflict,__buffer__:buffer};if(typeof Object.defineProperty==="function"){var noEnum=function(v){return{value:v,enumerable:false,writable:true,configurable:true}};global.Base64.extendString=function(){Object.defineProperty(String.prototype,"fromBase64",noEnum(function(){return decode(this)}));Object.defineProperty(String.prototype,"toBase64",noEnum(function(urisafe){return encode(this,urisafe)}));Object.defineProperty(String.prototype,"toBase64URI",noEnum(function(){return encode(this,true)}))}}if(global["Meteor"]){Base64=global.Base64}if(typeof module!=="undefined"&&module.exports){module.exports.Base64=global.Base64}else if(typeof define==="function"&&define.amd){define([],function(){return global.Base64})}return{Base64:global.Base64}})}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],14:[function(_dereq_,module,exports){"use strict";var has=Object.prototype.hasOwnProperty;function decode(input){return decodeURIComponent(input.replace(/\+/g," "))}function querystring(query){var parser=/([^=?&]+)=?([^&]*)/g,result={},part;while(part=parser.exec(query)){var key=decode(part[1]),value=decode(part[2]);

if(key in result)continue;result[key]=value}return result}function querystringify(obj,prefix){prefix=prefix||"";var pairs=[];if("string"!==typeof prefix)prefix="?";for(var key in obj){if(has.call(obj,key)){pairs.push(encodeURIComponent(key)+"="+encodeURIComponent(obj[key]))}}return pairs.length?prefix+pairs.join("&"):""}exports.stringify=querystringify;exports.parse=querystring},{}],15:[function(_dereq_,module,exports){"use strict";module.exports=function required(port,protocol){protocol=protocol.split(":")[0];port=+port;if(!port)return false;switch(protocol){case"http":case"ws":return port!==80;case"https":case"wss":return port!==443;case"ftp":return port!==21;case"gopher":return port!==70;case"file":return false}return port!==0}},{}],16:[function(_dereq_,module,exports){(function(global){"use strict";var required=_dereq_("requires-port"),qs=_dereq_("querystringify"),protocolre=/^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i,slashes=/^[A-Za-z][A-Za-z0-9+-.]*:\/\//;var rules=[["#","hash"],["?","query"],function sanitize(address){return address.replace("\\","/")},["/","pathname"],["@","auth",1],[NaN,"host",undefined,1,1],[/:(\d+)$/,"port",undefined,1],[NaN,"hostname",undefined,1,1]];var ignore={hash:1,query:1};function lolcation(loc){var location=global&&global.location||{};loc=loc||location;var finaldestination={},type=typeof loc,key;if("blob:"===loc.protocol){finaldestination=new Url(unescape(loc.pathname),{})}else if("string"===type){finaldestination=new Url(loc,{});for(key in ignore)delete finaldestination[key]}else if("object"===type){for(key in loc){if(key in ignore)continue;finaldestination[key]=loc[key]}if(finaldestination.slashes===undefined){finaldestination.slashes=slashes.test(loc.href)}}return finaldestination}function extractProtocol(address){var match=protocolre.exec(address);return{protocol:match[1]?match[1].toLowerCase():"",slashes:!!match[2],rest:match[3]}}function resolve(relative,base){var path=(base||"/").split("/").slice(0,-1).concat(relative.split("/")),i=path.length,last=path[i-1],unshift=false,up=0;while(i--){if(path[i]==="."){path.splice(i,1)}else if(path[i]===".."){path.splice(i,1);up++}else if(up){if(i===0)unshift=true;path.splice(i,1);up--}}if(unshift)path.unshift("");if(last==="."||last==="..")path.push("");return path.join("/")}function Url(address,location,parser){if(!(this instanceof Url)){return new Url(address,location,parser)}var relative,extracted,parse,instruction,index,key,instructions=rules.slice(),type=typeof location,url=this,i=0;if("object"!==type&&"string"!==type){parser=location;location=null}if(parser&&"function"!==typeof parser)parser=qs.parse;location=lolcation(location);extracted=extractProtocol(address||"");relative=!extracted.protocol&&!extracted.slashes;url.slashes=extracted.slashes||relative&&location.slashes;url.protocol=extracted.protocol||location.protocol||"";address=extracted.rest;if(!extracted.slashes)instructions[3]=[/(.*)/,"pathname"];for(;i<instructions.length;i++){instruction=instructions[i];if(typeof instruction==="function"){address=instruction(address);continue}parse=instruction[0];key=instruction[1];if(parse!==parse){url[key]=address}else if("string"===typeof parse){if(~(index=address.indexOf(parse))){if("number"===typeof instruction[2]){url[key]=address.slice(0,index);address=address.slice(index+instruction[2])}else{url[key]=address.slice(index);address=address.slice(0,index)}}}else if(index=parse.exec(address)){url[key]=index[1];address=address.slice(0,index.index)}url[key]=url[key]||(relative&&instruction[3]?location[key]||"":"");if(instruction[4])url[key]=url[key].toLowerCase()}if(parser)url.query=parser(url.query);if(relative&&location.slashes&&url.pathname.charAt(0)!=="/"&&(url.pathname!==""||location.pathname!=="")){url.pathname=resolve(url.pathname,location.pathname)}if(!required(url.port,url.protocol)){url.host=url.hostname;url.port=""}url.username=url.password="";if(url.auth){instruction=url.auth.split(":");url.username=instruction[0]||"";url.password=instruction[1]||""}url.origin=url.protocol&&url.host&&url.protocol!=="file:"?url.protocol+"//"+url.host:"null";url.href=url.toString()}function set(part,value,fn){var url=this;switch(part){case"query":if("string"===typeof value&&value.length){value=(fn||qs.parse)(value)}url[part]=value;break;case"port":url[part]=value;if(!required(value,url.protocol)){url.host=url.hostname;url[part]=""}else if(value){url.host=url.hostname+":"+value}break;case"hostname":url[part]=value;if(url.port)value+=":"+url.port;url.host=value;break;case"host":url[part]=value;if(/:\d+$/.test(value)){value=value.split(":");url.port=value.pop();url.hostname=value.join(":")}else{url.hostname=value;url.port=""}break;case"protocol":url.protocol=value.toLowerCase();url.slashes=!fn;break;case"pathname":case"hash":if(value){var char=part==="pathname"?"/":"#";url[part]=value.charAt(0)!==char?char+value:value}else{url[part]=value}break;default:url[part]=value}for(var i=0;i<rules.length;i++){var ins=rules[i];if(ins[4])url[ins[1]]=url[ins[1]].toLowerCase()}url.origin=url.protocol&&url.host&&url.protocol!=="file:"?url.protocol+"//"+url.host:"null";url.href=url.toString();return url}function toString(stringify){if(!stringify||"function"!==typeof stringify)stringify=qs.stringify;var query,url=this,protocol=url.protocol;if(protocol&&protocol.charAt(protocol.length-1)!==":")protocol+=":";var result=protocol+(url.slashes?"//":"");if(url.username){result+=url.username;if(url.password)result+=":"+url.password;result+="@"}result+=url.host+url.pathname;query="object"===typeof url.query?stringify(url.query):url.query;if(query)result+="?"!==query.charAt(0)?"?"+query:query;if(url.hash)result+=url.hash;return result}Url.prototype={set:set,toString:toString};Url.extractProtocol=extractProtocol;Url.location=lolcation;Url.qs=qs;module.exports=Url}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{querystringify:14,"requires-port":15}]},{},[10])(10)});//# sourceMappingURL=tus.min.js.map
export default tus;
