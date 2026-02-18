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
function E(e){return 1+(7&e)}function o(e){const t=e.replaceAll("ё","е");let n=t.length%2,r=1,s=5381;function i(){
s=(33*s+(255&n))%4294967296,n>>=8,r-=8}for(let e of t){const t=e.charCodeAt(0)-1072&31;n|=t<<r,r+=5,r>=8&&i()}r>0&&i()
;const u=t.charCodeAt(0)%2;return 2*(2147483647&s)+u}function h(e){let t=new Array(e.length)
;for(let n=0;n<e.length;n++){let r=e.charCodeAt(n);r>=1040&&r<=1071?r+=32:r>=1024&&r<=1039&&(r+=80),t[n]=r}
return String.fromCharCode.apply(null,t)}function f(e){const t=e.charCodeAt(0)-1072;return 33===t?32:t===(31&t)?1<<t:0}
function l(e,t){return 0!==(e&f(t))}const S=3892855073,d=66567902,I=66567390;function A(e){return l(S,h(e))}
function N(e,t){return t===t.toUpperCase()?e.toUpperCase():e}function O(e){return e.split("").filter(A).length}
function p(e){return e.replaceAll("ё","е").replaceAll("Ё","Е")}function T(e,t){return e.substring(0,e.length-t)}
function g(e,t){return e.substring(e.length-t)}function C(e){return T(e,1)}function b(e){return g(e,1)}function W(e,t){
const n=e.length-t-1;return e.substring(n,n+1)}function _(e,t){return t.some(t=>e.endsWith(t))}function w(e,t,n){
return(e.length?e:[!1]).map(e=>n(e?p(t):t,e))}class m{constructor(e){e instanceof m?(this._txt=e._txt,this._lc=e._lc,
this._hash=e._hash,this._flags=e._flags):(e.pluraleTantum?this._flags=5:this._flags=1+n.indexOf(e.gender),
this._txt=e.text,this._lc=e.text.toLowerCase(),this._hash=o(this._lc),this._flags|=8*(1&e.indeclinable),
this._flags|=16*(1&e.animate),this._flags|=32*(1&e.surname),this._flags|=64*(1&e.name),this._flags|=128*(1&e.transport),
this._flags|=65536*(2+function(e,t,n,s){if(t)return-2;if(s)return-1;const i=b(e);switch(n){case r.FEMININE:
return"а"===i||"я"===i?2:l(d,i)?-1:3;case r.MASCULINE:return"а"===i||"я"===i?2:"путь"===e?0:1;case r.NEUTER:
return["дитя","полудитя"].includes(e)?0:"мя"===g(e,2)?3:1;case r.COMMON:return"а"===i||"я"===i?2:"и"===i?-1:1;default:
return-2}}(this._lc,e.pluraleTantum,e.gender,e.indeclinable)))}static create(e){if(e instanceof this)return e
;const t=R(e);if(t)throw new Error(t);return Object.freeze(new this(e))}static createOrNull(e){
return null===R(e)?Object.freeze(new this(e)):null}equals(e){
return e instanceof m&&this._flags===e._flags&&this.lower()===e.lower()}text(){return this._txt}lower(){return this._lc}
isPluraleTantum(){return 5==(7&this._flags)}getGender(){const e=7&this._flags;if(e>=1&&e<=4)return n[e-1]}
isIndeclinable(){return!!(8&this._flags)}isAnimate(){return!!(16&this._flags)||this.isASurname()||this.isAName()}
isASurname(){return!!(32&this._flags)}isAName(){return!!(64&this._flags)}isATransport(){return!!(128&this._flags)}
getDeclension(){return(this._flags>>16)-2}getSchoolDeclension(){const e=this.getDeclension();return 1===e?2:2===e?1:e}}
function U(e,t){const n=new m(e);return n._txt=t,n._lc=t.toLowerCase(),n._hash=o(n.lower()),Object.freeze(n)}
function R(e){if(null==e)return"No parameters specified."
;for(let t of["pluraleTantum","indeclinable","animate","surname","name","transport"]){
if((e=>null!=e&&"boolean"!=typeof e)(e[t]))return t+" must be boolean."}
if(null==e.text)return"A cyrillic word required.";if(!e.pluraleTantum){
if(null==e.gender)return"A grammatical gender required.";if(!n.includes(e.gender))return"Bad grammatical gender."}
return null}function L(e){const t=new Set;let n=0;for(let r of e)n+=r,t.add(n);return t}
const M=L([11720389,548,1024,1479,2622,2867,1222,2642,264,1328,137,123,397,65542229,212447047,31729170,8094836,1056,21701789,35520559,40358,21819,28248,119786,63892,31809,7356,74383,72369,5945,28902,90120738,21187517,91925642,3054826,1600765,65934,30948851,5569212,4205640,5412804,6787095,9749916,3940084,1511466,1303038,16090470,1376628,49919694,3827522,37915959,14032615,28701924,224587434,637275762,51079457,391103676,24108070,158999424,232633267,6058815,66599250,692781441,816204112,55209380,72754,90006,80058,45564,67845,42548,27193,21401,139393,750335,170896,4424,1566,6264,154969,17292,17229,175112,83011,117872,4183,13065,108972,108088,343663,66210,334,17090,380271,283272,59007,35796,230801,1067156,19992,157124,12433,252644,2626,23776,630482,531296,304718,90891,726,23116,47653,30493,167310,50156,123071,477118,241821,55660,908992,534269,205157,11218,2490,660,66391,46856,847526,68710,8450,36630,15642,109864,41716,354482,79820,51876,97325,5506,46436,191803,3957,40876,126323,2347821,338490,73216,475569,87602,29642,4220,10760,16896,50156,17424,35178,167244,126786,33643,30488,65045,35961,51453,55660,4,152461,138332,1958,34200,3709,61381,17424,30158,80591,11218,44099,260487]),V=L([11720389,548,1024,1060,4,5904,1848,4404,330555234,4691346,3365076,1045362,7414584,960432,10564312,253286,16178203,4357,4355,11350,31120,5248,40591,62367,54057,50487,13069,3664,39764,10263,3002,5810,8844,24551,4091,56761,21785,30553,55147139,15960625,1933097,12258067,16302047,54210486,45688435,1659767,4813249,33577763,2501798,10056946,672528,14209351,2012340,1655412,4652736,62568,148698,21186,71129124,260014161,108045611,1007583269,2026464,22799532,750068913,1499532,1285428194,74598,22348,6599,132273,309821,156816,397448,179394,148036,100257,21779,11218,36631,345954,50442,104394,2724,112115,30690,10552,31377,11286,7168,14612,51480,116537,192258,163145,65604,97951,1363157,212810,431243,2622,425588,275284,150351,570568,244701,16659,26136,130134,11040,159389,728373,3476,726,1290392,224730,189158,11218,2490,10750,21608,143747,65974,664563,84036,16283,17424,5758,45080,33066,1782,90658,37101,56107,233163,14216,5518,179264,2525,146957,111342,80594,2309,4217,25432,26905,29980,518951,1458289,523705,4202,477865,149368,126310,47828,212678,22744,269176,179119,4399,35997,69696,41777,41,127336,4202,73153,46372,114255,126869,23630,11218])
;class x{constructor(){this._filter=new Uint8ClampedArray(256)}addInteger(e){this.addRaw(P(e))}hasInteger(e){
return this.hasRaw(P(e))}addRaw(e){const t=2047&e,n=t>>>3;this._filter[n]=this._filter[n]|1<<7-t%8}hasRaw(e){
const t=2047&e;return!!(this._filter[t>>>3]>>>7-t%8&1)}clone(){return function(e){const t=new x
;return t._filter=Uint8ClampedArray.from(e),t}(this._filter)}}function P(e){return e>>>22&2047^e>>>11&2047^2047&e}
function F(e){const t=e.padStart(3,"а");return(7&t.charCodeAt(0))<<8|(15&t.charCodeAt(1))<<4|15&t.charCodeAt(2)}
const j=function(){const e=new x;return M.forEach(t=>e.addInteger(t)),V.forEach(t=>e.addInteger(t)),Object.freeze(e)}()
;function y(){const t=new Map,n=j.clone(),s=function(e){return 4294967296*(31&e._flags)+e._hash},i=function(e){
return e.lower().indexOf("ё")+1&255},u=e=>{const n=65504&e._flags,r=(e=>{const n=s(e),r=t.get(n)
;return r instanceof Array?r:[]})(e).filter(e=>(e[0]&n)<=n),u=r.filter(t=>t[0]>>16===i(e))
;return u.length?u[0][1]:r.length?r[0][1]:void 0};this.put=function(e,r){
const u=r.split("-"),c=(e,t)=>e.length!==t||e.split("").some(e=>!"SsbeE".includes(e))
;if(2!==u.length||c(u[0],7)||c(u[1],6))throw new Error("Bad settings format.");const a=m.create(e),E=s(a);let o=t.get(E)
;o instanceof Array||(o=[],t.set(E,o));const h=65535&a._flags|i(a)<<16,f=o.find(e=>h===e[0]);f?f[1]=r:o.push([h,r]),
n.addInteger(a._hash)};const c=e=>{switch(e){case"E":return[!0];case"e":return[!0,!1];case"b":case"s":return[!1,!0]
;default:return[!1]}};this.hasStressedEndingSingular=function(t,s){if(n.hasInteger(t._hash)){const n=e.indexOf(s)
;if(n>=0){let e=u(t);if(e){const t=e.split("-")[0];return c(t[n])}if(t.getGender()===r.MASCULINE){
if(M.has(t._hash))return c("SEESEEE"[n]);if(V.has(t._hash))return c("SEEEEEE"[n])}}}return[]},
this.hasStressedEndingPlural=function(t,s){if(n.hasInteger(t._hash)){const n=e.indexOf(s);if(n>=0&&n<6){let e=u(t)
;if(e){const t=e.split("-")[1];return c(t[n])}
if(t.getGender()===r.MASCULINE&&(M.has(t._hash)||t.isAnimate()&&V.has(t._hash)))return c("E")}}return[]}}function z(e){
let t=new Map;for(let n of e){let e=t;for(let t=n.length-1;t>=0;t--){const r=n.charCodeAt(t);if(t>0){const t=e.get(r)
;if(0===t)break;void 0===t&&e.set(r,new Map),e=e.get(r)}else e.set(r,0)}}return t}function D(e,t){let n=t
;for(let t=e.length-1;t>=0;t--){const r=e.charCodeAt(t);if(!n.has(r))return!1;{const e=n.get(r);if(0===e)return!0;n=e}}}
const k=z(["ое","нький","ский","ской","лстой","отой","утой","евой","овой","живой"]),G=z(["ее","ое","нький","ский","ской","лстой","отой","утой"]),B=z(["евой","овой","отой","живой"]),H=z(["шний","жний","щий","ший","жий","чий"]),J=["божий","ажий","яжий","ужий","южий","бульдожий","кабарожий","медвежий","носорожий","миножий"],v=z(J),X=z(J.map(e=>T(e,2)+"ьи")),Y=new Set(["бубен","бугор","ветер","вошь","вымысел","горшок","деготь","дёготь","дятел","домысел","замысел","кашель","коготь","лапоть","лоб","локоть","ломоть","молебен","мох","ноготь","овен","пепел","пес","пёс","петушок","помысел","порошок","промысел","псалом","пушок","ров","рожь","рот","сон","стебель","стишок","угол","умысел","хребет","церковь","шов","ковер","овес","костер"].map(o)),q=new x
;Y.forEach(e=>q.addInteger(e))
;const K=z(["овёс","ковёр","костёр","шатер","шатёр","козел","козёл","котел","котёл","орел","орёл","осел","осёл","узел","уголь","чок","ешок","хол"])
;function Q(e,t){const n=b(t);if(l(-402111711,n)){if(l(S,W(t,1))){const n=T(e,2);return D(t,v)?n+N("ь",n):n}
if("й"!==n)return C(e)}return e}const Z=["ясень","бюллетень","олень","тюлень","гордень","пельмень","ячмень"]
;function $(e,t,n){const s=e.text(),i=b(t),u=f(i);let c;return-133667019&u&&(-402111711&u?c=function(e,t,n){
const r=W(t,1);return"ь"===r||"о"===n&&l(2504708,r)?C(e):Q(e,t)}(s,t,i):"к"===i?c=function(e,t,n){
return e.length>=4&&_(t,["рёк","нёк","лёк"])&&!1!==n?T(e,2)+"ьк":t.endsWith("ёк")&&l(S,W(t,2))?T(e,2)+"йк":void 0
}(s,t,n):"ь"===i?c=function(e,t,n){
return Y.has(e._hash)||D(n,K)?T(t,3)+W(t,1):n.endsWith("ень")&&e.getGender()===r.MASCULINE&&!_(n,Z)?T(t,3)+"н":C(t)
}(e,s,t):(["лёд","лед","лён"].includes(t)||"лев"===t&&e.isAnimate())&&(c=T(s,2)+N("ь",W(s,1))+b(s))),
c||(c=function(e,t,n){
return!!(199680&n)&&D(t,K)&&!["новосел","новосёл"].includes(t)||!!(2571270&n)&&(q.hasInteger(e._hash)&&Y.has(e._hash)||e.isAnimate()&&t.endsWith("посол"))
}(e,t,u)?T(s,2)+b(s):s),c}function ee(e,t){const n=C(e),r=C(t.lower());if("а"===b(r))return n
;if(_(r,["зне","жне","гре","спе","мудре"])||g(C(r),3).split("").every(e=>l(I,e))||t.isAName())return n
;if("ле"===g(r,2)){const e=W(r,2);return l(S,e)||"л"===e?C(n)+"ь":n}
return l(S,b(r))&&"и"!==b(r)?l(S,b(C(r)))?T(e,2)+"й":_(t.lower(),["месяц"])?n:T(e,2):n}
const te=z(["лапоток","желток","нишок","ришок","ишек"]),ne=["поток","приток","переток","проток","биоток","электроток","восток","водосток","водоток","воток","знаток"],re=["инок","исток","обморок","порок","пророк","сток","урок"]
;function se(e){
return _(e,["чек","шек"])&&e.length>=6||D(e,te)||e.endsWith("ок")&&!e.endsWith("шок")&&!re.includes(e)&&!_(e,ne)&&!l(S,W(e,2))&&(l(S,W(e,3))||_(T(e,2),["ст","рт"]))&&e.length>=4
}const ie={"дочь":"дочерь","мать":"матерь"};function ue(e,n,r){const s=n.text(),i=n.lower()
;if(![t.NOMINATIVE,t.ACCUSATIVE].includes(r)&&Object.keys(ie).includes(i)){return ue(e,U(n,ie[i]),r)}let u=$(n,i)
;if(function(e){return e.endsWith("полночь")||e.startsWith("пол")&&l(134217984,b(e))&&O(e)>=2
}(i)&&(u="полу"+u.substring(3)),"мя"===g(i,2))switch(r){case t.NOMINATIVE:case t.ACCUSATIVE:return s;case t.GENITIVE:
case t.DATIVE:case t.PREPOSITIONAL:case t.LOCATIVE:return u+"ени";case t.INSTRUMENTAL:return u+"енем"}else switch(r){
case t.NOMINATIVE:case t.ACCUSATIVE:return s;case t.GENITIVE:case t.DATIVE:case t.PREPOSITIONAL:case t.LOCATIVE:
return u+"и";case t.INSTRUMENTAL:return _(i,["вошь","рожь","церковь"])?s+"ю":u+"ью"}}function ce(e,n,r){
const s=n.text(),i=n.lower();if(i.endsWith("путь"))return r===t.INSTRUMENTAL?C(s)+"ём":ue(e,n,r)
;if(!i.endsWith("дитя"))throw new Error("unsupported");switch(r){case t.NOMINATIVE:case t.ACCUSATIVE:return s
;case t.GENITIVE:case t.DATIVE:case t.PREPOSITIONAL:case t.LOCATIVE:return s+"ти";case t.INSTRUMENTAL:
return[s+"тей",s+"тею"]}}function ae(e,n,r){
const s=n.text(),i=n.lower(),u=$(n,i),c=h(u),a=C(s),E=C(i),o=()=>"я"===b(i),f=()=>i.endsWith("ая")&&!(2===O(s)||l(S,b(c))),d=()=>i.endsWith("яя")&&!(2===O(s)||l(S,b(c))),I=["жая","шая"]
;switch(r){case t.NOMINATIVE:return s;case t.GENITIVE:
return d()||_(i,I)?u+"ей":f()?u+"ой":n.isASurname()&&!i.endsWith("да")?a+"ой":i.endsWith("ничья")?a+"ей":o()||l(60818504,b(c))?a+"и":a+"ы"
;case t.DATIVE:
return d()||_(i,I)?u+"ей":f()?u+"ой":n.isASurname()&&!i.endsWith("да")?a+"ой":"ия"===g(i,2)?a+"и":i.endsWith("ничья")?a+"ей":a+"е"
;case t.ACCUSATIVE:return f()?u+"ую":d()?u+"юю":o()?a+"ю":a+"у";case t.INSTRUMENTAL:
return d()||_(i,I)?u+"ею":f()?[u+"ой",u+"ою"]:o()||"жшчщц".includes(b(c))&&!e.sd.hasStressedEndingSingular(n,r).includes(!0)?"и"===b(E)?a+"ей":[a+"ей",a+"ею"]:[a+"ой",a+"ою"]
;case t.PREPOSITIONAL:case t.LOCATIVE:
return d()||_(i,I)?u+"ей":f()?u+"ой":n.isASurname()&&!i.endsWith("да")?a+"ой":"ия"===g(i,2)?a+"и":i.endsWith("ничья")?a+"ей":a+"е"
}}const Ee=z(["ов","ев","ёв","ин","ын"]),oe=function(e,t){let n=t;for(let t=0;t<e.length;t++){
const r=e.charCodeAt(t),s=n;n=new Map,n.set(r,s)}return n}("ы",Ee);function he(e){
return e.filter((t,n)=>e.indexOf(t)===n)}function fe(e){const t=1&e.lower().includes("ё")
;return 4294967296*((65535&e._flags)<<1|t)+e._hash}const le=Object.freeze(function(){const e=new Map,t=Object.freeze({
gender:r.MASCULINE}),n=Object.freeze({gender:r.MASCULINE,animate:!0});function s(t,n,r,s,i){
const c=s.split(","),E=i instanceof Array?i:[u.U_SUFFIX];for(let s of c){const i=Object.assign({},t);i.text=s
;const u=fe(m.create(i));let c=e.get(u);c||(c=[],e.set(u,c));for(let e of r)for(let t of E)c.push(a(e,t,n))}}
const E=Object.freeze([c.V]),o=Object.freeze([c.VO]),h=Object.freeze([c.NA])
;s(t,i.CONTAINER,E,"мозг,пруд,стог,таз,год"),s(t,i.CONTAINER,o,"рот"),s(t,i.WAY,E,"год"),s(t,i.CONTAINER,E,"гроб"),
s(t,i.CONTAINER|i.RELIGIOUS,o,"гроб",[u.PREPOSITIONAL]),
s(t,i.LOCATION,E,"ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,низ,хлев"),
s(t,i.STRUCTURE,E,"круг,полк,артполк,ряд,род,строй,лад"),s(t,i.SURFACE,h,"баз,берег,бережок,вал,кон,круг,луг,пол,яр"),
s(t,i.WAY,h,"век,день"),s(t,i.WAY,E,"час"),s(t,i.WAY,h,"корень"),s(n,i.OBJECT_WITH_FUNCTIONAL_SURFACE,h,"вор"),
s(t,i.OBJECT_WITH_FUNCTIONAL_SURFACE,h,"повод,бочок,борт,воз,горб,кол,мост,плот,сук,х"+String.fromCharCode(1091)+"й"),
s(t,i.OBJECT_WITH_FUNCTIONAL_SURFACE,h,"крюк,болт",[u.PREPOSITIONAL,u.U_SUFFIX]);const f=",мёд,мех,пар,пух"
;s(t,i.SUBSTANCE,E,"дым,жир,мел,пушок"+f),
s(t,i.RESOURCE,h,"газ,клей,спирт"+f),s(t,i.CONDITION,E,"бой,бред,быт,долг,плен,пыл,сок,ход,лад"),
s(t,i.EXPOSURE,E.concat(h),"вид"),s(t,i.EXPOSURE,h,"слух,счёт,ветер,ветр,свет"),s(t,i.MOTION,h,"ход,бег,вес"),
s(t,i.MOTION|i.WITH_ADJECTIVE,h,"шаг"),s(t,i.EVENT,h,"бал,пир"),s(t,i.CONDITION,h,"дух,плав"),
s(t,i.MOTION|i.WITH_ADJECTIVE,h,"газ"),s(t,i.CONTAINER,E,"глаз,зоб,нос,шкаф"),s(t,i.CONTAINER,o,"лоб"),
s(t,i.OBJECT_WITH_FUNCTIONAL_SURFACE,h,"глаз,лоб,нос,шкаф,холм");let l="бок,верх,зад,угол";return s(t,i.LOCATION,E,l),
s(t,i.OBJECT_WITH_FUNCTIONAL_SURFACE,h,l),s(t,i.LOCATION|i.WITHOUT_ADJECTIVE,E,"край"),
s(t,i.OBJECT_WITH_FUNCTIONAL_SURFACE|i.WITHOUT_ADJECTIVE,h,"край"),s(t,i.SURFACE,h,"лёд,мох,снег"),
s(t,i.SUBSTANCE,o,"лёд,лён,мох"),s(t,i.SUBSTANCE,E,"снег"),e
}()),Se=new Set("клей,чай,дом,дух,дым,дымок,газ,год,горошек,жар,жир,квас,пар,пыл,род,рост,сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,табак,творог,толк,торф,туман,убыток,укроп,уксус,ход,цемент,чеснок,шаг,шик,шиповник,шоколад,шорох,шум,яд".split(",")),de=new x
;Se.forEach(e=>de.addInteger(o(e)))
;const Ie=z(["й","ие","иё"]),Ae=z(["воробей","муравей","ручей","соловей","улей"]),Ne=z(["мой","ной","дой","шой","жой","рзой","осой","хой","латой","витой","литой","питой","житой","отой","утой","ятой","лагой","рагой","огой","угой","лубой","любой","илой","ылой","злой","малой","овой","евой","живой","ской","акой","укой","нний","ский","йкий","цкий","зкий","ткий","лкий","мкий","хкий","оркий","аркий","яркий","ький","ёкий","бокий","оокий","cокий","токий","ликий","дикий","укий","ыкий","який","пкий","дкий","бкий","нкий","жкий","чкий","гкий","овкий","авкий"])
;function Oe(e,t){return"ый"===g(t,2)||(t.endsWith("кривой")||D(t,Ne))&&O(t)>=2}
const pe=z(["ий","ие","чье","тье","дье","вье","бье","жалованье","енье","ружье","божье","верье","мужье"]),Te=z(["вое","лое","мое","ное","рое","тое","той","ый"])
;function ge(e,n,s){const i=n.text(),u=h(i),c=b(u),a=n.getGender(),o=e.sd.hasStressedEndingSingular(n,s)
;let f=$(n,u,o[0]),l=C(i);const S=be(u);S&&(f="полу"+f.substring(3),l="полу"+l.substring(3));let d=h(f)
;const I=()=>S&&u.endsWith("я")||_e(u),A=D(u,Ie),O=()=>D(u,Ae)?C(l)+N("ь",b(l)):l,p=()=>"чщ".includes(b(d))
;function T(e){
return!n.isAnimate()&&de.hasInteger(n._hash)&&Se.has(u)&&("й"===c?e.push(C(i)+N("ю",b(i))):e=e.concat(w(o,f,e=>e+N("у",b(e))))),
e}switch(s){case t.NOMINATIVE:return i;case t.GENITIVE:switch(c){case"и":case"ы":if(S)return Ce(e,n,s,u);break;case"й":
case"е":if(A&&n.isASurname()||Oe(0,u)||D(u,k))return f+"ого";if(D(u,H)||u.endsWith("ее"))return f+"его";case"ё":case"я":
case"ь":if(A){return T([O()+"я"])}if(I()&&!p())return f+"я";break;case"ц":return ee(i,n)+"ца";case"к":
if(se(u))return C(l)+"ка";break;case"о":if(_(u,["шко"])&&r.MASCULINE===a)return l+"и"}let h
;return h=n.isASurname()||-1===d.indexOf("ё")?[f+"а"]:w(o,f,e=>e+"а"),T(h);case t.DATIVE:switch(c){case"и":case"ы":
if(S)return Ce(e,n,s,u);break;case"й":case"е":if(A&&n.isASurname()||Oe(0,u)||D(u,k))return f+"ому"
;if(D(u,H)||u.endsWith("ее"))return f+"ему";case"ё":case"я":case"ь":if(A)return O()+"ю";if(I()&&!p())return f+"ю";break
;case"ц":return ee(i,n)+"цу";case"к":if(se(u))return C(l)+"ку"}
return n.isASurname()||-1===d.indexOf("ё")?f+"у":w(o,f,e=>e+"у");case t.ACCUSATIVE:
return a===r.NEUTER||"иы".includes(c)&&S?i:n.isAnimate()?ge(e,n,t.GENITIVE):i;case t.INSTRUMENTAL:switch(c){case"и":
case"ы":if(S)return Ce(e,n,s,u);break;case"й":case"е":case"ё":case"я":case"ь":
if(A&&n.isASurname()||D(u,G))return D(u,Te)?f+"ым":f+"им";if(Oe(0,u))return"и"===W(u,1)||u.endsWith("хой")?f+"им":f+"ым"
;if(D(u,B))return f+"ым";if(D(u,H))return f+"им";if(A)return O()+"ем";if(u.endsWith("це"))return i+"м";break;case"ц":
return w(o,i,(e,t)=>t?ee(e,n)+"цом":ee(e,n)+"цем");case"к":if(se(u))return C(l)+"ком";break;case"н":case"в":
if(n.isASurname()&&D(u,Ee))return i+"ым"}
return I()||"жшчщ".includes(b(d))?w(o,f,(e,t)=>t?e+"ом":e+"ем"):n.isASurname()||-1===d.indexOf("ё")?f+"ом":w(o,f,e=>e+"ом")
;case t.LOCATIVE:if("полпути"===u)return i;const m=le.get(fe(n));if(m){return he(m.map(e=>E(e))).map(t=>We(e,n,t))}
case t.PREPOSITIONAL:switch(c){case"и":if("полпути"===u)return i;case"ы":if(S)return Ce(e,n,s,u);break;case"й":case"е":
case"ё":case"я":case"ь":if(A&&n.isASurname()||Oe(0,u)||D(u,k))return f+"ом";if(D(u,H)||u.endsWith("ее"))return f+"ем"
;if(_(u,["воробей"])){const e=C(l);return e+N("ье",b(e))}
if(D(u,pe)&&!_(u,["запястье","здоровье","изголовье","платье"]))return l+"и";if("й"===c||"иё"===g(u,2))return O()+"е"
;break;case"ц":return ee(i,n)+"це";case"к":if(se(u))return C(l)+"ке"}
return n.isASurname()||-1===d.indexOf("ё")?f+"е":w(o,f,e=>e+"е")}}function Ce(e,t,n,r){
const s=()=>"полминуты"!==r?"полу"+t.text().substring(3):t.text();if("полпути"===r){return ce(e,U(t,C(s())+"ь"),n)}
if(r.endsWith("зни")||r.endsWith("сти")){return ue(e,U(t,C(s())+"ь"),n)}
return ae(e,U(t,C(s())+("ни"===g(r,2)?"я":"а")),n)}function be(e){
if(e.startsWith("пол")&&l(2550137089,b(e))&&"л"!==e[3]&&O(e)>=2){let t=e.substring(3),n=t.search(/[а-яё]/)
;return n>=0&&l(d,t[n])}return!1}function We(e,n,r){if(u.U_SUFFIX===r){const e=n.text(),t=n.lower();let r=$(n,t),s=C(e)
;const i=be(t)&&t.endsWith("я")||_e(t);return"й"===b(t)?p(s)+"ю":i?p(r)+"ю":se(t)?p(C(s))+"ку":p(r)+"у"}
if(u.PREPOSITIONAL===r)return ge(e,n,t.PREPOSITIONAL)}function _e(e){
return"ь"===b(e)&&!e.endsWith("господь")||"её".includes(b(e))&&!_(e,["це","же"])}
const we=new x,me=Object.freeze([[[r.MASCULINE,void 0],{"болгарин":["болгары"],"господин":["господа"],
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
;for(const e of me)Object.keys(e[1]).map(e=>we.addInteger(o(e)))
;const Ue=["зять","деверь","друг","брат","собрат","стул","брус","обод","полоз","струп","подмастерье","якорь","перо","шило"],Re=new Set(["берег","бок","борт","век","вес","веер","вексель","вечер","глаз","голос","город","доктор","дом","детдом","егерь","жемчуг","катер","колокол","концлагерь","корм","короб","кузов","купол","лес","луг","мастер","номер","пояс","провод","рог","сахар","снег","сорт","стог","счет","счёт","спецсчет","спецсчёт","субсчет","субсчёт","терем","том","холод","цвет","череп"]),Le=z(["округ","остров","отпуск","паспорт","парус","поезд","повар","погреб","рукав","цех","юнкер"]),Me=new Set(["адрес","договор","буфер","ворох","директор","инспектор","инструктор","корпус","крейсер","орден","ордер","прожектор","пропуск","род","свитер","сервер","тенор","тон","трактор","тормоз","ветер","верх","китель","мех","хлеб","юнкер","ястреб"]),Ve=new Set(["бункер","вымпел","год","образ","омут","токарь","тополь","шторм","штуцер"])
;function xe(e,n){const s=[],i=n.text(),u=h(i),c=e.sd.hasStressedEndingPlural(n,t.NOMINATIVE);Object.freeze(c)
;const a=$(n,u,c[0]),E=h(a);if(u.endsWith("яя"))return s.push(T(i,2)+"ие"),he(s);const o=r=>{
const s=e.sd.hasStressedEndingPlural(n,t.NOMINATIVE).map(e=>!e)
;return s.length?s.map(e=>e?1===E.replace(/[^её]/g,"").length?r((e=>{
const t=Math.max(e.toLowerCase().lastIndexOf("е"),e.toLowerCase().lastIndexOf("ё")),n=N("ё",e[t])
;return e.substring(0,t)+n+e.substring(t+1)})(a)):r(a):r(p(a))):[r(a)]
},f=n.getGender(),d=n.getDeclension(),I=("й"===b(u)||l(S,b(u)))&&l(S,b(C(u)))?C(i):a,A=()=>(u.endsWith("евич")||u.endsWith("евна"))&&u.indexOf("ье")>=0
;function O(){const e=I,t=h(e).indexOf("ье"),n=N("и",e[t]);return e.substring(0,t)+n+e.substring(t+1)}function m(){
l(60818504,b(E))||"яйь".includes(b(u))||_(u,["сосед"])?A()?(s.push(O()+"и"),
s.push(I+"и")):Array.prototype.push.apply(s,w(c,I,e=>e+"и")):"ц"===b(u)?s.push(ee(i,n)+"цы"):A()?(s.push(O()+"ы"),
s.push(I+"ы")):Array.prototype.push.apply(s,w(c,I,e=>e+"ы"))}if(we.hasInteger(n._hash))for(const[e,t]of me){
const r=e[0],i=e[1];if(f===r&&(null==i||i===n.isAnimate())&&t.hasOwnProperty(u)){const e=t[u];for(let t of e)s.push(t)
;return he(s)}}const U="ь"===b(E)?a:"к"===b(E)?C(a)+"чь":"г"===b(E)?C(a)+"зь":"й"===b(u)?C(i):_(u,["рь","ль"])?a:a+"ь"
;switch(d){case-1:s.push(i);break;case 0:if("путь"===u)s.push("пути");else{
if(!u.endsWith("дитя"))throw new Error("unsupported");s.push(T(i,3)+"ети")}break;case 1:
if(Ue.includes(u))s.push(U+"я");else if(r.MASCULINE===f){
const e=["крюк","лист","лоскут","повод","прут","сук","учитель","флигель","штабель"],t=["клин","колос","ком","край","соболь"]
;"сын"===u?(s.push("сыновья"),m()):"человек"===u?(s.push("люди"),m()):e.includes(u)||"соболь"===u&&n.isAnimate()?(m(),
s.push(U+"я")):t.includes(u)?s.push(U+"я"):Re.has(u)||D(u,Le)||Me.has(u)||Ve.has(u)?(Ve.has(u)&&m(),
_e(u)?Array.prototype.push.apply(s,o(e=>e+"я")):c.includes(!0)?s.push(p(a)+"а"):s.push(a+"а"),
Me.has(u)&&m()):(u.endsWith("анин")&&u.length>5||u.endsWith("янин"))&&!n.isAName()||["барин","боярин"].includes(u)?(s.push(T(i,2)+"е"),
"барин"===u&&s.push(T(i,2)+"ы")):["цыган"].includes(u)?s.push(i+"е"):"щенок"===u?(s.push(T(i,2)+"ки"),
s.push(T(i,2)+"ята")):!u.endsWith("ребёнок")&&!u.endsWith("ребенок")||u.endsWith("жеребёнок")||u.endsWith("жеребенок")||u.endsWith("ястребёнок")||u.endsWith("ястребенок")?(u.endsWith("ёнок")||u.endsWith("енок"))&&n.isAnimate()?s.push(T(i,4)+"ята"):u.endsWith("ёночек")&&n.isAnimate()?s.push(T(i,6)+"ятки"):u.endsWith("онок")&&"жшч".includes(W(u,4))&&n.isAnimate()?s.push(T(i,4)+"ата"):se(u)?s.push(T(i,2)+"ки"):D(u,H)?_(u,J)?s.push(T(i,2)+"ьи"):s.push(C(i)+"е"):Oe(0,u)?u.endsWith("ый")||u.endsWith("ий")?s.push(C(i)+"е"):u.endsWith("ой")&&!_(u,["хой","ской"])?s.push(T(i,2)+"ые"):s.push(T(i,2)+"ие"):u.endsWith("его")?s.push(T(i,3)+"ие"):["воробей","муравей","ручей","соловей","улей","жеребей","ирей","репей","чирей"].includes(u)?s.push(T(i,2)+"ьи"):m():s.push(T(i,7)+"дети")
}else if(r.NEUTER===f)if(_(u,["ко","чо"])&&!_(u,["войско","облако"]))s.push(C(i)+"и");else if(u.endsWith("имое"))s.push(a+"ые");else if(u.endsWith("ее"))s.push(a+"ие");else if(u.endsWith("ое"))_(E,["г","к","ж","ш","х"])?s.push(a+"ие"):s.push(a+"ые");else if(_(u,["ие","иё"]))s.push(T(i,2)+"ия");else if(_(u,["ье","ьё"])){
const e=T(i,2),t=["безделье","варенье","воскресенье","жалованье","запястье","застолье","затишье","здоровье","зелье","изголовье","новоселье","одночасье","печенье","платье","побережье","поголовье","подворье","подземелье","подполье","поместье","предплечье","раздумье","сиденье","средневековье","увечье","угодье","устье"].includes(u)
;"е"!==b(u)||t||s.push(e+"ия"),s.push(e+"ья")
}else _(u,["дерево","звено","крыло"])?s.push(a+"ья"):_(u,["ле","ре"])?s.push(a+"я"):u.endsWith("судно")&&n.isATransport()?s.push(T(i,2)+"а"):(Array.prototype.push.apply(s,o(e=>e+"а")),
_(u,["щупальце"])&&m());else s.push(a+"и");break;case 2:
"заря"===u?s.push("зори"):u.endsWith("ая")&&!u.endsWith("свая")?"жхчшщ".includes(b(E))||_(E,["вк","гк","ск","цк","ньк"])?s.push(a+"ие"):s.push(a+"ые"):m()
;break;case 3:
"мя"===g(u,2)?s.push(a+"ена"):Object.keys(ie).includes(u)?s.push(C(ie[u])+"и"):r.FEMININE===f?s.push(I+"и"):"и"===b(I)?s.push(I+"я"):s.push(I+"а")
}return he(s)}
const Pe=z(["ли","си","би","ви","ди","ти","пи","ри","ни","фи","зи","ьи","ья","ия","ря","ля","ая","аи","ои","уи","эи","ыи","яи","ёи","юи","еи","ии"]),Fe=["беготни","болтовни","будни","вожжи","возни","доли","лапши","левши","люди","марли","моря","мощи","ноздри","пени","пятерни","распри","родни","сакли","сени","ступни","судьи","фигни","чукчи"],je=["головы","громадины","детины","деревенщины","дохлятины","дубины","ехидины","жадины","зверины","идиотины","кислятины","молодчины","орясины","остолопины","сиротины","скотины","старейшины","старины","старшины","уродины"],ye=z(je),ze=["адреса","паспорта","поезда","цеха","снега","бункера","буфера","берега","вымпела","голоса","города","директора","договора","доктора","жемчуга","инспектора","инструктора","колокола","кондуктора","короба","корпуса","крейсера","кузова","леса","мастера","номера","облачка","острова","отпуска","паруса","повара","погреба","пояса","провода","прожектора","пропуска","рукава","сахара","свитера","сервера","счета","трактора","тормоза","холода","цвета","черепа","шторма","штуцера","юнкера","ястреба","суда","корм"],De=z(ze),ke=new Set(ze.concat(["бега","беглецы","близнецы","бойцы","бока","борта","борцы","бруствера","брюшки","веера","века","венцы","верха","веса","весы","вечера","вороха","глупцы","года","гонцы","дворцы","дельцы","детдома","детдомы","дома","жеребцы","жильцы","жрецы","затишки","зубцы","излишки","истцы","катера","концы","корма","кузнецы","купола","купцы","лишки","луга","мертвецы","меха","мудрецы","облака","образа","образцы","огурцы","округа","омута","ордена","ордера","отцы","очки","певцы","песцы","пловцы","подлецы","продавцы","птенцы","резцы","рога","рода","рубцы","самцы","свинцы","сорта","соуса","спецы","стога","столбцы","стрельцы","творцы","тельцы","тенора","терема","тома","тона","торцы","хлеба","штришки","юнцы"])),Ge=new Set(["авары","аланы","аршины","баклажаны","буквы","гольфы","граммы","гусары","дела","кадеты","килограммы","омы","помидоры","рентгены","ботинки","человеки","чулки","шорты"]),Be=new Set(["гектары","рельсы"]),He=new x
;ke.forEach(e=>He.addRaw(F(e))),Ge.forEach(e=>He.addRaw(F(e))),Be.forEach(e=>He.addRaw(F(e)))
;const Je=new Set(je.concat(["абазины","авы","аввы","бедняги","бедолаги","болгары","бродяги","брызги","брюки","брюхи","будды","бусы","валенки","веки","вельможи","верзилы","вилы","владыки","воеводы","волосы","вояки","главы","грузины","задворки","задиры","железы","жилы","зануды","зеваки","именины","калеки","кальсоны","каникулы","колготки","коллеги","крохи","курицы","куры","ладоши","ламы","лыки","макароны","мужчины","нападки","нары","непоседы","носилки","ножны","папы","папаши","таты","падлы","партизаны","погоны","поминки","посиделки","похороны","предтечи","работяги","разы","ребятки","румыны","самоубийцы","санки","убийцы","сапоги","сатаны","сироты","сливки","слуги","солдаты","старосты","сумерки","сутки","татары","телеса","хитрюги","четвереньки","шляпы","шмотки","яблоки","дядьки","дяденьки","зайки","кроссовки","малютки","малолетки","попки","турки","узы","хлопоты","шахматы"])),ve=new x
;Je.forEach(e=>ve.addRaw(F(e)))
;const Xe=["х","ых","их","м","ым","им","х","ых","их","ми","ыми","ими","х","ых","их"],Ye=["ям","ам","","","ями","ами","ях","ах"],qe=z(["вна","вца","вцы","пла","дца","дра","судна","рки","рцы","тлы","рна","тна","енца","десны","дёсны","рёбра","ребра","сосны"]),Ke=z(["жи","ши","чи","ля","ли","чи","ри","ти","ди","сани","борщи","клещи","товарищи","плащи","прыщи","хрящи"]),Qe=z(["братья","брусья","деревья","донья","звенья","клинья","клочья","коленья","колосья","колья","комья","крылья","крючья","листья","лоскутья","лохмотья","перья","платья","поводья","прутья","стулья","сучья","хлопья","шилья"]),Ze=z(["ишки","дружки","тки","папочки","дедушки","дядюшки","батюшки","катанки","петрушки","шестерки"]),$e=z(["жки","шки","чки","рки","натки","хатки","ятки","етки","чётки","мки","нки","педки","илки"]),et=z(["шок","щок","жок","зок","аток","яток","еток"])
;function tt(t,n,s,i){const u=h(i),c=b(u),a=f(c),E=e.indexOf(s)+1;if(1===E||4===E&&!n.isAnimate())return i
;if(134217984&a)if(2===E||4===E){if(_(u,["овичи","евичи"]))return C(i)+"ей"
;if(_(u,["вны","полусотни"])&&"овны"!==u)return T(i,2)+"ен"}else if(5===E){
if(_(u,["дети","люди"])&&!_(u,["нелюди"]))return C(i)+"ьми";if(_(u,["вери","дочери"]))return[C(i)+"ями",C(i)+"ьми"]}
const o=n.getGender(),d=u.endsWith("цы")?C(i):Q(i,u),A=D(u,oe)&&(n.isASurname()||o===r.COMMON)&&!D(u,ye),O=3*Math.min(Math.round(Xe.length/3-1),E-2)
;if(A||u.endsWith("ничьи"))return i+Xe[O];if(u.endsWith("ые"))return T(i,2)+Xe[O+1]
;if(u.endsWith("ие")||D(u,X))return d+Xe[O+2];if(E>2&&4!==E){const e=2,r=e*Math.min(Math.round(Ye.length/e-1),E-3)
;return D(u,Pe)?C(i)+Ye[r]:t.sd.hasStressedEndingPlural(n,s).includes(!0)?p(d)+Ye[r+1]:d+Ye[r+1]}{
const e=n.getDeclension(),a=()=>{const e=h(d),r=["жки","шки","чки","ножны"]
;if(_(e,["кн","кл","дк","нк","пк","зк","рк","тк","вк","лк","мк"])&&!_(u,["сумерки"])||"зл"===e||_(u,r)&&t.sd.hasStressedEndingPlural(n,s).includes(!0)){
const e=b(d);return C(d)+N("о",e)+e}if(D(u,qe)&&!u.endsWith("недра")||_(u,r)){const e=W(i,1);return T(i,2)+N("е",e)+e}
if(_(u,["сестры","сёстры","серьги"])){const e=W(i,1);return("ь"===W(u,2)?p(T(i,3)):p(T(i,2)))+N("ё",e)+e}
if(_(e,["льц","сьм","деньг","ьк","йк","дьб"])){const e=b(d);return T(d,2)+N("е",e)+e}
return _(u,["сла","слы"])?C(d)+"ел":d};if([3,0].includes(e)){if(u.endsWith("и"))return C(i)+"ей"
;if(["гроздья"].includes(u))return C(i)+"ев"}const E=W(u,2);if(r.FEMININE!==o){const e=F(u),t=He.hasRaw(e)
;if(t&&ke.has(u))return C(i)+"ов";if(t&&Ge.has(u)&&!n.isAName())return[a(),C(i)+"ов"]
;if(t&&Be.has(u))return[C(i)+"ов",a()]
;if(o===r.COMMON&&!_(u,Fe)&&!"жшч".includes(E)||ve.hasRaw(e)&&Je.has(u)||n.isAName()&&o===r.MASCULINE&&n.lower().endsWith("а")||"барин"===n.lower())return a()
;switch(c){case"и":case"я":
if(D(u,Ke)||"щи"===u||Fe.includes(u)||n.lower().endsWith("ь")&&!_(n.lower(),["зять","деверь"])){
return("ь"===b(C(u))?T(i,2):C(i))+"ей"}
if("и"===c)return u.endsWith("ульи")?C(i)+"ев":u.endsWith("ьи")?r.MASCULINE===o?C(i)+"ёв":T(i,2)+"ей":["ча","кле","холу","ху"].includes(C(u))?C(i)+"ёв":u.endsWith("ищи")?a():u.endsWith("мессии")?C(i)+"й":l(S,W(u,1))?C(i)+"ев":!D(u,$e)||r.MASCULINE===o&&!D(p(u),Ze)||D(n.lower(),et)?C(i)+"ов":a()
;if(D(u,Qe))return C(i)+"ев";if(_(u,["зятья","кумовья","деверья","края","острия"]))return C(i)+"ёв"
;if(_(u,["ья","ия"]))return r.MASCULINE===o?T(i,2)+"ей":T(i,2)+"ий";break;case"а":
return _(u,["семена","стремена"])?T(i,3)+"ян":u.endsWith("мена")?T(i,3)+"ён":n.lower().endsWith("яйцо")?N("яиц",C(i)):u.endsWith("нца")?[a(),C(i)+"ев"]:D(u,De)?C(i)+"ов":a()
;case"ы":return _(u,["ницы","лицы","пицы","бицы"])?C(i):u.endsWith("цы")?C(i)+"ев":C(i)+"ов";default:
if(u.endsWith("не"))return a()}}if(u.endsWith("йки"))return T(i,3)+"ек";if(u.endsWith("ки")){if("ь"===E){const e=b(C(i))
;return T(i,3)+N("е",e)+e}if("жшч".includes(E))return a();if(l(I,E))return T(i,2)+"ок"}
if(Fe.includes(u))return C(i)+"ей";if(_(u,["аи","ои","еи","эи","уи"]))return C(i)+"й"
;if("свечи"===u)return[C(i),C(i)+"ей"];if("пригоршни"===u)return[C(i)+"ей",T(i,2)+"ен"]
;if("тихони"===u)return[T(i,2)+"нь",C(i)+"ей"]
;if(_(u,["ьи","ии"]))return t.sd.hasStressedEndingSingular(n,s).includes(!0)?T(i,2)+"ей":T(i,2)+"ий"
;if(u.endsWith("ни")&&l(I,W(u,2)))return["барышни","боярышни","деревни"].includes(u)?T(i,2)+"ень":u.endsWith("кухни")?T(i,2)+"онь":"сотни"===u?[T(i,2),T(i,2)+"ен"]:T(i,2)+"ен"
;if(h(d).endsWith("ийк"))return T(d,2)+"ек";if(d.length===u.length-1&&D(u,Pe)){
if("ьй".includes(h(W(d,1)))&&!n.isAnimate()){const e=b(d);return T(d,2)+N("е",e)+e}
return _(u,["земли","петли","пли","вли"])?C(d)+"ель":d+"ь"}return a()}}exports.CASES=e,exports.Case=t,
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
const s=function(e,t,n,r){const s=t.text();if(t.isIndeclinable())return s;if(t.isPluraleTantum())return tt(e,t,n,s)
;if(r)return tt(e,t,n,r);switch(t.getDeclension()){case-1:return s;case 0:return ce(e,t,n);case 1:return ge(e,t,n)
;case 2:return ae(e,t,n);case 3:return ue(e,t,n)}}(e,t,n,r);if(s instanceof Array)return s;return[s]
}(this,m.create(e),t,n)}pluralize(e){const t=m.create(e);return t.isPluraleTantum()?[t.text()]:xe(this,t)}
getLocativeForms(e){const t=this,n=m.create(e),r=n.getDeclension();if(r&&r>=0){const e=le.get(fe(n))
;if(e instanceof Array)return e.map(e=>new s(function(e){switch(1+(e>>3&7)){case c.V:return"в";case c.VO:return"во"
;case c.NA:return"на"}}(e),function(e,t,n,r){switch(t){case 0:return ce(e,n,Case.PREPOSITIONAL);case 1:return We(e,n,r)
;case 2:return ae(e,n,Case.PREPOSITIONAL);case 3:return ue(e,n,Case.PREPOSITIONAL)}}(t,r,n,E(e)),e>>6))}return[]}},
exports.Gender=r,exports.Lemma=m,exports.LocativeForm=s,exports.LocativeFormAttribute=i,exports.StressDictionary=y,
exports.createLemma=function(e){return m.create(e)},exports.createLemmaOrNull=function(e){return m.createOrNull(e)};
//# sourceMappingURL=RussianNouns.cjs.map
