/*!
  RussianNounsJS v3.0.0-alpha.2
  Copyright (c) 2011-2026 Georgy Ustinov
  Released under the MIT license
*/
const n=Object.freeze(["именительный","родительный","дательный","винительный","творительный","предложный","местный"]),e=Object.freeze({
NOMINATIVE:n[0],GENITIVE:n[1],DATIVE:n[2],ACCUSATIVE:n[3],INSTRUMENTAL:n[4],PREPOSITIONAL:n[5],LOCATIVE:n[6]
}),t=Object.fromEntries(n.map((n,e)=>[n,e]));function r(n){return"number"==typeof n?n:t[n]}
const s=Object.freeze(["женский","мужской","средний","общий"]),i=Object.freeze({FEMININE:s[0],MASCULINE:s[1],
NEUTER:s[2],COMMON:s[3]}),u=1,c=2,a=3;function o(n){const e=new Set;let t=0;for(let r of n)t+=r,e.add(t);return e}
function f(n){return 1<<n}function h(n,e,t){this.preposition=n,this.word=e,this.attributes=t}const l=Object.freeze({
CONTAINER:1,LOCATION:2,STRUCTURE:4,SURFACE:8,WAY:16,OBJECT_WITH_FUNCTIONAL_SURFACE:32,SUBSTANCE:64,RESOURCE:128,
CONDITION:256,EXPOSURE:f(9),MOTION:f(10),EVENT:f(11),WITH_ADJECTIVE:f(12),WITHOUT_ADJECTIVE:f(13)}),d=Object.freeze({
V:1,VO:2,NA:3});function E(n,e,t){return t<<6|(n-1&7)<<3|e-1&7}function S(n){return 1+(7&n)}
const g="а".charCodeAt(0),p="А".charCodeAt(0),W="ё".charCodeAt(0),A="Ё".charCodeAt(0),m=1025===A,w=m?1024:A,b=m?1039:A,_=m?1104:W,C=m?1119:W,O=_-w
;function I(n){const e=n.charCodeAt(0),t=e-g;return e===W?32:t===(31&t)?1<<t:0}function N(n,e){return 0!==(n&I(e))}
const x=3892855073,T=66567902,y=66567390;function M(n){return N(x,n)}function U(n){return n.split("").filter(M).length}
function j(n){let e=5381;const t=n.length;for(let r=0;r<t;r++)e=33*e+n.charCodeAt(r)|0;return e>>>0}function k(n){
const e=n.replaceAll("ё","е");let t=e.length%2,r=1,s=5381;function i(){s=(33*s+(255&t))%4294967296,t>>=8,r-=8}
for(let n of e){const e=n.charCodeAt(0)-g&31;t|=e<<r,r+=5,r>=8&&i()}r>0&&i();const u=e.charCodeAt(0)%2
;return 2*(2147483647&s)+u}function V(n){for(let e=0;e<n.length;e++){const t=n.charCodeAt(e)
;if(t>=p&&t<=p+31||t>=w&&t<=b)break;if(e===n.length-1)return n}let e=new Array(n.length);for(let t=0;t<n.length;t++){
let r=n.charCodeAt(t);r>=p&&r<=p+31?r+=32:r>=w&&r<=b&&(r+=O),e[t]=r}return String.fromCharCode.apply(null,e)}
function P(n){if(m)return n.toLowerCase();let e=new Array(n.length);for(let t=0;t<n.length;t++){let r=n.charCodeAt(t)
;r>=p&&r<=p+31||r>=65&&r<=90?r+=32:r>=w&&r<=b&&(r+=O),e[t]=r}return String.fromCharCode.apply(null,e)}function z(n,e){
return e===P(e)?n:function(n){let e=new Array(n.length);for(let t=0;t<n.length;t++){let r=n.charCodeAt(t)
;r>=g&&r<=g+31?r-=32:r>=_&&r<=C&&(r-=O),e[t]=r}return String.fromCharCode.apply(null,e)}(n)}function L(n){
if(0===n.length)return"";const e=n.charCodeAt(0)
;return e>=g&&e<=g+31?String.fromCharCode(e-32)+n.slice(1):e>=_&&e<=C?String.fromCharCode(e-O)+n.slice(1):n}
function R(n,e){return n?e.map(L):e}function D(n){return n.replaceAll("ё","е").replaceAll("Ё","Е")}function v(n,e){
return n.substring(0,n.length-e)}function F(n,e){return n.substring(n.length-e)}function B(n){return v(n,1)}
function q(n){return H(n,1)}function H(n,e){return n[n.length-e]||""}function J(n,e){return 1===e.length&&n.includes(e)}
function G(n,e){return e.some(e=>n.endsWith(e))}class X{constructor(n){n instanceof X?(this._txt=n._txt,this._lc=n._lc,
this._hash=n._hash,this._flags=n._flags):(n.pluraleTantum?this._flags=5:this._flags=1+s.indexOf(n.gender),
this._txt=n.text,this._lc=P(n.text),this._hash=k(this._lc),this._flags|=8*(1&n.indeclinable),
this._flags|=16*(1&n.animate),this._flags|=32*(1&n.surname),this._flags|=64*(1&n.name),this._flags|=128*(1&n.transport),
this._flags|=f(16)*(2+function(n,e,t,r){if(e)return-2;if(r)return-1;const s=q(n);switch(t){case 1:
return"а"===s||"я"===s?2:N(T,s)?-1:3;case 2:return"а"===s||"я"===s?2:"путь"===n?0:1;case 3:
return["дитя","полудитя"].includes(n)?0:"мя"===F(n,2)?3:1;case 4:return"а"===s||"я"===s?2:"и"===s?-1:1;default:return-2}
}(this._lc,n.pluraleTantum,Y(this),n.indeclinable)))}static create(n){if(n instanceof this)return n;const e=Q(n)
;if(e)throw new Error(e);return Object.freeze(new this(n))}static createOrNull(n){
return null===Q(n)?Object.freeze(new this(n)):null}equals(n){
return n instanceof X&&this._flags===n._flags&&this.lower()===n.lower()}text(){return this._txt}lower(){return this._lc}
isPluraleTantum(){return 5==(7&this._flags)}getGender(){const n=Y(this);if(n>=1&&n<=4)return s[n-1]}isIndeclinable(){
return!!(8&this._flags)}isAnimate(){return!!(16&this._flags)||this.isASurname()||this.isAName()}isASurname(){
return!!(32&this._flags)}isAName(){return!!(64&this._flags)}isATransport(){return!!(128&this._flags)}getDeclension(){
return(this._flags>>16)-2}getSchoolDeclension(){const n=this.getDeclension();return 1===n?2:2===n?1:n}}function Y(n){
return 7&n._flags}function K(n,e){const t=new X(n);return t._txt=e,t._lc=P(e),t._hash=k(t.lower()),Object.freeze(t)}
function Q(n){if(null==n)return"No parameters specified."
;for(let e of["pluraleTantum","indeclinable","animate","surname","name","transport"]){
if((n=>null!=n&&"boolean"!=typeof n)(n[e]))return e+" must be boolean."}
if(null==n.text)return"A cyrillic word required.";if(!n.pluraleTantum){
if(null==n.gender)return"A grammatical gender required.";if(!s.includes(n.gender))return"Bad grammatical gender."}
return null}function Z(n){return X.create(n)}function $(n){return X.createOrNull(n)}
const nn=o([11720389,548,1024,1479,2622,2867,1222,2642,264,1328,137,123,397,65542229,212447047,31729170,8094836,1056,21701789,35520559,40358,21819,28248,119786,63892,31809,7356,74383,72369,5945,28902,90120738,21187517,91925642,3054826,1600765,65934,30948851,5569212,4205640,5412804,6787095,9749916,3940084,1511466,1303038,16090470,1376628,49919694,3827522,37915959,14032615,28701924,224587434,637275762,51079457,391103676,24108070,158999424,232633267,6058815,66599250,692781441,816204112,55209380,72754,90006,80058,45564,67845,42548,27193,21401,139393,750335,170896,4424,1566,6264,154969,17292,17229,175112,83011,117872,4183,13065,108972,108088,343663,66210,334,17090,380271,283272,59007,35796,230801,1067156,19992,157124,12433,252644,2626,23776,630482,531296,304718,90891,726,23116,47653,30493,167310,50156,123071,477118,241821,55660,908992,534269,205157,11218,2490,660,66391,46856,847526,68710,8450,36630,15642,109864,41716,354482,79820,51876,97325,5506,46436,191803,3957,40876,126323,2347821,338490,73216,475569,87602,29642,4220,10760,16896,50156,17424,35178,167244,126786,33643,30488,65045,35961,51453,55660,4,152461,138332,1958,34200,3709,61381,17424,30158,80591,11218,44099,260487]),en=o([11720389,548,1024,1060,4,5904,1848,4404,330555234,4691346,3365076,1045362,7414584,960432,10564312,253286,16178203,4357,4355,11350,31120,5248,40591,62367,54057,50487,13069,3664,39764,10263,3002,5810,8844,24551,4091,56761,21785,30553,55147139,15960625,1933097,12258067,16302047,54210486,45688435,1659767,4813249,33577763,2501798,10056946,672528,14209351,2012340,1655412,4652736,62568,148698,21186,71129124,260014161,108045611,1007583269,2026464,22799532,750068913,1499532,1285428194,74598,22348,6599,132273,309821,156816,397448,179394,148036,100257,21779,11218,36631,345954,50442,104394,2724,112115,30690,10552,31377,11286,7168,14612,51480,116537,192258,163145,65604,97951,1363157,212810,431243,2622,425588,275284,150351,570568,244701,16659,26136,130134,11040,159389,728373,3476,726,1290392,224730,189158,11218,2490,10750,21608,143747,65974,664563,84036,16283,17424,5758,45080,33066,1782,90658,37101,56107,233163,14216,5518,179264,2525,146957,111342,80594,2309,4217,25432,26905,29980,518951,1458289,523705,4202,477865,149368,126310,47828,212678,22744,269176,179119,4399,35997,69696,41777,41,127336,4202,73153,46372,114255,126869,23630,11218])
;class tn{constructor(){this._filter=new Uint8ClampedArray(512)}addInteger(n){this._filter[un(rn(n))]|=cn(rn(n)),
this._filter[un(sn(n))]|=cn(sn(n))}hasInteger(n){
return!!(this._filter[un(rn(n))]&cn(rn(n)))&&!!(this._filter[un(sn(n))]&cn(sn(n)))}clone(){const n=new tn
;return n._filter=Uint8ClampedArray.from(this._filter),n}}function rn(n){return 4095&n}function sn(n){
return 4095&(n>>>12^n>>>24)}function un(n){return n>>>3}function cn(n){return 1<<7-(7&n)}const an=function(){
const n=new tn;return nn.forEach(e=>n.addInteger(e)),en.forEach(e=>n.addInteger(e)),Object.freeze(n)}();function on(){
const n=new Map,e=an.clone(),t=n=>4294967296*(31&n._flags)+n._hash,s=n=>n.lower().indexOf("ё")+1&255,i=e=>{
const r=65504&e._flags,i=(e=>{const r=n.get(t(e));return r instanceof Array?r:[]
})(e).filter(n=>(n[0]&r)<=r),u=i.filter(n=>n[0]>>16===s(e));return u.length?u[0][1]:i.length?i[0][1]:void 0},u=n=>{
switch(n){case"E":return[!0];case"e":return[!0,!1];case"b":case"s":return[!1,!0];default:return[!1]}};return{put(r,i){
const u=i.split("-"),c=(n,e)=>n.length!==e||n.split("").some(n=>!"SsbeE".includes(n))
;if(2!==u.length||c(u[0],7)||c(u[1],6))throw new Error("Bad settings format.");const a=X.create(r),o=t(a);let f=n.get(o)
;f instanceof Array||(f=[],n.set(o,f));const h=65535&a._flags|s(a)<<16,l=f.find(n=>h===n[0]);l?l[1]=i:f.push([h,i]),
e.addInteger(a._hash)},hasStressedEndingSingular(n,t){if(e.hasInteger(n._hash)){const e=r(t);if(e>=0){const t=i(n)
;if(t){const n=t.split("-")[0];return u(n[e])}if(2===Y(n)){if(nn.has(n._hash))return u("SEESEEE"[e])
;if(en.has(n._hash))return u("SEEEEEE"[e])}}}return[]},hasStressedEndingPlural(n,t){if(e.hasInteger(n._hash)){
const e=r(t);if(e>=0&&e<6){const t=i(n);if(t){const n=t.split("-")[1];return u(n[e])}
if(2===Y(n)&&(nn.has(n._hash)||n.isAnimate()&&en.has(n._hash)))return u("E")}}return[]}}}function fn(n){let e=new Map
;for(let t of n){let n=e;for(let e=t.length-1;e>=0;e--){const r=t.charCodeAt(e);if(e>0){const e=n.get(r);if(0===e)break
;void 0===e&&n.set(r,new Map),n=n.get(r)}else n.set(r,0)}}return e}function hn(n,e){let t=e
;for(let e=n.length-1;e>=0;e--){const r=n.charCodeAt(e);if(!t.has(r))return!1;{const n=t.get(r);if(0===n)return!0;t=n}}}
const ln=fn(["ое","нький","ский","ской","лстой","отой","утой","евой","овой","живой"]),dn=fn(["ее","ое","нький","ский","ской","лстой","отой","утой"]),En=fn(["евой","овой","отой","живой"]),Sn=fn(["шний","жний","щий","ший","жий","чий"]),gn=["божий","ажий","яжий","ужий","южий","бульдожий","кабарожий","медвежий","носорожий","миножий"],pn=fn(gn),Wn=fn(gn.map(n=>v(n,2)+"ьи")),An=new Set(["бубен","бугор","ветер","вошь","вымысел","горшок","деготь","дёготь","дятел","домысел","замысел","кашель","коготь","лапоть","лоб","локоть","ломоть","молебен","мох","ноготь","овен","пепел","пес","пёс","петушок","помысел","порошок","промысел","псалом","пушок","ров","рожь","рот","сон","стебель","стишок","угол","умысел","хребет","церковь","шов","ковер","овес","костер"].map(k)),mn=new tn
;An.forEach(n=>mn.addInteger(n))
;const wn=fn(["овёс","ковёр","костёр","шатер","шатёр","козел","козёл","котел","котёл","орел","орёл","осел","осёл","узел","уголь","чок","ешок","хол"])
;function bn(n,e){const t=q(e);if(N(-402111711,t)){if(N(x,H(e,2))){const t=v(n,2);return hn(e,pn)?t+z("ь",t):t}
if("й"!==t)return B(n)}return n}const _n=["ясень","бюллетень","олень","тюлень","гордень","пельмень","ячмень"]
;function Cn(n,e,t){const r=n.text(),s=q(e),i=I(s);let u;return-133667019&i&&(-402111711&i?u=function(n,e,t){
const r=H(e,2);return"ь"===r||"о"===t&&N(2504708,r)?B(n):bn(n,e)}(r,e,s):"к"===s?u=function(n,e,t){
return n.length>=4&&G(e,["рёк","нёк","лёк"])&&!1!==t?v(n,2)+"ьк":e.endsWith("ёк")&&N(x,H(e,3))?v(n,2)+"йк":void 0
}(r,e,t):"ь"===s?u=function(n,e,t){
return An.has(n._hash)||hn(t,wn)?v(e,3)+H(e,2):t.endsWith("ень")&&2===Y(n)&&!G(t,_n)?v(e,3)+"н":B(e)
}(n,r,e):(["лёд","лед","лён"].includes(e)||"лев"===e&&n.isAnimate())&&(u=v(r,2)+z("ь",H(r,2))+q(r))),
u||(u=function(n,e,t){
return!!(199680&t)&&hn(e,wn)&&!["новосел","новосёл"].includes(e)||!!(2571270&t)&&(mn.hasInteger(n._hash)&&An.has(n._hash)||n.isAnimate()&&e.endsWith("посол"))
}(n,e,i)?v(r,2)+q(r):r),u}function On(n,e){const t=B(n),r=B(e.lower());if("а"===q(r))return t
;if(G(r,["зне","жне","гре","спе","мудре"])||F(B(r),3).split("").every(n=>N(y,n))||e.isAName())return t
;if("ле"===F(r,2)){const n=H(r,3);return N(x,n)||"л"===n?B(t)+"ь":t}
return N(x,q(r))&&"и"!==q(r)?N(x,q(B(r)))?v(n,2)+"й":G(e.lower(),["месяц"])?t:v(n,2):t}
const In=fn(["лапоток","желток","нишок","ришок","ишек"]),Nn=["поток","приток","переток","проток","биоток","электроток","восток","водосток","водоток","воток","знаток"],xn=["инок","исток","обморок","порок","пророк","сток","урок"]
;function Tn(n){
return G(n,["чек","шек"])&&n.length>=6||hn(n,In)||n.endsWith("ок")&&!n.endsWith("шок")&&!xn.includes(n)&&!G(n,Nn)&&!N(x,H(n,3))&&(N(x,H(n,4))||G(v(n,2),["ст","рт"]))&&n.length>=4
}function yn(n,e,t){return(n.length?n:[!1]).map(n=>t(n?D(e):e,n))}const Mn=0,Un=3,jn={дочь:"дочерь",мать:"матерь"}
;function kn(n,e,t){const r=e.text(),s=e.lower();if(![Mn,Un].includes(t)&&Object.keys(jn).includes(s)){
return kn(n,K(e,jn[s]),t)}let i=Cn(e,s);if(function(n){
return n.endsWith("полночь")||n.startsWith("пол")&&N(134217984,q(n))&&U(n)>=2}(s)&&(i="полу"+i.substring(3)),
"мя"===F(s,2))switch(t){case Mn:case Un:return r;case 1:case 2:case 5:case 6:return i+"ени";case 4:return i+"енем"
}else switch(t){case Mn:case Un:return r;case 1:case 2:case 5:case 6:return i+"и";case 4:
return G(s,["вошь","рожь","церковь"])?r+"ю":i+"ью"}}function Vn(n,e,t){const r=e.text(),s=e.lower()
;if(s.endsWith("путь"))return 4===t?B(r)+"ём":kn(n,e,t);if(!s.endsWith("дитя"))throw new Error("unsupported");switch(t){
case 0:case 3:return r;case 1:case 2:case 5:case 6:return r+"ти";case 4:return[r+"тей",r+"тею"]}}function Pn(n,e,t){
const r=e.text(),s=e.lower(),i=Cn(e,s),u=V(i),c=B(r),a=B(s),o=()=>"я"===q(s),f=()=>s.endsWith("ая")&&!(2===U(s)||N(x,q(u))),h=()=>s.endsWith("яя")&&!(2===U(s)||N(x,q(u))),l=["жая","шая"]
;switch(t){case 0:return r;case 1:
return h()||G(s,l)?i+"ей":f()?i+"ой":e.isASurname()&&!s.endsWith("да")?c+"ой":s.endsWith("ничья")?c+"ей":o()||N(60818504,q(u))?c+"и":c+"ы"
;case 2:case 5:case 6:
return h()||G(s,l)?i+"ей":f()?i+"ой":e.isASurname()&&!s.endsWith("да")?c+"ой":"ия"===F(s,2)?c+"и":s.endsWith("ничья")?c+"ей":c+"е"
;case 3:return f()?i+"ую":h()?i+"юю":o()?c+"ю":c+"у";case 4:
return h()||G(s,l)?i+"ею":f()?[i+"ой",i+"ою"]:o()||J("жшчщц",q(u))&&!n.sd.hasStressedEndingSingular(e,t).includes(!0)?"и"===q(a)?c+"ей":[c+"ей",c+"ею"]:[c+"ой",c+"ою"]
}}const zn=fn(["ов","ев","ёв","ин","ын"]),Ln=function(n,e){let t=e;for(let e=0;e<n.length;e++){
const r=n.charCodeAt(e),s=t;t=new Map,t.set(r,s)}return t}("ы",zn);function Rn(n){
return n.filter((e,t)=>n.indexOf(e)===t)}function Dn(n){const e=1&n.lower().includes("ё")
;return 4294967296*((65535&n._flags)<<1|e)+n._hash}const vn=Object.freeze(function(){const n=new Map,e={
gender:i.MASCULINE},t={gender:i.MASCULINE,animate:!0};function r(e,t,r,s,i){
const u=s.split(","),c=i instanceof Array?i:[2];for(let s of u){e.text=s;const i=Dn(X.create(e));let u=n.get(i)
;u||(u=[],n.set(i,u));for(let n of r)for(let e of c)u.push(E(n,e,t))}}const s=[d.V],u=[d.VO],c=[d.NA]
;r(e,f(0),s,"мозг,пруд,стог,таз,год"),r(e,f(0),u,"рот"),r(e,f(4),s,"год"),r(e,f(0),s,"гроб"),r(e,f(0),u,"гроб",[1]),
r(e,f(1),s,"ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,низ,хлев"),r(e,f(2),s,"круг,полк,артполк,ряд,род,строй,лад"),
r(e,f(3),c,"баз,берег,бережок,вал,кон,круг,луг,пол,яр"),r(e,f(4),c,"век,день"),r(e,f(4),s,"час"),r(e,f(4),c,"корень"),
r(t,f(5),c,"вор"),r(e,f(5),c,"повод,бочок,борт,воз,горб,кол,мост,плот,сук,х"+String.fromCharCode(1091)+"й"),
r(e,f(5),c,"крюк,болт",[1,2]);const a=",мёд,мех,пар,пух";r(e,f(6),s,"дым,жир,мел,пушок"+a),
r(e,f(7),c,"газ,клей,спирт"+a),r(e,f(8),s,"бой,бред,быт,долг,плен,пыл,сок,ход,лад"),r(e,f(9),s.concat(c),"вид"),
r(e,f(9),c,"слух,счёт,ветер,ветр,свет"),r(e,f(10),c,"ход,бег,вес"),r(e,f(10)|f(12),c,"шаг"),r(e,f(11),c,"бал,пир"),
r(e,f(8),c,"дух,плав"),r(e,f(10)|f(12),c,"газ"),r(e,f(0),s,"глаз,зоб,нос,шкаф"),r(e,f(0),u,"лоб"),
r(e,f(5),c,"глаз,лоб,нос,шкаф,холм");let o="бок,верх,зад,угол";return r(e,f(1),s,o),r(e,f(5),c,o),
r(e,f(1)|f(13),s,"край"),r(e,f(5)|f(13),c,"край"),r(e,f(3),c,"лёд,мох,снег"),r(e,f(6),u,"лёд,лён,мох"),
r(e,f(6),s,"снег"),n
}()),Fn=new Set("клей,чай,дом,дух,дым,дымок,газ,год,горошек,жар,жир,квас,пар,пыл,род,рост,сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,табак,творог,толк,торф,туман,убыток,укроп,уксус,ход,цемент,чеснок,шаг,шик,шиповник,шоколад,шорох,шум,яд".split(",")),Bn=new tn
;Fn.forEach(n=>Bn.addInteger(k(n)))
;const qn=fn(["й","ие","иё"]),Hn=fn(["воробей","муравей","ручей","соловей","улей"]),Jn=fn(["мой","ной","дой","шой","жой","рзой","осой","хой","латой","витой","литой","питой","житой","отой","утой","ятой","лагой","рагой","огой","угой","лубой","любой","илой","ылой","злой","малой","овой","евой","живой","ской","акой","укой","нний","ский","йкий","цкий","зкий","ткий","лкий","мкий","хкий","оркий","аркий","яркий","ький","ёкий","бокий","оокий","cокий","токий","ликий","дикий","укий","ыкий","який","пкий","дкий","бкий","нкий","жкий","чкий","гкий","овкий","авкий"])
;function Gn(n,e){return"ый"===F(e,2)||(e.endsWith("кривой")||hn(e,Jn))&&U(e)>=2}
const Xn=fn(["ий","ие","чье","тье","дье","вье","бье","жалованье","енье","ружье","божье","верье","мужье"]),Yn=fn(["вое","лое","мое","ное","рое","тое","той","ый"])
;function Kn(n,e,t){const r=e.text(),s=e.lower(),i=q(s),u=n.sd.hasStressedEndingSingular(e,t);let c=Cn(e,s,u[0]),a=B(r)
;const o=Zn(s);o&&(c="полу"+c.substring(3),a="полу"+a.substring(3));let f=V(c)
;const h=()=>o&&s.endsWith("я")||ne(s),l=hn(s,qn),d=()=>hn(s,Hn)?B(a)+z("ь",q(a)):a,E=()=>J("чщ",q(f));function g(n){
return!e.isAnimate()&&Bn.hasInteger(e._hash)&&Fn.has(s)&&("й"===i?n.push(B(r)+z("ю",q(r))):n=n.concat(yn(u,c,n=>n+z("у",q(n))))),
n}switch(t){case 0:return r;case 1:switch(i){case"и":case"ы":if(o)return Qn(n,e,t,s);break;case"й":case"е":
if(l&&e.isASurname()||Gn(0,s)||hn(s,ln))return c+"ого";if(hn(s,Sn)||s.endsWith("ее"))return c+"его";case"ё":case"я":
case"ь":if(l){return g([d()+"я"])}if(h()&&!E())return c+"я";break;case"ц":return On(r,e)+"ца";case"к":
if(Tn(s))return B(a)+"ка";break;case"о":if(G(s,["шко"])&&2===Y(e))return a+"и"}let p
;return p=e.isASurname()||-1===f.indexOf("ё")?[c+"а"]:yn(u,c,n=>n+"а"),g(p);case 2:switch(i){case"и":case"ы":
if(o)return Qn(n,e,t,s);break;case"й":case"е":if(l&&e.isASurname()||Gn(0,s)||hn(s,ln))return c+"ому"
;if(hn(s,Sn)||s.endsWith("ее"))return c+"ему";case"ё":case"я":case"ь":if(l)return d()+"ю";if(h()&&!E())return c+"ю"
;break;case"ц":return On(r,e)+"цу";case"к":if(Tn(s))return B(a)+"ку"}
return e.isASurname()||-1===f.indexOf("ё")?c+"у":yn(u,c,n=>n+"у");case 3:
return 3===Y(e)||J("иы",i)&&o?r:e.isAnimate()?Kn(n,e,1):r;case 4:switch(i){case"и":case"ы":if(o)return Qn(n,e,t,s);break
;case"й":case"е":case"ё":case"я":case"ь":if(l&&e.isASurname()||hn(s,dn))return hn(s,Yn)?c+"ым":c+"им"
;if(Gn(0,s))return"и"===H(s,2)||s.endsWith("хой")?c+"им":c+"ым";if(hn(s,En))return c+"ым";if(hn(s,Sn))return c+"им"
;if(l)return d()+"ем";if(s.endsWith("це"))return r+"м";break;case"ц":return yn(u,r,(n,t)=>t?On(n,e)+"цом":On(n,e)+"цем")
;case"к":if(Tn(s))return B(a)+"ком";break;case"н":case"в":if(e.isASurname()&&hn(s,zn))return r+"ым"}
return h()||J("жшчщ",q(f))?yn(u,c,(n,e)=>e?n+"ом":n+"ем"):e.isASurname()||-1===f.indexOf("ё")?c+"ом":yn(u,c,n=>n+"ом")
;case 6:if("полпути"===s)return r;const W=vn.get(Dn(e));if(W){return Rn(W.map(n=>S(n))).map(t=>$n(n,e,t))}case 5:
switch(i){case"и":if("полпути"===s)return r;case"ы":if(o)return Qn(n,e,t,s);break;case"й":case"е":case"ё":case"я":
case"ь":if(l&&e.isASurname()||Gn(0,s)||hn(s,ln))return c+"ом";if(hn(s,Sn)||s.endsWith("ее"))return c+"ем"
;if(G(s,["воробей"])){const n=B(a);return n+z("ье",q(n))}
if(hn(s,Xn)&&!G(s,["запястье","здоровье","изголовье","платье"]))return a+"и";if("й"===i||"иё"===F(s,2))return d()+"е"
;break;case"ц":return On(r,e)+"це";case"к":if(Tn(s))return B(a)+"ке"}
return e.isASurname()||-1===f.indexOf("ё")?c+"е":yn(u,c,n=>n+"е")}}function Qn(n,e,t,r){
const s=()=>"полминуты"!==r?"полу"+e.text().substring(3):e.text();if("полпути"===r){return Vn(n,K(e,B(s())+"ь"),t)}
if(r.endsWith("зни")||r.endsWith("сти")){return kn(n,K(e,B(s())+"ь"),t)}
return Pn(n,K(e,B(s())+("ни"===F(r,2)?"я":"а")),t)}function Zn(n){
if(n.startsWith("пол")&&N(2550137089,q(n))&&"л"!==n[3]&&U(n)>=2){let e=n.substring(3),t=e.search(/[а-яё]/)
;return t>=0&&N(T,e[t])}return!1}function $n(n,e,t){if(2===t){const n=e.text(),t=e.lower();let r=Cn(e,t),s=B(n)
;const i=Zn(t)&&t.endsWith("я")||ne(t);return"й"===q(t)?D(s)+"ю":i?D(r)+"ю":Tn(t)?D(B(s))+"ку":D(r)+"у"}
if(1===t)return Kn(n,e,5)}function ne(n){return"ь"===q(n)&&!n.endsWith("господь")||J("её",q(n))&&!G(n,["це","же"])}
const ee={[c]:{all:{болгарин:["болгары"],господин:["господа"],дядя:["дяди","дядья"],зуб:["зубы","зубья"],
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
пчела:["пчёлы"],сестра:["сёстры"],слеза:["слёзы"]}},[a]:{all:{брюхо:["брюхи"],колено:["колена","колени","коленья"],
древо:["древа","древеса"],ухо:["уши"],око:["очи"],дно:["донья"],чудо:["чудеса","чуда"],небо:["небеса"],
бревно:["брёвна"],ведро:["вёдра"],веретено:["веретёна"],весло:["вёсла"],гнездо:["гнёзда"],зерно:["зёрна"],
знамя:["знамёна"],колесо:["колёса"],облачко:["облачка"],озеро:["озёра"],полсотни:["полусотни"],ребро:["рёбра"],
ремесло:["ремёсла"],седло:["сёдла"],село:["сёла"]}}},te=new tn
;for(const n of Object.values(ee))for(const e of Object.values(n))for(const n of Object.keys(e))te.addInteger(k(n))
;const re=["зять","деверь","друг","брат","собрат","стул","брус","обод","полоз","струп","подмастерье","якорь","перо","шило"],se=new Set(["берег","бок","борт","век","вес","веер","вексель","вечер","глаз","голос","город","директор","доктор","дом","детдом","егерь","жемчуг","катер","колокол","концлагерь","корм","короб","кузов","купол","кучер","лес","луг","мастер","номер","пояс","провод","рог","сахар","снег","сорт","стог","счет","счёт","спецсчет","спецсчёт","субсчет","субсчёт","терем","том","холод","хутор","цвет","череп"]),ie=fn(["округ","остров","отпуск","паспорт","парус","поезд","погреб","рукав","цех"]),ue=fn(["повар","юнкер"]),ce=new Set(["адрес","договор","буфер","ворох","инспектор","инструктор","корпус","крейсер","орден","ордер","прожектор","пропуск","род","свитер","сектор","сервер","тенор","тон","трактор","тормоз","ветер","верх","китель","мех","хлеб","юнкер","ястреб"]),ae=new Set(["бункер","вымпел","год","лекарь","образ","омут","писарь","пудель","токарь","тополь","шторм","штуцер"]),oe=["крюк","лист","лоскут","повод","прут","сук","учитель","флигель","штабель"],fe=["клин","колос","ком","край","соболь"],he=["дерево","звено","крыло"],le=["безделье","варенье","воскресенье","жалованье","запястье","застолье","затишье","здоровье","зелье","изголовье","новоселье","одночасье","печенье","платье","побережье","поголовье","подворье","подземелье","подполье","поместье","предплечье","раздумье","сиденье","средневековье","увечье","угодье","устье"],de=["воробей","муравей","ручей","соловей","улей","жеребей","ирей","репей","чирей"]
;function Ee(n){return"барин"===n}function Se(n,e,t,r,s){const i=n.sd.hasStressedEndingPlural(e,0).map(n=>!n)
;return i.length?i.map(n=>n?1===r.replace(/[^её]/g,"").length?s(((n,e)=>{
const t=Math.max(e.lastIndexOf("е"),e.lastIndexOf("ё")),r=z("ё",n[t]);return n.substring(0,t)+r+n.substring(t+1)
})(t,r)):s(t):s(D(t))):[s(t)]}function ge(n,e,t,r,s,i,u,c){
const a=[],o=()=>(i.endsWith("евич")||i.endsWith("евна"))&&i.indexOf("ье")>=0;function f(){
const n=c,e=V(n).indexOf("ье"),t=z("и",n[e]);return n.substring(0,e)+t+n.substring(e+1)}
return N(60818504,q(s))||J("яйь",q(i))||G(i,["сосед"])?o()?(a.push(f()+"и"),
a.push(c+"и")):a.push(...yn(u,c,n=>n+"и")):"ц"===q(i)?a.push(On(t,e)+"цы"):o()?(a.push(f()+"ы"),
a.push(c+"ы")):a.push(...yn(u,c,n=>n+"ы")),a}function pe(n,e){
const t=e.text(),r=e.lower(),s=n.sd.hasStressedEndingPlural(e,0),i=Cn(e,r,s[0]),u=V(i)
;if(r.endsWith("яя"))return[v(t,2)+"ие"];const c=("й"===q(r)||N(x,q(r)))&&N(x,q(B(r)))?B(t):i,a=function(n,e){
if(!te.hasInteger(n._hash))return;const t=Y(n),r=n.isAnimate(),s=ee[t];if(!s)return;const i=s.animateOnly
;if(r&&i&&i.hasOwnProperty(e))return i[e].slice();const u=s.all;return u&&u.hasOwnProperty(e)?u[e].slice():void 0}(e,r)
;if(a)return a;const o=Y(e),f=e.getDeclension();if(-1===f)return[t];if(0===f){if("путь"===r)return["пути"]
;if(r.endsWith("дитя"))return[v(t,3)+"ети"];throw new Error("unsupported mixed declension word")}
return 1===f?function(n,e,t,r,s,i,u,c,a){
const o=[],f="ь"===q(i)?s:"к"===q(i)?B(s)+"чь":"г"===q(i)?B(s)+"зь":"й"===q(r)?B(t):G(r,["рь","ль"])?s:s+"ь"
;if(re.includes(r))return o.push(f+"я"),Rn(o);if(2===a){const a=function(n){
return"сын"===n?"сын":"человек"===n?"человек":null}(r);if("сын"===a)return o.push("сыновья"),
o.push(...ge(0,e,t,0,i,r,u,c)),Rn(o);if("человек"===a)return o.push("люди"),o.push(...ge(0,e,t,0,i,r,u,c)),Rn(o)
;if(function(n,e){return!!oe.includes(n)||!("соболь"!==n||!e.isAnimate())}(r,e))return o.push(...ge(0,e,t,0,i,r,u,c)),
o.push(f+"я"),Rn(o);if(function(n){return fe.includes(n)}(r))return o.push(f+"я"),Rn(o);const h=function(n){
return se.has(n)?1:ce.has(n)?3:ae.has(n)?4:0}(r),l=function(n,e){const t=e.isAnimate();return!t&&hn(n,ie)||t&&hn(n,ue)
}(r,e)
;return 0!==h||l?(4===h&&o.push(...ge(0,e,t,0,i,r,u,c)),ne(r)?o.push(...Se(n,e,s,i,n=>n+"я")):u.includes(!0)?o.push(D(s)+"а"):o.push(s+"а"),
3===h&&o.push(...ge(0,e,t,0,i,r,u,c)),
Rn(o)):e.isAnimate()&&(r.endsWith("анин")||r.endsWith("янин"))&&!e.isAName()||function(n){return"боярин"===n
}(r)||Ee(r)?(o.push(v(t,2)+"е"),Ee(r)&&o.push(v(t,2)+"ы"),Rn(o)):function(n){return"цыган"===n}(r)?(o.push(t+"е"),
Rn(o)):function(n){return"щенок"===n}(r)?(o.push(v(t,2)+"ки"),o.push(v(t,2)+"ята"),Rn(o)):function(n){
return!(!n.endsWith("ребёнок")&&!n.endsWith("ребенок")||n.endsWith("жеребёнок")||n.endsWith("жеребенок")||n.endsWith("ястребёнок")||n.endsWith("ястребенок"))
}(r)?(o.push(v(t,7)+"дети"),Rn(o)):function(n,e){return(n.endsWith("ёнок")||n.endsWith("енок"))&&e.isAnimate()
}(r,e)?(o.push(v(t,4)+"ята"),Rn(o)):r.endsWith("ёночек")&&e.isAnimate()?(o.push(v(t,6)+"ятки"),Rn(o)):function(n,e){
return n.endsWith("онок")&&J("жшч",H(n,5))&&e.isAnimate()}(r,e)?(o.push(v(t,4)+"ата"),Rn(o)):Tn(r)?(o.push(v(t,2)+"ки"),
Rn(o)):hn(r,Sn)?(G(r,gn)?o.push(v(t,2)+"ьи"):o.push(B(t)+"е"),
Rn(o)):Gn(0,r)?(r.endsWith("ый")||r.endsWith("ий")?o.push(B(t)+"е"):r.endsWith("ой")&&!G(r,["хой","ской"])?o.push(v(t,2)+"ые"):o.push(v(t,2)+"ие"),
Rn(o)):r.endsWith("его")?(o.push(v(t,3)+"ие"),Rn(o)):function(n){return de.includes(n)}(r)?(o.push(v(t,2)+"ьи"),
Rn(o)):(o.push(...ge(0,e,t,0,i,r,u,c)),Rn(o))}if(3===a){if(function(n){
return G(n,["ко","чо"])&&!G(n,["войско","облако"])}(r))return o.push(B(t)+"и"),Rn(o);if(function(n){
return n.endsWith("имое")}(r))return o.push(s+"ые"),Rn(o);if(function(n){return n.endsWith("ее")
}(r))return o.push(s+"ие"),Rn(o);if(r.endsWith("ое"))return!function(n){return G(n,["г","к","ж","ш","х"])
}(i)?o.push(s+"ые"):o.push(s+"ие"),Rn(o);if(function(n){return G(n,["ие","иё"])}(r))return o.push(v(t,2)+"ия"),Rn(o)
;if(function(n){return G(n,["ье","ьё"])}(r)){const n=v(t,2);return"е"!==q(r)||function(n){return le.includes(n)
}(r)||o.push(n+"ия"),o.push(n+"ья"),Rn(o)}return function(n){return G(n,he)}(r)?(o.push(s+"ья"),Rn(o)):function(n){
return G(n,["ле","ре"])}(r)?(o.push(s+"я"),Rn(o)):function(n,e){return n.endsWith("судно")&&e.isATransport()
}(r,e)?(o.push(v(t,2)+"а"),Rn(o)):(o.push(...Se(n,e,s,i,n=>n+"а")),function(n){return n.endsWith("щупальце")
}(r)&&o.push(...ge(0,e,t,0,i,r,u,c)),Rn(o))}return o.push(s+"и"),Rn(o)
}(n,e,t,r,i,u,s,c,o):2===f?function(n,e,t,r,s,i,u,c){const a=[];if(function(n){return"заря"===n
}(r))return a.push("зори"),Rn(a);if(function(n){return n.endsWith("ая")&&!n.endsWith("свая")
}(r))return J("жхчшщ",q(i))||G(i,["вк","гк","ск","цк","ньк"])?a.push(s+"ие"):a.push(s+"ые"),Rn(a)
;return a.push(...ge(0,e,t,0,i,r,u,c)),Rn(a)}(0,e,t,r,i,u,s,c):3===f?function(n,e,t,r,s,i,u,c,a){const o=[]
;if("мя"===F(r,2))return o.push(s+"ена"),Rn(o);if(Object.keys(jn).includes(r))return o.push(B(jn[r])+"и"),Rn(o)
;if(1===a)return o.push(c+"и"),Rn(o);"и"===q(c)?o.push(c+"я"):o.push(c+"а");return Rn(o)}(0,0,0,r,i,0,0,c,o):[t]}
const We=fn(["ли","си","би","ви","ди","ти","пи","ри","ни","фи","зи","ьи","ья","ия","ря","ля","ая","аи","ои","уи","эи","ыи","яи","ёи","юи","еи","ии"]),Ae=["беготни","болтовни","будни","вожжи","возни","доли","лапши","левши","люди","марли","моря","мощи","ноздри","пени","пятерни","распри","родни","сакли","сени","ступни","судьи","фигни","чукчи"],me=["головы","громадины","детины","деревенщины","дохлятины","дубины","ехидины","жадины","зверины","идиотины","кислятины","молодчины","орясины","остолопины","сиротины","скотины","старейшины","старины","старшины","уродины"],we=fn(me),be=["адреса","паспорта","поезда","цеха","снега","бункера","буфера","берега","вымпела","голоса","города","договора","жемчуга","колокола","короба","корпуса","крейсера","кузова","леса","мастера","номера","облачка","острова","отпуска","паруса","повара","погреба","пояса","провода","пропуска","рукава","сахара","свитера","сервера","счета","тормоза","холода","хутора","цвета","черепа","шторма","штуцера","юнкера","ястреба","суда","фельдшера","кучера","пристава"],_e=fn([...be,"ктора","хтера"]),Ce=new Set([...be,"бега","беглецы","близнецы","бойцы","бока","борта","борцы","бруствера","брюшки","веера","века","венцы","верха","веса","весы","вечера","вороха","глупцы","года","гонцы","дворцы","дельцы","детдома","детдомы","дома","жеребцы","жильцы","жрецы","затишки","зубцы","излишки","истцы","катера","концы","корма","кузнецы","купола","купцы","лишки","луга","мертвецы","меха","мудрецы","облака","образа","образцы","огурцы","округа","омута","ордена","ордера","отцы","очки","певцы","песцы","пловцы","подлецы","продавцы","птенцы","резцы","рога","рода","рубцы","самцы","свинцы","сорта","соуса","спецы","стога","столбцы","стрельцы","творцы","тельцы","тенора","терема","тома","тона","торцы","хлеба","штришки","юнцы"]),Oe=new Set(["авары","аланы","аршины","баклажаны","буквы","гольфы","граммы","гусары","дела","кадеты","килограммы","омы","помидоры","рентгены","ботинки","человеки","чулки","шорты"]),Ie=new Set(["гектары","рельсы"]),Ne=new Set([...me,"абазины","авы","аввы","бедняги","бедолаги","болгары","бродяги","брызги","брюки","брюхи","будды","бусы","валенки","веки","вельможи","верзилы","вилы","владыки","воеводы","волосы","вояки","главы","грузины","задворки","задиры","железы","жилы","зануды","зеваки","именины","калеки","кальсоны","каникулы","колготки","коллеги","крохи","курицы","куры","ладоши","ламы","лыки","макароны","мужчины","нападки","нары","непоседы","носилки","ножны","папы","папаши","таты","падлы","партизаны","погоны","поминки","посиделки","похороны","предтечи","работяги","разы","ребятки","румыны","самоубийцы","санки","убийцы","сапоги","сатаны","сироты","сливки","слуги","солдаты","старосты","сумерки","сутки","татары","телеса","хитрюги","четвереньки","шляпы","шмотки","яблоки","дядьки","дяденьки","зайки","кроссовки","малютки","малолетки","попки","турки","узы","хлопоты","шахматы"]),xe=new tn
;Ce.forEach(n=>xe.addInteger(j(n))),Oe.forEach(n=>xe.addInteger(j(n))),Ie.forEach(n=>xe.addInteger(j(n)))
;const Te=new tn;Ne.forEach(n=>Te.addInteger(j(n)))
;const ye=fn(["жи","ши","чи","ля","ли","чи","ри","ти","ди","сани","борщи","клещи","товарищи","плащи","прыщи","хрящи"]),Me=fn(["братья","брусья","деревья","донья","звенья","клинья","клочья","коленья","колосья","колья","комья","крылья","крючья","листья","лоскутья","лохмотья","перья","платья","поводья","прутья","стулья","сучья","хлопья","шилья"]),Ue=fn(["ишки","дружки","тки","папочки","дедушки","дядюшки","батюшки","катанки","петрушки","шестерки"]),je=fn(["жки","шки","чки","рки","натки","хатки","ятки","етки","чётки","мки","нки","педки","илки"]),ke=fn(["шок","щок","жок","зок","аток","яток","еток"]),Ve=fn(["вна","вца","вцы","пла","дца","дра","судна","рки","рцы","тлы","рна","тна","енца","десны","дёсны","рёбра","ребра","сосны"])
;function Pe(n){return Ae.includes(n)}
const ze=[["х","ых","их"],["м","ым","им"],["х","ых","их"],["ми","ыми","ими"],["х","ых","их"]],Le={2:0,3:1,4:2,5:3,6:4,
7:4},Re=[["ям","ам"],["ями","ами"],["ях","ах"]],De={3:0,5:1,6:2,7:2
},ve=["жки","шки","чки","ножны"],Fe=["кн","кл","дк","нк","пк","зк","рк","тк","вк","лк","мк"],Be=["сестры","сёстры","серьги"],qe=["льц","сьм","деньг","ьк","йк","дьб"],He=["земли","петли","пли","вли"],Je=["зять","деверь"]
;function Ge(n,e,t,r){const s=V(r),i=q(s),u=I(i),c=t+1;if(1===c||4===c&&!e.isAnimate())return r
;if(134217984&u)if(2===c||4===c){if(s.endsWith("овичи")||s.endsWith("евичи"))return B(r)+"ей"
;if((s.endsWith("вны")||s.endsWith("полусотни"))&&"овны"!==s)return v(r,2)+"ен"}else if(5===c){
if((s.endsWith("дети")||s.endsWith("люди"))&&!s.endsWith("нелюди"))return B(r)+"ьми"
;if(s.endsWith("вери")||s.endsWith("дочери"))return[B(r)+"ями",B(r)+"ьми"]}
const a=Y(e),o=s.endsWith("цы")?B(r):bn(r,s),f=hn(s,Ln)&&(e.isASurname()||4===a)&&!hn(s,we),h=ze[Le[c]]
;if(f||s.endsWith("ничьи"))return r+h[0];if(s.endsWith("ые"))return v(r,2)+h[1]
;if(s.endsWith("ие")||hn(s,Wn))return o+h[2];if(c>2&&4!==c){const i=Re[De[c]]
;return hn(s,We)?B(r)+i[0]:n.sd.hasStressedEndingPlural(e,t).includes(!0)?D(o)+i[1]:o+i[1]}{
const u=e.getDeclension(),c=()=>{const i=V(o)
;if(G(i,Fe)&&!s.endsWith("сумерки")||"зл"===i||G(s,ve)&&n.sd.hasStressedEndingPlural(e,t).includes(!0)){const n=q(o)
;return B(o)+z("о",n)+n}if(hn(s,Ve)&&!s.endsWith("недра")||G(s,ve)){const n=H(r,2);return v(r,2)+z("е",n)+n}if(G(s,Be)){
const n=H(r,2);return("ь"===H(s,3)?D(v(r,3)):D(v(r,2)))+z("ё",n)+n}if(G(i,qe)){const n=q(o);return v(o,2)+z("е",n)+n}
return s.endsWith("сла")||s.endsWith("слы")?B(o)+"ел":o};if([3,0].includes(u)){if(s.endsWith("и"))return B(r)+"ей"
;if(function(n){return"гроздья"===n}(s))return B(r)+"ев"}const f=H(s,3);if(1!==a){const n=function(n,e){
return e.hasInteger(j(n))}(s,xe);if(n&&function(n){return Ce.has(n)}(s))return B(r)+"ов";if(n&&function(n){
return Oe.has(n)}(s)&&!e.isAName())return[c(),B(r)+"ов"];if(n&&function(n){return Ie.has(n)}(s))return[B(r)+"ов",c()]
;if(4===a&&!Pe(s)&&!J("жшч",f)||function(n,e){return e.hasInteger(j(n))}(s,Te)&&function(n){return Ne.has(n)
}(s)||e.isAName()&&2===a&&e.lower().endsWith("а")||"барин"===e.lower())return c();switch(i){case"и":case"я":
if(hn(s,ye)||"щи"===s||Pe(s)||e.lower().endsWith("ь")&&!G(e.lower(),Je)){return("ь"===q(B(s))?v(r,2):B(r))+"ей"}
if("и"===i)return function(n){return n.endsWith("ульи")
}(s)?B(r)+"ев":s.endsWith("ьи")?2===a?B(r)+"ёв":v(r,2)+"ей":function(n){
return["ча","кле","холу","ху"].includes(n.slice(0,-1))}(s)?B(r)+"ёв":s.endsWith("ищи")?c():function(n){
return n.endsWith("мессии")
}(s)?B(r)+"й":N(x,H(s,2))?B(r)+"ев":!hn(s,je)||2===a&&!hn(D(s),Ue)||hn(e.lower(),ke)?B(r)+"ов":c()
;if(hn(s,Me))return B(r)+"ев";if(function(n){return G(n,["зятья","кумовья","деверья","края","острия"])
}(s))return B(r)+"ёв";if(function(n){return G(n,["ья","ия"])}(s))return 2===a?v(r,2)+"ей":v(r,2)+"ий";break;case"а":
const n=function(n){return n.endsWith("семена")?"семена":n.endsWith("стремена")?"стремена":null}(s)
;return n?v(r,3)+"ян":function(n){return!n.endsWith("мена")||n.endsWith("семена")||n.endsWith("стремена")?null:"мена"
}(s)?v(r,3)+"ён":e.lower().endsWith("яйцо")?z("яиц",B(r)):s.endsWith("нца")?[c(),B(r)+"ев"]:hn(s,_e)?B(r)+"ов":c()
;case"ы":return function(n){
return n.endsWith("ницы")||n.endsWith("лицы")||n.endsWith("пицы")||n.endsWith("бицы")?n.slice(-3):null
}(s)?B(r):s.endsWith("цы")?B(r)+"ев":B(r)+"ов";default:if(function(n){return n.endsWith("не")}(s))return c()}}
if(function(n){return n.endsWith("йки")}(s))return v(r,3)+"ек";if(s.endsWith("ки")){if("ь"===f){const n=q(B(r))
;return v(r,3)+z("е",n)+n}if(J("жшч",f))return c();if(N(y,f))return v(r,2)+"ок"}if(Pe(s))return B(r)+"ей"
;if(function(n){return G(n,["аи","ои","еи","эи","уи"])}(s))return B(r)+"й";if(function(n){return"свечи"===n
}(s))return[B(r),B(r)+"ей"];if(function(n){return"пригоршни"===n}(s))return[B(r)+"ей",v(r,2)+"ен"];if(function(n){
return"тихони"===n}(s))return[v(r,2)+"нь",B(r)+"ей"];if(function(n){return G(n,["ьи","ии"])
}(s))return n.sd.hasStressedEndingSingular(e,t).includes(!0)?v(r,2)+"ей":v(r,2)+"ий";if(function(n){
return n.endsWith("ни")&&N(y,H(n,3))}(s))return function(n){return["барышни","боярышни","деревни"].includes(n)
}(s)?v(r,2)+"ень":function(n){return n.endsWith("кухни")}(s)?v(r,2)+"онь":function(n){return"сотни"===n
}(s)?[v(r,2),v(r,2)+"ен"]:v(r,2)+"ен";if(V(o).endsWith("ийк"))return v(o,2)+"ек";if(o.length===s.length-1&&hn(s,We)){
const n=H(o,2).charCodeAt(0);if(n!==g+9&&n!==g+28&&n!==p+9&&n!==p+28||e.isAnimate())return G(s,He)?B(o)+"ель":o+"ь";{
const n=q(o);return v(o,2)+z("е",n)+n}}return c()}}class Xe{sd=function(){let n;const e=on();function t(t,r){
const s=r.split(",");for(let r of s)n.text=r,e.put(n,t)}return n={pluraleTantum:!0},t("SSSSSSS-SSSSSS","ножны"),n={
gender:i.MASCULINE
},t("SSSSSSS-SSSSSS","брёх,дёрн,идиш,имидж,мед,упрёк"),t("SSSSSSS-EEEEEE","адрес,век,вечер,город,детдом,поезд,спецсчёт,субсчёт"),
t("SSSSSSE-EEEEEE","берег,бок,вес,лес,снег,дом,катер,счёт,мёд"),t("SSSSSSS-bbbbbb","вексель,ветер"),
t("SSSSSSE-ESEEEE","глаз"),t("SSSSSSE-bEEbEE","год"),t("SSSSSSb-bbbbbb","цех"),t("SbbSbbb-bbbbbb","грош,шприц"),
t("SssSsss-ssssss","кишмиш,кряж,слеш,слэш"),t("SEESeEE-EEEEEE","стеллаж"),t("SeeSeee-eeeeee","шиномонтаж"),n={
gender:i.MASCULINE,animate:!0},t("Sssssss-ssssss","паныч"),t("SSSSSSS-SSSSSS","балансёр,шофёр"),n={gender:i.NEUTER},
t("EEEEEEE-SsESEE","плечо"),
t("EEEEEEE-SSSSSS","тесло,стекло,автостекло,бронестекло,оргстекло,пеностекло,смарт-стекло,спецстекло,бедро,берцо,блесна,чело,стегно,стебло"),
n={gender:i.FEMININE},t("EEEbEEE-SSESEE","щека"),t("EEEEEEE-SSESEE","слеза"),t("EEEEEEE-SESSSS","семья,макросемья"),
t("EEEEEEE-SEESEE","вожжа,свеча"),t("EEESEEE-SSSSSS","душа"),t("EEEEEEE-eEeeee","скамья"),
t("EEEEEEE-EEEEEE","башка,кишка,ладья,лапша,моча,пыльца,статья"),n={gender:i.FEMININE,animate:!0},
t("EEEEEEE-SESESS","свинья,овца"),n={gender:i.COMMON,animate:!0},t("EEEEEEE-SSSSSS","судья"),
t("EEEEEEE-EEEEEE","левша"),e}();decline(n,e,r){const s=X.create(n)
;return R(r?V(r.charAt(0))!==r.charAt(0):s.lower().charCodeAt(0)!==s.text().charCodeAt(0),function(n,e,r,s){
const i=function(n,e,r,s){const i=e.text(),u=t[r],c=e.getDeclension();if(e.isIndeclinable())return i
;if(e.isPluraleTantum())return Ge(n,e,u,i);if(s)return Ge(n,e,u,s);switch(c){case-1:return i;case 0:return Vn(n,e,u)
;case 1:return Kn(n,e,u);case 2:return Pn(n,e,u);case 3:return kn(n,e,u)}}(n,e,r,s);if(i instanceof Array)return i
;return[i]}(this,s,e,r))}pluralize(n){const e=X.create(n);if(e.isPluraleTantum())return[e.text()]
;return R(e.lower().charCodeAt(0)!==e.text().charCodeAt(0),pe(this,e))}getLocativeForms(n){
const e=this,t=X.create(n),r=t.getDeclension();if(r&&r>=0){const n=vn.get(Dn(t))
;if(n instanceof Array)return n.map(n=>new h(function(n){switch(1+(n>>3&7)){case d.V:return"в";case d.VO:return"во"
;case d.NA:return"на"}}(n),function(n,e,t,r){const s=5;switch(e){case 0:return Vn(n,t,s);case 1:return $n(n,t,r);case 2:
return Pn(n,t,s);case 3:return kn(n,t,s)}}(e,r,t,S(n)),n>>6))}return[]}}
export{n as CASES,e as Case,Xe as Engine,i as Gender,X as Lemma,h as LocativeForm,l as LocativeFormAttribute,Z as createLemma,$ as createLemmaOrNull};
//# sourceMappingURL=RussianNouns.mjs.map
