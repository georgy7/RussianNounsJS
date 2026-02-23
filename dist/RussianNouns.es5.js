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
COMMON:i[3]});function a(e,r){(null==r||r>e.length)&&(r=e.length);for(var n=0,t=Array(r);n<r;n++)t[n]=e[n];return t}
function s(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function c(e,r){
for(var n=0;n<r.length;n++){var t=r[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),
Object.defineProperty(e,l(t.key),t)}}function f(e,r,n){return r&&c(e.prototype,r),n&&c(e,n),
Object.defineProperty(e,"prototype",{writable:!1}),e}function o(e,r){
var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=d(e))||r){n&&(e=n)
;var t=0,i=function(){};return{s:i,n:function(){return t>=e.length?{done:!0}:{done:!1,value:e[t++]}},e:function(e){
throw e},f:i}}
throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}var u,a=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return a=e.done,e},e:function(e){s=!0,u=e
},f:function(){try{a||null==n.return||n.return()}finally{if(s)throw u}}}}function h(e,r){return function(e){
if(Array.isArray(e))return e}(e)||function(e,r){
var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){
var t,i,u,a,s=[],c=!0,f=!1;try{if(u=(n=n.call(e)).next,0===r);else for(;!(c=(t=u.call(n)).done)&&(s.push(t.value),
s.length!==r);c=!0);}catch(e){f=!0,i=e}finally{try{if(!c&&null!=n.return&&(a=n.return(),Object(a)!==a))return}finally{
if(f)throw i}}return s}}(e,r)||d(e,r)||function(){
throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}()}function l(e){var r=function(e,r){if("object"!=typeof e||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){
var t=n.call(e,r);if("object"!=typeof t)return t;throw new TypeError("@@toPrimitive must return a primitive value.")}
return String(e)}(e,"string");return"symbol"==typeof r?r:r+""}function d(e,r){if(e){if("string"==typeof e)return a(e,r)
;var n={}.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),
"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(e,r):void 0}}
function E(e){var r,n=new Set,t=0,i=o(e);try{for(i.s();!(r=i.n()).done;){t+=r.value,n.add(t)}}catch(e){i.e(e)}finally{
i.f()}return n}function S(e){return 1<<e}function v(e,r,n){this.preposition=e,this.word=r,this.attributes=n}
var p=Object.freeze({CONTAINER:1,LOCATION:2,STRUCTURE:4,SURFACE:8,WAY:16,OBJECT_WITH_FUNCTIONAL_SURFACE:32,SUBSTANCE:64,
RESOURCE:128,CONDITION:256,EXPOSURE:S(9),MOTION:S(10),EVENT:S(11),WITH_ADJECTIVE:S(12),WITHOUT_ADJECTIVE:S(13),
RELIGIOUS:S(14)}),g=Object.freeze({PREPOSITIONAL:1,U_SUFFIX:2}),b=Object.freeze({V:1,VO:2,NA:3});function m(e,r,n){
return n<<6|(e-1&7)<<3|r-1&7}function A(e){return 1+(7&e)}function y(e){
var r=e.replaceAll("ё","е"),n=r.length%2,t=1,i=5381;function u(){i=(33*i+(255&n))%4294967296,n>>=8,t-=8}var a,s=o(r)
;try{for(s.s();!(a=s.n()).done;){var c=a.value.charCodeAt(0)-1072&31;n|=c<<t,(t+=5)>=8&&u()}}catch(e){s.e(e)}finally{
s.f()}t>0&&u();var f=r.charCodeAt(0)%2;return 2*(2147483647&i)+f}function w(e){var r=e.charCodeAt(0)-1072
;return 33===r?32:r===(31&r)?1<<r:0}function I(e,r){return 0!==(e&w(r))}var W=3892855073,O=66567902,N=66567390
;function _(e){return I(W,e)}function C(e){return e.split("").filter(_).length}function M(e){
return e.replaceAll("ё","е").replaceAll("Ё","Е")}function T(e,r){return e.substring(0,e.length-r)}function U(e,r){
return e.substring(e.length-r)}function k(e){return T(e,1)}function x(e){return L(e,1)}function L(e,r){
return e[e.length-r]||""}function R(e,r){return 1===r.length&&e.includes(r)}function j(e,r){return r.some(function(r){
return e.endsWith(r)})}var P=function(){function e(r){s(this,e),r instanceof e?(this._txt=r._txt,this._lc=r._lc,
this._hash=r._hash,this._flags=r._flags):(r.pluraleTantum?this._flags=5:this._flags=1+i.indexOf(r.gender),
this._txt=r.text,this._lc=r.text.toLowerCase(),this._hash=y(this._lc),this._flags|=8*(1&r.indeclinable),
this._flags|=16*(1&r.animate),this._flags|=32*(1&r.surname),this._flags|=64*(1&r.name),this._flags|=128*(1&r.transport),
this._flags|=S(16)*(2+function(e,r,n,t){if(r)return-2;if(t)return-1;var i=x(e);switch(n){case u.FEMININE:
return"а"===i||"я"===i?2:I(O,i)?-1:3;case u.MASCULINE:return"а"===i||"я"===i?2:"путь"===e?0:1;case u.NEUTER:
return["дитя","полудитя"].includes(e)?0:"мя"===U(e,2)?3:1;case u.COMMON:return"а"===i||"я"===i?2:"и"===i?-1:1;default:
return-2}}(this._lc,r.pluraleTantum,r.gender,r.indeclinable)))}return f(e,[{key:"equals",value:function(r){
return r instanceof e&&this._flags===r._flags&&this.lower()===r.lower()}},{key:"text",value:function(){return this._txt}
},{key:"lower",value:function(){return this._lc}},{key:"isPluraleTantum",value:function(){return 5==(7&this._flags)}},{
key:"getGender",value:function(){var e=7&this._flags;if(e>=1&&e<=4)return i[e-1]}},{key:"isIndeclinable",
value:function(){return!!(8&this._flags)}},{key:"isAnimate",value:function(){
return!!(16&this._flags)||this.isASurname()||this.isAName()}},{key:"isASurname",value:function(){
return!!(32&this._flags)}},{key:"isAName",value:function(){return!!(64&this._flags)}},{key:"isATransport",
value:function(){return!!(128&this._flags)}},{key:"getDeclension",value:function(){return(this._flags>>16)-2}},{
key:"getSchoolDeclension",value:function(){var e=this.getDeclension();return 1===e?2:2===e?1:e}}],[{key:"create",
value:function(e){if(e instanceof this)return e;var r=z(e);if(r)throw new Error(r);return Object.freeze(new this(e))}},{
key:"createOrNull",value:function(e){return null===z(e)?Object.freeze(new this(e)):null}}])}();function F(e,r){
var n=new P(e);return n._txt=r,n._lc=r.toLowerCase(),n._hash=y(n.lower()),Object.freeze(n)}function z(e){
if(null==e)return"No parameters specified."
;for(var r=0,n=["pluraleTantum","indeclinable","animate","surname","name","transport"];r<n.length;r++){var t=n[r]
;if(function(e){return null!=e&&"boolean"!=typeof e}(e[t]))return t+" must be boolean."}
if(null==e.text)return"A cyrillic word required.";if(!e.pluraleTantum){
if(null==e.gender)return"A grammatical gender required.";if(!i.includes(e.gender))return"Bad grammatical gender."}
return null}
var V=E([11720389,548,1024,1479,2622,2867,1222,2642,264,1328,137,123,397,65542229,212447047,31729170,8094836,1056,21701789,35520559,40358,21819,28248,119786,63892,31809,7356,74383,72369,5945,28902,90120738,21187517,91925642,3054826,1600765,65934,30948851,5569212,4205640,5412804,6787095,9749916,3940084,1511466,1303038,16090470,1376628,49919694,3827522,37915959,14032615,28701924,224587434,637275762,51079457,391103676,24108070,158999424,232633267,6058815,66599250,692781441,816204112,55209380,72754,90006,80058,45564,67845,42548,27193,21401,139393,750335,170896,4424,1566,6264,154969,17292,17229,175112,83011,117872,4183,13065,108972,108088,343663,66210,334,17090,380271,283272,59007,35796,230801,1067156,19992,157124,12433,252644,2626,23776,630482,531296,304718,90891,726,23116,47653,30493,167310,50156,123071,477118,241821,55660,908992,534269,205157,11218,2490,660,66391,46856,847526,68710,8450,36630,15642,109864,41716,354482,79820,51876,97325,5506,46436,191803,3957,40876,126323,2347821,338490,73216,475569,87602,29642,4220,10760,16896,50156,17424,35178,167244,126786,33643,30488,65045,35961,51453,55660,4,152461,138332,1958,34200,3709,61381,17424,30158,80591,11218,44099,260487]),D=E([11720389,548,1024,1060,4,5904,1848,4404,330555234,4691346,3365076,1045362,7414584,960432,10564312,253286,16178203,4357,4355,11350,31120,5248,40591,62367,54057,50487,13069,3664,39764,10263,3002,5810,8844,24551,4091,56761,21785,30553,55147139,15960625,1933097,12258067,16302047,54210486,45688435,1659767,4813249,33577763,2501798,10056946,672528,14209351,2012340,1655412,4652736,62568,148698,21186,71129124,260014161,108045611,1007583269,2026464,22799532,750068913,1499532,1285428194,74598,22348,6599,132273,309821,156816,397448,179394,148036,100257,21779,11218,36631,345954,50442,104394,2724,112115,30690,10552,31377,11286,7168,14612,51480,116537,192258,163145,65604,97951,1363157,212810,431243,2622,425588,275284,150351,570568,244701,16659,26136,130134,11040,159389,728373,3476,726,1290392,224730,189158,11218,2490,10750,21608,143747,65974,664563,84036,16283,17424,5758,45080,33066,1782,90658,37101,56107,233163,14216,5518,179264,2525,146957,111342,80594,2309,4217,25432,26905,29980,518951,1458289,523705,4202,477865,149368,126310,47828,212678,22744,269176,179119,4399,35997,69696,41777,41,127336,4202,73153,46372,114255,126869,23630,11218]),G=function(){
return f(function e(){s(this,e),this._filter=new Uint8ClampedArray(256)},[{key:"addInteger",value:function(e){
this.addRaw(B(e))}},{key:"hasInteger",value:function(e){return this.hasRaw(B(e))}},{key:"addRaw",value:function(e){
var r=2047&e,n=r>>>3;this._filter[n]=this._filter[n]|1<<7-r%8}},{key:"hasRaw",value:function(e){var r=2047&e
;return!!(this._filter[r>>>3]>>>7-r%8&1)}},{key:"clone",value:function(){return X(this._filter)}}])}();function X(e){
var r=new G;return r._filter=Uint8ClampedArray.from(e),r}function B(e){return e>>>22&2047^e>>>11&2047^2047&e}
function q(e){var r=e.padStart(3,"а");return(7&r.charCodeAt(0))<<8|(15&r.charCodeAt(1))<<4|15&r.charCodeAt(2)}
var H,J=(H=new G,V.forEach(function(e){return H.addInteger(e)}),D.forEach(function(e){return H.addInteger(e)}),
Object.freeze(H));function Y(){var e=new Map,r=J.clone(),n=function(e){return 4294967296*(31&e._flags)+e._hash
},i=function(e){return e.lower().indexOf("ё")+1&255},a=function(r){var t=65504&r._flags,u=function(r){
var t=n(r),i=e.get(t);return i instanceof Array?i:[]}(r).filter(function(e){return(e[0]&t)<=t}),a=u.filter(function(e){
return e[0]>>16===i(r)});return a.length?a[0][1]:u.length?u[0][1]:void 0};this.put=function(t,u){
var a=u.split("-"),s=function(e,r){return e.length!==r||e.split("").some(function(e){return!"SsbeE".includes(e)})}
;if(2!==a.length||s(a[0],7)||s(a[1],6))throw new Error("Bad settings format.");var c=P.create(t),f=n(c),o=e.get(f)
;o instanceof Array||(o=[],e.set(f,o));var h=65535&c._flags|i(c)<<16,l=o.find(function(e){return h===e[0]})
;l?l[1]=u:o.push([h,u]),r.addInteger(c._hash)};var s=function(e){switch(e){case"E":return[!0];case"e":return[!0,!1]
;case"b":case"s":return[!1,!0];default:return[!1]}};this.hasStressedEndingSingular=function(e,n){
if(r.hasInteger(e._hash)){var i=t(n);if(i>=0){var c=a(e);if(c){var f=c.split("-")[0];return s(f[i])}
if(e.getGender()===u.MASCULINE){if(V.has(e._hash))return s("SEESEEE"[i]);if(D.has(e._hash))return s("SEEEEEE"[i])}}}
return[]},this.hasStressedEndingPlural=function(e,n){if(r.hasInteger(e._hash)){var i=t(n);if(i>=0&&i<6){var c=a(e)
;if(c){var f=c.split("-")[1];return s(f[i])}
if(e.getGender()===u.MASCULINE&&(V.has(e._hash)||e.isAnimate()&&D.has(e._hash)))return s("E")}}return[]}}function $(e){
var r,n=new Map,t=o(e);try{for(t.s();!(r=t.n()).done;)for(var i=r.value,u=n,a=i.length-1;a>=0;a--){var s=i.charCodeAt(a)
;if(a>0){var c=u.get(s);if(0===c)break;void 0===c&&u.set(s,new Map),u=u.get(s)}else u.set(s,0)}}catch(e){t.e(e)}finally{
t.f()}return n}function K(e,r){for(var n=r,t=e.length-1;t>=0;t--){var i=e.charCodeAt(t);if(!n.has(i))return!1
;var u=n.get(i);if(0===u)return!0;n=u}}function Q(e){for(var r=new Array(e.length),n=0;n<e.length;n++){
var t=e.charCodeAt(n);t>=1040&&t<=1071?t+=32:t>=1024&&t<=1039&&(t+=80),r[n]=t}return String.fromCharCode.apply(null,r)}
function Z(e,r){return r===r.toUpperCase()?e.toUpperCase():e}
var ee=$(["ое","нький","ский","ской","лстой","отой","утой","евой","овой","живой"]),re=$(["ее","ое","нький","ский","ской","лстой","отой","утой"]),ne=$(["евой","овой","отой","живой"]),te=$(["шний","жний","щий","ший","жий","чий"]),ie=["божий","ажий","яжий","ужий","южий","бульдожий","кабарожий","медвежий","носорожий","миножий"],ue=$(ie),ae=$(ie.map(function(e){
return T(e,2)+"ьи"
})),se=new Set(["бубен","бугор","ветер","вошь","вымысел","горшок","деготь","дёготь","дятел","домысел","замысел","кашель","коготь","лапоть","лоб","локоть","ломоть","молебен","мох","ноготь","овен","пепел","пес","пёс","петушок","помысел","порошок","промысел","псалом","пушок","ров","рожь","рот","сон","стебель","стишок","угол","умысел","хребет","церковь","шов","ковер","овес","костер"].map(y)),ce=new G
;se.forEach(function(e){return ce.addInteger(e)})
;var fe=$(["овёс","ковёр","костёр","шатер","шатёр","козел","козёл","котел","котёл","орел","орёл","осел","осёл","узел","уголь","чок","ешок","хол"])
;function oe(e,r){var n=x(r);if(I(-402111711,n)){if(I(W,L(r,2))){var t=T(e,2);return K(r,ue)?t+Z("ь",t):t}
if("й"!==n)return k(e)}return e}var he=["ясень","бюллетень","олень","тюлень","гордень","пельмень","ячмень"]
;function le(e,r,n){var t,i=e.text(),a=x(r),s=w(a);return-133667019&s&&(-402111711&s?t=function(e,r,n){var t=L(r,2)
;return"ь"===t||"о"===n&&I(2504708,t)?k(e):oe(e,r)}(i,r,a):"к"===a?t=function(e,r,n){
return e.length>=4&&j(r,["рёк","нёк","лёк"])&&!1!==n?T(e,2)+"ьк":r.endsWith("ёк")&&I(W,L(r,3))?T(e,2)+"йк":void 0
}(i,r,n):"ь"===a?t=function(e,r,n){
return se.has(e._hash)||K(n,fe)?T(r,3)+L(r,2):n.endsWith("ень")&&e.getGender()===u.MASCULINE&&!j(n,he)?T(r,3)+"н":k(r)
}(e,i,r):(["лёд","лед","лён"].includes(r)||"лев"===r&&e.isAnimate())&&(t=T(i,2)+Z("ь",L(i,2))+x(i))),
t||(t=function(e,r,n){
return!!(199680&n)&&K(r,fe)&&!["новосел","новосёл"].includes(r)||!!(2571270&n)&&(ce.hasInteger(e._hash)&&se.has(e._hash)||e.isAnimate()&&r.endsWith("посол"))
}(e,r,s)?T(i,2)+x(i):i),t}function de(e,r){var n=k(e),t=k(r.lower());if("а"===x(t))return n
;if(j(t,["зне","жне","гре","спе","мудре"])||U(k(t),3).split("").every(function(e){return I(N,e)})||r.isAName())return n
;if("ле"===U(t,2)){var i=L(t,3);return I(W,i)||"л"===i?k(n)+"ь":n}
return I(W,x(t))&&"и"!==x(t)?I(W,x(k(t)))?T(e,2)+"й":j(r.lower(),["месяц"])?n:T(e,2):n}
var Ee=$(["лапоток","желток","нишок","ришок","ишек"]),Se=["поток","приток","переток","проток","биоток","электроток","восток","водосток","водоток","воток","знаток"],ve=["инок","исток","обморок","порок","пророк","сток","урок"]
;function pe(e){
return j(e,["чек","шек"])&&e.length>=6||K(e,Ee)||e.endsWith("ок")&&!e.endsWith("шок")&&!ve.includes(e)&&!j(e,Se)&&!I(W,L(e,3))&&(I(W,L(e,4))||j(T(e,2),["ст","рт"]))&&e.length>=4
}function ge(e,r,n){return(e.length?e:[!1]).map(function(e){return n(e?M(r):r,e)})}var be=0,me=3,Ae={"дочь":"дочерь",
"мать":"матерь"};function ye(e,r,n){var t=r.text(),i=r.lower()
;if(![be,me].includes(n)&&Object.keys(Ae).includes(i))return ye(e,F(r,Ae[i]),n);var u=le(r,i);if(function(e){
return e.endsWith("полночь")||e.startsWith("пол")&&I(134217984,x(e))&&C(e)>=2}(i)&&(u="полу"+u.substring(3)),
"мя"===U(i,2))switch(n){case be:case me:return t;case 1:case 2:case 5:case 6:return u+"ени";case 4:return u+"енем"
}else switch(n){case be:case me:return t;case 1:case 2:case 5:case 6:return u+"и";case 4:
return j(i,["вошь","рожь","церковь"])?t+"ю":u+"ью"}}function we(e,r,n){var t=r.text(),i=r.lower()
;if(i.endsWith("путь"))return 4===n?k(t)+"ём":ye(e,r,n);if(!i.endsWith("дитя"))throw new Error("unsupported");switch(n){
case 0:case 3:return t;case 1:case 2:case 5:case 6:return t+"ти";case 4:return[t+"тей",t+"тею"]}}function Ie(e,r,n){
var t=r.text(),i=r.lower(),u=le(r,i),a=Q(u),s=k(t),c=k(i),f=function(){return"я"===x(i)},o=function(){
return i.endsWith("ая")&&!(2===C(i)||I(W,x(a)))},h=function(){return i.endsWith("яя")&&!(2===C(i)||I(W,x(a)))
},l=["жая","шая"];switch(n){case 0:return t;case 1:
return h()||j(i,l)?u+"ей":o()?u+"ой":r.isASurname()&&!i.endsWith("да")?s+"ой":i.endsWith("ничья")?s+"ей":f()||I(60818504,x(a))?s+"и":s+"ы"
;case 2:case 5:case 6:
return h()||j(i,l)?u+"ей":o()?u+"ой":r.isASurname()&&!i.endsWith("да")?s+"ой":"ия"===U(i,2)?s+"и":i.endsWith("ничья")?s+"ей":s+"е"
;case 3:return o()?u+"ую":h()?u+"юю":f()?s+"ю":s+"у";case 4:
return h()||j(i,l)?u+"ею":o()?[u+"ой",u+"ою"]:f()||R("жшчщц",x(a))&&!e.sd.hasStressedEndingSingular(r,n).includes(!0)?"и"===x(c)?s+"ей":[s+"ей",s+"ею"]:[s+"ой",s+"ою"]
}}var We=$(["ов","ев","ёв","ин","ын"]),Oe=function(e,r){for(var n=r,t=0;t<e.length;t++){var i=e.charCodeAt(t),u=n
;(n=new Map).set(i,u)}return n}("ы",We);function Ne(e){return e.filter(function(r,n){return e.indexOf(r)===n})}
function _e(e){var r=1&e.lower().includes("ё");return 4294967296*((65535&e._flags)<<1|r)+e._hash}
var Ce=Object.freeze(function(){var e=new Map,r={gender:u.MASCULINE},n={gender:u.MASCULINE,animate:!0}
;function t(r,n,t,i,u){var a,s=i.split(","),c=u instanceof Array?u:[g.U_SUFFIX],f=o(s);try{for(f.s();!(a=f.n()).done;){
var h=a.value;r.text=h;var l=_e(P.create(r)),d=e.get(l);d||(d=[],e.set(l,d));var E,S=o(t);try{
for(S.s();!(E=S.n()).done;){var v,p=E.value,b=o(c);try{for(b.s();!(v=b.n()).done;){var A=v.value;d.push(m(p,A,n))}
}catch(e){b.e(e)}finally{b.f()}}}catch(e){S.e(e)}finally{S.f()}}}catch(e){f.e(e)}finally{f.f()}}
var i=[b.V],a=[b.VO],s=[b.NA];t(r,S(0),i,"мозг,пруд,стог,таз,год"),t(r,S(0),a,"рот"),t(r,S(4),i,"год"),
t(r,S(0),i,"гроб"),
t(r,S(0)|S(14),a,"гроб",[g.PREPOSITIONAL]),t(r,S(1),i,"ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,низ,хлев"),
t(r,S(2),i,"круг,полк,артполк,ряд,род,строй,лад"),t(r,S(3),s,"баз,берег,бережок,вал,кон,круг,луг,пол,яр"),
t(r,S(4),s,"век,день"),t(r,S(4),i,"час"),t(r,S(4),s,"корень"),t(n,S(5),s,"вор"),
t(r,S(5),s,"повод,бочок,борт,воз,горб,кол,мост,плот,сук,х"+String.fromCharCode(1091)+"й"),
t(r,S(5),s,"крюк,болт",[g.PREPOSITIONAL,g.U_SUFFIX]);var c=",мёд,мех,пар,пух";t(r,S(6),i,"дым,жир,мел,пушок"+c),
t(r,S(7),s,"газ,клей,спирт"+c),t(r,S(8),i,"бой,бред,быт,долг,плен,пыл,сок,ход,лад"),t(r,S(9),i.concat(s),"вид"),
t(r,S(9),s,"слух,счёт,ветер,ветр,свет"),t(r,S(10),s,"ход,бег,вес"),t(r,S(10)|S(12),s,"шаг"),t(r,S(11),s,"бал,пир"),
t(r,S(8),s,"дух,плав"),t(r,S(10)|S(12),s,"газ"),t(r,S(0),i,"глаз,зоб,нос,шкаф"),t(r,S(0),a,"лоб"),
t(r,S(5),s,"глаз,лоб,нос,шкаф,холм");var f="бок,верх,зад,угол";return t(r,S(1),i,f),t(r,S(5),s,f),
t(r,S(1)|S(13),i,"край"),t(r,S(5)|S(13),s,"край"),t(r,S(3),s,"лёд,мох,снег"),t(r,S(6),a,"лёд,лён,мох"),
t(r,S(6),i,"снег"),e
}()),Me=new Set("клей,чай,дом,дух,дым,дымок,газ,год,горошек,жар,жир,квас,пар,пыл,род,рост,сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,табак,творог,толк,торф,туман,убыток,укроп,уксус,ход,цемент,чеснок,шаг,шик,шиповник,шоколад,шорох,шум,яд".split(",")),Te=new G
;Me.forEach(function(e){return Te.addInteger(y(e))})
;var Ue=$(["й","ие","иё"]),ke=$(["воробей","муравей","ручей","соловей","улей"]),xe=$(["мой","ной","дой","шой","жой","рзой","осой","хой","латой","витой","литой","питой","житой","отой","утой","ятой","лагой","рагой","огой","угой","лубой","любой","илой","ылой","злой","малой","овой","евой","живой","ской","акой","укой","нний","ский","йкий","цкий","зкий","ткий","лкий","мкий","хкий","оркий","аркий","яркий","ький","ёкий","бокий","оокий","cокий","токий","ликий","дикий","укий","ыкий","який","пкий","дкий","бкий","нкий","жкий","чкий","гкий","овкий","авкий"])
;function Le(e,r){return"ый"===U(r,2)||(r.endsWith("кривой")||K(r,xe))&&C(r)>=2}
var Re=$(["ий","ие","чье","тье","дье","вье","бье","жалованье","енье","ружье","божье","верье","мужье"]),je=$(["вое","лое","мое","ное","рое","тое","той","ый"])
;function Pe(e,r,n){
var t=r.text(),i=Q(t),a=x(i),s=r.getGender(),c=e.sd.hasStressedEndingSingular(r,n),f=le(r,i,c[0]),o=k(t),h=ze(i)
;h&&(f="полу"+f.substring(3),o="полу"+o.substring(3));var l=Q(f),d=function(){return h&&i.endsWith("я")||De(i)
},E=K(i,Ue),S=function(){return K(i,ke)?k(o)+Z("ь",x(o)):o},v=function(){return R("чщ",x(l))};function p(e){
return!r.isAnimate()&&Te.hasInteger(r._hash)&&Me.has(i)&&("й"===a?e.push(k(t)+Z("ю",x(t))):e=e.concat(ge(c,f,function(e){
return e+Z("у",x(e))}))),e}switch(n){case 0:return t;case 1:switch(a){case"и":case"ы":if(h)return Fe(e,r,n,i);break
;case"й":case"е":if(E&&r.isASurname()||Le(0,i)||K(i,ee))return f+"ого";if(K(i,te)||i.endsWith("ее"))return f+"его"
;case"ё":case"я":case"ь":if(E)return p([S()+"я"]);if(d()&&!v())return f+"я";break;case"ц":return de(t,r)+"ца";case"к":
if(pe(i))return k(o)+"ка";break;case"о":if(j(i,["шко"])&&u.MASCULINE===s)return o+"и"}
return p(r.isASurname()||-1===l.indexOf("ё")?[f+"а"]:ge(c,f,function(e){return e+"а"}));case 2:switch(a){case"и":
case"ы":if(h)return Fe(e,r,n,i);break;case"й":case"е":if(E&&r.isASurname()||Le(0,i)||K(i,ee))return f+"ому"
;if(K(i,te)||i.endsWith("ее"))return f+"ему";case"ё":case"я":case"ь":if(E)return S()+"ю";if(d()&&!v())return f+"ю";break
;case"ц":return de(t,r)+"цу";case"к":if(pe(i))return k(o)+"ку"}
return r.isASurname()||-1===l.indexOf("ё")?f+"у":ge(c,f,function(e){return e+"у"});case 3:
return s===u.NEUTER||R("иы",a)&&h?t:r.isAnimate()?Pe(e,r,1):t;case 4:switch(a){case"и":case"ы":if(h)return Fe(e,r,n,i)
;break;case"й":case"е":case"ё":case"я":case"ь":if(E&&r.isASurname()||K(i,re))return K(i,je)?f+"ым":f+"им"
;if(Le(0,i))return"и"===L(i,2)||i.endsWith("хой")?f+"им":f+"ым";if(K(i,ne))return f+"ым";if(K(i,te))return f+"им"
;if(E)return S()+"ем";if(i.endsWith("це"))return t+"м";break;case"ц":return ge(c,t,function(e,n){
return n?de(e,r)+"цом":de(e,r)+"цем"});case"к":if(pe(i))return k(o)+"ком";break;case"н":case"в":
if(r.isASurname()&&K(i,We))return t+"ым"}return d()||R("жшчщ",x(l))?ge(c,f,function(e,r){return r?e+"ом":e+"ем"
}):r.isASurname()||-1===l.indexOf("ё")?f+"ом":ge(c,f,function(e){return e+"ом"});case 6:if("полпути"===i)return t
;var g=Ce.get(_e(r));if(g)return Ne(g.map(function(e){return A(e)})).map(function(n){return Ve(e,r,n)});case 5:
switch(a){case"и":if("полпути"===i)return t;case"ы":if(h)return Fe(e,r,n,i);break;case"й":case"е":case"ё":case"я":
case"ь":if(E&&r.isASurname()||Le(0,i)||K(i,ee))return f+"ом";if(K(i,te)||i.endsWith("ее"))return f+"ем"
;if(j(i,["воробей"])){var b=k(o);return b+Z("ье",x(b))}
if(K(i,Re)&&!j(i,["запястье","здоровье","изголовье","платье"]))return o+"и";if("й"===a||"иё"===U(i,2))return S()+"е"
;break;case"ц":return de(t,r)+"це";case"к":if(pe(i))return k(o)+"ке"}
return r.isASurname()||-1===l.indexOf("ё")?f+"е":ge(c,f,function(e){return e+"е"})}}function Fe(e,r,n,t){
var i=function(){return"полминуты"!==t?"полу"+r.text().substring(3):r.text()}
;return"полпути"===t?we(e,F(r,k(i())+"ь"),n):t.endsWith("зни")||t.endsWith("сти")?ye(e,F(r,k(i())+"ь"),n):Ie(e,F(r,k(i())+("ни"===U(t,2)?"я":"а")),n)
}function ze(e){if(e.startsWith("пол")&&I(2550137089,x(e))&&"л"!==e[3]&&C(e)>=2){
var r=e.substring(3),n=r.search(/[а-яё]/);return n>=0&&I(O,r[n])}return!1}function Ve(e,r,n){if(g.U_SUFFIX===n){
var t=r.text(),i=r.lower(),u=le(r,i),a=k(t),s=ze(i)&&i.endsWith("я")||De(i)
;return"й"===x(i)?M(a)+"ю":s?M(u)+"ю":pe(i)?M(k(a))+"ку":M(u)+"у"}if(g.PREPOSITIONAL===n)return Pe(e,r,5)}
function De(e){return"ь"===x(e)&&!e.endsWith("господь")||R("её",x(e))&&!j(e,["це","же"])}
var Ge,Xe=new G,Be=Object.freeze([[[u.MASCULINE,void 0],{"болгарин":["болгары"],"господин":["господа"],
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
"ремесло":["ремёсла"],"седло":["сёдла"],"село":["сёла"]}]]),qe=o(Be);try{for(qe.s();!(Ge=qe.n()).done;){var He=Ge.value
;Object.keys(He[1]).map(function(e){return Xe.addInteger(y(e))})}}catch(e){qe.e(e)}finally{qe.f()}
var Je=["зять","деверь","друг","брат","собрат","стул","брус","обод","полоз","струп","подмастерье","якорь","перо","шило"],Ye=new Set(["берег","бок","борт","век","вес","веер","вексель","вечер","глаз","голос","город","доктор","дом","детдом","егерь","жемчуг","катер","колокол","концлагерь","корм","короб","кузов","купол","лес","луг","мастер","номер","пояс","провод","рог","сахар","снег","сорт","стог","счет","счёт","спецсчет","спецсчёт","субсчет","субсчёт","терем","том","холод","цвет","череп"]),$e=$(["округ","остров","отпуск","паспорт","парус","поезд","повар","погреб","рукав","цех","юнкер"]),Ke=new Set(["адрес","договор","буфер","ворох","директор","инспектор","инструктор","корпус","крейсер","орден","ордер","прожектор","пропуск","род","свитер","сервер","тенор","тон","трактор","тормоз","ветер","верх","китель","мех","хлеб","юнкер","ястреб"]),Qe=new Set(["бункер","вымпел","год","образ","омут","токарь","тополь","шторм","штуцер"])
;function Ze(e,r){var n=[],t=r.text(),i=Q(t),a=e.sd.hasStressedEndingPlural(r,0);Object.freeze(a)
;var s=le(r,i,a[0]),c=Q(s);if(i.endsWith("яя"))return n.push(T(t,2)+"ие"),Ne(n);var f=function(n){
var t=e.sd.hasStressedEndingPlural(r,0).map(function(e){return!e});return t.length?t.map(function(e){
return e?1===c.replace(/[^её]/g,"").length?n(function(e){
var r=Math.max(e.toLowerCase().lastIndexOf("е"),e.toLowerCase().lastIndexOf("ё")),n=Z("ё",e[r])
;return e.substring(0,r)+n+e.substring(r+1)}(s)):n(s):n(M(s))}):[n(s)]
},l=r.getGender(),d=r.getDeclension(),E=("й"===x(i)||I(W,x(i)))&&I(W,x(k(i)))?k(t):s,S=function(){
return(i.endsWith("евич")||i.endsWith("евна"))&&i.indexOf("ье")>=0};function v(){
var e=E,r=Q(e).indexOf("ье"),n=Z("и",e[r]);return e.substring(0,r)+n+e.substring(r+1)}function p(){
I(60818504,x(c))||R("яйь",x(i))||j(i,["сосед"])?S()?(n.push(v()+"и"),
n.push(E+"и")):Array.prototype.push.apply(n,ge(a,E,function(e){return e+"и"
})):"ц"===x(i)?n.push(de(t,r)+"цы"):S()?(n.push(v()+"ы"),n.push(E+"ы")):Array.prototype.push.apply(n,ge(a,E,function(e){
return e+"ы"}))}var g=function(e,r){if(Xe.hasInteger(e._hash)){var n,t=e.getGender(),i=e.isAnimate(),u=o(Be);try{
for(u.s();!(n=u.n()).done;){var a=h(n.value,2),s=a[0],c=a[1],f=s[0],l=s[1]
;if(t===f&&(null==l||l===i)&&c.hasOwnProperty(r))return c[r].slice()}}catch(e){u.e(e)}finally{u.f()}}}(r,i)
;if(g)return g;var b="ь"===x(c)?s:"к"===x(c)?k(s)+"чь":"г"===x(c)?k(s)+"зь":"й"===x(i)?k(t):j(i,["рь","ль"])?s:s+"ь"
;switch(d){case-1:n.push(t);break;case 0:if("путь"===i)n.push("пути");else{
if(!i.endsWith("дитя"))throw new Error("unsupported");n.push(T(t,3)+"ети")}break;case 1:
if(Je.includes(i))n.push(b+"я");else if(u.MASCULINE===l){"сын"===i?(n.push("сыновья"),
p()):"человек"===i?(n.push("люди"),
p()):["крюк","лист","лоскут","повод","прут","сук","учитель","флигель","штабель"].includes(i)||"соболь"===i&&r.isAnimate()?(p(),
n.push(b+"я")):["клин","колос","ком","край","соболь"].includes(i)?n.push(b+"я"):Ye.has(i)||K(i,$e)||Ke.has(i)||Qe.has(i)?(Qe.has(i)&&p(),
De(i)?Array.prototype.push.apply(n,f(function(e){return e+"я"})):a.includes(!0)?n.push(M(s)+"а"):n.push(s+"а"),
Ke.has(i)&&p()):(i.endsWith("анин")&&i.length>5||i.endsWith("янин"))&&!r.isAName()||["барин","боярин"].includes(i)?(n.push(T(t,2)+"е"),
"барин"===i&&n.push(T(t,2)+"ы")):["цыган"].includes(i)?n.push(t+"е"):"щенок"===i?(n.push(T(t,2)+"ки"),
n.push(T(t,2)+"ята")):!i.endsWith("ребёнок")&&!i.endsWith("ребенок")||i.endsWith("жеребёнок")||i.endsWith("жеребенок")||i.endsWith("ястребёнок")||i.endsWith("ястребенок")?(i.endsWith("ёнок")||i.endsWith("енок"))&&r.isAnimate()?n.push(T(t,4)+"ята"):i.endsWith("ёночек")&&r.isAnimate()?n.push(T(t,6)+"ятки"):i.endsWith("онок")&&R("жшч",L(i,5))&&r.isAnimate()?n.push(T(t,4)+"ата"):pe(i)?n.push(T(t,2)+"ки"):K(i,te)?j(i,ie)?n.push(T(t,2)+"ьи"):n.push(k(t)+"е"):Le(0,i)?i.endsWith("ый")||i.endsWith("ий")?n.push(k(t)+"е"):i.endsWith("ой")&&!j(i,["хой","ской"])?n.push(T(t,2)+"ые"):n.push(T(t,2)+"ие"):i.endsWith("его")?n.push(T(t,3)+"ие"):["воробей","муравей","ручей","соловей","улей","жеребей","ирей","репей","чирей"].includes(i)?n.push(T(t,2)+"ьи"):p():n.push(T(t,7)+"дети")
}else if(u.NEUTER===l)if(j(i,["ко","чо"])&&!j(i,["войско","облако"]))n.push(k(t)+"и");else if(i.endsWith("имое"))n.push(s+"ые");else if(i.endsWith("ее"))n.push(s+"ие");else if(i.endsWith("ое"))j(c,["г","к","ж","ш","х"])?n.push(s+"ие"):n.push(s+"ые");else if(j(i,["ие","иё"]))n.push(T(t,2)+"ия");else if(j(i,["ье","ьё"])){
var m=T(t,2),A=["безделье","варенье","воскресенье","жалованье","запястье","застолье","затишье","здоровье","зелье","изголовье","новоселье","одночасье","печенье","платье","побережье","поголовье","подворье","подземелье","подполье","поместье","предплечье","раздумье","сиденье","средневековье","увечье","угодье","устье"].includes(i)
;"е"!==x(i)||A||n.push(m+"ия"),n.push(m+"ья")
}else j(i,["дерево","звено","крыло"])?n.push(s+"ья"):j(i,["ле","ре"])?n.push(s+"я"):i.endsWith("судно")&&r.isATransport()?n.push(T(t,2)+"а"):(Array.prototype.push.apply(n,f(function(e){
return e+"а"})),j(i,["щупальце"])&&p());else n.push(s+"и");break;case 2:
"заря"===i?n.push("зори"):i.endsWith("ая")&&!i.endsWith("свая")?R("жхчшщ",x(c))||j(c,["вк","гк","ск","цк","ньк"])?n.push(s+"ие"):n.push(s+"ые"):p()
;break;case 3:
"мя"===U(i,2)?n.push(s+"ена"):Object.keys(Ae).includes(i)?n.push(k(Ae[i])+"и"):u.FEMININE===l?n.push(E+"и"):"и"===x(E)?n.push(E+"я"):n.push(E+"а")
}return Ne(n)}
var er=$(["ли","си","би","ви","ди","ти","пи","ри","ни","фи","зи","ьи","ья","ия","ря","ля","ая","аи","ои","уи","эи","ыи","яи","ёи","юи","еи","ии"]),rr=["беготни","болтовни","будни","вожжи","возни","доли","лапши","левши","люди","марли","моря","мощи","ноздри","пени","пятерни","распри","родни","сакли","сени","ступни","судьи","фигни","чукчи"],nr=["головы","громадины","детины","деревенщины","дохлятины","дубины","ехидины","жадины","зверины","идиотины","кислятины","молодчины","орясины","остолопины","сиротины","скотины","старейшины","старины","старшины","уродины"],tr=$(nr),ir=["адреса","паспорта","поезда","цеха","снега","бункера","буфера","берега","вымпела","голоса","города","директора","договора","доктора","жемчуга","инспектора","инструктора","колокола","кондуктора","короба","корпуса","крейсера","кузова","леса","мастера","номера","облачка","острова","отпуска","паруса","повара","погреба","пояса","провода","прожектора","пропуска","рукава","сахара","свитера","сервера","счета","трактора","тормоза","холода","цвета","черепа","шторма","штуцера","юнкера","ястреба","суда","корм"],ur=$(ir),ar=new Set(ir.concat(["бега","беглецы","близнецы","бойцы","бока","борта","борцы","бруствера","брюшки","веера","века","венцы","верха","веса","весы","вечера","вороха","глупцы","года","гонцы","дворцы","дельцы","детдома","детдомы","дома","жеребцы","жильцы","жрецы","затишки","зубцы","излишки","истцы","катера","концы","корма","кузнецы","купола","купцы","лишки","луга","мертвецы","меха","мудрецы","облака","образа","образцы","огурцы","округа","омута","ордена","ордера","отцы","очки","певцы","песцы","пловцы","подлецы","продавцы","птенцы","резцы","рога","рода","рубцы","самцы","свинцы","сорта","соуса","спецы","стога","столбцы","стрельцы","творцы","тельцы","тенора","терема","тома","тона","торцы","хлеба","штришки","юнцы"])),sr=new Set(["авары","аланы","аршины","баклажаны","буквы","гольфы","граммы","гусары","дела","кадеты","килограммы","омы","помидоры","рентгены","ботинки","человеки","чулки","шорты"]),cr=new Set(["гектары","рельсы"]),fr=new G
;ar.forEach(function(e){return fr.addRaw(q(e))}),sr.forEach(function(e){return fr.addRaw(q(e))}),cr.forEach(function(e){
return fr.addRaw(q(e))})
;var or=new Set(nr.concat(["абазины","авы","аввы","бедняги","бедолаги","болгары","бродяги","брызги","брюки","брюхи","будды","бусы","валенки","веки","вельможи","верзилы","вилы","владыки","воеводы","волосы","вояки","главы","грузины","задворки","задиры","железы","жилы","зануды","зеваки","именины","калеки","кальсоны","каникулы","колготки","коллеги","крохи","курицы","куры","ладоши","ламы","лыки","макароны","мужчины","нападки","нары","непоседы","носилки","ножны","папы","папаши","таты","падлы","партизаны","погоны","поминки","посиделки","похороны","предтечи","работяги","разы","ребятки","румыны","самоубийцы","санки","убийцы","сапоги","сатаны","сироты","сливки","слуги","солдаты","старосты","сумерки","сутки","татары","телеса","хитрюги","четвереньки","шляпы","шмотки","яблоки","дядьки","дяденьки","зайки","кроссовки","малютки","малолетки","попки","турки","узы","хлопоты","шахматы"])),hr=new G
;or.forEach(function(e){return hr.addRaw(q(e))})
;var lr=["х","ых","их","м","ым","им","х","ых","их","ми","ыми","ими","х","ых","их"],dr=["ям","ам","","","ями","ами","ях","ах"],Er=$(["вна","вца","вцы","пла","дца","дра","судна","рки","рцы","тлы","рна","тна","енца","десны","дёсны","рёбра","ребра","сосны"]),Sr=$(["жи","ши","чи","ля","ли","чи","ри","ти","ди","сани","борщи","клещи","товарищи","плащи","прыщи","хрящи"]),vr=$(["братья","брусья","деревья","донья","звенья","клинья","клочья","коленья","колосья","колья","комья","крылья","крючья","листья","лоскутья","лохмотья","перья","платья","поводья","прутья","стулья","сучья","хлопья","шилья"]),pr=$(["ишки","дружки","тки","папочки","дедушки","дядюшки","батюшки","катанки","петрушки","шестерки"]),gr=$(["жки","шки","чки","рки","натки","хатки","ятки","етки","чётки","мки","нки","педки","илки"]),br=$(["шок","щок","жок","зок","аток","яток","еток"])
;function mr(e,r,n,t){var i=Q(t),a=x(i),s=w(a),c=n+1;if(1===c||4===c&&!r.isAnimate())return t
;if(134217984&s)if(2===c||4===c){if(j(i,["овичи","евичи"]))return k(t)+"ей"
;if(j(i,["вны","полусотни"])&&"овны"!==i)return T(t,2)+"ен"}else if(5===c){
if(j(i,["дети","люди"])&&!j(i,["нелюди"]))return k(t)+"ьми";if(j(i,["вери","дочери"]))return[k(t)+"ями",k(t)+"ьми"]}
var f=r.getGender(),o=i.endsWith("цы")?k(t):oe(t,i),h=K(i,Oe)&&(r.isASurname()||f===u.COMMON)&&!K(i,tr),l=3*Math.min(Math.round(lr.length/3-1),c-2)
;if(h||i.endsWith("ничьи"))return t+lr[l];if(i.endsWith("ые"))return T(t,2)+lr[l+1]
;if(i.endsWith("ие")||K(i,ae))return o+lr[l+2];if(c>2&&4!==c){var d=2*Math.min(Math.round(dr.length/2-1),c-3)
;return K(i,er)?k(t)+dr[d]:e.sd.hasStressedEndingPlural(r,n).includes(!0)?M(o)+dr[d+1]:o+dr[d+1]}
var E=r.getDeclension(),S=function(){var u=Q(o),a=["жки","шки","чки","ножны"]
;if(j(u,["кн","кл","дк","нк","пк","зк","рк","тк","вк","лк","мк"])&&!j(i,["сумерки"])||"зл"===u||j(i,a)&&e.sd.hasStressedEndingPlural(r,n).includes(!0)){
var s=x(o);return k(o)+Z("о",s)+s}if(K(i,Er)&&!i.endsWith("недра")||j(i,a)){var c=L(t,2);return T(t,2)+Z("е",c)+c}
if(j(i,["сестры","сёстры","серьги"])){var f=L(t,2);return("ь"===L(i,3)?M(T(t,3)):M(T(t,2)))+Z("ё",f)+f}
if(j(u,["льц","сьм","деньг","ьк","йк","дьб"])){var h=x(o);return T(o,2)+Z("е",h)+h}return j(i,["сла","слы"])?k(o)+"ел":o
};if([3,0].includes(E)){if(i.endsWith("и"))return k(t)+"ей";if(["гроздья"].includes(i))return k(t)+"ев"}var v=L(i,3)
;if(u.FEMININE!==f){var p=q(i),g=fr.hasRaw(p);if(g&&ar.has(i))return k(t)+"ов"
;if(g&&sr.has(i)&&!r.isAName())return[S(),k(t)+"ов"];if(g&&cr.has(i))return[k(t)+"ов",S()]
;if(f===u.COMMON&&!j(i,rr)&&!R("жшч",v)||hr.hasRaw(p)&&or.has(i)||r.isAName()&&f===u.MASCULINE&&r.lower().endsWith("а")||"барин"===r.lower())return S()
;switch(a){case"и":case"я":
if(K(i,Sr)||"щи"===i||rr.includes(i)||r.lower().endsWith("ь")&&!j(r.lower(),["зять","деверь"]))return("ь"===x(k(i))?T(t,2):k(t))+"ей"
;if("и"===a)return i.endsWith("ульи")?k(t)+"ев":i.endsWith("ьи")?u.MASCULINE===f?k(t)+"ёв":T(t,2)+"ей":["ча","кле","холу","ху"].includes(k(i))?k(t)+"ёв":i.endsWith("ищи")?S():i.endsWith("мессии")?k(t)+"й":I(W,L(i,2))?k(t)+"ев":!K(i,gr)||u.MASCULINE===f&&!K(M(i),pr)||K(r.lower(),br)?k(t)+"ов":S()
;if(K(i,vr))return k(t)+"ев";if(j(i,["зятья","кумовья","деверья","края","острия"]))return k(t)+"ёв"
;if(j(i,["ья","ия"]))return u.MASCULINE===f?T(t,2)+"ей":T(t,2)+"ий";break;case"а":
return j(i,["семена","стремена"])?T(t,3)+"ян":i.endsWith("мена")?T(t,3)+"ён":r.lower().endsWith("яйцо")?Z("яиц",k(t)):i.endsWith("нца")?[S(),k(t)+"ев"]:K(i,ur)?k(t)+"ов":S()
;case"ы":return j(i,["ницы","лицы","пицы","бицы"])?k(t):i.endsWith("цы")?k(t)+"ев":k(t)+"ов";default:
if(i.endsWith("не"))return S()}}if(i.endsWith("йки"))return T(t,3)+"ек";if(i.endsWith("ки")){if("ь"===v){var b=x(k(t))
;return T(t,3)+Z("е",b)+b}if(R("жшч",v))return S();if(I(N,v))return T(t,2)+"ок"}if(rr.includes(i))return k(t)+"ей"
;if(j(i,["аи","ои","еи","эи","уи"]))return k(t)+"й";if("свечи"===i)return[k(t),k(t)+"ей"]
;if("пригоршни"===i)return[k(t)+"ей",T(t,2)+"ен"];if("тихони"===i)return[T(t,2)+"нь",k(t)+"ей"]
;if(j(i,["ьи","ии"]))return e.sd.hasStressedEndingSingular(r,n).includes(!0)?T(t,2)+"ей":T(t,2)+"ий"
;if(i.endsWith("ни")&&I(N,L(i,3)))return["барышни","боярышни","деревни"].includes(i)?T(t,2)+"ень":i.endsWith("кухни")?T(t,2)+"онь":"сотни"===i?[T(t,2),T(t,2)+"ен"]:T(t,2)+"ен"
;if(Q(o).endsWith("ийк"))return T(o,2)+"ек";if(o.length===i.length-1&&K(i,er)){if(R("ьй",Q(L(o,2)))&&!r.isAnimate()){
var m=x(o);return T(o,2)+Z("е",m)+m}return j(i,["земли","петли","пли","вли"])?k(o)+"ель":o+"ь"}return S()}
var Ar=function(){return f(function e(){var r,n,t;s(this,e),r=this,n="sd",t=function(){var e,r=new Y;function n(n,t){
var i,u=o(t.split(","));try{for(u.s();!(i=u.n()).done;){var a=i.value;e.text=a,r.put(e,n)}}catch(e){u.e(e)}finally{u.f()
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
n("EEEEEEE-EEEEEE","левша"),r}(),(n=l(n))in r?Object.defineProperty(r,n,{value:t,enumerable:!0,configurable:!0,
writable:!0}):r[n]=t},[{key:"decline",value:function(e,r,n){return yr(this,P.create(e),r,n)}},{key:"pluralize",
value:function(e){var r=P.create(e);return r.isPluraleTantum()?[r.text()]:Ze(this,r)}},{key:"getLocativeForms",
value:function(e){var r=this,n=P.create(e),t=n.getDeclension();if(t&&t>=0){var i=Ce.get(_e(n))
;if(i instanceof Array)return i.map(function(e){return new v(function(e){switch(1+(e>>3&7)){case b.V:return"в"
;case b.VO:return"во";case b.NA:return"на"}}(e),function(e,r,n,t){var i=5;switch(r){case 0:return we(e,n,i);case 1:
return Ve(e,n,t);case 2:return Ie(e,n,i);case 3:return ye(e,n,i)}}(r,t,n,A(e)),e>>6)})}return[]}}])}()
;function yr(e,n,t,i){var u=function(e,n,t,i){var u=n.text(),a=r.indexOf(t);if(n.isIndeclinable())return u
;if(n.isPluraleTantum())return mr(e,n,a,u);if(i)return mr(e,n,a,i);switch(n.getDeclension()){case-1:return u;case 0:
return we(e,n,a);case 1:return Pe(e,n,a);case 2:return Ie(e,n,a);case 3:return ye(e,n,a)}}(e,n,t,i)
;return u instanceof Array?u:[u]}return e.CASES=r,e.Case=n,e.Engine=Ar,e.Gender=u,e.Lemma=P,e.LocativeForm=v,
e.LocativeFormAttribute=p,e.StressDictionary=Y,e.createLemma=function(e){return P.create(e)},
e.createLemmaOrNull=function(e){return P.createOrNull(e)},e}({});
//# sourceMappingURL=RussianNouns.es5.js.map
