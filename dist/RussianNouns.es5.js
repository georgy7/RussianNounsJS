/*!
  RussianNounsJS v3.0.0-alpha.1
  Copyright (c) 2011-2026 Georgy Ustinov
  Released under the MIT license
*/
var RussianNouns=function(e){"use strict"
;var r=Object.freeze(["именительный","родительный","дательный","винительный","творительный","предложный","местный"]),n=Object.freeze({
NOMINATIVE:r[0],GENITIVE:r[1],DATIVE:r[2],ACCUSATIVE:r[3],INSTRUMENTAL:r[4],PREPOSITIONAL:r[5],LOCATIVE:r[6]})
;function t(e){return"number"==typeof e?e:r.indexOf(e)}
var i=Object.freeze(["женский","мужской","средний","общий"]),u=Object.freeze({FEMININE:i[0],MASCULINE:i[1],NEUTER:i[2],
COMMON:i[3]});function a(e,r,n){this.preposition=e,this.word=r,this.attributes=n}var s=Object.freeze({CONTAINER:1,
LOCATION:2,STRUCTURE:4,SURFACE:8,WAY:16,OBJECT_WITH_FUNCTIONAL_SURFACE:32,SUBSTANCE:64,RESOURCE:128,CONDITION:256,
EXPOSURE:512,MOTION:1024,EVENT:2048,WITH_ADJECTIVE:4096,WITHOUT_ADJECTIVE:8192,RELIGIOUS:16384}),c=Object.freeze({
PREPOSITIONAL:1,U_SUFFIX:2}),f=Object.freeze({V:1,VO:2,NA:3});function o(e,r,n){return n<<6|(e-1&7)<<3|r-1&7}
function h(e){return 1+(7&e)}function l(e,r){(null==r||r>e.length)&&(r=e.length)
;for(var n=0,t=Array(r);n<r;n++)t[n]=e[n];return t}function E(e,r){
if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function d(e,r){
for(var n=0;n<r.length;n++){var t=r[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),
Object.defineProperty(e,A(t.key),t)}}function S(e,r,n){return r&&d(e.prototype,r),n&&d(e,n),
Object.defineProperty(e,"prototype",{writable:!1}),e}function v(e,r){
var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=g(e))||r){n&&(e=n)
;var t=0,i=function(){};return{s:i,n:function(){return t>=e.length?{done:!0}:{done:!1,value:e[t++]}},e:function(e){
throw e},f:i}}
throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}var u,a=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return a=e.done,e},e:function(e){s=!0,u=e
},f:function(){try{a||null==n.return||n.return()}finally{if(s)throw u}}}}function p(e,r){return function(e){
if(Array.isArray(e))return e}(e)||function(e,r){
var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){
var t,i,u,a,s=[],c=!0,f=!1;try{if(u=(n=n.call(e)).next,0===r);else for(;!(c=(t=u.call(n)).done)&&(s.push(t.value),
s.length!==r);c=!0);}catch(e){f=!0,i=e}finally{try{if(!c&&null!=n.return&&(a=n.return(),Object(a)!==a))return}finally{
if(f)throw i}}return s}}(e,r)||g(e,r)||function(){
throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}()}function A(e){var r=function(e,r){if("object"!=typeof e||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){
var t=n.call(e,r);if("object"!=typeof t)return t;throw new TypeError("@@toPrimitive must return a primitive value.")}
return String(e)}(e,"string");return"symbol"==typeof r?r:r+""}function g(e,r){if(e){if("string"==typeof e)return l(e,r)
;var n={}.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),
"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?l(e,r):void 0}}
function I(e){var r=e.replaceAll("ё","е"),n=r.length%2,t=1,i=5381;function u(){i=(33*i+(255&n))%4294967296,n>>=8,t-=8}
var a,s=v(r);try{for(s.s();!(a=s.n()).done;){var c=a.value.charCodeAt(0)-1072&31;n|=c<<t,(t+=5)>=8&&u()}}catch(e){s.e(e)
}finally{s.f()}t>0&&u();var f=r.charCodeAt(0)%2;return 2*(2147483647&i)+f}function O(e){var r=e.charCodeAt(0)-1072
;return 33===r?32:r===(31&r)?1<<r:0}function b(e,r){return 0!==(e&O(r))}var N=3892855073,m=66567902,y=66567390
;function C(e){return b(N,e)}function w(e){return e.split("").filter(C).length}function T(e){
return e.replaceAll("ё","е").replaceAll("Ё","Е")}function W(e,r){return e.substring(0,e.length-r)}function _(e,r){
return e.substring(e.length-r)}function U(e){return W(e,1)}function R(e){return M(e,1)}function M(e,r){
return e[e.length-r]||""}function L(e,r){return 1===r.length&&e.includes(r)}function k(e,r){return r.some(function(r){
return e.endsWith(r)})}var x=function(){function e(r){E(this,e),r instanceof e?(this._txt=r._txt,this._lc=r._lc,
this._hash=r._hash,this._flags=r._flags):(r.pluraleTantum?this._flags=5:this._flags=1+i.indexOf(r.gender),
this._txt=r.text,this._lc=r.text.toLowerCase(),this._hash=I(this._lc),this._flags|=8*(1&r.indeclinable),
this._flags|=16*(1&r.animate),this._flags|=32*(1&r.surname),this._flags|=64*(1&r.name),this._flags|=128*(1&r.transport),
this._flags|=65536*(2+function(e,r,n,t){if(r)return-2;if(t)return-1;var i=R(e);switch(n){case u.FEMININE:
return"а"===i||"я"===i?2:b(m,i)?-1:3;case u.MASCULINE:return"а"===i||"я"===i?2:"путь"===e?0:1;case u.NEUTER:
return["дитя","полудитя"].includes(e)?0:"мя"===_(e,2)?3:1;case u.COMMON:return"а"===i||"я"===i?2:"и"===i?-1:1;default:
return-2}}(this._lc,r.pluraleTantum,r.gender,r.indeclinable)))}return S(e,[{key:"equals",value:function(r){
return r instanceof e&&this._flags===r._flags&&this.lower()===r.lower()}},{key:"text",value:function(){return this._txt}
},{key:"lower",value:function(){return this._lc}},{key:"isPluraleTantum",value:function(){return 5==(7&this._flags)}},{
key:"getGender",value:function(){var e=7&this._flags;if(e>=1&&e<=4)return i[e-1]}},{key:"isIndeclinable",
value:function(){return!!(8&this._flags)}},{key:"isAnimate",value:function(){
return!!(16&this._flags)||this.isASurname()||this.isAName()}},{key:"isASurname",value:function(){
return!!(32&this._flags)}},{key:"isAName",value:function(){return!!(64&this._flags)}},{key:"isATransport",
value:function(){return!!(128&this._flags)}},{key:"getDeclension",value:function(){return(this._flags>>16)-2}},{
key:"getSchoolDeclension",value:function(){var e=this.getDeclension();return 1===e?2:2===e?1:e}}],[{key:"create",
value:function(e){if(e instanceof this)return e;var r=P(e);if(r)throw new Error(r);return Object.freeze(new this(e))}},{
key:"createOrNull",value:function(e){return null===P(e)?Object.freeze(new this(e)):null}}])}();function F(e,r){
var n=new x(e);return n._txt=r,n._lc=r.toLowerCase(),n._hash=I(n.lower()),Object.freeze(n)}function P(e){
if(null==e)return"No parameters specified."
;for(var r=0,n=["pluraleTantum","indeclinable","animate","surname","name","transport"];r<n.length;r++){var t=n[r]
;if(function(e){return null!=e&&"boolean"!=typeof e}(e[t]))return t+" must be boolean."}
if(null==e.text)return"A cyrillic word required.";if(!e.pluraleTantum){
if(null==e.gender)return"A grammatical gender required.";if(!i.includes(e.gender))return"Bad grammatical gender."}
return null}function j(e){var r,n=new Set,t=0,i=v(e);try{for(i.s();!(r=i.n()).done;){t+=r.value,n.add(t)}}catch(e){
i.e(e)}finally{i.f()}return n}
var V=j([11720389,548,1024,1479,2622,2867,1222,2642,264,1328,137,123,397,65542229,212447047,31729170,8094836,1056,21701789,35520559,40358,21819,28248,119786,63892,31809,7356,74383,72369,5945,28902,90120738,21187517,91925642,3054826,1600765,65934,30948851,5569212,4205640,5412804,6787095,9749916,3940084,1511466,1303038,16090470,1376628,49919694,3827522,37915959,14032615,28701924,224587434,637275762,51079457,391103676,24108070,158999424,232633267,6058815,66599250,692781441,816204112,55209380,72754,90006,80058,45564,67845,42548,27193,21401,139393,750335,170896,4424,1566,6264,154969,17292,17229,175112,83011,117872,4183,13065,108972,108088,343663,66210,334,17090,380271,283272,59007,35796,230801,1067156,19992,157124,12433,252644,2626,23776,630482,531296,304718,90891,726,23116,47653,30493,167310,50156,123071,477118,241821,55660,908992,534269,205157,11218,2490,660,66391,46856,847526,68710,8450,36630,15642,109864,41716,354482,79820,51876,97325,5506,46436,191803,3957,40876,126323,2347821,338490,73216,475569,87602,29642,4220,10760,16896,50156,17424,35178,167244,126786,33643,30488,65045,35961,51453,55660,4,152461,138332,1958,34200,3709,61381,17424,30158,80591,11218,44099,260487]),D=j([11720389,548,1024,1060,4,5904,1848,4404,330555234,4691346,3365076,1045362,7414584,960432,10564312,253286,16178203,4357,4355,11350,31120,5248,40591,62367,54057,50487,13069,3664,39764,10263,3002,5810,8844,24551,4091,56761,21785,30553,55147139,15960625,1933097,12258067,16302047,54210486,45688435,1659767,4813249,33577763,2501798,10056946,672528,14209351,2012340,1655412,4652736,62568,148698,21186,71129124,260014161,108045611,1007583269,2026464,22799532,750068913,1499532,1285428194,74598,22348,6599,132273,309821,156816,397448,179394,148036,100257,21779,11218,36631,345954,50442,104394,2724,112115,30690,10552,31377,11286,7168,14612,51480,116537,192258,163145,65604,97951,1363157,212810,431243,2622,425588,275284,150351,570568,244701,16659,26136,130134,11040,159389,728373,3476,726,1290392,224730,189158,11218,2490,10750,21608,143747,65974,664563,84036,16283,17424,5758,45080,33066,1782,90658,37101,56107,233163,14216,5518,179264,2525,146957,111342,80594,2309,4217,25432,26905,29980,518951,1458289,523705,4202,477865,149368,126310,47828,212678,22744,269176,179119,4399,35997,69696,41777,41,127336,4202,73153,46372,114255,126869,23630,11218]),z=function(){
return S(function e(){E(this,e),this._filter=new Uint8ClampedArray(256)},[{key:"addInteger",value:function(e){
this.addRaw(H(e))}},{key:"hasInteger",value:function(e){return this.hasRaw(H(e))}},{key:"addRaw",value:function(e){
var r=2047&e,n=r>>>3;this._filter[n]=this._filter[n]|1<<7-r%8}},{key:"hasRaw",value:function(e){var r=2047&e
;return!!(this._filter[r>>>3]>>>7-r%8&1)}},{key:"clone",value:function(){return B(this._filter)}}])}();function B(e){
var r=new z;return r._filter=Uint8ClampedArray.from(e),r}function H(e){return e>>>22&2047^e>>>11&2047^2047&e}
function J(e){var r=e.padStart(3,"а");return(7&r.charCodeAt(0))<<8|(15&r.charCodeAt(1))<<4|15&r.charCodeAt(2)}
var G,X=(G=new z,V.forEach(function(e){return G.addInteger(e)}),D.forEach(function(e){return G.addInteger(e)}),
Object.freeze(G));function Y(){var e=new Map,r=X.clone(),n=function(e){return 4294967296*(31&e._flags)+e._hash
},i=function(e){return e.lower().indexOf("ё")+1&255},a=function(r){var t=65504&r._flags,u=function(r){
var t=n(r),i=e.get(t);return i instanceof Array?i:[]}(r).filter(function(e){return(e[0]&t)<=t}),a=u.filter(function(e){
return e[0]>>16===i(r)});return a.length?a[0][1]:u.length?u[0][1]:void 0};this.put=function(t,u){
var a=u.split("-"),s=function(e,r){return e.length!==r||e.split("").some(function(e){return!"SsbeE".includes(e)})}
;if(2!==a.length||s(a[0],7)||s(a[1],6))throw new Error("Bad settings format.");var c=x.create(t),f=n(c),o=e.get(f)
;o instanceof Array||(o=[],e.set(f,o));var h=65535&c._flags|i(c)<<16,l=o.find(function(e){return h===e[0]})
;l?l[1]=u:o.push([h,u]),r.addInteger(c._hash)};var s=function(e){switch(e){case"E":return[!0];case"e":return[!0,!1]
;case"b":case"s":return[!1,!0];default:return[!1]}};this.hasStressedEndingSingular=function(e,n){
if(r.hasInteger(e._hash)){var i=t(n);if(i>=0){var c=a(e);if(c){var f=c.split("-")[0];return s(f[i])}
if(e.getGender()===u.MASCULINE){if(V.has(e._hash))return s("SEESEEE"[i]);if(D.has(e._hash))return s("SEEEEEE"[i])}}}
return[]},this.hasStressedEndingPlural=function(e,n){if(r.hasInteger(e._hash)){var i=t(n);if(i>=0&&i<6){var c=a(e)
;if(c){var f=c.split("-")[1];return s(f[i])}
if(e.getGender()===u.MASCULINE&&(V.has(e._hash)||e.isAnimate()&&D.has(e._hash)))return s("E")}}return[]}}function q(e){
var r,n=new Map,t=v(e);try{for(t.s();!(r=t.n()).done;)for(var i=r.value,u=n,a=i.length-1;a>=0;a--){var s=i.charCodeAt(a)
;if(a>0){var c=u.get(s);if(0===c)break;void 0===c&&u.set(s,new Map),u=u.get(s)}else u.set(s,0)}}catch(e){t.e(e)}finally{
t.f()}return n}function $(e,r){for(var n=r,t=e.length-1;t>=0;t--){var i=e.charCodeAt(t);if(!n.has(i))return!1
;var u=n.get(i);if(0===u)return!0;n=u}}function K(e){for(var r=new Array(e.length),n=0;n<e.length;n++){
var t=e.charCodeAt(n);t>=1040&&t<=1071?t+=32:t>=1024&&t<=1039&&(t+=80),r[n]=t}return String.fromCharCode.apply(null,r)}
function Q(e,r){return r===r.toUpperCase()?e.toUpperCase():e}
var Z=q(["ое","нький","ский","ской","лстой","отой","утой","евой","овой","живой"]),ee=q(["ее","ое","нький","ский","ской","лстой","отой","утой"]),re=q(["евой","овой","отой","живой"]),ne=q(["шний","жний","щий","ший","жий","чий"]),te=["божий","ажий","яжий","ужий","южий","бульдожий","кабарожий","медвежий","носорожий","миножий"],ie=q(te),ue=q(te.map(function(e){
return W(e,2)+"ьи"
})),ae=new Set(["бубен","бугор","ветер","вошь","вымысел","горшок","деготь","дёготь","дятел","домысел","замысел","кашель","коготь","лапоть","лоб","локоть","ломоть","молебен","мох","ноготь","овен","пепел","пес","пёс","петушок","помысел","порошок","промысел","псалом","пушок","ров","рожь","рот","сон","стебель","стишок","угол","умысел","хребет","церковь","шов","ковер","овес","костер"].map(I)),se=new z
;ae.forEach(function(e){return se.addInteger(e)})
;var ce=q(["овёс","ковёр","костёр","шатер","шатёр","козел","козёл","котел","котёл","орел","орёл","осел","осёл","узел","уголь","чок","ешок","хол"])
;function fe(e,r){var n=R(r);if(b(-402111711,n)){if(b(N,M(r,2))){var t=W(e,2);return $(r,ie)?t+Q("ь",t):t}
if("й"!==n)return U(e)}return e}var oe=["ясень","бюллетень","олень","тюлень","гордень","пельмень","ячмень"]
;function he(e,r,n){var t,i=e.text(),a=R(r),s=O(a);return-133667019&s&&(-402111711&s?t=function(e,r,n){var t=M(r,2)
;return"ь"===t||"о"===n&&b(2504708,t)?U(e):fe(e,r)}(i,r,a):"к"===a?t=function(e,r,n){
return e.length>=4&&k(r,["рёк","нёк","лёк"])&&!1!==n?W(e,2)+"ьк":r.endsWith("ёк")&&b(N,M(r,3))?W(e,2)+"йк":void 0
}(i,r,n):"ь"===a?t=function(e,r,n){
return ae.has(e._hash)||$(n,ce)?W(r,3)+M(r,2):n.endsWith("ень")&&e.getGender()===u.MASCULINE&&!k(n,oe)?W(r,3)+"н":U(r)
}(e,i,r):(["лёд","лед","лён"].includes(r)||"лев"===r&&e.isAnimate())&&(t=W(i,2)+Q("ь",M(i,2))+R(i))),
t||(t=function(e,r,n){
return!!(199680&n)&&$(r,ce)&&!["новосел","новосёл"].includes(r)||!!(2571270&n)&&(se.hasInteger(e._hash)&&ae.has(e._hash)||e.isAnimate()&&r.endsWith("посол"))
}(e,r,s)?W(i,2)+R(i):i),t}function le(e,r){var n=U(e),t=U(r.lower());if("а"===R(t))return n
;if(k(t,["зне","жне","гре","спе","мудре"])||_(U(t),3).split("").every(function(e){return b(y,e)})||r.isAName())return n
;if("ле"===_(t,2)){var i=M(t,3);return b(N,i)||"л"===i?U(n)+"ь":n}
return b(N,R(t))&&"и"!==R(t)?b(N,R(U(t)))?W(e,2)+"й":k(r.lower(),["месяц"])?n:W(e,2):n}
var Ee=q(["лапоток","желток","нишок","ришок","ишек"]),de=["поток","приток","переток","проток","биоток","электроток","восток","водосток","водоток","воток","знаток"],Se=["инок","исток","обморок","порок","пророк","сток","урок"]
;function ve(e){
return k(e,["чек","шек"])&&e.length>=6||$(e,Ee)||e.endsWith("ок")&&!e.endsWith("шок")&&!Se.includes(e)&&!k(e,de)&&!b(N,M(e,3))&&(b(N,M(e,4))||k(W(e,2),["ст","рт"]))&&e.length>=4
}function pe(e,r,n){return(e.length?e:[!1]).map(function(e){return n(e?T(r):r,e)})}var Ae=0,ge=3,Ie={"дочь":"дочерь",
"мать":"матерь"};function Oe(e,r,n){var t=r.text(),i=r.lower()
;if(![Ae,ge].includes(n)&&Object.keys(Ie).includes(i))return Oe(e,F(r,Ie[i]),n);var u=he(r,i);if(function(e){
return e.endsWith("полночь")||e.startsWith("пол")&&b(134217984,R(e))&&w(e)>=2}(i)&&(u="полу"+u.substring(3)),
"мя"===_(i,2))switch(n){case Ae:case ge:return t;case 1:case 2:case 5:case 6:return u+"ени";case 4:return u+"енем"
}else switch(n){case Ae:case ge:return t;case 1:case 2:case 5:case 6:return u+"и";case 4:
return k(i,["вошь","рожь","церковь"])?t+"ю":u+"ью"}}function be(e,r,n){var t=r.text(),i=r.lower()
;if(i.endsWith("путь"))return 4===n?U(t)+"ём":Oe(e,r,n);if(!i.endsWith("дитя"))throw new Error("unsupported");switch(n){
case 0:case 3:return t;case 1:case 2:case 5:case 6:return t+"ти";case 4:return[t+"тей",t+"тею"]}}function Ne(e,r,n){
var t=r.text(),i=r.lower(),u=he(r,i),a=K(u),s=U(t),c=U(i),f=function(){return"я"===R(i)},o=function(){
return i.endsWith("ая")&&!(2===w(i)||b(N,R(a)))},h=function(){return i.endsWith("яя")&&!(2===w(i)||b(N,R(a)))
},l=["жая","шая"];switch(n){case 0:return t;case 1:
return h()||k(i,l)?u+"ей":o()?u+"ой":r.isASurname()&&!i.endsWith("да")?s+"ой":i.endsWith("ничья")?s+"ей":f()||b(60818504,R(a))?s+"и":s+"ы"
;case 2:case 5:case 6:
return h()||k(i,l)?u+"ей":o()?u+"ой":r.isASurname()&&!i.endsWith("да")?s+"ой":"ия"===_(i,2)?s+"и":i.endsWith("ничья")?s+"ей":s+"е"
;case 3:return o()?u+"ую":h()?u+"юю":f()?s+"ю":s+"у";case 4:
return h()||k(i,l)?u+"ею":o()?[u+"ой",u+"ою"]:f()||L("жшчщц",R(a))&&!e.sd.hasStressedEndingSingular(r,n).includes(!0)?"и"===R(c)?s+"ей":[s+"ей",s+"ею"]:[s+"ой",s+"ою"]
}}var me=q(["ов","ев","ёв","ин","ын"]),ye=function(e,r){for(var n=r,t=0;t<e.length;t++){var i=e.charCodeAt(t),u=n
;(n=new Map).set(i,u)}return n}("ы",me);function Ce(e){return e.filter(function(r,n){return e.indexOf(r)===n})}
function we(e){var r=1&e.lower().includes("ё");return 4294967296*((65535&e._flags)<<1|r)+e._hash}
var Te=Object.freeze(function(){var e=new Map,r={gender:u.MASCULINE},n={gender:u.MASCULINE,animate:!0}
;function t(r,n,t,i,u){var a,s=i.split(","),f=u instanceof Array?u:[c.U_SUFFIX],h=v(s);try{for(h.s();!(a=h.n()).done;){
var l=a.value;r.text=l;var E=we(x.create(r)),d=e.get(E);d||(d=[],e.set(E,d));var S,p=v(t);try{
for(p.s();!(S=p.n()).done;){var A,g=S.value,I=v(f);try{for(I.s();!(A=I.n()).done;){var O=A.value;d.push(o(g,O,n))}
}catch(e){I.e(e)}finally{I.f()}}}catch(e){p.e(e)}finally{p.f()}}}catch(e){h.e(e)}finally{h.f()}}
var i=[f.V],a=[f.VO],h=[f.NA];t(r,s.CONTAINER,i,"мозг,пруд,стог,таз,год"),t(r,s.CONTAINER,a,"рот"),t(r,s.WAY,i,"год"),
t(r,s.CONTAINER,i,"гроб"),t(r,s.CONTAINER|s.RELIGIOUS,a,"гроб",[c.PREPOSITIONAL]),
t(r,s.LOCATION,i,"ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,низ,хлев"),
t(r,s.STRUCTURE,i,"круг,полк,артполк,ряд,род,строй,лад"),t(r,s.SURFACE,h,"баз,берег,бережок,вал,кон,круг,луг,пол,яр"),
t(r,s.WAY,h,"век,день"),t(r,s.WAY,i,"час"),t(r,s.WAY,h,"корень"),t(n,s.OBJECT_WITH_FUNCTIONAL_SURFACE,h,"вор"),
t(r,s.OBJECT_WITH_FUNCTIONAL_SURFACE,h,"повод,бочок,борт,воз,горб,кол,мост,плот,сук,х"+String.fromCharCode(1091)+"й"),
t(r,s.OBJECT_WITH_FUNCTIONAL_SURFACE,h,"крюк,болт",[c.PREPOSITIONAL,c.U_SUFFIX]);var l=",мёд,мех,пар,пух"
;t(r,s.SUBSTANCE,i,"дым,жир,мел,пушок"+l),
t(r,s.RESOURCE,h,"газ,клей,спирт"+l),t(r,s.CONDITION,i,"бой,бред,быт,долг,плен,пыл,сок,ход,лад"),
t(r,s.EXPOSURE,i.concat(h),"вид"),t(r,s.EXPOSURE,h,"слух,счёт,ветер,ветр,свет"),t(r,s.MOTION,h,"ход,бег,вес"),
t(r,s.MOTION|s.WITH_ADJECTIVE,h,"шаг"),t(r,s.EVENT,h,"бал,пир"),t(r,s.CONDITION,h,"дух,плав"),
t(r,s.MOTION|s.WITH_ADJECTIVE,h,"газ"),t(r,s.CONTAINER,i,"глаз,зоб,нос,шкаф"),t(r,s.CONTAINER,a,"лоб"),
t(r,s.OBJECT_WITH_FUNCTIONAL_SURFACE,h,"глаз,лоб,нос,шкаф,холм");var E="бок,верх,зад,угол";return t(r,s.LOCATION,i,E),
t(r,s.OBJECT_WITH_FUNCTIONAL_SURFACE,h,E),t(r,s.LOCATION|s.WITHOUT_ADJECTIVE,i,"край"),
t(r,s.OBJECT_WITH_FUNCTIONAL_SURFACE|s.WITHOUT_ADJECTIVE,h,"край"),t(r,s.SURFACE,h,"лёд,мох,снег"),
t(r,s.SUBSTANCE,a,"лёд,лён,мох"),t(r,s.SUBSTANCE,i,"снег"),e
}()),We=new Set("клей,чай,дом,дух,дым,дымок,газ,год,горошек,жар,жир,квас,пар,пыл,род,рост,сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,табак,творог,толк,торф,туман,убыток,укроп,уксус,ход,цемент,чеснок,шаг,шик,шиповник,шоколад,шорох,шум,яд".split(",")),_e=new z
;We.forEach(function(e){return _e.addInteger(I(e))})
;var Ue=q(["й","ие","иё"]),Re=q(["воробей","муравей","ручей","соловей","улей"]),Me=q(["мой","ной","дой","шой","жой","рзой","осой","хой","латой","витой","литой","питой","житой","отой","утой","ятой","лагой","рагой","огой","угой","лубой","любой","илой","ылой","злой","малой","овой","евой","живой","ской","акой","укой","нний","ский","йкий","цкий","зкий","ткий","лкий","мкий","хкий","оркий","аркий","яркий","ький","ёкий","бокий","оокий","cокий","токий","ликий","дикий","укий","ыкий","який","пкий","дкий","бкий","нкий","жкий","чкий","гкий","овкий","авкий"])
;function Le(e,r){return"ый"===_(r,2)||(r.endsWith("кривой")||$(r,Me))&&w(r)>=2}
var ke=q(["ий","ие","чье","тье","дье","вье","бье","жалованье","енье","ружье","божье","верье","мужье"]),xe=q(["вое","лое","мое","ное","рое","тое","той","ый"])
;function Fe(e,r,n){
var t=r.text(),i=K(t),a=R(i),s=r.getGender(),c=e.sd.hasStressedEndingSingular(r,n),f=he(r,i,c[0]),o=U(t),l=je(i)
;l&&(f="полу"+f.substring(3),o="полу"+o.substring(3));var E=K(f),d=function(){return l&&i.endsWith("я")||De(i)
},S=$(i,Ue),v=function(){return $(i,Re)?U(o)+Q("ь",R(o)):o},p=function(){return L("чщ",R(E))};function A(e){
return!r.isAnimate()&&_e.hasInteger(r._hash)&&We.has(i)&&("й"===a?e.push(U(t)+Q("ю",R(t))):e=e.concat(pe(c,f,function(e){
return e+Q("у",R(e))}))),e}switch(n){case 0:return t;case 1:switch(a){case"и":case"ы":if(l)return Pe(e,r,n,i);break
;case"й":case"е":if(S&&r.isASurname()||Le(0,i)||$(i,Z))return f+"ого";if($(i,ne)||i.endsWith("ее"))return f+"его"
;case"ё":case"я":case"ь":if(S)return A([v()+"я"]);if(d()&&!p())return f+"я";break;case"ц":return le(t,r)+"ца";case"к":
if(ve(i))return U(o)+"ка";break;case"о":if(k(i,["шко"])&&u.MASCULINE===s)return o+"и"}
return A(r.isASurname()||-1===E.indexOf("ё")?[f+"а"]:pe(c,f,function(e){return e+"а"}));case 2:switch(a){case"и":
case"ы":if(l)return Pe(e,r,n,i);break;case"й":case"е":if(S&&r.isASurname()||Le(0,i)||$(i,Z))return f+"ому"
;if($(i,ne)||i.endsWith("ее"))return f+"ему";case"ё":case"я":case"ь":if(S)return v()+"ю";if(d()&&!p())return f+"ю";break
;case"ц":return le(t,r)+"цу";case"к":if(ve(i))return U(o)+"ку"}
return r.isASurname()||-1===E.indexOf("ё")?f+"у":pe(c,f,function(e){return e+"у"});case 3:
return s===u.NEUTER||L("иы",a)&&l?t:r.isAnimate()?Fe(e,r,1):t;case 4:switch(a){case"и":case"ы":if(l)return Pe(e,r,n,i)
;break;case"й":case"е":case"ё":case"я":case"ь":if(S&&r.isASurname()||$(i,ee))return $(i,xe)?f+"ым":f+"им"
;if(Le(0,i))return"и"===M(i,2)||i.endsWith("хой")?f+"им":f+"ым";if($(i,re))return f+"ым";if($(i,ne))return f+"им"
;if(S)return v()+"ем";if(i.endsWith("це"))return t+"м";break;case"ц":return pe(c,t,function(e,n){
return n?le(e,r)+"цом":le(e,r)+"цем"});case"к":if(ve(i))return U(o)+"ком";break;case"н":case"в":
if(r.isASurname()&&$(i,me))return t+"ым"}return d()||L("жшчщ",R(E))?pe(c,f,function(e,r){return r?e+"ом":e+"ем"
}):r.isASurname()||-1===E.indexOf("ё")?f+"ом":pe(c,f,function(e){return e+"ом"});case 6:if("полпути"===i)return t
;var g=Te.get(we(r));if(g)return Ce(g.map(function(e){return h(e)})).map(function(n){return Ve(e,r,n)});case 5:
switch(a){case"и":if("полпути"===i)return t;case"ы":if(l)return Pe(e,r,n,i);break;case"й":case"е":case"ё":case"я":
case"ь":if(S&&r.isASurname()||Le(0,i)||$(i,Z))return f+"ом";if($(i,ne)||i.endsWith("ее"))return f+"ем"
;if(k(i,["воробей"])){var I=U(o);return I+Q("ье",R(I))}
if($(i,ke)&&!k(i,["запястье","здоровье","изголовье","платье"]))return o+"и";if("й"===a||"иё"===_(i,2))return v()+"е"
;break;case"ц":return le(t,r)+"це";case"к":if(ve(i))return U(o)+"ке"}
return r.isASurname()||-1===E.indexOf("ё")?f+"е":pe(c,f,function(e){return e+"е"})}}function Pe(e,r,n,t){
var i=function(){return"полминуты"!==t?"полу"+r.text().substring(3):r.text()}
;return"полпути"===t?be(e,F(r,U(i())+"ь"),n):t.endsWith("зни")||t.endsWith("сти")?Oe(e,F(r,U(i())+"ь"),n):Ne(e,F(r,U(i())+("ни"===_(t,2)?"я":"а")),n)
}function je(e){if(e.startsWith("пол")&&b(2550137089,R(e))&&"л"!==e[3]&&w(e)>=2){
var r=e.substring(3),n=r.search(/[а-яё]/);return n>=0&&b(m,r[n])}return!1}function Ve(e,r,n){if(c.U_SUFFIX===n){
var t=r.text(),i=r.lower(),u=he(r,i),a=U(t),s=je(i)&&i.endsWith("я")||De(i)
;return"й"===R(i)?T(a)+"ю":s?T(u)+"ю":ve(i)?T(U(a))+"ку":T(u)+"у"}if(c.PREPOSITIONAL===n)return Fe(e,r,5)}
function De(e){return"ь"===R(e)&&!e.endsWith("господь")||L("её",R(e))&&!k(e,["це","же"])}
var ze,Be=new z,He=Object.freeze([[[u.MASCULINE,void 0],{"болгарин":["болгары"],"господин":["господа"],
"дядя":["дяди","дядья"],"зуб":["зубы","зубья"],"клок":["клочья","клоки"],"князь":["князи","князья"],
"кол":["колы","колья"],"месяц":["месяцы"],"полдень":["полдни","полудни"],"татарин":["татары"],"хозяин":["хозяева"],
"цветок":["цветки","цветы"],"черт":["черти"],"чёрт":["черти"]}],[[u.MASCULINE,!0],{
"кондуктор":["кондуктора","кондукторы"],"кум":["кумовья"],"муж":["мужья","мужи"]}],[[u.FEMININE,void 0],{
"гроздь":["грозди","гроздья"],"курица":["курицы","куры"],"стая":["стаи"],"щека":["щёки"],"береста":["берёсты"],
"верста":["вёрсты"],"десна":["дёсны"],"жена":["жёны"],"звезда":["звёзды"],"кинозвезда":["кинозвёзды"],
"медсестра":["медсёстры"],"метла":["мётлы"],"пчела":["пчёлы"],"сестра":["сёстры"],"слеза":["слёзы"]
}],[[u.NEUTER,void 0],{"брюхо":["брюхи"],"колено":["колена","колени","коленья"],"древо":["древа","древеса"],
"ухо":["уши"],"око":["очи"],"дно":["донья"],"чудо":["чудеса","чуда"],"небо":["небеса"],"бревно":["брёвна"],
"ведро":["вёдра"],"веретено":["веретёна"],"весло":["вёсла"],"гнездо":["гнёзда"],"зерно":["зёрна"],"знамя":["знамёна"],
"колесо":["колёса"],"облачко":["облачка"],"озеро":["озёра"],"полсотни":["полусотни"],"ребро":["рёбра"],
"ремесло":["ремёсла"],"седло":["сёдла"],"село":["сёла"]}]]),Je=v(He);try{for(Je.s();!(ze=Je.n()).done;){var Ge=ze.value
;Object.keys(Ge[1]).map(function(e){return Be.addInteger(I(e))})}}catch(e){Je.e(e)}finally{Je.f()}
var Xe=["зять","деверь","друг","брат","собрат","стул","брус","обод","полоз","струп","подмастерье","якорь","перо","шило"],Ye=new Set(["берег","бок","борт","век","вес","веер","вексель","вечер","глаз","голос","город","доктор","дом","детдом","егерь","жемчуг","катер","колокол","концлагерь","корм","короб","кузов","купол","лес","луг","мастер","номер","пояс","провод","рог","сахар","снег","сорт","стог","счет","счёт","спецсчет","спецсчёт","субсчет","субсчёт","терем","том","холод","цвет","череп"]),qe=q(["округ","остров","отпуск","паспорт","парус","поезд","повар","погреб","рукав","цех","юнкер"]),$e=new Set(["адрес","договор","буфер","ворох","директор","инспектор","инструктор","корпус","крейсер","орден","ордер","прожектор","пропуск","род","свитер","сервер","тенор","тон","трактор","тормоз","ветер","верх","китель","мех","хлеб","юнкер","ястреб"]),Ke=new Set(["бункер","вымпел","год","образ","омут","токарь","тополь","шторм","штуцер"])
;function Qe(e,r){var n=[],t=r.text(),i=K(t),a=e.sd.hasStressedEndingPlural(r,0);Object.freeze(a)
;var s=he(r,i,a[0]),c=K(s);if(i.endsWith("яя"))return n.push(W(t,2)+"ие"),Ce(n);var f=function(n){
var t=e.sd.hasStressedEndingPlural(r,0).map(function(e){return!e});return t.length?t.map(function(e){
return e?1===c.replace(/[^её]/g,"").length?n(function(e){
var r=Math.max(e.toLowerCase().lastIndexOf("е"),e.toLowerCase().lastIndexOf("ё")),n=Q("ё",e[r])
;return e.substring(0,r)+n+e.substring(r+1)}(s)):n(s):n(T(s))}):[n(s)]
},o=r.getGender(),h=r.getDeclension(),l=("й"===R(i)||b(N,R(i)))&&b(N,R(U(i)))?U(t):s,E=function(){
return(i.endsWith("евич")||i.endsWith("евна"))&&i.indexOf("ье")>=0};function d(){
var e=l,r=K(e).indexOf("ье"),n=Q("и",e[r]);return e.substring(0,r)+n+e.substring(r+1)}function S(){
b(60818504,R(c))||L("яйь",R(i))||k(i,["сосед"])?E()?(n.push(d()+"и"),
n.push(l+"и")):Array.prototype.push.apply(n,pe(a,l,function(e){return e+"и"
})):"ц"===R(i)?n.push(le(t,r)+"цы"):E()?(n.push(d()+"ы"),n.push(l+"ы")):Array.prototype.push.apply(n,pe(a,l,function(e){
return e+"ы"}))}var A=function(e,r){if(Be.hasInteger(e._hash)){var n,t=e.getGender(),i=e.isAnimate(),u=v(He);try{
for(u.s();!(n=u.n()).done;){var a=p(n.value,2),s=a[0],c=a[1],f=s[0],o=s[1]
;if(t===f&&(null==o||o===i)&&c.hasOwnProperty(r))return c[r].slice()}}catch(e){u.e(e)}finally{u.f()}}}(r,i)
;if(A)return A;var g="ь"===R(c)?s:"к"===R(c)?U(s)+"чь":"г"===R(c)?U(s)+"зь":"й"===R(i)?U(t):k(i,["рь","ль"])?s:s+"ь"
;switch(h){case-1:n.push(t);break;case 0:if("путь"===i)n.push("пути");else{
if(!i.endsWith("дитя"))throw new Error("unsupported");n.push(W(t,3)+"ети")}break;case 1:
if(Xe.includes(i))n.push(g+"я");else if(u.MASCULINE===o){"сын"===i?(n.push("сыновья"),
S()):"человек"===i?(n.push("люди"),
S()):["крюк","лист","лоскут","повод","прут","сук","учитель","флигель","штабель"].includes(i)||"соболь"===i&&r.isAnimate()?(S(),
n.push(g+"я")):["клин","колос","ком","край","соболь"].includes(i)?n.push(g+"я"):Ye.has(i)||$(i,qe)||$e.has(i)||Ke.has(i)?(Ke.has(i)&&S(),
De(i)?Array.prototype.push.apply(n,f(function(e){return e+"я"})):a.includes(!0)?n.push(T(s)+"а"):n.push(s+"а"),
$e.has(i)&&S()):(i.endsWith("анин")&&i.length>5||i.endsWith("янин"))&&!r.isAName()||["барин","боярин"].includes(i)?(n.push(W(t,2)+"е"),
"барин"===i&&n.push(W(t,2)+"ы")):["цыган"].includes(i)?n.push(t+"е"):"щенок"===i?(n.push(W(t,2)+"ки"),
n.push(W(t,2)+"ята")):!i.endsWith("ребёнок")&&!i.endsWith("ребенок")||i.endsWith("жеребёнок")||i.endsWith("жеребенок")||i.endsWith("ястребёнок")||i.endsWith("ястребенок")?(i.endsWith("ёнок")||i.endsWith("енок"))&&r.isAnimate()?n.push(W(t,4)+"ята"):i.endsWith("ёночек")&&r.isAnimate()?n.push(W(t,6)+"ятки"):i.endsWith("онок")&&L("жшч",M(i,5))&&r.isAnimate()?n.push(W(t,4)+"ата"):ve(i)?n.push(W(t,2)+"ки"):$(i,ne)?k(i,te)?n.push(W(t,2)+"ьи"):n.push(U(t)+"е"):Le(0,i)?i.endsWith("ый")||i.endsWith("ий")?n.push(U(t)+"е"):i.endsWith("ой")&&!k(i,["хой","ской"])?n.push(W(t,2)+"ые"):n.push(W(t,2)+"ие"):i.endsWith("его")?n.push(W(t,3)+"ие"):["воробей","муравей","ручей","соловей","улей","жеребей","ирей","репей","чирей"].includes(i)?n.push(W(t,2)+"ьи"):S():n.push(W(t,7)+"дети")
}else if(u.NEUTER===o)if(k(i,["ко","чо"])&&!k(i,["войско","облако"]))n.push(U(t)+"и");else if(i.endsWith("имое"))n.push(s+"ые");else if(i.endsWith("ее"))n.push(s+"ие");else if(i.endsWith("ое"))k(c,["г","к","ж","ш","х"])?n.push(s+"ие"):n.push(s+"ые");else if(k(i,["ие","иё"]))n.push(W(t,2)+"ия");else if(k(i,["ье","ьё"])){
var I=W(t,2),O=["безделье","варенье","воскресенье","жалованье","запястье","застолье","затишье","здоровье","зелье","изголовье","новоселье","одночасье","печенье","платье","побережье","поголовье","подворье","подземелье","подполье","поместье","предплечье","раздумье","сиденье","средневековье","увечье","угодье","устье"].includes(i)
;"е"!==R(i)||O||n.push(I+"ия"),n.push(I+"ья")
}else k(i,["дерево","звено","крыло"])?n.push(s+"ья"):k(i,["ле","ре"])?n.push(s+"я"):i.endsWith("судно")&&r.isATransport()?n.push(W(t,2)+"а"):(Array.prototype.push.apply(n,f(function(e){
return e+"а"})),k(i,["щупальце"])&&S());else n.push(s+"и");break;case 2:
"заря"===i?n.push("зори"):i.endsWith("ая")&&!i.endsWith("свая")?L("жхчшщ",R(c))||k(c,["вк","гк","ск","цк","ньк"])?n.push(s+"ие"):n.push(s+"ые"):S()
;break;case 3:
"мя"===_(i,2)?n.push(s+"ена"):Object.keys(Ie).includes(i)?n.push(U(Ie[i])+"и"):u.FEMININE===o?n.push(l+"и"):"и"===R(l)?n.push(l+"я"):n.push(l+"а")
}return Ce(n)}
var Ze=q(["ли","си","би","ви","ди","ти","пи","ри","ни","фи","зи","ьи","ья","ия","ря","ля","ая","аи","ои","уи","эи","ыи","яи","ёи","юи","еи","ии"]),er=["беготни","болтовни","будни","вожжи","возни","доли","лапши","левши","люди","марли","моря","мощи","ноздри","пени","пятерни","распри","родни","сакли","сени","ступни","судьи","фигни","чукчи"],rr=["головы","громадины","детины","деревенщины","дохлятины","дубины","ехидины","жадины","зверины","идиотины","кислятины","молодчины","орясины","остолопины","сиротины","скотины","старейшины","старины","старшины","уродины"],nr=q(rr),tr=["адреса","паспорта","поезда","цеха","снега","бункера","буфера","берега","вымпела","голоса","города","директора","договора","доктора","жемчуга","инспектора","инструктора","колокола","кондуктора","короба","корпуса","крейсера","кузова","леса","мастера","номера","облачка","острова","отпуска","паруса","повара","погреба","пояса","провода","прожектора","пропуска","рукава","сахара","свитера","сервера","счета","трактора","тормоза","холода","цвета","черепа","шторма","штуцера","юнкера","ястреба","суда","корм"],ir=q(tr),ur=new Set(tr.concat(["бега","беглецы","близнецы","бойцы","бока","борта","борцы","бруствера","брюшки","веера","века","венцы","верха","веса","весы","вечера","вороха","глупцы","года","гонцы","дворцы","дельцы","детдома","детдомы","дома","жеребцы","жильцы","жрецы","затишки","зубцы","излишки","истцы","катера","концы","корма","кузнецы","купола","купцы","лишки","луга","мертвецы","меха","мудрецы","облака","образа","образцы","огурцы","округа","омута","ордена","ордера","отцы","очки","певцы","песцы","пловцы","подлецы","продавцы","птенцы","резцы","рога","рода","рубцы","самцы","свинцы","сорта","соуса","спецы","стога","столбцы","стрельцы","творцы","тельцы","тенора","терема","тома","тона","торцы","хлеба","штришки","юнцы"])),ar=new Set(["авары","аланы","аршины","баклажаны","буквы","гольфы","граммы","гусары","дела","кадеты","килограммы","омы","помидоры","рентгены","ботинки","человеки","чулки","шорты"]),sr=new Set(["гектары","рельсы"]),cr=new z
;ur.forEach(function(e){return cr.addRaw(J(e))}),ar.forEach(function(e){return cr.addRaw(J(e))}),sr.forEach(function(e){
return cr.addRaw(J(e))})
;var fr=new Set(rr.concat(["абазины","авы","аввы","бедняги","бедолаги","болгары","бродяги","брызги","брюки","брюхи","будды","бусы","валенки","веки","вельможи","верзилы","вилы","владыки","воеводы","волосы","вояки","главы","грузины","задворки","задиры","железы","жилы","зануды","зеваки","именины","калеки","кальсоны","каникулы","колготки","коллеги","крохи","курицы","куры","ладоши","ламы","лыки","макароны","мужчины","нападки","нары","непоседы","носилки","ножны","папы","папаши","таты","падлы","партизаны","погоны","поминки","посиделки","похороны","предтечи","работяги","разы","ребятки","румыны","самоубийцы","санки","убийцы","сапоги","сатаны","сироты","сливки","слуги","солдаты","старосты","сумерки","сутки","татары","телеса","хитрюги","четвереньки","шляпы","шмотки","яблоки","дядьки","дяденьки","зайки","кроссовки","малютки","малолетки","попки","турки","узы","хлопоты","шахматы"])),or=new z
;fr.forEach(function(e){return or.addRaw(J(e))})
;var hr=["х","ых","их","м","ым","им","х","ых","их","ми","ыми","ими","х","ых","их"],lr=["ям","ам","","","ями","ами","ях","ах"],Er=q(["вна","вца","вцы","пла","дца","дра","судна","рки","рцы","тлы","рна","тна","енца","десны","дёсны","рёбра","ребра","сосны"]),dr=q(["жи","ши","чи","ля","ли","чи","ри","ти","ди","сани","борщи","клещи","товарищи","плащи","прыщи","хрящи"]),Sr=q(["братья","брусья","деревья","донья","звенья","клинья","клочья","коленья","колосья","колья","комья","крылья","крючья","листья","лоскутья","лохмотья","перья","платья","поводья","прутья","стулья","сучья","хлопья","шилья"]),vr=q(["ишки","дружки","тки","папочки","дедушки","дядюшки","батюшки","катанки","петрушки","шестерки"]),pr=q(["жки","шки","чки","рки","натки","хатки","ятки","етки","чётки","мки","нки","педки","илки"]),Ar=q(["шок","щок","жок","зок","аток","яток","еток"])
;function gr(e,r,n,t){var i=K(t),a=R(i),s=O(a),c=n+1;if(1===c||4===c&&!r.isAnimate())return t
;if(134217984&s)if(2===c||4===c){if(k(i,["овичи","евичи"]))return U(t)+"ей"
;if(k(i,["вны","полусотни"])&&"овны"!==i)return W(t,2)+"ен"}else if(5===c){
if(k(i,["дети","люди"])&&!k(i,["нелюди"]))return U(t)+"ьми";if(k(i,["вери","дочери"]))return[U(t)+"ями",U(t)+"ьми"]}
var f=r.getGender(),o=i.endsWith("цы")?U(t):fe(t,i),h=$(i,ye)&&(r.isASurname()||f===u.COMMON)&&!$(i,nr),l=3*Math.min(Math.round(hr.length/3-1),c-2)
;if(h||i.endsWith("ничьи"))return t+hr[l];if(i.endsWith("ые"))return W(t,2)+hr[l+1]
;if(i.endsWith("ие")||$(i,ue))return o+hr[l+2];if(c>2&&4!==c){var E=2*Math.min(Math.round(lr.length/2-1),c-3)
;return $(i,Ze)?U(t)+lr[E]:e.sd.hasStressedEndingPlural(r,n).includes(!0)?T(o)+lr[E+1]:o+lr[E+1]}
var d=r.getDeclension(),S=function(){var u=K(o),a=["жки","шки","чки","ножны"]
;if(k(u,["кн","кл","дк","нк","пк","зк","рк","тк","вк","лк","мк"])&&!k(i,["сумерки"])||"зл"===u||k(i,a)&&e.sd.hasStressedEndingPlural(r,n).includes(!0)){
var s=R(o);return U(o)+Q("о",s)+s}if($(i,Er)&&!i.endsWith("недра")||k(i,a)){var c=M(t,2);return W(t,2)+Q("е",c)+c}
if(k(i,["сестры","сёстры","серьги"])){var f=M(t,2);return("ь"===M(i,3)?T(W(t,3)):T(W(t,2)))+Q("ё",f)+f}
if(k(u,["льц","сьм","деньг","ьк","йк","дьб"])){var h=R(o);return W(o,2)+Q("е",h)+h}return k(i,["сла","слы"])?U(o)+"ел":o
};if([3,0].includes(d)){if(i.endsWith("и"))return U(t)+"ей";if(["гроздья"].includes(i))return U(t)+"ев"}var v=M(i,3)
;if(u.FEMININE!==f){var p=J(i),A=cr.hasRaw(p);if(A&&ur.has(i))return U(t)+"ов"
;if(A&&ar.has(i)&&!r.isAName())return[S(),U(t)+"ов"];if(A&&sr.has(i))return[U(t)+"ов",S()]
;if(f===u.COMMON&&!k(i,er)&&!L("жшч",v)||or.hasRaw(p)&&fr.has(i)||r.isAName()&&f===u.MASCULINE&&r.lower().endsWith("а")||"барин"===r.lower())return S()
;switch(a){case"и":case"я":
if($(i,dr)||"щи"===i||er.includes(i)||r.lower().endsWith("ь")&&!k(r.lower(),["зять","деверь"]))return("ь"===R(U(i))?W(t,2):U(t))+"ей"
;if("и"===a)return i.endsWith("ульи")?U(t)+"ев":i.endsWith("ьи")?u.MASCULINE===f?U(t)+"ёв":W(t,2)+"ей":["ча","кле","холу","ху"].includes(U(i))?U(t)+"ёв":i.endsWith("ищи")?S():i.endsWith("мессии")?U(t)+"й":b(N,M(i,2))?U(t)+"ев":!$(i,pr)||u.MASCULINE===f&&!$(T(i),vr)||$(r.lower(),Ar)?U(t)+"ов":S()
;if($(i,Sr))return U(t)+"ев";if(k(i,["зятья","кумовья","деверья","края","острия"]))return U(t)+"ёв"
;if(k(i,["ья","ия"]))return u.MASCULINE===f?W(t,2)+"ей":W(t,2)+"ий";break;case"а":
return k(i,["семена","стремена"])?W(t,3)+"ян":i.endsWith("мена")?W(t,3)+"ён":r.lower().endsWith("яйцо")?Q("яиц",U(t)):i.endsWith("нца")?[S(),U(t)+"ев"]:$(i,ir)?U(t)+"ов":S()
;case"ы":return k(i,["ницы","лицы","пицы","бицы"])?U(t):i.endsWith("цы")?U(t)+"ев":U(t)+"ов";default:
if(i.endsWith("не"))return S()}}if(i.endsWith("йки"))return W(t,3)+"ек";if(i.endsWith("ки")){if("ь"===v){var g=R(U(t))
;return W(t,3)+Q("е",g)+g}if(L("жшч",v))return S();if(b(y,v))return W(t,2)+"ок"}if(er.includes(i))return U(t)+"ей"
;if(k(i,["аи","ои","еи","эи","уи"]))return U(t)+"й";if("свечи"===i)return[U(t),U(t)+"ей"]
;if("пригоршни"===i)return[U(t)+"ей",W(t,2)+"ен"];if("тихони"===i)return[W(t,2)+"нь",U(t)+"ей"]
;if(k(i,["ьи","ии"]))return e.sd.hasStressedEndingSingular(r,n).includes(!0)?W(t,2)+"ей":W(t,2)+"ий"
;if(i.endsWith("ни")&&b(y,M(i,3)))return["барышни","боярышни","деревни"].includes(i)?W(t,2)+"ень":i.endsWith("кухни")?W(t,2)+"онь":"сотни"===i?[W(t,2),W(t,2)+"ен"]:W(t,2)+"ен"
;if(K(o).endsWith("ийк"))return W(o,2)+"ек";if(o.length===i.length-1&&$(i,Ze)){if(L("ьй",K(M(o,2)))&&!r.isAnimate()){
var I=R(o);return W(o,2)+Q("е",I)+I}return k(i,["земли","петли","пли","вли"])?U(o)+"ель":o+"ь"}return S()}
var Ir=function(){return S(function e(){var r,n,t;E(this,e),r=this,n="sd",t=function(){var e,r=new Y;function n(n,t){
var i,u=v(t.split(","));try{for(u.s();!(i=u.n()).done;){var a=i.value;e.text=a,r.put(e,n)}}catch(e){u.e(e)}finally{u.f()
}}return e={pluraleTantum:!0},n("SSSSSSS-SSSSSS","ножны"),e={gender:u.MASCULINE},
n("SSSSSSS-SSSSSS","брёх,дёрн,идиш,имидж,мед,упрёк"),
n("SSSSSSS-EEEEEE","адрес,век,вечер,город,детдом,поезд,спецсчёт,субсчёт"),
n("SSSSSSE-EEEEEE","берег,бок,вес,лес,снег,дом,катер,счёт,мёд"),n("SSSSSSS-bbbbbb","вексель,ветер"),
n("SSSSSSE-ESEEEE","глаз"),n("SSSSSSE-bEEbEE","год"),n("SSSSSSb-bbbbbb","цех"),n("SbbSbbb-bbbbbb","грош,шприц"),
n("SssSsss-ssssss","кишмиш,кряж,слеш,слэш"),n("SEESeEE-EEEEEE","стеллаж"),n("SeeSeee-eeeeee","шиномонтаж"),e={
gender:u.MASCULINE,animate:!0},n("Sssssss-ssssss","паныч"),n("SSSSSSS-SSSSSS","балансёр,шофёр"),e={gender:u.NEUTER},
n("EEEEEEE-SsESEE","плечо"),
n("EEEEEEE-SSSSSS","тесло,стекло,автостекло,бронестекло,оргстекло,пеностекло,смарт-стекло,спецстекло,бедро,берцо,блесна,чело,стегно,стебло"),
e={gender:u.FEMININE},n("EEEbEEE-SSESEE","щека"),n("EEEEEEE-SSESEE","слеза"),n("EEEEEEE-SESSSS","семья,макросемья"),
n("EEEEEEE-SEESEE","вожжа,свеча"),n("EEESEEE-SSSSSS","душа"),n("EEEEEEE-eEeeee","скамья"),
n("EEEEEEE-EEEEEE","башка,кишка,ладья,лапша,моча,пыльца,статья"),e={gender:u.FEMININE,animate:!0},
n("EEEEEEE-SESESS","свинья,овца"),e={gender:u.COMMON,animate:!0},n("EEEEEEE-SSSSSS","судья"),
n("EEEEEEE-EEEEEE","левша"),r}(),(n=A(n))in r?Object.defineProperty(r,n,{value:t,enumerable:!0,configurable:!0,
writable:!0}):r[n]=t},[{key:"decline",value:function(e,r,n){return Or(this,x.create(e),r,n)}},{key:"pluralize",
value:function(e){var r=x.create(e);return r.isPluraleTantum()?[r.text()]:Qe(this,r)}},{key:"getLocativeForms",
value:function(e){var r=this,n=x.create(e),t=n.getDeclension();if(t&&t>=0){var i=Te.get(we(n))
;if(i instanceof Array)return i.map(function(e){return new a(function(e){switch(1+(e>>3&7)){case f.V:return"в"
;case f.VO:return"во";case f.NA:return"на"}}(e),function(e,r,n,t){var i=5;switch(r){case 0:return be(e,n,i);case 1:
return Ve(e,n,t);case 2:return Ne(e,n,i);case 3:return Oe(e,n,i)}}(r,t,n,h(e)),e>>6)})}return[]}}])}()
;function Or(e,n,t,i){var u=function(e,n,t,i){var u=n.text(),a=r.indexOf(t);if(n.isIndeclinable())return u
;if(n.isPluraleTantum())return gr(e,n,a,u);if(i)return gr(e,n,a,i);switch(n.getDeclension()){case-1:return u;case 0:
return be(e,n,a);case 1:return Fe(e,n,a);case 2:return Ne(e,n,a);case 3:return Oe(e,n,a)}}(e,n,t,i)
;return u instanceof Array?u:[u]}return e.CASES=r,e.Case=n,e.Engine=Ir,e.Gender=u,e.Lemma=x,e.LocativeForm=a,
e.LocativeFormAttribute=s,e.StressDictionary=Y,e.createLemma=function(e){return x.create(e)},
e.createLemmaOrNull=function(e){return x.createOrNull(e)},e}({});
//# sourceMappingURL=RussianNouns.es5.js.map
