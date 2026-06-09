/*!
  RussianNounsJS v3.0.0-alpha.2
  Copyright (c) 2011-2026 Georgy Ustinov
  Released under the MIT license
*/
var RussianNouns=function(n){"use strict"
;var r=Object.freeze(["именительный","родительный","дательный","винительный","творительный","предложный","местный"]),e=Object.freeze({
NOMINATIVE:r[0],GENITIVE:r[1],DATIVE:r[2],ACCUSATIVE:r[3],INSTRUMENTAL:r[4],PREPOSITIONAL:r[5],LOCATIVE:r[6]
}),t=Object.fromEntries(r.map(function(n,r){return[n,r]}));function u(n){return"number"==typeof n?n:t[n]}
var i=Object.freeze(["женский","мужской","средний","общий"]),s=Object.freeze({FEMININE:i[0],MASCULINE:i[1],NEUTER:i[2],
COMMON:i[3]});function a(n){for(var r=new Set,e=0,t=0;t<n.length;t++){e+=n[t],r.add(e)}return r}function f(n){
return 1<<n}function c(n,r,e){this.preposition=n,this.word=r,this.attributes=e}var h=Object.freeze({CONTAINER:1,
LOCATION:2,STRUCTURE:4,SURFACE:8,WAY:16,OBJECT_WITH_FUNCTIONAL_SURFACE:32,SUBSTANCE:64,RESOURCE:128,CONDITION:256,
EXPOSURE:f(9),MOTION:f(10),EVENT:f(11),WITH_ADJECTIVE:f(12),WITHOUT_ADJECTIVE:f(13)}),o=Object.freeze({V:1,VO:2,NA:3})
;function l(n,r,e){return e<<6|(n-1&7)<<3|r-1&7}function d(n){return 1+(7&n)}
var E="а".charCodeAt(0),S="А".charCodeAt(0),p="ё".charCodeAt(0),v="Ё".charCodeAt(0),g=1025===v,A=g?1024:v,W=g?1039:v,m=g?1104:p,b=g?1119:p,w=m-A
;function _(n){var r=n.charCodeAt(0),e=r-E;return r===p?32:e===(31&e)?1<<e:0}function C(n,r){return 0!==(n&_(r))}
var O=3892855073,I=66567902,N=66567390;function y(n){return C(O,n)}function x(n){return n.split("").filter(y).length}
function T(n){for(var r=5381,e=n.length,t=0;t<e;t++)r=33*r+n.charCodeAt(t)|0;return r>>>0}function M(n){
var r=n.replaceAll("ё","е"),e=r.length%2,t=1,u=5381;function i(){u=(33*u+(255&e))%4294967296,e>>=8,t-=8}
for(var s=0;s<r.length;s++){var a=r[s].charCodeAt(0)-E&31;e|=a<<t,(t+=5)>=8&&i()}t>0&&i();var f=r.charCodeAt(0)%2
;return 2*(2147483647&u)+f}function U(n){for(var r=0;r<n.length;r++){var e=n.charCodeAt(r)
;if(e>=S&&e<=S+31||e>=A&&e<=W)break;if(r===n.length-1)return n}for(var t=new Array(n.length),u=0;u<n.length;u++){
var i=n.charCodeAt(u);i>=S&&i<=S+31?i+=32:i>=A&&i<=W&&(i+=w),t[u]=i}return String.fromCharCode.apply(null,t)}
function j(n){if(g)return n.toLowerCase();for(var r=new Array(n.length),e=0;e<n.length;e++){var t=n.charCodeAt(e)
;t>=S&&t<=S+31||t>=65&&t<=90?t+=32:t>=A&&t<=W&&(t+=w),r[e]=t}return String.fromCharCode.apply(null,r)}function L(n,r){
return r===j(r)?n:function(n){for(var r=new Array(n.length),e=0;e<n.length;e++){var t=n.charCodeAt(e)
;t>=E&&t<=E+31?t-=32:t>=m&&t<=b&&(t-=w),r[e]=t}return String.fromCharCode.apply(null,r)}(n)}function k(n){
if(0===n.length)return"";var r=n.charCodeAt(0)
;return r>=E&&r<=E+31?String.fromCharCode(r-32)+n.slice(1):r>=m&&r<=b?String.fromCharCode(r-w)+n.slice(1):n}
function V(n,r){return n?r.map(k):r}function P(n){return n.replaceAll("ё","е").replaceAll("Ё","Е")}function R(n,r){
return n.substring(0,n.length-r)}function z(n,r){return n.substring(n.length-r)}function D(n){return R(n,1)}
function F(n){return B(n,1)}function B(n,r){return n[n.length-r]||""}function q(n,r){return 1===r.length&&n.includes(r)}
function G(n,r){return r.some(function(r){return n.endsWith(r)})}var H=function(){function n(r){
r instanceof n?(this._txt=r._txt,
this._lc=r._lc,this._hash=r._hash,this._flags=r._flags):(r.pluraleTantum?this._flags=5:this._flags=1+i.indexOf(r.gender),
this._txt=r.text,this._lc=j(r.text),this._hash=M(this._lc),this._flags|=8*(1&r.indeclinable),
this._flags|=16*(1&r.animate),this._flags|=32*(1&r.surname),this._flags|=64*(1&r.name),this._flags|=128*(1&r.transport),
this._flags|=f(16)*(2+function(n,r,e,t){if(r)return-2;if(t)return-1;var u=F(n);switch(e){case 1:
return"а"===u||"я"===u?2:C(I,u)?-1:3;case 2:return"а"===u||"я"===u?2:"путь"===n?0:1;case 3:
return["дитя","полудитя"].includes(n)?0:"мя"===z(n,2)?3:1;case 4:return"а"===u||"я"===u?2:"и"===u?-1:1;default:return-2}
}(this._lc,r.pluraleTantum,J(this),r.indeclinable)))}n.create=function(n){if(n instanceof this)return n;var r=Y(n)
;if(r)throw new Error(r);return Object.freeze(new this(n))},n.createOrNull=function(n){
return null===Y(n)?Object.freeze(new this(n)):null};var r=n.prototype;return r.equals=function(r){
return r instanceof n&&this._flags===r._flags&&this.lower()===r.lower()},r.text=function(){return this._txt},
r.lower=function(){return this._lc},r.isPluraleTantum=function(){return 5==(7&this._flags)},r.getGender=function(){
var n=J(this);if(n>=1&&n<=4)return i[n-1]},r.isIndeclinable=function(){return!!(8&this._flags)},r.isAnimate=function(){
return!!(16&this._flags)||this.isASurname()||this.isAName()},r.isASurname=function(){return!!(32&this._flags)},
r.isAName=function(){return!!(64&this._flags)},r.isATransport=function(){return!!(128&this._flags)},
r.getDeclension=function(){return(this._flags>>16)-2},r.getSchoolDeclension=function(){var n=this.getDeclension()
;return 1===n?2:2===n?1:n},n}();function J(n){return 7&n._flags}function X(n,r){var e=new H(n);return e._txt=r,
e._lc=j(r),e._hash=M(e.lower()),Object.freeze(e)}function Y(n){if(null==n)return"No parameters specified."
;for(var r=0,e=["pluraleTantum","indeclinable","animate","surname","name","transport"];r<e.length;r++){var t=e[r]
;if(function(n){return null!=n&&"boolean"!=typeof n}(n[t]))return t+" must be boolean."}
if(null==n.text)return"A cyrillic word required.";if(!n.pluraleTantum){
if(null==n.gender)return"A grammatical gender required.";if(!i.includes(n.gender))return"Bad grammatical gender."}
return null}
var K=a([11720389,548,1024,1479,2622,2867,1222,2642,264,1328,137,123,397,65542229,212447047,31729170,8094836,1056,21701789,35520559,40358,21819,28248,119786,63892,31809,7356,74383,72369,5945,28902,90120738,21187517,91925642,3054826,1600765,65934,30948851,5569212,4205640,5412804,6787095,9749916,3940084,1511466,1303038,16090470,1376628,49919694,3827522,37915959,14032615,28701924,224587434,637275762,51079457,391103676,24108070,158999424,232633267,6058815,66599250,692781441,816204112,55209380,72754,90006,80058,45564,67845,42548,27193,21401,139393,750335,170896,4424,1566,6264,154969,17292,17229,175112,83011,117872,4183,13065,108972,108088,343663,66210,334,17090,380271,283272,59007,35796,230801,1067156,19992,157124,12433,252644,2626,23776,630482,531296,304718,90891,726,23116,47653,30493,167310,50156,123071,477118,241821,55660,908992,534269,205157,11218,2490,660,66391,46856,847526,68710,8450,36630,15642,109864,41716,354482,79820,51876,97325,5506,46436,191803,3957,40876,126323,2347821,338490,73216,475569,87602,29642,4220,10760,16896,50156,17424,35178,167244,126786,33643,30488,65045,35961,51453,55660,4,152461,138332,1958,34200,3709,61381,17424,30158,80591,11218,44099,260487]),Q=a([11720389,548,1024,1060,4,5904,1848,4404,330555234,4691346,3365076,1045362,7414584,960432,10564312,253286,16178203,4357,4355,11350,31120,5248,40591,62367,54057,50487,13069,3664,39764,10263,3002,5810,8844,24551,4091,56761,21785,30553,55147139,15960625,1933097,12258067,16302047,54210486,45688435,1659767,4813249,33577763,2501798,10056946,672528,14209351,2012340,1655412,4652736,62568,148698,21186,71129124,260014161,108045611,1007583269,2026464,22799532,750068913,1499532,1285428194,74598,22348,6599,132273,309821,156816,397448,179394,148036,100257,21779,11218,36631,345954,50442,104394,2724,112115,30690,10552,31377,11286,7168,14612,51480,116537,192258,163145,65604,97951,1363157,212810,431243,2622,425588,275284,150351,570568,244701,16659,26136,130134,11040,159389,728373,3476,726,1290392,224730,189158,11218,2490,10750,21608,143747,65974,664563,84036,16283,17424,5758,45080,33066,1782,90658,37101,56107,233163,14216,5518,179264,2525,146957,111342,80594,2309,4217,25432,26905,29980,518951,1458289,523705,4202,477865,149368,126310,47828,212678,22744,269176,179119,4399,35997,69696,41777,41,127336,4202,73153,46372,114255,126869,23630,11218]),Z=function(){
function n(){this._filter=new Uint8ClampedArray(512)}var r=n.prototype;return r.addInteger=function(n){
this._filter[rn($(n))]|=en($(n)),this._filter[rn(nn(n))]|=en(nn(n))},r.hasInteger=function(n){
return!!(this._filter[rn($(n))]&en($(n)))&&!!(this._filter[rn(nn(n))]&en(nn(n)))},r.clone=function(){var r=new n
;return r._filter=Uint8ClampedArray.from(this._filter),r},n}();function $(n){return 4095&n}function nn(n){
return 4095&(n>>>12^n>>>24)}function rn(n){return n>>>3}function en(n){return 1<<7-(7&n)}var tn,un=(tn=new Z,
K.forEach(function(n){return tn.addInteger(n)}),Q.forEach(function(n){return tn.addInteger(n)}),Object.freeze(tn))
;function sn(){var n=new Map,r=un.clone(),e=function(n){return 4294967296*(31&n._flags)+n._hash},t=function(n){
return n.lower().indexOf("ё")+1&255},i=function(r){var u=65504&r._flags,i=function(r){var t=n.get(e(r))
;return t instanceof Array?t:[]}(r).filter(function(n){return(n[0]&u)<=u}),s=i.filter(function(n){return n[0]>>16===t(r)
});return s.length?s[0][1]:i.length?i[0][1]:void 0},s=function(n){switch(n){case"E":return[!0];case"e":return[!0,!1]
;case"b":case"s":return[!1,!0];default:return[!1]}};return{put:function(u,i){var s=i.split("-"),a=function(n,r){
return n.length!==r||n.split("").some(function(n){return!"SsbeE".includes(n)})}
;if(2!==s.length||a(s[0],7)||a(s[1],6))throw new Error("Bad settings format.");var f=H.create(u),c=e(f),h=n.get(c)
;h instanceof Array||(h=[],n.set(c,h));var o=65535&f._flags|t(f)<<16,l=h.find(function(n){return o===n[0]})
;l?l[1]=i:h.push([o,i]),r.addInteger(f._hash)},hasStressedEndingSingular:function(n,e){if(r.hasInteger(n._hash)){
var t=u(e);if(t>=0){var a=i(n);if(a){var f=a.split("-")[0];return s(f[t])}if(2===J(n)){
if(K.has(n._hash))return s("SEESEEE"[t]);if(Q.has(n._hash))return s("SEEEEEE"[t])}}}return[]},
hasStressedEndingPlural:function(n,e){if(r.hasInteger(n._hash)){var t=u(e);if(t>=0&&t<6){var a=i(n);if(a){
var f=a.split("-")[1];return s(f[t])}if(2===J(n)&&(K.has(n._hash)||n.isAnimate()&&Q.has(n._hash)))return s("E")}}
return[]}}}function an(n){for(var r=new Map,e=0;e<n.length;e++)for(var t=n[e],u=r,i=t.length-1;i>=0;i--){
var s=t.charCodeAt(i);if(i>0){var a=u.get(s);if(0===a)break;a===undefined&&u.set(s,new Map),u=u.get(s)}else u.set(s,0)}
return r}function fn(n,r){for(var e=r,t=n.length-1;t>=0;t--){var u=n.charCodeAt(t);if(!e.has(u))return!1;var i=e.get(u)
;if(0===i)return!0;e=i}}
var cn=an(["ое","нький","ский","ской","лстой","отой","утой","евой","овой","живой"]),hn=an(["ее","ое","нький","ский","ской","лстой","отой","утой"]),on=an(["евой","овой","отой","живой"]),ln=an(["шний","жний","щий","ший","жий","чий"]),dn=["божий","ажий","яжий","ужий","южий","бульдожий","кабарожий","медвежий","носорожий","миножий"],En=an(dn),Sn=an(dn.map(function(n){
return R(n,2)+"ьи"
})),pn=new Set(["бубен","бугор","ветер","вошь","вымысел","горшок","деготь","дёготь","дятел","домысел","замысел","кашель","коготь","лапоть","лоб","локоть","ломоть","молебен","мох","ноготь","овен","пепел","пес","пёс","петушок","помысел","порошок","промысел","псалом","пушок","ров","рожь","рот","сон","стебель","стишок","угол","умысел","хребет","церковь","шов","ковер","овес","костер"].map(M)),vn=new Z
;pn.forEach(function(n){return vn.addInteger(n)})
;var gn=an(["овёс","ковёр","костёр","шатер","шатёр","козел","козёл","котел","котёл","орел","орёл","осел","осёл","узел","уголь","чок","ешок","хол"])
;function An(n,r){var e=F(r);if(C(-402111711,e)){if(C(O,B(r,2))){var t=R(n,2);return fn(r,En)?t+L("ь",t):t}
if("й"!==e)return D(n)}return n}var Wn=["ясень","бюллетень","олень","тюлень","гордень","пельмень","ячмень"]
;function mn(n,r,e){var t,u=n.text(),i=F(r),s=_(i);return-133667019&s&&(-402111711&s?t=function(n,r,e){var t=B(r,2)
;return"ь"===t||"о"===e&&C(2504708,t)?D(n):An(n,r)}(u,r,i):"к"===i?t=function(n,r,e){
return n.length>=4&&G(r,["рёк","нёк","лёк"])&&!1!==e?R(n,2)+"ьк":r.endsWith("ёк")&&C(O,B(r,3))?R(n,2)+"йк":void 0
}(u,r,e):"ь"===i?t=function(n,r,e){
return pn.has(n._hash)||fn(e,gn)?R(r,3)+B(r,2):e.endsWith("ень")&&2===J(n)&&!G(e,Wn)?R(r,3)+"н":D(r)
}(n,u,r):(["лёд","лед","лён"].includes(r)||"лев"===r&&n.isAnimate())&&(t=R(u,2)+L("ь",B(u,2))+F(u))),
t||(t=function(n,r,e){
return!!(199680&e)&&fn(r,gn)&&!["новосел","новосёл"].includes(r)||!!(2571270&e)&&(vn.hasInteger(n._hash)&&pn.has(n._hash)||n.isAnimate()&&r.endsWith("посол"))
}(n,r,s)?R(u,2)+F(u):u),t}function bn(n,r){var e=D(n),t=D(r.lower());if("а"===F(t))return e
;if(G(t,["зне","жне","гре","спе","мудре"])||z(D(t),3).split("").every(function(n){return C(N,n)})||r.isAName())return e
;if("ле"===z(t,2)){var u=B(t,3);return C(O,u)||"л"===u?D(e)+"ь":e}
return C(O,F(t))&&"и"!==F(t)?C(O,F(D(t)))?R(n,2)+"й":G(r.lower(),["месяц"])?e:R(n,2):e}
var wn=an(["лапоток","желток","нишок","ришок","ишек"]),_n=["поток","приток","переток","проток","биоток","электроток","восток","водосток","водоток","воток","знаток"],Cn=["инок","исток","обморок","порок","пророк","сток","урок"]
;function On(n){
return G(n,["чек","шек"])&&n.length>=6||fn(n,wn)||n.endsWith("ок")&&!n.endsWith("шок")&&!Cn.includes(n)&&!G(n,_n)&&!C(O,B(n,3))&&(C(O,B(n,4))||G(R(n,2),["ст","рт"]))&&n.length>=4
}function In(n,r,e){return(n.length?n:[!1]).map(function(n){return e(n?P(r):r,n)})}var Nn=0,yn=3,xn={"дочь":"дочерь",
"мать":"матерь"};function Tn(n,r,e){var t=r.text(),u=r.lower()
;if(![Nn,yn].includes(e)&&Object.keys(xn).includes(u))return Tn(n,X(r,xn[u]),e);var i=mn(r,u);if(function(n){
return n.endsWith("полночь")||n.startsWith("пол")&&C(134217984,F(n))&&x(n)>=2}(u)&&(i="полу"+i.substring(3)),
"мя"===z(u,2))switch(e){case Nn:case yn:return t;case 1:case 2:case 5:case 6:return i+"ени";case 4:return i+"енем"
}else switch(e){case Nn:case yn:return t;case 1:case 2:case 5:case 6:return i+"и";case 4:
return G(u,["вошь","рожь","церковь"])?t+"ю":i+"ью"}}function Mn(n,r,e){var t=r.text(),u=r.lower()
;if(u.endsWith("путь"))return 4===e?D(t)+"ём":Tn(n,r,e);if(!u.endsWith("дитя"))throw new Error("unsupported");switch(e){
case 0:case 3:return t;case 1:case 2:case 5:case 6:return t+"ти";case 4:return[t+"тей",t+"тею"]}}function Un(n,r,e){
var t=r.text(),u=r.lower(),i=mn(r,u),s=U(i),a=D(t),f=D(u),c=function(){return"я"===F(u)},h=function(){
return u.endsWith("ая")&&!(2===x(u)||C(O,F(s)))},o=function(){return u.endsWith("яя")&&!(2===x(u)||C(O,F(s)))
},l=["жая","шая"];switch(e){case 0:return t;case 1:
return o()||G(u,l)?i+"ей":h()?i+"ой":r.isASurname()&&!u.endsWith("да")?a+"ой":u.endsWith("ничья")?a+"ей":c()||C(60818504,F(s))?a+"и":a+"ы"
;case 2:case 5:case 6:
return o()||G(u,l)?i+"ей":h()?i+"ой":r.isASurname()&&!u.endsWith("да")?a+"ой":"ия"===z(u,2)?a+"и":u.endsWith("ничья")?a+"ей":a+"е"
;case 3:return h()?i+"ую":o()?i+"юю":c()?a+"ю":a+"у";case 4:
return o()||G(u,l)?i+"ею":h()?[i+"ой",i+"ою"]:c()||q("жшчщц",F(s))&&!n.sd.hasStressedEndingSingular(r,e).includes(!0)?"и"===F(f)?a+"ей":[a+"ей",a+"ею"]:[a+"ой",a+"ою"]
}}var jn=an(["ов","ев","ёв","ин","ын"]),Ln=function(n,r){for(var e=r,t=0;t<n.length;t++){var u=n.charCodeAt(t),i=e
;(e=new Map).set(u,i)}return e}("ы",jn);function kn(n){return n.filter(function(r,e){return n.indexOf(r)===e})}
function Vn(n){var r=1&n.lower().includes("ё");return 4294967296*((65535&n._flags)<<1|r)+n._hash}
var Pn=Object.freeze(function(){var n=new Map,r={gender:s.MASCULINE},e={gender:s.MASCULINE,animate:!0}
;function t(r,e,t,u,i){for(var s=u.split(","),a=i instanceof Array?i:[2],f=0;f<s.length;f++){var c=s[f];r.text=c
;var h=Vn(H.create(r)),o=n.get(h);o||(o=[],n.set(h,o));for(var d=0;d<t.length;d++)for(var E=t[d],S=0;S<a.length;S++){
var p=a[S];o.push(l(E,p,e))}}}var u=[o.V],i=[o.VO],a=[o.NA];t(r,f(0),u,"мозг,пруд,стог,таз,год"),t(r,f(0),i,"рот"),
t(r,f(4),u,"год"),
t(r,f(0),u,"гроб"),t(r,f(0),i,"гроб",[1]),t(r,f(1),u,"ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,низ,хлев"),
t(r,f(2),u,"круг,полк,артполк,ряд,род,строй,лад"),t(r,f(3),a,"баз,берег,бережок,вал,кон,круг,луг,пол,яр"),
t(r,f(4),a,"век,день"),t(r,f(4),u,"час"),t(r,f(4),a,"корень"),t(e,f(5),a,"вор"),
t(r,f(5),a,"повод,бочок,борт,воз,горб,кол,мост,плот,сук,х"+String.fromCharCode(1091)+"й"),t(r,f(5),a,"крюк,болт",[1,2])
;var c=",мёд,мех,пар,пух";t(r,f(6),u,"дым,жир,мел,пушок"+c),t(r,f(7),a,"газ,клей,спирт"+c),
t(r,f(8),u,"бой,бред,быт,долг,плен,пыл,сок,ход,лад"),t(r,f(9),u.concat(a),"вид"),
t(r,f(9),a,"слух,счёт,ветер,ветр,свет"),t(r,f(10),a,"ход,бег,вес"),t(r,f(10)|f(12),a,"шаг"),t(r,f(11),a,"бал,пир"),
t(r,f(8),a,"дух,плав"),t(r,f(10)|f(12),a,"газ"),t(r,f(0),u,"глаз,зоб,нос,шкаф"),t(r,f(0),i,"лоб"),
t(r,f(5),a,"глаз,лоб,нос,шкаф,холм");var h="бок,верх,зад,угол";return t(r,f(1),u,h),t(r,f(5),a,h),
t(r,f(1)|f(13),u,"край"),t(r,f(5)|f(13),a,"край"),t(r,f(3),a,"лёд,мох,снег"),t(r,f(6),i,"лёд,лён,мох"),
t(r,f(6),u,"снег"),n
}()),Rn=new Set("клей,чай,дом,дух,дым,дымок,газ,год,горошек,жар,жир,квас,пар,пыл,род,рост,сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,табак,творог,толк,торф,туман,убыток,укроп,уксус,ход,цемент,чеснок,шаг,шик,шиповник,шоколад,шорох,шум,яд".split(",")),zn=new Z
;Rn.forEach(function(n){return zn.addInteger(M(n))})
;var Dn=an(["й","ие","иё"]),Fn=an(["воробей","муравей","ручей","соловей","улей"]),Bn=an(["мой","ной","дой","шой","жой","рзой","осой","хой","латой","витой","литой","питой","житой","отой","утой","ятой","лагой","рагой","огой","угой","лубой","любой","илой","ылой","злой","малой","овой","евой","живой","ской","акой","укой","нний","ский","йкий","цкий","зкий","ткий","лкий","мкий","хкий","оркий","аркий","яркий","ький","ёкий","бокий","оокий","cокий","токий","ликий","дикий","укий","ыкий","який","пкий","дкий","бкий","нкий","жкий","чкий","гкий","овкий","авкий"])
;function qn(n,r){return"ый"===z(r,2)||(r.endsWith("кривой")||fn(r,Bn))&&x(r)>=2}
var Gn,Hn=an(["ий","ие","чье","тье","дье","вье","бье","жалованье","енье","ружье","божье","верье","мужье"]),Jn=an(["вое","лое","мое","ное","рое","тое","той","ый"])
;function Xn(n,r,e){
var t=r.text(),u=r.lower(),i=F(u),s=n.sd.hasStressedEndingSingular(r,e),a=mn(r,u,s[0]),f=D(t),c=Kn(u)
;c&&(a="полу"+a.substring(3),f="полу"+f.substring(3));var h=U(a),o=function(){return c&&u.endsWith("я")||Zn(u)
},l=fn(u,Dn),E=function(){return fn(u,Fn)?D(f)+L("ь",F(f)):f},S=function(){return q("чщ",F(h))};function p(n){
return!r.isAnimate()&&zn.hasInteger(r._hash)&&Rn.has(u)&&("й"===i?n.push(D(t)+L("ю",F(t))):n=n.concat(In(s,a,function(n){
return n+L("у",F(n))}))),n}switch(e){case 0:return t;case 1:switch(i){case"и":case"ы":if(c)return Yn(n,r,e,u);break
;case"й":case"е":if(l&&r.isASurname()||qn(0,u)||fn(u,cn))return a+"ого";if(fn(u,ln)||u.endsWith("ее"))return a+"его"
;case"ё":case"я":case"ь":if(l)return p([E()+"я"]);if(o()&&!S())return a+"я";break;case"ц":return bn(t,r)+"ца";case"к":
if(On(u))return D(f)+"ка";break;case"о":if(G(u,["шко"])&&2===J(r))return f+"и"}
return p(r.isASurname()||-1===h.indexOf("ё")?[a+"а"]:In(s,a,function(n){return n+"а"}));case 2:switch(i){case"и":
case"ы":if(c)return Yn(n,r,e,u);break;case"й":case"е":if(l&&r.isASurname()||qn(0,u)||fn(u,cn))return a+"ому"
;if(fn(u,ln)||u.endsWith("ее"))return a+"ему";case"ё":case"я":case"ь":if(l)return E()+"ю";if(o()&&!S())return a+"ю"
;break;case"ц":return bn(t,r)+"цу";case"к":if(On(u))return D(f)+"ку"}
return r.isASurname()||-1===h.indexOf("ё")?a+"у":In(s,a,function(n){return n+"у"});case 3:
return 3===J(r)||q("иы",i)&&c?t:r.isAnimate()?Xn(n,r,1):t;case 4:switch(i){case"и":case"ы":if(c)return Yn(n,r,e,u);break
;case"й":case"е":case"ё":case"я":case"ь":if(l&&r.isASurname()||fn(u,hn))return fn(u,Jn)?a+"ым":a+"им"
;if(qn(0,u))return"и"===B(u,2)||u.endsWith("хой")?a+"им":a+"ым";if(fn(u,on))return a+"ым";if(fn(u,ln))return a+"им"
;if(l)return E()+"ем";if(u.endsWith("це"))return t+"м";break;case"ц":return In(s,t,function(n,e){
return e?bn(n,r)+"цом":bn(n,r)+"цем"});case"к":if(On(u))return D(f)+"ком";break;case"н":case"в":
if(r.isASurname()&&fn(u,jn))return t+"ым"}return o()||q("жшчщ",F(h))?In(s,a,function(n,r){return r?n+"ом":n+"ем"
}):r.isASurname()||-1===h.indexOf("ё")?a+"ом":In(s,a,function(n){return n+"ом"});case 6:if("полпути"===u)return t
;var v=Pn.get(Vn(r));if(v)return kn(v.map(function(n){return d(n)})).map(function(e){return Qn(n,r,e)});case 5:
switch(i){case"и":if("полпути"===u)return t;case"ы":if(c)return Yn(n,r,e,u);break;case"й":case"е":case"ё":case"я":
case"ь":if(l&&r.isASurname()||qn(0,u)||fn(u,cn))return a+"ом";if(fn(u,ln)||u.endsWith("ее"))return a+"ем"
;if(G(u,["воробей"])){var g=D(f);return g+L("ье",F(g))}
if(fn(u,Hn)&&!G(u,["запястье","здоровье","изголовье","платье"]))return f+"и";if("й"===i||"иё"===z(u,2))return E()+"е"
;break;case"ц":return bn(t,r)+"це";case"к":if(On(u))return D(f)+"ке"}
return r.isASurname()||-1===h.indexOf("ё")?a+"е":In(s,a,function(n){return n+"е"})}}function Yn(n,r,e,t){
var u=function(){return"полминуты"!==t?"полу"+r.text().substring(3):r.text()}
;return"полпути"===t?Mn(n,X(r,D(u())+"ь"),e):t.endsWith("зни")||t.endsWith("сти")?Tn(n,X(r,D(u())+"ь"),e):Un(n,X(r,D(u())+("ни"===z(t,2)?"я":"а")),e)
}function Kn(n){if(n.startsWith("пол")&&C(2550137089,F(n))&&"л"!==n[3]&&x(n)>=2){
var r=n.substring(3),e=r.search(/[а-яё]/);return e>=0&&C(I,r[e])}return!1}function Qn(n,r,e){if(2===e){
var t=r.text(),u=r.lower(),i=mn(r,u),s=D(t),a=Kn(u)&&u.endsWith("я")||Zn(u)
;return"й"===F(u)?P(s)+"ю":a?P(i)+"ю":On(u)?P(D(s))+"ку":P(i)+"у"}if(1===e)return Xn(n,r,5)}function Zn(n){
return"ь"===F(n)&&!n.endsWith("господь")||q("её",F(n))&&!G(n,["це","же"])}for(var $n=((Gn={})[2]={all:{
"болгарин":["болгары"],"господин":["господа"],"дядя":["дяди","дядья"],"зуб":["зубы","зубья"],"клок":["клочья","клоки"],
"князь":["князи","князья"],"кол":["колы","колья"],"месяц":["месяцы"],"полдень":["полдни","полудни"],
"татарин":["татары"],"хозяин":["хозяева"],"цветок":["цветки","цветы"],"черт":["черти"],"чёрт":["черти"],
"электротрактор":["электротракторы","электротрактора"],"мини-трактор":["мини-трактора"]},animateOnly:{
"авиаконструктор":["авиаконструктора","авиаконструкторы"],"автоинспектор":["автоинспектора","автоинспекторы"],
"арт-директор":["арт-директора"],"бесёнок":["бесенята"],"вице-директор":["вице-директора"],
"госавтоинспектор":["госавтоинспектора","госавтоинспекторы"],"госинспектор":["госинспектора"],
"кондуктор":["кондуктора","кондукторы"],"конструктор":["конструктора","конструкторы"],"кум":["кумовья"],
"корректор":["корректора","корректоры"],"муж":["мужья","мужи"],"охотинспектор":["охотинспектора"],
"пристав":["пристава","приставы"],"проспектор":["проспектора"],"редактор":["редактора","редакторы"],
"ректор":["ректора","ректоры"],"санинструктор":["санинструктора","санинструкторы"],"слесарь":["слесари","слесаря"],
"сторож":["сторожа","сторожи"],"вахтер":["вахтера","вахтёры"],"фельдшер":["фельдшера","фельдшеры"],
"член-корреспондент":["член-корреспонденты","члены-корреспонденты"],"цыган":["цыгане","цыганы"]}},Gn[1]={all:{
"гроздь":["грозди","гроздья"],"курица":["курицы","куры"],"стая":["стаи"],"щека":["щёки"],"береста":["берёсты"],
"верста":["вёрсты"],"десна":["дёсны"],"жена":["жёны"],"звезда":["звёзды"],"кинозвезда":["кинозвёзды"],
"медсестра":["медсёстры"],"метла":["мётлы"],"пчела":["пчёлы"],"сестра":["сёстры"],"слеза":["слёзы"]}},Gn[3]={all:{
"брюхо":["брюхи"],"колено":["колена","колени","коленья"],"древо":["древа","древеса"],"ухо":["уши"],"око":["очи"],
"дно":["донья"],"чудо":["чудеса","чуда"],"небо":["небеса"],"бревно":["брёвна"],"ведро":["вёдра"],
"веретено":["веретёна"],"весло":["вёсла"],"гнездо":["гнёзда"],"зерно":["зёрна"],"знамя":["знамёна"],"колесо":["колёса"],
"облачко":["облачка"],"озеро":["озёра"],"полсотни":["полусотни"],"ребро":["рёбра"],"ремесло":["ремёсла"],
"седло":["сёдла"],"село":["сёла"]}
},Gn),nr=new Z,rr=0,er=Object.values($n);rr<er.length;rr++)for(var tr=er[rr],ur=0,ir=Object.values(tr);ur<ir.length;ur++)for(var sr=ir[ur],ar=0,fr=Object.keys(sr);ar<fr.length;ar++){
var cr=fr[ar];nr.addInteger(M(cr))}
var hr=["зять","деверь","друг","брат","собрат","стул","брус","обод","полоз","струп","подмастерье","якорь","перо","шило"],or=new Set(["берег","бок","борт","век","вес","веер","вексель","вечер","глаз","голос","город","директор","доктор","дом","детдом","егерь","жемчуг","катер","колокол","концлагерь","корм","короб","кузов","купол","кучер","лес","луг","мастер","номер","пояс","провод","рог","сахар","снег","сорт","стог","счет","счёт","спецсчет","спецсчёт","субсчет","субсчёт","терем","том","холод","хутор","цвет","череп"]),lr=an(["округ","остров","отпуск","паспорт","парус","поезд","погреб","рукав","цех"]),dr=an(["повар","юнкер"]),Er=new Set(["адрес","договор","буфер","ворох","инспектор","инструктор","корпус","крейсер","орден","ордер","прожектор","пропуск","род","свитер","сектор","сервер","тенор","тон","трактор","тормоз","ветер","верх","китель","мех","хлеб","юнкер","ястреб"]),Sr=new Set(["бункер","вымпел","год","лекарь","образ","омут","писарь","пудель","токарь","тополь","шторм","штуцер"]),pr=["крюк","лист","лоскут","повод","прут","сук","учитель","флигель","штабель"],vr=["клин","колос","ком","край","соболь"],gr=["дерево","звено","крыло"],Ar=["безделье","варенье","воскресенье","жалованье","запястье","застолье","затишье","здоровье","зелье","изголовье","новоселье","одночасье","печенье","платье","побережье","поголовье","подворье","подземелье","подполье","поместье","предплечье","раздумье","сиденье","средневековье","увечье","угодье","устье"],Wr=["воробей","муравей","ручей","соловей","улей","жеребей","ирей","репей","чирей"]
;function mr(n){return"барин"===n}function br(n,r,e,t,u){var i=n.sd.hasStressedEndingPlural(r,0).map(function(n){
return!n});return i.length?i.map(function(n){return n?1===t.replace(/[^её]/g,"").length?u((r=e,i=t,
s=Math.max(i.lastIndexOf("е"),i.lastIndexOf("ё")),a=L("ё",r[s]),r.substring(0,s)+a+r.substring(s+1))):u(e):u(P(e))
;var r,i,s,a}):[u(e)]}function wr(n,r,e,t,u,i,s,a){var f=[],c=function(){
return(i.endsWith("евич")||i.endsWith("евна"))&&i.indexOf("ье")>=0};function h(){
var n=a,r=U(n).indexOf("ье"),e=L("и",n[r]);return n.substring(0,r)+e+n.substring(r+1)}
return C(60818504,F(u))||q("яйь",F(i))||G(i,["сосед"])?c()?(f.push(h()+"и"),
f.push(a+"и")):f.push.apply(f,In(s,a,function(n){return n+"и"})):"ц"===F(i)?f.push(bn(e,r)+"цы"):c()?(f.push(h()+"ы"),
f.push(a+"ы")):f.push.apply(f,In(s,a,function(n){return n+"ы"})),f}function _r(n,r){
var e=r.text(),t=r.lower(),u=n.sd.hasStressedEndingPlural(r,0),i=mn(r,t,u[0]),s=U(i)
;if(t.endsWith("яя"))return[R(e,2)+"ие"];var a=("й"===F(t)||C(O,F(t)))&&C(O,F(D(t)))?D(e):i,f=function(n,r){
if(!nr.hasInteger(n._hash))return undefined;var e=J(n),t=n.isAnimate(),u=$n[e];if(!u)return undefined
;var i=u.animateOnly;if(t&&i&&i.hasOwnProperty(r))return i[r].slice();var s=u.all
;return s&&s.hasOwnProperty(r)?s[r].slice():undefined}(r,t);if(f)return f;var c=J(r),h=r.getDeclension()
;if(-1===h)return[e];if(0===h){if("путь"===t)return["пути"];if(t.endsWith("дитя"))return[R(e,3)+"ети"]
;throw new Error("unsupported mixed declension word")}return 1===h?function(n,r,e,t,u,i,s,a,f){
var c=[],h="ь"===F(i)?u:"к"===F(i)?D(u)+"чь":"г"===F(i)?D(u)+"зь":"й"===F(t)?D(e):G(t,["рь","ль"])?u:u+"ь"
;if(hr.includes(t))return c.push(h+"я"),kn(c);if(2===f){var o=function(n){
return"сын"===n?"сын":"человек"===n?"человек":null}(t);if("сын"===o)return c.push("сыновья"),
c.push.apply(c,wr(0,r,e,0,i,t,s,a)),kn(c);if("человек"===o)return c.push("люди"),c.push.apply(c,wr(0,r,e,0,i,t,s,a)),
kn(c);if(function(n,r){return!!pr.includes(n)||!("соболь"!==n||!r.isAnimate())
}(t,r))return c.push.apply(c,wr(0,r,e,0,i,t,s,a)),c.push(h+"я"),kn(c);if(function(n){return vr.includes(n)
}(t))return c.push(h+"я"),kn(c);var l=function(n){return or.has(n)?1:Er.has(n)?3:Sr.has(n)?4:0}(t),d=function(n,r){
var e=r.isAnimate();return!e&&fn(n,lr)||e&&fn(n,dr)}(t,r);return 0!==l||d?(4===l&&c.push.apply(c,wr(0,r,e,0,i,t,s,a)),
Zn(t)?c.push.apply(c,br(n,r,u,i,function(n){return n+"я"})):s.includes(!0)?c.push(P(u)+"а"):c.push(u+"а"),
3===l&&c.push.apply(c,wr(0,r,e,0,i,t,s,a)),
kn(c)):r.isAnimate()&&(t.endsWith("анин")||t.endsWith("янин"))&&!r.isAName()||function(n){return"боярин"===n
}(t)||mr(t)?(c.push(R(e,2)+"е"),mr(t)&&c.push(R(e,2)+"ы"),kn(c)):function(n){return"цыган"===n}(t)?(c.push(e+"е"),
kn(c)):function(n){return"щенок"===n}(t)?(c.push(R(e,2)+"ки"),c.push(R(e,2)+"ята"),kn(c)):function(n){
return!(!n.endsWith("ребёнок")&&!n.endsWith("ребенок")||n.endsWith("жеребёнок")||n.endsWith("жеребенок")||n.endsWith("ястребёнок")||n.endsWith("ястребенок"))
}(t)?(c.push(R(e,7)+"дети"),kn(c)):function(n,r){return(n.endsWith("ёнок")||n.endsWith("енок"))&&r.isAnimate()
}(t,r)?(c.push(R(e,4)+"ята"),kn(c)):t.endsWith("ёночек")&&r.isAnimate()?(c.push(R(e,6)+"ятки"),kn(c)):function(n,r){
return n.endsWith("онок")&&q("жшч",B(n,5))&&r.isAnimate()}(t,r)?(c.push(R(e,4)+"ата"),kn(c)):On(t)?(c.push(R(e,2)+"ки"),
kn(c)):fn(t,ln)?(G(t,dn)?c.push(R(e,2)+"ьи"):c.push(D(e)+"е"),
kn(c)):qn(0,t)?(t.endsWith("ый")||t.endsWith("ий")?c.push(D(e)+"е"):t.endsWith("ой")&&!G(t,["хой","ской"])?c.push(R(e,2)+"ые"):c.push(R(e,2)+"ие"),
kn(c)):t.endsWith("его")?(c.push(R(e,3)+"ие"),kn(c)):function(n){return Wr.includes(n)}(t)?(c.push(R(e,2)+"ьи"),
kn(c)):(c.push.apply(c,wr(0,r,e,0,i,t,s,a)),kn(c))}if(3===f){if(function(n){
return G(n,["ко","чо"])&&!G(n,["войско","облако"])}(t))return c.push(D(e)+"и"),kn(c);if(function(n){
return n.endsWith("имое")}(t))return c.push(u+"ые"),kn(c);if(function(n){return n.endsWith("ее")
}(t))return c.push(u+"ие"),kn(c);if(t.endsWith("ое"))return!function(n){return G(n,["г","к","ж","ш","х"])
}(i)?c.push(u+"ые"):c.push(u+"ие"),kn(c);if(function(n){return G(n,["ие","иё"])}(t))return c.push(R(e,2)+"ия"),kn(c)
;if(function(n){return G(n,["ье","ьё"])}(t)){var E=R(e,2);return"е"!==F(t)||function(n){return Ar.includes(n)
}(t)||c.push(E+"ия"),c.push(E+"ья"),kn(c)}return function(n){return G(n,gr)}(t)?(c.push(u+"ья"),kn(c)):function(n){
return G(n,["ле","ре"])}(t)?(c.push(u+"я"),kn(c)):function(n,r){return n.endsWith("судно")&&r.isATransport()
}(t,r)?(c.push(R(e,2)+"а"),kn(c)):(c.push.apply(c,br(n,r,u,i,function(n){return n+"а"})),function(n){
return n.endsWith("щупальце")}(t)&&c.push.apply(c,wr(0,r,e,0,i,t,s,a)),kn(c))}return c.push(u+"и"),kn(c)
}(n,r,e,t,i,s,u,a,c):2===h?function(n,r,e,t,u,i,s,a){var f=[];if(function(n){return"заря"===n}(t))return f.push("зори"),
kn(f);if(function(n){return n.endsWith("ая")&&!n.endsWith("свая")
}(t))return q("жхчшщ",F(i))||G(i,["вк","гк","ск","цк","ньк"])?f.push(u+"ие"):f.push(u+"ые"),kn(f)
;return f.push.apply(f,wr(0,r,e,0,i,t,s,a)),kn(f)}(0,r,e,t,i,s,u,a):3===h?function(n,r,e,t,u,i,s,a,f){var c=[]
;if("мя"===z(t,2))return c.push(u+"ена"),kn(c);if(Object.keys(xn).includes(t))return c.push(D(xn[t])+"и"),kn(c)
;if(1===f)return c.push(a+"и"),kn(c);"и"===F(a)?c.push(a+"я"):c.push(a+"а");return kn(c)}(0,0,0,t,i,0,0,a,c):[e]}
var Cr=an(["ли","си","би","ви","ди","ти","пи","ри","ни","фи","зи","ьи","ья","ия","ря","ля","ая","аи","ои","уи","эи","ыи","яи","ёи","юи","еи","ии"]),Or=["беготни","болтовни","будни","вожжи","возни","доли","лапши","левши","люди","марли","моря","мощи","ноздри","пени","пятерни","распри","родни","сакли","сени","ступни","судьи","фигни","чукчи"],Ir=["головы","громадины","детины","деревенщины","дохлятины","дубины","ехидины","жадины","зверины","идиотины","кислятины","молодчины","орясины","остолопины","сиротины","скотины","старейшины","старины","старшины","уродины"],Nr=an(Ir),yr=["адреса","паспорта","поезда","цеха","снега","бункера","буфера","берега","вымпела","голоса","города","договора","жемчуга","колокола","короба","корпуса","крейсера","кузова","леса","мастера","номера","облачка","острова","отпуска","паруса","повара","погреба","пояса","провода","пропуска","рукава","сахара","свитера","сервера","счета","тормоза","холода","хутора","цвета","черепа","шторма","штуцера","юнкера","ястреба","суда","фельдшера","кучера","пристава"],xr=an([].concat(yr,["ктора","хтера"])),Tr=new Set([].concat(yr,["бега","беглецы","близнецы","бойцы","бока","борта","борцы","бруствера","брюшки","веера","века","венцы","верха","веса","весы","вечера","вороха","глупцы","года","гонцы","дворцы","дельцы","детдома","детдомы","дома","жеребцы","жильцы","жрецы","затишки","зубцы","излишки","истцы","катера","концы","корма","кузнецы","купола","купцы","лишки","луга","мертвецы","меха","мудрецы","облака","образа","образцы","огурцы","округа","омута","ордена","ордера","отцы","очки","певцы","песцы","пловцы","подлецы","продавцы","птенцы","резцы","рога","рода","рубцы","самцы","свинцы","сорта","соуса","спецы","стога","столбцы","стрельцы","творцы","тельцы","тенора","терема","тома","тона","торцы","хлеба","штришки","юнцы"])),Mr=new Set(["авары","аланы","аршины","баклажаны","буквы","гольфы","граммы","гусары","дела","кадеты","килограммы","омы","помидоры","рентгены","ботинки","человеки","чулки","шорты"]),Ur=new Set(["гектары","рельсы"]),jr=new Set([].concat(Ir,["абазины","авы","аввы","бедняги","бедолаги","болгары","бродяги","брызги","брюки","брюхи","будды","бусы","валенки","веки","вельможи","верзилы","вилы","владыки","воеводы","волосы","вояки","главы","грузины","задворки","задиры","железы","жилы","зануды","зеваки","именины","калеки","кальсоны","каникулы","колготки","коллеги","крохи","курицы","куры","ладоши","ламы","лыки","макароны","мужчины","нападки","нары","непоседы","носилки","ножны","папы","папаши","таты","падлы","партизаны","погоны","поминки","посиделки","похороны","предтечи","работяги","разы","ребятки","румыны","самоубийцы","санки","убийцы","сапоги","сатаны","сироты","сливки","слуги","солдаты","старосты","сумерки","сутки","татары","телеса","хитрюги","четвереньки","шляпы","шмотки","яблоки","дядьки","дяденьки","зайки","кроссовки","малютки","малолетки","попки","турки","узы","хлопоты","шахматы"])),Lr=new Z
;Tr.forEach(function(n){return Lr.addInteger(T(n))}),Mr.forEach(function(n){return Lr.addInteger(T(n))}),
Ur.forEach(function(n){return Lr.addInteger(T(n))});var kr=new Z;jr.forEach(function(n){return kr.addInteger(T(n))})
;var Vr=an(["жи","ши","чи","ля","ли","чи","ри","ти","ди","сани","борщи","клещи","товарищи","плащи","прыщи","хрящи"]),Pr=an(["братья","брусья","деревья","донья","звенья","клинья","клочья","коленья","колосья","колья","комья","крылья","крючья","листья","лоскутья","лохмотья","перья","платья","поводья","прутья","стулья","сучья","хлопья","шилья"]),Rr=an(["ишки","дружки","тки","папочки","дедушки","дядюшки","батюшки","катанки","петрушки","шестерки"]),zr=an(["жки","шки","чки","рки","натки","хатки","ятки","етки","чётки","мки","нки","педки","илки"]),Dr=an(["шок","щок","жок","зок","аток","яток","еток"]),Fr=an(["вна","вца","вцы","пла","дца","дра","судна","рки","рцы","тлы","рна","тна","енца","десны","дёсны","рёбра","ребра","сосны"])
;function Br(n){return Or.includes(n)}
var qr=[["х","ых","их"],["м","ым","им"],["х","ых","их"],["ми","ыми","ими"],["х","ых","их"]],Gr={2:0,3:1,4:2,5:3,6:4,7:4
},Hr=[["ям","ам"],["ями","ами"],["ях","ах"]],Jr={3:0,5:1,6:2,7:2
},Xr=["жки","шки","чки","ножны"],Yr=["кн","кл","дк","нк","пк","зк","рк","тк","вк","лк","мк"],Kr=["сестры","сёстры","серьги"],Qr=["льц","сьм","деньг","ьк","йк","дьб"],Zr=["земли","петли","пли","вли"],$r=["зять","деверь"]
;function ne(n,r,e,t){var u=U(t),i=F(u),s=_(i),a=e+1;if(1===a||4===a&&!r.isAnimate())return t
;if(134217984&s)if(2===a||4===a){if(u.endsWith("овичи")||u.endsWith("евичи"))return D(t)+"ей"
;if((u.endsWith("вны")||u.endsWith("полусотни"))&&"овны"!==u)return R(t,2)+"ен"}else if(5===a){
if((u.endsWith("дети")||u.endsWith("люди"))&&!u.endsWith("нелюди"))return D(t)+"ьми"
;if(u.endsWith("вери")||u.endsWith("дочери"))return[D(t)+"ями",D(t)+"ьми"]}
var f=J(r),c=u.endsWith("цы")?D(t):An(t,u),h=fn(u,Ln)&&(r.isASurname()||4===f)&&!fn(u,Nr),o=qr[Gr[a]]
;if(h||u.endsWith("ничьи"))return t+o[0];if(u.endsWith("ые"))return R(t,2)+o[1]
;if(u.endsWith("ие")||fn(u,Sn))return c+o[2];if(a>2&&4!==a){var l=Hr[Jr[a]]
;return fn(u,Cr)?D(t)+l[0]:n.sd.hasStressedEndingPlural(r,e).includes(!0)?P(c)+l[1]:c+l[1]}
var d=r.getDeclension(),p=function(){var i=U(c)
;if(G(i,Yr)&&!u.endsWith("сумерки")||"зл"===i||G(u,Xr)&&n.sd.hasStressedEndingPlural(r,e).includes(!0)){var s=F(c)
;return D(c)+L("о",s)+s}if(fn(u,Fr)&&!u.endsWith("недра")||G(u,Xr)){var a=B(t,2);return R(t,2)+L("е",a)+a}if(G(u,Kr)){
var f=B(t,2);return("ь"===B(u,3)?P(R(t,3)):P(R(t,2)))+L("ё",f)+f}if(G(i,Qr)){var h=F(c);return R(c,2)+L("е",h)+h}
return u.endsWith("сла")||u.endsWith("слы")?D(c)+"ел":c};if([3,0].includes(d)){if(u.endsWith("и"))return D(t)+"ей"
;if(function(n){return"гроздья"===n}(u))return D(t)+"ев"}var v=B(u,3);if(1!==f){var g=function(n,r){
return r.hasInteger(T(n))}(u,Lr);if(g&&function(n){return Tr.has(n)}(u))return D(t)+"ов";if(g&&function(n){
return Mr.has(n)}(u)&&!r.isAName())return[p(),D(t)+"ов"];if(g&&function(n){return Ur.has(n)}(u))return[D(t)+"ов",p()]
;if(4===f&&!Br(u)&&!q("жшч",v)||function(n,r){return r.hasInteger(T(n))}(u,kr)&&function(n){return jr.has(n)
}(u)||r.isAName()&&2===f&&r.lower().endsWith("а")||"барин"===r.lower())return p();switch(i){case"и":case"я":
if(fn(u,Vr)||"щи"===u||Br(u)||r.lower().endsWith("ь")&&!G(r.lower(),$r))return("ь"===F(D(u))?R(t,2):D(t))+"ей"
;if("и"===i)return function(n){return n.endsWith("ульи")
}(u)?D(t)+"ев":u.endsWith("ьи")?2===f?D(t)+"ёв":R(t,2)+"ей":function(n){
return["ча","кле","холу","ху"].includes(n.slice(0,-1))}(u)?D(t)+"ёв":u.endsWith("ищи")?p():function(n){
return n.endsWith("мессии")
}(u)?D(t)+"й":C(O,B(u,2))?D(t)+"ев":!fn(u,zr)||2===f&&!fn(P(u),Rr)||fn(r.lower(),Dr)?D(t)+"ов":p()
;if(fn(u,Pr))return D(t)+"ев";if(function(n){return G(n,["зятья","кумовья","деверья","края","острия"])
}(u))return D(t)+"ёв";if(function(n){return G(n,["ья","ия"])}(u))return 2===f?R(t,2)+"ей":R(t,2)+"ий";break;case"а":
var A=function(n){return n.endsWith("семена")?"семена":n.endsWith("стремена")?"стремена":null}(u)
;return A?R(t,3)+"ян":function(n){return!n.endsWith("мена")||n.endsWith("семена")||n.endsWith("стремена")?null:"мена"
}(u)?R(t,3)+"ён":r.lower().endsWith("яйцо")?L("яиц",D(t)):u.endsWith("нца")?[p(),D(t)+"ев"]:fn(u,xr)?D(t)+"ов":p()
;case"ы":return function(n){
return n.endsWith("ницы")||n.endsWith("лицы")||n.endsWith("пицы")||n.endsWith("бицы")?n.slice(-3):null
}(u)?D(t):u.endsWith("цы")?D(t)+"ев":D(t)+"ов";default:if(function(n){return n.endsWith("не")}(u))return p()}}
if(function(n){return n.endsWith("йки")}(u))return R(t,3)+"ек";if(u.endsWith("ки")){if("ь"===v){var W=F(D(t))
;return R(t,3)+L("е",W)+W}if(q("жшч",v))return p();if(C(N,v))return R(t,2)+"ок"}if(Br(u))return D(t)+"ей"
;if(function(n){return G(n,["аи","ои","еи","эи","уи"])}(u))return D(t)+"й";if(function(n){return"свечи"===n
}(u))return[D(t),D(t)+"ей"];if(function(n){return"пригоршни"===n}(u))return[D(t)+"ей",R(t,2)+"ен"];if(function(n){
return"тихони"===n}(u))return[R(t,2)+"нь",D(t)+"ей"];if(function(n){return G(n,["ьи","ии"])
}(u))return n.sd.hasStressedEndingSingular(r,e).includes(!0)?R(t,2)+"ей":R(t,2)+"ий";if(function(n){
return n.endsWith("ни")&&C(N,B(n,3))}(u))return function(n){return["барышни","боярышни","деревни"].includes(n)
}(u)?R(t,2)+"ень":function(n){return n.endsWith("кухни")}(u)?R(t,2)+"онь":function(n){return"сотни"===n
}(u)?[R(t,2),R(t,2)+"ен"]:R(t,2)+"ен";if(U(c).endsWith("ийк"))return R(c,2)+"ек";if(c.length===u.length-1&&fn(u,Cr)){
var m=B(c,2).charCodeAt(0);if(m!==E+9&&m!==E+28&&m!==S+9&&m!==S+28||r.isAnimate())return G(u,Zr)?D(c)+"ель":c+"ь"
;var b=F(c);return R(c,2)+L("е",b)+b}return p()}var re=function(){function n(){this.sd=function(){var n,r=sn()
;function e(e,t){for(var u=t.split(","),i=0;i<u.length;i++){var s=u[i];n.text=s,r.put(n,e)}}return n={pluraleTantum:!0},
e("SSSSSSS-SSSSSS","ножны"),n={gender:s.MASCULINE},e("SSSSSSS-SSSSSS","брёх,дёрн,идиш,имидж,мед,упрёк"),
e("SSSSSSS-EEEEEE","адрес,век,вечер,город,детдом,поезд,спецсчёт,субсчёт"),
e("SSSSSSE-EEEEEE","берег,бок,вес,лес,снег,дом,катер,счёт,мёд"),e("SSSSSSS-bbbbbb","вексель,ветер"),
e("SSSSSSE-ESEEEE","глаз"),e("SSSSSSE-bEEbEE","год"),e("SSSSSSb-bbbbbb","цех"),e("SbbSbbb-bbbbbb","грош,шприц"),
e("SssSsss-ssssss","кишмиш,кряж,слеш,слэш"),e("SEESeEE-EEEEEE","стеллаж"),e("SeeSeee-eeeeee","шиномонтаж"),n={
gender:s.MASCULINE,animate:!0},e("Sssssss-ssssss","паныч"),e("SSSSSSS-SSSSSS","балансёр,шофёр"),n={gender:s.NEUTER},
e("EEEEEEE-SsESEE","плечо"),
e("EEEEEEE-SSSSSS","тесло,стекло,автостекло,бронестекло,оргстекло,пеностекло,смарт-стекло,спецстекло,бедро,берцо,блесна,чело,стегно,стебло"),
n={gender:s.FEMININE},e("EEEbEEE-SSESEE","щека"),e("EEEEEEE-SSESEE","слеза"),e("EEEEEEE-SESSSS","семья,макросемья"),
e("EEEEEEE-SEESEE","вожжа,свеча"),e("EEESEEE-SSSSSS","душа"),e("EEEEEEE-eEeeee","скамья"),
e("EEEEEEE-EEEEEE","башка,кишка,ладья,лапша,моча,пыльца,статья"),n={gender:s.FEMININE,animate:!0},
e("EEEEEEE-SESESS","свинья,овца"),n={gender:s.COMMON,animate:!0},e("EEEEEEE-SSSSSS","судья"),
e("EEEEEEE-EEEEEE","левша"),r}()}var r=n.prototype;return r.decline=function(n,r,e){var t=H.create(n)
;return V(e?U(e.charAt(0))!==e.charAt(0):t.lower().charCodeAt(0)!==t.text().charCodeAt(0),ee(this,t,r,e))},
r.pluralize=function(n){var r=H.create(n)
;return r.isPluraleTantum()?[r.text()]:V(r.lower().charCodeAt(0)!==r.text().charCodeAt(0),_r(this,r))},
r.getLocativeForms=function(n){var r=this,e=H.create(n),t=e.getDeclension();if(t&&t>=0){var u=Pn.get(Vn(e))
;if(u instanceof Array)return u.map(function(n){return new c(function(n){switch(1+(n>>3&7)){case o.V:return"в"
;case o.VO:return"во";case o.NA:return"на"}}(n),function(n,r,e,t){var u=5;switch(r){case 0:return Mn(n,e,u);case 1:
return Qn(n,e,t);case 2:return Un(n,e,u);case 3:return Tn(n,e,u)}}(r,t,e,d(n)),n>>6)})}return[]},n}()
;function ee(n,r,e,u){var i=function(n,r,e,u){var i=r.text(),s=t[e],a=r.getDeclension();if(r.isIndeclinable())return i
;if(r.isPluraleTantum())return ne(n,r,s,i);if(u)return ne(n,r,s,u);switch(a){case-1:return i;case 0:return Mn(n,r,s)
;case 1:return Xn(n,r,s);case 2:return Un(n,r,s);case 3:return Tn(n,r,s)}}(n,r,e,u);return i instanceof Array?i:[i]}
return n.CASES=r,n.Case=e,n.Engine=re,n.Gender=s,n.Lemma=H,n.LocativeForm=c,n.LocativeFormAttribute=h,
n.createLemma=function(n){return H.create(n)},n.createLemmaOrNull=function(n){return H.createOrNull(n)},n}({});
//# sourceMappingURL=RussianNouns.es5.js.map
