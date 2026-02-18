/*!
  RussianNounsJS v3.0.0-alpha.0
  Copyright (c) 2011-2026 Georgy Ustinov
  Released under the MIT license
*/
"use strict"
;const e=Object.freeze(["именительный","родительный","дательный","винительный","творительный","предложный","местный"]),t=Object.freeze({
NOMINATIVE:e[0],GENITIVE:e[1],DATIVE:e[2],ACCUSATIVE:e[3],INSTRUMENTAL:e[4],PREPOSITIONAL:e[5],LOCATIVE:e[6]
}),n=Object.freeze(["женский","мужской","средний","общий"]),r=Object.freeze({FEMININE:n[0],MASCULINE:n[1],NEUTER:n[2],
COMMON:n[3]});function s(e,t,n){this.preposition=e,this.word=t,this.attributes=n}const i=Object.freeze({CONTAINER:1,
LOCATION:2,STRUCTURE:4,SURFACE:8,WAY:16,OBJECT_WITH_FUNCTIONAL_SURFACE:32,SUBSTANCE:64,RESOURCE:128,CONDITION:256,
EXPOSURE:512,MOTION:1024,EVENT:2048,WITH_ADJECTIVE:4096,WITHOUT_ADJECTIVE:8192,RELIGIOUS:16384}),u=Object.freeze({
PREPOSITIONAL:1,U_SUFFIX:2}),c=Object.freeze({V:1,VO:2,NA:3});function a(e,t,n){return n<<6|(e-1&7)<<3|t-1&7}
function o(e){return 1+(7&e)}function E(e){const t=e.replaceAll("ё","е");let n=t.length%2,r=1,s=5381;function i(){
s=(33*s+(255&n))%4294967296,n>>=8,r-=8}for(let e of t){const t=e.charCodeAt(0)-1072&31;n|=t<<r,r+=5,r>=8&&i()}r>0&&i()
;const u=t.charCodeAt(0)%2;return 2*(2147483647&s)+u}function h(e){let t=new Array(e.length)
;for(let n=0;n<e.length;n++){let r=e.charCodeAt(n);r>=1040&&r<=1071?r+=32:r>=1024&&r<=1039&&(r+=80),t[n]=r}
return String.fromCharCode.apply(null,t)}function f(e){const t=e.charCodeAt(0)-1072;return 33===t?32:t===(31&t)?1<<t:0}
function l(e,t){return 0!==(e&f(t))}const d=3892855073,S=66567902;function I(e){return l(d,h(e))}function A(e,t){
return t===t.toUpperCase()?e.toUpperCase():e}function N(e){return e.split("").filter(I).length}function O(e){
return e.replaceAll("ё","е").replaceAll("Ё","Е")}function p(e,t){return e.substring(0,e.length-t)}function T(e,t){
return e.substring(e.length-t)}function g(e){return p(e,1)}function C(e){return T(e,1)}function b(e,t){
const n=e.length-t-1;return e.substring(n,n+1)}function W(e,t){return t.some(t=>e.endsWith(t))}function _(e,t,n){
return(e.length?e:[!1]).map(e=>n(e?O(t):t,e))}class w{constructor(e){e instanceof w?(this._txt=e._txt,this._lc=e._lc,
this._hash=e._hash,this._flags=e._flags):(e.pluraleTantum?this._flags=5:this._flags=1+n.indexOf(e.gender),
this._txt=e.text,this._lc=e.text.toLowerCase(),this._hash=E(this._lc),this._flags|=8*(1&e.indeclinable),
this._flags|=16*(1&e.animate),this._flags|=32*(1&e.surname),this._flags|=64*(1&e.name),this._flags|=128*(1&e.transport),
this._flags|=65536*(2+function(e,t,n,s){if(t)return-2;if(s)return-1;const i=C(e);switch(n){case r.FEMININE:
return"а"===i||"я"===i?2:l(S,i)?-1:3;case r.MASCULINE:return"а"===i||"я"===i?2:"путь"===e?0:1;case r.NEUTER:
return["дитя","полудитя"].includes(e)?0:"мя"===T(e,2)?3:1;case r.COMMON:return"а"===i||"я"===i?2:"и"===i?-1:1;default:
return-2}}(this._lc,e.pluraleTantum,e.gender,e.indeclinable)))}static create(e){if(e instanceof this)return e
;const t=U(e);if(t)throw new Error(t);return Object.freeze(new this(e))}static createOrNull(e){
return null===U(e)?Object.freeze(new this(e)):null}equals(e){
return e instanceof w&&this._flags===e._flags&&this.lower()===e.lower()}text(){return this._txt}lower(){return this._lc}
isPluraleTantum(){return 5==(7&this._flags)}getGender(){const e=7&this._flags;if(e>=1&&e<=4)return n[e-1]}
isIndeclinable(){return!!(8&this._flags)}isAnimate(){return!!(16&this._flags)||this.isASurname()||this.isAName()}
isASurname(){return!!(32&this._flags)}isAName(){return!!(64&this._flags)}isATransport(){return!!(128&this._flags)}
getDeclension(){return(this._flags>>16)-2}getSchoolDeclension(){const e=this.getDeclension();return 1===e?2:2===e?1:e}}
function m(e,t){const n=new w(e);return n._txt=t,n._lc=t.toLowerCase(),n._hash=E(n.lower()),Object.freeze(n)}
function U(e){if(null==e)return"No parameters specified."
;for(let t of["pluraleTantum","indeclinable","animate","surname","name","transport"]){
if((e=>null!=e&&"boolean"!=typeof e)(e[t]))return t+" must be boolean."}
if(null==e.text)return"A cyrillic word required.";if(!e.pluraleTantum){
if(null==e.gender)return"A grammatical gender required.";if(!n.includes(e.gender))return"Bad grammatical gender."}
return null}function L(e){const t=new Set;let n=0;for(let r of e)n+=r,t.add(n);return t}
const R=L([11720389,548,1024,1479,2622,2867,1222,2642,264,1328,137,123,397,65542229,212447047,31729170,8094836,1056,21701789,35520559,40358,21819,28248,119786,63892,31809,7356,74383,72369,5945,28902,90120738,21187517,91925642,3054826,1600765,65934,30948851,5569212,4205640,5412804,6787095,9749916,3940084,1511466,1303038,16090470,1376628,49919694,3827522,37915959,14032615,28701924,224587434,637275762,51079457,391103676,24108070,158999424,232633267,6058815,66599250,692781441,816204112,55209380,72754,90006,80058,45564,67845,42548,27193,21401,139393,750335,170896,4424,1566,6264,154969,17292,17229,175112,83011,117872,4183,13065,108972,108088,343663,66210,334,17090,380271,283272,59007,35796,230801,1067156,19992,157124,12433,252644,2626,23776,630482,531296,304718,90891,726,23116,47653,30493,167310,50156,123071,477118,241821,55660,908992,534269,205157,11218,2490,660,66391,46856,847526,68710,8450,36630,15642,109864,41716,354482,79820,51876,97325,5506,46436,191803,3957,40876,126323,2347821,338490,73216,475569,87602,29642,4220,10760,16896,50156,17424,35178,167244,126786,33643,30488,65045,35961,51453,55660,4,152461,138332,1958,34200,3709,61381,17424,30158,80591,11218,44099,260487]),M=L([11720389,548,1024,1060,4,5904,1848,4404,330555234,4691346,3365076,1045362,7414584,960432,10564312,253286,16178203,4357,4355,11350,31120,5248,40591,62367,54057,50487,13069,3664,39764,10263,3002,5810,8844,24551,4091,56761,21785,30553,55147139,15960625,1933097,12258067,16302047,54210486,45688435,1659767,4813249,33577763,2501798,10056946,672528,14209351,2012340,1655412,4652736,62568,148698,21186,71129124,260014161,108045611,1007583269,2026464,22799532,750068913,1499532,1285428194,74598,22348,6599,132273,309821,156816,397448,179394,148036,100257,21779,11218,36631,345954,50442,104394,2724,112115,30690,10552,31377,11286,7168,14612,51480,116537,192258,163145,65604,97951,1363157,212810,431243,2622,425588,275284,150351,570568,244701,16659,26136,130134,11040,159389,728373,3476,726,1290392,224730,189158,11218,2490,10750,21608,143747,65974,664563,84036,16283,17424,5758,45080,33066,1782,90658,37101,56107,233163,14216,5518,179264,2525,146957,111342,80594,2309,4217,25432,26905,29980,518951,1458289,523705,4202,477865,149368,126310,47828,212678,22744,269176,179119,4399,35997,69696,41777,41,127336,4202,73153,46372,114255,126869,23630,11218])
;class x{constructor(){this._filter=new Uint8ClampedArray(256)}addInteger(e){this.addRaw(V(e))}hasInteger(e){
return this.hasRaw(V(e))}addRaw(e){const t=2047&e,n=t>>>3;this._filter[n]=this._filter[n]|1<<7-t%8}hasRaw(e){
const t=2047&e;return!!(this._filter[t>>>3]>>>7-t%8&1)}clone(){return function(e){const t=new x
;return t._filter=Uint8ClampedArray.from(e),t}(this._filter)}}function V(e){return e>>>22&2047^e>>>11&2047^2047&e}
function P(e){const t=e.padStart(3,"а");return(7&t.charCodeAt(0))<<8|(15&t.charCodeAt(1))<<4|15&t.charCodeAt(2)}
const F=function(){const e=new x;return R.forEach(t=>e.addInteger(t)),M.forEach(t=>e.addInteger(t)),Object.freeze(e)}()
;function y(){const t=new Map,n=F.clone(),s=function(e){return 4294967296*(31&e._flags)+e._hash},i=function(e){
return e.lower().indexOf("ё")+1&255},u=e=>{const n=65504&e._flags,r=(e=>{const n=s(e),r=t.get(n)
;return r instanceof Array?r:[]})(e).filter(e=>(e[0]&n)<=n),u=r.filter(t=>t[0]>>16===i(e))
;return u.length?u[0][1]:r.length?r[0][1]:void 0};this.put=function(e,r){
const u=r.split("-"),c=(e,t)=>e.length!==t||e.split("").some(e=>!"SsbeE".includes(e))
;if(2!==u.length||c(u[0],7)||c(u[1],6))throw new Error("Bad settings format.");const a=w.create(e),o=s(a);let E=t.get(o)
;E instanceof Array||(E=[],t.set(o,E));const h=65535&a._flags|i(a)<<16,f=E.find(e=>h===e[0]);f?f[1]=r:E.push([h,r]),
n.addInteger(a._hash)};const c=e=>{switch(e){case"E":return[!0];case"e":return[!0,!1];case"b":case"s":return[!1,!0]
;default:return[!1]}};this.hasStressedEndingSingular=function(t,s){if(n.hasInteger(t._hash)){const n=e.indexOf(s)
;if(n>=0){let e=u(t);if(e){const t=e.split("-")[0];return c(t[n])}if(t.getGender()===r.MASCULINE){
if(R.has(t._hash))return c("SEESEEE"[n]);if(M.has(t._hash))return c("SEEEEEE"[n])}}}return[]},
this.hasStressedEndingPlural=function(t,s){if(n.hasInteger(t._hash)){const n=e.indexOf(s);if(n>=0&&n<6){let e=u(t)
;if(e){const t=e.split("-")[1];return c(t[n])}
if(t.getGender()===r.MASCULINE&&(R.has(t._hash)||t.isAnimate()&&M.has(t._hash)))return c("E")}}return[]}}function j(e){
let t=new Map;for(let n of e){let e=t;for(let t=n.length-1;t>=0;t--){const r=n.charCodeAt(t);if(t>0){const t=e.get(r)
;if(0===t)break;void 0===t&&e.set(r,new Map),e=e.get(r)}else e.set(r,0)}}return t}function z(e,t){let n=t
;for(let t=e.length-1;t>=0;t--){const r=e.charCodeAt(t);if(!n.has(r))return!1;{const e=n.get(r);if(0===e)return!0;n=e}}}
const D=j(["ое","нький","ский","ской","лстой","отой","утой","евой","овой","живой"]),k=j(["ее","ое","нький","ский","ской","лстой","отой","утой"]),G=j(["евой","овой","отой","живой"]),J=j(["шний","жний","щий","ший","жий","чий"]),B=["божий","ажий","яжий","ужий","южий","бульдожий","кабарожий","медвежий","носорожий","миножий"],H=j(B),v=j(B.map(e=>p(e,2)+"ьи")),X=new Set(["бубен","бугор","ветер","вошь","вымысел","горшок","деготь","дёготь","дятел","домысел","замысел","кашель","коготь","лапоть","лоб","локоть","ломоть","молебен","мох","ноготь","овен","пепел","пес","пёс","петушок","помысел","порошок","промысел","псалом","пушок","ров","рожь","рот","сон","стебель","стишок","угол","умысел","хребет","церковь","шов","ковер","овес","костер"].map(E)),Y=new x
;X.forEach(e=>Y.addInteger(e))
;const q=j(["овёс","ковёр","костёр","шатер","шатёр","козел","козёл","котел","котёл","орел","орёл","осел","осёл","узел","уголь","чок","ешок","хол"])
;function K(e,t){const n=C(t);if(l(-402111711,n)){if(l(d,b(t,1))){const n=p(e,2);return z(t,H)?n+A("ь",n):n}
if("й"!==n)return g(e)}return e}const Q=["ясень","бюллетень","олень","тюлень","гордень","пельмень","ячмень"]
;function Z(e,t,n){const s=e.text(),i=C(t),u=f(i);let c;return-133667019&u&&(-402111711&u?c=function(e,t,n){
const r=b(t,1);return"ь"===r||"о"===n&&l(2504708,r)?g(e):K(e,t)}(s,t,i):"к"===i?c=function(e,t,n){
return e.length>=4&&W(t,["рёк","нёк","лёк"])&&!1!==n?p(e,2)+"ьк":t.endsWith("ёк")&&l(d,b(t,2))?p(e,2)+"йк":void 0
}(s,t,n):"ь"===i?c=function(e,t,n){
return X.has(e._hash)||z(n,q)?p(t,3)+b(t,1):n.endsWith("ень")&&e.getGender()===r.MASCULINE&&!W(n,Q)?p(t,3)+"н":g(t)
}(e,s,t):(["лёд","лед","лён"].includes(t)||"лев"===t&&e.isAnimate())&&(c=p(s,2)+A("ь",b(s,1))+C(s))),
c||(c=function(e,t,n){
return!!(199680&n)&&z(t,q)&&!["новосел","новосёл"].includes(t)||!!(2571270&n)&&(Y.hasInteger(e._hash)&&X.has(e._hash)||e.isAnimate()&&t.endsWith("посол"))
}(e,t,u)?p(s,2)+C(s):s),c}function $(e,t){const n=g(e),r=g(t.lower());if("а"===C(r))return n
;if(W(r,["зне","жне","гре","спе","мудре"])||T(g(r),3).split("").every(e=>l(66567390,e))||t.isAName())return n
;if("ле"===T(r,2)){const e=b(r,2);return l(d,e)||"л"===e?g(n)+"ь":n}
return l(d,C(r))&&"и"!==C(r)?l(d,C(g(r)))?p(e,2)+"й":W(t.lower(),["месяц"])?n:p(e,2):n}
const ee=j(["лапоток","желток","нишок","ришок","ишек"]),te=["поток","приток","переток","проток","биоток","электроток","восток","водосток","водоток","воток","знаток"],ne=["инок","исток","обморок","порок","пророк","сток","урок"]
;function re(e){
return W(e,["чек","шек"])&&e.length>=6||z(e,ee)||e.endsWith("ок")&&!e.endsWith("шок")&&!ne.includes(e)&&!W(e,te)&&!l(d,b(e,2))&&(l(d,b(e,3))||W(p(e,2),["ст","рт"]))&&e.length>=4
}const se={"дочь":"дочерь","мать":"матерь"};function ie(e,n,r){const s=n.text(),i=n.lower()
;if(![t.NOMINATIVE,t.ACCUSATIVE].includes(r)&&Object.keys(se).includes(i)){return ie(e,m(n,se[i]),r)}let u=Z(n,i)
;if(function(e){return e.endsWith("полночь")||e.startsWith("пол")&&l(134217984,C(e))&&vowelCount(e)>=2
}(i)&&(u="полу"+u.substring(3)),"мя"===T(i,2))switch(r){case t.NOMINATIVE:case t.ACCUSATIVE:return s;case t.GENITIVE:
case t.DATIVE:case t.PREPOSITIONAL:case t.LOCATIVE:return u+"ени";case t.INSTRUMENTAL:return u+"енем"}else switch(r){
case t.NOMINATIVE:case t.ACCUSATIVE:return s;case t.GENITIVE:case t.DATIVE:case t.PREPOSITIONAL:case t.LOCATIVE:
return u+"и";case t.INSTRUMENTAL:return W(i,["вошь","рожь","церковь"])?s+"ю":u+"ью"}}function ue(e,n,r){
const s=n.text(),i=n.lower();if(i.endsWith("путь"))return r===t.INSTRUMENTAL?g(s)+"ём":ie(e,n,r)
;if(!i.endsWith("дитя"))throw new Error("unsupported");switch(r){case t.NOMINATIVE:case t.ACCUSATIVE:return s
;case t.GENITIVE:case t.DATIVE:case t.PREPOSITIONAL:case t.LOCATIVE:return s+"ти";case t.INSTRUMENTAL:
return[s+"тей",s+"тею"]}}function ce(e){return e.filter((t,n)=>e.indexOf(t)===n)}function ae(e){
const t=1&e.lower().includes("ё");return 4294967296*((65535&e._flags)<<1|t)+e._hash}const oe=Object.freeze(function(){
const e=new Map,t=Object.freeze({gender:r.MASCULINE}),n=Object.freeze({gender:r.MASCULINE,animate:!0})
;function s(t,n,r,s,i){const c=s.split(","),o=i instanceof Array?i:[u.U_SUFFIX];for(let s of c){
const i=Object.assign({},t);i.text=s;const u=ae(w.create(i));let c=e.get(u);c||(c=[],e.set(u,c))
;for(let e of r)for(let t of o)c.push(a(e,t,n))}}
const o=Object.freeze([c.V]),E=Object.freeze([c.VO]),h=Object.freeze([c.NA])
;s(t,i.CONTAINER,o,"мозг,пруд,стог,таз,год"),s(t,i.CONTAINER,E,"рот"),s(t,i.WAY,o,"год"),s(t,i.CONTAINER,o,"гроб"),
s(t,i.CONTAINER|i.RELIGIOUS,E,"гроб",[u.PREPOSITIONAL]),
s(t,i.LOCATION,o,"ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,низ,хлев"),
s(t,i.STRUCTURE,o,"круг,полк,артполк,ряд,род,строй,лад"),s(t,i.SURFACE,h,"баз,берег,бережок,вал,кон,круг,луг,пол,яр"),
s(t,i.WAY,h,"век,день"),s(t,i.WAY,o,"час"),s(t,i.WAY,h,"корень"),s(n,i.OBJECT_WITH_FUNCTIONAL_SURFACE,h,"вор"),
s(t,i.OBJECT_WITH_FUNCTIONAL_SURFACE,h,"повод,бочок,борт,воз,горб,кол,мост,плот,сук,х"+String.fromCharCode(1091)+"й"),
s(t,i.OBJECT_WITH_FUNCTIONAL_SURFACE,h,"крюк,болт",[u.PREPOSITIONAL,u.U_SUFFIX]);const f=",мёд,мех,пар,пух"
;s(t,i.SUBSTANCE,o,"дым,жир,мел,пушок"+f),
s(t,i.RESOURCE,h,"газ,клей,спирт"+f),s(t,i.CONDITION,o,"бой,бред,быт,долг,плен,пыл,сок,ход,лад"),
s(t,i.EXPOSURE,o.concat(h),"вид"),s(t,i.EXPOSURE,h,"слух,счёт,ветер,ветр,свет"),s(t,i.MOTION,h,"ход,бег,вес"),
s(t,i.MOTION|i.WITH_ADJECTIVE,h,"шаг"),s(t,i.EVENT,h,"бал,пир"),s(t,i.CONDITION,h,"дух,плав"),
s(t,i.MOTION|i.WITH_ADJECTIVE,h,"газ"),s(t,i.CONTAINER,o,"глаз,зоб,нос,шкаф"),s(t,i.CONTAINER,E,"лоб"),
s(t,i.OBJECT_WITH_FUNCTIONAL_SURFACE,h,"глаз,лоб,нос,шкаф,холм");let l="бок,верх,зад,угол";return s(t,i.LOCATION,o,l),
s(t,i.OBJECT_WITH_FUNCTIONAL_SURFACE,h,l),s(t,i.LOCATION|i.WITHOUT_ADJECTIVE,o,"край"),
s(t,i.OBJECT_WITH_FUNCTIONAL_SURFACE|i.WITHOUT_ADJECTIVE,h,"край"),s(t,i.SURFACE,h,"лёд,мох,снег"),
s(t,i.SUBSTANCE,E,"лёд,лён,мох"),s(t,i.SUBSTANCE,o,"снег"),e
}()),Ee=new Set("клей,чай,дом,дух,дым,дымок,газ,год,горошек,жар,жир,квас,пар,пыл,род,рост,сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,табак,творог,толк,торф,туман,убыток,укроп,уксус,ход,цемент,чеснок,шаг,шик,шиповник,шоколад,шорох,шум,яд".split(",")),he=new x
;Ee.forEach(e=>he.addInteger(E(e)))
;const fe=j(["й","ие","иё"]),le=j(["воробей","муравей","ручей","соловей","улей"]),de=j(["мой","ной","дой","шой","жой","рзой","осой","хой","латой","витой","литой","питой","житой","отой","утой","ятой","лагой","рагой","огой","угой","лубой","любой","илой","ылой","злой","малой","овой","евой","живой","ской","акой","укой","нний","ский","йкий","цкий","зкий","ткий","лкий","мкий","хкий","оркий","аркий","яркий","ький","ёкий","бокий","оокий","cокий","токий","ликий","дикий","укий","ыкий","який","пкий","дкий","бкий","нкий","жкий","чкий","гкий","овкий","авкий"])
;function Se(e,t){return"ый"===T(t,2)||(t.endsWith("кривой")||z(t,de))&&N(t)>=2}
const Ie=j(["ий","ие","чье","тье","дье","вье","бье","жалованье","енье","ружье","божье","верье","мужье"]),Ae=j(["вое","лое","мое","ное","рое","тое","той","ый"])
;function Ne(e,n,s){const i=n.text(),u=h(i),c=C(u),a=n.getGender(),E=e.sd.hasStressedEndingSingular(n,s)
;let f=Z(n,u,E[0]),l=g(i);const d=pe(u);d&&(f="полу"+f.substring(3),l="полу"+l.substring(3));let S=h(f)
;const I=()=>d&&u.endsWith("я")||ge(u),N=z(u,fe),O=()=>z(u,le)?g(l)+A("ь",C(l)):l,p=()=>"чщ".includes(C(S))
;function w(e){
return!n.isAnimate()&&he.hasInteger(n._hash)&&Ee.has(u)&&("й"===c?e.push(g(i)+A("ю",C(i))):e=e.concat(_(E,f,e=>e+A("у",C(e))))),
e}switch(s){case t.NOMINATIVE:return i;case t.GENITIVE:switch(c){case"и":case"ы":if(d)return Oe(e,n,s,u);break;case"й":
case"е":if(N&&n.isASurname()||Se(0,u)||z(u,D))return f+"ого";if(z(u,J)||u.endsWith("ее"))return f+"его";case"ё":case"я":
case"ь":if(N){return w([O()+"я"])}if(I()&&!p())return f+"я";break;case"ц":return $(i,n)+"ца";case"к":
if(re(u))return g(l)+"ка";break;case"о":if(W(u,["шко"])&&r.MASCULINE===a)return l+"и"}let h
;return h=n.isASurname()||-1===S.indexOf("ё")?[f+"а"]:_(E,f,e=>e+"а"),w(h);case t.DATIVE:switch(c){case"и":case"ы":
if(d)return Oe(e,n,s,u);break;case"й":case"е":if(N&&n.isASurname()||Se(0,u)||z(u,D))return f+"ому"
;if(z(u,J)||u.endsWith("ее"))return f+"ему";case"ё":case"я":case"ь":if(N)return O()+"ю";if(I()&&!p())return f+"ю";break
;case"ц":return $(i,n)+"цу";case"к":if(re(u))return g(l)+"ку"}
return n.isASurname()||-1===S.indexOf("ё")?f+"у":_(E,f,e=>e+"у");case t.ACCUSATIVE:
return a===r.NEUTER||"иы".includes(c)&&d?i:n.isAnimate()?Ne(e,n,t.GENITIVE):i;case t.INSTRUMENTAL:switch(c){case"и":
case"ы":if(d)return Oe(e,n,s,u);break;case"й":case"е":case"ё":case"я":case"ь":
if(N&&n.isASurname()||z(u,k))return z(u,Ae)?f+"ым":f+"им";if(Se(0,u))return"и"===b(u,1)||u.endsWith("хой")?f+"им":f+"ым"
;if(z(u,G))return f+"ым";if(z(u,J))return f+"им";if(N)return O()+"ем";if(u.endsWith("це"))return i+"м";break;case"ц":
return _(E,i,(e,t)=>t?$(e,n)+"цом":$(e,n)+"цем");case"к":if(re(u))return g(l)+"ком";break;case"н":case"в":
if(n.isASurname()&&z(u,surnameType1))return i+"ым"}
return I()||"жшчщ".includes(C(S))?_(E,f,(e,t)=>t?e+"ом":e+"ем"):n.isASurname()||-1===S.indexOf("ё")?f+"ом":_(E,f,e=>e+"ом")
;case t.LOCATIVE:if("полпути"===u)return i;const m=oe.get(ae(n));if(m){return ce(m.map(e=>o(e))).map(t=>Te(e,n,t))}
case t.PREPOSITIONAL:switch(c){case"и":if("полпути"===u)return i;case"ы":if(d)return Oe(e,n,s,u);break;case"й":case"е":
case"ё":case"я":case"ь":if(N&&n.isASurname()||Se(0,u)||z(u,D))return f+"ом";if(z(u,J)||u.endsWith("ее"))return f+"ем"
;if(W(u,["воробей"])){const e=g(l);return e+A("ье",C(e))}
if(z(u,Ie)&&!W(u,["запястье","здоровье","изголовье","платье"]))return l+"и";if("й"===c||"иё"===T(u,2))return O()+"е"
;break;case"ц":return $(i,n)+"це";case"к":if(re(u))return g(l)+"ке"}
return n.isASurname()||-1===S.indexOf("ё")?f+"е":_(E,f,e=>e+"е")}}function Oe(e,t,n,r){
const s=()=>"полминуты"!==r?"полу"+t.text().substring(3):t.text();if("полпути"===r){let r=m(t,g(s())+"ь")
;return decline0(e,r,n)}if(r.endsWith("зни")||r.endsWith("сти")){let r=m(t,g(s())+"ь");return decline3(e,r,n)}{
let i=m(t,g(s())+("ни"===T(r,2)?"я":"а"));return decline2(e,i,n)}}function pe(e){
if(e.startsWith("пол")&&l(2550137089,C(e))&&"л"!==e[3]&&N(e)>=2){let t=e.substring(3),n=t.search(/[а-яё]/)
;return n>=0&&l(consonants,t[n])}return!1}function Te(e,n,r){if(u.U_SUFFIX===r){const e=n.text(),t=n.lower()
;let r=Z(n,t),s=g(e);const i=pe(t)&&t.endsWith("я")||ge(t)
;return"й"===C(t)?O(s)+"ю":i?O(r)+"ю":re(t)?O(g(s))+"ку":O(r)+"у"}if(u.PREPOSITIONAL===r)return Ne(e,n,t.PREPOSITIONAL)}
function ge(e){return"ь"===C(e)&&!e.endsWith("господь")||"её".includes(C(e))&&!W(e,["це","же"])}function Ce(e,n,r){
const s=n.text(),i=n.lower(),u=Z(n,i),c=h(u),a=g(s),o=g(i),E=()=>"я"===C(i),f=()=>i.endsWith("ая")&&!(2===N(s)||l(d,C(c))),S=()=>i.endsWith("яя")&&!(2===N(s)||l(d,C(c))),I=["жая","шая"]
;switch(r){case t.NOMINATIVE:return s;case t.GENITIVE:
return S()||W(i,I)?u+"ей":f()?u+"ой":n.isASurname()&&!i.endsWith("да")?a+"ой":i.endsWith("ничья")?a+"ей":E()||l(60818504,C(c))?a+"и":a+"ы"
;case t.DATIVE:
return S()||W(i,I)?u+"ей":f()?u+"ой":n.isASurname()&&!i.endsWith("да")?a+"ой":"ия"===T(i,2)?a+"и":i.endsWith("ничья")?a+"ей":a+"е"
;case t.ACCUSATIVE:return f()?u+"ую":S()?u+"юю":E()?a+"ю":a+"у";case t.INSTRUMENTAL:
return S()||W(i,I)?u+"ею":f()?[u+"ой",u+"ою"]:E()||"жшчщц".includes(C(c))&&!e.sd.hasStressedEndingSingular(n,r).includes(!0)?"и"===C(o)?a+"ей":[a+"ей",a+"ею"]:[a+"ой",a+"ою"]
;case t.PREPOSITIONAL:case t.LOCATIVE:
return S()||W(i,I)?u+"ей":f()?u+"ой":n.isASurname()&&!i.endsWith("да")?a+"ой":"ия"===T(i,2)?a+"и":i.endsWith("ничья")?a+"ей":a+"е"
}}const be=new x,We=Object.freeze([[[r.MASCULINE,void 0],{"болгарин":["болгары"],"господин":["господа"],
"дядя":["дяди","дядья"],"зуб":["зубы","зубья"],"клок":["клочья","клоки"],"князь":["князи","князья"],
"кол":["колы","колья"],"месяц":["месяцы"],"полдень":["полдни","полудни"],"татарин":["татары"],"хозяин":["хозяева"],
"цветок":["цветки","цветы"],"черт":["черти"],"чёрт":["черти"]}],[[r.MASCULINE,!0],{
"кондуктор":["кондуктора","кондукторы"],"кум":["кумовья"],"муж":["мужья","мужи"]}],[[r.FEMININE,void 0],{
"гроздь":["грозди","гроздья"],"курица":["курицы","куры"],"стая":["стаи"],"щека":["щёки"],"береста":["берёсты"],
"верста":["вёрсты"],"десна":["дёсны"],"жена":["жёны"],"звезда":["звёзды"],"кинозвезда":["кинозвёзды"],
"медсестра":["медсёстры"],"метла":["мётлы"],"пчела":["пчёлы"],"сестра":["сёстры"],"слеза":["слёзы"]
}],[[r.NEUTER,void 0],{"брюхо":["брюхи"],"колено":["колена","колени","коленья"],"древо":["древа","древеса"],
"ухо":["уши"],"око":["очи"],"дно":["донья"],"чудо":["чудеса","чуда"],"небо":["небеса"],"бревно":["брёвна"],
"ведро":["вёдра"],"веретено":["веретёна"],"весло":["вёсла"],"гнездо":["гнёзда"],"зерно":["зёрна"],"знамя":["знамёна"],
"колесо":["колёса"],"облачко":["облачка"],"озеро":["озёра"],"полсотни":["полусотни"],"ребро":["рёбра"],
"ремесло":["ремёсла"],"седло":["сёдла"],"село":["сёла"]}]])
;for(const e of We)Object.keys(e[1]).map(e=>be.addInteger(E(e)))
;const _e=["зять","деверь","друг","брат","собрат","стул","брус","обод","полоз","струп","подмастерье","якорь","перо","шило"],we=new Set(["берег","бок","борт","век","вес","веер","вексель","вечер","глаз","голос","город","доктор","дом","детдом","егерь","жемчуг","катер","колокол","концлагерь","корм","короб","кузов","купол","лес","луг","мастер","номер","пояс","провод","рог","сахар","снег","сорт","стог","счет","счёт","спецсчет","спецсчёт","субсчет","субсчёт","терем","том","холод","цвет","череп"]),me=j(["округ","остров","отпуск","паспорт","парус","поезд","повар","погреб","рукав","цех","юнкер"]),Ue=new Set(["адрес","договор","буфер","ворох","директор","инспектор","инструктор","корпус","крейсер","орден","ордер","прожектор","пропуск","род","свитер","сервер","тенор","тон","трактор","тормоз","ветер","верх","китель","мех","хлеб","юнкер","ястреб"]),Le=new Set(["бункер","вымпел","год","образ","омут","токарь","тополь","шторм","штуцер"])
;function Re(e,n){const s=[],i=n.text(),u=h(i),c=e.sd.hasStressedEndingPlural(n,t.NOMINATIVE);Object.freeze(c)
;const a=Z(n,u,c[0]),o=h(a);if(u.endsWith("яя"))return s.push(p(i,2)+"ие"),ce(s);const E=r=>{
const s=e.sd.hasStressedEndingPlural(n,t.NOMINATIVE).map(e=>!e)
;return s.length?s.map(e=>e?1===o.replace(/[^её]/g,"").length?r((e=>{
const t=Math.max(e.toLowerCase().lastIndexOf("е"),e.toLowerCase().lastIndexOf("ё")),n=upperLike("ё",e[t])
;return e.substring(0,t)+n+e.substring(t+1)})(a)):r(a):r(O(a))):[r(a)]
},f=n.getGender(),S=n.getDeclension(),I=("й"===C(u)||l(d,C(u)))&&l(d,C(g(u)))?g(i):a,A=()=>(u.endsWith("евич")||u.endsWith("евна"))&&u.indexOf("ье")>=0
;function N(){const e=I,t=h(e).indexOf("ье"),n=upperLike("и",e[t]);return e.substring(0,t)+n+e.substring(t+1)}
function b(){l(60818504,C(o))||"яйь".includes(C(u))||W(u,["сосед"])?A()?(s.push(N()+"и"),
s.push(I+"и")):Array.prototype.push.apply(s,_(c,I,e=>e+"и")):"ц"===C(u)?s.push($(i,n)+"цы"):A()?(s.push(N()+"ы"),
s.push(I+"ы")):Array.prototype.push.apply(s,_(c,I,e=>e+"ы"))}if(be.hasInteger(n._hash))for(const[e,t]of We){
const r=e[0],i=e[1];if(f===r&&(null==i||i===n.isAnimate())&&t.hasOwnProperty(u)){const e=t[u];for(let t of e)s.push(t)
;return ce(s)}}const w="ь"===C(o)?a:"к"===C(o)?g(a)+"чь":"г"===C(o)?g(a)+"зь":"й"===C(u)?g(i):W(u,["рь","ль"])?a:a+"ь"
;switch(S){case-1:s.push(i);break;case 0:if("путь"===u)s.push("пути");else{
if(!u.endsWith("дитя"))throw new Error("unsupported");s.push(p(i,3)+"ети")}break;case 1:
if(_e.includes(u))s.push(w+"я");else if(r.MASCULINE===f){
const e=["крюк","лист","лоскут","повод","прут","сук","учитель","флигель","штабель"],t=["клин","колос","ком","край","соболь"]
;"сын"===u?(s.push("сыновья"),b()):"человек"===u?(s.push("люди"),b()):e.includes(u)||"соболь"===u&&n.isAnimate()?(b(),
s.push(w+"я")):t.includes(u)?s.push(w+"я"):we.has(u)||z(u,me)||Ue.has(u)||Le.has(u)?(Le.has(u)&&b(),
ge(u)?Array.prototype.push.apply(s,E(e=>e+"я")):c.includes(!0)?s.push(O(a)+"а"):s.push(a+"а"),
Ue.has(u)&&b()):(u.endsWith("анин")&&u.length>5||u.endsWith("янин"))&&!n.isAName()||["барин","боярин"].includes(u)?(s.push(p(i,2)+"е"),
"барин"===u&&s.push(p(i,2)+"ы")):["цыган"].includes(u)?s.push(i+"е"):"щенок"===u?(s.push(p(i,2)+"ки"),
s.push(p(i,2)+"ята")):!u.endsWith("ребёнок")&&!u.endsWith("ребенок")||u.endsWith("жеребёнок")||u.endsWith("жеребенок")||u.endsWith("ястребёнок")||u.endsWith("ястребенок")?(u.endsWith("ёнок")||u.endsWith("енок"))&&n.isAnimate()?s.push(p(i,4)+"ята"):u.endsWith("ёночек")&&n.isAnimate()?s.push(p(i,6)+"ятки"):u.endsWith("онок")&&"жшч".includes(lastOfNInitial(u,4))&&n.isAnimate()?s.push(p(i,4)+"ата"):re(u)?s.push(p(i,2)+"ки"):z(u,J)?W(u,B)?s.push(p(i,2)+"ьи"):s.push(g(i)+"е"):Se(0,u)?u.endsWith("ый")||u.endsWith("ий")?s.push(g(i)+"е"):u.endsWith("ой")&&!W(u,["хой","ской"])?s.push(p(i,2)+"ые"):s.push(p(i,2)+"ие"):u.endsWith("его")?s.push(p(i,3)+"ие"):["воробей","муравей","ручей","соловей","улей","жеребей","ирей","репей","чирей"].includes(u)?s.push(p(i,2)+"ьи"):b():s.push(p(i,7)+"дети")
}else if(r.NEUTER===f)if(W(u,["ко","чо"])&&!W(u,["войско","облако"]))s.push(g(i)+"и");else if(u.endsWith("имое"))s.push(a+"ые");else if(u.endsWith("ее"))s.push(a+"ие");else if(u.endsWith("ое"))W(o,["г","к","ж","ш","х"])?s.push(a+"ие"):s.push(a+"ые");else if(W(u,["ие","иё"]))s.push(p(i,2)+"ия");else if(W(u,["ье","ьё"])){
const e=p(i,2),t=["безделье","варенье","воскресенье","жалованье","запястье","застолье","затишье","здоровье","зелье","изголовье","новоселье","одночасье","печенье","платье","побережье","поголовье","подворье","подземелье","подполье","поместье","предплечье","раздумье","сиденье","средневековье","увечье","угодье","устье"].includes(u)
;"е"!==C(u)||t||s.push(e+"ия"),s.push(e+"ья")
}else W(u,["дерево","звено","крыло"])?s.push(a+"ья"):W(u,["ле","ре"])?s.push(a+"я"):u.endsWith("судно")&&n.isATransport()?s.push(p(i,2)+"а"):(Array.prototype.push.apply(s,E(e=>e+"а")),
W(u,["щупальце"])&&b());else s.push(a+"и");break;case 2:
"заря"===u?s.push("зори"):u.endsWith("ая")&&!u.endsWith("свая")?"жхчшщ".includes(C(o))||W(o,["вк","гк","ск","цк","ньк"])?s.push(a+"ие"):s.push(a+"ые"):b()
;break;case 3:
"мя"===T(u,2)?s.push(a+"ена"):Object.keys(se).includes(u)?s.push(g(se[u])+"и"):r.FEMININE===f?s.push(I+"и"):"и"===C(I)?s.push(I+"я"):s.push(I+"а")
}return ce(s)}const Me=function(e,t){let n=t;for(let t=0;t<e.length;t++){const r=e.charCodeAt(t),s=n;n=new Map,
n.set(r,s)}return n
}("ы",j(["ов","ев","ёв","ин","ын"])),xe=j(["ли","си","би","ви","ди","ти","пи","ри","ни","фи","зи","ьи","ья","ия","ря","ля","ая","аи","ои","уи","эи","ыи","яи","ёи","юи","еи","ии"]),Ve=["беготни","болтовни","будни","вожжи","возни","доли","лапши","левши","люди","марли","моря","мощи","ноздри","пени","пятерни","распри","родни","сакли","сени","ступни","судьи","фигни","чукчи"],Pe=["головы","громадины","детины","деревенщины","дохлятины","дубины","ехидины","жадины","зверины","идиотины","кислятины","молодчины","орясины","остолопины","сиротины","скотины","старейшины","старины","старшины","уродины"],Fe=j(Pe),ye=["адреса","паспорта","поезда","цеха","снега","бункера","буфера","берега","вымпела","голоса","города","директора","договора","доктора","жемчуга","инспектора","инструктора","колокола","кондуктора","короба","корпуса","крейсера","кузова","леса","мастера","номера","облачка","острова","отпуска","паруса","повара","погреба","пояса","провода","прожектора","пропуска","рукава","сахара","свитера","сервера","счета","трактора","тормоза","холода","цвета","черепа","шторма","штуцера","юнкера","ястреба","суда","корм"],je=j(ye),ze=new Set(ye.concat(["бега","беглецы","близнецы","бойцы","бока","борта","борцы","бруствера","брюшки","веера","века","венцы","верха","веса","весы","вечера","вороха","глупцы","года","гонцы","дворцы","дельцы","детдома","детдомы","дома","жеребцы","жильцы","жрецы","затишки","зубцы","излишки","истцы","катера","концы","корма","кузнецы","купола","купцы","лишки","луга","мертвецы","меха","мудрецы","облака","образа","образцы","огурцы","округа","омута","ордена","ордера","отцы","очки","певцы","песцы","пловцы","подлецы","продавцы","птенцы","резцы","рога","рода","рубцы","самцы","свинцы","сорта","соуса","спецы","стога","столбцы","стрельцы","творцы","тельцы","тенора","терема","тома","тона","торцы","хлеба","штришки","юнцы"])),De=new Set(["авары","аланы","аршины","баклажаны","буквы","гольфы","граммы","гусары","дела","кадеты","килограммы","омы","помидоры","рентгены","ботинки","человеки","чулки","шорты"]),ke=new Set(["гектары","рельсы"]),Ge=new x
;ze.forEach(e=>Ge.addRaw(P(e))),De.forEach(e=>Ge.addRaw(P(e))),ke.forEach(e=>Ge.addRaw(P(e)))
;const Je=new Set(Pe.concat(["абазины","авы","аввы","бедняги","бедолаги","болгары","бродяги","брызги","брюки","брюхи","будды","бусы","валенки","веки","вельможи","верзилы","вилы","владыки","воеводы","волосы","вояки","главы","грузины","задворки","задиры","железы","жилы","зануды","зеваки","именины","калеки","кальсоны","каникулы","колготки","коллеги","крохи","курицы","куры","ладоши","ламы","лыки","макароны","мужчины","нападки","нары","непоседы","носилки","ножны","папы","папаши","таты","падлы","партизаны","погоны","поминки","посиделки","похороны","предтечи","работяги","разы","ребятки","румыны","самоубийцы","санки","убийцы","сапоги","сатаны","сироты","сливки","слуги","солдаты","старосты","сумерки","сутки","татары","телеса","хитрюги","четвереньки","шляпы","шмотки","яблоки","дядьки","дяденьки","зайки","кроссовки","малютки","малолетки","попки","турки","узы","хлопоты","шахматы"])),Be=new x
;Je.forEach(e=>Be.addRaw(P(e)))
;const He=["х","ых","их","м","ым","им","х","ых","их","ми","ыми","ими","х","ых","их"],ve=["ям","ам","","","ями","ами","ях","ах"],Xe=j(["вна","вца","вцы","пла","дца","дра","судна","рки","рцы","тлы","рна","тна","енца","десны","дёсны","рёбра","ребра","сосны"]),Ye=j(["жи","ши","чи","ля","ли","чи","ри","ти","ди","сани","борщи","клещи","товарищи","плащи","прыщи","хрящи"]),qe=j(["братья","брусья","деревья","донья","звенья","клинья","клочья","коленья","колосья","колья","комья","крылья","крючья","листья","лоскутья","лохмотья","перья","платья","поводья","прутья","стулья","сучья","хлопья","шилья"]),Ke=j(["ишки","дружки","тки","папочки","дедушки","дядюшки","батюшки","катанки","петрушки","шестерки"]),Qe=j(["жки","шки","чки","рки","натки","хатки","ятки","етки","чётки","мки","нки","педки","илки"]),Ze=j(["шок","щок","жок","зок","аток","яток","еток"])
;function $e(t,n,s,i){const u=h(i),c=C(u),a=f(c),o=e.indexOf(s)+1;if(1===o||4===o&&!n.isAnimate())return i
;if(134217984&a)if(2===o||4===o){if(W(u,["овичи","евичи"]))return g(i)+"ей"
;if(W(u,["вны","полусотни"])&&"овны"!==u)return p(i,2)+"ен"}else if(5===o){
if(W(u,["дети","люди"])&&!W(u,["нелюди"]))return g(i)+"ьми";if(W(u,["вери","дочери"]))return[g(i)+"ями",g(i)+"ьми"]}
const E=n.getGender(),S=u.endsWith("цы")?g(i):K(i,u),I=z(u,Me)&&(n.isASurname()||E===r.COMMON)&&!z(u,Fe),N=3*Math.min(Math.round(He.length/3-1),o-2)
;if(I||u.endsWith("ничьи"))return i+He[N];if(u.endsWith("ые"))return p(i,2)+He[N+1]
;if(u.endsWith("ие")||z(u,v))return S+He[N+2];if(o>2&&4!==o){const e=2,r=e*Math.min(Math.round(ve.length/e-1),o-3)
;return z(u,xe)?g(i)+ve[r]:t.sd.hasStressedEndingPlural(n,s).includes(!0)?O(S)+ve[r+1]:S+ve[r+1]}{
const e=n.getDeclension(),a=()=>{const e=h(S),r=["жки","шки","чки","ножны"]
;if(W(e,["кн","кл","дк","нк","пк","зк","рк","тк","вк","лк","мк"])&&!W(u,["сумерки"])||"зл"===e||W(u,r)&&t.sd.hasStressedEndingPlural(n,s).includes(!0)){
const e=C(S);return g(S)+A("о",e)+e}if(z(u,Xe)&&!u.endsWith("недра")||W(u,r)){const e=b(i,1);return p(i,2)+A("е",e)+e}
if(W(u,["сестры","сёстры","серьги"])){const e=b(i,1);return("ь"===b(u,2)?O(p(i,3)):O(p(i,2)))+A("ё",e)+e}
if(W(e,["льц","сьм","деньг","ьк","йк","дьб"])){const e=C(S);return p(S,2)+A("е",e)+e}
return W(u,["сла","слы"])?g(S)+"ел":S};if([3,0].includes(e)){if(u.endsWith("и"))return g(i)+"ей"
;if(["гроздья"].includes(u))return g(i)+"ев"}const o=b(u,2);if(r.FEMININE!==E){const e=P(u),t=Ge.hasRaw(e)
;if(t&&ze.has(u))return g(i)+"ов";if(t&&De.has(u)&&!n.isAName())return[a(),g(i)+"ов"]
;if(t&&ke.has(u))return[g(i)+"ов",a()]
;if(E===r.COMMON&&!W(u,Ve)&&!"жшч".includes(o)||Be.hasRaw(e)&&Je.has(u)||n.isAName()&&E===r.MASCULINE&&n.lower().endsWith("а")||"барин"===n.lower())return a()
;switch(c){case"и":case"я":
if(z(u,Ye)||"щи"===u||Ve.includes(u)||n.lower().endsWith("ь")&&!W(n.lower(),["зять","деверь"])){
return("ь"===C(g(u))?p(i,2):g(i))+"ей"}
if("и"===c)return u.endsWith("ульи")?g(i)+"ев":u.endsWith("ьи")?r.MASCULINE===E?g(i)+"ёв":p(i,2)+"ей":["ча","кле","холу","ху"].includes(g(u))?g(i)+"ёв":u.endsWith("ищи")?a():u.endsWith("мессии")?g(i)+"й":l(d,b(u,1))?g(i)+"ев":!z(u,Qe)||r.MASCULINE===E&&!z(O(u),Ke)||z(n.lower(),Ze)?g(i)+"ов":a()
;if(z(u,qe))return g(i)+"ев";if(W(u,["зятья","кумовья","деверья","края","острия"]))return g(i)+"ёв"
;if(W(u,["ья","ия"]))return r.MASCULINE===E?p(i,2)+"ей":p(i,2)+"ий";break;case"а":
return W(u,["семена","стремена"])?p(i,3)+"ян":u.endsWith("мена")?p(i,3)+"ён":n.lower().endsWith("яйцо")?A("яиц",g(i)):u.endsWith("нца")?[a(),g(i)+"ев"]:z(u,je)?g(i)+"ов":a()
;case"ы":return W(u,["ницы","лицы","пицы","бицы"])?g(i):u.endsWith("цы")?g(i)+"ев":g(i)+"ов";default:
if(u.endsWith("не"))return a()}}if(u.endsWith("йки"))return p(i,3)+"ек";if(u.endsWith("ки")){if("ь"===o){const e=C(g(i))
;return p(i,3)+A("е",e)+e}if("жшч".includes(o))return a();if(l(consonantsExceptJ,o))return p(i,2)+"ок"}
if(Ve.includes(u))return g(i)+"ей";if(W(u,["аи","ои","еи","эи","уи"]))return g(i)+"й"
;if("свечи"===u)return[g(i),g(i)+"ей"];if("пригоршни"===u)return[g(i)+"ей",p(i,2)+"ен"]
;if("тихони"===u)return[p(i,2)+"нь",g(i)+"ей"]
;if(W(u,["ьи","ии"]))return t.sd.hasStressedEndingSingular(n,s).includes(!0)?p(i,2)+"ей":p(i,2)+"ий"
;if(u.endsWith("ни")&&l(consonantsExceptJ,b(u,2)))return["барышни","боярышни","деревни"].includes(u)?p(i,2)+"ень":u.endsWith("кухни")?p(i,2)+"онь":"сотни"===u?[p(i,2),p(i,2)+"ен"]:p(i,2)+"ен"
;if(h(S).endsWith("ийк"))return p(S,2)+"ек";if(S.length===u.length-1&&z(u,xe)){
if("ьй".includes(h(b(S,1)))&&!n.isAnimate()){const e=C(S);return p(S,2)+A("е",e)+e}
return W(u,["земли","петли","пли","вли"])?g(S)+"ель":S+"ь"}return a()}}exports.CASES=e,exports.Case=t,
exports.Engine=class{sd=function(){function e(e,t,n,r){const s=r.split(",");for(let r of s){const s=Object.assign({},t)
;s.text=r,e.put(s,n)}}const t=new y,n=Object.freeze({gender:r.MASCULINE}),s=Object.freeze({gender:r.MASCULINE,animate:!0
}),i=Object.freeze({gender:r.FEMININE}),u=Object.freeze({gender:r.FEMININE,animate:!0}),c=Object.freeze({
gender:r.COMMON,animate:!0}),a=(r,s)=>e(t,n,r,s);return e(t,n,"SSSSSSS-SSSSSS","брёх,дёрн,идиш,имидж,мед,упрёк"),e(t,{
pluraleTantum:!0
},"SSSSSSS-SSSSSS","ножны"),e(t,n,"SSSSSSS-EEEEEE","адрес,век,вечер,город,детдом,поезд,спецсчёт,субсчёт"),
e(t,n,"SSSSSSE-EEEEEE","берег,бок,вес,лес,снег,дом,катер,счёт,мёд"),e(t,s,"SSSSSSS-SSSSSS","балансёр,шофёр"),
e(t,n,"SSSSSSS-bbbbbb","вексель,ветер"),a("SSSSSSE-ESEEEE","глаз"),a("SSSSSSE-bEEbEE","год"),a("SSSSSSb-bbbbbb","цех"),
e(t,{gender:r.NEUTER
},"EEEEEEE-SSSSSS","тесло,стекло,автостекло,бронестекло,оргстекло,пеностекло,смарт-стекло,спецстекло,бедро,берцо,блесна,чело,стегно,стебло"),
e(t,i,"EEEbEEE-SSESEE","щека"),e(t,i,"EEEEEEE-SSESEE","слеза"),e(t,n,"SbbSbbb-bbbbbb","грош,шприц"),
e(t,n,"SssSsss-ssssss","кишмиш,кряж,слеш,слэш"),e(t,s,"Sssssss-ssssss","паныч"),a("SEESeEE-EEEEEE","стеллаж"),
a("SeeSeee-eeeeee","шиномонтаж"),e(t,{gender:r.NEUTER},"EEEEEEE-SsESEE","плечо"),e(t,c,"EEEEEEE-SSSSSS","судья"),
e(t,c,"EEEEEEE-EEEEEE","левша"),e(t,i,"EEEEEEE-SESSSS","семья,макросемья"),e(t,i,"EEEEEEE-SEESEE","вожжа,свеча"),
e(t,i,"EEESEEE-SSSSSS","душа"),e(t,u,"EEEEEEE-SESESS","свинья,овца"),e(t,i,"EEEEEEE-eEeeee","скамья"),
e(t,i,"EEEEEEE-EEEEEE","башка,кишка,ладья,лапша,моча,пыльца,статья"),t}();decline(e,t,n){return function(e,t,n,r){
const s=function(e,t,n,r){const s=t.text();if(t.isIndeclinable())return s;if(t.isPluraleTantum())return $e(e,t,n,s)
;if(r)return $e(e,t,n,r);switch(t.getDeclension()){case-1:return s;case 0:return ue(e,t,n);case 1:return Ne(e,t,n)
;case 2:return Ce(e,t,n);case 3:return ie(e,t,n)}}(e,t,n,r);if(s instanceof Array)return s;return[s]
}(this,w.create(e),t,n)}pluralize(e){const t=w.create(e);return t.isPluraleTantum()?[t.text()]:Re(this,t)}
getLocativeForms(e){const t=this,n=w.create(e),r=n.getDeclension();if(r&&r>=0){const e=oe.get(ae(n))
;if(e instanceof Array)return e.map(e=>new s(function(e){switch(1+(e>>3&7)){case c.V:return"в";case c.VO:return"во"
;case c.NA:return"на"}}(e),function(e,t,n,r){switch(t){case 0:return ue(e,n,Case.PREPOSITIONAL);case 1:return Te(e,n,r)
;case 2:return Ce(e,n,Case.PREPOSITIONAL);case 3:return ie(e,n,Case.PREPOSITIONAL)}}(t,r,n,o(e)),e>>6))}return[]}},
exports.Gender=r,exports.Lemma=w,exports.LocativeForm=s,exports.LocativeFormAttribute=i,exports.StressDictionary=y,
exports.createLemma=function(e){return w.create(e)},exports.createLemmaOrNull=function(e){return w.createOrNull(e)};
//# sourceMappingURL=RussianNouns.cjs.map
