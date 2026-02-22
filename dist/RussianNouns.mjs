/*!
  RussianNounsJS v3.0.0-alpha.1
  Copyright (c) 2011-2026 Georgy Ustinov
  Released under the MIT license
*/
const e=Object.freeze(["именительный","родительный","дательный","винительный","творительный","предложный","местный"]),t=Object.freeze({
NOMINATIVE:e[0],GENITIVE:e[1],DATIVE:e[2],ACCUSATIVE:e[3],INSTRUMENTAL:e[4],PREPOSITIONAL:e[5],LOCATIVE:e[6]})
;function n(t){return"number"==typeof t?t:e.indexOf(t)}
const r=Object.freeze(["женский","мужской","средний","общий"]),s=Object.freeze({FEMININE:r[0],MASCULINE:r[1],
NEUTER:r[2],COMMON:r[3]});function i(e,t,n){this.preposition=e,this.word=t,this.attributes=n}const u=Object.freeze({
CONTAINER:1,LOCATION:2,STRUCTURE:4,SURFACE:8,WAY:16,OBJECT_WITH_FUNCTIONAL_SURFACE:32,SUBSTANCE:64,RESOURCE:128,
CONDITION:256,EXPOSURE:512,MOTION:1024,EVENT:2048,WITH_ADJECTIVE:4096,WITHOUT_ADJECTIVE:8192,RELIGIOUS:16384
}),c=Object.freeze({PREPOSITIONAL:1,U_SUFFIX:2}),a=Object.freeze({V:1,VO:2,NA:3});function h(e,t,n){
return n<<6|(e-1&7)<<3|t-1&7}function o(e){return 1+(7&e)}function f(e){const t=e.replaceAll("ё","е")
;let n=t.length%2,r=1,s=5381;function i(){s=(33*s+(255&n))%4294967296,n>>=8,r-=8}for(let e of t){
const t=e.charCodeAt(0)-1072&31;n|=t<<r,r+=5,r>=8&&i()}r>0&&i();const u=t.charCodeAt(0)%2;return 2*(2147483647&s)+u}
function E(e){const t=e.charCodeAt(0)-1072;return 33===t?32:t===(31&t)?1<<t:0}function l(e,t){return 0!==(e&E(t))}
const d=3892855073,S=66567902,A=66567390;function p(e){return l(d,e)}function g(e){return e.split("").filter(p).length}
function I(e){return e.replaceAll("ё","е").replaceAll("Ё","Е")}function N(e,t){return e.substring(0,e.length-t)}
function O(e,t){return e.substring(e.length-t)}function C(e){return N(e,1)}function W(e){return T(e,1)}function T(e,t){
return e[e.length-t]||""}function _(e,t){return 1===t.length&&e.includes(t)}function w(e,t){
return t.some(t=>e.endsWith(t))}class b{constructor(e){e instanceof b?(this._txt=e._txt,this._lc=e._lc,
this._hash=e._hash,this._flags=e._flags):(e.pluraleTantum?this._flags=5:this._flags=1+r.indexOf(e.gender),
this._txt=e.text,this._lc=e.text.toLowerCase(),this._hash=f(this._lc),this._flags|=8*(1&e.indeclinable),
this._flags|=16*(1&e.animate),this._flags|=32*(1&e.surname),this._flags|=64*(1&e.name),this._flags|=128*(1&e.transport),
this._flags|=65536*(2+function(e,t,n,r){if(t)return-2;if(r)return-1;const i=W(e);switch(n){case s.FEMININE:
return"а"===i||"я"===i?2:l(S,i)?-1:3;case s.MASCULINE:return"а"===i||"я"===i?2:"путь"===e?0:1;case s.NEUTER:
return["дитя","полудитя"].includes(e)?0:"мя"===O(e,2)?3:1;case s.COMMON:return"а"===i||"я"===i?2:"и"===i?-1:1;default:
return-2}}(this._lc,e.pluraleTantum,e.gender,e.indeclinable)))}static create(e){if(e instanceof this)return e
;const t=U(e);if(t)throw new Error(t);return Object.freeze(new this(e))}static createOrNull(e){
return null===U(e)?Object.freeze(new this(e)):null}equals(e){
return e instanceof b&&this._flags===e._flags&&this.lower()===e.lower()}text(){return this._txt}lower(){return this._lc}
isPluraleTantum(){return 5==(7&this._flags)}getGender(){const e=7&this._flags;if(e>=1&&e<=4)return r[e-1]}
isIndeclinable(){return!!(8&this._flags)}isAnimate(){return!!(16&this._flags)||this.isASurname()||this.isAName()}
isASurname(){return!!(32&this._flags)}isAName(){return!!(64&this._flags)}isATransport(){return!!(128&this._flags)}
getDeclension(){return(this._flags>>16)-2}getSchoolDeclension(){const e=this.getDeclension();return 1===e?2:2===e?1:e}}
function m(e,t){const n=new b(e);return n._txt=t,n._lc=t.toLowerCase(),n._hash=f(n.lower()),Object.freeze(n)}
function U(e){if(null==e)return"No parameters specified."
;for(let t of["pluraleTantum","indeclinable","animate","surname","name","transport"]){
if((e=>null!=e&&"boolean"!=typeof e)(e[t]))return t+" must be boolean."}
if(null==e.text)return"A cyrillic word required.";if(!e.pluraleTantum){
if(null==e.gender)return"A grammatical gender required.";if(!r.includes(e.gender))return"Bad grammatical gender."}
return null}function R(e){return b.create(e)}function M(e){return b.createOrNull(e)}function L(e){const t=new Set
;let n=0;for(let r of e)n+=r,t.add(n);return t}
const x=L([11720389,548,1024,1479,2622,2867,1222,2642,264,1328,137,123,397,65542229,212447047,31729170,8094836,1056,21701789,35520559,40358,21819,28248,119786,63892,31809,7356,74383,72369,5945,28902,90120738,21187517,91925642,3054826,1600765,65934,30948851,5569212,4205640,5412804,6787095,9749916,3940084,1511466,1303038,16090470,1376628,49919694,3827522,37915959,14032615,28701924,224587434,637275762,51079457,391103676,24108070,158999424,232633267,6058815,66599250,692781441,816204112,55209380,72754,90006,80058,45564,67845,42548,27193,21401,139393,750335,170896,4424,1566,6264,154969,17292,17229,175112,83011,117872,4183,13065,108972,108088,343663,66210,334,17090,380271,283272,59007,35796,230801,1067156,19992,157124,12433,252644,2626,23776,630482,531296,304718,90891,726,23116,47653,30493,167310,50156,123071,477118,241821,55660,908992,534269,205157,11218,2490,660,66391,46856,847526,68710,8450,36630,15642,109864,41716,354482,79820,51876,97325,5506,46436,191803,3957,40876,126323,2347821,338490,73216,475569,87602,29642,4220,10760,16896,50156,17424,35178,167244,126786,33643,30488,65045,35961,51453,55660,4,152461,138332,1958,34200,3709,61381,17424,30158,80591,11218,44099,260487]),F=L([11720389,548,1024,1060,4,5904,1848,4404,330555234,4691346,3365076,1045362,7414584,960432,10564312,253286,16178203,4357,4355,11350,31120,5248,40591,62367,54057,50487,13069,3664,39764,10263,3002,5810,8844,24551,4091,56761,21785,30553,55147139,15960625,1933097,12258067,16302047,54210486,45688435,1659767,4813249,33577763,2501798,10056946,672528,14209351,2012340,1655412,4652736,62568,148698,21186,71129124,260014161,108045611,1007583269,2026464,22799532,750068913,1499532,1285428194,74598,22348,6599,132273,309821,156816,397448,179394,148036,100257,21779,11218,36631,345954,50442,104394,2724,112115,30690,10552,31377,11286,7168,14612,51480,116537,192258,163145,65604,97951,1363157,212810,431243,2622,425588,275284,150351,570568,244701,16659,26136,130134,11040,159389,728373,3476,726,1290392,224730,189158,11218,2490,10750,21608,143747,65974,664563,84036,16283,17424,5758,45080,33066,1782,90658,37101,56107,233163,14216,5518,179264,2525,146957,111342,80594,2309,4217,25432,26905,29980,518951,1458289,523705,4202,477865,149368,126310,47828,212678,22744,269176,179119,4399,35997,69696,41777,41,127336,4202,73153,46372,114255,126869,23630,11218])
;class y{constructor(){this._filter=new Uint8ClampedArray(256)}addInteger(e){this.addRaw(P(e))}hasInteger(e){
return this.hasRaw(P(e))}addRaw(e){const t=2047&e,n=t>>>3;this._filter[n]=this._filter[n]|1<<7-t%8}hasRaw(e){
const t=2047&e;return!!(this._filter[t>>>3]>>>7-t%8&1)}clone(){return function(e){const t=new y
;return t._filter=Uint8ClampedArray.from(e),t}(this._filter)}}function P(e){return e>>>22&2047^e>>>11&2047^2047&e}
function k(e){const t=e.padStart(3,"а");return(7&t.charCodeAt(0))<<8|(15&t.charCodeAt(1))<<4|15&t.charCodeAt(2)}
const V=function(){const e=new y;return x.forEach(t=>e.addInteger(t)),F.forEach(t=>e.addInteger(t)),Object.freeze(e)}()
;function j(){const e=new Map,t=V.clone(),r=function(e){return 4294967296*(31&e._flags)+e._hash},i=function(e){
return e.lower().indexOf("ё")+1&255},u=t=>{const n=65504&t._flags,s=(t=>{const n=r(t),s=e.get(n)
;return s instanceof Array?s:[]})(t).filter(e=>(e[0]&n)<=n),u=s.filter(e=>e[0]>>16===i(t))
;return u.length?u[0][1]:s.length?s[0][1]:void 0};this.put=function(n,s){
const u=s.split("-"),c=(e,t)=>e.length!==t||e.split("").some(e=>!"SsbeE".includes(e))
;if(2!==u.length||c(u[0],7)||c(u[1],6))throw new Error("Bad settings format.");const a=b.create(n),h=r(a);let o=e.get(h)
;o instanceof Array||(o=[],e.set(h,o));const f=65535&a._flags|i(a)<<16,E=o.find(e=>f===e[0]);E?E[1]=s:o.push([f,s]),
t.addInteger(a._hash)};const c=e=>{switch(e){case"E":return[!0];case"e":return[!0,!1];case"b":case"s":return[!1,!0]
;default:return[!1]}};this.hasStressedEndingSingular=function(e,r){if(t.hasInteger(e._hash)){const t=n(r);if(t>=0){
let n=u(e);if(n){const e=n.split("-")[0];return c(e[t])}if(e.getGender()===s.MASCULINE){
if(x.has(e._hash))return c("SEESEEE"[t]);if(F.has(e._hash))return c("SEEEEEE"[t])}}}return[]},
this.hasStressedEndingPlural=function(e,r){if(t.hasInteger(e._hash)){const t=n(r);if(t>=0&&t<6){let n=u(e);if(n){
const e=n.split("-")[1];return c(e[t])}
if(e.getGender()===s.MASCULINE&&(x.has(e._hash)||e.isAnimate()&&F.has(e._hash)))return c("E")}}return[]}}function D(e){
let t=new Map;for(let n of e){let e=t;for(let t=n.length-1;t>=0;t--){const r=n.charCodeAt(t);if(t>0){const t=e.get(r)
;if(0===t)break;void 0===t&&e.set(r,new Map),e=e.get(r)}else e.set(r,0)}}return t}function z(e,t){let n=t
;for(let t=e.length-1;t>=0;t--){const r=e.charCodeAt(t);if(!n.has(r))return!1;{const e=n.get(r);if(0===e)return!0;n=e}}}
function B(e){let t=new Array(e.length);for(let n=0;n<e.length;n++){let r=e.charCodeAt(n)
;r>=1040&&r<=1071?r+=32:r>=1024&&r<=1039&&(r+=80),t[n]=r}return String.fromCharCode.apply(null,t)}function H(e,t){
return t===t.toUpperCase()?e.toUpperCase():e}
const J=D(["ое","нький","ский","ской","лстой","отой","утой","евой","овой","живой"]),G=D(["ее","ое","нький","ский","ской","лстой","отой","утой"]),v=D(["евой","овой","отой","живой"]),X=D(["шний","жний","щий","ший","жий","чий"]),Y=["божий","ажий","яжий","ужий","южий","бульдожий","кабарожий","медвежий","носорожий","миножий"],q=D(Y),K=D(Y.map(e=>N(e,2)+"ьи")),Q=new Set(["бубен","бугор","ветер","вошь","вымысел","горшок","деготь","дёготь","дятел","домысел","замысел","кашель","коготь","лапоть","лоб","локоть","ломоть","молебен","мох","ноготь","овен","пепел","пес","пёс","петушок","помысел","порошок","промысел","псалом","пушок","ров","рожь","рот","сон","стебель","стишок","угол","умысел","хребет","церковь","шов","ковер","овес","костер"].map(f)),Z=new y
;Q.forEach(e=>Z.addInteger(e))
;const $=D(["овёс","ковёр","костёр","шатер","шатёр","козел","козёл","котел","котёл","орел","орёл","осел","осёл","узел","уголь","чок","ешок","хол"])
;function ee(e,t){const n=W(t);if(l(-402111711,n)){if(l(d,T(t,2))){const n=N(e,2);return z(t,q)?n+H("ь",n):n}
if("й"!==n)return C(e)}return e}const te=["ясень","бюллетень","олень","тюлень","гордень","пельмень","ячмень"]
;function ne(e,t,n){const r=e.text(),i=W(t),u=E(i);let c;return-133667019&u&&(-402111711&u?c=function(e,t,n){
const r=T(t,2);return"ь"===r||"о"===n&&l(2504708,r)?C(e):ee(e,t)}(r,t,i):"к"===i?c=function(e,t,n){
return e.length>=4&&w(t,["рёк","нёк","лёк"])&&!1!==n?N(e,2)+"ьк":t.endsWith("ёк")&&l(d,T(t,3))?N(e,2)+"йк":void 0
}(r,t,n):"ь"===i?c=function(e,t,n){
return Q.has(e._hash)||z(n,$)?N(t,3)+T(t,2):n.endsWith("ень")&&e.getGender()===s.MASCULINE&&!w(n,te)?N(t,3)+"н":C(t)
}(e,r,t):(["лёд","лед","лён"].includes(t)||"лев"===t&&e.isAnimate())&&(c=N(r,2)+H("ь",T(r,2))+W(r))),
c||(c=function(e,t,n){
return!!(199680&n)&&z(t,$)&&!["новосел","новосёл"].includes(t)||!!(2571270&n)&&(Z.hasInteger(e._hash)&&Q.has(e._hash)||e.isAnimate()&&t.endsWith("посол"))
}(e,t,u)?N(r,2)+W(r):r),c}function re(e,t){const n=C(e),r=C(t.lower());if("а"===W(r))return n
;if(w(r,["зне","жне","гре","спе","мудре"])||O(C(r),3).split("").every(e=>l(A,e))||t.isAName())return n
;if("ле"===O(r,2)){const e=T(r,3);return l(d,e)||"л"===e?C(n)+"ь":n}
return l(d,W(r))&&"и"!==W(r)?l(d,W(C(r)))?N(e,2)+"й":w(t.lower(),["месяц"])?n:N(e,2):n}
const se=D(["лапоток","желток","нишок","ришок","ишек"]),ie=["поток","приток","переток","проток","биоток","электроток","восток","водосток","водоток","воток","знаток"],ue=["инок","исток","обморок","порок","пророк","сток","урок"]
;function ce(e){
return w(e,["чек","шек"])&&e.length>=6||z(e,se)||e.endsWith("ок")&&!e.endsWith("шок")&&!ue.includes(e)&&!w(e,ie)&&!l(d,T(e,3))&&(l(d,T(e,4))||w(N(e,2),["ст","рт"]))&&e.length>=4
}function ae(e,t,n){return(e.length?e:[!1]).map(e=>n(e?I(t):t,e))}const he=0,oe=3,fe={"дочь":"дочерь","мать":"матерь"}
;function Ee(e,t,n){const r=t.text(),s=t.lower();if(![he,oe].includes(n)&&Object.keys(fe).includes(s)){
return Ee(e,m(t,fe[s]),n)}let i=ne(t,s);if(function(e){
return e.endsWith("полночь")||e.startsWith("пол")&&l(134217984,W(e))&&g(e)>=2}(s)&&(i="полу"+i.substring(3)),
"мя"===O(s,2))switch(n){case he:case oe:return r;case 1:case 2:case 5:case 6:return i+"ени";case 4:return i+"енем"
}else switch(n){case he:case oe:return r;case 1:case 2:case 5:case 6:return i+"и";case 4:
return w(s,["вошь","рожь","церковь"])?r+"ю":i+"ью"}}function le(e,t,n){const r=t.text(),s=t.lower()
;if(s.endsWith("путь"))return 4===n?C(r)+"ём":Ee(e,t,n);if(!s.endsWith("дитя"))throw new Error("unsupported");switch(n){
case 0:case 3:return r;case 1:case 2:case 5:case 6:return r+"ти";case 4:return[r+"тей",r+"тею"]}}function de(e,t,n){
const r=t.text(),s=t.lower(),i=ne(t,s),u=B(i),c=C(r),a=C(s),h=()=>"я"===W(s),o=()=>s.endsWith("ая")&&!(2===g(s)||l(d,W(u))),f=()=>s.endsWith("яя")&&!(2===g(s)||l(d,W(u))),E=["жая","шая"]
;switch(n){case 0:return r;case 1:
return f()||w(s,E)?i+"ей":o()?i+"ой":t.isASurname()&&!s.endsWith("да")?c+"ой":s.endsWith("ничья")?c+"ей":h()||l(60818504,W(u))?c+"и":c+"ы"
;case 2:case 5:case 6:
return f()||w(s,E)?i+"ей":o()?i+"ой":t.isASurname()&&!s.endsWith("да")?c+"ой":"ия"===O(s,2)?c+"и":s.endsWith("ничья")?c+"ей":c+"е"
;case 3:return o()?i+"ую":f()?i+"юю":h()?c+"ю":c+"у";case 4:
return f()||w(s,E)?i+"ею":o()?[i+"ой",i+"ою"]:h()||_("жшчщц",W(u))&&!e.sd.hasStressedEndingSingular(t,n).includes(!0)?"и"===W(a)?c+"ей":[c+"ей",c+"ею"]:[c+"ой",c+"ою"]
}}const Se=D(["ов","ев","ёв","ин","ын"]),Ae=function(e,t){let n=t;for(let t=0;t<e.length;t++){
const r=e.charCodeAt(t),s=n;n=new Map,n.set(r,s)}return n}("ы",Se);function pe(e){
return e.filter((t,n)=>e.indexOf(t)===n)}function ge(e){const t=1&e.lower().includes("ё")
;return 4294967296*((65535&e._flags)<<1|t)+e._hash}const Ie=Object.freeze(function(){const e=new Map,t={
gender:s.MASCULINE},n={gender:s.MASCULINE,animate:!0};function r(t,n,r,s,i){
const u=s.split(","),a=i instanceof Array?i:[c.U_SUFFIX];for(let s of u){t.text=s;const i=ge(b.create(t));let u=e.get(i)
;u||(u=[],e.set(i,u));for(let e of r)for(let t of a)u.push(h(e,t,n))}}const i=[a.V],o=[a.VO],f=[a.NA]
;r(t,u.CONTAINER,i,"мозг,пруд,стог,таз,год"),r(t,u.CONTAINER,o,"рот"),r(t,u.WAY,i,"год"),r(t,u.CONTAINER,i,"гроб"),
r(t,u.CONTAINER|u.RELIGIOUS,o,"гроб",[c.PREPOSITIONAL]),
r(t,u.LOCATION,i,"ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,низ,хлев"),
r(t,u.STRUCTURE,i,"круг,полк,артполк,ряд,род,строй,лад"),r(t,u.SURFACE,f,"баз,берег,бережок,вал,кон,круг,луг,пол,яр"),
r(t,u.WAY,f,"век,день"),r(t,u.WAY,i,"час"),r(t,u.WAY,f,"корень"),r(n,u.OBJECT_WITH_FUNCTIONAL_SURFACE,f,"вор"),
r(t,u.OBJECT_WITH_FUNCTIONAL_SURFACE,f,"повод,бочок,борт,воз,горб,кол,мост,плот,сук,х"+String.fromCharCode(1091)+"й"),
r(t,u.OBJECT_WITH_FUNCTIONAL_SURFACE,f,"крюк,болт",[c.PREPOSITIONAL,c.U_SUFFIX]);const E=",мёд,мех,пар,пух"
;r(t,u.SUBSTANCE,i,"дым,жир,мел,пушок"+E),
r(t,u.RESOURCE,f,"газ,клей,спирт"+E),r(t,u.CONDITION,i,"бой,бред,быт,долг,плен,пыл,сок,ход,лад"),
r(t,u.EXPOSURE,i.concat(f),"вид"),r(t,u.EXPOSURE,f,"слух,счёт,ветер,ветр,свет"),r(t,u.MOTION,f,"ход,бег,вес"),
r(t,u.MOTION|u.WITH_ADJECTIVE,f,"шаг"),r(t,u.EVENT,f,"бал,пир"),r(t,u.CONDITION,f,"дух,плав"),
r(t,u.MOTION|u.WITH_ADJECTIVE,f,"газ"),r(t,u.CONTAINER,i,"глаз,зоб,нос,шкаф"),r(t,u.CONTAINER,o,"лоб"),
r(t,u.OBJECT_WITH_FUNCTIONAL_SURFACE,f,"глаз,лоб,нос,шкаф,холм");let l="бок,верх,зад,угол";return r(t,u.LOCATION,i,l),
r(t,u.OBJECT_WITH_FUNCTIONAL_SURFACE,f,l),r(t,u.LOCATION|u.WITHOUT_ADJECTIVE,i,"край"),
r(t,u.OBJECT_WITH_FUNCTIONAL_SURFACE|u.WITHOUT_ADJECTIVE,f,"край"),r(t,u.SURFACE,f,"лёд,мох,снег"),
r(t,u.SUBSTANCE,o,"лёд,лён,мох"),r(t,u.SUBSTANCE,i,"снег"),e
}()),Ne=new Set("клей,чай,дом,дух,дым,дымок,газ,год,горошек,жар,жир,квас,пар,пыл,род,рост,сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,табак,творог,толк,торф,туман,убыток,укроп,уксус,ход,цемент,чеснок,шаг,шик,шиповник,шоколад,шорох,шум,яд".split(",")),Oe=new y
;Ne.forEach(e=>Oe.addInteger(f(e)))
;const Ce=D(["й","ие","иё"]),We=D(["воробей","муравей","ручей","соловей","улей"]),Te=D(["мой","ной","дой","шой","жой","рзой","осой","хой","латой","витой","литой","питой","житой","отой","утой","ятой","лагой","рагой","огой","угой","лубой","любой","илой","ылой","злой","малой","овой","евой","живой","ской","акой","укой","нний","ский","йкий","цкий","зкий","ткий","лкий","мкий","хкий","оркий","аркий","яркий","ький","ёкий","бокий","оокий","cокий","токий","ликий","дикий","укий","ыкий","який","пкий","дкий","бкий","нкий","жкий","чкий","гкий","овкий","авкий"])
;function _e(e,t){return"ый"===O(t,2)||(t.endsWith("кривой")||z(t,Te))&&g(t)>=2}
const we=D(["ий","ие","чье","тье","дье","вье","бье","жалованье","енье","ружье","божье","верье","мужье"]),be=D(["вое","лое","мое","ное","рое","тое","той","ый"])
;function me(e,t,n){const r=t.text(),i=B(r),u=W(i),c=t.getGender(),a=e.sd.hasStressedEndingSingular(t,n)
;let h=ne(t,i,a[0]),f=C(r);const E=Re(i);E&&(h="полу"+h.substring(3),f="полу"+f.substring(3));let l=B(h)
;const d=()=>E&&i.endsWith("я")||Le(i),S=z(i,Ce),A=()=>z(i,We)?C(f)+H("ь",W(f)):f,p=()=>_("чщ",W(l));function g(e){
return!t.isAnimate()&&Oe.hasInteger(t._hash)&&Ne.has(i)&&("й"===u?e.push(C(r)+H("ю",W(r))):e=e.concat(ae(a,h,e=>e+H("у",W(e))))),
e}switch(n){case 0:return r;case 1:switch(u){case"и":case"ы":if(E)return Ue(e,t,n,i);break;case"й":case"е":
if(S&&t.isASurname()||_e(0,i)||z(i,J))return h+"ого";if(z(i,X)||i.endsWith("ее"))return h+"его";case"ё":case"я":case"ь":
if(S){return g([A()+"я"])}if(d()&&!p())return h+"я";break;case"ц":return re(r,t)+"ца";case"к":if(ce(i))return C(f)+"ка"
;break;case"о":if(w(i,["шко"])&&s.MASCULINE===c)return f+"и"}let I
;return I=t.isASurname()||-1===l.indexOf("ё")?[h+"а"]:ae(a,h,e=>e+"а"),g(I);case 2:switch(u){case"и":case"ы":
if(E)return Ue(e,t,n,i);break;case"й":case"е":if(S&&t.isASurname()||_e(0,i)||z(i,J))return h+"ому"
;if(z(i,X)||i.endsWith("ее"))return h+"ему";case"ё":case"я":case"ь":if(S)return A()+"ю";if(d()&&!p())return h+"ю";break
;case"ц":return re(r,t)+"цу";case"к":if(ce(i))return C(f)+"ку"}
return t.isASurname()||-1===l.indexOf("ё")?h+"у":ae(a,h,e=>e+"у");case 3:
return c===s.NEUTER||_("иы",u)&&E?r:t.isAnimate()?me(e,t,1):r;case 4:switch(u){case"и":case"ы":if(E)return Ue(e,t,n,i)
;break;case"й":case"е":case"ё":case"я":case"ь":if(S&&t.isASurname()||z(i,G))return z(i,be)?h+"ым":h+"им"
;if(_e(0,i))return"и"===T(i,2)||i.endsWith("хой")?h+"им":h+"ым";if(z(i,v))return h+"ым";if(z(i,X))return h+"им"
;if(S)return A()+"ем";if(i.endsWith("це"))return r+"м";break;case"ц":return ae(a,r,(e,n)=>n?re(e,t)+"цом":re(e,t)+"цем")
;case"к":if(ce(i))return C(f)+"ком";break;case"н":case"в":if(t.isASurname()&&z(i,Se))return r+"ым"}
return d()||_("жшчщ",W(l))?ae(a,h,(e,t)=>t?e+"ом":e+"ем"):t.isASurname()||-1===l.indexOf("ё")?h+"ом":ae(a,h,e=>e+"ом")
;case 6:if("полпути"===i)return r;const N=Ie.get(ge(t));if(N){return pe(N.map(e=>o(e))).map(n=>Me(e,t,n))}case 5:
switch(u){case"и":if("полпути"===i)return r;case"ы":if(E)return Ue(e,t,n,i);break;case"й":case"е":case"ё":case"я":
case"ь":if(S&&t.isASurname()||_e(0,i)||z(i,J))return h+"ом";if(z(i,X)||i.endsWith("ее"))return h+"ем"
;if(w(i,["воробей"])){const e=C(f);return e+H("ье",W(e))}
if(z(i,we)&&!w(i,["запястье","здоровье","изголовье","платье"]))return f+"и";if("й"===u||"иё"===O(i,2))return A()+"е"
;break;case"ц":return re(r,t)+"це";case"к":if(ce(i))return C(f)+"ке"}
return t.isASurname()||-1===l.indexOf("ё")?h+"е":ae(a,h,e=>e+"е")}}function Ue(e,t,n,r){
const s=()=>"полминуты"!==r?"полу"+t.text().substring(3):t.text();if("полпути"===r){return le(e,m(t,C(s())+"ь"),n)}
if(r.endsWith("зни")||r.endsWith("сти")){return Ee(e,m(t,C(s())+"ь"),n)}
return de(e,m(t,C(s())+("ни"===O(r,2)?"я":"а")),n)}function Re(e){
if(e.startsWith("пол")&&l(2550137089,W(e))&&"л"!==e[3]&&g(e)>=2){let t=e.substring(3),n=t.search(/[а-яё]/)
;return n>=0&&l(S,t[n])}return!1}function Me(e,t,n){if(c.U_SUFFIX===n){const e=t.text(),n=t.lower();let r=ne(t,n),s=C(e)
;const i=Re(n)&&n.endsWith("я")||Le(n);return"й"===W(n)?I(s)+"ю":i?I(r)+"ю":ce(n)?I(C(s))+"ку":I(r)+"у"}
if(c.PREPOSITIONAL===n)return me(e,t,5)}function Le(e){
return"ь"===W(e)&&!e.endsWith("господь")||_("её",W(e))&&!w(e,["це","же"])}
const xe=new y,Fe=Object.freeze([[[s.MASCULINE,void 0],{"болгарин":["болгары"],"господин":["господа"],
"дядя":["дяди","дядья"],"зуб":["зубы","зубья"],"клок":["клочья","клоки"],"князь":["князи","князья"],
"кол":["колы","колья"],"месяц":["месяцы"],"полдень":["полдни","полудни"],"татарин":["татары"],"хозяин":["хозяева"],
"цветок":["цветки","цветы"],"черт":["черти"],"чёрт":["черти"]}],[[s.MASCULINE,!0],{
"кондуктор":["кондуктора","кондукторы"],"кум":["кумовья"],"муж":["мужья","мужи"]}],[[s.FEMININE,void 0],{
"гроздь":["грозди","гроздья"],"курица":["курицы","куры"],"стая":["стаи"],"щека":["щёки"],"береста":["берёсты"],
"верста":["вёрсты"],"десна":["дёсны"],"жена":["жёны"],"звезда":["звёзды"],"кинозвезда":["кинозвёзды"],
"медсестра":["медсёстры"],"метла":["мётлы"],"пчела":["пчёлы"],"сестра":["сёстры"],"слеза":["слёзы"]
}],[[s.NEUTER,void 0],{"брюхо":["брюхи"],"колено":["колена","колени","коленья"],"древо":["древа","древеса"],
"ухо":["уши"],"око":["очи"],"дно":["донья"],"чудо":["чудеса","чуда"],"небо":["небеса"],"бревно":["брёвна"],
"ведро":["вёдра"],"веретено":["веретёна"],"весло":["вёсла"],"гнездо":["гнёзда"],"зерно":["зёрна"],"знамя":["знамёна"],
"колесо":["колёса"],"облачко":["облачка"],"озеро":["озёра"],"полсотни":["полусотни"],"ребро":["рёбра"],
"ремесло":["ремёсла"],"седло":["сёдла"],"село":["сёла"]}]])
;for(const e of Fe)Object.keys(e[1]).map(e=>xe.addInteger(f(e)))
;const ye=["зять","деверь","друг","брат","собрат","стул","брус","обод","полоз","струп","подмастерье","якорь","перо","шило"],Pe=new Set(["берег","бок","борт","век","вес","веер","вексель","вечер","глаз","голос","город","доктор","дом","детдом","егерь","жемчуг","катер","колокол","концлагерь","корм","короб","кузов","купол","лес","луг","мастер","номер","пояс","провод","рог","сахар","снег","сорт","стог","счет","счёт","спецсчет","спецсчёт","субсчет","субсчёт","терем","том","холод","цвет","череп"]),ke=D(["округ","остров","отпуск","паспорт","парус","поезд","повар","погреб","рукав","цех","юнкер"]),Ve=new Set(["адрес","договор","буфер","ворох","директор","инспектор","инструктор","корпус","крейсер","орден","ордер","прожектор","пропуск","род","свитер","сервер","тенор","тон","трактор","тормоз","ветер","верх","китель","мех","хлеб","юнкер","ястреб"]),je=new Set(["бункер","вымпел","год","образ","омут","токарь","тополь","шторм","штуцер"])
;function De(e,t){const n=[],r=t.text(),i=B(r),u=e.sd.hasStressedEndingPlural(t,0);Object.freeze(u)
;const c=ne(t,i,u[0]),a=B(c);if(i.endsWith("яя"))return n.push(N(r,2)+"ие"),pe(n);const h=n=>{
const r=e.sd.hasStressedEndingPlural(t,0).map(e=>!e)
;return r.length?r.map(e=>e?1===a.replace(/[^её]/g,"").length?n((e=>{
const t=Math.max(e.toLowerCase().lastIndexOf("е"),e.toLowerCase().lastIndexOf("ё")),n=H("ё",e[t])
;return e.substring(0,t)+n+e.substring(t+1)})(c)):n(c):n(I(c))):[n(c)]
},o=t.getGender(),f=t.getDeclension(),E=("й"===W(i)||l(d,W(i)))&&l(d,W(C(i)))?C(r):c,S=()=>(i.endsWith("евич")||i.endsWith("евна"))&&i.indexOf("ье")>=0
;function A(){const e=E,t=B(e).indexOf("ье"),n=H("и",e[t]);return e.substring(0,t)+n+e.substring(t+1)}function p(){
l(60818504,W(a))||_("яйь",W(i))||w(i,["сосед"])?S()?(n.push(A()+"и"),
n.push(E+"и")):Array.prototype.push.apply(n,ae(u,E,e=>e+"и")):"ц"===W(i)?n.push(re(r,t)+"цы"):S()?(n.push(A()+"ы"),
n.push(E+"ы")):Array.prototype.push.apply(n,ae(u,E,e=>e+"ы"))}const g=function(e,t){if(xe.hasInteger(e._hash)){
const n=e.getGender(),r=e.isAnimate();for(const[e,s]of Fe){const i=e[0],u=e[1]
;if(n===i&&(null==u||u===r)&&s.hasOwnProperty(t))return s[t].slice()}}}(t,i);if(g)return g
;const b="ь"===W(a)?c:"к"===W(a)?C(c)+"чь":"г"===W(a)?C(c)+"зь":"й"===W(i)?C(r):w(i,["рь","ль"])?c:c+"ь";switch(f){
case-1:n.push(r);break;case 0:if("путь"===i)n.push("пути");else{if(!i.endsWith("дитя"))throw new Error("unsupported")
;n.push(N(r,3)+"ети")}break;case 1:if(ye.includes(i))n.push(b+"я");else if(s.MASCULINE===o){
const e=["крюк","лист","лоскут","повод","прут","сук","учитель","флигель","штабель"],s=["клин","колос","ком","край","соболь"]
;"сын"===i?(n.push("сыновья"),p()):"человек"===i?(n.push("люди"),p()):e.includes(i)||"соболь"===i&&t.isAnimate()?(p(),
n.push(b+"я")):s.includes(i)?n.push(b+"я"):Pe.has(i)||z(i,ke)||Ve.has(i)||je.has(i)?(je.has(i)&&p(),
Le(i)?Array.prototype.push.apply(n,h(e=>e+"я")):u.includes(!0)?n.push(I(c)+"а"):n.push(c+"а"),
Ve.has(i)&&p()):(i.endsWith("анин")&&i.length>5||i.endsWith("янин"))&&!t.isAName()||["барин","боярин"].includes(i)?(n.push(N(r,2)+"е"),
"барин"===i&&n.push(N(r,2)+"ы")):["цыган"].includes(i)?n.push(r+"е"):"щенок"===i?(n.push(N(r,2)+"ки"),
n.push(N(r,2)+"ята")):!i.endsWith("ребёнок")&&!i.endsWith("ребенок")||i.endsWith("жеребёнок")||i.endsWith("жеребенок")||i.endsWith("ястребёнок")||i.endsWith("ястребенок")?(i.endsWith("ёнок")||i.endsWith("енок"))&&t.isAnimate()?n.push(N(r,4)+"ята"):i.endsWith("ёночек")&&t.isAnimate()?n.push(N(r,6)+"ятки"):i.endsWith("онок")&&_("жшч",T(i,5))&&t.isAnimate()?n.push(N(r,4)+"ата"):ce(i)?n.push(N(r,2)+"ки"):z(i,X)?w(i,Y)?n.push(N(r,2)+"ьи"):n.push(C(r)+"е"):_e(0,i)?i.endsWith("ый")||i.endsWith("ий")?n.push(C(r)+"е"):i.endsWith("ой")&&!w(i,["хой","ской"])?n.push(N(r,2)+"ые"):n.push(N(r,2)+"ие"):i.endsWith("его")?n.push(N(r,3)+"ие"):["воробей","муравей","ручей","соловей","улей","жеребей","ирей","репей","чирей"].includes(i)?n.push(N(r,2)+"ьи"):p():n.push(N(r,7)+"дети")
}else if(s.NEUTER===o)if(w(i,["ко","чо"])&&!w(i,["войско","облако"]))n.push(C(r)+"и");else if(i.endsWith("имое"))n.push(c+"ые");else if(i.endsWith("ее"))n.push(c+"ие");else if(i.endsWith("ое"))w(a,["г","к","ж","ш","х"])?n.push(c+"ие"):n.push(c+"ые");else if(w(i,["ие","иё"]))n.push(N(r,2)+"ия");else if(w(i,["ье","ьё"])){
const e=N(r,2),t=["безделье","варенье","воскресенье","жалованье","запястье","застолье","затишье","здоровье","зелье","изголовье","новоселье","одночасье","печенье","платье","побережье","поголовье","подворье","подземелье","подполье","поместье","предплечье","раздумье","сиденье","средневековье","увечье","угодье","устье"].includes(i)
;"е"!==W(i)||t||n.push(e+"ия"),n.push(e+"ья")
}else w(i,["дерево","звено","крыло"])?n.push(c+"ья"):w(i,["ле","ре"])?n.push(c+"я"):i.endsWith("судно")&&t.isATransport()?n.push(N(r,2)+"а"):(Array.prototype.push.apply(n,h(e=>e+"а")),
w(i,["щупальце"])&&p());else n.push(c+"и");break;case 2:
"заря"===i?n.push("зори"):i.endsWith("ая")&&!i.endsWith("свая")?_("жхчшщ",W(a))||w(a,["вк","гк","ск","цк","ньк"])?n.push(c+"ие"):n.push(c+"ые"):p()
;break;case 3:
"мя"===O(i,2)?n.push(c+"ена"):Object.keys(fe).includes(i)?n.push(C(fe[i])+"и"):s.FEMININE===o?n.push(E+"и"):"и"===W(E)?n.push(E+"я"):n.push(E+"а")
}return pe(n)}
const ze=D(["ли","си","би","ви","ди","ти","пи","ри","ни","фи","зи","ьи","ья","ия","ря","ля","ая","аи","ои","уи","эи","ыи","яи","ёи","юи","еи","ии"]),Be=["беготни","болтовни","будни","вожжи","возни","доли","лапши","левши","люди","марли","моря","мощи","ноздри","пени","пятерни","распри","родни","сакли","сени","ступни","судьи","фигни","чукчи"],He=["головы","громадины","детины","деревенщины","дохлятины","дубины","ехидины","жадины","зверины","идиотины","кислятины","молодчины","орясины","остолопины","сиротины","скотины","старейшины","старины","старшины","уродины"],Je=D(He),Ge=["адреса","паспорта","поезда","цеха","снега","бункера","буфера","берега","вымпела","голоса","города","директора","договора","доктора","жемчуга","инспектора","инструктора","колокола","кондуктора","короба","корпуса","крейсера","кузова","леса","мастера","номера","облачка","острова","отпуска","паруса","повара","погреба","пояса","провода","прожектора","пропуска","рукава","сахара","свитера","сервера","счета","трактора","тормоза","холода","цвета","черепа","шторма","штуцера","юнкера","ястреба","суда","корм"],ve=D(Ge),Xe=new Set(Ge.concat(["бега","беглецы","близнецы","бойцы","бока","борта","борцы","бруствера","брюшки","веера","века","венцы","верха","веса","весы","вечера","вороха","глупцы","года","гонцы","дворцы","дельцы","детдома","детдомы","дома","жеребцы","жильцы","жрецы","затишки","зубцы","излишки","истцы","катера","концы","корма","кузнецы","купола","купцы","лишки","луга","мертвецы","меха","мудрецы","облака","образа","образцы","огурцы","округа","омута","ордена","ордера","отцы","очки","певцы","песцы","пловцы","подлецы","продавцы","птенцы","резцы","рога","рода","рубцы","самцы","свинцы","сорта","соуса","спецы","стога","столбцы","стрельцы","творцы","тельцы","тенора","терема","тома","тона","торцы","хлеба","штришки","юнцы"])),Ye=new Set(["авары","аланы","аршины","баклажаны","буквы","гольфы","граммы","гусары","дела","кадеты","килограммы","омы","помидоры","рентгены","ботинки","человеки","чулки","шорты"]),qe=new Set(["гектары","рельсы"]),Ke=new y
;Xe.forEach(e=>Ke.addRaw(k(e))),Ye.forEach(e=>Ke.addRaw(k(e))),qe.forEach(e=>Ke.addRaw(k(e)))
;const Qe=new Set(He.concat(["абазины","авы","аввы","бедняги","бедолаги","болгары","бродяги","брызги","брюки","брюхи","будды","бусы","валенки","веки","вельможи","верзилы","вилы","владыки","воеводы","волосы","вояки","главы","грузины","задворки","задиры","железы","жилы","зануды","зеваки","именины","калеки","кальсоны","каникулы","колготки","коллеги","крохи","курицы","куры","ладоши","ламы","лыки","макароны","мужчины","нападки","нары","непоседы","носилки","ножны","папы","папаши","таты","падлы","партизаны","погоны","поминки","посиделки","похороны","предтечи","работяги","разы","ребятки","румыны","самоубийцы","санки","убийцы","сапоги","сатаны","сироты","сливки","слуги","солдаты","старосты","сумерки","сутки","татары","телеса","хитрюги","четвереньки","шляпы","шмотки","яблоки","дядьки","дяденьки","зайки","кроссовки","малютки","малолетки","попки","турки","узы","хлопоты","шахматы"])),Ze=new y
;Qe.forEach(e=>Ze.addRaw(k(e)))
;const $e=["х","ых","их","м","ым","им","х","ых","их","ми","ыми","ими","х","ых","их"],et=["ям","ам","","","ями","ами","ях","ах"],tt=D(["вна","вца","вцы","пла","дца","дра","судна","рки","рцы","тлы","рна","тна","енца","десны","дёсны","рёбра","ребра","сосны"]),nt=D(["жи","ши","чи","ля","ли","чи","ри","ти","ди","сани","борщи","клещи","товарищи","плащи","прыщи","хрящи"]),rt=D(["братья","брусья","деревья","донья","звенья","клинья","клочья","коленья","колосья","колья","комья","крылья","крючья","листья","лоскутья","лохмотья","перья","платья","поводья","прутья","стулья","сучья","хлопья","шилья"]),st=D(["ишки","дружки","тки","папочки","дедушки","дядюшки","батюшки","катанки","петрушки","шестерки"]),it=D(["жки","шки","чки","рки","натки","хатки","ятки","етки","чётки","мки","нки","педки","илки"]),ut=D(["шок","щок","жок","зок","аток","яток","еток"])
;function ct(e,t,n,r){const i=B(r),u=W(i),c=E(u),a=n+1;if(1===a||4===a&&!t.isAnimate())return r
;if(134217984&c)if(2===a||4===a){if(w(i,["овичи","евичи"]))return C(r)+"ей"
;if(w(i,["вны","полусотни"])&&"овны"!==i)return N(r,2)+"ен"}else if(5===a){
if(w(i,["дети","люди"])&&!w(i,["нелюди"]))return C(r)+"ьми";if(w(i,["вери","дочери"]))return[C(r)+"ями",C(r)+"ьми"]}
const h=t.getGender(),o=i.endsWith("цы")?C(r):ee(r,i),f=z(i,Ae)&&(t.isASurname()||h===s.COMMON)&&!z(i,Je),S=3*Math.min(Math.round($e.length/3-1),a-2)
;if(f||i.endsWith("ничьи"))return r+$e[S];if(i.endsWith("ые"))return N(r,2)+$e[S+1]
;if(i.endsWith("ие")||z(i,K))return o+$e[S+2];if(a>2&&4!==a){const s=2,u=s*Math.min(Math.round(et.length/s-1),a-3)
;return z(i,ze)?C(r)+et[u]:e.sd.hasStressedEndingPlural(t,n).includes(!0)?I(o)+et[u+1]:o+et[u+1]}{
const c=t.getDeclension(),a=()=>{const s=B(o),u=["жки","шки","чки","ножны"]
;if(w(s,["кн","кл","дк","нк","пк","зк","рк","тк","вк","лк","мк"])&&!w(i,["сумерки"])||"зл"===s||w(i,u)&&e.sd.hasStressedEndingPlural(t,n).includes(!0)){
const e=W(o);return C(o)+H("о",e)+e}if(z(i,tt)&&!i.endsWith("недра")||w(i,u)){const e=T(r,2);return N(r,2)+H("е",e)+e}
if(w(i,["сестры","сёстры","серьги"])){const e=T(r,2);return("ь"===T(i,3)?I(N(r,3)):I(N(r,2)))+H("ё",e)+e}
if(w(s,["льц","сьм","деньг","ьк","йк","дьб"])){const e=W(o);return N(o,2)+H("е",e)+e}
return w(i,["сла","слы"])?C(o)+"ел":o};if([3,0].includes(c)){if(i.endsWith("и"))return C(r)+"ей"
;if(["гроздья"].includes(i))return C(r)+"ев"}const f=T(i,3);if(s.FEMININE!==h){const e=k(i),n=Ke.hasRaw(e)
;if(n&&Xe.has(i))return C(r)+"ов";if(n&&Ye.has(i)&&!t.isAName())return[a(),C(r)+"ов"]
;if(n&&qe.has(i))return[C(r)+"ов",a()]
;if(h===s.COMMON&&!w(i,Be)&&!_("жшч",f)||Ze.hasRaw(e)&&Qe.has(i)||t.isAName()&&h===s.MASCULINE&&t.lower().endsWith("а")||"барин"===t.lower())return a()
;switch(u){case"и":case"я":
if(z(i,nt)||"щи"===i||Be.includes(i)||t.lower().endsWith("ь")&&!w(t.lower(),["зять","деверь"])){
return("ь"===W(C(i))?N(r,2):C(r))+"ей"}
if("и"===u)return i.endsWith("ульи")?C(r)+"ев":i.endsWith("ьи")?s.MASCULINE===h?C(r)+"ёв":N(r,2)+"ей":["ча","кле","холу","ху"].includes(C(i))?C(r)+"ёв":i.endsWith("ищи")?a():i.endsWith("мессии")?C(r)+"й":l(d,T(i,2))?C(r)+"ев":!z(i,it)||s.MASCULINE===h&&!z(I(i),st)||z(t.lower(),ut)?C(r)+"ов":a()
;if(z(i,rt))return C(r)+"ев";if(w(i,["зятья","кумовья","деверья","края","острия"]))return C(r)+"ёв"
;if(w(i,["ья","ия"]))return s.MASCULINE===h?N(r,2)+"ей":N(r,2)+"ий";break;case"а":
return w(i,["семена","стремена"])?N(r,3)+"ян":i.endsWith("мена")?N(r,3)+"ён":t.lower().endsWith("яйцо")?H("яиц",C(r)):i.endsWith("нца")?[a(),C(r)+"ев"]:z(i,ve)?C(r)+"ов":a()
;case"ы":return w(i,["ницы","лицы","пицы","бицы"])?C(r):i.endsWith("цы")?C(r)+"ев":C(r)+"ов";default:
if(i.endsWith("не"))return a()}}if(i.endsWith("йки"))return N(r,3)+"ек";if(i.endsWith("ки")){if("ь"===f){const e=W(C(r))
;return N(r,3)+H("е",e)+e}if(_("жшч",f))return a();if(l(A,f))return N(r,2)+"ок"}if(Be.includes(i))return C(r)+"ей"
;if(w(i,["аи","ои","еи","эи","уи"]))return C(r)+"й";if("свечи"===i)return[C(r),C(r)+"ей"]
;if("пригоршни"===i)return[C(r)+"ей",N(r,2)+"ен"];if("тихони"===i)return[N(r,2)+"нь",C(r)+"ей"]
;if(w(i,["ьи","ии"]))return e.sd.hasStressedEndingSingular(t,n).includes(!0)?N(r,2)+"ей":N(r,2)+"ий"
;if(i.endsWith("ни")&&l(A,T(i,3)))return["барышни","боярышни","деревни"].includes(i)?N(r,2)+"ень":i.endsWith("кухни")?N(r,2)+"онь":"сотни"===i?[N(r,2),N(r,2)+"ен"]:N(r,2)+"ен"
;if(B(o).endsWith("ийк"))return N(o,2)+"ек";if(o.length===i.length-1&&z(i,ze)){if(_("ьй",B(T(o,2)))&&!t.isAnimate()){
const e=W(o);return N(o,2)+H("е",e)+e}return w(i,["земли","петли","пли","вли"])?C(o)+"ель":o+"ь"}return a()}}class at{
sd=function(){let e;const t=new j;function n(n,r){const s=r.split(",");for(let r of s)e.text=r,t.put(e,n)}return e={
pluraleTantum:!0},n("SSSSSSS-SSSSSS","ножны"),e={gender:s.MASCULINE
},n("SSSSSSS-SSSSSS","брёх,дёрн,идиш,имидж,мед,упрёк"),
n("SSSSSSS-EEEEEE","адрес,век,вечер,город,детдом,поезд,спецсчёт,субсчёт"),
n("SSSSSSE-EEEEEE","берег,бок,вес,лес,снег,дом,катер,счёт,мёд"),n("SSSSSSS-bbbbbb","вексель,ветер"),
n("SSSSSSE-ESEEEE","глаз"),n("SSSSSSE-bEEbEE","год"),n("SSSSSSb-bbbbbb","цех"),n("SbbSbbb-bbbbbb","грош,шприц"),
n("SssSsss-ssssss","кишмиш,кряж,слеш,слэш"),n("SEESeEE-EEEEEE","стеллаж"),n("SeeSeee-eeeeee","шиномонтаж"),e={
gender:s.MASCULINE,animate:!0},n("Sssssss-ssssss","паныч"),n("SSSSSSS-SSSSSS","балансёр,шофёр"),e={gender:s.NEUTER},
n("EEEEEEE-SsESEE","плечо"),
n("EEEEEEE-SSSSSS","тесло,стекло,автостекло,бронестекло,оргстекло,пеностекло,смарт-стекло,спецстекло,бедро,берцо,блесна,чело,стегно,стебло"),
e={gender:s.FEMININE},n("EEEbEEE-SSESEE","щека"),n("EEEEEEE-SSESEE","слеза"),n("EEEEEEE-SESSSS","семья,макросемья"),
n("EEEEEEE-SEESEE","вожжа,свеча"),n("EEESEEE-SSSSSS","душа"),n("EEEEEEE-eEeeee","скамья"),
n("EEEEEEE-EEEEEE","башка,кишка,ладья,лапша,моча,пыльца,статья"),e={gender:s.FEMININE,animate:!0},
n("EEEEEEE-SESESS","свинья,овца"),e={gender:s.COMMON,animate:!0},n("EEEEEEE-SSSSSS","судья"),
n("EEEEEEE-EEEEEE","левша"),t}();decline(t,n,r){return function(t,n,r,s){const i=function(t,n,r,s){
const i=n.text(),u=e.indexOf(r);if(n.isIndeclinable())return i;if(n.isPluraleTantum())return ct(t,n,u,i)
;if(s)return ct(t,n,u,s);switch(n.getDeclension()){case-1:return i;case 0:return le(t,n,u);case 1:return me(t,n,u)
;case 2:return de(t,n,u);case 3:return Ee(t,n,u)}}(t,n,r,s);if(i instanceof Array)return i;return[i]
}(this,b.create(t),n,r)}pluralize(e){const t=b.create(e);return t.isPluraleTantum()?[t.text()]:De(this,t)}
getLocativeForms(e){const t=this,n=b.create(e),r=n.getDeclension();if(r&&r>=0){const e=Ie.get(ge(n))
;if(e instanceof Array)return e.map(e=>new i(function(e){switch(1+(e>>3&7)){case a.V:return"в";case a.VO:return"во"
;case a.NA:return"на"}}(e),function(e,t,n,r){const s=5;switch(t){case 0:return le(e,n,s);case 1:return Me(e,n,r);case 2:
return de(e,n,s);case 3:return Ee(e,n,s)}}(t,r,n,o(e)),e>>6))}return[]}}
export{e as CASES,t as Case,at as Engine,s as Gender,b as Lemma,i as LocativeForm,u as LocativeFormAttribute,j as StressDictionary,R as createLemma,M as createLemmaOrNull};
//# sourceMappingURL=RussianNouns.mjs.map
