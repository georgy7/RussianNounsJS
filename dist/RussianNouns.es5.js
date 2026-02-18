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
function p(e){var r=e.replaceAll("ё","е"),n=r.length%2,t=1,i=5381;function u(){i=(33*i+(255&n))%4294967296,n>>=8,t-=8}
var a,s=S(r);try{for(s.s();!(a=s.n()).done;){var c=a.value.charCodeAt(0)-1072&31;n|=c<<t,(t+=5)>=8&&u()}}catch(e){s.e(e)
}finally{s.f()}t>0&&u();var f=r.charCodeAt(0)%2;return 2*(2147483647&i)+f}function O(e){
for(var r=new Array(e.length),n=0;n<e.length;n++){var t=e.charCodeAt(n)
;t>=1040&&t<=1071?t+=32:t>=1024&&t<=1039&&(t+=80),r[n]=t}return String.fromCharCode.apply(null,r)}function N(e){
var r=e.charCodeAt(0)-1072;return 33===r?32:r===(31&r)?1<<r:0}function T(e,r){return 0!==(e&N(r))}
var g=3892855073,b=66567902;function C(e){return T(g,O(e))}function m(e,r){return r===r.toUpperCase()?e.toUpperCase():e}
function y(e){return e.split("").filter(C).length}function w(e){return e.replaceAll("ё","е").replaceAll("Ё","Е")}
function W(e,r){return e.substring(0,e.length-r)}function _(e,r){return e.substring(e.length-r)}function U(e){
return W(e,1)}function L(e){return _(e,1)}function R(e,r){var n=e.length-r-1;return e.substring(n,n+1)}function M(e,r){
return r.some(function(r){return e.endsWith(r)})}function V(e,r,n){return(e.length?e:[!1]).map(function(e){
return n(e?w(r):r,e)})}var P=function(){function e(r){h(this,e),r instanceof e?(this._txt=r._txt,this._lc=r._lc,
this._hash=r._hash,this._flags=r._flags):(r.pluraleTantum?this._flags=5:this._flags=1+t.indexOf(r.gender),
this._txt=r.text,this._lc=r.text.toLowerCase(),this._hash=p(this._lc),this._flags|=8*(1&r.indeclinable),
this._flags|=16*(1&r.animate),this._flags|=32*(1&r.surname),this._flags|=64*(1&r.name),this._flags|=128*(1&r.transport),
this._flags|=65536*(2+function(e,r,n,t){if(r)return-2;if(t)return-1;var u=L(e);switch(n){case i.FEMININE:
return"а"===u||"я"===u?2:T(b,u)?-1:3;case i.MASCULINE:return"а"===u||"я"===u?2:"путь"===e?0:1;case i.NEUTER:
return["дитя","полудитя"].includes(e)?0:"мя"===_(e,2)?3:1;case i.COMMON:return"а"===u||"я"===u?2:"и"===u?-1:1;default:
return-2}}(this._lc,r.pluraleTantum,r.gender,r.indeclinable)))}return d(e,[{key:"equals",value:function(r){
return r instanceof e&&this._flags===r._flags&&this.lower()===r.lower()}},{key:"text",value:function(){return this._txt}
},{key:"lower",value:function(){return this._lc}},{key:"isPluraleTantum",value:function(){return 5==(7&this._flags)}},{
key:"getGender",value:function(){var e=7&this._flags;if(e>=1&&e<=4)return t[e-1]}},{key:"isIndeclinable",
value:function(){return!!(8&this._flags)}},{key:"isAnimate",value:function(){
return!!(16&this._flags)||this.isASurname()||this.isAName()}},{key:"isASurname",value:function(){
return!!(32&this._flags)}},{key:"isAName",value:function(){return!!(64&this._flags)}},{key:"isATransport",
value:function(){return!!(128&this._flags)}},{key:"getDeclension",value:function(){return(this._flags>>16)-2}},{
key:"getSchoolDeclension",value:function(){var e=this.getDeclension();return 1===e?2:2===e?1:e}}],[{key:"create",
value:function(e){if(e instanceof this)return e;var r=x(e);if(r)throw new Error(r);return Object.freeze(new this(e))}},{
key:"createOrNull",value:function(e){return null===x(e)?Object.freeze(new this(e)):null}}])}();function k(e,r){
var n=new P(e);return n._txt=r,n._lc=r.toLowerCase(),n._hash=p(n.lower()),Object.freeze(n)}function x(e){
if(null==e)return"No parameters specified."
;for(var r=0,n=["pluraleTantum","indeclinable","animate","surname","name","transport"];r<n.length;r++){var i=n[r]
;if(function(e){return null!=e&&"boolean"!=typeof e}(e[i]))return i+" must be boolean."}
if(null==e.text)return"A cyrillic word required.";if(!e.pluraleTantum){
if(null==e.gender)return"A grammatical gender required.";if(!t.includes(e.gender))return"Bad grammatical gender."}
return null}function j(e){var r,n=new Set,t=0,i=S(e);try{for(i.s();!(r=i.n()).done;){t+=r.value,n.add(t)}}catch(e){
i.e(e)}finally{i.f()}return n}
var F=j([11720389,548,1024,1479,2622,2867,1222,2642,264,1328,137,123,397,65542229,212447047,31729170,8094836,1056,21701789,35520559,40358,21819,28248,119786,63892,31809,7356,74383,72369,5945,28902,90120738,21187517,91925642,3054826,1600765,65934,30948851,5569212,4205640,5412804,6787095,9749916,3940084,1511466,1303038,16090470,1376628,49919694,3827522,37915959,14032615,28701924,224587434,637275762,51079457,391103676,24108070,158999424,232633267,6058815,66599250,692781441,816204112,55209380,72754,90006,80058,45564,67845,42548,27193,21401,139393,750335,170896,4424,1566,6264,154969,17292,17229,175112,83011,117872,4183,13065,108972,108088,343663,66210,334,17090,380271,283272,59007,35796,230801,1067156,19992,157124,12433,252644,2626,23776,630482,531296,304718,90891,726,23116,47653,30493,167310,50156,123071,477118,241821,55660,908992,534269,205157,11218,2490,660,66391,46856,847526,68710,8450,36630,15642,109864,41716,354482,79820,51876,97325,5506,46436,191803,3957,40876,126323,2347821,338490,73216,475569,87602,29642,4220,10760,16896,50156,17424,35178,167244,126786,33643,30488,65045,35961,51453,55660,4,152461,138332,1958,34200,3709,61381,17424,30158,80591,11218,44099,260487]),z=j([11720389,548,1024,1060,4,5904,1848,4404,330555234,4691346,3365076,1045362,7414584,960432,10564312,253286,16178203,4357,4355,11350,31120,5248,40591,62367,54057,50487,13069,3664,39764,10263,3002,5810,8844,24551,4091,56761,21785,30553,55147139,15960625,1933097,12258067,16302047,54210486,45688435,1659767,4813249,33577763,2501798,10056946,672528,14209351,2012340,1655412,4652736,62568,148698,21186,71129124,260014161,108045611,1007583269,2026464,22799532,750068913,1499532,1285428194,74598,22348,6599,132273,309821,156816,397448,179394,148036,100257,21779,11218,36631,345954,50442,104394,2724,112115,30690,10552,31377,11286,7168,14612,51480,116537,192258,163145,65604,97951,1363157,212810,431243,2622,425588,275284,150351,570568,244701,16659,26136,130134,11040,159389,728373,3476,726,1290392,224730,189158,11218,2490,10750,21608,143747,65974,664563,84036,16283,17424,5758,45080,33066,1782,90658,37101,56107,233163,14216,5518,179264,2525,146957,111342,80594,2309,4217,25432,26905,29980,518951,1458289,523705,4202,477865,149368,126310,47828,212678,22744,269176,179119,4399,35997,69696,41777,41,127336,4202,73153,46372,114255,126869,23630,11218]),D=function(){
return d(function e(){h(this,e),this._filter=new Uint8ClampedArray(256)},[{key:"addInteger",value:function(e){
this.addRaw(J(e))}},{key:"hasInteger",value:function(e){return this.hasRaw(J(e))}},{key:"addRaw",value:function(e){
var r=2047&e,n=r>>>3;this._filter[n]=this._filter[n]|1<<7-r%8}},{key:"hasRaw",value:function(e){var r=2047&e
;return!!(this._filter[r>>>3]>>>7-r%8&1)}},{key:"clone",value:function(){return G(this._filter)}}])}();function G(e){
var r=new D;return r._filter=Uint8ClampedArray.from(e),r}function J(e){return e>>>22&2047^e>>>11&2047^2047&e}
function B(e){var r=e.padStart(3,"а");return(7&r.charCodeAt(0))<<8|(15&r.charCodeAt(1))<<4|15&r.charCodeAt(2)}
var H,X=(H=new D,F.forEach(function(e){return H.addInteger(e)}),z.forEach(function(e){return H.addInteger(e)}),
Object.freeze(H));function Y(){var e=new Map,n=X.clone(),t=function(e){return 4294967296*(31&e._flags)+e._hash
},u=function(e){return e.lower().indexOf("ё")+1&255},a=function(r){var n=65504&r._flags,i=function(r){
var n=t(r),i=e.get(n);return i instanceof Array?i:[]}(r).filter(function(e){return(e[0]&n)<=n}),a=i.filter(function(e){
return e[0]>>16===u(r)});return a.length?a[0][1]:i.length?i[0][1]:void 0};this.put=function(r,i){
var a=i.split("-"),s=function(e,r){return e.length!==r||e.split("").some(function(e){return!"SsbeE".includes(e)})}
;if(2!==a.length||s(a[0],7)||s(a[1],6))throw new Error("Bad settings format.");var c=P.create(r),f=t(c),o=e.get(f)
;o instanceof Array||(o=[],e.set(f,o));var l=65535&c._flags|u(c)<<16,h=o.find(function(e){return l===e[0]})
;h?h[1]=i:o.push([l,i]),n.addInteger(c._hash)};var s=function(e){switch(e){case"E":return[!0];case"e":return[!0,!1]
;case"b":case"s":return[!1,!0];default:return[!1]}};this.hasStressedEndingSingular=function(e,t){
if(n.hasInteger(e._hash)){var u=r.indexOf(t);if(u>=0){var c=a(e);if(c){var f=c.split("-")[0];return s(f[u])}
if(e.getGender()===i.MASCULINE){if(F.has(e._hash))return s("SEESEEE"[u]);if(z.has(e._hash))return s("SEEEEEE"[u])}}}
return[]},this.hasStressedEndingPlural=function(e,t){if(n.hasInteger(e._hash)){var u=r.indexOf(t);if(u>=0&&u<6){
var c=a(e);if(c){var f=c.split("-")[1];return s(f[u])}
if(e.getGender()===i.MASCULINE&&(F.has(e._hash)||e.isAnimate()&&z.has(e._hash)))return s("E")}}return[]}}function q(e){
var r,n=new Map,t=S(e);try{for(t.s();!(r=t.n()).done;)for(var i=r.value,u=n,a=i.length-1;a>=0;a--){var s=i.charCodeAt(a)
;if(a>0){var c=u.get(s);if(0===c)break;void 0===c&&u.set(s,new Map),u=u.get(s)}else u.set(s,0)}}catch(e){t.e(e)}finally{
t.f()}return n}function $(e,r){for(var n=r,t=e.length-1;t>=0;t--){var i=e.charCodeAt(t);if(!n.has(i))return!1
;var u=n.get(i);if(0===u)return!0;n=u}}
var K=q(["ое","нький","ский","ской","лстой","отой","утой","евой","овой","живой"]),Q=q(["ее","ое","нький","ский","ской","лстой","отой","утой"]),Z=q(["евой","овой","отой","живой"]),ee=q(["шний","жний","щий","ший","жий","чий"]),re=["божий","ажий","яжий","ужий","южий","бульдожий","кабарожий","медвежий","носорожий","миножий"],ne=q(re),te=q(re.map(function(e){
return W(e,2)+"ьи"
})),ie=new Set(["бубен","бугор","ветер","вошь","вымысел","горшок","деготь","дёготь","дятел","домысел","замысел","кашель","коготь","лапоть","лоб","локоть","ломоть","молебен","мох","ноготь","овен","пепел","пес","пёс","петушок","помысел","порошок","промысел","псалом","пушок","ров","рожь","рот","сон","стебель","стишок","угол","умысел","хребет","церковь","шов","ковер","овес","костер"].map(p)),ue=new D
;ie.forEach(function(e){return ue.addInteger(e)})
;var ae=q(["овёс","ковёр","костёр","шатер","шатёр","козел","козёл","котел","котёл","орел","орёл","осел","осёл","узел","уголь","чок","ешок","хол"])
;function se(e,r){var n=L(r);if(T(-402111711,n)){if(T(g,R(r,1))){var t=W(e,2);return $(r,ne)?t+m("ь",t):t}
if("й"!==n)return U(e)}return e}var ce=["ясень","бюллетень","олень","тюлень","гордень","пельмень","ячмень"]
;function fe(e,r,n){var t,u=e.text(),a=L(r),s=N(a);return-133667019&s&&(-402111711&s?t=function(e,r,n){var t=R(r,1)
;return"ь"===t||"о"===n&&T(2504708,t)?U(e):se(e,r)}(u,r,a):"к"===a?t=function(e,r,n){
return e.length>=4&&M(r,["рёк","нёк","лёк"])&&!1!==n?W(e,2)+"ьк":r.endsWith("ёк")&&T(g,R(r,2))?W(e,2)+"йк":void 0
}(u,r,n):"ь"===a?t=function(e,r,n){
return ie.has(e._hash)||$(n,ae)?W(r,3)+R(r,1):n.endsWith("ень")&&e.getGender()===i.MASCULINE&&!M(n,ce)?W(r,3)+"н":U(r)
}(e,u,r):(["лёд","лед","лён"].includes(r)||"лев"===r&&e.isAnimate())&&(t=W(u,2)+m("ь",R(u,1))+L(u))),
t||(t=function(e,r,n){
return!!(199680&n)&&$(r,ae)&&!["новосел","новосёл"].includes(r)||!!(2571270&n)&&(ue.hasInteger(e._hash)&&ie.has(e._hash)||e.isAnimate()&&r.endsWith("посол"))
}(e,r,s)?W(u,2)+L(u):u),t}function oe(e,r){var n=U(e),t=U(r.lower());if("а"===L(t))return n
;if(M(t,["зне","жне","гре","спе","мудре"])||_(U(t),3).split("").every(function(e){return T(66567390,e)
})||r.isAName())return n;if("ле"===_(t,2)){var i=R(t,2);return T(g,i)||"л"===i?U(n)+"ь":n}
return T(g,L(t))&&"и"!==L(t)?T(g,L(U(t)))?W(e,2)+"й":M(r.lower(),["месяц"])?n:W(e,2):n}
var le=q(["лапоток","желток","нишок","ришок","ишек"]),he=["поток","приток","переток","проток","биоток","электроток","восток","водосток","водоток","воток","знаток"],Ee=["инок","исток","обморок","порок","пророк","сток","урок"]
;function de(e){
return M(e,["чек","шек"])&&e.length>=6||$(e,le)||e.endsWith("ок")&&!e.endsWith("шок")&&!Ee.includes(e)&&!M(e,he)&&!T(g,R(e,2))&&(T(g,R(e,3))||M(W(e,2),["ст","рт"]))&&e.length>=4
}var Se={"дочь":"дочерь","мать":"матерь"};function ve(e,r,t){var i=r.text(),u=r.lower()
;if(![n.NOMINATIVE,n.ACCUSATIVE].includes(t)&&Object.keys(Se).includes(u))return ve(e,k(r,Se[u]),t);var a=fe(r,u)
;if(function(e){return e.endsWith("полночь")||e.startsWith("пол")&&T(134217984,L(e))&&vowelCount(e)>=2
}(u)&&(a="полу"+a.substring(3)),"мя"===_(u,2))switch(t){case n.NOMINATIVE:case n.ACCUSATIVE:return i;case n.GENITIVE:
case n.DATIVE:case n.PREPOSITIONAL:case n.LOCATIVE:return a+"ени";case n.INSTRUMENTAL:return a+"енем"}else switch(t){
case n.NOMINATIVE:case n.ACCUSATIVE:return i;case n.GENITIVE:case n.DATIVE:case n.PREPOSITIONAL:case n.LOCATIVE:
return a+"и";case n.INSTRUMENTAL:return M(u,["вошь","рожь","церковь"])?i+"ю":a+"ью"}}function Ie(e,r,t){
var i=r.text(),u=r.lower();if(u.endsWith("путь"))return t===n.INSTRUMENTAL?U(i)+"ём":ve(e,r,t)
;if(!u.endsWith("дитя"))throw new Error("unsupported");switch(t){case n.NOMINATIVE:case n.ACCUSATIVE:return i
;case n.GENITIVE:case n.DATIVE:case n.PREPOSITIONAL:case n.LOCATIVE:return i+"ти";case n.INSTRUMENTAL:
return[i+"тей",i+"тею"]}}function Ae(e){return e.filter(function(r,n){return e.indexOf(r)===n})}function pe(e){
var r=1&e.lower().includes("ё");return 4294967296*((65535&e._flags)<<1|r)+e._hash}var Oe=Object.freeze(function(){
var e=new Map,r=Object.freeze({gender:i.MASCULINE}),n=Object.freeze({gender:i.MASCULINE,animate:!0})
;function t(r,n,t,i,u){var a,c=i.split(","),o=u instanceof Array?u:[s.U_SUFFIX],l=S(c);try{for(l.s();!(a=l.n()).done;){
var h=a.value,E=Object.assign({},r);E.text=h;var d=pe(P.create(E)),v=e.get(d);v||(v=[],e.set(d,v));var I,A=S(t);try{
for(A.s();!(I=A.n()).done;){var p,O=I.value,N=S(o);try{for(N.s();!(p=N.n()).done;){var T=p.value;v.push(f(O,T,n))}
}catch(e){N.e(e)}finally{N.f()}}}catch(e){A.e(e)}finally{A.f()}}}catch(e){l.e(e)}finally{l.f()}}
var u=Object.freeze([c.V]),o=Object.freeze([c.VO]),l=Object.freeze([c.NA]);t(r,a.CONTAINER,u,"мозг,пруд,стог,таз,год"),
t(r,a.CONTAINER,o,"рот"),
t(r,a.WAY,u,"год"),t(r,a.CONTAINER,u,"гроб"),t(r,a.CONTAINER|a.RELIGIOUS,o,"гроб",[s.PREPOSITIONAL]),
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
}()),Ne=new Set("клей,чай,дом,дух,дым,дымок,газ,год,горошек,жар,жир,квас,пар,пыл,род,рост,сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,табак,творог,толк,торф,туман,убыток,укроп,уксус,ход,цемент,чеснок,шаг,шик,шиповник,шоколад,шорох,шум,яд".split(",")),Te=new D
;Ne.forEach(function(e){return Te.addInteger(p(e))})
;var ge=q(["й","ие","иё"]),be=q(["воробей","муравей","ручей","соловей","улей"]),Ce=q(["мой","ной","дой","шой","жой","рзой","осой","хой","латой","витой","литой","питой","житой","отой","утой","ятой","лагой","рагой","огой","угой","лубой","любой","илой","ылой","злой","малой","овой","евой","живой","ской","акой","укой","нний","ский","йкий","цкий","зкий","ткий","лкий","мкий","хкий","оркий","аркий","яркий","ький","ёкий","бокий","оокий","cокий","токий","ликий","дикий","укий","ыкий","який","пкий","дкий","бкий","нкий","жкий","чкий","гкий","овкий","авкий"])
;function me(e,r){return"ый"===_(r,2)||(r.endsWith("кривой")||$(r,Ce))&&y(r)>=2}
var ye=q(["ий","ие","чье","тье","дье","вье","бье","жалованье","енье","ружье","божье","верье","мужье"]),we=q(["вое","лое","мое","ное","рое","тое","той","ый"])
;function We(e,r,t){
var u=r.text(),a=O(u),s=L(a),c=r.getGender(),f=e.sd.hasStressedEndingSingular(r,t),l=fe(r,a,f[0]),h=U(u),E=Ue(a)
;E&&(l="полу"+l.substring(3),h="полу"+h.substring(3));var d=O(l),S=function(){return E&&a.endsWith("я")||Re(a)
},v=$(a,ge),I=function(){return $(a,be)?U(h)+m("ь",L(h)):h},A=function(){return"чщ".includes(L(d))};function p(e){
return!r.isAnimate()&&Te.hasInteger(r._hash)&&Ne.has(a)&&("й"===s?e.push(U(u)+m("ю",L(u))):e=e.concat(V(f,l,function(e){
return e+m("у",L(e))}))),e}switch(t){case n.NOMINATIVE:return u;case n.GENITIVE:switch(s){case"и":case"ы":
if(E)return _e(e,r,t,a);break;case"й":case"е":if(v&&r.isASurname()||me(0,a)||$(a,K))return l+"ого"
;if($(a,ee)||a.endsWith("ее"))return l+"его";case"ё":case"я":case"ь":if(v)return p([I()+"я"]);if(S()&&!A())return l+"я"
;break;case"ц":return oe(u,r)+"ца";case"к":if(de(a))return U(h)+"ка";break;case"о":
if(M(a,["шко"])&&i.MASCULINE===c)return h+"и"}return p(r.isASurname()||-1===d.indexOf("ё")?[l+"а"]:V(f,l,function(e){
return e+"а"}));case n.DATIVE:switch(s){case"и":case"ы":if(E)return _e(e,r,t,a);break;case"й":case"е":
if(v&&r.isASurname()||me(0,a)||$(a,K))return l+"ому";if($(a,ee)||a.endsWith("ее"))return l+"ему";case"ё":case"я":
case"ь":if(v)return I()+"ю";if(S()&&!A())return l+"ю";break;case"ц":return oe(u,r)+"цу";case"к":
if(de(a))return U(h)+"ку"}return r.isASurname()||-1===d.indexOf("ё")?l+"у":V(f,l,function(e){return e+"у"})
;case n.ACCUSATIVE:return c===i.NEUTER||"иы".includes(s)&&E?u:r.isAnimate()?We(e,r,n.GENITIVE):u;case n.INSTRUMENTAL:
switch(s){case"и":case"ы":if(E)return _e(e,r,t,a);break;case"й":case"е":case"ё":case"я":case"ь":
if(v&&r.isASurname()||$(a,Q))return $(a,we)?l+"ым":l+"им";if(me(0,a))return"и"===R(a,1)||a.endsWith("хой")?l+"им":l+"ым"
;if($(a,Z))return l+"ым";if($(a,ee))return l+"им";if(v)return I()+"ем";if(a.endsWith("це"))return u+"м";break;case"ц":
return V(f,u,function(e,n){return n?oe(e,r)+"цом":oe(e,r)+"цем"});case"к":if(de(a))return U(h)+"ком";break;case"н":
case"в":if(r.isASurname()&&$(a,surnameType1))return u+"ым"}return S()||"жшчщ".includes(L(d))?V(f,l,function(e,r){
return r?e+"ом":e+"ем"}):r.isASurname()||-1===d.indexOf("ё")?l+"ом":V(f,l,function(e){return e+"ом"});case n.LOCATIVE:
if("полпути"===a)return u;var N=Oe.get(pe(r));if(N)return Ae(N.map(function(e){return o(e)})).map(function(n){
return Le(e,r,n)});case n.PREPOSITIONAL:switch(s){case"и":if("полпути"===a)return u;case"ы":if(E)return _e(e,r,t,a)
;break;case"й":case"е":case"ё":case"я":case"ь":if(v&&r.isASurname()||me(0,a)||$(a,K))return l+"ом"
;if($(a,ee)||a.endsWith("ее"))return l+"ем";if(M(a,["воробей"])){var T=U(h);return T+m("ье",L(T))}
if($(a,ye)&&!M(a,["запястье","здоровье","изголовье","платье"]))return h+"и";if("й"===s||"иё"===_(a,2))return I()+"е"
;break;case"ц":return oe(u,r)+"це";case"к":if(de(a))return U(h)+"ке"}
return r.isASurname()||-1===d.indexOf("ё")?l+"е":V(f,l,function(e){return e+"е"})}}function _e(e,r,n,t){
var i=function(){return"полминуты"!==t?"полу"+r.text().substring(3):r.text()};if("полпути"===t){var u=k(r,U(i())+"ь")
;return decline0(e,u,n)}if(t.endsWith("зни")||t.endsWith("сти")){var a=k(r,U(i())+"ь");return decline3(e,a,n)}
var s=k(r,U(i())+("ни"===_(t,2)?"я":"а"));return decline2(e,s,n)}function Ue(e){
if(e.startsWith("пол")&&T(2550137089,L(e))&&"л"!==e[3]&&y(e)>=2){var r=e.substring(3),n=r.search(/[а-яё]/)
;return n>=0&&T(consonants,r[n])}return!1}function Le(e,r,t){if(s.U_SUFFIX===t){
var i=r.text(),u=r.lower(),a=fe(r,u),c=U(i),f=Ue(u)&&u.endsWith("я")||Re(u)
;return"й"===L(u)?w(c)+"ю":f?w(a)+"ю":de(u)?w(U(c))+"ку":w(a)+"у"}if(s.PREPOSITIONAL===t)return We(e,r,n.PREPOSITIONAL)}
function Re(e){return"ь"===L(e)&&!e.endsWith("господь")||"её".includes(L(e))&&!M(e,["це","же"])}function Me(e,r,t){
var i=r.text(),u=r.lower(),a=fe(r,u),s=O(a),c=U(i),f=U(u),o=function(){return"я"===L(u)},l=function(){
return u.endsWith("ая")&&!(2===y(i)||T(g,L(s)))},h=function(){return u.endsWith("яя")&&!(2===y(i)||T(g,L(s)))
},E=["жая","шая"];switch(t){case n.NOMINATIVE:return i;case n.GENITIVE:
return h()||M(u,E)?a+"ей":l()?a+"ой":r.isASurname()&&!u.endsWith("да")?c+"ой":u.endsWith("ничья")?c+"ей":o()||T(60818504,L(s))?c+"и":c+"ы"
;case n.DATIVE:
return h()||M(u,E)?a+"ей":l()?a+"ой":r.isASurname()&&!u.endsWith("да")?c+"ой":"ия"===_(u,2)?c+"и":u.endsWith("ничья")?c+"ей":c+"е"
;case n.ACCUSATIVE:return l()?a+"ую":h()?a+"юю":o()?c+"ю":c+"у";case n.INSTRUMENTAL:
return h()||M(u,E)?a+"ею":l()?[a+"ой",a+"ою"]:o()||"жшчщц".includes(L(s))&&!e.sd.hasStressedEndingSingular(r,t).includes(!0)?"и"===L(f)?c+"ей":[c+"ей",c+"ею"]:[c+"ой",c+"ою"]
;case n.PREPOSITIONAL:case n.LOCATIVE:
return h()||M(u,E)?a+"ей":l()?a+"ой":r.isASurname()&&!u.endsWith("да")?c+"ой":"ия"===_(u,2)?c+"и":u.endsWith("ничья")?c+"ей":c+"е"
}}var Ve,Pe=new D,ke=Object.freeze([[[i.MASCULINE,void 0],{"болгарин":["болгары"],"господин":["господа"],
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
"ремесло":["ремёсла"],"седло":["сёдла"],"село":["сёла"]}]]),xe=S(ke);try{for(xe.s();!(Ve=xe.n()).done;){var je=Ve.value
;Object.keys(je[1]).map(function(e){return Pe.addInteger(p(e))})}}catch(e){xe.e(e)}finally{xe.f()}
var Fe=["зять","деверь","друг","брат","собрат","стул","брус","обод","полоз","струп","подмастерье","якорь","перо","шило"],ze=new Set(["берег","бок","борт","век","вес","веер","вексель","вечер","глаз","голос","город","доктор","дом","детдом","егерь","жемчуг","катер","колокол","концлагерь","корм","короб","кузов","купол","лес","луг","мастер","номер","пояс","провод","рог","сахар","снег","сорт","стог","счет","счёт","спецсчет","спецсчёт","субсчет","субсчёт","терем","том","холод","цвет","череп"]),De=q(["округ","остров","отпуск","паспорт","парус","поезд","повар","погреб","рукав","цех","юнкер"]),Ge=new Set(["адрес","договор","буфер","ворох","директор","инспектор","инструктор","корпус","крейсер","орден","ордер","прожектор","пропуск","род","свитер","сервер","тенор","тон","трактор","тормоз","ветер","верх","китель","мех","хлеб","юнкер","ястреб"]),Je=new Set(["бункер","вымпел","год","образ","омут","токарь","тополь","шторм","штуцер"])
;function Be(e,r){var t=[],u=r.text(),a=O(u),s=e.sd.hasStressedEndingPlural(r,n.NOMINATIVE);Object.freeze(s)
;var c=fe(r,a,s[0]),f=O(c);if(a.endsWith("яя"))return t.push(W(u,2)+"ие"),Ae(t);var o=function(t){
var i=e.sd.hasStressedEndingPlural(r,n.NOMINATIVE).map(function(e){return!e});return i.length?i.map(function(e){
return e?1===f.replace(/[^её]/g,"").length?t(function(e){
var r=Math.max(e.toLowerCase().lastIndexOf("е"),e.toLowerCase().lastIndexOf("ё")),n=upperLike("ё",e[r])
;return e.substring(0,r)+n+e.substring(r+1)}(c)):t(c):t(w(c))}):[t(c)]
},l=r.getGender(),h=r.getDeclension(),E=("й"===L(a)||T(g,L(a)))&&T(g,L(U(a)))?U(u):c,d=function(){
return(a.endsWith("евич")||a.endsWith("евна"))&&a.indexOf("ье")>=0};function I(){
var e=E,r=O(e).indexOf("ье"),n=upperLike("и",e[r]);return e.substring(0,r)+n+e.substring(r+1)}function A(){
T(60818504,L(f))||"яйь".includes(L(a))||M(a,["сосед"])?d()?(t.push(I()+"и"),
t.push(E+"и")):Array.prototype.push.apply(t,V(s,E,function(e){return e+"и"
})):"ц"===L(a)?t.push(oe(u,r)+"цы"):d()?(t.push(I()+"ы"),t.push(E+"ы")):Array.prototype.push.apply(t,V(s,E,function(e){
return e+"ы"}))}if(Pe.hasInteger(r._hash)){var p,N=S(ke);try{for(N.s();!(p=N.n()).done;){
var b=v(p.value,2),C=b[0],m=b[1],y=C[0],R=C[1];if(l===y&&(null==R||R===r.isAnimate())&&m.hasOwnProperty(a)){
var P,k=S(m[a]);try{for(k.s();!(P=k.n()).done;){var x=P.value;t.push(x)}}catch(e){k.e(e)}finally{k.f()}return Ae(t)}}
}catch(e){N.e(e)}finally{N.f()}}
var j="ь"===L(f)?c:"к"===L(f)?U(c)+"чь":"г"===L(f)?U(c)+"зь":"й"===L(a)?U(u):M(a,["рь","ль"])?c:c+"ь";switch(h){case-1:
t.push(u);break;case 0:if("путь"===a)t.push("пути");else{if(!a.endsWith("дитя"))throw new Error("unsupported")
;t.push(W(u,3)+"ети")}break;case 1:if(Fe.includes(a))t.push(j+"я");else if(i.MASCULINE===l){
"сын"===a?(t.push("сыновья"),
A()):"человек"===a?(t.push("люди"),A()):["крюк","лист","лоскут","повод","прут","сук","учитель","флигель","штабель"].includes(a)||"соболь"===a&&r.isAnimate()?(A(),
t.push(j+"я")):["клин","колос","ком","край","соболь"].includes(a)?t.push(j+"я"):ze.has(a)||$(a,De)||Ge.has(a)||Je.has(a)?(Je.has(a)&&A(),
Re(a)?Array.prototype.push.apply(t,o(function(e){return e+"я"})):s.includes(!0)?t.push(w(c)+"а"):t.push(c+"а"),
Ge.has(a)&&A()):(a.endsWith("анин")&&a.length>5||a.endsWith("янин"))&&!r.isAName()||["барин","боярин"].includes(a)?(t.push(W(u,2)+"е"),
"барин"===a&&t.push(W(u,2)+"ы")):["цыган"].includes(a)?t.push(u+"е"):"щенок"===a?(t.push(W(u,2)+"ки"),
t.push(W(u,2)+"ята")):!a.endsWith("ребёнок")&&!a.endsWith("ребенок")||a.endsWith("жеребёнок")||a.endsWith("жеребенок")||a.endsWith("ястребёнок")||a.endsWith("ястребенок")?(a.endsWith("ёнок")||a.endsWith("енок"))&&r.isAnimate()?t.push(W(u,4)+"ята"):a.endsWith("ёночек")&&r.isAnimate()?t.push(W(u,6)+"ятки"):a.endsWith("онок")&&"жшч".includes(lastOfNInitial(a,4))&&r.isAnimate()?t.push(W(u,4)+"ата"):de(a)?t.push(W(u,2)+"ки"):$(a,ee)?M(a,re)?t.push(W(u,2)+"ьи"):t.push(U(u)+"е"):me(0,a)?a.endsWith("ый")||a.endsWith("ий")?t.push(U(u)+"е"):a.endsWith("ой")&&!M(a,["хой","ской"])?t.push(W(u,2)+"ые"):t.push(W(u,2)+"ие"):a.endsWith("его")?t.push(W(u,3)+"ие"):["воробей","муравей","ручей","соловей","улей","жеребей","ирей","репей","чирей"].includes(a)?t.push(W(u,2)+"ьи"):A():t.push(W(u,7)+"дети")
}else if(i.NEUTER===l)if(M(a,["ко","чо"])&&!M(a,["войско","облако"]))t.push(U(u)+"и");else if(a.endsWith("имое"))t.push(c+"ые");else if(a.endsWith("ее"))t.push(c+"ие");else if(a.endsWith("ое"))M(f,["г","к","ж","ш","х"])?t.push(c+"ие"):t.push(c+"ые");else if(M(a,["ие","иё"]))t.push(W(u,2)+"ия");else if(M(a,["ье","ьё"])){
var F=W(u,2),z=["безделье","варенье","воскресенье","жалованье","запястье","застолье","затишье","здоровье","зелье","изголовье","новоселье","одночасье","печенье","платье","побережье","поголовье","подворье","подземелье","подполье","поместье","предплечье","раздумье","сиденье","средневековье","увечье","угодье","устье"].includes(a)
;"е"!==L(a)||z||t.push(F+"ия"),t.push(F+"ья")
}else M(a,["дерево","звено","крыло"])?t.push(c+"ья"):M(a,["ле","ре"])?t.push(c+"я"):a.endsWith("судно")&&r.isATransport()?t.push(W(u,2)+"а"):(Array.prototype.push.apply(t,o(function(e){
return e+"а"})),M(a,["щупальце"])&&A());else t.push(c+"и");break;case 2:
"заря"===a?t.push("зори"):a.endsWith("ая")&&!a.endsWith("свая")?"жхчшщ".includes(L(f))||M(f,["вк","гк","ск","цк","ньк"])?t.push(c+"ие"):t.push(c+"ые"):A()
;break;case 3:
"мя"===_(a,2)?t.push(c+"ена"):Object.keys(Se).includes(a)?t.push(U(Se[a])+"и"):i.FEMININE===l?t.push(E+"и"):"и"===L(E)?t.push(E+"я"):t.push(E+"а")
}return Ae(t)}var He=function(e,r){for(var n=r,t=0;t<e.length;t++){var i=e.charCodeAt(t),u=n;(n=new Map).set(i,u)}
return n
}("ы",q(["ов","ев","ёв","ин","ын"])),Xe=q(["ли","си","би","ви","ди","ти","пи","ри","ни","фи","зи","ьи","ья","ия","ря","ля","ая","аи","ои","уи","эи","ыи","яи","ёи","юи","еи","ии"]),Ye=["беготни","болтовни","будни","вожжи","возни","доли","лапши","левши","люди","марли","моря","мощи","ноздри","пени","пятерни","распри","родни","сакли","сени","ступни","судьи","фигни","чукчи"],qe=["головы","громадины","детины","деревенщины","дохлятины","дубины","ехидины","жадины","зверины","идиотины","кислятины","молодчины","орясины","остолопины","сиротины","скотины","старейшины","старины","старшины","уродины"],$e=q(qe),Ke=["адреса","паспорта","поезда","цеха","снега","бункера","буфера","берега","вымпела","голоса","города","директора","договора","доктора","жемчуга","инспектора","инструктора","колокола","кондуктора","короба","корпуса","крейсера","кузова","леса","мастера","номера","облачка","острова","отпуска","паруса","повара","погреба","пояса","провода","прожектора","пропуска","рукава","сахара","свитера","сервера","счета","трактора","тормоза","холода","цвета","черепа","шторма","штуцера","юнкера","ястреба","суда","корм"],Qe=q(Ke),Ze=new Set(Ke.concat(["бега","беглецы","близнецы","бойцы","бока","борта","борцы","бруствера","брюшки","веера","века","венцы","верха","веса","весы","вечера","вороха","глупцы","года","гонцы","дворцы","дельцы","детдома","детдомы","дома","жеребцы","жильцы","жрецы","затишки","зубцы","излишки","истцы","катера","концы","корма","кузнецы","купола","купцы","лишки","луга","мертвецы","меха","мудрецы","облака","образа","образцы","огурцы","округа","омута","ордена","ордера","отцы","очки","певцы","песцы","пловцы","подлецы","продавцы","птенцы","резцы","рога","рода","рубцы","самцы","свинцы","сорта","соуса","спецы","стога","столбцы","стрельцы","творцы","тельцы","тенора","терема","тома","тона","торцы","хлеба","штришки","юнцы"])),er=new Set(["авары","аланы","аршины","баклажаны","буквы","гольфы","граммы","гусары","дела","кадеты","килограммы","омы","помидоры","рентгены","ботинки","человеки","чулки","шорты"]),rr=new Set(["гектары","рельсы"]),nr=new D
;Ze.forEach(function(e){return nr.addRaw(B(e))}),er.forEach(function(e){return nr.addRaw(B(e))}),rr.forEach(function(e){
return nr.addRaw(B(e))})
;var tr=new Set(qe.concat(["абазины","авы","аввы","бедняги","бедолаги","болгары","бродяги","брызги","брюки","брюхи","будды","бусы","валенки","веки","вельможи","верзилы","вилы","владыки","воеводы","волосы","вояки","главы","грузины","задворки","задиры","железы","жилы","зануды","зеваки","именины","калеки","кальсоны","каникулы","колготки","коллеги","крохи","курицы","куры","ладоши","ламы","лыки","макароны","мужчины","нападки","нары","непоседы","носилки","ножны","папы","папаши","таты","падлы","партизаны","погоны","поминки","посиделки","похороны","предтечи","работяги","разы","ребятки","румыны","самоубийцы","санки","убийцы","сапоги","сатаны","сироты","сливки","слуги","солдаты","старосты","сумерки","сутки","татары","телеса","хитрюги","четвереньки","шляпы","шмотки","яблоки","дядьки","дяденьки","зайки","кроссовки","малютки","малолетки","попки","турки","узы","хлопоты","шахматы"])),ir=new D
;tr.forEach(function(e){return ir.addRaw(B(e))})
;var ur=["х","ых","их","м","ым","им","х","ых","их","ми","ыми","ими","х","ых","их"],ar=["ям","ам","","","ями","ами","ях","ах"],sr=q(["вна","вца","вцы","пла","дца","дра","судна","рки","рцы","тлы","рна","тна","енца","десны","дёсны","рёбра","ребра","сосны"]),cr=q(["жи","ши","чи","ля","ли","чи","ри","ти","ди","сани","борщи","клещи","товарищи","плащи","прыщи","хрящи"]),fr=q(["братья","брусья","деревья","донья","звенья","клинья","клочья","коленья","колосья","колья","комья","крылья","крючья","листья","лоскутья","лохмотья","перья","платья","поводья","прутья","стулья","сучья","хлопья","шилья"]),or=q(["ишки","дружки","тки","папочки","дедушки","дядюшки","батюшки","катанки","петрушки","шестерки"]),lr=q(["жки","шки","чки","рки","натки","хатки","ятки","етки","чётки","мки","нки","педки","илки"]),hr=q(["шок","щок","жок","зок","аток","яток","еток"])
;function Er(e,n,t,u){var a=O(u),s=L(a),c=N(s),f=r.indexOf(t)+1;if(1===f||4===f&&!n.isAnimate())return u
;if(134217984&c)if(2===f||4===f){if(M(a,["овичи","евичи"]))return U(u)+"ей"
;if(M(a,["вны","полусотни"])&&"овны"!==a)return W(u,2)+"ен"}else if(5===f){
if(M(a,["дети","люди"])&&!M(a,["нелюди"]))return U(u)+"ьми";if(M(a,["вери","дочери"]))return[U(u)+"ями",U(u)+"ьми"]}
var o=n.getGender(),l=a.endsWith("цы")?U(u):se(u,a),h=$(a,He)&&(n.isASurname()||o===i.COMMON)&&!$(a,$e),E=3*Math.min(Math.round(ur.length/3-1),f-2)
;if(h||a.endsWith("ничьи"))return u+ur[E];if(a.endsWith("ые"))return W(u,2)+ur[E+1]
;if(a.endsWith("ие")||$(a,te))return l+ur[E+2];if(f>2&&4!==f){var d=2*Math.min(Math.round(ar.length/2-1),f-3)
;return $(a,Xe)?U(u)+ar[d]:e.sd.hasStressedEndingPlural(n,t).includes(!0)?w(l)+ar[d+1]:l+ar[d+1]}
var S=n.getDeclension(),v=function(){var r=O(l),i=["жки","шки","чки","ножны"]
;if(M(r,["кн","кл","дк","нк","пк","зк","рк","тк","вк","лк","мк"])&&!M(a,["сумерки"])||"зл"===r||M(a,i)&&e.sd.hasStressedEndingPlural(n,t).includes(!0)){
var s=L(l);return U(l)+m("о",s)+s}if($(a,sr)&&!a.endsWith("недра")||M(a,i)){var c=R(u,1);return W(u,2)+m("е",c)+c}
if(M(a,["сестры","сёстры","серьги"])){var f=R(u,1);return("ь"===R(a,2)?w(W(u,3)):w(W(u,2)))+m("ё",f)+f}
if(M(r,["льц","сьм","деньг","ьк","йк","дьб"])){var o=L(l);return W(l,2)+m("е",o)+o}return M(a,["сла","слы"])?U(l)+"ел":l
};if([3,0].includes(S)){if(a.endsWith("и"))return U(u)+"ей";if(["гроздья"].includes(a))return U(u)+"ев"}var I=R(a,2)
;if(i.FEMININE!==o){var A=B(a),p=nr.hasRaw(A);if(p&&Ze.has(a))return U(u)+"ов"
;if(p&&er.has(a)&&!n.isAName())return[v(),U(u)+"ов"];if(p&&rr.has(a))return[U(u)+"ов",v()]
;if(o===i.COMMON&&!M(a,Ye)&&!"жшч".includes(I)||ir.hasRaw(A)&&tr.has(a)||n.isAName()&&o===i.MASCULINE&&n.lower().endsWith("а")||"барин"===n.lower())return v()
;switch(s){case"и":case"я":
if($(a,cr)||"щи"===a||Ye.includes(a)||n.lower().endsWith("ь")&&!M(n.lower(),["зять","деверь"]))return("ь"===L(U(a))?W(u,2):U(u))+"ей"
;if("и"===s)return a.endsWith("ульи")?U(u)+"ев":a.endsWith("ьи")?i.MASCULINE===o?U(u)+"ёв":W(u,2)+"ей":["ча","кле","холу","ху"].includes(U(a))?U(u)+"ёв":a.endsWith("ищи")?v():a.endsWith("мессии")?U(u)+"й":T(g,R(a,1))?U(u)+"ев":!$(a,lr)||i.MASCULINE===o&&!$(w(a),or)||$(n.lower(),hr)?U(u)+"ов":v()
;if($(a,fr))return U(u)+"ев";if(M(a,["зятья","кумовья","деверья","края","острия"]))return U(u)+"ёв"
;if(M(a,["ья","ия"]))return i.MASCULINE===o?W(u,2)+"ей":W(u,2)+"ий";break;case"а":
return M(a,["семена","стремена"])?W(u,3)+"ян":a.endsWith("мена")?W(u,3)+"ён":n.lower().endsWith("яйцо")?m("яиц",U(u)):a.endsWith("нца")?[v(),U(u)+"ев"]:$(a,Qe)?U(u)+"ов":v()
;case"ы":return M(a,["ницы","лицы","пицы","бицы"])?U(u):a.endsWith("цы")?U(u)+"ев":U(u)+"ов";default:
if(a.endsWith("не"))return v()}}if(a.endsWith("йки"))return W(u,3)+"ек";if(a.endsWith("ки")){if("ь"===I){var b=L(U(u))
;return W(u,3)+m("е",b)+b}if("жшч".includes(I))return v();if(T(consonantsExceptJ,I))return W(u,2)+"ок"}
if(Ye.includes(a))return U(u)+"ей";if(M(a,["аи","ои","еи","эи","уи"]))return U(u)+"й"
;if("свечи"===a)return[U(u),U(u)+"ей"];if("пригоршни"===a)return[U(u)+"ей",W(u,2)+"ен"]
;if("тихони"===a)return[W(u,2)+"нь",U(u)+"ей"]
;if(M(a,["ьи","ии"]))return e.sd.hasStressedEndingSingular(n,t).includes(!0)?W(u,2)+"ей":W(u,2)+"ий"
;if(a.endsWith("ни")&&T(consonantsExceptJ,R(a,2)))return["барышни","боярышни","деревни"].includes(a)?W(u,2)+"ень":a.endsWith("кухни")?W(u,2)+"онь":"сотни"===a?[W(u,2),W(u,2)+"ен"]:W(u,2)+"ен"
;if(O(l).endsWith("ийк"))return W(l,2)+"ек";if(l.length===a.length-1&&$(a,Xe)){
if("ьй".includes(O(R(l,1)))&&!n.isAnimate()){var C=L(l);return W(l,2)+m("е",C)+C}
return M(a,["земли","петли","пли","вли"])?U(l)+"ель":l+"ь"}return v()}var dr=function(){return d(function e(){var r,n,t
;h(this,e),r=this,n="sd",t=function(){function e(e,r,n,t){var i,u=S(t.split(","));try{for(u.s();!(i=u.n()).done;){
var a=i.value,s=Object.assign({},r);s.text=a,e.put(s,n)}}catch(e){u.e(e)}finally{u.f()}}var r=new Y,n=Object.freeze({
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
return Sr(this,P.create(e),r,n)}},{key:"pluralize",value:function(e){var r=P.create(e)
;return r.isPluraleTantum()?[r.text()]:Be(this,r)}},{key:"getLocativeForms",value:function(e){
var r=this,n=P.create(e),t=n.getDeclension();if(t&&t>=0){var i=Oe.get(pe(n))
;if(i instanceof Array)return i.map(function(e){return new u(function(e){switch(1+(e>>3&7)){case c.V:return"в"
;case c.VO:return"во";case c.NA:return"на"}}(e),function(e,r,n,t){switch(r){case 0:return Ie(e,n,Case.PREPOSITIONAL)
;case 1:return Le(e,n,t);case 2:return Me(e,n,Case.PREPOSITIONAL);case 3:return ve(e,n,Case.PREPOSITIONAL)}
}(r,t,n,o(e)),e>>6)})}return[]}}])}();function Sr(e,r,n,t){var i=function(e,r,n,t){var i=r.text()
;if(r.isIndeclinable())return i;if(r.isPluraleTantum())return Er(e,r,n,i);if(t)return Er(e,r,n,t)
;switch(r.getDeclension()){case-1:return i;case 0:return Ie(e,r,n);case 1:return We(e,r,n);case 2:return Me(e,r,n)
;case 3:return ve(e,r,n)}}(e,r,n,t);return i instanceof Array?i:[i]}return e.CASES=r,e.Case=n,e.Engine=dr,e.Gender=i,
e.Lemma=P,e.LocativeForm=u,e.LocativeFormAttribute=a,e.StressDictionary=Y,e.createLemma=function(e){return P.create(e)},
e.createLemmaOrNull=function(e){return P.createOrNull(e)},e}({});
//# sourceMappingURL=RussianNouns.es5.js.map
