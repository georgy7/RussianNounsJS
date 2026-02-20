/*!
  RussianNounsJS v3.0.0-alpha.1
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
PREPOSITIONAL:1,U_SUFFIX:2}),a=Object.freeze({V:1,VO:2,NA:3});function c(e,t,n){return n<<6|(e-1&7)<<3|t-1&7}
function E(e){return 1+(7&e)}function o(e){const t=e.replaceAll("ё","е");let n=t.length%2,r=1,s=5381;function i(){
s=(33*s+(255&n))%4294967296,n>>=8,r-=8}for(let e of t){const t=e.charCodeAt(0)-1072&31;n|=t<<r,r+=5,r>=8&&i()}r>0&&i()
;const u=t.charCodeAt(0)%2;return 2*(2147483647&s)+u}function h(e){const t=e.charCodeAt(0)-1072
;return 33===t?32:t===(31&t)?1<<t:0}function f(e,t){return 0!==(e&h(t))}const l=3892855073,S=66567902,d=66567390
;function I(e){return f(l,e)}function A(e){return e.split("").filter(I).length}function N(e){
return e.replaceAll("ё","е").replaceAll("Ё","Е")}function p(e,t){return e.substring(0,e.length-t)}function O(e,t){
return e.substring(e.length-t)}function T(e){return p(e,1)}function g(e){return C(e,1)}function C(e,t){
return e[e.length-t]||""}function W(e,t){return 1===t.length&&e.includes(t)}function _(e,t){
return t.some(t=>e.endsWith(t))}class w{constructor(e){e instanceof w?(this._txt=e._txt,this._lc=e._lc,
this._hash=e._hash,this._flags=e._flags):(e.pluraleTantum?this._flags=5:this._flags=1+n.indexOf(e.gender),
this._txt=e.text,this._lc=e.text.toLowerCase(),this._hash=o(this._lc),this._flags|=8*(1&e.indeclinable),
this._flags|=16*(1&e.animate),this._flags|=32*(1&e.surname),this._flags|=64*(1&e.name),this._flags|=128*(1&e.transport),
this._flags|=65536*(2+function(e,t,n,s){if(t)return-2;if(s)return-1;const i=g(e);switch(n){case r.FEMININE:
return"а"===i||"я"===i?2:f(S,i)?-1:3;case r.MASCULINE:return"а"===i||"я"===i?2:"путь"===e?0:1;case r.NEUTER:
return["дитя","полудитя"].includes(e)?0:"мя"===O(e,2)?3:1;case r.COMMON:return"а"===i||"я"===i?2:"и"===i?-1:1;default:
return-2}}(this._lc,e.pluraleTantum,e.gender,e.indeclinable)))}static create(e){if(e instanceof this)return e
;const t=U(e);if(t)throw new Error(t);return Object.freeze(new this(e))}static createOrNull(e){
return null===U(e)?Object.freeze(new this(e)):null}equals(e){
return e instanceof w&&this._flags===e._flags&&this.lower()===e.lower()}text(){return this._txt}lower(){return this._lc}
isPluraleTantum(){return 5==(7&this._flags)}getGender(){const e=7&this._flags;if(e>=1&&e<=4)return n[e-1]}
isIndeclinable(){return!!(8&this._flags)}isAnimate(){return!!(16&this._flags)||this.isASurname()||this.isAName()}
isASurname(){return!!(32&this._flags)}isAName(){return!!(64&this._flags)}isATransport(){return!!(128&this._flags)}
getDeclension(){return(this._flags>>16)-2}getSchoolDeclension(){const e=this.getDeclension();return 1===e?2:2===e?1:e}}
function m(e,t){const n=new w(e);return n._txt=t,n._lc=t.toLowerCase(),n._hash=o(n.lower()),Object.freeze(n)}
function U(e){if(null==e)return"No parameters specified."
;for(let t of["pluraleTantum","indeclinable","animate","surname","name","transport"]){
if((e=>null!=e&&"boolean"!=typeof e)(e[t]))return t+" must be boolean."}
if(null==e.text)return"A cyrillic word required.";if(!e.pluraleTantum){
if(null==e.gender)return"A grammatical gender required.";if(!n.includes(e.gender))return"Bad grammatical gender."}
return null}function b(e){const t=new Set;let n=0;for(let r of e)n+=r,t.add(n);return t}
const L=b([11720389,548,1024,1479,2622,2867,1222,2642,264,1328,137,123,397,65542229,212447047,31729170,8094836,1056,21701789,35520559,40358,21819,28248,119786,63892,31809,7356,74383,72369,5945,28902,90120738,21187517,91925642,3054826,1600765,65934,30948851,5569212,4205640,5412804,6787095,9749916,3940084,1511466,1303038,16090470,1376628,49919694,3827522,37915959,14032615,28701924,224587434,637275762,51079457,391103676,24108070,158999424,232633267,6058815,66599250,692781441,816204112,55209380,72754,90006,80058,45564,67845,42548,27193,21401,139393,750335,170896,4424,1566,6264,154969,17292,17229,175112,83011,117872,4183,13065,108972,108088,343663,66210,334,17090,380271,283272,59007,35796,230801,1067156,19992,157124,12433,252644,2626,23776,630482,531296,304718,90891,726,23116,47653,30493,167310,50156,123071,477118,241821,55660,908992,534269,205157,11218,2490,660,66391,46856,847526,68710,8450,36630,15642,109864,41716,354482,79820,51876,97325,5506,46436,191803,3957,40876,126323,2347821,338490,73216,475569,87602,29642,4220,10760,16896,50156,17424,35178,167244,126786,33643,30488,65045,35961,51453,55660,4,152461,138332,1958,34200,3709,61381,17424,30158,80591,11218,44099,260487]),R=b([11720389,548,1024,1060,4,5904,1848,4404,330555234,4691346,3365076,1045362,7414584,960432,10564312,253286,16178203,4357,4355,11350,31120,5248,40591,62367,54057,50487,13069,3664,39764,10263,3002,5810,8844,24551,4091,56761,21785,30553,55147139,15960625,1933097,12258067,16302047,54210486,45688435,1659767,4813249,33577763,2501798,10056946,672528,14209351,2012340,1655412,4652736,62568,148698,21186,71129124,260014161,108045611,1007583269,2026464,22799532,750068913,1499532,1285428194,74598,22348,6599,132273,309821,156816,397448,179394,148036,100257,21779,11218,36631,345954,50442,104394,2724,112115,30690,10552,31377,11286,7168,14612,51480,116537,192258,163145,65604,97951,1363157,212810,431243,2622,425588,275284,150351,570568,244701,16659,26136,130134,11040,159389,728373,3476,726,1290392,224730,189158,11218,2490,10750,21608,143747,65974,664563,84036,16283,17424,5758,45080,33066,1782,90658,37101,56107,233163,14216,5518,179264,2525,146957,111342,80594,2309,4217,25432,26905,29980,518951,1458289,523705,4202,477865,149368,126310,47828,212678,22744,269176,179119,4399,35997,69696,41777,41,127336,4202,73153,46372,114255,126869,23630,11218])
;class M{constructor(){this._filter=new Uint8ClampedArray(256)}addInteger(e){this.addRaw(V(e))}hasInteger(e){
return this.hasRaw(V(e))}addRaw(e){const t=2047&e,n=t>>>3;this._filter[n]=this._filter[n]|1<<7-t%8}hasRaw(e){
const t=2047&e;return!!(this._filter[t>>>3]>>>7-t%8&1)}clone(){return function(e){const t=new M
;return t._filter=Uint8ClampedArray.from(e),t}(this._filter)}}function V(e){return e>>>22&2047^e>>>11&2047^2047&e}
function x(e){const t=e.padStart(3,"а");return(7&t.charCodeAt(0))<<8|(15&t.charCodeAt(1))<<4|15&t.charCodeAt(2)}
const P=function(){const e=new M;return L.forEach(t=>e.addInteger(t)),R.forEach(t=>e.addInteger(t)),Object.freeze(e)}()
;function F(){const t=new Map,n=P.clone(),s=function(e){return 4294967296*(31&e._flags)+e._hash},i=function(e){
return e.lower().indexOf("ё")+1&255},u=e=>{const n=65504&e._flags,r=(e=>{const n=s(e),r=t.get(n)
;return r instanceof Array?r:[]})(e).filter(e=>(e[0]&n)<=n),u=r.filter(t=>t[0]>>16===i(e))
;return u.length?u[0][1]:r.length?r[0][1]:void 0};this.put=function(e,r){
const u=r.split("-"),a=(e,t)=>e.length!==t||e.split("").some(e=>!"SsbeE".includes(e))
;if(2!==u.length||a(u[0],7)||a(u[1],6))throw new Error("Bad settings format.");const c=w.create(e),E=s(c);let o=t.get(E)
;o instanceof Array||(o=[],t.set(E,o));const h=65535&c._flags|i(c)<<16,f=o.find(e=>h===e[0]);f?f[1]=r:o.push([h,r]),
n.addInteger(c._hash)};const a=e=>{switch(e){case"E":return[!0];case"e":return[!0,!1];case"b":case"s":return[!1,!0]
;default:return[!1]}};this.hasStressedEndingSingular=function(t,s){if(n.hasInteger(t._hash)){const n=e.indexOf(s)
;if(n>=0){let e=u(t);if(e){const t=e.split("-")[0];return a(t[n])}if(t.getGender()===r.MASCULINE){
if(L.has(t._hash))return a("SEESEEE"[n]);if(R.has(t._hash))return a("SEEEEEE"[n])}}}return[]},
this.hasStressedEndingPlural=function(t,s){if(n.hasInteger(t._hash)){const n=e.indexOf(s);if(n>=0&&n<6){let e=u(t)
;if(e){const t=e.split("-")[1];return a(t[n])}
if(t.getGender()===r.MASCULINE&&(L.has(t._hash)||t.isAnimate()&&R.has(t._hash)))return a("E")}}return[]}}function y(e){
let t=new Map;for(let n of e){let e=t;for(let t=n.length-1;t>=0;t--){const r=n.charCodeAt(t);if(t>0){const t=e.get(r)
;if(0===t)break;void 0===t&&e.set(r,new Map),e=e.get(r)}else e.set(r,0)}}return t}function D(e,t){let n=t
;for(let t=e.length-1;t>=0;t--){const r=e.charCodeAt(t);if(!n.has(r))return!1;{const e=n.get(r);if(0===e)return!0;n=e}}}
function k(e){let t=new Array(e.length);for(let n=0;n<e.length;n++){let r=e.charCodeAt(n)
;r>=1040&&r<=1071?r+=32:r>=1024&&r<=1039&&(r+=80),t[n]=r}return String.fromCharCode.apply(null,t)}function G(e,t){
return t===t.toUpperCase()?e.toUpperCase():e}
const j=y(["ое","нький","ский","ской","лстой","отой","утой","евой","овой","живой"]),z=y(["ее","ое","нький","ский","ской","лстой","отой","утой"]),B=y(["евой","овой","отой","живой"]),H=y(["шний","жний","щий","ший","жий","чий"]),J=["божий","ажий","яжий","ужий","южий","бульдожий","кабарожий","медвежий","носорожий","миножий"],v=y(J),X=y(J.map(e=>p(e,2)+"ьи")),Y=new Set(["бубен","бугор","ветер","вошь","вымысел","горшок","деготь","дёготь","дятел","домысел","замысел","кашель","коготь","лапоть","лоб","локоть","ломоть","молебен","мох","ноготь","овен","пепел","пес","пёс","петушок","помысел","порошок","промысел","псалом","пушок","ров","рожь","рот","сон","стебель","стишок","угол","умысел","хребет","церковь","шов","ковер","овес","костер"].map(o)),q=new M
;Y.forEach(e=>q.addInteger(e))
;const K=y(["овёс","ковёр","костёр","шатер","шатёр","козел","козёл","котел","котёл","орел","орёл","осел","осёл","узел","уголь","чок","ешок","хол"])
;function Q(e,t){const n=g(t);if(f(-402111711,n)){if(f(l,C(t,2))){const n=p(e,2);return D(t,v)?n+G("ь",n):n}
if("й"!==n)return T(e)}return e}const Z=["ясень","бюллетень","олень","тюлень","гордень","пельмень","ячмень"]
;function $(e,t,n){const s=e.text(),i=g(t),u=h(i);let a;return-133667019&u&&(-402111711&u?a=function(e,t,n){
const r=C(t,2);return"ь"===r||"о"===n&&f(2504708,r)?T(e):Q(e,t)}(s,t,i):"к"===i?a=function(e,t,n){
return e.length>=4&&_(t,["рёк","нёк","лёк"])&&!1!==n?p(e,2)+"ьк":t.endsWith("ёк")&&f(l,C(t,3))?p(e,2)+"йк":void 0
}(s,t,n):"ь"===i?a=function(e,t,n){
return Y.has(e._hash)||D(n,K)?p(t,3)+C(t,2):n.endsWith("ень")&&e.getGender()===r.MASCULINE&&!_(n,Z)?p(t,3)+"н":T(t)
}(e,s,t):(["лёд","лед","лён"].includes(t)||"лев"===t&&e.isAnimate())&&(a=p(s,2)+G("ь",C(s,2))+g(s))),
a||(a=function(e,t,n){
return!!(199680&n)&&D(t,K)&&!["новосел","новосёл"].includes(t)||!!(2571270&n)&&(q.hasInteger(e._hash)&&Y.has(e._hash)||e.isAnimate()&&t.endsWith("посол"))
}(e,t,u)?p(s,2)+g(s):s),a}function ee(e,t){const n=T(e),r=T(t.lower());if("а"===g(r))return n
;if(_(r,["зне","жне","гре","спе","мудре"])||O(T(r),3).split("").every(e=>f(d,e))||t.isAName())return n
;if("ле"===O(r,2)){const e=C(r,3);return f(l,e)||"л"===e?T(n)+"ь":n}
return f(l,g(r))&&"и"!==g(r)?f(l,g(T(r)))?p(e,2)+"й":_(t.lower(),["месяц"])?n:p(e,2):n}
const te=y(["лапоток","желток","нишок","ришок","ишек"]),ne=["поток","приток","переток","проток","биоток","электроток","восток","водосток","водоток","воток","знаток"],re=["инок","исток","обморок","порок","пророк","сток","урок"]
;function se(e){
return _(e,["чек","шек"])&&e.length>=6||D(e,te)||e.endsWith("ок")&&!e.endsWith("шок")&&!re.includes(e)&&!_(e,ne)&&!f(l,C(e,3))&&(f(l,C(e,4))||_(p(e,2),["ст","рт"]))&&e.length>=4
}function ie(e,t,n){return(e.length?e:[!1]).map(e=>n(e?N(t):t,e))}const ue={"дочь":"дочерь","мать":"матерь"}
;function ae(e,n,r){const s=n.text(),i=n.lower()
;if(![t.NOMINATIVE,t.ACCUSATIVE].includes(r)&&Object.keys(ue).includes(i)){return ae(e,m(n,ue[i]),r)}let u=$(n,i)
;if(function(e){return e.endsWith("полночь")||e.startsWith("пол")&&f(134217984,g(e))&&A(e)>=2
}(i)&&(u="полу"+u.substring(3)),"мя"===O(i,2))switch(r){case t.NOMINATIVE:case t.ACCUSATIVE:return s;case t.GENITIVE:
case t.DATIVE:case t.PREPOSITIONAL:case t.LOCATIVE:return u+"ени";case t.INSTRUMENTAL:return u+"енем"}else switch(r){
case t.NOMINATIVE:case t.ACCUSATIVE:return s;case t.GENITIVE:case t.DATIVE:case t.PREPOSITIONAL:case t.LOCATIVE:
return u+"и";case t.INSTRUMENTAL:return _(i,["вошь","рожь","церковь"])?s+"ю":u+"ью"}}function ce(e,n,r){
const s=n.text(),i=n.lower();if(i.endsWith("путь"))return r===t.INSTRUMENTAL?T(s)+"ём":ae(e,n,r)
;if(!i.endsWith("дитя"))throw new Error("unsupported");switch(r){case t.NOMINATIVE:case t.ACCUSATIVE:return s
;case t.GENITIVE:case t.DATIVE:case t.PREPOSITIONAL:case t.LOCATIVE:return s+"ти";case t.INSTRUMENTAL:
return[s+"тей",s+"тею"]}}function Ee(e,n,r){
const s=n.text(),i=n.lower(),u=$(n,i),a=k(u),c=T(s),E=T(i),o=()=>"я"===g(i),h=()=>i.endsWith("ая")&&!(2===A(i)||f(l,g(a))),S=()=>i.endsWith("яя")&&!(2===A(i)||f(l,g(a))),d=["жая","шая"]
;switch(r){case t.NOMINATIVE:return s;case t.GENITIVE:
return S()||_(i,d)?u+"ей":h()?u+"ой":n.isASurname()&&!i.endsWith("да")?c+"ой":i.endsWith("ничья")?c+"ей":o()||f(60818504,g(a))?c+"и":c+"ы"
;case t.DATIVE:
return S()||_(i,d)?u+"ей":h()?u+"ой":n.isASurname()&&!i.endsWith("да")?c+"ой":"ия"===O(i,2)?c+"и":i.endsWith("ничья")?c+"ей":c+"е"
;case t.ACCUSATIVE:return h()?u+"ую":S()?u+"юю":o()?c+"ю":c+"у";case t.INSTRUMENTAL:
return S()||_(i,d)?u+"ею":h()?[u+"ой",u+"ою"]:o()||W("жшчщц",g(a))&&!e.sd.hasStressedEndingSingular(n,r).includes(!0)?"и"===g(E)?c+"ей":[c+"ей",c+"ею"]:[c+"ой",c+"ою"]
;case t.PREPOSITIONAL:case t.LOCATIVE:
return S()||_(i,d)?u+"ей":h()?u+"ой":n.isASurname()&&!i.endsWith("да")?c+"ой":"ия"===O(i,2)?c+"и":i.endsWith("ничья")?c+"ей":c+"е"
}}const oe=y(["ов","ев","ёв","ин","ын"]),he=function(e,t){let n=t;for(let t=0;t<e.length;t++){
const r=e.charCodeAt(t),s=n;n=new Map,n.set(r,s)}return n}("ы",oe);function fe(e){
return e.filter((t,n)=>e.indexOf(t)===n)}function le(e){const t=1&e.lower().includes("ё")
;return 4294967296*((65535&e._flags)<<1|t)+e._hash}const Se=Object.freeze(function(){const e=new Map,t={
gender:r.MASCULINE},n={gender:r.MASCULINE,animate:!0};function s(t,n,r,s,i){
const a=s.split(","),E=i instanceof Array?i:[u.U_SUFFIX];for(let s of a){t.text=s;const i=le(w.create(t));let u=e.get(i)
;u||(u=[],e.set(i,u));for(let e of r)for(let t of E)u.push(c(e,t,n))}}const E=[a.V],o=[a.VO],h=[a.NA]
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
}()),de=new Set("клей,чай,дом,дух,дым,дымок,газ,год,горошек,жар,жир,квас,пар,пыл,род,рост,сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,табак,творог,толк,торф,туман,убыток,укроп,уксус,ход,цемент,чеснок,шаг,шик,шиповник,шоколад,шорох,шум,яд".split(",")),Ie=new M
;de.forEach(e=>Ie.addInteger(o(e)))
;const Ae=y(["й","ие","иё"]),Ne=y(["воробей","муравей","ручей","соловей","улей"]),pe=y(["мой","ной","дой","шой","жой","рзой","осой","хой","латой","витой","литой","питой","житой","отой","утой","ятой","лагой","рагой","огой","угой","лубой","любой","илой","ылой","злой","малой","овой","евой","живой","ской","акой","укой","нний","ский","йкий","цкий","зкий","ткий","лкий","мкий","хкий","оркий","аркий","яркий","ький","ёкий","бокий","оокий","cокий","токий","ликий","дикий","укий","ыкий","який","пкий","дкий","бкий","нкий","жкий","чкий","гкий","овкий","авкий"])
;function Oe(e,t){return"ый"===O(t,2)||(t.endsWith("кривой")||D(t,pe))&&A(t)>=2}
const Te=y(["ий","ие","чье","тье","дье","вье","бье","жалованье","енье","ружье","божье","верье","мужье"]),ge=y(["вое","лое","мое","ное","рое","тое","той","ый"])
;function Ce(e,n,s){const i=n.text(),u=k(i),a=g(u),c=n.getGender(),o=e.sd.hasStressedEndingSingular(n,s)
;let h=$(n,u,o[0]),f=T(i);const l=_e(u);l&&(h="полу"+h.substring(3),f="полу"+f.substring(3));let S=k(h)
;const d=()=>l&&u.endsWith("я")||me(u),I=D(u,Ae),A=()=>D(u,Ne)?T(f)+G("ь",g(f)):f,N=()=>W("чщ",g(S));function p(e){
return!n.isAnimate()&&Ie.hasInteger(n._hash)&&de.has(u)&&("й"===a?e.push(T(i)+G("ю",g(i))):e=e.concat(ie(o,h,e=>e+G("у",g(e))))),
e}switch(s){case t.NOMINATIVE:return i;case t.GENITIVE:switch(a){case"и":case"ы":if(l)return We(e,n,s,u);break;case"й":
case"е":if(I&&n.isASurname()||Oe(0,u)||D(u,j))return h+"ого";if(D(u,H)||u.endsWith("ее"))return h+"его";case"ё":case"я":
case"ь":if(I){return p([A()+"я"])}if(d()&&!N())return h+"я";break;case"ц":return ee(i,n)+"ца";case"к":
if(se(u))return T(f)+"ка";break;case"о":if(_(u,["шко"])&&r.MASCULINE===c)return f+"и"}let w
;return w=n.isASurname()||-1===S.indexOf("ё")?[h+"а"]:ie(o,h,e=>e+"а"),p(w);case t.DATIVE:switch(a){case"и":case"ы":
if(l)return We(e,n,s,u);break;case"й":case"е":if(I&&n.isASurname()||Oe(0,u)||D(u,j))return h+"ому"
;if(D(u,H)||u.endsWith("ее"))return h+"ему";case"ё":case"я":case"ь":if(I)return A()+"ю";if(d()&&!N())return h+"ю";break
;case"ц":return ee(i,n)+"цу";case"к":if(se(u))return T(f)+"ку"}
return n.isASurname()||-1===S.indexOf("ё")?h+"у":ie(o,h,e=>e+"у");case t.ACCUSATIVE:
return c===r.NEUTER||W("иы",a)&&l?i:n.isAnimate()?Ce(e,n,t.GENITIVE):i;case t.INSTRUMENTAL:switch(a){case"и":case"ы":
if(l)return We(e,n,s,u);break;case"й":case"е":case"ё":case"я":case"ь":
if(I&&n.isASurname()||D(u,z))return D(u,ge)?h+"ым":h+"им";if(Oe(0,u))return"и"===C(u,2)||u.endsWith("хой")?h+"им":h+"ым"
;if(D(u,B))return h+"ым";if(D(u,H))return h+"им";if(I)return A()+"ем";if(u.endsWith("це"))return i+"м";break;case"ц":
return ie(o,i,(e,t)=>t?ee(e,n)+"цом":ee(e,n)+"цем");case"к":if(se(u))return T(f)+"ком";break;case"н":case"в":
if(n.isASurname()&&D(u,oe))return i+"ым"}
return d()||W("жшчщ",g(S))?ie(o,h,(e,t)=>t?e+"ом":e+"ем"):n.isASurname()||-1===S.indexOf("ё")?h+"ом":ie(o,h,e=>e+"ом")
;case t.LOCATIVE:if("полпути"===u)return i;const m=Se.get(le(n));if(m){return fe(m.map(e=>E(e))).map(t=>we(e,n,t))}
case t.PREPOSITIONAL:switch(a){case"и":if("полпути"===u)return i;case"ы":if(l)return We(e,n,s,u);break;case"й":case"е":
case"ё":case"я":case"ь":if(I&&n.isASurname()||Oe(0,u)||D(u,j))return h+"ом";if(D(u,H)||u.endsWith("ее"))return h+"ем"
;if(_(u,["воробей"])){const e=T(f);return e+G("ье",g(e))}
if(D(u,Te)&&!_(u,["запястье","здоровье","изголовье","платье"]))return f+"и";if("й"===a||"иё"===O(u,2))return A()+"е"
;break;case"ц":return ee(i,n)+"це";case"к":if(se(u))return T(f)+"ке"}
return n.isASurname()||-1===S.indexOf("ё")?h+"е":ie(o,h,e=>e+"е")}}function We(e,t,n,r){
const s=()=>"полминуты"!==r?"полу"+t.text().substring(3):t.text();if("полпути"===r){return ce(e,m(t,T(s())+"ь"),n)}
if(r.endsWith("зни")||r.endsWith("сти")){return ae(e,m(t,T(s())+"ь"),n)}
return Ee(e,m(t,T(s())+("ни"===O(r,2)?"я":"а")),n)}function _e(e){
if(e.startsWith("пол")&&f(2550137089,g(e))&&"л"!==e[3]&&A(e)>=2){let t=e.substring(3),n=t.search(/[а-яё]/)
;return n>=0&&f(S,t[n])}return!1}function we(e,n,r){if(u.U_SUFFIX===r){const e=n.text(),t=n.lower();let r=$(n,t),s=T(e)
;const i=_e(t)&&t.endsWith("я")||me(t);return"й"===g(t)?N(s)+"ю":i?N(r)+"ю":se(t)?N(T(s))+"ку":N(r)+"у"}
if(u.PREPOSITIONAL===r)return Ce(e,n,t.PREPOSITIONAL)}function me(e){
return"ь"===g(e)&&!e.endsWith("господь")||W("её",g(e))&&!_(e,["це","же"])}
const Ue=new M,be=Object.freeze([[[r.MASCULINE,void 0],{"болгарин":["болгары"],"господин":["господа"],
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
;for(const e of be)Object.keys(e[1]).map(e=>Ue.addInteger(o(e)))
;const Le=["зять","деверь","друг","брат","собрат","стул","брус","обод","полоз","струп","подмастерье","якорь","перо","шило"],Re=new Set(["берег","бок","борт","век","вес","веер","вексель","вечер","глаз","голос","город","доктор","дом","детдом","егерь","жемчуг","катер","колокол","концлагерь","корм","короб","кузов","купол","лес","луг","мастер","номер","пояс","провод","рог","сахар","снег","сорт","стог","счет","счёт","спецсчет","спецсчёт","субсчет","субсчёт","терем","том","холод","цвет","череп"]),Me=y(["округ","остров","отпуск","паспорт","парус","поезд","повар","погреб","рукав","цех","юнкер"]),Ve=new Set(["адрес","договор","буфер","ворох","директор","инспектор","инструктор","корпус","крейсер","орден","ордер","прожектор","пропуск","род","свитер","сервер","тенор","тон","трактор","тормоз","ветер","верх","китель","мех","хлеб","юнкер","ястреб"]),xe=new Set(["бункер","вымпел","год","образ","омут","токарь","тополь","шторм","штуцер"])
;function Pe(e,n){const s=[],i=n.text(),u=k(i),a=e.sd.hasStressedEndingPlural(n,t.NOMINATIVE);Object.freeze(a)
;const c=$(n,u,a[0]),E=k(c);if(u.endsWith("яя"))return s.push(p(i,2)+"ие"),fe(s);const o=r=>{
const s=e.sd.hasStressedEndingPlural(n,t.NOMINATIVE).map(e=>!e)
;return s.length?s.map(e=>e?1===E.replace(/[^её]/g,"").length?r((e=>{
const t=Math.max(e.toLowerCase().lastIndexOf("е"),e.toLowerCase().lastIndexOf("ё")),n=G("ё",e[t])
;return e.substring(0,t)+n+e.substring(t+1)})(c)):r(c):r(N(c))):[r(c)]
},h=n.getGender(),S=n.getDeclension(),d=("й"===g(u)||f(l,g(u)))&&f(l,g(T(u)))?T(i):c,I=()=>(u.endsWith("евич")||u.endsWith("евна"))&&u.indexOf("ье")>=0
;function A(){const e=d,t=k(e).indexOf("ье"),n=G("и",e[t]);return e.substring(0,t)+n+e.substring(t+1)}function w(){
f(60818504,g(E))||W("яйь",g(u))||_(u,["сосед"])?I()?(s.push(A()+"и"),
s.push(d+"и")):Array.prototype.push.apply(s,ie(a,d,e=>e+"и")):"ц"===g(u)?s.push(ee(i,n)+"цы"):I()?(s.push(A()+"ы"),
s.push(d+"ы")):Array.prototype.push.apply(s,ie(a,d,e=>e+"ы"))}const m=function(e,t){if(Ue.hasInteger(e._hash)){
const n=e.getGender(),r=e.isAnimate();for(const[e,s]of be){const i=e[0],u=e[1]
;if(n===i&&(null==u||u===r)&&s.hasOwnProperty(t))return s[t].slice()}}}(n,u);if(m)return m
;const U="ь"===g(E)?c:"к"===g(E)?T(c)+"чь":"г"===g(E)?T(c)+"зь":"й"===g(u)?T(i):_(u,["рь","ль"])?c:c+"ь";switch(S){
case-1:s.push(i);break;case 0:if("путь"===u)s.push("пути");else{if(!u.endsWith("дитя"))throw new Error("unsupported")
;s.push(p(i,3)+"ети")}break;case 1:if(Le.includes(u))s.push(U+"я");else if(r.MASCULINE===h){
const e=["крюк","лист","лоскут","повод","прут","сук","учитель","флигель","штабель"],t=["клин","колос","ком","край","соболь"]
;"сын"===u?(s.push("сыновья"),w()):"человек"===u?(s.push("люди"),w()):e.includes(u)||"соболь"===u&&n.isAnimate()?(w(),
s.push(U+"я")):t.includes(u)?s.push(U+"я"):Re.has(u)||D(u,Me)||Ve.has(u)||xe.has(u)?(xe.has(u)&&w(),
me(u)?Array.prototype.push.apply(s,o(e=>e+"я")):a.includes(!0)?s.push(N(c)+"а"):s.push(c+"а"),
Ve.has(u)&&w()):(u.endsWith("анин")&&u.length>5||u.endsWith("янин"))&&!n.isAName()||["барин","боярин"].includes(u)?(s.push(p(i,2)+"е"),
"барин"===u&&s.push(p(i,2)+"ы")):["цыган"].includes(u)?s.push(i+"е"):"щенок"===u?(s.push(p(i,2)+"ки"),
s.push(p(i,2)+"ята")):!u.endsWith("ребёнок")&&!u.endsWith("ребенок")||u.endsWith("жеребёнок")||u.endsWith("жеребенок")||u.endsWith("ястребёнок")||u.endsWith("ястребенок")?(u.endsWith("ёнок")||u.endsWith("енок"))&&n.isAnimate()?s.push(p(i,4)+"ята"):u.endsWith("ёночек")&&n.isAnimate()?s.push(p(i,6)+"ятки"):u.endsWith("онок")&&W("жшч",C(u,5))&&n.isAnimate()?s.push(p(i,4)+"ата"):se(u)?s.push(p(i,2)+"ки"):D(u,H)?_(u,J)?s.push(p(i,2)+"ьи"):s.push(T(i)+"е"):Oe(0,u)?u.endsWith("ый")||u.endsWith("ий")?s.push(T(i)+"е"):u.endsWith("ой")&&!_(u,["хой","ской"])?s.push(p(i,2)+"ые"):s.push(p(i,2)+"ие"):u.endsWith("его")?s.push(p(i,3)+"ие"):["воробей","муравей","ручей","соловей","улей","жеребей","ирей","репей","чирей"].includes(u)?s.push(p(i,2)+"ьи"):w():s.push(p(i,7)+"дети")
}else if(r.NEUTER===h)if(_(u,["ко","чо"])&&!_(u,["войско","облако"]))s.push(T(i)+"и");else if(u.endsWith("имое"))s.push(c+"ые");else if(u.endsWith("ее"))s.push(c+"ие");else if(u.endsWith("ое"))_(E,["г","к","ж","ш","х"])?s.push(c+"ие"):s.push(c+"ые");else if(_(u,["ие","иё"]))s.push(p(i,2)+"ия");else if(_(u,["ье","ьё"])){
const e=p(i,2),t=["безделье","варенье","воскресенье","жалованье","запястье","застолье","затишье","здоровье","зелье","изголовье","новоселье","одночасье","печенье","платье","побережье","поголовье","подворье","подземелье","подполье","поместье","предплечье","раздумье","сиденье","средневековье","увечье","угодье","устье"].includes(u)
;"е"!==g(u)||t||s.push(e+"ия"),s.push(e+"ья")
}else _(u,["дерево","звено","крыло"])?s.push(c+"ья"):_(u,["ле","ре"])?s.push(c+"я"):u.endsWith("судно")&&n.isATransport()?s.push(p(i,2)+"а"):(Array.prototype.push.apply(s,o(e=>e+"а")),
_(u,["щупальце"])&&w());else s.push(c+"и");break;case 2:
"заря"===u?s.push("зори"):u.endsWith("ая")&&!u.endsWith("свая")?W("жхчшщ",g(E))||_(E,["вк","гк","ск","цк","ньк"])?s.push(c+"ие"):s.push(c+"ые"):w()
;break;case 3:
"мя"===O(u,2)?s.push(c+"ена"):Object.keys(ue).includes(u)?s.push(T(ue[u])+"и"):r.FEMININE===h?s.push(d+"и"):"и"===g(d)?s.push(d+"я"):s.push(d+"а")
}return fe(s)}
const Fe=y(["ли","си","би","ви","ди","ти","пи","ри","ни","фи","зи","ьи","ья","ия","ря","ля","ая","аи","ои","уи","эи","ыи","яи","ёи","юи","еи","ии"]),ye=["беготни","болтовни","будни","вожжи","возни","доли","лапши","левши","люди","марли","моря","мощи","ноздри","пени","пятерни","распри","родни","сакли","сени","ступни","судьи","фигни","чукчи"],De=["головы","громадины","детины","деревенщины","дохлятины","дубины","ехидины","жадины","зверины","идиотины","кислятины","молодчины","орясины","остолопины","сиротины","скотины","старейшины","старины","старшины","уродины"],ke=y(De),Ge=["адреса","паспорта","поезда","цеха","снега","бункера","буфера","берега","вымпела","голоса","города","директора","договора","доктора","жемчуга","инспектора","инструктора","колокола","кондуктора","короба","корпуса","крейсера","кузова","леса","мастера","номера","облачка","острова","отпуска","паруса","повара","погреба","пояса","провода","прожектора","пропуска","рукава","сахара","свитера","сервера","счета","трактора","тормоза","холода","цвета","черепа","шторма","штуцера","юнкера","ястреба","суда","корм"],je=y(Ge),ze=new Set(Ge.concat(["бега","беглецы","близнецы","бойцы","бока","борта","борцы","бруствера","брюшки","веера","века","венцы","верха","веса","весы","вечера","вороха","глупцы","года","гонцы","дворцы","дельцы","детдома","детдомы","дома","жеребцы","жильцы","жрецы","затишки","зубцы","излишки","истцы","катера","концы","корма","кузнецы","купола","купцы","лишки","луга","мертвецы","меха","мудрецы","облака","образа","образцы","огурцы","округа","омута","ордена","ордера","отцы","очки","певцы","песцы","пловцы","подлецы","продавцы","птенцы","резцы","рога","рода","рубцы","самцы","свинцы","сорта","соуса","спецы","стога","столбцы","стрельцы","творцы","тельцы","тенора","терема","тома","тона","торцы","хлеба","штришки","юнцы"])),Be=new Set(["авары","аланы","аршины","баклажаны","буквы","гольфы","граммы","гусары","дела","кадеты","килограммы","омы","помидоры","рентгены","ботинки","человеки","чулки","шорты"]),He=new Set(["гектары","рельсы"]),Je=new M
;ze.forEach(e=>Je.addRaw(x(e))),Be.forEach(e=>Je.addRaw(x(e))),He.forEach(e=>Je.addRaw(x(e)))
;const ve=new Set(De.concat(["абазины","авы","аввы","бедняги","бедолаги","болгары","бродяги","брызги","брюки","брюхи","будды","бусы","валенки","веки","вельможи","верзилы","вилы","владыки","воеводы","волосы","вояки","главы","грузины","задворки","задиры","железы","жилы","зануды","зеваки","именины","калеки","кальсоны","каникулы","колготки","коллеги","крохи","курицы","куры","ладоши","ламы","лыки","макароны","мужчины","нападки","нары","непоседы","носилки","ножны","папы","папаши","таты","падлы","партизаны","погоны","поминки","посиделки","похороны","предтечи","работяги","разы","ребятки","румыны","самоубийцы","санки","убийцы","сапоги","сатаны","сироты","сливки","слуги","солдаты","старосты","сумерки","сутки","татары","телеса","хитрюги","четвереньки","шляпы","шмотки","яблоки","дядьки","дяденьки","зайки","кроссовки","малютки","малолетки","попки","турки","узы","хлопоты","шахматы"])),Xe=new M
;ve.forEach(e=>Xe.addRaw(x(e)))
;const Ye=["х","ых","их","м","ым","им","х","ых","их","ми","ыми","ими","х","ых","их"],qe=["ям","ам","","","ями","ами","ях","ах"],Ke=y(["вна","вца","вцы","пла","дца","дра","судна","рки","рцы","тлы","рна","тна","енца","десны","дёсны","рёбра","ребра","сосны"]),Qe=y(["жи","ши","чи","ля","ли","чи","ри","ти","ди","сани","борщи","клещи","товарищи","плащи","прыщи","хрящи"]),Ze=y(["братья","брусья","деревья","донья","звенья","клинья","клочья","коленья","колосья","колья","комья","крылья","крючья","листья","лоскутья","лохмотья","перья","платья","поводья","прутья","стулья","сучья","хлопья","шилья"]),$e=y(["ишки","дружки","тки","папочки","дедушки","дядюшки","батюшки","катанки","петрушки","шестерки"]),et=y(["жки","шки","чки","рки","натки","хатки","ятки","етки","чётки","мки","нки","педки","илки"]),tt=y(["шок","щок","жок","зок","аток","яток","еток"])
;function nt(t,n,s,i){const u=k(i),a=g(u),c=h(a),E=e.indexOf(s)+1;if(1===E||4===E&&!n.isAnimate())return i
;if(134217984&c)if(2===E||4===E){if(_(u,["овичи","евичи"]))return T(i)+"ей"
;if(_(u,["вны","полусотни"])&&"овны"!==u)return p(i,2)+"ен"}else if(5===E){
if(_(u,["дети","люди"])&&!_(u,["нелюди"]))return T(i)+"ьми";if(_(u,["вери","дочери"]))return[T(i)+"ями",T(i)+"ьми"]}
const o=n.getGender(),S=u.endsWith("цы")?T(i):Q(i,u),I=D(u,he)&&(n.isASurname()||o===r.COMMON)&&!D(u,ke),A=3*Math.min(Math.round(Ye.length/3-1),E-2)
;if(I||u.endsWith("ничьи"))return i+Ye[A];if(u.endsWith("ые"))return p(i,2)+Ye[A+1]
;if(u.endsWith("ие")||D(u,X))return S+Ye[A+2];if(E>2&&4!==E){const e=2,r=e*Math.min(Math.round(qe.length/e-1),E-3)
;return D(u,Fe)?T(i)+qe[r]:t.sd.hasStressedEndingPlural(n,s).includes(!0)?N(S)+qe[r+1]:S+qe[r+1]}{
const e=n.getDeclension(),c=()=>{const e=k(S),r=["жки","шки","чки","ножны"]
;if(_(e,["кн","кл","дк","нк","пк","зк","рк","тк","вк","лк","мк"])&&!_(u,["сумерки"])||"зл"===e||_(u,r)&&t.sd.hasStressedEndingPlural(n,s).includes(!0)){
const e=g(S);return T(S)+G("о",e)+e}if(D(u,Ke)&&!u.endsWith("недра")||_(u,r)){const e=C(i,2);return p(i,2)+G("е",e)+e}
if(_(u,["сестры","сёстры","серьги"])){const e=C(i,2);return("ь"===C(u,3)?N(p(i,3)):N(p(i,2)))+G("ё",e)+e}
if(_(e,["льц","сьм","деньг","ьк","йк","дьб"])){const e=g(S);return p(S,2)+G("е",e)+e}
return _(u,["сла","слы"])?T(S)+"ел":S};if([3,0].includes(e)){if(u.endsWith("и"))return T(i)+"ей"
;if(["гроздья"].includes(u))return T(i)+"ев"}const E=C(u,3);if(r.FEMININE!==o){const e=x(u),t=Je.hasRaw(e)
;if(t&&ze.has(u))return T(i)+"ов";if(t&&Be.has(u)&&!n.isAName())return[c(),T(i)+"ов"]
;if(t&&He.has(u))return[T(i)+"ов",c()]
;if(o===r.COMMON&&!_(u,ye)&&!W("жшч",E)||Xe.hasRaw(e)&&ve.has(u)||n.isAName()&&o===r.MASCULINE&&n.lower().endsWith("а")||"барин"===n.lower())return c()
;switch(a){case"и":case"я":
if(D(u,Qe)||"щи"===u||ye.includes(u)||n.lower().endsWith("ь")&&!_(n.lower(),["зять","деверь"])){
return("ь"===g(T(u))?p(i,2):T(i))+"ей"}
if("и"===a)return u.endsWith("ульи")?T(i)+"ев":u.endsWith("ьи")?r.MASCULINE===o?T(i)+"ёв":p(i,2)+"ей":["ча","кле","холу","ху"].includes(T(u))?T(i)+"ёв":u.endsWith("ищи")?c():u.endsWith("мессии")?T(i)+"й":f(l,C(u,2))?T(i)+"ев":!D(u,et)||r.MASCULINE===o&&!D(N(u),$e)||D(n.lower(),tt)?T(i)+"ов":c()
;if(D(u,Ze))return T(i)+"ев";if(_(u,["зятья","кумовья","деверья","края","острия"]))return T(i)+"ёв"
;if(_(u,["ья","ия"]))return r.MASCULINE===o?p(i,2)+"ей":p(i,2)+"ий";break;case"а":
return _(u,["семена","стремена"])?p(i,3)+"ян":u.endsWith("мена")?p(i,3)+"ён":n.lower().endsWith("яйцо")?G("яиц",T(i)):u.endsWith("нца")?[c(),T(i)+"ев"]:D(u,je)?T(i)+"ов":c()
;case"ы":return _(u,["ницы","лицы","пицы","бицы"])?T(i):u.endsWith("цы")?T(i)+"ев":T(i)+"ов";default:
if(u.endsWith("не"))return c()}}if(u.endsWith("йки"))return p(i,3)+"ек";if(u.endsWith("ки")){if("ь"===E){const e=g(T(i))
;return p(i,3)+G("е",e)+e}if(W("жшч",E))return c();if(f(d,E))return p(i,2)+"ок"}if(ye.includes(u))return T(i)+"ей"
;if(_(u,["аи","ои","еи","эи","уи"]))return T(i)+"й";if("свечи"===u)return[T(i),T(i)+"ей"]
;if("пригоршни"===u)return[T(i)+"ей",p(i,2)+"ен"];if("тихони"===u)return[p(i,2)+"нь",T(i)+"ей"]
;if(_(u,["ьи","ии"]))return t.sd.hasStressedEndingSingular(n,s).includes(!0)?p(i,2)+"ей":p(i,2)+"ий"
;if(u.endsWith("ни")&&f(d,C(u,3)))return["барышни","боярышни","деревни"].includes(u)?p(i,2)+"ень":u.endsWith("кухни")?p(i,2)+"онь":"сотни"===u?[p(i,2),p(i,2)+"ен"]:p(i,2)+"ен"
;if(k(S).endsWith("ийк"))return p(S,2)+"ек";if(S.length===u.length-1&&D(u,Fe)){if(W("ьй",k(C(S,2)))&&!n.isAnimate()){
const e=g(S);return p(S,2)+G("е",e)+e}return _(u,["земли","петли","пли","вли"])?T(S)+"ель":S+"ь"}return c()}}
exports.CASES=e,exports.Case=t,exports.Engine=class{sd=function(){let e;const t=new F;function n(n,r){
const s=r.split(",");for(let r of s)e.text=r,t.put(e,n)}return e={pluraleTantum:!0},n("SSSSSSS-SSSSSS","ножны"),e={
gender:r.MASCULINE
},n("SSSSSSS-SSSSSS","брёх,дёрн,идиш,имидж,мед,упрёк"),n("SSSSSSS-EEEEEE","адрес,век,вечер,город,детдом,поезд,спецсчёт,субсчёт"),
n("SSSSSSE-EEEEEE","берег,бок,вес,лес,снег,дом,катер,счёт,мёд"),n("SSSSSSS-bbbbbb","вексель,ветер"),
n("SSSSSSE-ESEEEE","глаз"),n("SSSSSSE-bEEbEE","год"),n("SSSSSSb-bbbbbb","цех"),n("SbbSbbb-bbbbbb","грош,шприц"),
n("SssSsss-ssssss","кишмиш,кряж,слеш,слэш"),n("SEESeEE-EEEEEE","стеллаж"),n("SeeSeee-eeeeee","шиномонтаж"),e={
gender:r.MASCULINE,animate:!0},n("Sssssss-ssssss","паныч"),n("SSSSSSS-SSSSSS","балансёр,шофёр"),e={gender:r.NEUTER},
n("EEEEEEE-SsESEE","плечо"),
n("EEEEEEE-SSSSSS","тесло,стекло,автостекло,бронестекло,оргстекло,пеностекло,смарт-стекло,спецстекло,бедро,берцо,блесна,чело,стегно,стебло"),
e={gender:r.FEMININE},n("EEEbEEE-SSESEE","щека"),n("EEEEEEE-SSESEE","слеза"),n("EEEEEEE-SESSSS","семья,макросемья"),
n("EEEEEEE-SEESEE","вожжа,свеча"),n("EEESEEE-SSSSSS","душа"),n("EEEEEEE-eEeeee","скамья"),
n("EEEEEEE-EEEEEE","башка,кишка,ладья,лапша,моча,пыльца,статья"),e={gender:r.FEMININE,animate:!0},
n("EEEEEEE-SESESS","свинья,овца"),e={gender:r.COMMON,animate:!0},n("EEEEEEE-SSSSSS","судья"),
n("EEEEEEE-EEEEEE","левша"),t}();decline(e,t,n){return function(e,t,n,r){const s=function(e,t,n,r){const s=t.text()
;if(t.isIndeclinable())return s;if(t.isPluraleTantum())return nt(e,t,n,s);if(r)return nt(e,t,n,r)
;switch(t.getDeclension()){case-1:return s;case 0:return ce(e,t,n);case 1:return Ce(e,t,n);case 2:return Ee(e,t,n)
;case 3:return ae(e,t,n)}}(e,t,n,r);if(s instanceof Array)return s;return[s]}(this,w.create(e),t,n)}pluralize(e){
const t=w.create(e);return t.isPluraleTantum()?[t.text()]:Pe(this,t)}getLocativeForms(e){
const t=this,n=w.create(e),r=n.getDeclension();if(r&&r>=0){const e=Se.get(le(n))
;if(e instanceof Array)return e.map(e=>new s(function(e){switch(1+(e>>3&7)){case a.V:return"в";case a.VO:return"во"
;case a.NA:return"на"}}(e),function(e,t,n,r){switch(t){case 0:return ce(e,n,Case.PREPOSITIONAL);case 1:return we(e,n,r)
;case 2:return Ee(e,n,Case.PREPOSITIONAL);case 3:return ae(e,n,Case.PREPOSITIONAL)}}(t,r,n,E(e)),e>>6))}return[]}},
exports.Gender=r,exports.Lemma=w,exports.LocativeForm=s,exports.LocativeFormAttribute=i,exports.StressDictionary=F,
exports.createLemma=function(e){return w.create(e)},exports.createLemmaOrNull=function(e){return w.createOrNull(e)};
//# sourceMappingURL=RussianNouns.cjs.map
