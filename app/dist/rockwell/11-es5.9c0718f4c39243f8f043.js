function _classCallCheck(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,n){for(var e=0;e<n.length;e++){var c=n[e];c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(t,c.key,c)}}function _createClass(t,n,e){return n&&_defineProperties(t.prototype,n),e&&_defineProperties(t,e),t}(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{IF2i:function(t,n,e){"use strict";e.r(n),e.d(n,"WatchModule",(function(){return C}));var c=e("fXoL"),i=e("58qO"),a=e("/t3+"),o=e("bTqV"),s=e("tyNb"),r=e("NFeN"),l=e("V687"),p=e("ofXK");function d(t,n){if(1&t&&(c.Vb(0,"div",3),c.Vb(1,"h1"),c.xc(2),c.Ub(),c.Vb(3,"p"),c.xc(4),c.Ub(),c.Ub()),2&t){var e=n.$implicit;c.Cb(2),c.zc(" ",e.as," "),c.Cb(2),c.zc(" ",e.value," ")}}var g,u,b=((g=function(){function t(n){_classCallCheck(this,t),this.socket=n,this.inputs=[],this.subscriptions={}}return _createClass(t,[{key:"ngOnInit",value:function(){var t=this;this.subscriptions.socket=this.socket.data.subscribe((function(n){n&&Array.isArray(n.inputs)&&(t.inputs=n.inputs)}))}},{key:"ngOnDestroy",value:function(){this.subscriptions.socket.unsubscribe()}}]),t}()).\u0275fac=function(t){return new(t||g)(c.Pb(i.a))},g.\u0275cmp=c.Jb({type:g,selectors:[["watch-page"]],decls:8,vars:1,consts:[[1,"page-title","spacer"],["mat-icon-button","","routerLink","/"],["class","widget",4,"ngFor","ngForOf"],[1,"widget"]],template:function(t,n){1&t&&(c.Vb(0,"mat-toolbar"),c.Vb(1,"div",0),c.xc(2," Rockwell Plugin "),c.Ub(),c.Vb(3,"button",1),c.Vb(4,"mat-icon"),c.xc(5," close "),c.Ub(),c.Ub(),c.Ub(),c.Vb(6,"mat-content"),c.wc(7,d,5,2,"div",2),c.Ub()),2&t&&(c.Cb(7),c.mc("ngForOf",n.inputs))},directives:[a.a,o.a,s.b,r.a,l.a,p.j],styles:["mat-content[_ngcontent-%COMP%]{padding:5px;display:flex;flex-wrap:wrap;flex-direction:row}mat-content[_ngcontent-%COMP%]   .widget[_ngcontent-%COMP%]{flex:0 calc(20% - 10px);width:calc(20% - 10px);margin:5px;display:flex;border-radius:5px;flex-direction:column;background-color:#fafafa}mat-content[_ngcontent-%COMP%]   .widget[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:14px;font-weight:500;line-height:14px}mat-content[_ngcontent-%COMP%]   .widget[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], mat-content[_ngcontent-%COMP%]   .widget[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:5px!important;text-transform:uppercase}mat-content[_ngcontent-%COMP%]   .widget[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{height:50px;display:flex;font-size:32px;line-height:32px;align-items:center;justify-content:center}@media screen and (max-width:1500px){mat-content[_ngcontent-%COMP%]   .widget[_ngcontent-%COMP%]{flex:0 calc(25% - 10px);width:calc(25% - 10px)}}@media screen and (max-width:1200px){mat-content[_ngcontent-%COMP%]   .widget[_ngcontent-%COMP%]{flex:0 calc(33.33% - 10px);width:calc(33.33% - 10px)}}@media screen and (max-width:900px){mat-content[_ngcontent-%COMP%]   .widget[_ngcontent-%COMP%]{flex:0 calc(50% - 10px);width:calc(50% - 10px)}}@media screen and (max-width:600px){mat-content[_ngcontent-%COMP%]   .widget[_ngcontent-%COMP%]{flex:0 calc(100% - 10px);width:calc(100% - 10px)}}"]}),g),f=e("zJjZ"),x=e("Qu3c"),h=e("Rh7z"),w=e("bv9b"),m=[{path:"",component:b}],C=((u=function t(){_classCallCheck(this,t)}).\u0275mod=c.Nb({type:u}),u.\u0275inj=c.Mb({factory:function(t){return new(t||u)},imports:[[p.c,r.b,f.a,o.b,x.a,a.b,h.a,w.b,s.c.forChild(m)]]}),u)}}]);