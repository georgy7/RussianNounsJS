/*!
  RussianNounsJS v3.0.0-alpha.1
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
function o(e){return 1+(7&e)}function h(e,r){(null==r||r>e.length)&&(r=e.length)
;for(var n=0,t=Array(r);n<r;n++)t[n]=e[n];return t}function l(e,r){
if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function E(e,r){
for(var n=0;n<r.length;n++){var t=r[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),
Object.defineProperty(e,v(t.key),t)}}function d(e,r,n){return r&&E(e.prototype,r),n&&E(e,n),
Object.defineProperty(e,"prototype",{writable:!1}),e}function S(e,r){
var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=A(e))||r){n&&(e=n)
;var t=0,i=function(){};return{s:i,n:function(){return t>=e.length?{done:!0}:{done:!1,value:e[t++]}},e:function(e){
throw e},f:i}}
throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}var u,a=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return a=e.done,e},e:function(e){s=!0,u=e
},f:function(){try{a||null==n.return||n.return()}finally{if(s)throw u}}}}function I(e,r){return function(e){
if(Array.isArray(e))return e}(e)||function(e,r){
var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){
var t,i,u,a,s=[],c=!0,f=!1;try{if(u=(n=n.call(e)).next,0===r);else for(;!(c=(t=u.call(n)).done)&&(s.push(t.value),
s.length!==r);c=!0);}catch(e){f=!0,i=e}finally{try{if(!c&&null!=n.return&&(a=n.return(),Object(a)!==a))return}finally{
if(f)throw i}}return s}}(e,r)||A(e,r)||function(){
throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}()}function v(e){var r=function(e,r){if("object"!=typeof e||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){
var t=n.call(e,r);if("object"!=typeof t)return t;throw new TypeError("@@toPrimitive must return a primitive value.")}
return String(e)}(e,"string");return"symbol"==typeof r?r:r+""}function A(e,r){if(e){if("string"==typeof e)return h(e,r)
;var n={}.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),
"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?h(e,r):void 0}}
function p(e){var r=e.replaceAll("ё","е"),n=r.length%2,t=1,i=5381;function u(){i=(33*i+(255&n))%4294967296,n>>=8,t-=8}
var a,s=S(r);try{for(s.s();!(a=s.n()).done;){var c=a.value.charCodeAt(0)-1072&31;n|=c<<t,(t+=5)>=8&&u()}}catch(e){s.e(e)
}finally{s.f()}t>0&&u();var f=r.charCodeAt(0)%2;return 2*(2147483647&i)+f}function N(e){var r=e.charCodeAt(0)-1072
;return 33===r?32:r===(31&r)?1<<r:0}function O(e,r){return 0!==(e&N(r))}var T=3892855073,g=66567902,C=66567390
;function b(e){return O(T,e)}function m(e){return e.split("").filter(b).length}function y(e){
return e.replaceAll("ё","е").replaceAll("Ё","Е")}function w(e,r){return e.substring(0,e.length-r)}function W(e,r){
return e.substring(e.length-r)}function _(e){return w(e,1)}function U(e){return R(e,1)}function R(e,r){
return e[e.length-r]||""}function L(e,r){return 1===r.length&&e.includes(r)}function M(e,r){return r.some(function(r){
return e.endsWith(r)})}var V=function(){function e(r){l(this,e),r instanceof e?(this._txt=r._txt,this._lc=r._lc,
this._hash=r._hash,this._flags=r._flags):(r.pluraleTantum?this._flags=5:this._flags=1+t.indexOf(r.gender),
this._txt=r.text,this._lc=r.text.toLowerCase(),this._hash=p(this._lc),this._flags|=8*(1&r.indeclinable),
this._flags|=16*(1&r.animate),this._flags|=32*(1&r.surname),this._flags|=64*(1&r.name),this._flags|=128*(1&r.transport),
this._flags|=65536*(2+function(e,r,n,t){if(r)return-2;if(t)return-1;var u=U(e);switch(n){case i.FEMININE:
return"а"===u||"я"===u?2:O(g,u)?-1:3;case i.MASCULINE:return"а"===u||"я"===u?2:"путь"===e?0:1;case i.NEUTER:
return["дитя","полудитя"].includes(e)?0:"мя"===W(e,2)?3:1;case i.COMMON:return"а"===u||"я"===u?2:"и"===u?-1:1;default:
return-2}}(this._lc,r.pluraleTantum,r.gender,r.indeclinable)))}return d(e,[{key:"equals",value:function(r){
return r instanceof e&&this._flags===r._flags&&this.lower()===r.lower()}},{key:"text",value:function(){return this._txt}
},{key:"lower",value:function(){return this._lc}},{key:"isPluraleTantum",value:function(){return 5==(7&this._flags)}},{
key:"getGender",value:function(){var e=7&this._flags;if(e>=1&&e<=4)return t[e-1]}},{key:"isIndeclinable",
value:function(){return!!(8&this._flags)}},{key:"isAnimate",value:function(){
return!!(16&this._flags)||this.isASurname()||this.isAName()}},{key:"isASurname",value:function(){
return!!(32&this._flags)}},{key:"isAName",value:function(){return!!(64&this._flags)}},{key:"isATransport",
value:function(){return!!(128&this._flags)}},{key:"getDeclension",value:function(){return(this._flags>>16)-2}},{
key:"getSchoolDeclension",value:function(){var e=this.getDeclension();return 1===e?2:2===e?1:e}}],[{key:"create",
value:function(e){if(e instanceof this)return e;var r=k(e);if(r)throw new Error(r);return Object.freeze(new this(e))}},{
key:"createOrNull",value:function(e){return null===k(e)?Object.freeze(new this(e)):null}}])}();function P(e,r){
var n=new V(e);return n._txt=r,n._lc=r.toLowerCase(),n._hash=p(n.lower()),Object.freeze(n)}function k(e){
if(null==e)return"No parameters specified."
;for(var r=0,n=["pluraleTantum","indeclinable","animate","surname","name","transport"];r<n.length;r++){var i=n[r]
;if(function(e){return null!=e&&"boolean"!=typeof e}(e[i]))return i+" must be boolean."}
if(null==e.text)return"A cyrillic word required.";if(!e.pluraleTantum){
if(null==e.gender)return"A grammatical gender required.";if(!t.includes(e.gender))return"Bad grammatical gender."}
return null}function x(e){var r,n=new Set,t=0,i=S(e);try{for(i.s();!(r=i.n()).done;){t+=r.value,n.add(t)}}catch(e){
i.e(e)}finally{i.f()}return n}
var F=x([11720389,548,1024,1479,2622,2867,1222,2642,264,1328,137,123,397,65542229,212447047,31729170,8094836,1056,21701789,35520559,40358,21819,28248,119786,63892,31809,7356,74383,72369,5945,28902,90120738,21187517,91925642,3054826,1600765,65934,30948851,5569212,4205640,5412804,6787095,9749916,3940084,1511466,1303038,16090470,1376628,49919694,3827522,37915959,14032615,28701924,224587434,637275762,51079457,391103676,24108070,158999424,232633267,6058815,66599250,692781441,816204112,55209380,72754,90006,80058,45564,67845,42548,27193,21401,139393,750335,170896,4424,1566,6264,154969,17292,17229,175112,83011,117872,4183,13065,108972,108088,343663,66210,334,17090,380271,283272,59007,35796,230801,1067156,19992,157124,12433,252644,2626,23776,630482,531296,304718,90891,726,23116,47653,30493,167310,50156,123071,477118,241821,55660,908992,534269,205157,11218,2490,660,66391,46856,847526,68710,8450,36630,15642,109864,41716,354482,79820,51876,97325,5506,46436,191803,3957,40876,126323,2347821,338490,73216,475569,87602,29642,4220,10760,16896,50156,17424,35178,167244,126786,33643,30488,65045,35961,51453,55660,4,152461,138332,1958,34200,3709,61381,17424,30158,80591,11218,44099,260487]),j=x([11720389,548,1024,1060,4,5904,1848,4404,330555234,4691346,3365076,1045362,7414584,960432,10564312,253286,16178203,4357,4355,11350,31120,5248,40591,62367,54057,50487,13069,3664,39764,10263,3002,5810,8844,24551,4091,56761,21785,30553,55147139,15960625,1933097,12258067,16302047,54210486,45688435,1659767,4813249,33577763,2501798,10056946,672528,14209351,2012340,1655412,4652736,62568,148698,21186,71129124,260014161,108045611,1007583269,2026464,22799532,750068913,1499532,1285428194,74598,22348,6599,132273,309821,156816,397448,179394,148036,100257,21779,11218,36631,345954,50442,104394,2724,112115,30690,10552,31377,11286,7168,14612,51480,116537,192258,163145,65604,97951,1363157,212810,431243,2622,425588,275284,150351,570568,244701,16659,26136,130134,11040,159389,728373,3476,726,1290392,224730,189158,11218,2490,10750,21608,143747,65974,664563,84036,16283,17424,5758,45080,33066,1782,90658,37101,56107,233163,14216,5518,179264,2525,146957,111342,80594,2309,4217,25432,26905,29980,518951,1458289,523705,4202,477865,149368,126310,47828,212678,22744,269176,179119,4399,35997,69696,41777,41,127336,4202,73153,46372,114255,126869,23630,11218]),D=function(){
return d(function e(){l(this,e),this._filter=new Uint8ClampedArray(256)},[{key:"addInteger",value:function(e){
this.addRaw(z(e))}},{key:"hasInteger",value:function(e){return this.hasRaw(z(e))}},{key:"addRaw",value:function(e){
var r=2047&e,n=r>>>3;this._filter[n]=this._filter[n]|1<<7-r%8}},{key:"hasRaw",value:function(e){var r=2047&e
;return!!(this._filter[r>>>3]>>>7-r%8&1)}},{key:"clone",value:function(){return G(this._filter)}}])}();function G(e){
var r=new D;return r._filter=Uint8ClampedArray.from(e),r}function z(e){return e>>>22&2047^e>>>11&2047^2047&e}
function B(e){var r=e.padStart(3,"а");return(7&r.charCodeAt(0))<<8|(15&r.charCodeAt(1))<<4|15&r.charCodeAt(2)}
var H,J=(H=new D,F.forEach(function(e){return H.addInteger(e)}),j.forEach(function(e){return H.addInteger(e)}),
Object.freeze(H));function X(){var e=new Map,n=J.clone(),t=function(e){return 4294967296*(31&e._flags)+e._hash
},u=function(e){return e.lower().indexOf("ё")+1&255},a=function(r){var n=65504&r._flags,i=function(r){
var n=t(r),i=e.get(n);return i instanceof Array?i:[]}(r).filter(function(e){return(e[0]&n)<=n}),a=i.filter(function(e){
return e[0]>>16===u(r)});return a.length?a[0][1]:i.length?i[0][1]:void 0};this.put=function(r,i){
var a=i.split("-"),s=function(e,r){return e.length!==r||e.split("").some(function(e){return!"SsbeE".includes(e)})}
;if(2!==a.length||s(a[0],7)||s(a[1],6))throw new Error("Bad settings format.");var c=V.create(r),f=t(c),o=e.get(f)
;o instanceof Array||(o=[],e.set(f,o));var h=65535&c._flags|u(c)<<16,l=o.find(function(e){return h===e[0]})
;l?l[1]=i:o.push([h,i]),n.addInteger(c._hash)};var s=function(e){switch(e){case"E":return[!0];case"e":return[!0,!1]
;case"b":case"s":return[!1,!0];default:return[!1]}};this.hasStressedEndingSingular=function(e,t){
if(n.hasInteger(e._hash)){var u=r.indexOf(t);if(u>=0){var c=a(e);if(c){var f=c.split("-")[0];return s(f[u])}
if(e.getGender()===i.MASCULINE){if(F.has(e._hash))return s("SEESEEE"[u]);if(j.has(e._hash))return s("SEEEEEE"[u])}}}
return[]},this.hasStressedEndingPlural=function(e,t){if(n.hasInteger(e._hash)){var u=r.indexOf(t);if(u>=0&&u<6){
var c=a(e);if(c){var f=c.split("-")[1];return s(f[u])}
if(e.getGender()===i.MASCULINE&&(F.has(e._hash)||e.isAnimate()&&j.has(e._hash)))return s("E")}}return[]}}function Y(e){
var r,n=new Map,t=S(e);try{for(t.s();!(r=t.n()).done;)for(var i=r.value,u=n,a=i.length-1;a>=0;a--){var s=i.charCodeAt(a)
;if(a>0){var c=u.get(s);if(0===c)break;void 0===c&&u.set(s,new Map),u=u.get(s)}else u.set(s,0)}}catch(e){t.e(e)}finally{
t.f()}return n}function q(e,r){for(var n=r,t=e.length-1;t>=0;t--){var i=e.charCodeAt(t);if(!n.has(i))return!1
;var u=n.get(i);if(0===u)return!0;n=u}}function $(e){for(var r=new Array(e.length),n=0;n<e.length;n++){
var t=e.charCodeAt(n);t>=1040&&t<=1071?t+=32:t>=1024&&t<=1039&&(t+=80),r[n]=t}return String.fromCharCode.apply(null,r)}
function K(e,r){return r===r.toUpperCase()?e.toUpperCase():e}
var Q=Y(["ое","нький","ский","ской","лстой","отой","утой","евой","овой","живой"]),Z=Y(["ее","ое","нький","ский","ской","лстой","отой","утой"]),ee=Y(["евой","овой","отой","живой"]),re=Y(["шний","жний","щий","ший","жий","чий"]),ne=["божий","ажий","яжий","ужий","южий","бульдожий","кабарожий","медвежий","носорожий","миножий"],te=Y(ne),ie=Y(ne.map(function(e){
return w(e,2)+"ьи"
})),ue=new Set(["бубен","бугор","ветер","вошь","вымысел","горшок","деготь","дёготь","дятел","домысел","замысел","кашель","коготь","лапоть","лоб","локоть","ломоть","молебен","мох","ноготь","овен","пепел","пес","пёс","петушок","помысел","порошок","промысел","псалом","пушок","ров","рожь","рот","сон","стебель","стишок","угол","умысел","хребет","церковь","шов","ковер","овес","костер"].map(p)),ae=new D
;ue.forEach(function(e){return ae.addInteger(e)})
;var se=Y(["овёс","ковёр","костёр","шатер","шатёр","козел","козёл","котел","котёл","орел","орёл","осел","осёл","узел","уголь","чок","ешок","хол"])
;function ce(e,r){var n=U(r);if(O(-402111711,n)){if(O(T,R(r,2))){var t=w(e,2);return q(r,te)?t+K("ь",t):t}
if("й"!==n)return _(e)}return e}var fe=["ясень","бюллетень","олень","тюлень","гордень","пельмень","ячмень"]
;function oe(e,r,n){var t,u=e.text(),a=U(r),s=N(a);return-133667019&s&&(-402111711&s?t=function(e,r,n){var t=R(r,2)
;return"ь"===t||"о"===n&&O(2504708,t)?_(e):ce(e,r)}(u,r,a):"к"===a?t=function(e,r,n){
return e.length>=4&&M(r,["рёк","нёк","лёк"])&&!1!==n?w(e,2)+"ьк":r.endsWith("ёк")&&O(T,R(r,3))?w(e,2)+"йк":void 0
}(u,r,n):"ь"===a?t=function(e,r,n){
return ue.has(e._hash)||q(n,se)?w(r,3)+R(r,2):n.endsWith("ень")&&e.getGender()===i.MASCULINE&&!M(n,fe)?w(r,3)+"н":_(r)
}(e,u,r):(["лёд","лед","лён"].includes(r)||"лев"===r&&e.isAnimate())&&(t=w(u,2)+K("ь",R(u,2))+U(u))),
t||(t=function(e,r,n){
return!!(199680&n)&&q(r,se)&&!["новосел","новосёл"].includes(r)||!!(2571270&n)&&(ae.hasInteger(e._hash)&&ue.has(e._hash)||e.isAnimate()&&r.endsWith("посол"))
}(e,r,s)?w(u,2)+U(u):u),t}function he(e,r){var n=_(e),t=_(r.lower());if("а"===U(t))return n
;if(M(t,["зне","жне","гре","спе","мудре"])||W(_(t),3).split("").every(function(e){return O(C,e)})||r.isAName())return n
;if("ле"===W(t,2)){var i=R(t,3);return O(T,i)||"л"===i?_(n)+"ь":n}
return O(T,U(t))&&"и"!==U(t)?O(T,U(_(t)))?w(e,2)+"й":M(r.lower(),["месяц"])?n:w(e,2):n}
var le=Y(["лапоток","желток","нишок","ришок","ишек"]),Ee=["поток","приток","переток","проток","биоток","электроток","восток","водосток","водоток","воток","знаток"],de=["инок","исток","обморок","порок","пророк","сток","урок"]
;function Se(e){
return M(e,["чек","шек"])&&e.length>=6||q(e,le)||e.endsWith("ок")&&!e.endsWith("шок")&&!de.includes(e)&&!M(e,Ee)&&!O(T,R(e,3))&&(O(T,R(e,4))||M(w(e,2),["ст","рт"]))&&e.length>=4
}function Ie(e,r,n){return(e.length?e:[!1]).map(function(e){return n(e?y(r):r,e)})}var ve={"дочь":"дочерь",
"мать":"матерь"};function Ae(e,r,t){var i=r.text(),u=r.lower()
;if(![n.NOMINATIVE,n.ACCUSATIVE].includes(t)&&Object.keys(ve).includes(u))return Ae(e,P(r,ve[u]),t);var a=oe(r,u)
;if(function(e){return e.endsWith("полночь")||e.startsWith("пол")&&O(134217984,U(e))&&m(e)>=2
}(u)&&(a="полу"+a.substring(3)),"мя"===W(u,2))switch(t){case n.NOMINATIVE:case n.ACCUSATIVE:return i;case n.GENITIVE:
case n.DATIVE:case n.PREPOSITIONAL:case n.LOCATIVE:return a+"ени";case n.INSTRUMENTAL:return a+"енем"}else switch(t){
case n.NOMINATIVE:case n.ACCUSATIVE:return i;case n.GENITIVE:case n.DATIVE:case n.PREPOSITIONAL:case n.LOCATIVE:
return a+"и";case n.INSTRUMENTAL:return M(u,["вошь","рожь","церковь"])?i+"ю":a+"ью"}}function pe(e,r,t){
var i=r.text(),u=r.lower();if(u.endsWith("путь"))return t===n.INSTRUMENTAL?_(i)+"ём":Ae(e,r,t)
;if(!u.endsWith("дитя"))throw new Error("unsupported");switch(t){case n.NOMINATIVE:case n.ACCUSATIVE:return i
;case n.GENITIVE:case n.DATIVE:case n.PREPOSITIONAL:case n.LOCATIVE:return i+"ти";case n.INSTRUMENTAL:
return[i+"тей",i+"тею"]}}function Ne(e,r,t){var i=r.text(),u=r.lower(),a=oe(r,u),s=$(a),c=_(i),f=_(u),o=function(){
return"я"===U(u)},h=function(){return u.endsWith("ая")&&!(2===m(u)||O(T,U(s)))},l=function(){
return u.endsWith("яя")&&!(2===m(u)||O(T,U(s)))},E=["жая","шая"];switch(t){case n.NOMINATIVE:return i;case n.GENITIVE:
return l()||M(u,E)?a+"ей":h()?a+"ой":r.isASurname()&&!u.endsWith("да")?c+"ой":u.endsWith("ничья")?c+"ей":o()||O(60818504,U(s))?c+"и":c+"ы"
;case n.DATIVE:
return l()||M(u,E)?a+"ей":h()?a+"ой":r.isASurname()&&!u.endsWith("да")?c+"ой":"ия"===W(u,2)?c+"и":u.endsWith("ничья")?c+"ей":c+"е"
;case n.ACCUSATIVE:return h()?a+"ую":l()?a+"юю":o()?c+"ю":c+"у";case n.INSTRUMENTAL:
return l()||M(u,E)?a+"ею":h()?[a+"ой",a+"ою"]:o()||L("жшчщц",U(s))&&!e.sd.hasStressedEndingSingular(r,t).includes(!0)?"и"===U(f)?c+"ей":[c+"ей",c+"ею"]:[c+"ой",c+"ою"]
;case n.PREPOSITIONAL:case n.LOCATIVE:
return l()||M(u,E)?a+"ей":h()?a+"ой":r.isASurname()&&!u.endsWith("да")?c+"ой":"ия"===W(u,2)?c+"и":u.endsWith("ничья")?c+"ей":c+"е"
}}var Oe=Y(["ов","ев","ёв","ин","ын"]),Te=function(e,r){for(var n=r,t=0;t<e.length;t++){var i=e.charCodeAt(t),u=n
;(n=new Map).set(i,u)}return n}("ы",Oe);function ge(e){return e.filter(function(r,n){return e.indexOf(r)===n})}
function Ce(e){var r=1&e.lower().includes("ё");return 4294967296*((65535&e._flags)<<1|r)+e._hash}
var be=Object.freeze(function(){var e=new Map,r={gender:i.MASCULINE},n={gender:i.MASCULINE,animate:!0}
;function t(r,n,t,i,u){var a,c=i.split(","),o=u instanceof Array?u:[s.U_SUFFIX],h=S(c);try{for(h.s();!(a=h.n()).done;){
var l=a.value;r.text=l;var E=Ce(V.create(r)),d=e.get(E);d||(d=[],e.set(E,d));var I,v=S(t);try{
for(v.s();!(I=v.n()).done;){var A,p=I.value,N=S(o);try{for(N.s();!(A=N.n()).done;){var O=A.value;d.push(f(p,O,n))}
}catch(e){N.e(e)}finally{N.f()}}}catch(e){v.e(e)}finally{v.f()}}}catch(e){h.e(e)}finally{h.f()}}
var u=[c.V],o=[c.VO],h=[c.NA];t(r,a.CONTAINER,u,"мозг,пруд,стог,таз,год"),t(r,a.CONTAINER,o,"рот"),t(r,a.WAY,u,"год"),
t(r,a.CONTAINER,u,"гроб"),t(r,a.CONTAINER|a.RELIGIOUS,o,"гроб",[s.PREPOSITIONAL]),
t(r,a.LOCATION,u,"ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,низ,хлев"),
t(r,a.STRUCTURE,u,"круг,полк,артполк,ряд,род,строй,лад"),t(r,a.SURFACE,h,"баз,берег,бережок,вал,кон,круг,луг,пол,яр"),
t(r,a.WAY,h,"век,день"),t(r,a.WAY,u,"час"),t(r,a.WAY,h,"корень"),t(n,a.OBJECT_WITH_FUNCTIONAL_SURFACE,h,"вор"),
t(r,a.OBJECT_WITH_FUNCTIONAL_SURFACE,h,"повод,бочок,борт,воз,горб,кол,мост,плот,сук,х"+String.fromCharCode(1091)+"й"),
t(r,a.OBJECT_WITH_FUNCTIONAL_SURFACE,h,"крюк,болт",[s.PREPOSITIONAL,s.U_SUFFIX]);var l=",мёд,мех,пар,пух"
;t(r,a.SUBSTANCE,u,"дым,жир,мел,пушок"+l),
t(r,a.RESOURCE,h,"газ,клей,спирт"+l),t(r,a.CONDITION,u,"бой,бред,быт,долг,плен,пыл,сок,ход,лад"),
t(r,a.EXPOSURE,u.concat(h),"вид"),t(r,a.EXPOSURE,h,"слух,счёт,ветер,ветр,свет"),t(r,a.MOTION,h,"ход,бег,вес"),
t(r,a.MOTION|a.WITH_ADJECTIVE,h,"шаг"),t(r,a.EVENT,h,"бал,пир"),t(r,a.CONDITION,h,"дух,плав"),
t(r,a.MOTION|a.WITH_ADJECTIVE,h,"газ"),t(r,a.CONTAINER,u,"глаз,зоб,нос,шкаф"),t(r,a.CONTAINER,o,"лоб"),
t(r,a.OBJECT_WITH_FUNCTIONAL_SURFACE,h,"глаз,лоб,нос,шкаф,холм");var E="бок,верх,зад,угол";return t(r,a.LOCATION,u,E),
t(r,a.OBJECT_WITH_FUNCTIONAL_SURFACE,h,E),t(r,a.LOCATION|a.WITHOUT_ADJECTIVE,u,"край"),
t(r,a.OBJECT_WITH_FUNCTIONAL_SURFACE|a.WITHOUT_ADJECTIVE,h,"край"),t(r,a.SURFACE,h,"лёд,мох,снег"),
t(r,a.SUBSTANCE,o,"лёд,лён,мох"),t(r,a.SUBSTANCE,u,"снег"),e
}()),me=new Set("клей,чай,дом,дух,дым,дымок,газ,год,горошек,жар,жир,квас,пар,пыл,род,рост,сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,табак,творог,толк,торф,туман,убыток,укроп,уксус,ход,цемент,чеснок,шаг,шик,шиповник,шоколад,шорох,шум,яд".split(",")),ye=new D
;me.forEach(function(e){return ye.addInteger(p(e))})
;var we=Y(["й","ие","иё"]),We=Y(["воробей","муравей","ручей","соловей","улей"]),_e=Y(["мой","ной","дой","шой","жой","рзой","осой","хой","латой","витой","литой","питой","житой","отой","утой","ятой","лагой","рагой","огой","угой","лубой","любой","илой","ылой","злой","малой","овой","евой","живой","ской","акой","укой","нний","ский","йкий","цкий","зкий","ткий","лкий","мкий","хкий","оркий","аркий","яркий","ький","ёкий","бокий","оокий","cокий","токий","ликий","дикий","укий","ыкий","який","пкий","дкий","бкий","нкий","жкий","чкий","гкий","овкий","авкий"])
;function Ue(e,r){return"ый"===W(r,2)||(r.endsWith("кривой")||q(r,_e))&&m(r)>=2}
var Re=Y(["ий","ие","чье","тье","дье","вье","бье","жалованье","енье","ружье","божье","верье","мужье"]),Le=Y(["вое","лое","мое","ное","рое","тое","той","ый"])
;function Me(e,r,t){
var u=r.text(),a=$(u),s=U(a),c=r.getGender(),f=e.sd.hasStressedEndingSingular(r,t),h=oe(r,a,f[0]),l=_(u),E=Pe(a)
;E&&(h="полу"+h.substring(3),l="полу"+l.substring(3));var d=$(h),S=function(){return E&&a.endsWith("я")||xe(a)
},I=q(a,we),v=function(){return q(a,We)?_(l)+K("ь",U(l)):l},A=function(){return L("чщ",U(d))};function p(e){
return!r.isAnimate()&&ye.hasInteger(r._hash)&&me.has(a)&&("й"===s?e.push(_(u)+K("ю",U(u))):e=e.concat(Ie(f,h,function(e){
return e+K("у",U(e))}))),e}switch(t){case n.NOMINATIVE:return u;case n.GENITIVE:switch(s){case"и":case"ы":
if(E)return Ve(e,r,t,a);break;case"й":case"е":if(I&&r.isASurname()||Ue(0,a)||q(a,Q))return h+"ого"
;if(q(a,re)||a.endsWith("ее"))return h+"его";case"ё":case"я":case"ь":if(I)return p([v()+"я"]);if(S()&&!A())return h+"я"
;break;case"ц":return he(u,r)+"ца";case"к":if(Se(a))return _(l)+"ка";break;case"о":
if(M(a,["шко"])&&i.MASCULINE===c)return l+"и"}return p(r.isASurname()||-1===d.indexOf("ё")?[h+"а"]:Ie(f,h,function(e){
return e+"а"}));case n.DATIVE:switch(s){case"и":case"ы":if(E)return Ve(e,r,t,a);break;case"й":case"е":
if(I&&r.isASurname()||Ue(0,a)||q(a,Q))return h+"ому";if(q(a,re)||a.endsWith("ее"))return h+"ему";case"ё":case"я":
case"ь":if(I)return v()+"ю";if(S()&&!A())return h+"ю";break;case"ц":return he(u,r)+"цу";case"к":
if(Se(a))return _(l)+"ку"}return r.isASurname()||-1===d.indexOf("ё")?h+"у":Ie(f,h,function(e){return e+"у"})
;case n.ACCUSATIVE:return c===i.NEUTER||L("иы",s)&&E?u:r.isAnimate()?Me(e,r,n.GENITIVE):u;case n.INSTRUMENTAL:switch(s){
case"и":case"ы":if(E)return Ve(e,r,t,a);break;case"й":case"е":case"ё":case"я":case"ь":
if(I&&r.isASurname()||q(a,Z))return q(a,Le)?h+"ым":h+"им";if(Ue(0,a))return"и"===R(a,2)||a.endsWith("хой")?h+"им":h+"ым"
;if(q(a,ee))return h+"ым";if(q(a,re))return h+"им";if(I)return v()+"ем";if(a.endsWith("це"))return u+"м";break;case"ц":
return Ie(f,u,function(e,n){return n?he(e,r)+"цом":he(e,r)+"цем"});case"к":if(Se(a))return _(l)+"ком";break;case"н":
case"в":if(r.isASurname()&&q(a,Oe))return u+"ым"}return S()||L("жшчщ",U(d))?Ie(f,h,function(e,r){return r?e+"ом":e+"ем"
}):r.isASurname()||-1===d.indexOf("ё")?h+"ом":Ie(f,h,function(e){return e+"ом"});case n.LOCATIVE:
if("полпути"===a)return u;var N=be.get(Ce(r));if(N)return ge(N.map(function(e){return o(e)})).map(function(n){
return ke(e,r,n)});case n.PREPOSITIONAL:switch(s){case"и":if("полпути"===a)return u;case"ы":if(E)return Ve(e,r,t,a)
;break;case"й":case"е":case"ё":case"я":case"ь":if(I&&r.isASurname()||Ue(0,a)||q(a,Q))return h+"ом"
;if(q(a,re)||a.endsWith("ее"))return h+"ем";if(M(a,["воробей"])){var O=_(l);return O+K("ье",U(O))}
if(q(a,Re)&&!M(a,["запястье","здоровье","изголовье","платье"]))return l+"и";if("й"===s||"иё"===W(a,2))return v()+"е"
;break;case"ц":return he(u,r)+"це";case"к":if(Se(a))return _(l)+"ке"}
return r.isASurname()||-1===d.indexOf("ё")?h+"е":Ie(f,h,function(e){return e+"е"})}}function Ve(e,r,n,t){
var i=function(){return"полминуты"!==t?"полу"+r.text().substring(3):r.text()}
;return"полпути"===t?pe(e,P(r,_(i())+"ь"),n):t.endsWith("зни")||t.endsWith("сти")?Ae(e,P(r,_(i())+"ь"),n):Ne(e,P(r,_(i())+("ни"===W(t,2)?"я":"а")),n)
}function Pe(e){if(e.startsWith("пол")&&O(2550137089,U(e))&&"л"!==e[3]&&m(e)>=2){
var r=e.substring(3),n=r.search(/[а-яё]/);return n>=0&&O(g,r[n])}return!1}function ke(e,r,t){if(s.U_SUFFIX===t){
var i=r.text(),u=r.lower(),a=oe(r,u),c=_(i),f=Pe(u)&&u.endsWith("я")||xe(u)
;return"й"===U(u)?y(c)+"ю":f?y(a)+"ю":Se(u)?y(_(c))+"ку":y(a)+"у"}if(s.PREPOSITIONAL===t)return Me(e,r,n.PREPOSITIONAL)}
function xe(e){return"ь"===U(e)&&!e.endsWith("господь")||L("её",U(e))&&!M(e,["це","же"])}
var Fe,je=new D,De=Object.freeze([[[i.MASCULINE,void 0],{"болгарин":["болгары"],"господин":["господа"],
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
"ремесло":["ремёсла"],"седло":["сёдла"],"село":["сёла"]}]]),Ge=S(De);try{for(Ge.s();!(Fe=Ge.n()).done;){var ze=Fe.value
;Object.keys(ze[1]).map(function(e){return je.addInteger(p(e))})}}catch(e){Ge.e(e)}finally{Ge.f()}
var Be=["зять","деверь","друг","брат","собрат","стул","брус","обод","полоз","струп","подмастерье","якорь","перо","шило"],He=new Set(["берег","бок","борт","век","вес","веер","вексель","вечер","глаз","голос","город","доктор","дом","детдом","егерь","жемчуг","катер","колокол","концлагерь","корм","короб","кузов","купол","лес","луг","мастер","номер","пояс","провод","рог","сахар","снег","сорт","стог","счет","счёт","спецсчет","спецсчёт","субсчет","субсчёт","терем","том","холод","цвет","череп"]),Je=Y(["округ","остров","отпуск","паспорт","парус","поезд","повар","погреб","рукав","цех","юнкер"]),Xe=new Set(["адрес","договор","буфер","ворох","директор","инспектор","инструктор","корпус","крейсер","орден","ордер","прожектор","пропуск","род","свитер","сервер","тенор","тон","трактор","тормоз","ветер","верх","китель","мех","хлеб","юнкер","ястреб"]),Ye=new Set(["бункер","вымпел","год","образ","омут","токарь","тополь","шторм","штуцер"])
;function qe(e,r){var t=[],u=r.text(),a=$(u),s=e.sd.hasStressedEndingPlural(r,n.NOMINATIVE);Object.freeze(s)
;var c=oe(r,a,s[0]),f=$(c);if(a.endsWith("яя"))return t.push(w(u,2)+"ие"),ge(t);var o=function(t){
var i=e.sd.hasStressedEndingPlural(r,n.NOMINATIVE).map(function(e){return!e});return i.length?i.map(function(e){
return e?1===f.replace(/[^её]/g,"").length?t(function(e){
var r=Math.max(e.toLowerCase().lastIndexOf("е"),e.toLowerCase().lastIndexOf("ё")),n=K("ё",e[r])
;return e.substring(0,r)+n+e.substring(r+1)}(c)):t(c):t(y(c))}):[t(c)]
},h=r.getGender(),l=r.getDeclension(),E=("й"===U(a)||O(T,U(a)))&&O(T,U(_(a)))?_(u):c,d=function(){
return(a.endsWith("евич")||a.endsWith("евна"))&&a.indexOf("ье")>=0};function v(){
var e=E,r=$(e).indexOf("ье"),n=K("и",e[r]);return e.substring(0,r)+n+e.substring(r+1)}function A(){
O(60818504,U(f))||L("яйь",U(a))||M(a,["сосед"])?d()?(t.push(v()+"и"),
t.push(E+"и")):Array.prototype.push.apply(t,Ie(s,E,function(e){return e+"и"
})):"ц"===U(a)?t.push(he(u,r)+"цы"):d()?(t.push(v()+"ы"),t.push(E+"ы")):Array.prototype.push.apply(t,Ie(s,E,function(e){
return e+"ы"}))}var p=function(e,r){if(je.hasInteger(e._hash)){var n,t=e.getGender(),i=e.isAnimate(),u=S(De);try{
for(u.s();!(n=u.n()).done;){var a=I(n.value,2),s=a[0],c=a[1],f=s[0],o=s[1]
;if(t===f&&(null==o||o===i)&&c.hasOwnProperty(r))return c[r].slice()}}catch(e){u.e(e)}finally{u.f()}}}(r,a)
;if(p)return p;var N="ь"===U(f)?c:"к"===U(f)?_(c)+"чь":"г"===U(f)?_(c)+"зь":"й"===U(a)?_(u):M(a,["рь","ль"])?c:c+"ь"
;switch(l){case-1:t.push(u);break;case 0:if("путь"===a)t.push("пути");else{
if(!a.endsWith("дитя"))throw new Error("unsupported");t.push(w(u,3)+"ети")}break;case 1:
if(Be.includes(a))t.push(N+"я");else if(i.MASCULINE===h){"сын"===a?(t.push("сыновья"),
A()):"человек"===a?(t.push("люди"),
A()):["крюк","лист","лоскут","повод","прут","сук","учитель","флигель","штабель"].includes(a)||"соболь"===a&&r.isAnimate()?(A(),
t.push(N+"я")):["клин","колос","ком","край","соболь"].includes(a)?t.push(N+"я"):He.has(a)||q(a,Je)||Xe.has(a)||Ye.has(a)?(Ye.has(a)&&A(),
xe(a)?Array.prototype.push.apply(t,o(function(e){return e+"я"})):s.includes(!0)?t.push(y(c)+"а"):t.push(c+"а"),
Xe.has(a)&&A()):(a.endsWith("анин")&&a.length>5||a.endsWith("янин"))&&!r.isAName()||["барин","боярин"].includes(a)?(t.push(w(u,2)+"е"),
"барин"===a&&t.push(w(u,2)+"ы")):["цыган"].includes(a)?t.push(u+"е"):"щенок"===a?(t.push(w(u,2)+"ки"),
t.push(w(u,2)+"ята")):!a.endsWith("ребёнок")&&!a.endsWith("ребенок")||a.endsWith("жеребёнок")||a.endsWith("жеребенок")||a.endsWith("ястребёнок")||a.endsWith("ястребенок")?(a.endsWith("ёнок")||a.endsWith("енок"))&&r.isAnimate()?t.push(w(u,4)+"ята"):a.endsWith("ёночек")&&r.isAnimate()?t.push(w(u,6)+"ятки"):a.endsWith("онок")&&L("жшч",R(a,5))&&r.isAnimate()?t.push(w(u,4)+"ата"):Se(a)?t.push(w(u,2)+"ки"):q(a,re)?M(a,ne)?t.push(w(u,2)+"ьи"):t.push(_(u)+"е"):Ue(0,a)?a.endsWith("ый")||a.endsWith("ий")?t.push(_(u)+"е"):a.endsWith("ой")&&!M(a,["хой","ской"])?t.push(w(u,2)+"ые"):t.push(w(u,2)+"ие"):a.endsWith("его")?t.push(w(u,3)+"ие"):["воробей","муравей","ручей","соловей","улей","жеребей","ирей","репей","чирей"].includes(a)?t.push(w(u,2)+"ьи"):A():t.push(w(u,7)+"дети")
}else if(i.NEUTER===h)if(M(a,["ко","чо"])&&!M(a,["войско","облако"]))t.push(_(u)+"и");else if(a.endsWith("имое"))t.push(c+"ые");else if(a.endsWith("ее"))t.push(c+"ие");else if(a.endsWith("ое"))M(f,["г","к","ж","ш","х"])?t.push(c+"ие"):t.push(c+"ые");else if(M(a,["ие","иё"]))t.push(w(u,2)+"ия");else if(M(a,["ье","ьё"])){
var g=w(u,2),C=["безделье","варенье","воскресенье","жалованье","запястье","застолье","затишье","здоровье","зелье","изголовье","новоселье","одночасье","печенье","платье","побережье","поголовье","подворье","подземелье","подполье","поместье","предплечье","раздумье","сиденье","средневековье","увечье","угодье","устье"].includes(a)
;"е"!==U(a)||C||t.push(g+"ия"),t.push(g+"ья")
}else M(a,["дерево","звено","крыло"])?t.push(c+"ья"):M(a,["ле","ре"])?t.push(c+"я"):a.endsWith("судно")&&r.isATransport()?t.push(w(u,2)+"а"):(Array.prototype.push.apply(t,o(function(e){
return e+"а"})),M(a,["щупальце"])&&A());else t.push(c+"и");break;case 2:
"заря"===a?t.push("зори"):a.endsWith("ая")&&!a.endsWith("свая")?L("жхчшщ",U(f))||M(f,["вк","гк","ск","цк","ньк"])?t.push(c+"ие"):t.push(c+"ые"):A()
;break;case 3:
"мя"===W(a,2)?t.push(c+"ена"):Object.keys(ve).includes(a)?t.push(_(ve[a])+"и"):i.FEMININE===h?t.push(E+"и"):"и"===U(E)?t.push(E+"я"):t.push(E+"а")
}return ge(t)}
var $e=Y(["ли","си","би","ви","ди","ти","пи","ри","ни","фи","зи","ьи","ья","ия","ря","ля","ая","аи","ои","уи","эи","ыи","яи","ёи","юи","еи","ии"]),Ke=["беготни","болтовни","будни","вожжи","возни","доли","лапши","левши","люди","марли","моря","мощи","ноздри","пени","пятерни","распри","родни","сакли","сени","ступни","судьи","фигни","чукчи"],Qe=["головы","громадины","детины","деревенщины","дохлятины","дубины","ехидины","жадины","зверины","идиотины","кислятины","молодчины","орясины","остолопины","сиротины","скотины","старейшины","старины","старшины","уродины"],Ze=Y(Qe),er=["адреса","паспорта","поезда","цеха","снега","бункера","буфера","берега","вымпела","голоса","города","директора","договора","доктора","жемчуга","инспектора","инструктора","колокола","кондуктора","короба","корпуса","крейсера","кузова","леса","мастера","номера","облачка","острова","отпуска","паруса","повара","погреба","пояса","провода","прожектора","пропуска","рукава","сахара","свитера","сервера","счета","трактора","тормоза","холода","цвета","черепа","шторма","штуцера","юнкера","ястреба","суда","корм"],rr=Y(er),nr=new Set(er.concat(["бега","беглецы","близнецы","бойцы","бока","борта","борцы","бруствера","брюшки","веера","века","венцы","верха","веса","весы","вечера","вороха","глупцы","года","гонцы","дворцы","дельцы","детдома","детдомы","дома","жеребцы","жильцы","жрецы","затишки","зубцы","излишки","истцы","катера","концы","корма","кузнецы","купола","купцы","лишки","луга","мертвецы","меха","мудрецы","облака","образа","образцы","огурцы","округа","омута","ордена","ордера","отцы","очки","певцы","песцы","пловцы","подлецы","продавцы","птенцы","резцы","рога","рода","рубцы","самцы","свинцы","сорта","соуса","спецы","стога","столбцы","стрельцы","творцы","тельцы","тенора","терема","тома","тона","торцы","хлеба","штришки","юнцы"])),tr=new Set(["авары","аланы","аршины","баклажаны","буквы","гольфы","граммы","гусары","дела","кадеты","килограммы","омы","помидоры","рентгены","ботинки","человеки","чулки","шорты"]),ir=new Set(["гектары","рельсы"]),ur=new D
;nr.forEach(function(e){return ur.addRaw(B(e))}),tr.forEach(function(e){return ur.addRaw(B(e))}),ir.forEach(function(e){
return ur.addRaw(B(e))})
;var ar=new Set(Qe.concat(["абазины","авы","аввы","бедняги","бедолаги","болгары","бродяги","брызги","брюки","брюхи","будды","бусы","валенки","веки","вельможи","верзилы","вилы","владыки","воеводы","волосы","вояки","главы","грузины","задворки","задиры","железы","жилы","зануды","зеваки","именины","калеки","кальсоны","каникулы","колготки","коллеги","крохи","курицы","куры","ладоши","ламы","лыки","макароны","мужчины","нападки","нары","непоседы","носилки","ножны","папы","папаши","таты","падлы","партизаны","погоны","поминки","посиделки","похороны","предтечи","работяги","разы","ребятки","румыны","самоубийцы","санки","убийцы","сапоги","сатаны","сироты","сливки","слуги","солдаты","старосты","сумерки","сутки","татары","телеса","хитрюги","четвереньки","шляпы","шмотки","яблоки","дядьки","дяденьки","зайки","кроссовки","малютки","малолетки","попки","турки","узы","хлопоты","шахматы"])),sr=new D
;ar.forEach(function(e){return sr.addRaw(B(e))})
;var cr=["х","ых","их","м","ым","им","х","ых","их","ми","ыми","ими","х","ых","их"],fr=["ям","ам","","","ями","ами","ях","ах"],or=Y(["вна","вца","вцы","пла","дца","дра","судна","рки","рцы","тлы","рна","тна","енца","десны","дёсны","рёбра","ребра","сосны"]),hr=Y(["жи","ши","чи","ля","ли","чи","ри","ти","ди","сани","борщи","клещи","товарищи","плащи","прыщи","хрящи"]),lr=Y(["братья","брусья","деревья","донья","звенья","клинья","клочья","коленья","колосья","колья","комья","крылья","крючья","листья","лоскутья","лохмотья","перья","платья","поводья","прутья","стулья","сучья","хлопья","шилья"]),Er=Y(["ишки","дружки","тки","папочки","дедушки","дядюшки","батюшки","катанки","петрушки","шестерки"]),dr=Y(["жки","шки","чки","рки","натки","хатки","ятки","етки","чётки","мки","нки","педки","илки"]),Sr=Y(["шок","щок","жок","зок","аток","яток","еток"])
;function Ir(e,n,t,u){var a=$(u),s=U(a),c=N(s),f=r.indexOf(t)+1;if(1===f||4===f&&!n.isAnimate())return u
;if(134217984&c)if(2===f||4===f){if(M(a,["овичи","евичи"]))return _(u)+"ей"
;if(M(a,["вны","полусотни"])&&"овны"!==a)return w(u,2)+"ен"}else if(5===f){
if(M(a,["дети","люди"])&&!M(a,["нелюди"]))return _(u)+"ьми";if(M(a,["вери","дочери"]))return[_(u)+"ями",_(u)+"ьми"]}
var o=n.getGender(),h=a.endsWith("цы")?_(u):ce(u,a),l=q(a,Te)&&(n.isASurname()||o===i.COMMON)&&!q(a,Ze),E=3*Math.min(Math.round(cr.length/3-1),f-2)
;if(l||a.endsWith("ничьи"))return u+cr[E];if(a.endsWith("ые"))return w(u,2)+cr[E+1]
;if(a.endsWith("ие")||q(a,ie))return h+cr[E+2];if(f>2&&4!==f){var d=2*Math.min(Math.round(fr.length/2-1),f-3)
;return q(a,$e)?_(u)+fr[d]:e.sd.hasStressedEndingPlural(n,t).includes(!0)?y(h)+fr[d+1]:h+fr[d+1]}
var S=n.getDeclension(),I=function(){var r=$(h),i=["жки","шки","чки","ножны"]
;if(M(r,["кн","кл","дк","нк","пк","зк","рк","тк","вк","лк","мк"])&&!M(a,["сумерки"])||"зл"===r||M(a,i)&&e.sd.hasStressedEndingPlural(n,t).includes(!0)){
var s=U(h);return _(h)+K("о",s)+s}if(q(a,or)&&!a.endsWith("недра")||M(a,i)){var c=R(u,2);return w(u,2)+K("е",c)+c}
if(M(a,["сестры","сёстры","серьги"])){var f=R(u,2);return("ь"===R(a,3)?y(w(u,3)):y(w(u,2)))+K("ё",f)+f}
if(M(r,["льц","сьм","деньг","ьк","йк","дьб"])){var o=U(h);return w(h,2)+K("е",o)+o}return M(a,["сла","слы"])?_(h)+"ел":h
};if([3,0].includes(S)){if(a.endsWith("и"))return _(u)+"ей";if(["гроздья"].includes(a))return _(u)+"ев"}var v=R(a,3)
;if(i.FEMININE!==o){var A=B(a),p=ur.hasRaw(A);if(p&&nr.has(a))return _(u)+"ов"
;if(p&&tr.has(a)&&!n.isAName())return[I(),_(u)+"ов"];if(p&&ir.has(a))return[_(u)+"ов",I()]
;if(o===i.COMMON&&!M(a,Ke)&&!L("жшч",v)||sr.hasRaw(A)&&ar.has(a)||n.isAName()&&o===i.MASCULINE&&n.lower().endsWith("а")||"барин"===n.lower())return I()
;switch(s){case"и":case"я":
if(q(a,hr)||"щи"===a||Ke.includes(a)||n.lower().endsWith("ь")&&!M(n.lower(),["зять","деверь"]))return("ь"===U(_(a))?w(u,2):_(u))+"ей"
;if("и"===s)return a.endsWith("ульи")?_(u)+"ев":a.endsWith("ьи")?i.MASCULINE===o?_(u)+"ёв":w(u,2)+"ей":["ча","кле","холу","ху"].includes(_(a))?_(u)+"ёв":a.endsWith("ищи")?I():a.endsWith("мессии")?_(u)+"й":O(T,R(a,2))?_(u)+"ев":!q(a,dr)||i.MASCULINE===o&&!q(y(a),Er)||q(n.lower(),Sr)?_(u)+"ов":I()
;if(q(a,lr))return _(u)+"ев";if(M(a,["зятья","кумовья","деверья","края","острия"]))return _(u)+"ёв"
;if(M(a,["ья","ия"]))return i.MASCULINE===o?w(u,2)+"ей":w(u,2)+"ий";break;case"а":
return M(a,["семена","стремена"])?w(u,3)+"ян":a.endsWith("мена")?w(u,3)+"ён":n.lower().endsWith("яйцо")?K("яиц",_(u)):a.endsWith("нца")?[I(),_(u)+"ев"]:q(a,rr)?_(u)+"ов":I()
;case"ы":return M(a,["ницы","лицы","пицы","бицы"])?_(u):a.endsWith("цы")?_(u)+"ев":_(u)+"ов";default:
if(a.endsWith("не"))return I()}}if(a.endsWith("йки"))return w(u,3)+"ек";if(a.endsWith("ки")){if("ь"===v){var g=U(_(u))
;return w(u,3)+K("е",g)+g}if(L("жшч",v))return I();if(O(C,v))return w(u,2)+"ок"}if(Ke.includes(a))return _(u)+"ей"
;if(M(a,["аи","ои","еи","эи","уи"]))return _(u)+"й";if("свечи"===a)return[_(u),_(u)+"ей"]
;if("пригоршни"===a)return[_(u)+"ей",w(u,2)+"ен"];if("тихони"===a)return[w(u,2)+"нь",_(u)+"ей"]
;if(M(a,["ьи","ии"]))return e.sd.hasStressedEndingSingular(n,t).includes(!0)?w(u,2)+"ей":w(u,2)+"ий"
;if(a.endsWith("ни")&&O(C,R(a,3)))return["барышни","боярышни","деревни"].includes(a)?w(u,2)+"ень":a.endsWith("кухни")?w(u,2)+"онь":"сотни"===a?[w(u,2),w(u,2)+"ен"]:w(u,2)+"ен"
;if($(h).endsWith("ийк"))return w(h,2)+"ек";if(h.length===a.length-1&&q(a,$e)){if(L("ьй",$(R(h,2)))&&!n.isAnimate()){
var b=U(h);return w(h,2)+K("е",b)+b}return M(a,["земли","петли","пли","вли"])?_(h)+"ель":h+"ь"}return I()}
var vr=function(){return d(function e(){var r,n,t;l(this,e),r=this,n="sd",t=function(){var e,r=new X;function n(n,t){
var i,u=S(t.split(","));try{for(u.s();!(i=u.n()).done;){var a=i.value;e.text=a,r.put(e,n)}}catch(e){u.e(e)}finally{u.f()
}}return e={pluraleTantum:!0},n("SSSSSSS-SSSSSS","ножны"),e={gender:i.MASCULINE},
n("SSSSSSS-SSSSSS","брёх,дёрн,идиш,имидж,мед,упрёк"),
n("SSSSSSS-EEEEEE","адрес,век,вечер,город,детдом,поезд,спецсчёт,субсчёт"),
n("SSSSSSE-EEEEEE","берег,бок,вес,лес,снег,дом,катер,счёт,мёд"),n("SSSSSSS-bbbbbb","вексель,ветер"),
n("SSSSSSE-ESEEEE","глаз"),n("SSSSSSE-bEEbEE","год"),n("SSSSSSb-bbbbbb","цех"),n("SbbSbbb-bbbbbb","грош,шприц"),
n("SssSsss-ssssss","кишмиш,кряж,слеш,слэш"),n("SEESeEE-EEEEEE","стеллаж"),n("SeeSeee-eeeeee","шиномонтаж"),e={
gender:i.MASCULINE,animate:!0},n("Sssssss-ssssss","паныч"),n("SSSSSSS-SSSSSS","балансёр,шофёр"),e={gender:i.NEUTER},
n("EEEEEEE-SsESEE","плечо"),
n("EEEEEEE-SSSSSS","тесло,стекло,автостекло,бронестекло,оргстекло,пеностекло,смарт-стекло,спецстекло,бедро,берцо,блесна,чело,стегно,стебло"),
e={gender:i.FEMININE},n("EEEbEEE-SSESEE","щека"),n("EEEEEEE-SSESEE","слеза"),n("EEEEEEE-SESSSS","семья,макросемья"),
n("EEEEEEE-SEESEE","вожжа,свеча"),n("EEESEEE-SSSSSS","душа"),n("EEEEEEE-eEeeee","скамья"),
n("EEEEEEE-EEEEEE","башка,кишка,ладья,лапша,моча,пыльца,статья"),e={gender:i.FEMININE,animate:!0},
n("EEEEEEE-SESESS","свинья,овца"),e={gender:i.COMMON,animate:!0},n("EEEEEEE-SSSSSS","судья"),
n("EEEEEEE-EEEEEE","левша"),r}(),(n=v(n))in r?Object.defineProperty(r,n,{value:t,enumerable:!0,configurable:!0,
writable:!0}):r[n]=t},[{key:"decline",value:function(e,r,n){return Ar(this,V.create(e),r,n)}},{key:"pluralize",
value:function(e){var r=V.create(e);return r.isPluraleTantum()?[r.text()]:qe(this,r)}},{key:"getLocativeForms",
value:function(e){var r=this,n=V.create(e),t=n.getDeclension();if(t&&t>=0){var i=be.get(Ce(n))
;if(i instanceof Array)return i.map(function(e){return new u(function(e){switch(1+(e>>3&7)){case c.V:return"в"
;case c.VO:return"во";case c.NA:return"на"}}(e),function(e,r,n,t){switch(r){case 0:return pe(e,n,Case.PREPOSITIONAL)
;case 1:return ke(e,n,t);case 2:return Ne(e,n,Case.PREPOSITIONAL);case 3:return Ae(e,n,Case.PREPOSITIONAL)}
}(r,t,n,o(e)),e>>6)})}return[]}}])}();function Ar(e,r,n,t){var i=function(e,r,n,t){var i=r.text()
;if(r.isIndeclinable())return i;if(r.isPluraleTantum())return Ir(e,r,n,i);if(t)return Ir(e,r,n,t)
;switch(r.getDeclension()){case-1:return i;case 0:return pe(e,r,n);case 1:return Me(e,r,n);case 2:return Ne(e,r,n)
;case 3:return Ae(e,r,n)}}(e,r,n,t);return i instanceof Array?i:[i]}return e.CASES=r,e.Case=n,e.Engine=vr,e.Gender=i,
e.Lemma=V,e.LocativeForm=u,e.LocativeFormAttribute=a,e.StressDictionary=X,e.createLemma=function(e){return V.create(e)},
e.createLemmaOrNull=function(e){return V.createOrNull(e)},e}({});
//# sourceMappingURL=RussianNouns.es5.js.map
