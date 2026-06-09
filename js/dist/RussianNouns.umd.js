/*!
  RussianNounsJS v3.0.0-alpha.2
  Copyright (c) 2011-2026 Georgy Ustinov
  Released under the MIT license
*/
!function(n,r){
"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r((n="undefined"!=typeof globalThis?globalThis:n||self).RussianNouns={})
}(this,function(n){"use strict"
;var r=Object.freeze(["именительный","родительный","дательный","винительный","творительный","предложный","местный"]),e=Object.freeze({
NOMINATIVE:r[0],GENITIVE:r[1],DATIVE:r[2],ACCUSATIVE:r[3],INSTRUMENTAL:r[4],PREPOSITIONAL:r[5],LOCATIVE:r[6]
}),t=Object.fromEntries(r.map(function(n,r){return[n,r]}));function u(n){return"number"==typeof n?n:t[n]}
var i=Object.freeze(["женский","мужской","средний","общий"]),a=Object.freeze({FEMININE:i[0],MASCULINE:i[1],NEUTER:i[2],
COMMON:i[3]});function s(n,r){(null==r||r>n.length)&&(r=n.length);for(var e=0,t=Array(r);e<r;e++)t[e]=n[e];return t}
function f(n,r){if(!(n instanceof r))throw new TypeError("Cannot call a class as a function")}function c(n,r){
for(var e=0;e<r.length;e++){var t=r[e];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),
Object.defineProperty(n,E(t.key),t)}}function o(n,r,e){return r&&c(n.prototype,r),e&&c(n,e),
Object.defineProperty(n,"prototype",{writable:!1}),n}function h(n,r){
var e="undefined"!=typeof Symbol&&n[Symbol.iterator]||n["@@iterator"];if(!e){if(Array.isArray(n)||(e=v(n))||r){e&&(n=e)
;var t=0,u=function(){};return{s:u,n:function(){return t>=n.length?{done:!0}:{done:!1,value:n[t++]}},e:function(n){
throw n},f:u}}
throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}var i,a=!0,s=!1;return{s:function(){e=e.call(n)},n:function(){var n=e.next();return a=n.done,n},e:function(n){s=!0,i=n
},f:function(){try{a||null==e.return||e.return()}finally{if(s)throw i}}}}function l(n,r,e){
return(r=E(r))in n?Object.defineProperty(n,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[r]=e,n}
function d(n){return function(n){if(Array.isArray(n))return s(n)}(n)||function(n){
if("undefined"!=typeof Symbol&&null!=n[Symbol.iterator]||null!=n["@@iterator"])return Array.from(n)
}(n)||v(n)||function(){
throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}()}function E(n){var r=function(n,r){if("object"!=typeof n||!n)return n;var e=n[Symbol.toPrimitive];if(void 0!==e){
var t=e.call(n,r);if("object"!=typeof t)return t;throw new TypeError("@@toPrimitive must return a primitive value.")}
return String(n)}(n,"string");return"symbol"==typeof r?r:r+""}function v(n,r){if(n){if("string"==typeof n)return s(n,r)
;var e={}.toString.call(n).slice(8,-1);return"Object"===e&&n.constructor&&(e=n.constructor.name),
"Map"===e||"Set"===e?Array.from(n):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?s(n,r):void 0}}
function S(n){var r,e=new Set,t=0,u=h(n);try{for(u.s();!(r=u.n()).done;){t+=r.value,e.add(t)}}catch(n){u.e(n)}finally{
u.f()}return e}function p(n){return 1<<n}function g(n,r,e){this.preposition=n,this.word=r,this.attributes=e}
var m=Object.freeze({CONTAINER:1,LOCATION:2,STRUCTURE:4,SURFACE:8,WAY:16,OBJECT_WITH_FUNCTIONAL_SURFACE:32,SUBSTANCE:64,
RESOURCE:128,CONDITION:256,EXPOSURE:p(9),MOTION:p(10),EVENT:p(11),WITH_ADJECTIVE:p(12),WITHOUT_ADJECTIVE:p(13)
}),b=Object.freeze({V:1,VO:2,NA:3});function y(n,r,e){return e<<6|(n-1&7)<<3|r-1&7}function A(n){return 1+(7&n)}
var W="а".charCodeAt(0),w="А".charCodeAt(0),_="ё".charCodeAt(0),C="Ё".charCodeAt(0),O=1025===C,I=O?1024:C,N=O?1039:C,T=O?1104:_,x=O?1119:_,k=T-I
;function j(n){var r=n.charCodeAt(0),e=r-W;return r===_?32:e===(31&e)?1<<e:0}function M(n,r){return 0!==(n&j(r))}
var U=3892855073,P=66567902,L=66567390;function V(n){return M(U,n)}function R(n){return n.split("").filter(V).length}
function z(n){for(var r=5381,e=n.length,t=0;t<e;t++)r=33*r+n.charCodeAt(t)|0;return r>>>0}function D(n){
var r=n.replaceAll("ё","е"),e=r.length%2,t=1,u=5381;function i(){u=(33*u+(255&e))%4294967296,e>>=8,t-=8}var a,s=h(r)
;try{for(s.s();!(a=s.n()).done;){var f=a.value.charCodeAt(0)-W&31;e|=f<<t,(t+=5)>=8&&i()}}catch(n){s.e(n)}finally{s.f()}
t>0&&i();var c=r.charCodeAt(0)%2;return 2*(2147483647&u)+c}function F(n){for(var r=0;r<n.length;r++){
var e=n.charCodeAt(r);if(e>=w&&e<=w+31||e>=I&&e<=N)break;if(r===n.length-1)return n}
for(var t=new Array(n.length),u=0;u<n.length;u++){var i=n.charCodeAt(u);i>=w&&i<=w+31?i+=32:i>=I&&i<=N&&(i+=k),t[u]=i}
return String.fromCharCode.apply(null,t)}function B(n){if(O)return n.toLowerCase()
;for(var r=new Array(n.length),e=0;e<n.length;e++){var t=n.charCodeAt(e)
;t>=w&&t<=w+31||t>=65&&t<=90?t+=32:t>=I&&t<=N&&(t+=k),r[e]=t}return String.fromCharCode.apply(null,r)}function q(n,r){
return r===B(r)?n:function(n){for(var r=new Array(n.length),e=0;e<n.length;e++){var t=n.charCodeAt(e)
;t>=W&&t<=W+31?t-=32:t>=T&&t<=x&&(t-=k),r[e]=t}return String.fromCharCode.apply(null,r)}(n)}function G(n){
if(0===n.length)return"";var r=n.charCodeAt(0)
;return r>=W&&r<=W+31?String.fromCharCode(r-32)+n.slice(1):r>=T&&r<=x?String.fromCharCode(r-k)+n.slice(1):n}
function H(n,r){return n?r.map(G):r}function J(n){return n.replaceAll("ё","е").replaceAll("Ё","Е")}function X(n,r){
return n.substring(0,n.length-r)}function Y(n,r){return n.substring(n.length-r)}function $(n){return X(n,1)}
function K(n){return Q(n,1)}function Q(n,r){return n[n.length-r]||""}function Z(n,r){return 1===r.length&&n.includes(r)}
function nn(n,r){return r.some(function(r){return n.endsWith(r)})}var rn=function(){function n(r){f(this,n),
r instanceof n?(this._txt=r._txt,
this._lc=r._lc,this._hash=r._hash,this._flags=r._flags):(r.pluraleTantum?this._flags=5:this._flags=1+i.indexOf(r.gender),
this._txt=r.text,this._lc=B(r.text),this._hash=D(this._lc),this._flags|=8*(1&r.indeclinable),
this._flags|=16*(1&r.animate),this._flags|=32*(1&r.surname),this._flags|=64*(1&r.name),this._flags|=128*(1&r.transport),
this._flags|=p(16)*(2+function(n,r,e,t){if(r)return-2;if(t)return-1;var u=K(n);switch(e){case 1:
return"а"===u||"я"===u?2:M(P,u)?-1:3;case 2:return"а"===u||"я"===u?2:"путь"===n?0:1;case 3:
return["дитя","полудитя"].includes(n)?0:"мя"===Y(n,2)?3:1;case 4:return"а"===u||"я"===u?2:"и"===u?-1:1;default:return-2}
}(this._lc,r.pluraleTantum,en(this),r.indeclinable)))}return o(n,[{key:"equals",value:function(r){
return r instanceof n&&this._flags===r._flags&&this.lower()===r.lower()}},{key:"text",value:function(){return this._txt}
},{key:"lower",value:function(){return this._lc}},{key:"isPluraleTantum",value:function(){return 5==(7&this._flags)}},{
key:"getGender",value:function(){var n=en(this);if(n>=1&&n<=4)return i[n-1]}},{key:"isIndeclinable",value:function(){
return!!(8&this._flags)}},{key:"isAnimate",value:function(){return!!(16&this._flags)||this.isASurname()||this.isAName()}
},{key:"isASurname",value:function(){return!!(32&this._flags)}},{key:"isAName",value:function(){return!!(64&this._flags)
}},{key:"isATransport",value:function(){return!!(128&this._flags)}},{key:"getDeclension",value:function(){
return(this._flags>>16)-2}},{key:"getSchoolDeclension",value:function(){var n=this.getDeclension()
;return 1===n?2:2===n?1:n}}],[{key:"create",value:function(n){if(n instanceof this)return n;var r=un(n)
;if(r)throw new Error(r);return Object.freeze(new this(n))}},{key:"createOrNull",value:function(n){
return null===un(n)?Object.freeze(new this(n)):null}}])}();function en(n){return 7&n._flags}function tn(n,r){
var e=new rn(n);return e._txt=r,e._lc=B(r),e._hash=D(e.lower()),Object.freeze(e)}function un(n){
if(null==n)return"No parameters specified."
;for(var r=0,e=["pluraleTantum","indeclinable","animate","surname","name","transport"];r<e.length;r++){var t=e[r]
;if(function(n){return null!=n&&"boolean"!=typeof n}(n[t]))return t+" must be boolean."}
if(null==n.text)return"A cyrillic word required.";if(!n.pluraleTantum){
if(null==n.gender)return"A grammatical gender required.";if(!i.includes(n.gender))return"Bad grammatical gender."}
return null}
var an=S([11720389,548,1024,1479,2622,2867,1222,2642,264,1328,137,123,397,65542229,212447047,31729170,8094836,1056,21701789,35520559,40358,21819,28248,119786,63892,31809,7356,74383,72369,5945,28902,90120738,21187517,91925642,3054826,1600765,65934,30948851,5569212,4205640,5412804,6787095,9749916,3940084,1511466,1303038,16090470,1376628,49919694,3827522,37915959,14032615,28701924,224587434,637275762,51079457,391103676,24108070,158999424,232633267,6058815,66599250,692781441,816204112,55209380,72754,90006,80058,45564,67845,42548,27193,21401,139393,750335,170896,4424,1566,6264,154969,17292,17229,175112,83011,117872,4183,13065,108972,108088,343663,66210,334,17090,380271,283272,59007,35796,230801,1067156,19992,157124,12433,252644,2626,23776,630482,531296,304718,90891,726,23116,47653,30493,167310,50156,123071,477118,241821,55660,908992,534269,205157,11218,2490,660,66391,46856,847526,68710,8450,36630,15642,109864,41716,354482,79820,51876,97325,5506,46436,191803,3957,40876,126323,2347821,338490,73216,475569,87602,29642,4220,10760,16896,50156,17424,35178,167244,126786,33643,30488,65045,35961,51453,55660,4,152461,138332,1958,34200,3709,61381,17424,30158,80591,11218,44099,260487]),sn=S([11720389,548,1024,1060,4,5904,1848,4404,330555234,4691346,3365076,1045362,7414584,960432,10564312,253286,16178203,4357,4355,11350,31120,5248,40591,62367,54057,50487,13069,3664,39764,10263,3002,5810,8844,24551,4091,56761,21785,30553,55147139,15960625,1933097,12258067,16302047,54210486,45688435,1659767,4813249,33577763,2501798,10056946,672528,14209351,2012340,1655412,4652736,62568,148698,21186,71129124,260014161,108045611,1007583269,2026464,22799532,750068913,1499532,1285428194,74598,22348,6599,132273,309821,156816,397448,179394,148036,100257,21779,11218,36631,345954,50442,104394,2724,112115,30690,10552,31377,11286,7168,14612,51480,116537,192258,163145,65604,97951,1363157,212810,431243,2622,425588,275284,150351,570568,244701,16659,26136,130134,11040,159389,728373,3476,726,1290392,224730,189158,11218,2490,10750,21608,143747,65974,664563,84036,16283,17424,5758,45080,33066,1782,90658,37101,56107,233163,14216,5518,179264,2525,146957,111342,80594,2309,4217,25432,26905,29980,518951,1458289,523705,4202,477865,149368,126310,47828,212678,22744,269176,179119,4399,35997,69696,41777,41,127336,4202,73153,46372,114255,126869,23630,11218]),fn=function(){
function n(){f(this,n),this._filter=new Uint8ClampedArray(512)}return o(n,[{key:"addInteger",value:function(n){
this._filter[hn(cn(n))]|=ln(cn(n)),this._filter[hn(on(n))]|=ln(on(n))}},{key:"hasInteger",value:function(n){
return!!(this._filter[hn(cn(n))]&ln(cn(n)))&&!!(this._filter[hn(on(n))]&ln(on(n)))}},{key:"clone",value:function(){
var r=new n;return r._filter=Uint8ClampedArray.from(this._filter),r}}])}();function cn(n){return 4095&n}function on(n){
return 4095&(n>>>12^n>>>24)}function hn(n){return n>>>3}function ln(n){return 1<<7-(7&n)}var dn,En=(dn=new fn,
an.forEach(function(n){return dn.addInteger(n)}),sn.forEach(function(n){return dn.addInteger(n)}),Object.freeze(dn))
;function vn(){var n=new Map,r=En.clone(),e=function(n){return 4294967296*(31&n._flags)+n._hash},t=function(n){
return n.lower().indexOf("ё")+1&255},i=function(r){var u=65504&r._flags,i=function(r){var t=n.get(e(r))
;return t instanceof Array?t:[]}(r).filter(function(n){return(n[0]&u)<=u}),a=i.filter(function(n){return n[0]>>16===t(r)
});return a.length?a[0][1]:i.length?i[0][1]:void 0},a=function(n){switch(n){case"E":return[!0];case"e":return[!0,!1]
;case"b":case"s":return[!1,!0];default:return[!1]}};return{put:function(u,i){var a=i.split("-"),s=function(n,r){
return n.length!==r||n.split("").some(function(n){return!"SsbeE".includes(n)})}
;if(2!==a.length||s(a[0],7)||s(a[1],6))throw new Error("Bad settings format.");var f=rn.create(u),c=e(f),o=n.get(c)
;o instanceof Array||(o=[],n.set(c,o));var h=65535&f._flags|t(f)<<16,l=o.find(function(n){return h===n[0]})
;l?l[1]=i:o.push([h,i]),r.addInteger(f._hash)},hasStressedEndingSingular:function(n,e){if(r.hasInteger(n._hash)){
var t=u(e);if(t>=0){var s=i(n);if(s){var f=s.split("-")[0];return a(f[t])}if(2===en(n)){
if(an.has(n._hash))return a("SEESEEE"[t]);if(sn.has(n._hash))return a("SEEEEEE"[t])}}}return[]},
hasStressedEndingPlural:function(n,e){if(r.hasInteger(n._hash)){var t=u(e);if(t>=0&&t<6){var s=i(n);if(s){
var f=s.split("-")[1];return a(f[t])}if(2===en(n)&&(an.has(n._hash)||n.isAnimate()&&sn.has(n._hash)))return a("E")}}
return[]}}}function Sn(n){var r,e=new Map,t=h(n);try{
for(t.s();!(r=t.n()).done;)for(var u=r.value,i=e,a=u.length-1;a>=0;a--){var s=u.charCodeAt(a);if(a>0){var f=i.get(s)
;if(0===f)break;void 0===f&&i.set(s,new Map),i=i.get(s)}else i.set(s,0)}}catch(n){t.e(n)}finally{t.f()}return e}
function pn(n,r){for(var e=r,t=n.length-1;t>=0;t--){var u=n.charCodeAt(t);if(!e.has(u))return!1;var i=e.get(u)
;if(0===i)return!0;e=i}}
var gn=Sn(["ое","нький","ский","ской","лстой","отой","утой","евой","овой","живой"]),mn=Sn(["ее","ое","нький","ский","ской","лстой","отой","утой"]),bn=Sn(["евой","овой","отой","живой"]),yn=Sn(["шний","жний","щий","ший","жий","чий"]),An=["божий","ажий","яжий","ужий","южий","бульдожий","кабарожий","медвежий","носорожий","миножий"],Wn=Sn(An),wn=Sn(An.map(function(n){
return X(n,2)+"ьи"
})),_n=new Set(["бубен","бугор","ветер","вошь","вымысел","горшок","деготь","дёготь","дятел","домысел","замысел","кашель","коготь","лапоть","лоб","локоть","ломоть","молебен","мох","ноготь","овен","пепел","пес","пёс","петушок","помысел","порошок","промысел","псалом","пушок","ров","рожь","рот","сон","стебель","стишок","угол","умысел","хребет","церковь","шов","ковер","овес","костер"].map(D)),Cn=new fn
;_n.forEach(function(n){return Cn.addInteger(n)})
;var On=Sn(["овёс","ковёр","костёр","шатер","шатёр","козел","козёл","котел","котёл","орел","орёл","осел","осёл","узел","уголь","чок","ешок","хол"])
;function In(n,r){var e=K(r);if(M(-402111711,e)){if(M(U,Q(r,2))){var t=X(n,2);return pn(r,Wn)?t+q("ь",t):t}
if("й"!==e)return $(n)}return n}var Nn=["ясень","бюллетень","олень","тюлень","гордень","пельмень","ячмень"]
;function Tn(n,r,e){var t,u=n.text(),i=K(r),a=j(i);return-133667019&a&&(-402111711&a?t=function(n,r,e){var t=Q(r,2)
;return"ь"===t||"о"===e&&M(2504708,t)?$(n):In(n,r)}(u,r,i):"к"===i?t=function(n,r,e){
return n.length>=4&&nn(r,["рёк","нёк","лёк"])&&!1!==e?X(n,2)+"ьк":r.endsWith("ёк")&&M(U,Q(r,3))?X(n,2)+"йк":void 0
}(u,r,e):"ь"===i?t=function(n,r,e){
return _n.has(n._hash)||pn(e,On)?X(r,3)+Q(r,2):e.endsWith("ень")&&2===en(n)&&!nn(e,Nn)?X(r,3)+"н":$(r)
}(n,u,r):(["лёд","лед","лён"].includes(r)||"лев"===r&&n.isAnimate())&&(t=X(u,2)+q("ь",Q(u,2))+K(u))),
t||(t=function(n,r,e){
return!!(199680&e)&&pn(r,On)&&!["новосел","новосёл"].includes(r)||!!(2571270&e)&&(Cn.hasInteger(n._hash)&&_n.has(n._hash)||n.isAnimate()&&r.endsWith("посол"))
}(n,r,a)?X(u,2)+K(u):u),t}function xn(n,r){var e=$(n),t=$(r.lower());if("а"===K(t))return e
;if(nn(t,["зне","жне","гре","спе","мудре"])||Y($(t),3).split("").every(function(n){return M(L,n)})||r.isAName())return e
;if("ле"===Y(t,2)){var u=Q(t,3);return M(U,u)||"л"===u?$(e)+"ь":e}
return M(U,K(t))&&"и"!==K(t)?M(U,K($(t)))?X(n,2)+"й":nn(r.lower(),["месяц"])?e:X(n,2):e}
var kn=Sn(["лапоток","желток","нишок","ришок","ишек"]),jn=["поток","приток","переток","проток","биоток","электроток","восток","водосток","водоток","воток","знаток"],Mn=["инок","исток","обморок","порок","пророк","сток","урок"]
;function Un(n){
return nn(n,["чек","шек"])&&n.length>=6||pn(n,kn)||n.endsWith("ок")&&!n.endsWith("шок")&&!Mn.includes(n)&&!nn(n,jn)&&!M(U,Q(n,3))&&(M(U,Q(n,4))||nn(X(n,2),["ст","рт"]))&&n.length>=4
}function Pn(n,r,e){return(n.length?n:[!1]).map(function(n){return e(n?J(r):r,n)})}var Ln=0,Vn=3,Rn={дочь:"дочерь",
мать:"матерь"};function zn(n,r,e){var t=r.text(),u=r.lower()
;if(![Ln,Vn].includes(e)&&Object.keys(Rn).includes(u))return zn(n,tn(r,Rn[u]),e);var i=Tn(r,u);if(function(n){
return n.endsWith("полночь")||n.startsWith("пол")&&M(134217984,K(n))&&R(n)>=2}(u)&&(i="полу"+i.substring(3)),
"мя"===Y(u,2))switch(e){case Ln:case Vn:return t;case 1:case 2:case 5:case 6:return i+"ени";case 4:return i+"енем"
}else switch(e){case Ln:case Vn:return t;case 1:case 2:case 5:case 6:return i+"и";case 4:
return nn(u,["вошь","рожь","церковь"])?t+"ю":i+"ью"}}function Dn(n,r,e){var t=r.text(),u=r.lower()
;if(u.endsWith("путь"))return 4===e?$(t)+"ём":zn(n,r,e);if(!u.endsWith("дитя"))throw new Error("unsupported");switch(e){
case 0:case 3:return t;case 1:case 2:case 5:case 6:return t+"ти";case 4:return[t+"тей",t+"тею"]}}function Fn(n,r,e){
var t=r.text(),u=r.lower(),i=Tn(r,u),a=F(i),s=$(t),f=$(u),c=function(){return"я"===K(u)},o=function(){
return u.endsWith("ая")&&!(2===R(u)||M(U,K(a)))},h=function(){return u.endsWith("яя")&&!(2===R(u)||M(U,K(a)))
},l=["жая","шая"];switch(e){case 0:return t;case 1:
return h()||nn(u,l)?i+"ей":o()?i+"ой":r.isASurname()&&!u.endsWith("да")?s+"ой":u.endsWith("ничья")?s+"ей":c()||M(60818504,K(a))?s+"и":s+"ы"
;case 2:case 5:case 6:
return h()||nn(u,l)?i+"ей":o()?i+"ой":r.isASurname()&&!u.endsWith("да")?s+"ой":"ия"===Y(u,2)?s+"и":u.endsWith("ничья")?s+"ей":s+"е"
;case 3:return o()?i+"ую":h()?i+"юю":c()?s+"ю":s+"у";case 4:
return h()||nn(u,l)?i+"ею":o()?[i+"ой",i+"ою"]:c()||Z("жшчщц",K(a))&&!n.sd.hasStressedEndingSingular(r,e).includes(!0)?"и"===K(f)?s+"ей":[s+"ей",s+"ею"]:[s+"ой",s+"ою"]
}}var Bn=Sn(["ов","ев","ёв","ин","ын"]),qn=function(n,r){for(var e=r,t=0;t<n.length;t++){var u=n.charCodeAt(t),i=e
;(e=new Map).set(u,i)}return e}("ы",Bn);function Gn(n){return n.filter(function(r,e){return n.indexOf(r)===e})}
function Hn(n){var r=1&n.lower().includes("ё");return 4294967296*((65535&n._flags)<<1|r)+n._hash}
var Jn=Object.freeze(function(){var n=new Map,r={gender:a.MASCULINE},e={gender:a.MASCULINE,animate:!0}
;function t(r,e,t,u,i){var a,s=u.split(","),f=i instanceof Array?i:[2],c=h(s);try{for(c.s();!(a=c.n()).done;){
var o=a.value;r.text=o;var l=Hn(rn.create(r)),d=n.get(l);d||(d=[],n.set(l,d));var E,v=h(t);try{
for(v.s();!(E=v.n()).done;){var S,p=E.value,g=h(f);try{for(g.s();!(S=g.n()).done;){var m=S.value;d.push(y(p,m,e))}
}catch(n){g.e(n)}finally{g.f()}}}catch(n){v.e(n)}finally{v.f()}}}catch(n){c.e(n)}finally{c.f()}}
var u=[b.V],i=[b.VO],s=[b.NA];t(r,p(0),u,"мозг,пруд,стог,таз,год"),t(r,p(0),i,"рот"),t(r,p(4),u,"год"),
t(r,p(0),u,"гроб"),t(r,p(0),i,"гроб",[1]),t(r,p(1),u,"ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,низ,хлев"),
t(r,p(2),u,"круг,полк,артполк,ряд,род,строй,лад"),t(r,p(3),s,"баз,берег,бережок,вал,кон,круг,луг,пол,яр"),
t(r,p(4),s,"век,день"),t(r,p(4),u,"час"),t(r,p(4),s,"корень"),t(e,p(5),s,"вор"),
t(r,p(5),s,"повод,бочок,борт,воз,горб,кол,мост,плот,сук,х"+String.fromCharCode(1091)+"й"),t(r,p(5),s,"крюк,болт",[1,2])
;var f=",мёд,мех,пар,пух";t(r,p(6),u,"дым,жир,мел,пушок"+f),t(r,p(7),s,"газ,клей,спирт"+f),
t(r,p(8),u,"бой,бред,быт,долг,плен,пыл,сок,ход,лад"),t(r,p(9),u.concat(s),"вид"),
t(r,p(9),s,"слух,счёт,ветер,ветр,свет"),t(r,p(10),s,"ход,бег,вес"),t(r,p(10)|p(12),s,"шаг"),t(r,p(11),s,"бал,пир"),
t(r,p(8),s,"дух,плав"),t(r,p(10)|p(12),s,"газ"),t(r,p(0),u,"глаз,зоб,нос,шкаф"),t(r,p(0),i,"лоб"),
t(r,p(5),s,"глаз,лоб,нос,шкаф,холм");var c="бок,верх,зад,угол";return t(r,p(1),u,c),t(r,p(5),s,c),
t(r,p(1)|p(13),u,"край"),t(r,p(5)|p(13),s,"край"),t(r,p(3),s,"лёд,мох,снег"),t(r,p(6),i,"лёд,лён,мох"),
t(r,p(6),u,"снег"),n
}()),Xn=new Set("клей,чай,дом,дух,дым,дымок,газ,год,горошек,жар,жир,квас,пар,пыл,род,рост,сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,табак,творог,толк,торф,туман,убыток,укроп,уксус,ход,цемент,чеснок,шаг,шик,шиповник,шоколад,шорох,шум,яд".split(",")),Yn=new fn
;Xn.forEach(function(n){return Yn.addInteger(D(n))})
;var $n=Sn(["й","ие","иё"]),Kn=Sn(["воробей","муравей","ручей","соловей","улей"]),Qn=Sn(["мой","ной","дой","шой","жой","рзой","осой","хой","латой","витой","литой","питой","житой","отой","утой","ятой","лагой","рагой","огой","угой","лубой","любой","илой","ылой","злой","малой","овой","евой","живой","ской","акой","укой","нний","ский","йкий","цкий","зкий","ткий","лкий","мкий","хкий","оркий","аркий","яркий","ький","ёкий","бокий","оокий","cокий","токий","ликий","дикий","укий","ыкий","який","пкий","дкий","бкий","нкий","жкий","чкий","гкий","овкий","авкий"])
;function Zn(n,r){return"ый"===Y(r,2)||(r.endsWith("кривой")||pn(r,Qn))&&R(r)>=2}
var nr=Sn(["ий","ие","чье","тье","дье","вье","бье","жалованье","енье","ружье","божье","верье","мужье"]),rr=Sn(["вое","лое","мое","ное","рое","тое","той","ый"])
;function er(n,r,e){
var t=r.text(),u=r.lower(),i=K(u),a=n.sd.hasStressedEndingSingular(r,e),s=Tn(r,u,a[0]),f=$(t),c=ur(u)
;c&&(s="полу"+s.substring(3),f="полу"+f.substring(3));var o=F(s),h=function(){return c&&u.endsWith("я")||ar(u)
},l=pn(u,$n),d=function(){return pn(u,Kn)?$(f)+q("ь",K(f)):f},E=function(){return Z("чщ",K(o))};function v(n){
return!r.isAnimate()&&Yn.hasInteger(r._hash)&&Xn.has(u)&&("й"===i?n.push($(t)+q("ю",K(t))):n=n.concat(Pn(a,s,function(n){
return n+q("у",K(n))}))),n}switch(e){case 0:return t;case 1:switch(i){case"и":case"ы":if(c)return tr(n,r,e,u);break
;case"й":case"е":if(l&&r.isASurname()||Zn(0,u)||pn(u,gn))return s+"ого";if(pn(u,yn)||u.endsWith("ее"))return s+"его"
;case"ё":case"я":case"ь":if(l)return v([d()+"я"]);if(h()&&!E())return s+"я";break;case"ц":return xn(t,r)+"ца";case"к":
if(Un(u))return $(f)+"ка";break;case"о":if(nn(u,["шко"])&&2===en(r))return f+"и"}
return v(r.isASurname()||-1===o.indexOf("ё")?[s+"а"]:Pn(a,s,function(n){return n+"а"}));case 2:switch(i){case"и":
case"ы":if(c)return tr(n,r,e,u);break;case"й":case"е":if(l&&r.isASurname()||Zn(0,u)||pn(u,gn))return s+"ому"
;if(pn(u,yn)||u.endsWith("ее"))return s+"ему";case"ё":case"я":case"ь":if(l)return d()+"ю";if(h()&&!E())return s+"ю"
;break;case"ц":return xn(t,r)+"цу";case"к":if(Un(u))return $(f)+"ку"}
return r.isASurname()||-1===o.indexOf("ё")?s+"у":Pn(a,s,function(n){return n+"у"});case 3:
return 3===en(r)||Z("иы",i)&&c?t:r.isAnimate()?er(n,r,1):t;case 4:switch(i){case"и":case"ы":if(c)return tr(n,r,e,u)
;break;case"й":case"е":case"ё":case"я":case"ь":if(l&&r.isASurname()||pn(u,mn))return pn(u,rr)?s+"ым":s+"им"
;if(Zn(0,u))return"и"===Q(u,2)||u.endsWith("хой")?s+"им":s+"ым";if(pn(u,bn))return s+"ым";if(pn(u,yn))return s+"им"
;if(l)return d()+"ем";if(u.endsWith("це"))return t+"м";break;case"ц":return Pn(a,t,function(n,e){
return e?xn(n,r)+"цом":xn(n,r)+"цем"});case"к":if(Un(u))return $(f)+"ком";break;case"н":case"в":
if(r.isASurname()&&pn(u,Bn))return t+"ым"}return h()||Z("жшчщ",K(o))?Pn(a,s,function(n,r){return r?n+"ом":n+"ем"
}):r.isASurname()||-1===o.indexOf("ё")?s+"ом":Pn(a,s,function(n){return n+"ом"});case 6:if("полпути"===u)return t
;var S=Jn.get(Hn(r));if(S)return Gn(S.map(function(n){return A(n)})).map(function(e){return ir(n,r,e)});case 5:
switch(i){case"и":if("полпути"===u)return t;case"ы":if(c)return tr(n,r,e,u);break;case"й":case"е":case"ё":case"я":
case"ь":if(l&&r.isASurname()||Zn(0,u)||pn(u,gn))return s+"ом";if(pn(u,yn)||u.endsWith("ее"))return s+"ем"
;if(nn(u,["воробей"])){var p=$(f);return p+q("ье",K(p))}
if(pn(u,nr)&&!nn(u,["запястье","здоровье","изголовье","платье"]))return f+"и";if("й"===i||"иё"===Y(u,2))return d()+"е"
;break;case"ц":return xn(t,r)+"це";case"к":if(Un(u))return $(f)+"ке"}
return r.isASurname()||-1===o.indexOf("ё")?s+"е":Pn(a,s,function(n){return n+"е"})}}function tr(n,r,e,t){
var u=function(){return"полминуты"!==t?"полу"+r.text().substring(3):r.text()}
;return"полпути"===t?Dn(n,tn(r,$(u())+"ь"),e):t.endsWith("зни")||t.endsWith("сти")?zn(n,tn(r,$(u())+"ь"),e):Fn(n,tn(r,$(u())+("ни"===Y(t,2)?"я":"а")),e)
}function ur(n){if(n.startsWith("пол")&&M(2550137089,K(n))&&"л"!==n[3]&&R(n)>=2){
var r=n.substring(3),e=r.search(/[а-яё]/);return e>=0&&M(P,r[e])}return!1}function ir(n,r,e){if(2===e){
var t=r.text(),u=r.lower(),i=Tn(r,u),a=$(t),s=ur(u)&&u.endsWith("я")||ar(u)
;return"й"===K(u)?J(a)+"ю":s?J(i)+"ю":Un(u)?J($(a))+"ку":J(i)+"у"}if(1===e)return er(n,r,5)}function ar(n){
return"ь"===K(n)&&!n.endsWith("господь")||Z("её",K(n))&&!nn(n,["це","же"])}for(var sr=l(l(l({},2,{all:{
болгарин:["болгары"],господин:["господа"],дядя:["дяди","дядья"],зуб:["зубы","зубья"],клок:["клочья","клоки"],
князь:["князи","князья"],кол:["колы","колья"],месяц:["месяцы"],полдень:["полдни","полудни"],татарин:["татары"],
хозяин:["хозяева"],цветок:["цветки","цветы"],черт:["черти"],чёрт:["черти"],
электротрактор:["электротракторы","электротрактора"],"мини-трактор":["мини-трактора"]},animateOnly:{
авиаконструктор:["авиаконструктора","авиаконструкторы"],автоинспектор:["автоинспектора","автоинспекторы"],
"арт-директор":["арт-директора"],бесёнок:["бесенята"],"вице-директор":["вице-директора"],
госавтоинспектор:["госавтоинспектора","госавтоинспекторы"],госинспектор:["госинспектора"],
кондуктор:["кондуктора","кондукторы"],конструктор:["конструктора","конструкторы"],кум:["кумовья"],
корректор:["корректора","корректоры"],муж:["мужья","мужи"],охотинспектор:["охотинспектора"],
пристав:["пристава","приставы"],проспектор:["проспектора"],редактор:["редактора","редакторы"],
ректор:["ректора","ректоры"],санинструктор:["санинструктора","санинструкторы"],слесарь:["слесари","слесаря"],
сторож:["сторожа","сторожи"],вахтер:["вахтера","вахтёры"],фельдшер:["фельдшера","фельдшеры"],
"член-корреспондент":["член-корреспонденты","члены-корреспонденты"],цыган:["цыгане","цыганы"]}}),1,{all:{
гроздь:["грозди","гроздья"],курица:["курицы","куры"],стая:["стаи"],щека:["щёки"],береста:["берёсты"],верста:["вёрсты"],
десна:["дёсны"],жена:["жёны"],звезда:["звёзды"],кинозвезда:["кинозвёзды"],медсестра:["медсёстры"],метла:["мётлы"],
пчела:["пчёлы"],сестра:["сёстры"],слеза:["слёзы"]}}),3,{all:{брюхо:["брюхи"],колено:["колена","колени","коленья"],
древо:["древа","древеса"],ухо:["уши"],око:["очи"],дно:["донья"],чудо:["чудеса","чуда"],небо:["небеса"],
бревно:["брёвна"],ведро:["вёдра"],веретено:["веретёна"],весло:["вёсла"],гнездо:["гнёзда"],зерно:["зёрна"],
знамя:["знамёна"],колесо:["колёса"],облачко:["облачка"],озеро:["озёра"],полсотни:["полусотни"],ребро:["рёбра"],
ремесло:["ремёсла"],седло:["сёдла"],село:["сёла"]}
}),fr=new fn,cr=0,or=Object.values(sr);cr<or.length;cr++)for(var hr=or[cr],lr=0,dr=Object.values(hr);lr<dr.length;lr++)for(var Er=dr[lr],vr=0,Sr=Object.keys(Er);vr<Sr.length;vr++){
var pr=Sr[vr];fr.addInteger(D(pr))}
var gr=["зять","деверь","друг","брат","собрат","стул","брус","обод","полоз","струп","подмастерье","якорь","перо","шило"],mr=new Set(["берег","бок","борт","век","вес","веер","вексель","вечер","глаз","голос","город","директор","доктор","дом","детдом","егерь","жемчуг","катер","колокол","концлагерь","корм","короб","кузов","купол","кучер","лес","луг","мастер","номер","пояс","провод","рог","сахар","снег","сорт","стог","счет","счёт","спецсчет","спецсчёт","субсчет","субсчёт","терем","том","холод","хутор","цвет","череп"]),br=Sn(["округ","остров","отпуск","паспорт","парус","поезд","погреб","рукав","цех"]),yr=Sn(["повар","юнкер"]),Ar=new Set(["адрес","договор","буфер","ворох","инспектор","инструктор","корпус","крейсер","орден","ордер","прожектор","пропуск","род","свитер","сектор","сервер","тенор","тон","трактор","тормоз","ветер","верх","китель","мех","хлеб","юнкер","ястреб"]),Wr=new Set(["бункер","вымпел","год","лекарь","образ","омут","писарь","пудель","токарь","тополь","шторм","штуцер"]),wr=["крюк","лист","лоскут","повод","прут","сук","учитель","флигель","штабель"],_r=["клин","колос","ком","край","соболь"],Cr=["дерево","звено","крыло"],Or=["безделье","варенье","воскресенье","жалованье","запястье","застолье","затишье","здоровье","зелье","изголовье","новоселье","одночасье","печенье","платье","побережье","поголовье","подворье","подземелье","подполье","поместье","предплечье","раздумье","сиденье","средневековье","увечье","угодье","устье"],Ir=["воробей","муравей","ручей","соловей","улей","жеребей","ирей","репей","чирей"]
;function Nr(n){return"барин"===n}function Tr(n,r,e,t,u){var i=n.sd.hasStressedEndingPlural(r,0).map(function(n){
return!n});return i.length?i.map(function(n){return n?1===t.replace(/[^её]/g,"").length?u((r=e,i=t,
a=Math.max(i.lastIndexOf("е"),i.lastIndexOf("ё")),s=q("ё",r[a]),r.substring(0,a)+s+r.substring(a+1))):u(e):u(J(e))
;var r,i,a,s}):[u(e)]}function xr(n,r,e,t,u,i,a,s){var f=[],c=function(){
return(i.endsWith("евич")||i.endsWith("евна"))&&i.indexOf("ье")>=0};function o(){
var n=s,r=F(n).indexOf("ье"),e=q("и",n[r]);return n.substring(0,r)+e+n.substring(r+1)}
return M(60818504,K(u))||Z("яйь",K(i))||nn(i,["сосед"])?c()?(f.push(o()+"и"),
f.push(s+"и")):f.push.apply(f,d(Pn(a,s,function(n){return n+"и"
}))):"ц"===K(i)?f.push(xn(e,r)+"цы"):c()?(f.push(o()+"ы"),f.push(s+"ы")):f.push.apply(f,d(Pn(a,s,function(n){
return n+"ы"}))),f}function kr(n,r){var e=r.text(),t=r.lower(),u=n.sd.hasStressedEndingPlural(r,0),i=Tn(r,t,u[0]),a=F(i)
;if(t.endsWith("яя"))return[X(e,2)+"ие"];var s=("й"===K(t)||M(U,K(t)))&&M(U,K($(t)))?$(e):i,f=function(n,r){
if(fr.hasInteger(n._hash)){var e=en(n),t=n.isAnimate(),u=sr[e];if(u){var i=u.animateOnly
;if(t&&i&&i.hasOwnProperty(r))return i[r].slice();var a=u.all;return a&&a.hasOwnProperty(r)?a[r].slice():void 0}}}(r,t)
;if(f)return f;var c=en(r),o=r.getDeclension();if(-1===o)return[e];if(0===o){if("путь"===t)return["пути"]
;if(t.endsWith("дитя"))return[X(e,3)+"ети"];throw new Error("unsupported mixed declension word")}
return 1===o?function(n,r,e,t,u,i,a,s,f){
var c=[],o="ь"===K(i)?u:"к"===K(i)?$(u)+"чь":"г"===K(i)?$(u)+"зь":"й"===K(t)?$(e):nn(t,["рь","ль"])?u:u+"ь"
;if(gr.includes(t))return c.push(o+"я"),Gn(c);if(2===f){var h=function(n){
return"сын"===n?"сын":"человек"===n?"человек":null}(t);if("сын"===h)return c.push("сыновья"),
c.push.apply(c,d(xr(0,r,e,0,i,t,a,s))),Gn(c);if("человек"===h)return c.push("люди"),
c.push.apply(c,d(xr(0,r,e,0,i,t,a,s))),Gn(c);if(function(n,r){return!!wr.includes(n)||!("соболь"!==n||!r.isAnimate())
}(t,r))return c.push.apply(c,d(xr(0,r,e,0,i,t,a,s))),c.push(o+"я"),Gn(c);if(function(n){return _r.includes(n)
}(t))return c.push(o+"я"),Gn(c);var l=function(n){return mr.has(n)?1:Ar.has(n)?3:Wr.has(n)?4:0}(t),E=function(n,r){
var e=r.isAnimate();return!e&&pn(n,br)||e&&pn(n,yr)}(t,r)
;return 0!==l||E?(4===l&&c.push.apply(c,d(xr(0,r,e,0,i,t,a,s))),ar(t)?c.push.apply(c,d(Tr(n,r,u,i,function(n){
return n+"я"}))):a.includes(!0)?c.push(J(u)+"а"):c.push(u+"а"),3===l&&c.push.apply(c,d(xr(0,r,e,0,i,t,a,s))),
Gn(c)):r.isAnimate()&&(t.endsWith("анин")||t.endsWith("янин"))&&!r.isAName()||function(n){return"боярин"===n
}(t)||Nr(t)?(c.push(X(e,2)+"е"),Nr(t)&&c.push(X(e,2)+"ы"),Gn(c)):function(n){return"цыган"===n}(t)?(c.push(e+"е"),
Gn(c)):function(n){return"щенок"===n}(t)?(c.push(X(e,2)+"ки"),c.push(X(e,2)+"ята"),Gn(c)):function(n){
return!(!n.endsWith("ребёнок")&&!n.endsWith("ребенок")||n.endsWith("жеребёнок")||n.endsWith("жеребенок")||n.endsWith("ястребёнок")||n.endsWith("ястребенок"))
}(t)?(c.push(X(e,7)+"дети"),Gn(c)):function(n,r){return(n.endsWith("ёнок")||n.endsWith("енок"))&&r.isAnimate()
}(t,r)?(c.push(X(e,4)+"ята"),Gn(c)):t.endsWith("ёночек")&&r.isAnimate()?(c.push(X(e,6)+"ятки"),Gn(c)):function(n,r){
return n.endsWith("онок")&&Z("жшч",Q(n,5))&&r.isAnimate()}(t,r)?(c.push(X(e,4)+"ата"),Gn(c)):Un(t)?(c.push(X(e,2)+"ки"),
Gn(c)):pn(t,yn)?(nn(t,An)?c.push(X(e,2)+"ьи"):c.push($(e)+"е"),
Gn(c)):Zn(0,t)?(t.endsWith("ый")||t.endsWith("ий")?c.push($(e)+"е"):t.endsWith("ой")&&!nn(t,["хой","ской"])?c.push(X(e,2)+"ые"):c.push(X(e,2)+"ие"),
Gn(c)):t.endsWith("его")?(c.push(X(e,3)+"ие"),Gn(c)):function(n){return Ir.includes(n)}(t)?(c.push(X(e,2)+"ьи"),
Gn(c)):(c.push.apply(c,d(xr(0,r,e,0,i,t,a,s))),Gn(c))}if(3===f){if(function(n){
return nn(n,["ко","чо"])&&!nn(n,["войско","облако"])}(t))return c.push($(e)+"и"),Gn(c);if(function(n){
return n.endsWith("имое")}(t))return c.push(u+"ые"),Gn(c);if(function(n){return n.endsWith("ее")
}(t))return c.push(u+"ие"),Gn(c);if(t.endsWith("ое"))return!function(n){return nn(n,["г","к","ж","ш","х"])
}(i)?c.push(u+"ые"):c.push(u+"ие"),Gn(c);if(function(n){return nn(n,["ие","иё"])}(t))return c.push(X(e,2)+"ия"),Gn(c)
;if(function(n){return nn(n,["ье","ьё"])}(t)){var v=X(e,2);return"е"!==K(t)||function(n){return Or.includes(n)
}(t)||c.push(v+"ия"),c.push(v+"ья"),Gn(c)}return function(n){return nn(n,Cr)}(t)?(c.push(u+"ья"),Gn(c)):function(n){
return nn(n,["ле","ре"])}(t)?(c.push(u+"я"),Gn(c)):function(n,r){return n.endsWith("судно")&&r.isATransport()
}(t,r)?(c.push(X(e,2)+"а"),Gn(c)):(c.push.apply(c,d(Tr(n,r,u,i,function(n){return n+"а"}))),function(n){
return n.endsWith("щупальце")}(t)&&c.push.apply(c,d(xr(0,r,e,0,i,t,a,s))),Gn(c))}return c.push(u+"и"),Gn(c)
}(n,r,e,t,i,a,u,s,c):2===o?function(n,r,e,t,u,i,a,s){var f=[];if(function(n){return"заря"===n}(t))return f.push("зори"),
Gn(f);if(function(n){return n.endsWith("ая")&&!n.endsWith("свая")
}(t))return Z("жхчшщ",K(i))||nn(i,["вк","гк","ск","цк","ньк"])?f.push(u+"ие"):f.push(u+"ые"),Gn(f)
;return f.push.apply(f,d(xr(0,r,e,0,i,t,a,s))),Gn(f)}(0,r,e,t,i,a,u,s):3===o?function(n,r,e,t,u,i,a,s,f){var c=[]
;if("мя"===Y(t,2))return c.push(u+"ена"),Gn(c);if(Object.keys(Rn).includes(t))return c.push($(Rn[t])+"и"),Gn(c)
;if(1===f)return c.push(s+"и"),Gn(c);"и"===K(s)?c.push(s+"я"):c.push(s+"а");return Gn(c)}(0,0,0,t,i,0,0,s,c):[e]}
var jr=Sn(["ли","си","би","ви","ди","ти","пи","ри","ни","фи","зи","ьи","ья","ия","ря","ля","ая","аи","ои","уи","эи","ыи","яи","ёи","юи","еи","ии"]),Mr=["беготни","болтовни","будни","вожжи","возни","доли","лапши","левши","люди","марли","моря","мощи","ноздри","пени","пятерни","распри","родни","сакли","сени","ступни","судьи","фигни","чукчи"],Ur=["головы","громадины","детины","деревенщины","дохлятины","дубины","ехидины","жадины","зверины","идиотины","кислятины","молодчины","орясины","остолопины","сиротины","скотины","старейшины","старины","старшины","уродины"],Pr=Sn(Ur),Lr=["адреса","паспорта","поезда","цеха","снега","бункера","буфера","берега","вымпела","голоса","города","договора","жемчуга","колокола","короба","корпуса","крейсера","кузова","леса","мастера","номера","облачка","острова","отпуска","паруса","повара","погреба","пояса","провода","пропуска","рукава","сахара","свитера","сервера","счета","тормоза","холода","хутора","цвета","черепа","шторма","штуцера","юнкера","ястреба","суда","фельдшера","кучера","пристава"],Vr=Sn([].concat(Lr,["ктора","хтера"])),Rr=new Set([].concat(Lr,["бега","беглецы","близнецы","бойцы","бока","борта","борцы","бруствера","брюшки","веера","века","венцы","верха","веса","весы","вечера","вороха","глупцы","года","гонцы","дворцы","дельцы","детдома","детдомы","дома","жеребцы","жильцы","жрецы","затишки","зубцы","излишки","истцы","катера","концы","корма","кузнецы","купола","купцы","лишки","луга","мертвецы","меха","мудрецы","облака","образа","образцы","огурцы","округа","омута","ордена","ордера","отцы","очки","певцы","песцы","пловцы","подлецы","продавцы","птенцы","резцы","рога","рода","рубцы","самцы","свинцы","сорта","соуса","спецы","стога","столбцы","стрельцы","творцы","тельцы","тенора","терема","тома","тона","торцы","хлеба","штришки","юнцы"])),zr=new Set(["авары","аланы","аршины","баклажаны","буквы","гольфы","граммы","гусары","дела","кадеты","килограммы","омы","помидоры","рентгены","ботинки","человеки","чулки","шорты"]),Dr=new Set(["гектары","рельсы"]),Fr=new Set([].concat(Ur,["абазины","авы","аввы","бедняги","бедолаги","болгары","бродяги","брызги","брюки","брюхи","будды","бусы","валенки","веки","вельможи","верзилы","вилы","владыки","воеводы","волосы","вояки","главы","грузины","задворки","задиры","железы","жилы","зануды","зеваки","именины","калеки","кальсоны","каникулы","колготки","коллеги","крохи","курицы","куры","ладоши","ламы","лыки","макароны","мужчины","нападки","нары","непоседы","носилки","ножны","папы","папаши","таты","падлы","партизаны","погоны","поминки","посиделки","похороны","предтечи","работяги","разы","ребятки","румыны","самоубийцы","санки","убийцы","сапоги","сатаны","сироты","сливки","слуги","солдаты","старосты","сумерки","сутки","татары","телеса","хитрюги","четвереньки","шляпы","шмотки","яблоки","дядьки","дяденьки","зайки","кроссовки","малютки","малолетки","попки","турки","узы","хлопоты","шахматы"])),Br=new fn
;Rr.forEach(function(n){return Br.addInteger(z(n))}),zr.forEach(function(n){return Br.addInteger(z(n))}),
Dr.forEach(function(n){return Br.addInteger(z(n))});var qr=new fn;Fr.forEach(function(n){return qr.addInteger(z(n))})
;var Gr=Sn(["жи","ши","чи","ля","ли","чи","ри","ти","ди","сани","борщи","клещи","товарищи","плащи","прыщи","хрящи"]),Hr=Sn(["братья","брусья","деревья","донья","звенья","клинья","клочья","коленья","колосья","колья","комья","крылья","крючья","листья","лоскутья","лохмотья","перья","платья","поводья","прутья","стулья","сучья","хлопья","шилья"]),Jr=Sn(["ишки","дружки","тки","папочки","дедушки","дядюшки","батюшки","катанки","петрушки","шестерки"]),Xr=Sn(["жки","шки","чки","рки","натки","хатки","ятки","етки","чётки","мки","нки","педки","илки"]),Yr=Sn(["шок","щок","жок","зок","аток","яток","еток"]),$r=Sn(["вна","вца","вцы","пла","дца","дра","судна","рки","рцы","тлы","рна","тна","енца","десны","дёсны","рёбра","ребра","сосны"])
;function Kr(n){return Mr.includes(n)}
var Qr=[["х","ых","их"],["м","ым","им"],["х","ых","их"],["ми","ыми","ими"],["х","ых","их"]],Zr={2:0,3:1,4:2,5:3,6:4,7:4
},ne=[["ям","ам"],["ями","ами"],["ях","ах"]],re={3:0,5:1,6:2,7:2
},ee=["жки","шки","чки","ножны"],te=["кн","кл","дк","нк","пк","зк","рк","тк","вк","лк","мк"],ue=["сестры","сёстры","серьги"],ie=["льц","сьм","деньг","ьк","йк","дьб"],ae=["земли","петли","пли","вли"],se=["зять","деверь"]
;function fe(n,r,e,t){var u=F(t),i=K(u),a=j(i),s=e+1;if(1===s||4===s&&!r.isAnimate())return t
;if(134217984&a)if(2===s||4===s){if(u.endsWith("овичи")||u.endsWith("евичи"))return $(t)+"ей"
;if((u.endsWith("вны")||u.endsWith("полусотни"))&&"овны"!==u)return X(t,2)+"ен"}else if(5===s){
if((u.endsWith("дети")||u.endsWith("люди"))&&!u.endsWith("нелюди"))return $(t)+"ьми"
;if(u.endsWith("вери")||u.endsWith("дочери"))return[$(t)+"ями",$(t)+"ьми"]}
var f=en(r),c=u.endsWith("цы")?$(t):In(t,u),o=pn(u,qn)&&(r.isASurname()||4===f)&&!pn(u,Pr),h=Qr[Zr[s]]
;if(o||u.endsWith("ничьи"))return t+h[0];if(u.endsWith("ые"))return X(t,2)+h[1]
;if(u.endsWith("ие")||pn(u,wn))return c+h[2];if(s>2&&4!==s){var l=ne[re[s]]
;return pn(u,jr)?$(t)+l[0]:n.sd.hasStressedEndingPlural(r,e).includes(!0)?J(c)+l[1]:c+l[1]}
var d=r.getDeclension(),E=function(){var i=F(c)
;if(nn(i,te)&&!u.endsWith("сумерки")||"зл"===i||nn(u,ee)&&n.sd.hasStressedEndingPlural(r,e).includes(!0)){var a=K(c)
;return $(c)+q("о",a)+a}if(pn(u,$r)&&!u.endsWith("недра")||nn(u,ee)){var s=Q(t,2);return X(t,2)+q("е",s)+s}if(nn(u,ue)){
var f=Q(t,2);return("ь"===Q(u,3)?J(X(t,3)):J(X(t,2)))+q("ё",f)+f}if(nn(i,ie)){var o=K(c);return X(c,2)+q("е",o)+o}
return u.endsWith("сла")||u.endsWith("слы")?$(c)+"ел":c};if([3,0].includes(d)){if(u.endsWith("и"))return $(t)+"ей"
;if(function(n){return"гроздья"===n}(u))return $(t)+"ев"}var v=Q(u,3);if(1!==f){var S=function(n,r){
return r.hasInteger(z(n))}(u,Br);if(S&&function(n){return Rr.has(n)}(u))return $(t)+"ов";if(S&&function(n){
return zr.has(n)}(u)&&!r.isAName())return[E(),$(t)+"ов"];if(S&&function(n){return Dr.has(n)}(u))return[$(t)+"ов",E()]
;if(4===f&&!Kr(u)&&!Z("жшч",v)||function(n,r){return r.hasInteger(z(n))}(u,qr)&&function(n){return Fr.has(n)
}(u)||r.isAName()&&2===f&&r.lower().endsWith("а")||"барин"===r.lower())return E();switch(i){case"и":case"я":
if(pn(u,Gr)||"щи"===u||Kr(u)||r.lower().endsWith("ь")&&!nn(r.lower(),se))return("ь"===K($(u))?X(t,2):$(t))+"ей"
;if("и"===i)return function(n){return n.endsWith("ульи")
}(u)?$(t)+"ев":u.endsWith("ьи")?2===f?$(t)+"ёв":X(t,2)+"ей":function(n){
return["ча","кле","холу","ху"].includes(n.slice(0,-1))}(u)?$(t)+"ёв":u.endsWith("ищи")?E():function(n){
return n.endsWith("мессии")
}(u)?$(t)+"й":M(U,Q(u,2))?$(t)+"ев":!pn(u,Xr)||2===f&&!pn(J(u),Jr)||pn(r.lower(),Yr)?$(t)+"ов":E()
;if(pn(u,Hr))return $(t)+"ев";if(function(n){return nn(n,["зятья","кумовья","деверья","края","острия"])
}(u))return $(t)+"ёв";if(function(n){return nn(n,["ья","ия"])}(u))return 2===f?X(t,2)+"ей":X(t,2)+"ий";break;case"а":
var p=function(n){return n.endsWith("семена")?"семена":n.endsWith("стремена")?"стремена":null}(u)
;return p?X(t,3)+"ян":function(n){return!n.endsWith("мена")||n.endsWith("семена")||n.endsWith("стремена")?null:"мена"
}(u)?X(t,3)+"ён":r.lower().endsWith("яйцо")?q("яиц",$(t)):u.endsWith("нца")?[E(),$(t)+"ев"]:pn(u,Vr)?$(t)+"ов":E()
;case"ы":return function(n){
return n.endsWith("ницы")||n.endsWith("лицы")||n.endsWith("пицы")||n.endsWith("бицы")?n.slice(-3):null
}(u)?$(t):u.endsWith("цы")?$(t)+"ев":$(t)+"ов";default:if(function(n){return n.endsWith("не")}(u))return E()}}
if(function(n){return n.endsWith("йки")}(u))return X(t,3)+"ек";if(u.endsWith("ки")){if("ь"===v){var g=K($(t))
;return X(t,3)+q("е",g)+g}if(Z("жшч",v))return E();if(M(L,v))return X(t,2)+"ок"}if(Kr(u))return $(t)+"ей"
;if(function(n){return nn(n,["аи","ои","еи","эи","уи"])}(u))return $(t)+"й";if(function(n){return"свечи"===n
}(u))return[$(t),$(t)+"ей"];if(function(n){return"пригоршни"===n}(u))return[$(t)+"ей",X(t,2)+"ен"];if(function(n){
return"тихони"===n}(u))return[X(t,2)+"нь",$(t)+"ей"];if(function(n){return nn(n,["ьи","ии"])
}(u))return n.sd.hasStressedEndingSingular(r,e).includes(!0)?X(t,2)+"ей":X(t,2)+"ий";if(function(n){
return n.endsWith("ни")&&M(L,Q(n,3))}(u))return function(n){return["барышни","боярышни","деревни"].includes(n)
}(u)?X(t,2)+"ень":function(n){return n.endsWith("кухни")}(u)?X(t,2)+"онь":function(n){return"сотни"===n
}(u)?[X(t,2),X(t,2)+"ен"]:X(t,2)+"ен";if(F(c).endsWith("ийк"))return X(c,2)+"ек";if(c.length===u.length-1&&pn(u,jr)){
var m=Q(c,2).charCodeAt(0);if(m!==W+9&&m!==W+28&&m!==w+9&&m!==w+28||r.isAnimate())return nn(u,ae)?$(c)+"ель":c+"ь"
;var b=K(c);return X(c,2)+q("е",b)+b}return E()}var ce=function(){return o(function n(){f(this,n),
l(this,"sd",function(){var n,r=vn();function e(e,t){var u,i=h(t.split(","));try{for(i.s();!(u=i.n()).done;){
var a=u.value;n.text=a,r.put(n,e)}}catch(n){i.e(n)}finally{i.f()}}return n={pluraleTantum:!0},
e("SSSSSSS-SSSSSS","ножны"),n={gender:a.MASCULINE},e("SSSSSSS-SSSSSS","брёх,дёрн,идиш,имидж,мед,упрёк"),
e("SSSSSSS-EEEEEE","адрес,век,вечер,город,детдом,поезд,спецсчёт,субсчёт"),
e("SSSSSSE-EEEEEE","берег,бок,вес,лес,снег,дом,катер,счёт,мёд"),e("SSSSSSS-bbbbbb","вексель,ветер"),
e("SSSSSSE-ESEEEE","глаз"),e("SSSSSSE-bEEbEE","год"),e("SSSSSSb-bbbbbb","цех"),e("SbbSbbb-bbbbbb","грош,шприц"),
e("SssSsss-ssssss","кишмиш,кряж,слеш,слэш"),e("SEESeEE-EEEEEE","стеллаж"),e("SeeSeee-eeeeee","шиномонтаж"),n={
gender:a.MASCULINE,animate:!0},e("Sssssss-ssssss","паныч"),e("SSSSSSS-SSSSSS","балансёр,шофёр"),n={gender:a.NEUTER},
e("EEEEEEE-SsESEE","плечо"),
e("EEEEEEE-SSSSSS","тесло,стекло,автостекло,бронестекло,оргстекло,пеностекло,смарт-стекло,спецстекло,бедро,берцо,блесна,чело,стегно,стебло"),
n={gender:a.FEMININE},e("EEEbEEE-SSESEE","щека"),e("EEEEEEE-SSESEE","слеза"),e("EEEEEEE-SESSSS","семья,макросемья"),
e("EEEEEEE-SEESEE","вожжа,свеча"),e("EEESEEE-SSSSSS","душа"),e("EEEEEEE-eEeeee","скамья"),
e("EEEEEEE-EEEEEE","башка,кишка,ладья,лапша,моча,пыльца,статья"),n={gender:a.FEMININE,animate:!0},
e("EEEEEEE-SESESS","свинья,овца"),n={gender:a.COMMON,animate:!0},e("EEEEEEE-SSSSSS","судья"),
e("EEEEEEE-EEEEEE","левша"),r}())},[{key:"decline",value:function(n,r,e){var t=rn.create(n)
;return H(e?F(e.charAt(0))!==e.charAt(0):t.lower().charCodeAt(0)!==t.text().charCodeAt(0),oe(this,t,r,e))}},{
key:"pluralize",value:function(n){var r=rn.create(n)
;return r.isPluraleTantum()?[r.text()]:H(r.lower().charCodeAt(0)!==r.text().charCodeAt(0),kr(this,r))}},{
key:"getLocativeForms",value:function(n){var r=this,e=rn.create(n),t=e.getDeclension();if(t&&t>=0){var u=Jn.get(Hn(e))
;if(u instanceof Array)return u.map(function(n){return new g(function(n){switch(1+(n>>3&7)){case b.V:return"в"
;case b.VO:return"во";case b.NA:return"на"}}(n),function(n,r,e,t){var u=5;switch(r){case 0:return Dn(n,e,u);case 1:
return ir(n,e,t);case 2:return Fn(n,e,u);case 3:return zn(n,e,u)}}(r,t,e,A(n)),n>>6)})}return[]}}])}()
;function oe(n,r,e,u){var i=function(n,r,e,u){var i=r.text(),a=t[e],s=r.getDeclension();if(r.isIndeclinable())return i
;if(r.isPluraleTantum())return fe(n,r,a,i);if(u)return fe(n,r,a,u);switch(s){case-1:return i;case 0:return Dn(n,r,a)
;case 1:return er(n,r,a);case 2:return Fn(n,r,a);case 3:return zn(n,r,a)}}(n,r,e,u);return i instanceof Array?i:[i]}
n.CASES=r,n.Case=e,n.Engine=ce,n.Gender=a,n.Lemma=rn,n.LocativeForm=g,n.LocativeFormAttribute=m,
n.createLemma=function(n){return rn.create(n)},n.createLemmaOrNull=function(n){return rn.createOrNull(n)}});
//# sourceMappingURL=RussianNouns.umd.js.map
