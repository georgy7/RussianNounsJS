/*!
  RussianNounsJS v3.0.0-alpha.0
  Copyright (c) 2011-2026 Georgy Ustinov
  Released under the MIT license
*/
var RussianNouns=function(e){"use strict"
;var r=Object.freeze(["именительный","родительный","дательный","винительный","творительный","предложный","местный"]),n=Object.freeze({
NOMINATIVE:r[0],GENITIVE:r[1],DATIVE:r[2],ACCUSATIVE:r[3],INSTRUMENTAL:r[4],PREPOSITIONAL:r[5],LOCATIVE:r[6]
}),t=Object.freeze(["женский","мужской","средний","общий"]),i=Object.freeze({FEMININE:t[0],MASCULINE:t[1],NEUTER:t[2],
COMMON:t[3]});function u(e,r,n){this.preposition=e,this.word=r,this.attributes=n}var a=Object.freeze({CONTAINER:1,
LOCATION:2,STRUCTURE:4,SURFACE:8,WAY:16,OBJECT_WITH_FUNCTIONAL_SURFACE:32,SUBSTANCE:64,RESOURCE:128,CONDITION:256,
EXPOSURE:512,MOTION:1024,EVENT:2048,WITH_ADJECTIVE:4096,WITHOUT_ADJECTIVE:8192,RELIGIOUS:16384}),s=Object.freeze({
PREPOSITIONAL:1,U_SUFFIX:2}),c=Object.freeze({V:1,VO:2,NA:3});function f(e,r,n){return n<<6|(e-1&7)<<3|r-1&7}
function o(e){return 1+(7&e)}function l(e,r){(null==r||r>e.length)&&(r=e.length)
;for(var n=0,t=Array(r);n<r;n++)t[n]=e[n];return t}function h(e,r){
if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function E(e,r){
for(var n=0;n<r.length;n++){var t=r[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),
Object.defineProperty(e,I(t.key),t)}}function d(e,r,n){return r&&E(e.prototype,r),n&&E(e,n),
Object.defineProperty(e,"prototype",{writable:!1}),e}function S(e,r){
var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=A(e))||r){n&&(e=n)
;var t=0,i=function(){};return{s:i,n:function(){return t>=e.length?{done:!0}:{done:!1,value:e[t++]}},e:function(e){
throw e},f:i}}
throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}var u,a=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return a=e.done,e},e:function(e){s=!0,u=e
},f:function(){try{a||null==n.return||n.return()}finally{if(s)throw u}}}}function v(e,r){return function(e){
if(Array.isArray(e))return e}(e)||function(e,r){
var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){
var t,i,u,a,s=[],c=!0,f=!1;try{if(u=(n=n.call(e)).next,0===r);else for(;!(c=(t=u.call(n)).done)&&(s.push(t.value),
s.length!==r);c=!0);}catch(e){f=!0,i=e}finally{try{if(!c&&null!=n.return&&(a=n.return(),Object(a)!==a))return}finally{
if(f)throw i}}return s}}(e,r)||A(e,r)||function(){
throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}()}function I(e){var r=function(e,r){if("object"!=typeof e||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){
var t=n.call(e,r);if("object"!=typeof t)return t;throw new TypeError("@@toPrimitive must return a primitive value.")}
return String(e)}(e,"string");return"symbol"==typeof r?r:r+""}function A(e,r){if(e){if("string"==typeof e)return l(e,r)
;var n={}.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),
"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?l(e,r):void 0}}
function O(e){var r=e.replaceAll("ё","е"),n=r.length%2,t=1,i=5381;function u(){i=(33*i+(255&n))%4294967296,n>>=8,t-=8}
var a,s=S(r);try{for(s.s();!(a=s.n()).done;){var c=a.value.charCodeAt(0)-1072&31;n|=c<<t,(t+=5)>=8&&u()}}catch(e){s.e(e)
}finally{s.f()}t>0&&u();var f=r.charCodeAt(0)%2;return 2*(2147483647&i)+f}function p(e){
for(var r=new Array(e.length),n=0;n<e.length;n++){var t=e.charCodeAt(n)
;t>=1040&&t<=1071?t+=32:t>=1024&&t<=1039&&(t+=80),r[n]=t}return String.fromCharCode.apply(null,r)}function N(e){
var r=e.charCodeAt(0)-1072;return 33===r?32:r===(31&r)?1<<r:0}function T(e,r){return 0!==(e&N(r))}
var g=3892855073,b=66567902,C=66567390;function m(e){return T(g,p(e))}function y(e,r){
return r===r.toUpperCase()?e.toUpperCase():e}function w(e){return e.split("").filter(m).length}function W(e){
return e.replaceAll("ё","е").replaceAll("Ё","Е")}function _(e,r){return e.substring(0,e.length-r)}function U(e,r){
return e.substring(e.length-r)}function R(e){return _(e,1)}function L(e){return U(e,1)}function M(e,r){
var n=e.length-r-1;return e.substring(n,n+1)}function V(e,r){return r.some(function(r){return e.endsWith(r)})}
function P(e,r,n){return(e.length?e:[!1]).map(function(e){return n(e?W(r):r,e)})}var k=function(){function e(r){
h(this,e),
r instanceof e?(this._txt=r._txt,this._lc=r._lc,this._hash=r._hash,this._flags=r._flags):(r.pluraleTantum?this._flags=5:this._flags=1+t.indexOf(r.gender),
this._txt=r.text,this._lc=r.text.toLowerCase(),this._hash=O(this._lc),this._flags|=8*(1&r.indeclinable),
this._flags|=16*(1&r.animate),this._flags|=32*(1&r.surname),this._flags|=64*(1&r.name),this._flags|=128*(1&r.transport),
this._flags|=65536*(2+function(e,r,n,t){if(r)return-2;if(t)return-1;var u=L(e);switch(n){case i.FEMININE:
return"а"===u||"я"===u?2:T(b,u)?-1:3;case i.MASCULINE:return"а"===u||"я"===u?2:"путь"===e?0:1;case i.NEUTER:
return["дитя","полудитя"].includes(e)?0:"мя"===U(e,2)?3:1;case i.COMMON:return"а"===u||"я"===u?2:"и"===u?-1:1;default:
return-2}}(this._lc,r.pluraleTantum,r.gender,r.indeclinable)))}return d(e,[{key:"equals",value:function(r){
return r instanceof e&&this._flags===r._flags&&this.lower()===r.lower()}},{key:"text",value:function(){return this._txt}
},{key:"lower",value:function(){return this._lc}},{key:"isPluraleTantum",value:function(){return 5==(7&this._flags)}},{
key:"getGender",value:function(){var e=7&this._flags;if(e>=1&&e<=4)return t[e-1]}},{key:"isIndeclinable",
value:function(){return!!(8&this._flags)}},{key:"isAnimate",value:function(){
return!!(16&this._flags)||this.isASurname()||this.isAName()}},{key:"isASurname",value:function(){
return!!(32&this._flags)}},{key:"isAName",value:function(){return!!(64&this._flags)}},{key:"isATransport",
value:function(){return!!(128&this._flags)}},{key:"getDeclension",value:function(){return(this._flags>>16)-2}},{
key:"getSchoolDeclension",value:function(){var e=this.getDeclension();return 1===e?2:2===e?1:e}}],[{key:"create",
value:function(e){if(e instanceof this)return e;var r=j(e);if(r)throw new Error(r);return Object.freeze(new this(e))}},{
key:"createOrNull",value:function(e){return null===j(e)?Object.freeze(new this(e)):null}}])}();function x(e,r){
var n=new k(e);return n._txt=r,n._lc=r.toLowerCase(),n._hash=O(n.lower()),Object.freeze(n)}function j(e){
if(null==e)return"No parameters specified."
;for(var r=0,n=["pluraleTantum","indeclinable","animate","surname","name","transport"];r<n.length;r++){var i=n[r]
;if(function(e){return null!=e&&"boolean"!=typeof e}(e[i]))return i+" must be boolean."}
if(null==e.text)return"A cyrillic word required.";if(!e.pluraleTantum){
if(null==e.gender)return"A grammatical gender required.";if(!t.includes(e.gender))return"Bad grammatical gender."}
return null}function F(e){var r,n=new Set,t=0,i=S(e);try{for(i.s();!(r=i.n()).done;){t+=r.value,n.add(t)}}catch(e){
i.e(e)}finally{i.f()}return n}
var z=F([11720389,548,1024,1479,2622,2867,1222,2642,264,1328,137,123,397,65542229,212447047,31729170,8094836,1056,21701789,35520559,40358,21819,28248,119786,63892,31809,7356,74383,72369,5945,28902,90120738,21187517,91925642,3054826,1600765,65934,30948851,5569212,4205640,5412804,6787095,9749916,3940084,1511466,1303038,16090470,1376628,49919694,3827522,37915959,14032615,28701924,224587434,637275762,51079457,391103676,24108070,158999424,232633267,6058815,66599250,692781441,816204112,55209380,72754,90006,80058,45564,67845,42548,27193,21401,139393,750335,170896,4424,1566,6264,154969,17292,17229,175112,83011,117872,4183,13065,108972,108088,343663,66210,334,17090,380271,283272,59007,35796,230801,1067156,19992,157124,12433,252644,2626,23776,630482,531296,304718,90891,726,23116,47653,30493,167310,50156,123071,477118,241821,55660,908992,534269,205157,11218,2490,660,66391,46856,847526,68710,8450,36630,15642,109864,41716,354482,79820,51876,97325,5506,46436,191803,3957,40876,126323,2347821,338490,73216,475569,87602,29642,4220,10760,16896,50156,17424,35178,167244,126786,33643,30488,65045,35961,51453,55660,4,152461,138332,1958,34200,3709,61381,17424,30158,80591,11218,44099,260487]),D=F([11720389,548,1024,1060,4,5904,1848,4404,330555234,4691346,3365076,1045362,7414584,960432,10564312,253286,16178203,4357,4355,11350,31120,5248,40591,62367,54057,50487,13069,3664,39764,10263,3002,5810,8844,24551,4091,56761,21785,30553,55147139,15960625,1933097,12258067,16302047,54210486,45688435,1659767,4813249,33577763,2501798,10056946,672528,14209351,2012340,1655412,4652736,62568,148698,21186,71129124,260014161,108045611,1007583269,2026464,22799532,750068913,1499532,1285428194,74598,22348,6599,132273,309821,156816,397448,179394,148036,100257,21779,11218,36631,345954,50442,104394,2724,112115,30690,10552,31377,11286,7168,14612,51480,116537,192258,163145,65604,97951,1363157,212810,431243,2622,425588,275284,150351,570568,244701,16659,26136,130134,11040,159389,728373,3476,726,1290392,224730,189158,11218,2490,10750,21608,143747,65974,664563,84036,16283,17424,5758,45080,33066,1782,90658,37101,56107,233163,14216,5518,179264,2525,146957,111342,80594,2309,4217,25432,26905,29980,518951,1458289,523705,4202,477865,149368,126310,47828,212678,22744,269176,179119,4399,35997,69696,41777,41,127336,4202,73153,46372,114255,126869,23630,11218]),G=function(){
return d(function e(){h(this,e),this._filter=new Uint8ClampedArray(256)},[{key:"addInteger",value:function(e){
this.addRaw(H(e))}},{key:"hasInteger",value:function(e){return this.hasRaw(H(e))}},{key:"addRaw",value:function(e){
var r=2047&e,n=r>>>3;this._filter[n]=this._filter[n]|1<<7-r%8}},{key:"hasRaw",value:function(e){var r=2047&e
;return!!(this._filter[r>>>3]>>>7-r%8&1)}},{key:"clone",value:function(){return B(this._filter)}}])}();function B(e){
var r=new G;return r._filter=Uint8ClampedArray.from(e),r}function H(e){return e>>>22&2047^e>>>11&2047^2047&e}
function J(e){var r=e.padStart(3,"а");return(7&r.charCodeAt(0))<<8|(15&r.charCodeAt(1))<<4|15&r.charCodeAt(2)}
var X,Y=(X=new G,z.forEach(function(e){return X.addInteger(e)}),D.forEach(function(e){return X.addInteger(e)}),
Object.freeze(X));function q(){var e=new Map,n=Y.clone(),t=function(e){return 4294967296*(31&e._flags)+e._hash
},u=function(e){return e.lower().indexOf("ё")+1&255},a=function(r){var n=65504&r._flags,i=function(r){
var n=t(r),i=e.get(n);return i instanceof Array?i:[]}(r).filter(function(e){return(e[0]&n)<=n}),a=i.filter(function(e){
return e[0]>>16===u(r)});return a.length?a[0][1]:i.length?i[0][1]:void 0};this.put=function(r,i){
var a=i.split("-"),s=function(e,r){return e.length!==r||e.split("").some(function(e){return!"SsbeE".includes(e)})}
;if(2!==a.length||s(a[0],7)||s(a[1],6))throw new Error("Bad settings format.");var c=k.create(r),f=t(c),o=e.get(f)
;o instanceof Array||(o=[],e.set(f,o));var l=65535&c._flags|u(c)<<16,h=o.find(function(e){return l===e[0]})
;h?h[1]=i:o.push([l,i]),n.addInteger(c._hash)};var s=function(e){switch(e){case"E":return[!0];case"e":return[!0,!1]
;case"b":case"s":return[!1,!0];default:return[!1]}};this.hasStressedEndingSingular=function(e,t){
if(n.hasInteger(e._hash)){var u=r.indexOf(t);if(u>=0){var c=a(e);if(c){var f=c.split("-")[0];return s(f[u])}
if(e.getGender()===i.MASCULINE){if(z.has(e._hash))return s("SEESEEE"[u]);if(D.has(e._hash))return s("SEEEEEE"[u])}}}
return[]},this.hasStressedEndingPlural=function(e,t){if(n.hasInteger(e._hash)){var u=r.indexOf(t);if(u>=0&&u<6){
var c=a(e);if(c){var f=c.split("-")[1];return s(f[u])}
if(e.getGender()===i.MASCULINE&&(z.has(e._hash)||e.isAnimate()&&D.has(e._hash)))return s("E")}}return[]}}function $(e){
var r,n=new Map,t=S(e);try{for(t.s();!(r=t.n()).done;)for(var i=r.value,u=n,a=i.length-1;a>=0;a--){var s=i.charCodeAt(a)
;if(a>0){var c=u.get(s);if(0===c)break;void 0===c&&u.set(s,new Map),u=u.get(s)}else u.set(s,0)}}catch(e){t.e(e)}finally{
t.f()}return n}function K(e,r){for(var n=r,t=e.length-1;t>=0;t--){var i=e.charCodeAt(t);if(!n.has(i))return!1
;var u=n.get(i);if(0===u)return!0;n=u}}
var Q=$(["ое","нький","ский","ской","лстой","отой","утой","евой","овой","живой"]),Z=$(["ее","ое","нький","ский","ской","лстой","отой","утой"]),ee=$(["евой","овой","отой","живой"]),re=$(["шний","жний","щий","ший","жий","чий"]),ne=["божий","ажий","яжий","ужий","южий","бульдожий","кабарожий","медвежий","носорожий","миножий"],te=$(ne),ie=$(ne.map(function(e){
return _(e,2)+"ьи"
})),ue=new Set(["бубен","бугор","ветер","вошь","вымысел","горшок","деготь","дёготь","дятел","домысел","замысел","кашель","коготь","лапоть","лоб","локоть","ломоть","молебен","мох","ноготь","овен","пепел","пес","пёс","петушок","помысел","порошок","промысел","псалом","пушок","ров","рожь","рот","сон","стебель","стишок","угол","умысел","хребет","церковь","шов","ковер","овес","костер"].map(O)),ae=new G
;ue.forEach(function(e){return ae.addInteger(e)})
;var se=$(["овёс","ковёр","костёр","шатер","шатёр","козел","козёл","котел","котёл","орел","орёл","осел","осёл","узел","уголь","чок","ешок","хол"])
;function ce(e,r){var n=L(r);if(T(-402111711,n)){if(T(g,M(r,1))){var t=_(e,2);return K(r,te)?t+y("ь",t):t}
if("й"!==n)return R(e)}return e}var fe=["ясень","бюллетень","олень","тюлень","гордень","пельмень","ячмень"]
;function oe(e,r,n){var t,u=e.text(),a=L(r),s=N(a);return-133667019&s&&(-402111711&s?t=function(e,r,n){var t=M(r,1)
;return"ь"===t||"о"===n&&T(2504708,t)?R(e):ce(e,r)}(u,r,a):"к"===a?t=function(e,r,n){
return e.length>=4&&V(r,["рёк","нёк","лёк"])&&!1!==n?_(e,2)+"ьк":r.endsWith("ёк")&&T(g,M(r,2))?_(e,2)+"йк":void 0
}(u,r,n):"ь"===a?t=function(e,r,n){
return ue.has(e._hash)||K(n,se)?_(r,3)+M(r,1):n.endsWith("ень")&&e.getGender()===i.MASCULINE&&!V(n,fe)?_(r,3)+"н":R(r)
}(e,u,r):(["лёд","лед","лён"].includes(r)||"лев"===r&&e.isAnimate())&&(t=_(u,2)+y("ь",M(u,1))+L(u))),
t||(t=function(e,r,n){
return!!(199680&n)&&K(r,se)&&!["новосел","новосёл"].includes(r)||!!(2571270&n)&&(ae.hasInteger(e._hash)&&ue.has(e._hash)||e.isAnimate()&&r.endsWith("посол"))
}(e,r,s)?_(u,2)+L(u):u),t}function le(e,r){var n=R(e),t=R(r.lower());if("а"===L(t))return n
;if(V(t,["зне","жне","гре","спе","мудре"])||U(R(t),3).split("").every(function(e){return T(C,e)})||r.isAName())return n
;if("ле"===U(t,2)){var i=M(t,2);return T(g,i)||"л"===i?R(n)+"ь":n}
return T(g,L(t))&&"и"!==L(t)?T(g,L(R(t)))?_(e,2)+"й":V(r.lower(),["месяц"])?n:_(e,2):n}
var he=$(["лапоток","желток","нишок","ришок","ишек"]),Ee=["поток","приток","переток","проток","биоток","электроток","восток","водосток","водоток","воток","знаток"],de=["инок","исток","обморок","порок","пророк","сток","урок"]
;function Se(e){
return V(e,["чек","шек"])&&e.length>=6||K(e,he)||e.endsWith("ок")&&!e.endsWith("шок")&&!de.includes(e)&&!V(e,Ee)&&!T(g,M(e,2))&&(T(g,M(e,3))||V(_(e,2),["ст","рт"]))&&e.length>=4
}var ve={"дочь":"дочерь","мать":"матерь"};function Ie(e,r,t){var i=r.text(),u=r.lower()
;if(![n.NOMINATIVE,n.ACCUSATIVE].includes(t)&&Object.keys(ve).includes(u))return Ie(e,x(r,ve[u]),t);var a=oe(r,u)
;if(function(e){return e.endsWith("полночь")||e.startsWith("пол")&&T(134217984,L(e))&&w(e)>=2
}(u)&&(a="полу"+a.substring(3)),"мя"===U(u,2))switch(t){case n.NOMINATIVE:case n.ACCUSATIVE:return i;case n.GENITIVE:
case n.DATIVE:case n.PREPOSITIONAL:case n.LOCATIVE:return a+"ени";case n.INSTRUMENTAL:return a+"енем"}else switch(t){
case n.NOMINATIVE:case n.ACCUSATIVE:return i;case n.GENITIVE:case n.DATIVE:case n.PREPOSITIONAL:case n.LOCATIVE:
return a+"и";case n.INSTRUMENTAL:return V(u,["вошь","рожь","церковь"])?i+"ю":a+"ью"}}function Ae(e,r,t){
var i=r.text(),u=r.lower();if(u.endsWith("путь"))return t===n.INSTRUMENTAL?R(i)+"ём":Ie(e,r,t)
;if(!u.endsWith("дитя"))throw new Error("unsupported");switch(t){case n.NOMINATIVE:case n.ACCUSATIVE:return i
;case n.GENITIVE:case n.DATIVE:case n.PREPOSITIONAL:case n.LOCATIVE:return i+"ти";case n.INSTRUMENTAL:
return[i+"тей",i+"тею"]}}function Oe(e,r,t){var i=r.text(),u=r.lower(),a=oe(r,u),s=p(a),c=R(i),f=R(u),o=function(){
return"я"===L(u)},l=function(){return u.endsWith("ая")&&!(2===w(i)||T(g,L(s)))},h=function(){
return u.endsWith("яя")&&!(2===w(i)||T(g,L(s)))},E=["жая","шая"];switch(t){case n.NOMINATIVE:return i;case n.GENITIVE:
return h()||V(u,E)?a+"ей":l()?a+"ой":r.isASurname()&&!u.endsWith("да")?c+"ой":u.endsWith("ничья")?c+"ей":o()||T(60818504,L(s))?c+"и":c+"ы"
;case n.DATIVE:
return h()||V(u,E)?a+"ей":l()?a+"ой":r.isASurname()&&!u.endsWith("да")?c+"ой":"ия"===U(u,2)?c+"и":u.endsWith("ничья")?c+"ей":c+"е"
;case n.ACCUSATIVE:return l()?a+"ую":h()?a+"юю":o()?c+"ю":c+"у";case n.INSTRUMENTAL:
return h()||V(u,E)?a+"ею":l()?[a+"ой",a+"ою"]:o()||"жшчщц".includes(L(s))&&!e.sd.hasStressedEndingSingular(r,t).includes(!0)?"и"===L(f)?c+"ей":[c+"ей",c+"ею"]:[c+"ой",c+"ою"]
;case n.PREPOSITIONAL:case n.LOCATIVE:
return h()||V(u,E)?a+"ей":l()?a+"ой":r.isASurname()&&!u.endsWith("да")?c+"ой":"ия"===U(u,2)?c+"и":u.endsWith("ничья")?c+"ей":c+"е"
}}var pe=$(["ов","ев","ёв","ин","ын"]),Ne=function(e,r){for(var n=r,t=0;t<e.length;t++){var i=e.charCodeAt(t),u=n
;(n=new Map).set(i,u)}return n}("ы",pe);function Te(e){return e.filter(function(r,n){return e.indexOf(r)===n})}
function ge(e){var r=1&e.lower().includes("ё");return 4294967296*((65535&e._flags)<<1|r)+e._hash}
var be=Object.freeze(function(){var e=new Map,r=Object.freeze({gender:i.MASCULINE}),n=Object.freeze({gender:i.MASCULINE,
animate:!0});function t(r,n,t,i,u){var a,c=i.split(","),o=u instanceof Array?u:[s.U_SUFFIX],l=S(c);try{
for(l.s();!(a=l.n()).done;){var h=a.value,E=Object.assign({},r);E.text=h;var d=ge(k.create(E)),v=e.get(d);v||(v=[],
e.set(d,v));var I,A=S(t);try{for(A.s();!(I=A.n()).done;){var O,p=I.value,N=S(o);try{for(N.s();!(O=N.n()).done;){
var T=O.value;v.push(f(p,T,n))}}catch(e){N.e(e)}finally{N.f()}}}catch(e){A.e(e)}finally{A.f()}}}catch(e){l.e(e)}finally{
l.f()}}var u=Object.freeze([c.V]),o=Object.freeze([c.VO]),l=Object.freeze([c.NA])
;t(r,a.CONTAINER,u,"мозг,пруд,стог,таз,год"),t(r,a.CONTAINER,o,"рот"),t(r,a.WAY,u,"год"),t(r,a.CONTAINER,u,"гроб"),
t(r,a.CONTAINER|a.RELIGIOUS,o,"гроб",[s.PREPOSITIONAL]),
t(r,a.LOCATION,u,"ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,низ,хлев"),
t(r,a.STRUCTURE,u,"круг,полк,артполк,ряд,род,строй,лад"),t(r,a.SURFACE,l,"баз,берег,бережок,вал,кон,круг,луг,пол,яр"),
t(r,a.WAY,l,"век,день"),t(r,a.WAY,u,"час"),t(r,a.WAY,l,"корень"),t(n,a.OBJECT_WITH_FUNCTIONAL_SURFACE,l,"вор"),
t(r,a.OBJECT_WITH_FUNCTIONAL_SURFACE,l,"повод,бочок,борт,воз,горб,кол,мост,плот,сук,х"+String.fromCharCode(1091)+"й"),
t(r,a.OBJECT_WITH_FUNCTIONAL_SURFACE,l,"крюк,болт",[s.PREPOSITIONAL,s.U_SUFFIX]);var h=",мёд,мех,пар,пух"
;t(r,a.SUBSTANCE,u,"дым,жир,мел,пушок"+h),
t(r,a.RESOURCE,l,"газ,клей,спирт"+h),t(r,a.CONDITION,u,"бой,бред,быт,долг,плен,пыл,сок,ход,лад"),
t(r,a.EXPOSURE,u.concat(l),"вид"),t(r,a.EXPOSURE,l,"слух,счёт,ветер,ветр,свет"),t(r,a.MOTION,l,"ход,бег,вес"),
t(r,a.MOTION|a.WITH_ADJECTIVE,l,"шаг"),t(r,a.EVENT,l,"бал,пир"),t(r,a.CONDITION,l,"дух,плав"),
t(r,a.MOTION|a.WITH_ADJECTIVE,l,"газ"),t(r,a.CONTAINER,u,"глаз,зоб,нос,шкаф"),t(r,a.CONTAINER,o,"лоб"),
t(r,a.OBJECT_WITH_FUNCTIONAL_SURFACE,l,"глаз,лоб,нос,шкаф,холм");var E="бок,верх,зад,угол";return t(r,a.LOCATION,u,E),
t(r,a.OBJECT_WITH_FUNCTIONAL_SURFACE,l,E),t(r,a.LOCATION|a.WITHOUT_ADJECTIVE,u,"край"),
t(r,a.OBJECT_WITH_FUNCTIONAL_SURFACE|a.WITHOUT_ADJECTIVE,l,"край"),t(r,a.SURFACE,l,"лёд,мох,снег"),
t(r,a.SUBSTANCE,o,"лёд,лён,мох"),t(r,a.SUBSTANCE,u,"снег"),e
}()),Ce=new Set("клей,чай,дом,дух,дым,дымок,газ,год,горошек,жар,жир,квас,пар,пыл,род,рост,сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,табак,творог,толк,торф,туман,убыток,укроп,уксус,ход,цемент,чеснок,шаг,шик,шиповник,шоколад,шорох,шум,яд".split(",")),me=new G
;Ce.forEach(function(e){return me.addInteger(O(e))})
;var ye=$(["й","ие","иё"]),we=$(["воробей","муравей","ручей","соловей","улей"]),We=$(["мой","ной","дой","шой","жой","рзой","осой","хой","латой","витой","литой","питой","житой","отой","утой","ятой","лагой","рагой","огой","угой","лубой","любой","илой","ылой","злой","малой","овой","евой","живой","ской","акой","укой","нний","ский","йкий","цкий","зкий","ткий","лкий","мкий","хкий","оркий","аркий","яркий","ький","ёкий","бокий","оокий","cокий","токий","ликий","дикий","укий","ыкий","який","пкий","дкий","бкий","нкий","жкий","чкий","гкий","овкий","авкий"])
;function _e(e,r){return"ый"===U(r,2)||(r.endsWith("кривой")||K(r,We))&&w(r)>=2}
var Ue=$(["ий","ие","чье","тье","дье","вье","бье","жалованье","енье","ружье","божье","верье","мужье"]),Re=$(["вое","лое","мое","ное","рое","тое","той","ый"])
;function Le(e,r,t){
var u=r.text(),a=p(u),s=L(a),c=r.getGender(),f=e.sd.hasStressedEndingSingular(r,t),l=oe(r,a,f[0]),h=R(u),E=Ve(a)
;E&&(l="полу"+l.substring(3),h="полу"+h.substring(3));var d=p(l),S=function(){return E&&a.endsWith("я")||ke(a)
},v=K(a,ye),I=function(){return K(a,we)?R(h)+y("ь",L(h)):h},A=function(){return"чщ".includes(L(d))};function O(e){
return!r.isAnimate()&&me.hasInteger(r._hash)&&Ce.has(a)&&("й"===s?e.push(R(u)+y("ю",L(u))):e=e.concat(P(f,l,function(e){
return e+y("у",L(e))}))),e}switch(t){case n.NOMINATIVE:return u;case n.GENITIVE:switch(s){case"и":case"ы":
if(E)return Me(e,r,t,a);break;case"й":case"е":if(v&&r.isASurname()||_e(0,a)||K(a,Q))return l+"ого"
;if(K(a,re)||a.endsWith("ее"))return l+"его";case"ё":case"я":case"ь":if(v)return O([I()+"я"]);if(S()&&!A())return l+"я"
;break;case"ц":return le(u,r)+"ца";case"к":if(Se(a))return R(h)+"ка";break;case"о":
if(V(a,["шко"])&&i.MASCULINE===c)return h+"и"}return O(r.isASurname()||-1===d.indexOf("ё")?[l+"а"]:P(f,l,function(e){
return e+"а"}));case n.DATIVE:switch(s){case"и":case"ы":if(E)return Me(e,r,t,a);break;case"й":case"е":
if(v&&r.isASurname()||_e(0,a)||K(a,Q))return l+"ому";if(K(a,re)||a.endsWith("ее"))return l+"ему";case"ё":case"я":
case"ь":if(v)return I()+"ю";if(S()&&!A())return l+"ю";break;case"ц":return le(u,r)+"цу";case"к":
if(Se(a))return R(h)+"ку"}return r.isASurname()||-1===d.indexOf("ё")?l+"у":P(f,l,function(e){return e+"у"})
;case n.ACCUSATIVE:return c===i.NEUTER||"иы".includes(s)&&E?u:r.isAnimate()?Le(e,r,n.GENITIVE):u;case n.INSTRUMENTAL:
switch(s){case"и":case"ы":if(E)return Me(e,r,t,a);break;case"й":case"е":case"ё":case"я":case"ь":
if(v&&r.isASurname()||K(a,Z))return K(a,Re)?l+"ым":l+"им";if(_e(0,a))return"и"===M(a,1)||a.endsWith("хой")?l+"им":l+"ым"
;if(K(a,ee))return l+"ым";if(K(a,re))return l+"им";if(v)return I()+"ем";if(a.endsWith("це"))return u+"м";break;case"ц":
return P(f,u,function(e,n){return n?le(e,r)+"цом":le(e,r)+"цем"});case"к":if(Se(a))return R(h)+"ком";break;case"н":
case"в":if(r.isASurname()&&K(a,pe))return u+"ым"}return S()||"жшчщ".includes(L(d))?P(f,l,function(e,r){
return r?e+"ом":e+"ем"}):r.isASurname()||-1===d.indexOf("ё")?l+"ом":P(f,l,function(e){return e+"ом"});case n.LOCATIVE:
if("полпути"===a)return u;var N=be.get(ge(r));if(N)return Te(N.map(function(e){return o(e)})).map(function(n){
return Pe(e,r,n)});case n.PREPOSITIONAL:switch(s){case"и":if("полпути"===a)return u;case"ы":if(E)return Me(e,r,t,a)
;break;case"й":case"е":case"ё":case"я":case"ь":if(v&&r.isASurname()||_e(0,a)||K(a,Q))return l+"ом"
;if(K(a,re)||a.endsWith("ее"))return l+"ем";if(V(a,["воробей"])){var T=R(h);return T+y("ье",L(T))}
if(K(a,Ue)&&!V(a,["запястье","здоровье","изголовье","платье"]))return h+"и";if("й"===s||"иё"===U(a,2))return I()+"е"
;break;case"ц":return le(u,r)+"це";case"к":if(Se(a))return R(h)+"ке"}
return r.isASurname()||-1===d.indexOf("ё")?l+"е":P(f,l,function(e){return e+"е"})}}function Me(e,r,n,t){
var i=function(){return"полминуты"!==t?"полу"+r.text().substring(3):r.text()}
;return"полпути"===t?Ae(e,x(r,R(i())+"ь"),n):t.endsWith("зни")||t.endsWith("сти")?Ie(e,x(r,R(i())+"ь"),n):Oe(e,x(r,R(i())+("ни"===U(t,2)?"я":"а")),n)
}function Ve(e){if(e.startsWith("пол")&&T(2550137089,L(e))&&"л"!==e[3]&&w(e)>=2){
var r=e.substring(3),n=r.search(/[а-яё]/);return n>=0&&T(b,r[n])}return!1}function Pe(e,r,t){if(s.U_SUFFIX===t){
var i=r.text(),u=r.lower(),a=oe(r,u),c=R(i),f=Ve(u)&&u.endsWith("я")||ke(u)
;return"й"===L(u)?W(c)+"ю":f?W(a)+"ю":Se(u)?W(R(c))+"ку":W(a)+"у"}if(s.PREPOSITIONAL===t)return Le(e,r,n.PREPOSITIONAL)}
function ke(e){return"ь"===L(e)&&!e.endsWith("господь")||"её".includes(L(e))&&!V(e,["це","же"])}
var xe,je=new G,Fe=Object.freeze([[[i.MASCULINE,void 0],{"болгарин":["болгары"],"господин":["господа"],
"дядя":["дяди","дядья"],"зуб":["зубы","зубья"],"клок":["клочья","клоки"],"князь":["князи","князья"],
"кол":["колы","колья"],"месяц":["месяцы"],"полдень":["полдни","полудни"],"татарин":["татары"],"хозяин":["хозяева"],
"цветок":["цветки","цветы"],"черт":["черти"],"чёрт":["черти"]}],[[i.MASCULINE,!0],{
"кондуктор":["кондуктора","кондукторы"],"кум":["кумовья"],"муж":["мужья","мужи"]}],[[i.FEMININE,void 0],{
"гроздь":["грозди","гроздья"],"курица":["курицы","куры"],"стая":["стаи"],"щека":["щёки"],"береста":["берёсты"],
"верста":["вёрсты"],"десна":["дёсны"],"жена":["жёны"],"звезда":["звёзды"],"кинозвезда":["кинозвёзды"],
"медсестра":["медсёстры"],"метла":["мётлы"],"пчела":["пчёлы"],"сестра":["сёстры"],"слеза":["слёзы"]
}],[[i.NEUTER,void 0],{"брюхо":["брюхи"],"колено":["колена","колени","коленья"],"древо":["древа","древеса"],
"ухо":["уши"],"око":["очи"],"дно":["донья"],"чудо":["чудеса","чуда"],"небо":["небеса"],"бревно":["брёвна"],
"ведро":["вёдра"],"веретено":["веретёна"],"весло":["вёсла"],"гнездо":["гнёзда"],"зерно":["зёрна"],"знамя":["знамёна"],
"колесо":["колёса"],"облачко":["облачка"],"озеро":["озёра"],"полсотни":["полусотни"],"ребро":["рёбра"],
"ремесло":["ремёсла"],"седло":["сёдла"],"село":["сёла"]}]]),ze=S(Fe);try{for(ze.s();!(xe=ze.n()).done;){var De=xe.value
;Object.keys(De[1]).map(function(e){return je.addInteger(O(e))})}}catch(e){ze.e(e)}finally{ze.f()}
var Ge=["зять","деверь","друг","брат","собрат","стул","брус","обод","полоз","струп","подмастерье","якорь","перо","шило"],Be=new Set(["берег","бок","борт","век","вес","веер","вексель","вечер","глаз","голос","город","доктор","дом","детдом","егерь","жемчуг","катер","колокол","концлагерь","корм","короб","кузов","купол","лес","луг","мастер","номер","пояс","провод","рог","сахар","снег","сорт","стог","счет","счёт","спецсчет","спецсчёт","субсчет","субсчёт","терем","том","холод","цвет","череп"]),He=$(["округ","остров","отпуск","паспорт","парус","поезд","повар","погреб","рукав","цех","юнкер"]),Je=new Set(["адрес","договор","буфер","ворох","директор","инспектор","инструктор","корпус","крейсер","орден","ордер","прожектор","пропуск","род","свитер","сервер","тенор","тон","трактор","тормоз","ветер","верх","китель","мех","хлеб","юнкер","ястреб"]),Xe=new Set(["бункер","вымпел","год","образ","омут","токарь","тополь","шторм","штуцер"])
;function Ye(e,r){var t=[],u=r.text(),a=p(u),s=e.sd.hasStressedEndingPlural(r,n.NOMINATIVE);Object.freeze(s)
;var c=oe(r,a,s[0]),f=p(c);if(a.endsWith("яя"))return t.push(_(u,2)+"ие"),Te(t);var o=function(t){
var i=e.sd.hasStressedEndingPlural(r,n.NOMINATIVE).map(function(e){return!e});return i.length?i.map(function(e){
return e?1===f.replace(/[^её]/g,"").length?t(function(e){
var r=Math.max(e.toLowerCase().lastIndexOf("е"),e.toLowerCase().lastIndexOf("ё")),n=y("ё",e[r])
;return e.substring(0,r)+n+e.substring(r+1)}(c)):t(c):t(W(c))}):[t(c)]
},l=r.getGender(),h=r.getDeclension(),E=("й"===L(a)||T(g,L(a)))&&T(g,L(R(a)))?R(u):c,d=function(){
return(a.endsWith("евич")||a.endsWith("евна"))&&a.indexOf("ье")>=0};function I(){
var e=E,r=p(e).indexOf("ье"),n=y("и",e[r]);return e.substring(0,r)+n+e.substring(r+1)}function A(){
T(60818504,L(f))||"яйь".includes(L(a))||V(a,["сосед"])?d()?(t.push(I()+"и"),
t.push(E+"и")):Array.prototype.push.apply(t,P(s,E,function(e){return e+"и"
})):"ц"===L(a)?t.push(le(u,r)+"цы"):d()?(t.push(I()+"ы"),t.push(E+"ы")):Array.prototype.push.apply(t,P(s,E,function(e){
return e+"ы"}))}if(je.hasInteger(r._hash)){var O,N=S(Fe);try{for(N.s();!(O=N.n()).done;){
var b=v(O.value,2),C=b[0],m=b[1],w=C[0],k=C[1];if(l===w&&(null==k||k===r.isAnimate())&&m.hasOwnProperty(a)){
var x,j=S(m[a]);try{for(j.s();!(x=j.n()).done;){var F=x.value;t.push(F)}}catch(e){j.e(e)}finally{j.f()}return Te(t)}}
}catch(e){N.e(e)}finally{N.f()}}
var z="ь"===L(f)?c:"к"===L(f)?R(c)+"чь":"г"===L(f)?R(c)+"зь":"й"===L(a)?R(u):V(a,["рь","ль"])?c:c+"ь";switch(h){case-1:
t.push(u);break;case 0:if("путь"===a)t.push("пути");else{if(!a.endsWith("дитя"))throw new Error("unsupported")
;t.push(_(u,3)+"ети")}break;case 1:if(Ge.includes(a))t.push(z+"я");else if(i.MASCULINE===l){
"сын"===a?(t.push("сыновья"),
A()):"человек"===a?(t.push("люди"),A()):["крюк","лист","лоскут","повод","прут","сук","учитель","флигель","штабель"].includes(a)||"соболь"===a&&r.isAnimate()?(A(),
t.push(z+"я")):["клин","колос","ком","край","соболь"].includes(a)?t.push(z+"я"):Be.has(a)||K(a,He)||Je.has(a)||Xe.has(a)?(Xe.has(a)&&A(),
ke(a)?Array.prototype.push.apply(t,o(function(e){return e+"я"})):s.includes(!0)?t.push(W(c)+"а"):t.push(c+"а"),
Je.has(a)&&A()):(a.endsWith("анин")&&a.length>5||a.endsWith("янин"))&&!r.isAName()||["барин","боярин"].includes(a)?(t.push(_(u,2)+"е"),
"барин"===a&&t.push(_(u,2)+"ы")):["цыган"].includes(a)?t.push(u+"е"):"щенок"===a?(t.push(_(u,2)+"ки"),
t.push(_(u,2)+"ята")):!a.endsWith("ребёнок")&&!a.endsWith("ребенок")||a.endsWith("жеребёнок")||a.endsWith("жеребенок")||a.endsWith("ястребёнок")||a.endsWith("ястребенок")?(a.endsWith("ёнок")||a.endsWith("енок"))&&r.isAnimate()?t.push(_(u,4)+"ята"):a.endsWith("ёночек")&&r.isAnimate()?t.push(_(u,6)+"ятки"):a.endsWith("онок")&&"жшч".includes(M(a,4))&&r.isAnimate()?t.push(_(u,4)+"ата"):Se(a)?t.push(_(u,2)+"ки"):K(a,re)?V(a,ne)?t.push(_(u,2)+"ьи"):t.push(R(u)+"е"):_e(0,a)?a.endsWith("ый")||a.endsWith("ий")?t.push(R(u)+"е"):a.endsWith("ой")&&!V(a,["хой","ской"])?t.push(_(u,2)+"ые"):t.push(_(u,2)+"ие"):a.endsWith("его")?t.push(_(u,3)+"ие"):["воробей","муравей","ручей","соловей","улей","жеребей","ирей","репей","чирей"].includes(a)?t.push(_(u,2)+"ьи"):A():t.push(_(u,7)+"дети")
}else if(i.NEUTER===l)if(V(a,["ко","чо"])&&!V(a,["войско","облако"]))t.push(R(u)+"и");else if(a.endsWith("имое"))t.push(c+"ые");else if(a.endsWith("ее"))t.push(c+"ие");else if(a.endsWith("ое"))V(f,["г","к","ж","ш","х"])?t.push(c+"ие"):t.push(c+"ые");else if(V(a,["ие","иё"]))t.push(_(u,2)+"ия");else if(V(a,["ье","ьё"])){
var D=_(u,2),G=["безделье","варенье","воскресенье","жалованье","запястье","застолье","затишье","здоровье","зелье","изголовье","новоселье","одночасье","печенье","платье","побережье","поголовье","подворье","подземелье","подполье","поместье","предплечье","раздумье","сиденье","средневековье","увечье","угодье","устье"].includes(a)
;"е"!==L(a)||G||t.push(D+"ия"),t.push(D+"ья")
}else V(a,["дерево","звено","крыло"])?t.push(c+"ья"):V(a,["ле","ре"])?t.push(c+"я"):a.endsWith("судно")&&r.isATransport()?t.push(_(u,2)+"а"):(Array.prototype.push.apply(t,o(function(e){
return e+"а"})),V(a,["щупальце"])&&A());else t.push(c+"и");break;case 2:
"заря"===a?t.push("зори"):a.endsWith("ая")&&!a.endsWith("свая")?"жхчшщ".includes(L(f))||V(f,["вк","гк","ск","цк","ньк"])?t.push(c+"ие"):t.push(c+"ые"):A()
;break;case 3:
"мя"===U(a,2)?t.push(c+"ена"):Object.keys(ve).includes(a)?t.push(R(ve[a])+"и"):i.FEMININE===l?t.push(E+"и"):"и"===L(E)?t.push(E+"я"):t.push(E+"а")
}return Te(t)}
var qe=$(["ли","си","би","ви","ди","ти","пи","ри","ни","фи","зи","ьи","ья","ия","ря","ля","ая","аи","ои","уи","эи","ыи","яи","ёи","юи","еи","ии"]),$e=["беготни","болтовни","будни","вожжи","возни","доли","лапши","левши","люди","марли","моря","мощи","ноздри","пени","пятерни","распри","родни","сакли","сени","ступни","судьи","фигни","чукчи"],Ke=["головы","громадины","детины","деревенщины","дохлятины","дубины","ехидины","жадины","зверины","идиотины","кислятины","молодчины","орясины","остолопины","сиротины","скотины","старейшины","старины","старшины","уродины"],Qe=$(Ke),Ze=["адреса","паспорта","поезда","цеха","снега","бункера","буфера","берега","вымпела","голоса","города","директора","договора","доктора","жемчуга","инспектора","инструктора","колокола","кондуктора","короба","корпуса","крейсера","кузова","леса","мастера","номера","облачка","острова","отпуска","паруса","повара","погреба","пояса","провода","прожектора","пропуска","рукава","сахара","свитера","сервера","счета","трактора","тормоза","холода","цвета","черепа","шторма","штуцера","юнкера","ястреба","суда","корм"],er=$(Ze),rr=new Set(Ze.concat(["бега","беглецы","близнецы","бойцы","бока","борта","борцы","бруствера","брюшки","веера","века","венцы","верха","веса","весы","вечера","вороха","глупцы","года","гонцы","дворцы","дельцы","детдома","детдомы","дома","жеребцы","жильцы","жрецы","затишки","зубцы","излишки","истцы","катера","концы","корма","кузнецы","купола","купцы","лишки","луга","мертвецы","меха","мудрецы","облака","образа","образцы","огурцы","округа","омута","ордена","ордера","отцы","очки","певцы","песцы","пловцы","подлецы","продавцы","птенцы","резцы","рога","рода","рубцы","самцы","свинцы","сорта","соуса","спецы","стога","столбцы","стрельцы","творцы","тельцы","тенора","терема","тома","тона","торцы","хлеба","штришки","юнцы"])),nr=new Set(["авары","аланы","аршины","баклажаны","буквы","гольфы","граммы","гусары","дела","кадеты","килограммы","омы","помидоры","рентгены","ботинки","человеки","чулки","шорты"]),tr=new Set(["гектары","рельсы"]),ir=new G
;rr.forEach(function(e){return ir.addRaw(J(e))}),nr.forEach(function(e){return ir.addRaw(J(e))}),tr.forEach(function(e){
return ir.addRaw(J(e))})
;var ur=new Set(Ke.concat(["абазины","авы","аввы","бедняги","бедолаги","болгары","бродяги","брызги","брюки","брюхи","будды","бусы","валенки","веки","вельможи","верзилы","вилы","владыки","воеводы","волосы","вояки","главы","грузины","задворки","задиры","железы","жилы","зануды","зеваки","именины","калеки","кальсоны","каникулы","колготки","коллеги","крохи","курицы","куры","ладоши","ламы","лыки","макароны","мужчины","нападки","нары","непоседы","носилки","ножны","папы","папаши","таты","падлы","партизаны","погоны","поминки","посиделки","похороны","предтечи","работяги","разы","ребятки","румыны","самоубийцы","санки","убийцы","сапоги","сатаны","сироты","сливки","слуги","солдаты","старосты","сумерки","сутки","татары","телеса","хитрюги","четвереньки","шляпы","шмотки","яблоки","дядьки","дяденьки","зайки","кроссовки","малютки","малолетки","попки","турки","узы","хлопоты","шахматы"])),ar=new G
;ur.forEach(function(e){return ar.addRaw(J(e))})
;var sr=["х","ых","их","м","ым","им","х","ых","их","ми","ыми","ими","х","ых","их"],cr=["ям","ам","","","ями","ами","ях","ах"],fr=$(["вна","вца","вцы","пла","дца","дра","судна","рки","рцы","тлы","рна","тна","енца","десны","дёсны","рёбра","ребра","сосны"]),or=$(["жи","ши","чи","ля","ли","чи","ри","ти","ди","сани","борщи","клещи","товарищи","плащи","прыщи","хрящи"]),lr=$(["братья","брусья","деревья","донья","звенья","клинья","клочья","коленья","колосья","колья","комья","крылья","крючья","листья","лоскутья","лохмотья","перья","платья","поводья","прутья","стулья","сучья","хлопья","шилья"]),hr=$(["ишки","дружки","тки","папочки","дедушки","дядюшки","батюшки","катанки","петрушки","шестерки"]),Er=$(["жки","шки","чки","рки","натки","хатки","ятки","етки","чётки","мки","нки","педки","илки"]),dr=$(["шок","щок","жок","зок","аток","яток","еток"])
;function Sr(e,n,t,u){var a=p(u),s=L(a),c=N(s),f=r.indexOf(t)+1;if(1===f||4===f&&!n.isAnimate())return u
;if(134217984&c)if(2===f||4===f){if(V(a,["овичи","евичи"]))return R(u)+"ей"
;if(V(a,["вны","полусотни"])&&"овны"!==a)return _(u,2)+"ен"}else if(5===f){
if(V(a,["дети","люди"])&&!V(a,["нелюди"]))return R(u)+"ьми";if(V(a,["вери","дочери"]))return[R(u)+"ями",R(u)+"ьми"]}
var o=n.getGender(),l=a.endsWith("цы")?R(u):ce(u,a),h=K(a,Ne)&&(n.isASurname()||o===i.COMMON)&&!K(a,Qe),E=3*Math.min(Math.round(sr.length/3-1),f-2)
;if(h||a.endsWith("ничьи"))return u+sr[E];if(a.endsWith("ые"))return _(u,2)+sr[E+1]
;if(a.endsWith("ие")||K(a,ie))return l+sr[E+2];if(f>2&&4!==f){var d=2*Math.min(Math.round(cr.length/2-1),f-3)
;return K(a,qe)?R(u)+cr[d]:e.sd.hasStressedEndingPlural(n,t).includes(!0)?W(l)+cr[d+1]:l+cr[d+1]}
var S=n.getDeclension(),v=function(){var r=p(l),i=["жки","шки","чки","ножны"]
;if(V(r,["кн","кл","дк","нк","пк","зк","рк","тк","вк","лк","мк"])&&!V(a,["сумерки"])||"зл"===r||V(a,i)&&e.sd.hasStressedEndingPlural(n,t).includes(!0)){
var s=L(l);return R(l)+y("о",s)+s}if(K(a,fr)&&!a.endsWith("недра")||V(a,i)){var c=M(u,1);return _(u,2)+y("е",c)+c}
if(V(a,["сестры","сёстры","серьги"])){var f=M(u,1);return("ь"===M(a,2)?W(_(u,3)):W(_(u,2)))+y("ё",f)+f}
if(V(r,["льц","сьм","деньг","ьк","йк","дьб"])){var o=L(l);return _(l,2)+y("е",o)+o}return V(a,["сла","слы"])?R(l)+"ел":l
};if([3,0].includes(S)){if(a.endsWith("и"))return R(u)+"ей";if(["гроздья"].includes(a))return R(u)+"ев"}var I=M(a,2)
;if(i.FEMININE!==o){var A=J(a),O=ir.hasRaw(A);if(O&&rr.has(a))return R(u)+"ов"
;if(O&&nr.has(a)&&!n.isAName())return[v(),R(u)+"ов"];if(O&&tr.has(a))return[R(u)+"ов",v()]
;if(o===i.COMMON&&!V(a,$e)&&!"жшч".includes(I)||ar.hasRaw(A)&&ur.has(a)||n.isAName()&&o===i.MASCULINE&&n.lower().endsWith("а")||"барин"===n.lower())return v()
;switch(s){case"и":case"я":
if(K(a,or)||"щи"===a||$e.includes(a)||n.lower().endsWith("ь")&&!V(n.lower(),["зять","деверь"]))return("ь"===L(R(a))?_(u,2):R(u))+"ей"
;if("и"===s)return a.endsWith("ульи")?R(u)+"ев":a.endsWith("ьи")?i.MASCULINE===o?R(u)+"ёв":_(u,2)+"ей":["ча","кле","холу","ху"].includes(R(a))?R(u)+"ёв":a.endsWith("ищи")?v():a.endsWith("мессии")?R(u)+"й":T(g,M(a,1))?R(u)+"ев":!K(a,Er)||i.MASCULINE===o&&!K(W(a),hr)||K(n.lower(),dr)?R(u)+"ов":v()
;if(K(a,lr))return R(u)+"ев";if(V(a,["зятья","кумовья","деверья","края","острия"]))return R(u)+"ёв"
;if(V(a,["ья","ия"]))return i.MASCULINE===o?_(u,2)+"ей":_(u,2)+"ий";break;case"а":
return V(a,["семена","стремена"])?_(u,3)+"ян":a.endsWith("мена")?_(u,3)+"ён":n.lower().endsWith("яйцо")?y("яиц",R(u)):a.endsWith("нца")?[v(),R(u)+"ев"]:K(a,er)?R(u)+"ов":v()
;case"ы":return V(a,["ницы","лицы","пицы","бицы"])?R(u):a.endsWith("цы")?R(u)+"ев":R(u)+"ов";default:
if(a.endsWith("не"))return v()}}if(a.endsWith("йки"))return _(u,3)+"ек";if(a.endsWith("ки")){if("ь"===I){var b=L(R(u))
;return _(u,3)+y("е",b)+b}if("жшч".includes(I))return v();if(T(C,I))return _(u,2)+"ок"}
if($e.includes(a))return R(u)+"ей";if(V(a,["аи","ои","еи","эи","уи"]))return R(u)+"й"
;if("свечи"===a)return[R(u),R(u)+"ей"];if("пригоршни"===a)return[R(u)+"ей",_(u,2)+"ен"]
;if("тихони"===a)return[_(u,2)+"нь",R(u)+"ей"]
;if(V(a,["ьи","ии"]))return e.sd.hasStressedEndingSingular(n,t).includes(!0)?_(u,2)+"ей":_(u,2)+"ий"
;if(a.endsWith("ни")&&T(C,M(a,2)))return["барышни","боярышни","деревни"].includes(a)?_(u,2)+"ень":a.endsWith("кухни")?_(u,2)+"онь":"сотни"===a?[_(u,2),_(u,2)+"ен"]:_(u,2)+"ен"
;if(p(l).endsWith("ийк"))return _(l,2)+"ек";if(l.length===a.length-1&&K(a,qe)){
if("ьй".includes(p(M(l,1)))&&!n.isAnimate()){var m=L(l);return _(l,2)+y("е",m)+m}
return V(a,["земли","петли","пли","вли"])?R(l)+"ель":l+"ь"}return v()}var vr=function(){return d(function e(){var r,n,t
;h(this,e),r=this,n="sd",t=function(){function e(e,r,n,t){var i,u=S(t.split(","));try{for(u.s();!(i=u.n()).done;){
var a=i.value,s=Object.assign({},r);s.text=a,e.put(s,n)}}catch(e){u.e(e)}finally{u.f()}}var r=new q,n=Object.freeze({
gender:i.MASCULINE}),t=Object.freeze({gender:i.MASCULINE,animate:!0}),u=Object.freeze({gender:i.FEMININE
}),a=Object.freeze({gender:i.FEMININE,animate:!0}),s=Object.freeze({gender:i.COMMON,animate:!0}),c=function(t,i){
return e(r,n,t,i)};return e(r,n,"SSSSSSS-SSSSSS","брёх,дёрн,идиш,имидж,мед,упрёк"),e(r,{pluraleTantum:!0
},"SSSSSSS-SSSSSS","ножны"),e(r,n,"SSSSSSS-EEEEEE","адрес,век,вечер,город,детдом,поезд,спецсчёт,субсчёт"),
e(r,n,"SSSSSSE-EEEEEE","берег,бок,вес,лес,снег,дом,катер,счёт,мёд"),e(r,t,"SSSSSSS-SSSSSS","балансёр,шофёр"),
e(r,n,"SSSSSSS-bbbbbb","вексель,ветер"),c("SSSSSSE-ESEEEE","глаз"),c("SSSSSSE-bEEbEE","год"),c("SSSSSSb-bbbbbb","цех"),
e(r,{gender:i.NEUTER
},"EEEEEEE-SSSSSS","тесло,стекло,автостекло,бронестекло,оргстекло,пеностекло,смарт-стекло,спецстекло,бедро,берцо,блесна,чело,стегно,стебло"),
e(r,u,"EEEbEEE-SSESEE","щека"),e(r,u,"EEEEEEE-SSESEE","слеза"),e(r,n,"SbbSbbb-bbbbbb","грош,шприц"),
e(r,n,"SssSsss-ssssss","кишмиш,кряж,слеш,слэш"),e(r,t,"Sssssss-ssssss","паныч"),c("SEESeEE-EEEEEE","стеллаж"),
c("SeeSeee-eeeeee","шиномонтаж"),e(r,{gender:i.NEUTER},"EEEEEEE-SsESEE","плечо"),e(r,s,"EEEEEEE-SSSSSS","судья"),
e(r,s,"EEEEEEE-EEEEEE","левша"),e(r,u,"EEEEEEE-SESSSS","семья,макросемья"),e(r,u,"EEEEEEE-SEESEE","вожжа,свеча"),
e(r,u,"EEESEEE-SSSSSS","душа"),e(r,a,"EEEEEEE-SESESS","свинья,овца"),e(r,u,"EEEEEEE-eEeeee","скамья"),
e(r,u,"EEEEEEE-EEEEEE","башка,кишка,ладья,лапша,моча,пыльца,статья"),r}(),(n=I(n))in r?Object.defineProperty(r,n,{
value:t,enumerable:!0,configurable:!0,writable:!0}):r[n]=t},[{key:"decline",value:function(e,r,n){
return Ir(this,k.create(e),r,n)}},{key:"pluralize",value:function(e){var r=k.create(e)
;return r.isPluraleTantum()?[r.text()]:Ye(this,r)}},{key:"getLocativeForms",value:function(e){
var r=this,n=k.create(e),t=n.getDeclension();if(t&&t>=0){var i=be.get(ge(n))
;if(i instanceof Array)return i.map(function(e){return new u(function(e){switch(1+(e>>3&7)){case c.V:return"в"
;case c.VO:return"во";case c.NA:return"на"}}(e),function(e,r,n,t){switch(r){case 0:return Ae(e,n,Case.PREPOSITIONAL)
;case 1:return Pe(e,n,t);case 2:return Oe(e,n,Case.PREPOSITIONAL);case 3:return Ie(e,n,Case.PREPOSITIONAL)}
}(r,t,n,o(e)),e>>6)})}return[]}}])}();function Ir(e,r,n,t){var i=function(e,r,n,t){var i=r.text()
;if(r.isIndeclinable())return i;if(r.isPluraleTantum())return Sr(e,r,n,i);if(t)return Sr(e,r,n,t)
;switch(r.getDeclension()){case-1:return i;case 0:return Ae(e,r,n);case 1:return Le(e,r,n);case 2:return Oe(e,r,n)
;case 3:return Ie(e,r,n)}}(e,r,n,t);return i instanceof Array?i:[i]}return e.CASES=r,e.Case=n,e.Engine=vr,e.Gender=i,
e.Lemma=k,e.LocativeForm=u,e.LocativeFormAttribute=a,e.StressDictionary=q,e.createLemma=function(e){return k.create(e)},
e.createLemmaOrNull=function(e){return k.createOrNull(e)},e}({});
//# sourceMappingURL=RussianNouns.es5.js.map
