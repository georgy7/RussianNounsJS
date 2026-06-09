/*!
  RussianNounsJS v3.0.0-alpha.2
  Copyright (c) 2011-2026 Georgy Ustinov
  Released under the MIT license
*/
"use strict"
;const e=Object.freeze(["именительный","родительный","дательный","винительный","творительный","предложный","местный"]),n=Object.freeze({
NOMINATIVE:e[0],GENITIVE:e[1],DATIVE:e[2],ACCUSATIVE:e[3],INSTRUMENTAL:e[4],PREPOSITIONAL:e[5],LOCATIVE:e[6]
}),t=Object.fromEntries(e.map((e,n)=>[e,n]));function r(e){return"number"==typeof e?e:t[e]}
const s=Object.freeze(["женский","мужской","средний","общий"]),i=Object.freeze({FEMININE:s[0],MASCULINE:s[1],
NEUTER:s[2],COMMON:s[3]}),u=1,c=2,o=3;function a(e){const n=new Set;let t=0;for(let r of e)t+=r,n.add(t);return n}
function f(e){return 1<<e}function h(e,n,t){this.preposition=e,this.word=n,this.attributes=t}const l=Object.freeze({
CONTAINER:1,LOCATION:2,STRUCTURE:4,SURFACE:8,WAY:16,OBJECT_WITH_FUNCTIONAL_SURFACE:32,SUBSTANCE:64,RESOURCE:128,
CONDITION:256,EXPOSURE:f(9),MOTION:f(10),EVENT:f(11),WITH_ADJECTIVE:f(12),WITHOUT_ADJECTIVE:f(13)}),d=Object.freeze({
V:1,VO:2,NA:3});function E(e,n,t){return t<<6|(e-1&7)<<3|n-1&7}function S(e){return 1+(7&e)}
const g="а".charCodeAt(0),p="А".charCodeAt(0),A="ё".charCodeAt(0),W="Ё".charCodeAt(0),m=1025===W,b=m?1024:W,w=m?1039:W,_=m?1104:A,C=m?1119:A,O=_-b
;function I(e){const n=e.charCodeAt(0),t=n-g;return n===A?32:t===(31&t)?1<<t:0}function x(e,n){return 0!==(e&I(n))}
const N=3892855073,T=66567902,y=66567390;function M(e){return x(N,e)}function U(e){return e.split("").filter(M).length}
function j(e){let n=5381;const t=e.length;for(let r=0;r<t;r++)n=33*n+e.charCodeAt(r)|0;return n>>>0}function L(e){
const n=e.replaceAll("ё","е");let t=n.length%2,r=1,s=5381;function i(){s=(33*s+(255&t))%4294967296,t>>=8,r-=8}
for(let e of n){const n=e.charCodeAt(0)-g&31;t|=n<<r,r+=5,r>=8&&i()}r>0&&i();const u=n.charCodeAt(0)%2
;return 2*(2147483647&s)+u}function k(e){for(let n=0;n<e.length;n++){const t=e.charCodeAt(n)
;if(t>=p&&t<=p+31||t>=b&&t<=w)break;if(n===e.length-1)return e}let n=new Array(e.length);for(let t=0;t<e.length;t++){
let r=e.charCodeAt(t);r>=p&&r<=p+31?r+=32:r>=b&&r<=w&&(r+=O),n[t]=r}return String.fromCharCode.apply(null,n)}
function V(e){if(m)return e.toLowerCase();let n=new Array(e.length);for(let t=0;t<e.length;t++){let r=e.charCodeAt(t)
;r>=p&&r<=p+31||r>=65&&r<=90?r+=32:r>=b&&r<=w&&(r+=O),n[t]=r}return String.fromCharCode.apply(null,n)}function P(e,n){
return n===V(n)?e:function(e){let n=new Array(e.length);for(let t=0;t<e.length;t++){let r=e.charCodeAt(t)
;r>=g&&r<=g+31?r-=32:r>=_&&r<=C&&(r-=O),n[t]=r}return String.fromCharCode.apply(null,n)}(e)}function z(e){
if(0===e.length)return"";const n=e.charCodeAt(0)
;return n>=g&&n<=g+31?String.fromCharCode(n-32)+e.slice(1):n>=_&&n<=C?String.fromCharCode(n-O)+e.slice(1):e}
function R(e,n){return e?n.map(z):n}function D(e){return e.replaceAll("ё","е").replaceAll("Ё","Е")}function v(e,n){
return e.substring(0,e.length-n)}function F(e,n){return e.substring(e.length-n)}function B(e){return v(e,1)}
function q(e){return G(e,1)}function G(e,n){return e[e.length-n]||""}function H(e,n){return 1===n.length&&e.includes(n)}
function J(e,n){return n.some(n=>e.endsWith(n))}class X{constructor(e){e instanceof X?(this._txt=e._txt,this._lc=e._lc,
this._hash=e._hash,this._flags=e._flags):(e.pluraleTantum?this._flags=5:this._flags=1+s.indexOf(e.gender),
this._txt=e.text,this._lc=V(e.text),this._hash=L(this._lc),this._flags|=8*(1&e.indeclinable),
this._flags|=16*(1&e.animate),this._flags|=32*(1&e.surname),this._flags|=64*(1&e.name),this._flags|=128*(1&e.transport),
this._flags|=f(16)*(2+function(e,n,t,r){if(n)return-2;if(r)return-1;const s=q(e);switch(t){case 1:
return"а"===s||"я"===s?2:x(T,s)?-1:3;case 2:return"а"===s||"я"===s?2:"путь"===e?0:1;case 3:
return["дитя","полудитя"].includes(e)?0:"мя"===F(e,2)?3:1;case 4:return"а"===s||"я"===s?2:"и"===s?-1:1;default:return-2}
}(this._lc,e.pluraleTantum,Y(this),e.indeclinable)))}static create(e){if(e instanceof this)return e;const n=Q(e)
;if(n)throw new Error(n);return Object.freeze(new this(e))}static createOrNull(e){
return null===Q(e)?Object.freeze(new this(e)):null}equals(e){
return e instanceof X&&this._flags===e._flags&&this.lower()===e.lower()}text(){return this._txt}lower(){return this._lc}
isPluraleTantum(){return 5==(7&this._flags)}getGender(){const e=Y(this);if(e>=1&&e<=4)return s[e-1]}isIndeclinable(){
return!!(8&this._flags)}isAnimate(){return!!(16&this._flags)||this.isASurname()||this.isAName()}isASurname(){
return!!(32&this._flags)}isAName(){return!!(64&this._flags)}isATransport(){return!!(128&this._flags)}getDeclension(){
return(this._flags>>16)-2}getSchoolDeclension(){const e=this.getDeclension();return 1===e?2:2===e?1:e}}function Y(e){
return 7&e._flags}function K(e,n){const t=new X(e);return t._txt=n,t._lc=V(n),t._hash=L(t.lower()),Object.freeze(t)}
function Q(e){if(null==e)return"No parameters specified."
;for(let n of["pluraleTantum","indeclinable","animate","surname","name","transport"]){
if((e=>null!=e&&"boolean"!=typeof e)(e[n]))return n+" must be boolean."}
if(null==e.text)return"A cyrillic word required.";if(!e.pluraleTantum){
if(null==e.gender)return"A grammatical gender required.";if(!s.includes(e.gender))return"Bad grammatical gender."}
return null}
const Z=a([11720389,548,1024,1479,2622,2867,1222,2642,264,1328,137,123,397,65542229,212447047,31729170,8094836,1056,21701789,35520559,40358,21819,28248,119786,63892,31809,7356,74383,72369,5945,28902,90120738,21187517,91925642,3054826,1600765,65934,30948851,5569212,4205640,5412804,6787095,9749916,3940084,1511466,1303038,16090470,1376628,49919694,3827522,37915959,14032615,28701924,224587434,637275762,51079457,391103676,24108070,158999424,232633267,6058815,66599250,692781441,816204112,55209380,72754,90006,80058,45564,67845,42548,27193,21401,139393,750335,170896,4424,1566,6264,154969,17292,17229,175112,83011,117872,4183,13065,108972,108088,343663,66210,334,17090,380271,283272,59007,35796,230801,1067156,19992,157124,12433,252644,2626,23776,630482,531296,304718,90891,726,23116,47653,30493,167310,50156,123071,477118,241821,55660,908992,534269,205157,11218,2490,660,66391,46856,847526,68710,8450,36630,15642,109864,41716,354482,79820,51876,97325,5506,46436,191803,3957,40876,126323,2347821,338490,73216,475569,87602,29642,4220,10760,16896,50156,17424,35178,167244,126786,33643,30488,65045,35961,51453,55660,4,152461,138332,1958,34200,3709,61381,17424,30158,80591,11218,44099,260487]),$=a([11720389,548,1024,1060,4,5904,1848,4404,330555234,4691346,3365076,1045362,7414584,960432,10564312,253286,16178203,4357,4355,11350,31120,5248,40591,62367,54057,50487,13069,3664,39764,10263,3002,5810,8844,24551,4091,56761,21785,30553,55147139,15960625,1933097,12258067,16302047,54210486,45688435,1659767,4813249,33577763,2501798,10056946,672528,14209351,2012340,1655412,4652736,62568,148698,21186,71129124,260014161,108045611,1007583269,2026464,22799532,750068913,1499532,1285428194,74598,22348,6599,132273,309821,156816,397448,179394,148036,100257,21779,11218,36631,345954,50442,104394,2724,112115,30690,10552,31377,11286,7168,14612,51480,116537,192258,163145,65604,97951,1363157,212810,431243,2622,425588,275284,150351,570568,244701,16659,26136,130134,11040,159389,728373,3476,726,1290392,224730,189158,11218,2490,10750,21608,143747,65974,664563,84036,16283,17424,5758,45080,33066,1782,90658,37101,56107,233163,14216,5518,179264,2525,146957,111342,80594,2309,4217,25432,26905,29980,518951,1458289,523705,4202,477865,149368,126310,47828,212678,22744,269176,179119,4399,35997,69696,41777,41,127336,4202,73153,46372,114255,126869,23630,11218])
;class ee{constructor(){this._filter=new Uint8ClampedArray(512)}addInteger(e){this._filter[re(ne(e))]|=se(ne(e)),
this._filter[re(te(e))]|=se(te(e))}hasInteger(e){
return!!(this._filter[re(ne(e))]&se(ne(e)))&&!!(this._filter[re(te(e))]&se(te(e)))}clone(){const e=new ee
;return e._filter=Uint8ClampedArray.from(this._filter),e}}function ne(e){return 4095&e}function te(e){
return 4095&(e>>>12^e>>>24)}function re(e){return e>>>3}function se(e){return 1<<7-(7&e)}const ie=function(){
const e=new ee;return Z.forEach(n=>e.addInteger(n)),$.forEach(n=>e.addInteger(n)),Object.freeze(e)}();function ue(){
const e=new Map,n=ie.clone(),t=e=>4294967296*(31&e._flags)+e._hash,s=e=>e.lower().indexOf("ё")+1&255,i=n=>{
const r=65504&n._flags,i=(n=>{const r=e.get(t(n));return r instanceof Array?r:[]
})(n).filter(e=>(e[0]&r)<=r),u=i.filter(e=>e[0]>>16===s(n));return u.length?u[0][1]:i.length?i[0][1]:void 0},u=e=>{
switch(e){case"E":return[!0];case"e":return[!0,!1];case"b":case"s":return[!1,!0];default:return[!1]}};return{put(r,i){
const u=i.split("-"),c=(e,n)=>e.length!==n||e.split("").some(e=>!"SsbeE".includes(e))
;if(2!==u.length||c(u[0],7)||c(u[1],6))throw new Error("Bad settings format.");const o=X.create(r),a=t(o);let f=e.get(a)
;f instanceof Array||(f=[],e.set(a,f));const h=65535&o._flags|s(o)<<16,l=f.find(e=>h===e[0]);l?l[1]=i:f.push([h,i]),
n.addInteger(o._hash)},hasStressedEndingSingular(e,t){if(n.hasInteger(e._hash)){const n=r(t);if(n>=0){const t=i(e)
;if(t){const e=t.split("-")[0];return u(e[n])}if(2===Y(e)){if(Z.has(e._hash))return u("SEESEEE"[n])
;if($.has(e._hash))return u("SEEEEEE"[n])}}}return[]},hasStressedEndingPlural(e,t){if(n.hasInteger(e._hash)){
const n=r(t);if(n>=0&&n<6){const t=i(e);if(t){const e=t.split("-")[1];return u(e[n])}
if(2===Y(e)&&(Z.has(e._hash)||e.isAnimate()&&$.has(e._hash)))return u("E")}}return[]}}}function ce(e){let n=new Map
;for(let t of e){let e=n;for(let n=t.length-1;n>=0;n--){const r=t.charCodeAt(n);if(n>0){const n=e.get(r);if(0===n)break
;void 0===n&&e.set(r,new Map),e=e.get(r)}else e.set(r,0)}}return n}function oe(e,n){let t=n
;for(let n=e.length-1;n>=0;n--){const r=e.charCodeAt(n);if(!t.has(r))return!1;{const e=t.get(r);if(0===e)return!0;t=e}}}
const ae=ce(["ое","нький","ский","ской","лстой","отой","утой","евой","овой","живой"]),fe=ce(["ее","ое","нький","ский","ской","лстой","отой","утой"]),he=ce(["евой","овой","отой","живой"]),le=ce(["шний","жний","щий","ший","жий","чий"]),de=["божий","ажий","яжий","ужий","южий","бульдожий","кабарожий","медвежий","носорожий","миножий"],Ee=ce(de),Se=ce(de.map(e=>v(e,2)+"ьи")),ge=new Set(["бубен","бугор","ветер","вошь","вымысел","горшок","деготь","дёготь","дятел","домысел","замысел","кашель","коготь","лапоть","лоб","локоть","ломоть","молебен","мох","ноготь","овен","пепел","пес","пёс","петушок","помысел","порошок","промысел","псалом","пушок","ров","рожь","рот","сон","стебель","стишок","угол","умысел","хребет","церковь","шов","ковер","овес","костер"].map(L)),pe=new ee
;ge.forEach(e=>pe.addInteger(e))
;const Ae=ce(["овёс","ковёр","костёр","шатер","шатёр","козел","козёл","котел","котёл","орел","орёл","осел","осёл","узел","уголь","чок","ешок","хол"])
;function We(e,n){const t=q(n);if(x(-402111711,t)){if(x(N,G(n,2))){const t=v(e,2);return oe(n,Ee)?t+P("ь",t):t}
if("й"!==t)return B(e)}return e}const me=["ясень","бюллетень","олень","тюлень","гордень","пельмень","ячмень"]
;function be(e,n,t){const r=e.text(),s=q(n),i=I(s);let u;return-133667019&i&&(-402111711&i?u=function(e,n,t){
const r=G(n,2);return"ь"===r||"о"===t&&x(2504708,r)?B(e):We(e,n)}(r,n,s):"к"===s?u=function(e,n,t){
return e.length>=4&&J(n,["рёк","нёк","лёк"])&&!1!==t?v(e,2)+"ьк":n.endsWith("ёк")&&x(N,G(n,3))?v(e,2)+"йк":void 0
}(r,n,t):"ь"===s?u=function(e,n,t){
return ge.has(e._hash)||oe(t,Ae)?v(n,3)+G(n,2):t.endsWith("ень")&&2===Y(e)&&!J(t,me)?v(n,3)+"н":B(n)
}(e,r,n):(["лёд","лед","лён"].includes(n)||"лев"===n&&e.isAnimate())&&(u=v(r,2)+P("ь",G(r,2))+q(r))),
u||(u=function(e,n,t){
return!!(199680&t)&&oe(n,Ae)&&!["новосел","новосёл"].includes(n)||!!(2571270&t)&&(pe.hasInteger(e._hash)&&ge.has(e._hash)||e.isAnimate()&&n.endsWith("посол"))
}(e,n,i)?v(r,2)+q(r):r),u}function we(e,n){const t=B(e),r=B(n.lower());if("а"===q(r))return t
;if(J(r,["зне","жне","гре","спе","мудре"])||F(B(r),3).split("").every(e=>x(y,e))||n.isAName())return t
;if("ле"===F(r,2)){const e=G(r,3);return x(N,e)||"л"===e?B(t)+"ь":t}
return x(N,q(r))&&"и"!==q(r)?x(N,q(B(r)))?v(e,2)+"й":J(n.lower(),["месяц"])?t:v(e,2):t}
const _e=ce(["лапоток","желток","нишок","ришок","ишек"]),Ce=["поток","приток","переток","проток","биоток","электроток","восток","водосток","водоток","воток","знаток"],Oe=["инок","исток","обморок","порок","пророк","сток","урок"]
;function Ie(e){
return J(e,["чек","шек"])&&e.length>=6||oe(e,_e)||e.endsWith("ок")&&!e.endsWith("шок")&&!Oe.includes(e)&&!J(e,Ce)&&!x(N,G(e,3))&&(x(N,G(e,4))||J(v(e,2),["ст","рт"]))&&e.length>=4
}function xe(e,n,t){return(e.length?e:[!1]).map(e=>t(e?D(n):n,e))}const Ne=0,Te=3,ye={дочь:"дочерь",мать:"матерь"}
;function Me(e,n,t){const r=n.text(),s=n.lower();if(![Ne,Te].includes(t)&&Object.keys(ye).includes(s)){
return Me(e,K(n,ye[s]),t)}let i=be(n,s);if(function(e){
return e.endsWith("полночь")||e.startsWith("пол")&&x(134217984,q(e))&&U(e)>=2}(s)&&(i="полу"+i.substring(3)),
"мя"===F(s,2))switch(t){case Ne:case Te:return r;case 1:case 2:case 5:case 6:return i+"ени";case 4:return i+"енем"
}else switch(t){case Ne:case Te:return r;case 1:case 2:case 5:case 6:return i+"и";case 4:
return J(s,["вошь","рожь","церковь"])?r+"ю":i+"ью"}}function Ue(e,n,t){const r=n.text(),s=n.lower()
;if(s.endsWith("путь"))return 4===t?B(r)+"ём":Me(e,n,t);if(!s.endsWith("дитя"))throw new Error("unsupported");switch(t){
case 0:case 3:return r;case 1:case 2:case 5:case 6:return r+"ти";case 4:return[r+"тей",r+"тею"]}}function je(e,n,t){
const r=n.text(),s=n.lower(),i=be(n,s),u=k(i),c=B(r),o=B(s),a=()=>"я"===q(s),f=()=>s.endsWith("ая")&&!(2===U(s)||x(N,q(u))),h=()=>s.endsWith("яя")&&!(2===U(s)||x(N,q(u))),l=["жая","шая"]
;switch(t){case 0:return r;case 1:
return h()||J(s,l)?i+"ей":f()?i+"ой":n.isASurname()&&!s.endsWith("да")?c+"ой":s.endsWith("ничья")?c+"ей":a()||x(60818504,q(u))?c+"и":c+"ы"
;case 2:case 5:case 6:
return h()||J(s,l)?i+"ей":f()?i+"ой":n.isASurname()&&!s.endsWith("да")?c+"ой":"ия"===F(s,2)?c+"и":s.endsWith("ничья")?c+"ей":c+"е"
;case 3:return f()?i+"ую":h()?i+"юю":a()?c+"ю":c+"у";case 4:
return h()||J(s,l)?i+"ею":f()?[i+"ой",i+"ою"]:a()||H("жшчщц",q(u))&&!e.sd.hasStressedEndingSingular(n,t).includes(!0)?"и"===q(o)?c+"ей":[c+"ей",c+"ею"]:[c+"ой",c+"ою"]
}}const Le=ce(["ов","ев","ёв","ин","ын"]),ke=function(e,n){let t=n;for(let n=0;n<e.length;n++){
const r=e.charCodeAt(n),s=t;t=new Map,t.set(r,s)}return t}("ы",Le);function Ve(e){
return e.filter((n,t)=>e.indexOf(n)===t)}function Pe(e){const n=1&e.lower().includes("ё")
;return 4294967296*((65535&e._flags)<<1|n)+e._hash}const ze=Object.freeze(function(){const e=new Map,n={
gender:i.MASCULINE},t={gender:i.MASCULINE,animate:!0};function r(n,t,r,s,i){
const u=s.split(","),c=i instanceof Array?i:[2];for(let s of u){n.text=s;const i=Pe(X.create(n));let u=e.get(i)
;u||(u=[],e.set(i,u));for(let e of r)for(let n of c)u.push(E(e,n,t))}}const s=[d.V],u=[d.VO],c=[d.NA]
;r(n,f(0),s,"мозг,пруд,стог,таз,год"),r(n,f(0),u,"рот"),r(n,f(4),s,"год"),r(n,f(0),s,"гроб"),r(n,f(0),u,"гроб",[1]),
r(n,f(1),s,"ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,низ,хлев"),r(n,f(2),s,"круг,полк,артполк,ряд,род,строй,лад"),
r(n,f(3),c,"баз,берег,бережок,вал,кон,круг,луг,пол,яр"),r(n,f(4),c,"век,день"),r(n,f(4),s,"час"),r(n,f(4),c,"корень"),
r(t,f(5),c,"вор"),r(n,f(5),c,"повод,бочок,борт,воз,горб,кол,мост,плот,сук,х"+String.fromCharCode(1091)+"й"),
r(n,f(5),c,"крюк,болт",[1,2]);const o=",мёд,мех,пар,пух";r(n,f(6),s,"дым,жир,мел,пушок"+o),
r(n,f(7),c,"газ,клей,спирт"+o),r(n,f(8),s,"бой,бред,быт,долг,плен,пыл,сок,ход,лад"),r(n,f(9),s.concat(c),"вид"),
r(n,f(9),c,"слух,счёт,ветер,ветр,свет"),r(n,f(10),c,"ход,бег,вес"),r(n,f(10)|f(12),c,"шаг"),r(n,f(11),c,"бал,пир"),
r(n,f(8),c,"дух,плав"),r(n,f(10)|f(12),c,"газ"),r(n,f(0),s,"глаз,зоб,нос,шкаф"),r(n,f(0),u,"лоб"),
r(n,f(5),c,"глаз,лоб,нос,шкаф,холм");let a="бок,верх,зад,угол";return r(n,f(1),s,a),r(n,f(5),c,a),
r(n,f(1)|f(13),s,"край"),r(n,f(5)|f(13),c,"край"),r(n,f(3),c,"лёд,мох,снег"),r(n,f(6),u,"лёд,лён,мох"),
r(n,f(6),s,"снег"),e
}()),Re=new Set("клей,чай,дом,дух,дым,дымок,газ,год,горошек,жар,жир,квас,пар,пыл,род,рост,сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,табак,творог,толк,торф,туман,убыток,укроп,уксус,ход,цемент,чеснок,шаг,шик,шиповник,шоколад,шорох,шум,яд".split(",")),De=new ee
;Re.forEach(e=>De.addInteger(L(e)))
;const ve=ce(["й","ие","иё"]),Fe=ce(["воробей","муравей","ручей","соловей","улей"]),Be=ce(["мой","ной","дой","шой","жой","рзой","осой","хой","латой","витой","литой","питой","житой","отой","утой","ятой","лагой","рагой","огой","угой","лубой","любой","илой","ылой","злой","малой","овой","евой","живой","ской","акой","укой","нний","ский","йкий","цкий","зкий","ткий","лкий","мкий","хкий","оркий","аркий","яркий","ький","ёкий","бокий","оокий","cокий","токий","ликий","дикий","укий","ыкий","який","пкий","дкий","бкий","нкий","жкий","чкий","гкий","овкий","авкий"])
;function qe(e,n){return"ый"===F(n,2)||(n.endsWith("кривой")||oe(n,Be))&&U(n)>=2}
const Ge=ce(["ий","ие","чье","тье","дье","вье","бье","жалованье","енье","ружье","божье","верье","мужье"]),He=ce(["вое","лое","мое","ное","рое","тое","той","ый"])
;function Je(e,n,t){const r=n.text(),s=n.lower(),i=q(s),u=e.sd.hasStressedEndingSingular(n,t);let c=be(n,s,u[0]),o=B(r)
;const a=Ye(s);a&&(c="полу"+c.substring(3),o="полу"+o.substring(3));let f=k(c)
;const h=()=>a&&s.endsWith("я")||Qe(s),l=oe(s,ve),d=()=>oe(s,Fe)?B(o)+P("ь",q(o)):o,E=()=>H("чщ",q(f));function g(e){
return!n.isAnimate()&&De.hasInteger(n._hash)&&Re.has(s)&&("й"===i?e.push(B(r)+P("ю",q(r))):e=e.concat(xe(u,c,e=>e+P("у",q(e))))),
e}switch(t){case 0:return r;case 1:switch(i){case"и":case"ы":if(a)return Xe(e,n,t,s);break;case"й":case"е":
if(l&&n.isASurname()||qe(0,s)||oe(s,ae))return c+"ого";if(oe(s,le)||s.endsWith("ее"))return c+"его";case"ё":case"я":
case"ь":if(l){return g([d()+"я"])}if(h()&&!E())return c+"я";break;case"ц":return we(r,n)+"ца";case"к":
if(Ie(s))return B(o)+"ка";break;case"о":if(J(s,["шко"])&&2===Y(n))return o+"и"}let p
;return p=n.isASurname()||-1===f.indexOf("ё")?[c+"а"]:xe(u,c,e=>e+"а"),g(p);case 2:switch(i){case"и":case"ы":
if(a)return Xe(e,n,t,s);break;case"й":case"е":if(l&&n.isASurname()||qe(0,s)||oe(s,ae))return c+"ому"
;if(oe(s,le)||s.endsWith("ее"))return c+"ему";case"ё":case"я":case"ь":if(l)return d()+"ю";if(h()&&!E())return c+"ю"
;break;case"ц":return we(r,n)+"цу";case"к":if(Ie(s))return B(o)+"ку"}
return n.isASurname()||-1===f.indexOf("ё")?c+"у":xe(u,c,e=>e+"у");case 3:
return 3===Y(n)||H("иы",i)&&a?r:n.isAnimate()?Je(e,n,1):r;case 4:switch(i){case"и":case"ы":if(a)return Xe(e,n,t,s);break
;case"й":case"е":case"ё":case"я":case"ь":if(l&&n.isASurname()||oe(s,fe))return oe(s,He)?c+"ым":c+"им"
;if(qe(0,s))return"и"===G(s,2)||s.endsWith("хой")?c+"им":c+"ым";if(oe(s,he))return c+"ым";if(oe(s,le))return c+"им"
;if(l)return d()+"ем";if(s.endsWith("це"))return r+"м";break;case"ц":return xe(u,r,(e,t)=>t?we(e,n)+"цом":we(e,n)+"цем")
;case"к":if(Ie(s))return B(o)+"ком";break;case"н":case"в":if(n.isASurname()&&oe(s,Le))return r+"ым"}
return h()||H("жшчщ",q(f))?xe(u,c,(e,n)=>n?e+"ом":e+"ем"):n.isASurname()||-1===f.indexOf("ё")?c+"ом":xe(u,c,e=>e+"ом")
;case 6:if("полпути"===s)return r;const A=ze.get(Pe(n));if(A){return Ve(A.map(e=>S(e))).map(t=>Ke(e,n,t))}case 5:
switch(i){case"и":if("полпути"===s)return r;case"ы":if(a)return Xe(e,n,t,s);break;case"й":case"е":case"ё":case"я":
case"ь":if(l&&n.isASurname()||qe(0,s)||oe(s,ae))return c+"ом";if(oe(s,le)||s.endsWith("ее"))return c+"ем"
;if(J(s,["воробей"])){const e=B(o);return e+P("ье",q(e))}
if(oe(s,Ge)&&!J(s,["запястье","здоровье","изголовье","платье"]))return o+"и";if("й"===i||"иё"===F(s,2))return d()+"е"
;break;case"ц":return we(r,n)+"це";case"к":if(Ie(s))return B(o)+"ке"}
return n.isASurname()||-1===f.indexOf("ё")?c+"е":xe(u,c,e=>e+"е")}}function Xe(e,n,t,r){
const s=()=>"полминуты"!==r?"полу"+n.text().substring(3):n.text();if("полпути"===r){return Ue(e,K(n,B(s())+"ь"),t)}
if(r.endsWith("зни")||r.endsWith("сти")){return Me(e,K(n,B(s())+"ь"),t)}
return je(e,K(n,B(s())+("ни"===F(r,2)?"я":"а")),t)}function Ye(e){
if(e.startsWith("пол")&&x(2550137089,q(e))&&"л"!==e[3]&&U(e)>=2){let n=e.substring(3),t=n.search(/[а-яё]/)
;return t>=0&&x(T,n[t])}return!1}function Ke(e,n,t){if(2===t){const e=n.text(),t=n.lower();let r=be(n,t),s=B(e)
;const i=Ye(t)&&t.endsWith("я")||Qe(t);return"й"===q(t)?D(s)+"ю":i?D(r)+"ю":Ie(t)?D(B(s))+"ку":D(r)+"у"}
if(1===t)return Je(e,n,5)}function Qe(e){return"ь"===q(e)&&!e.endsWith("господь")||H("её",q(e))&&!J(e,["це","же"])}
const Ze={[c]:{all:{болгарин:["болгары"],господин:["господа"],дядя:["дяди","дядья"],зуб:["зубы","зубья"],
клок:["клочья","клоки"],князь:["князи","князья"],кол:["колы","колья"],месяц:["месяцы"],полдень:["полдни","полудни"],
татарин:["татары"],хозяин:["хозяева"],цветок:["цветки","цветы"],черт:["черти"],чёрт:["черти"],
электротрактор:["электротракторы","электротрактора"],"мини-трактор":["мини-трактора"]},animateOnly:{
авиаконструктор:["авиаконструктора","авиаконструкторы"],автоинспектор:["автоинспектора","автоинспекторы"],
"арт-директор":["арт-директора"],бесёнок:["бесенята"],"вице-директор":["вице-директора"],
госавтоинспектор:["госавтоинспектора","госавтоинспекторы"],госинспектор:["госинспектора"],
кондуктор:["кондуктора","кондукторы"],конструктор:["конструктора","конструкторы"],кум:["кумовья"],
корректор:["корректора","корректоры"],муж:["мужья","мужи"],охотинспектор:["охотинспектора"],
пристав:["пристава","приставы"],проспектор:["проспектора"],редактор:["редактора","редакторы"],
ректор:["ректора","ректоры"],санинструктор:["санинструктора","санинструкторы"],слесарь:["слесари","слесаря"],
сторож:["сторожа","сторожи"],вахтер:["вахтера","вахтёры"],фельдшер:["фельдшера","фельдшеры"],
"член-корреспондент":["член-корреспонденты","члены-корреспонденты"],цыган:["цыгане","цыганы"]}},[u]:{all:{
гроздь:["грозди","гроздья"],курица:["курицы","куры"],стая:["стаи"],щека:["щёки"],береста:["берёсты"],верста:["вёрсты"],
десна:["дёсны"],жена:["жёны"],звезда:["звёзды"],кинозвезда:["кинозвёзды"],медсестра:["медсёстры"],метла:["мётлы"],
пчела:["пчёлы"],сестра:["сёстры"],слеза:["слёзы"]}},[o]:{all:{брюхо:["брюхи"],колено:["колена","колени","коленья"],
древо:["древа","древеса"],ухо:["уши"],око:["очи"],дно:["донья"],чудо:["чудеса","чуда"],небо:["небеса"],
бревно:["брёвна"],ведро:["вёдра"],веретено:["веретёна"],весло:["вёсла"],гнездо:["гнёзда"],зерно:["зёрна"],
знамя:["знамёна"],колесо:["колёса"],облачко:["облачка"],озеро:["озёра"],полсотни:["полусотни"],ребро:["рёбра"],
ремесло:["ремёсла"],седло:["сёдла"],село:["сёла"]}}},$e=new ee
;for(const e of Object.values(Ze))for(const n of Object.values(e))for(const e of Object.keys(n))$e.addInteger(L(e))
;const en=["зять","деверь","друг","брат","собрат","стул","брус","обод","полоз","струп","подмастерье","якорь","перо","шило"],nn=new Set(["берег","бок","борт","век","вес","веер","вексель","вечер","глаз","голос","город","директор","доктор","дом","детдом","егерь","жемчуг","катер","колокол","концлагерь","корм","короб","кузов","купол","кучер","лес","луг","мастер","номер","пояс","провод","рог","сахар","снег","сорт","стог","счет","счёт","спецсчет","спецсчёт","субсчет","субсчёт","терем","том","холод","хутор","цвет","череп"]),tn=ce(["округ","остров","отпуск","паспорт","парус","поезд","погреб","рукав","цех"]),rn=ce(["повар","юнкер"]),sn=new Set(["адрес","договор","буфер","ворох","инспектор","инструктор","корпус","крейсер","орден","ордер","прожектор","пропуск","род","свитер","сектор","сервер","тенор","тон","трактор","тормоз","ветер","верх","китель","мех","хлеб","юнкер","ястреб"]),un=new Set(["бункер","вымпел","год","лекарь","образ","омут","писарь","пудель","токарь","тополь","шторм","штуцер"]),cn=["крюк","лист","лоскут","повод","прут","сук","учитель","флигель","штабель"],on=["клин","колос","ком","край","соболь"],an=["дерево","звено","крыло"],fn=["безделье","варенье","воскресенье","жалованье","запястье","застолье","затишье","здоровье","зелье","изголовье","новоселье","одночасье","печенье","платье","побережье","поголовье","подворье","подземелье","подполье","поместье","предплечье","раздумье","сиденье","средневековье","увечье","угодье","устье"],hn=["воробей","муравей","ручей","соловей","улей","жеребей","ирей","репей","чирей"]
;function ln(e){return"барин"===e}function dn(e,n,t,r,s){const i=e.sd.hasStressedEndingPlural(n,0).map(e=>!e)
;return i.length?i.map(e=>e?1===r.replace(/[^её]/g,"").length?s(((e,n)=>{
const t=Math.max(n.lastIndexOf("е"),n.lastIndexOf("ё")),r=P("ё",e[t]);return e.substring(0,t)+r+e.substring(t+1)
})(t,r)):s(t):s(D(t))):[s(t)]}function En(e,n,t,r,s,i,u,c){
const o=[],a=()=>(i.endsWith("евич")||i.endsWith("евна"))&&i.indexOf("ье")>=0;function f(){
const e=c,n=k(e).indexOf("ье"),t=P("и",e[n]);return e.substring(0,n)+t+e.substring(n+1)}
return x(60818504,q(s))||H("яйь",q(i))||J(i,["сосед"])?a()?(o.push(f()+"и"),
o.push(c+"и")):o.push(...xe(u,c,e=>e+"и")):"ц"===q(i)?o.push(we(t,n)+"цы"):a()?(o.push(f()+"ы"),
o.push(c+"ы")):o.push(...xe(u,c,e=>e+"ы")),o}function Sn(e,n){
const t=n.text(),r=n.lower(),s=e.sd.hasStressedEndingPlural(n,0),i=be(n,r,s[0]),u=k(i)
;if(r.endsWith("яя"))return[v(t,2)+"ие"];const c=("й"===q(r)||x(N,q(r)))&&x(N,q(B(r)))?B(t):i,o=function(e,n){
if(!$e.hasInteger(e._hash))return;const t=Y(e),r=e.isAnimate(),s=Ze[t];if(!s)return;const i=s.animateOnly
;if(r&&i&&i.hasOwnProperty(n))return i[n].slice();const u=s.all;return u&&u.hasOwnProperty(n)?u[n].slice():void 0}(n,r)
;if(o)return o;const a=Y(n),f=n.getDeclension();if(-1===f)return[t];if(0===f){if("путь"===r)return["пути"]
;if(r.endsWith("дитя"))return[v(t,3)+"ети"];throw new Error("unsupported mixed declension word")}
return 1===f?function(e,n,t,r,s,i,u,c,o){
const a=[],f="ь"===q(i)?s:"к"===q(i)?B(s)+"чь":"г"===q(i)?B(s)+"зь":"й"===q(r)?B(t):J(r,["рь","ль"])?s:s+"ь"
;if(en.includes(r))return a.push(f+"я"),Ve(a);if(2===o){const o=function(e){
return"сын"===e?"сын":"человек"===e?"человек":null}(r);if("сын"===o)return a.push("сыновья"),
a.push(...En(0,n,t,0,i,r,u,c)),Ve(a);if("человек"===o)return a.push("люди"),a.push(...En(0,n,t,0,i,r,u,c)),Ve(a)
;if(function(e,n){return!!cn.includes(e)||!("соболь"!==e||!n.isAnimate())}(r,n))return a.push(...En(0,n,t,0,i,r,u,c)),
a.push(f+"я"),Ve(a);if(function(e){return on.includes(e)}(r))return a.push(f+"я"),Ve(a);const h=function(e){
return nn.has(e)?1:sn.has(e)?3:un.has(e)?4:0}(r),l=function(e,n){const t=n.isAnimate();return!t&&oe(e,tn)||t&&oe(e,rn)
}(r,n)
;return 0!==h||l?(4===h&&a.push(...En(0,n,t,0,i,r,u,c)),Qe(r)?a.push(...dn(e,n,s,i,e=>e+"я")):u.includes(!0)?a.push(D(s)+"а"):a.push(s+"а"),
3===h&&a.push(...En(0,n,t,0,i,r,u,c)),
Ve(a)):n.isAnimate()&&(r.endsWith("анин")||r.endsWith("янин"))&&!n.isAName()||function(e){return"боярин"===e
}(r)||ln(r)?(a.push(v(t,2)+"е"),ln(r)&&a.push(v(t,2)+"ы"),Ve(a)):function(e){return"цыган"===e}(r)?(a.push(t+"е"),
Ve(a)):function(e){return"щенок"===e}(r)?(a.push(v(t,2)+"ки"),a.push(v(t,2)+"ята"),Ve(a)):function(e){
return!(!e.endsWith("ребёнок")&&!e.endsWith("ребенок")||e.endsWith("жеребёнок")||e.endsWith("жеребенок")||e.endsWith("ястребёнок")||e.endsWith("ястребенок"))
}(r)?(a.push(v(t,7)+"дети"),Ve(a)):function(e,n){return(e.endsWith("ёнок")||e.endsWith("енок"))&&n.isAnimate()
}(r,n)?(a.push(v(t,4)+"ята"),Ve(a)):r.endsWith("ёночек")&&n.isAnimate()?(a.push(v(t,6)+"ятки"),Ve(a)):function(e,n){
return e.endsWith("онок")&&H("жшч",G(e,5))&&n.isAnimate()}(r,n)?(a.push(v(t,4)+"ата"),Ve(a)):Ie(r)?(a.push(v(t,2)+"ки"),
Ve(a)):oe(r,le)?(J(r,de)?a.push(v(t,2)+"ьи"):a.push(B(t)+"е"),
Ve(a)):qe(0,r)?(r.endsWith("ый")||r.endsWith("ий")?a.push(B(t)+"е"):r.endsWith("ой")&&!J(r,["хой","ской"])?a.push(v(t,2)+"ые"):a.push(v(t,2)+"ие"),
Ve(a)):r.endsWith("его")?(a.push(v(t,3)+"ие"),Ve(a)):function(e){return hn.includes(e)}(r)?(a.push(v(t,2)+"ьи"),
Ve(a)):(a.push(...En(0,n,t,0,i,r,u,c)),Ve(a))}if(3===o){if(function(e){
return J(e,["ко","чо"])&&!J(e,["войско","облако"])}(r))return a.push(B(t)+"и"),Ve(a);if(function(e){
return e.endsWith("имое")}(r))return a.push(s+"ые"),Ve(a);if(function(e){return e.endsWith("ее")
}(r))return a.push(s+"ие"),Ve(a);if(r.endsWith("ое"))return!function(e){return J(e,["г","к","ж","ш","х"])
}(i)?a.push(s+"ые"):a.push(s+"ие"),Ve(a);if(function(e){return J(e,["ие","иё"])}(r))return a.push(v(t,2)+"ия"),Ve(a)
;if(function(e){return J(e,["ье","ьё"])}(r)){const e=v(t,2);return"е"!==q(r)||function(e){return fn.includes(e)
}(r)||a.push(e+"ия"),a.push(e+"ья"),Ve(a)}return function(e){return J(e,an)}(r)?(a.push(s+"ья"),Ve(a)):function(e){
return J(e,["ле","ре"])}(r)?(a.push(s+"я"),Ve(a)):function(e,n){return e.endsWith("судно")&&n.isATransport()
}(r,n)?(a.push(v(t,2)+"а"),Ve(a)):(a.push(...dn(e,n,s,i,e=>e+"а")),function(e){return e.endsWith("щупальце")
}(r)&&a.push(...En(0,n,t,0,i,r,u,c)),Ve(a))}return a.push(s+"и"),Ve(a)
}(e,n,t,r,i,u,s,c,a):2===f?function(e,n,t,r,s,i,u,c){const o=[];if(function(e){return"заря"===e
}(r))return o.push("зори"),Ve(o);if(function(e){return e.endsWith("ая")&&!e.endsWith("свая")
}(r))return H("жхчшщ",q(i))||J(i,["вк","гк","ск","цк","ньк"])?o.push(s+"ие"):o.push(s+"ые"),Ve(o)
;return o.push(...En(0,n,t,0,i,r,u,c)),Ve(o)}(0,n,t,r,i,u,s,c):3===f?function(e,n,t,r,s,i,u,c,o){const a=[]
;if("мя"===F(r,2))return a.push(s+"ена"),Ve(a);if(Object.keys(ye).includes(r))return a.push(B(ye[r])+"и"),Ve(a)
;if(1===o)return a.push(c+"и"),Ve(a);"и"===q(c)?a.push(c+"я"):a.push(c+"а");return Ve(a)}(0,0,0,r,i,0,0,c,a):[t]}
const gn=ce(["ли","си","би","ви","ди","ти","пи","ри","ни","фи","зи","ьи","ья","ия","ря","ля","ая","аи","ои","уи","эи","ыи","яи","ёи","юи","еи","ии"]),pn=["беготни","болтовни","будни","вожжи","возни","доли","лапши","левши","люди","марли","моря","мощи","ноздри","пени","пятерни","распри","родни","сакли","сени","ступни","судьи","фигни","чукчи"],An=["головы","громадины","детины","деревенщины","дохлятины","дубины","ехидины","жадины","зверины","идиотины","кислятины","молодчины","орясины","остолопины","сиротины","скотины","старейшины","старины","старшины","уродины"],Wn=ce(An),mn=["адреса","паспорта","поезда","цеха","снега","бункера","буфера","берега","вымпела","голоса","города","договора","жемчуга","колокола","короба","корпуса","крейсера","кузова","леса","мастера","номера","облачка","острова","отпуска","паруса","повара","погреба","пояса","провода","пропуска","рукава","сахара","свитера","сервера","счета","тормоза","холода","хутора","цвета","черепа","шторма","штуцера","юнкера","ястреба","суда","фельдшера","кучера","пристава"],bn=ce([...mn,"ктора","хтера"]),wn=new Set([...mn,"бега","беглецы","близнецы","бойцы","бока","борта","борцы","бруствера","брюшки","веера","века","венцы","верха","веса","весы","вечера","вороха","глупцы","года","гонцы","дворцы","дельцы","детдома","детдомы","дома","жеребцы","жильцы","жрецы","затишки","зубцы","излишки","истцы","катера","концы","корма","кузнецы","купола","купцы","лишки","луга","мертвецы","меха","мудрецы","облака","образа","образцы","огурцы","округа","омута","ордена","ордера","отцы","очки","певцы","песцы","пловцы","подлецы","продавцы","птенцы","резцы","рога","рода","рубцы","самцы","свинцы","сорта","соуса","спецы","стога","столбцы","стрельцы","творцы","тельцы","тенора","терема","тома","тона","торцы","хлеба","штришки","юнцы"]),_n=new Set(["авары","аланы","аршины","баклажаны","буквы","гольфы","граммы","гусары","дела","кадеты","килограммы","омы","помидоры","рентгены","ботинки","человеки","чулки","шорты"]),Cn=new Set(["гектары","рельсы"]),On=new Set([...An,"абазины","авы","аввы","бедняги","бедолаги","болгары","бродяги","брызги","брюки","брюхи","будды","бусы","валенки","веки","вельможи","верзилы","вилы","владыки","воеводы","волосы","вояки","главы","грузины","задворки","задиры","железы","жилы","зануды","зеваки","именины","калеки","кальсоны","каникулы","колготки","коллеги","крохи","курицы","куры","ладоши","ламы","лыки","макароны","мужчины","нападки","нары","непоседы","носилки","ножны","папы","папаши","таты","падлы","партизаны","погоны","поминки","посиделки","похороны","предтечи","работяги","разы","ребятки","румыны","самоубийцы","санки","убийцы","сапоги","сатаны","сироты","сливки","слуги","солдаты","старосты","сумерки","сутки","татары","телеса","хитрюги","четвереньки","шляпы","шмотки","яблоки","дядьки","дяденьки","зайки","кроссовки","малютки","малолетки","попки","турки","узы","хлопоты","шахматы"]),In=new ee
;wn.forEach(e=>In.addInteger(j(e))),_n.forEach(e=>In.addInteger(j(e))),Cn.forEach(e=>In.addInteger(j(e)))
;const xn=new ee;On.forEach(e=>xn.addInteger(j(e)))
;const Nn=ce(["жи","ши","чи","ля","ли","чи","ри","ти","ди","сани","борщи","клещи","товарищи","плащи","прыщи","хрящи"]),Tn=ce(["братья","брусья","деревья","донья","звенья","клинья","клочья","коленья","колосья","колья","комья","крылья","крючья","листья","лоскутья","лохмотья","перья","платья","поводья","прутья","стулья","сучья","хлопья","шилья"]),yn=ce(["ишки","дружки","тки","папочки","дедушки","дядюшки","батюшки","катанки","петрушки","шестерки"]),Mn=ce(["жки","шки","чки","рки","натки","хатки","ятки","етки","чётки","мки","нки","педки","илки"]),Un=ce(["шок","щок","жок","зок","аток","яток","еток"]),jn=ce(["вна","вца","вцы","пла","дца","дра","судна","рки","рцы","тлы","рна","тна","енца","десны","дёсны","рёбра","ребра","сосны"])
;function Ln(e){return pn.includes(e)}
const kn=[["х","ых","их"],["м","ым","им"],["х","ых","их"],["ми","ыми","ими"],["х","ых","их"]],Vn={2:0,3:1,4:2,5:3,6:4,
7:4},Pn=[["ям","ам"],["ями","ами"],["ях","ах"]],zn={3:0,5:1,6:2,7:2
},Rn=["жки","шки","чки","ножны"],Dn=["кн","кл","дк","нк","пк","зк","рк","тк","вк","лк","мк"],vn=["сестры","сёстры","серьги"],Fn=["льц","сьм","деньг","ьк","йк","дьб"],Bn=["земли","петли","пли","вли"],qn=["зять","деверь"]
;function Gn(e,n,t,r){const s=k(r),i=q(s),u=I(i),c=t+1;if(1===c||4===c&&!n.isAnimate())return r
;if(134217984&u)if(2===c||4===c){if(s.endsWith("овичи")||s.endsWith("евичи"))return B(r)+"ей"
;if((s.endsWith("вны")||s.endsWith("полусотни"))&&"овны"!==s)return v(r,2)+"ен"}else if(5===c){
if((s.endsWith("дети")||s.endsWith("люди"))&&!s.endsWith("нелюди"))return B(r)+"ьми"
;if(s.endsWith("вери")||s.endsWith("дочери"))return[B(r)+"ями",B(r)+"ьми"]}
const o=Y(n),a=s.endsWith("цы")?B(r):We(r,s),f=oe(s,ke)&&(n.isASurname()||4===o)&&!oe(s,Wn),h=kn[Vn[c]]
;if(f||s.endsWith("ничьи"))return r+h[0];if(s.endsWith("ые"))return v(r,2)+h[1]
;if(s.endsWith("ие")||oe(s,Se))return a+h[2];if(c>2&&4!==c){const i=Pn[zn[c]]
;return oe(s,gn)?B(r)+i[0]:e.sd.hasStressedEndingPlural(n,t).includes(!0)?D(a)+i[1]:a+i[1]}{
const u=n.getDeclension(),c=()=>{const i=k(a)
;if(J(i,Dn)&&!s.endsWith("сумерки")||"зл"===i||J(s,Rn)&&e.sd.hasStressedEndingPlural(n,t).includes(!0)){const e=q(a)
;return B(a)+P("о",e)+e}if(oe(s,jn)&&!s.endsWith("недра")||J(s,Rn)){const e=G(r,2);return v(r,2)+P("е",e)+e}if(J(s,vn)){
const e=G(r,2);return("ь"===G(s,3)?D(v(r,3)):D(v(r,2)))+P("ё",e)+e}if(J(i,Fn)){const e=q(a);return v(a,2)+P("е",e)+e}
return s.endsWith("сла")||s.endsWith("слы")?B(a)+"ел":a};if([3,0].includes(u)){if(s.endsWith("и"))return B(r)+"ей"
;if(function(e){return"гроздья"===e}(s))return B(r)+"ев"}const f=G(s,3);if(1!==o){const e=function(e,n){
return n.hasInteger(j(e))}(s,In);if(e&&function(e){return wn.has(e)}(s))return B(r)+"ов";if(e&&function(e){
return _n.has(e)}(s)&&!n.isAName())return[c(),B(r)+"ов"];if(e&&function(e){return Cn.has(e)}(s))return[B(r)+"ов",c()]
;if(4===o&&!Ln(s)&&!H("жшч",f)||function(e,n){return n.hasInteger(j(e))}(s,xn)&&function(e){return On.has(e)
}(s)||n.isAName()&&2===o&&n.lower().endsWith("а")||"барин"===n.lower())return c();switch(i){case"и":case"я":
if(oe(s,Nn)||"щи"===s||Ln(s)||n.lower().endsWith("ь")&&!J(n.lower(),qn)){return("ь"===q(B(s))?v(r,2):B(r))+"ей"}
if("и"===i)return function(e){return e.endsWith("ульи")
}(s)?B(r)+"ев":s.endsWith("ьи")?2===o?B(r)+"ёв":v(r,2)+"ей":function(e){
return["ча","кле","холу","ху"].includes(e.slice(0,-1))}(s)?B(r)+"ёв":s.endsWith("ищи")?c():function(e){
return e.endsWith("мессии")
}(s)?B(r)+"й":x(N,G(s,2))?B(r)+"ев":!oe(s,Mn)||2===o&&!oe(D(s),yn)||oe(n.lower(),Un)?B(r)+"ов":c()
;if(oe(s,Tn))return B(r)+"ев";if(function(e){return J(e,["зятья","кумовья","деверья","края","острия"])
}(s))return B(r)+"ёв";if(function(e){return J(e,["ья","ия"])}(s))return 2===o?v(r,2)+"ей":v(r,2)+"ий";break;case"а":
const e=function(e){return e.endsWith("семена")?"семена":e.endsWith("стремена")?"стремена":null}(s)
;return e?v(r,3)+"ян":function(e){return!e.endsWith("мена")||e.endsWith("семена")||e.endsWith("стремена")?null:"мена"
}(s)?v(r,3)+"ён":n.lower().endsWith("яйцо")?P("яиц",B(r)):s.endsWith("нца")?[c(),B(r)+"ев"]:oe(s,bn)?B(r)+"ов":c()
;case"ы":return function(e){
return e.endsWith("ницы")||e.endsWith("лицы")||e.endsWith("пицы")||e.endsWith("бицы")?e.slice(-3):null
}(s)?B(r):s.endsWith("цы")?B(r)+"ев":B(r)+"ов";default:if(function(e){return e.endsWith("не")}(s))return c()}}
if(function(e){return e.endsWith("йки")}(s))return v(r,3)+"ек";if(s.endsWith("ки")){if("ь"===f){const e=q(B(r))
;return v(r,3)+P("е",e)+e}if(H("жшч",f))return c();if(x(y,f))return v(r,2)+"ок"}if(Ln(s))return B(r)+"ей"
;if(function(e){return J(e,["аи","ои","еи","эи","уи"])}(s))return B(r)+"й";if(function(e){return"свечи"===e
}(s))return[B(r),B(r)+"ей"];if(function(e){return"пригоршни"===e}(s))return[B(r)+"ей",v(r,2)+"ен"];if(function(e){
return"тихони"===e}(s))return[v(r,2)+"нь",B(r)+"ей"];if(function(e){return J(e,["ьи","ии"])
}(s))return e.sd.hasStressedEndingSingular(n,t).includes(!0)?v(r,2)+"ей":v(r,2)+"ий";if(function(e){
return e.endsWith("ни")&&x(y,G(e,3))}(s))return function(e){return["барышни","боярышни","деревни"].includes(e)
}(s)?v(r,2)+"ень":function(e){return e.endsWith("кухни")}(s)?v(r,2)+"онь":function(e){return"сотни"===e
}(s)?[v(r,2),v(r,2)+"ен"]:v(r,2)+"ен";if(k(a).endsWith("ийк"))return v(a,2)+"ек";if(a.length===s.length-1&&oe(s,gn)){
const e=G(a,2).charCodeAt(0);if(e!==g+9&&e!==g+28&&e!==p+9&&e!==p+28||n.isAnimate())return J(s,Bn)?B(a)+"ель":a+"ь";{
const e=q(a);return v(a,2)+P("е",e)+e}}return c()}}exports.CASES=e,exports.Case=n,exports.Engine=class{sd=function(){
let e;const n=ue();function t(t,r){const s=r.split(",");for(let r of s)e.text=r,n.put(e,t)}return e={pluraleTantum:!0},
t("SSSSSSS-SSSSSS","ножны"),e={gender:i.MASCULINE},t("SSSSSSS-SSSSSS","брёх,дёрн,идиш,имидж,мед,упрёк"),
t("SSSSSSS-EEEEEE","адрес,век,вечер,город,детдом,поезд,спецсчёт,субсчёт"),
t("SSSSSSE-EEEEEE","берег,бок,вес,лес,снег,дом,катер,счёт,мёд"),t("SSSSSSS-bbbbbb","вексель,ветер"),
t("SSSSSSE-ESEEEE","глаз"),t("SSSSSSE-bEEbEE","год"),t("SSSSSSb-bbbbbb","цех"),t("SbbSbbb-bbbbbb","грош,шприц"),
t("SssSsss-ssssss","кишмиш,кряж,слеш,слэш"),t("SEESeEE-EEEEEE","стеллаж"),t("SeeSeee-eeeeee","шиномонтаж"),e={
gender:i.MASCULINE,animate:!0},t("Sssssss-ssssss","паныч"),t("SSSSSSS-SSSSSS","балансёр,шофёр"),e={gender:i.NEUTER},
t("EEEEEEE-SsESEE","плечо"),
t("EEEEEEE-SSSSSS","тесло,стекло,автостекло,бронестекло,оргстекло,пеностекло,смарт-стекло,спецстекло,бедро,берцо,блесна,чело,стегно,стебло"),
e={gender:i.FEMININE},t("EEEbEEE-SSESEE","щека"),t("EEEEEEE-SSESEE","слеза"),t("EEEEEEE-SESSSS","семья,макросемья"),
t("EEEEEEE-SEESEE","вожжа,свеча"),t("EEESEEE-SSSSSS","душа"),t("EEEEEEE-eEeeee","скамья"),
t("EEEEEEE-EEEEEE","башка,кишка,ладья,лапша,моча,пыльца,статья"),e={gender:i.FEMININE,animate:!0},
t("EEEEEEE-SESESS","свинья,овца"),e={gender:i.COMMON,animate:!0},t("EEEEEEE-SSSSSS","судья"),
t("EEEEEEE-EEEEEE","левша"),n}();decline(e,n,r){const s=X.create(e)
;return R(r?k(r.charAt(0))!==r.charAt(0):s.lower().charCodeAt(0)!==s.text().charCodeAt(0),function(e,n,r,s){
const i=function(e,n,r,s){const i=n.text(),u=t[r],c=n.getDeclension();if(n.isIndeclinable())return i
;if(n.isPluraleTantum())return Gn(e,n,u,i);if(s)return Gn(e,n,u,s);switch(c){case-1:return i;case 0:return Ue(e,n,u)
;case 1:return Je(e,n,u);case 2:return je(e,n,u);case 3:return Me(e,n,u)}}(e,n,r,s);if(i instanceof Array)return i
;return[i]}(this,s,n,r))}pluralize(e){const n=X.create(e);if(n.isPluraleTantum())return[n.text()]
;return R(n.lower().charCodeAt(0)!==n.text().charCodeAt(0),Sn(this,n))}getLocativeForms(e){
const n=this,t=X.create(e),r=t.getDeclension();if(r&&r>=0){const e=ze.get(Pe(t))
;if(e instanceof Array)return e.map(e=>new h(function(e){switch(1+(e>>3&7)){case d.V:return"в";case d.VO:return"во"
;case d.NA:return"на"}}(e),function(e,n,t,r){const s=5;switch(n){case 0:return Ue(e,t,s);case 1:return Ke(e,t,r);case 2:
return je(e,t,s);case 3:return Me(e,t,s)}}(n,r,t,S(e)),e>>6))}return[]}},exports.Gender=i,exports.Lemma=X,
exports.LocativeForm=h,exports.LocativeFormAttribute=l,exports.createLemma=function(e){return X.create(e)},
exports.createLemmaOrNull=function(e){return X.createOrNull(e)};
//# sourceMappingURL=RussianNouns.cjs.map
