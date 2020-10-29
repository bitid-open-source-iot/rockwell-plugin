function _toConsumableArray(t){return _arrayWithoutHoles(t)||_iterableToArray(t)||_unsupportedIterableToArray(t)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(t,e):void 0}}function _iterableToArray(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function _arrayWithoutHoles(t){if(Array.isArray(t))return _arrayLikeToArray(t)}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function _defineProperties(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function _createClass(t,e,r){return e&&_defineProperties(t.prototype,e),r&&_defineProperties(t,r),t}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(t){var e=_isNativeReflectConstruct();return function(){var r,n=_getPrototypeOf(t);if(e){var o=_getPrototypeOf(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return _possibleConstructorReturn(this,r)}}function _possibleConstructorReturn(t,e){return!e||"object"!=typeof e&&"function"!=typeof e?_assertThisInitialized(t):e}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{"/t3+":function(t,e,r){"use strict";r.d(e,"a",(function(){return f})),r.d(e,"b",(function(){return b}));var n=r("fXoL"),o=r("FKr1"),i=r("ofXK"),a=r("nLfN"),c=["*",[["mat-toolbar-row"]]],s=["*","mat-toolbar-row"],u=Object(o.l)((function t(e){_classCallCheck(this,t),this._elementRef=e})),l=function(){var t=function t(){_classCallCheck(this,t)};return t.\u0275fac=function(e){return new(e||t)},t.\u0275dir=n.Kb({type:t,selectors:[["mat-toolbar-row"]],hostAttrs:[1,"mat-toolbar-row"],exportAs:["matToolbarRow"]}),t}(),f=function(){var t=function(t){_inherits(r,t);var e=_createSuper(r);function r(t,n,o){var i;return _classCallCheck(this,r),(i=e.call(this,t))._platform=n,i._document=o,i}return _createClass(r,[{key:"ngAfterViewInit",value:function(){var t=this;Object(n.W)()&&this._platform.isBrowser&&(this._checkToolbarMixedModes(),this._toolbarRows.changes.subscribe((function(){return t._checkToolbarMixedModes()})))}},{key:"_checkToolbarMixedModes",value:function(){var t=this;this._toolbarRows.length&&Array.from(this._elementRef.nativeElement.childNodes).filter((function(t){return!(t.classList&&t.classList.contains("mat-toolbar-row"))})).filter((function(e){return e.nodeType!==(t._document?t._document.COMMENT_NODE:8)})).some((function(t){return!(!t.textContent||!t.textContent.trim())}))&&function(){throw Error("MatToolbar: Attempting to combine different toolbar modes. Either specify multiple `<mat-toolbar-row>` elements explicitly or just place content inside of a `<mat-toolbar>` for a single row.")}()}}]),r}(u);return t.\u0275fac=function(e){return new(e||t)(n.Pb(n.l),n.Pb(a.a),n.Pb(i.d))},t.\u0275cmp=n.Jb({type:t,selectors:[["mat-toolbar"]],contentQueries:function(t,e,r){var o;1&t&&n.Ib(r,l,!0),2&t&&n.nc(o=n.ec())&&(e._toolbarRows=o)},hostAttrs:[1,"mat-toolbar"],hostVars:4,hostBindings:function(t,e){2&t&&n.Gb("mat-toolbar-multiple-rows",e._toolbarRows.length>0)("mat-toolbar-single-row",0===e._toolbarRows.length)},inputs:{color:"color"},exportAs:["matToolbar"],features:[n.zb],ngContentSelectors:s,decls:2,vars:0,template:function(t,e){1&t&&(n.lc(c),n.kc(0),n.kc(1,1))},styles:[".cdk-high-contrast-active .mat-toolbar{outline:solid 1px}.mat-toolbar-row,.mat-toolbar-single-row{display:flex;box-sizing:border-box;padding:0 16px;width:100%;flex-direction:row;align-items:center;white-space:nowrap}.mat-toolbar-multiple-rows{display:flex;box-sizing:border-box;flex-direction:column;width:100%}.mat-toolbar-multiple-rows{min-height:64px}.mat-toolbar-row,.mat-toolbar-single-row{height:64px}@media(max-width: 599px){.mat-toolbar-multiple-rows{min-height:56px}.mat-toolbar-row,.mat-toolbar-single-row{height:56px}}\n"],encapsulation:2,changeDetection:0}),t}(),b=function(){var t=function t(){_classCallCheck(this,t)};return t.\u0275mod=n.Nb({type:t}),t.\u0275inj=n.Mb({factory:function(e){return new(e||t)},imports:[[o.d],o.d]}),t}()},"9PJG":function(t,e,r){"use strict";r.r(e),r.d(e,"SigninModule",(function(){return k}));var n=r("mrSG"),o=r("3Pt+"),i=r("fXoL"),a=r("9ZKQ"),c=r("tyNb"),s=r("IRyT"),u=r("dWDE"),l=r("/t3+"),f=r("V687"),b=r("kmnG"),p=r("qFsG"),m=r("ofXK"),d=r("bTqV"),h=r("Xa2L");function y(t,e){if(1&t&&(i.Vb(0,"mat-error"),i.xc(1),i.Ub()),2&t){var r=i.hc();i.Cb(1),i.zc(" ",r.errors.email," ")}}function g(t,e){if(1&t&&(i.Vb(0,"mat-error"),i.xc(1),i.Ub()),2&t){var r=i.hc();i.Cb(1),i.zc(" ",r.errors.password," ")}}function w(t,e){1&t&&i.Qb(0,"mat-progress-spinner",9)}var _,v,C=((_=function(){function t(e,r,n,i){_classCallCheck(this,t),this.toast=e,this.router=r,this.service=n,this.formerror=i,this.form=new o.d({email:new o.b(null,[o.p.required]),password:new o.b(null,[o.p.required])}),this.errors={email:"",password:""},this.subscriptions={}}return _createClass(t,[{key:"submit",value:function(){return Object(n.a)(this,void 0,void 0,regeneratorRuntime.mark((function t(){var e;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.form.invalid){t.next=6;break}return this.loading=!0,t.next=4,this.service.login(this.form.value);case 4:(e=t.sent).ok?(this.toast.success("Sign in successful!"),this.router.navigate(["/"])):(this.toast.error(e.error.message),this.router.navigate(["/"])),this.loading=!1;case 6:case"end":return t.stop()}}),t,this)})))}},{key:"ngOnInit",value:function(){var t=this;this.subscriptions.form=this.form.valueChanges.subscribe((function(e){t.errors=t.formerror.validateForm(t.form,t.errors,!0)}))}},{key:"ngOnDestroy",value:function(){this.subscriptions.form.unsubscribe()}}]),t}()).\u0275fac=function(t){return new(t||_)(i.Pb(a.a),i.Pb(c.a),i.Pb(s.a),i.Pb(u.a))},_.\u0275cmp=i.Jb({type:_,selectors:[["signin-page"]],decls:19,vars:5,consts:[[1,"page-title","spacer"],[1,"container"],[3,"formGroup","ngSubmit"],["appearance","outline"],["matInput","","type","email","name","email","placeholder","email","formControlName","email","required",""],[4,"ngIf"],["matInput","","type","password","name","password","placeholder","password","formControlName","password","required",""],["type","submit","mat-flat-button","","color","dark"],["mode","indeterminate","diameter","30",4,"ngIf"],["mode","indeterminate","diameter","30"]],template:function(t,e){1&t&&(i.Vb(0,"mat-toolbar"),i.Vb(1,"div",0),i.xc(2," Sign In "),i.Ub(),i.Ub(),i.Vb(3,"mat-content"),i.Vb(4,"div",1),i.Vb(5,"form",2),i.dc("ngSubmit",(function(){return!e.loading&&!e.form.invalid&&e.submit()})),i.Vb(6,"mat-form-field",3),i.Vb(7,"mat-label"),i.xc(8," Email "),i.Ub(),i.Qb(9,"input",4),i.wc(10,y,2,1,"mat-error",5),i.Ub(),i.Vb(11,"mat-form-field",3),i.Vb(12,"mat-label"),i.xc(13," Password "),i.Ub(),i.Qb(14,"input",6),i.wc(15,g,2,1,"mat-error",5),i.Ub(),i.Vb(16,"button",7),i.xc(17),i.wc(18,w,1,0,"mat-progress-spinner",8),i.Ub(),i.Ub(),i.Ub(),i.Ub()),2&t&&(i.Cb(5),i.mc("formGroup",e.form),i.Cb(5),i.mc("ngIf",e.errors.email),i.Cb(5),i.mc("ngIf",e.errors.password),i.Cb(2),i.zc(" ",e.loading?"":"submit"," "),i.Cb(1),i.mc("ngIf",e.loading))},directives:[l.a,f.a,o.q,o.j,o.e,b.c,b.f,p.a,o.a,o.i,o.c,o.o,m.k,d.a,b.b,h.a],styles:["form[_ngcontent-%COMP%]{margin:auto;max-width:400px!important}form[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center}"]}),_),x=r("Rh7z"),O=[{path:"",component:C}],k=((v=function t(){_classCallCheck(this,t)}).\u0275mod=i.Nb({type:v}),v.\u0275inj=i.Mb({factory:function(t){return new(t||v)},imports:[[o.g,m.c,p.b,d.b,l.b,x.a,b.e,o.n,h.b,c.c.forChild(O)]]}),v)},Rh7z:function(t,e,r){"use strict";r.d(e,"a",(function(){return i}));var n=r("ofXK"),o=r("fXoL"),i=function(){var t=function t(){_classCallCheck(this,t)};return t.\u0275mod=o.Nb({type:t}),t.\u0275inj=o.Mb({factory:function(e){return new(e||t)},imports:[[n.c]]}),t}()},V687:function(t,e,r){"use strict";r.d(e,"a",(function(){return i}));var n=r("fXoL"),o=["*"],i=function(){var t=function t(){_classCallCheck(this,t)};return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=n.Jb({type:t,selectors:[["mat-content"]],ngContentSelectors:o,decls:1,vars:0,template:function(t,e){1&t&&(n.lc(),n.kc(0))},styles:["mat-content{flex:1 auto;max-height:100%;overflow-y:auto}"],encapsulation:2}),t}()},cp0P:function(t,e,r){"use strict";r.d(e,"a",(function(){return s}));var n=r("HDdC"),o=r("DH7j"),i=r("lJxs"),a=r("XoHu"),c=r("Cfvw");function s(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];if(1===e.length){var n=e[0];if(Object(o.a)(n))return u(n,null);if(Object(a.a)(n)&&Object.getPrototypeOf(n)===Object.prototype){var c=Object.keys(n);return u(c.map((function(t){return n[t]})),c)}}if("function"==typeof e[e.length-1]){var s=e.pop();return u(e=1===e.length&&Object(o.a)(e[0])?e[0]:e,null).pipe(Object(i.a)((function(t){return s.apply(void 0,_toConsumableArray(t))})))}return u(e,null)}function u(t,e){return new n.a((function(r){var n=t.length;if(0!==n)for(var o=new Array(n),i=0,a=0,s=function(s){var u=Object(c.a)(t[s]),l=!1;r.add(u.subscribe({next:function(t){l||(l=!0,a++),o[s]=t},error:function(t){return r.error(t)},complete:function(){++i!==n&&l||(a===n&&r.next(e?e.reduce((function(t,e,r){return t[e]=o[r],t}),{}):o),r.complete())}}))},u=0;u<n;u++)s(u);else r.complete()}))}}}]);