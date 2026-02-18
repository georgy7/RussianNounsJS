/*!
  RussianNounsJS v3.0.0-alpha.0
  Copyright (c) 2011-2026 Georgy Ustinov
  Released under the MIT license
*/
const e=Object.freeze(["именительный","родительный","дательный","винительный","творительный","предложный","местный"]),t=Object.freeze({
NOMINATIVE:e[0],GENITIVE:e[1],DATIVE:e[2],ACCUSATIVE:e[3],INSTRUMENTAL:e[4],PREPOSITIONAL:e[5],LOCATIVE:e[6]
}),n=Object.freeze(["женский","мужской","средний","общий"]),r=Object.freeze({FEMININE:n[0],MASCULINE:n[1],NEUTER:n[2],
COMMON:n[3]});function s(e,t,n){this.preposition=e,this.word=t,this.attributes=n}const i=Object.freeze({CONTAINER:1,
LOCATION:2,STRUCTURE:4,SURFACE:8,WAY:16,OBJECT_WITH_FUNCTIONAL_SURFACE:32,SUBSTANCE:64,RESOURCE:128,CONDITION:256,
EXPOSURE:512,MOTION:1024,EVENT:2048,WITH_ADJECTIVE:4096,WITHOUT_ADJECTIVE:8192,RELIGIOUS:16384}),u=Object.freeze({
PREPOSITIONAL:1,U_SUFFIX:2}),c=Object.freeze({V:1,VO:2,NA:3});function a(e,t,n){return n<<6|(e-1&7)<<3|t-1&7}
function E(e){return 1+(7&e)}function h(e){const t=e.replaceAll("ё","е");let n=t.length%2,r=1,s=5381;function i(){
s=(33*s+(255&n))%4294967296,n>>=8,r-=8}for(let e of t){const t=e.charCodeAt(0)-1072&31;n|=t<<r,r+=5,r>=8&&i()}r>0&&i()
;const u=t.charCodeAt(0)%2;return 2*(2147483647&s)+u}function f(e){let t=new Array(e.length)
;for(let n=0;n<e.length;n++){let r=e.charCodeAt(n);r>=1040&&r<=1071?r+=32:r>=1024&&r<=1039&&(r+=80),t[n]=r}
return String.fromCharCode.apply(null,t)}function o(e){const t=e.charCodeAt(0)-1072;return 33===t?32:t===(31&t)?1<<t:0}
function l(e,t){return 0!==(e&o(t))}const S=3892855073,d=66567902,I=66567390;function A(e){return l(S,f(e))}
function N(e,t){return t===t.toUpperCase()?e.toUpperCase():e}function O(e){return e.split("").filter(A).length}
function T(e){return e.replaceAll("ё","е").replaceAll("Ё","Е")}function p(e,t){return e.substring(0,e.length-t)}
function g(e,t){return e.substring(e.length-t)}function C(e){return p(e,1)}function W(e){return g(e,1)}function b(e,t){
const n=e.length-t-1;return e.substring(n,n+1)}function _(e,t){return t.some(t=>e.endsWith(t))}function w(e,t,n){
return(e.length?e:[!1]).map(e=>n(e?T(t):t,e))}class U{constructor(e){e instanceof U?(this._txt=e._txt,this._lc=e._lc,
this._hash=e._hash,this._flags=e._flags):(e.pluraleTantum?this._flags=5:this._flags=1+n.indexOf(e.gender),
this._txt=e.text,this._lc=e.text.toLowerCase(),this._hash=h(this._lc),this._flags|=8*(1&e.indeclinable),
this._flags|=16*(1&e.animate),this._flags|=32*(1&e.surname),this._flags|=64*(1&e.name),this._flags|=128*(1&e.transport),
this._flags|=65536*(2+function(e,t,n,s){if(t)return-2;if(s)return-1;const i=W(e);switch(n){case r.FEMININE:
return"а"===i||"я"===i?2:l(d,i)?-1:3;case r.MASCULINE:return"а"===i||"я"===i?2:"путь"===e?0:1;case r.NEUTER:
return["дитя","полудитя"].includes(e)?0:"мя"===g(e,2)?3:1;case r.COMMON:return"а"===i||"я"===i?2:"и"===i?-1:1;default:
return-2}}(this._lc,e.pluraleTantum,e.gender,e.indeclinable)))}static create(e){if(e instanceof this)return e
;const t=R(e);if(t)throw new Error(t);return Object.freeze(new this(e))}static createOrNull(e){
return null===R(e)?Object.freeze(new this(e)):null}equals(e){
return e instanceof U&&this._flags===e._flags&&this.lower()===e.lower()}text(){return this._txt}lower(){return this._lc}
isPluraleTantum(){return 5==(7&this._flags)}getGender(){const e=7&this._flags;if(e>=1&&e<=4)return n[e-1]}
isIndeclinable(){return!!(8&this._flags)}isAnimate(){return!!(16&this._flags)||this.isASurname()||this.isAName()}
isASurname(){return!!(32&this._flags)}isAName(){return!!(64&this._flags)}isATransport(){return!!(128&this._flags)}
getDeclension(){return(this._flags>>16)-2}getSchoolDeclension(){const e=this.getDeclension();return 1===e?2:2===e?1:e}}
function m(e,t){const n=new U(e);return n._txt=t,n._lc=t.toLowerCase(),n._hash=h(n.lower()),Object.freeze(n)}
function R(e){if(null==e)return"No parameters specified."
;for(let t of["pluraleTantum","indeclinable","animate","surname","name","transport"]){
if((e=>null!=e&&"boolean"!=typeof e)(e[t]))return t+" must be boolean."}
if(null==e.text)return"A cyrillic word required.";if(!e.pluraleTantum){
if(null==e.gender)return"A grammatical gender required.";if(!n.includes(e.gender))return"Bad grammatical gender."}
return null}function M(e){return U.create(e)}function L(e){return U.createOrNull(e)}function V(e){const t=new Set
;let n=0;for(let r of e)n+=r,t.add(n);return t}
const P=V([11720389,548,1024,1479,2622,2867,1222,2642,264,1328,137,123,397,65542229,212447047,31729170,8094836,1056,21701789,35520559,40358,21819,28248,119786,63892,31809,7356,74383,72369,5945,28902,90120738,21187517,91925642,3054826,1600765,65934,30948851,5569212,4205640,5412804,6787095,9749916,3940084,1511466,1303038,16090470,1376628,49919694,3827522,37915959,14032615,28701924,224587434,637275762,51079457,391103676,24108070,158999424,232633267,6058815,66599250,692781441,816204112,55209380,72754,90006,80058,45564,67845,42548,27193,21401,139393,750335,170896,4424,1566,6264,154969,17292,17229,175112,83011,117872,4183,13065,108972,108088,343663,66210,334,17090,380271,283272,59007,35796,230801,1067156,19992,157124,12433,252644,2626,23776,630482,531296,304718,90891,726,23116,47653,30493,167310,50156,123071,477118,241821,55660,908992,534269,205157,11218,2490,660,66391,46856,847526,68710,8450,36630,15642,109864,41716,354482,79820,51876,97325,5506,46436,191803,3957,40876,126323,2347821,338490,73216,475569,87602,29642,4220,10760,16896,50156,17424,35178,167244,126786,33643,30488,65045,35961,51453,55660,4,152461,138332,1958,34200,3709,61381,17424,30158,80591,11218,44099,260487]),x=V([11720389,548,1024,1060,4,5904,1848,4404,330555234,4691346,3365076,1045362,7414584,960432,10564312,253286,16178203,4357,4355,11350,31120,5248,40591,62367,54057,50487,13069,3664,39764,10263,3002,5810,8844,24551,4091,56761,21785,30553,55147139,15960625,1933097,12258067,16302047,54210486,45688435,1659767,4813249,33577763,2501798,10056946,672528,14209351,2012340,1655412,4652736,62568,148698,21186,71129124,260014161,108045611,1007583269,2026464,22799532,750068913,1499532,1285428194,74598,22348,6599,132273,309821,156816,397448,179394,148036,100257,21779,11218,36631,345954,50442,104394,2724,112115,30690,10552,31377,11286,7168,14612,51480,116537,192258,163145,65604,97951,1363157,212810,431243,2622,425588,275284,150351,570568,244701,16659,26136,130134,11040,159389,728373,3476,726,1290392,224730,189158,11218,2490,10750,21608,143747,65974,664563,84036,16283,17424,5758,45080,33066,1782,90658,37101,56107,233163,14216,5518,179264,2525,146957,111342,80594,2309,4217,25432,26905,29980,518951,1458289,523705,4202,477865,149368,126310,47828,212678,22744,269176,179119,4399,35997,69696,41777,41,127336,4202,73153,46372,114255,126869,23630,11218])
;class F{constructor(){this._filter=new Uint8ClampedArray(256)}addInteger(e){this.addRaw(j(e))}hasInteger(e){
return this.hasRaw(j(e))}addRaw(e){const t=2047&e,n=t>>>3;this._filter[n]=this._filter[n]|1<<7-t%8}hasRaw(e){
const t=2047&e;return!!(this._filter[t>>>3]>>>7-t%8&1)}clone(){return function(e){const t=new F
;return t._filter=Uint8ClampedArray.from(e),t}(this._filter)}}function j(e){return e>>>22&2047^e>>>11&2047^2047&e}
function y(e){const t=e.padStart(3,"а");return(7&t.charCodeAt(0))<<8|(15&t.charCodeAt(1))<<4|15&t.charCodeAt(2)}
const z=function(){const e=new F;return P.forEach(t=>e.addInteger(t)),x.forEach(t=>e.addInteger(t)),Object.freeze(e)}()
;function D(){const t=new Map,n=z.clone(),s=function(e){return 4294967296*(31&e._flags)+e._hash},i=function(e){
return e.lower().indexOf("ё")+1&255},u=e=>{const n=65504&e._flags,r=(e=>{const n=s(e),r=t.get(n)
;return r instanceof Array?r:[]})(e).filter(e=>(e[0]&n)<=n),u=r.filter(t=>t[0]>>16===i(e))
;return u.length?u[0][1]:r.length?r[0][1]:void 0};this.put=function(e,r){
const u=r.split("-"),c=(e,t)=>e.length!==t||e.split("").some(e=>!"SsbeE".includes(e))
;if(2!==u.length||c(u[0],7)||c(u[1],6))throw new Error("Bad settings format.");const a=U.create(e),E=s(a);let h=t.get(E)
;h instanceof Array||(h=[],t.set(E,h));const f=65535&a._flags|i(a)<<16,o=h.find(e=>f===e[0]);o?o[1]=r:h.push([f,r]),
n.addInteger(a._hash)};const c=e=>{switch(e){case"E":return[!0];case"e":return[!0,!1];case"b":case"s":return[!1,!0]
;default:return[!1]}};this.hasStressedEndingSingular=function(t,s){if(n.hasInteger(t._hash)){const n=e.indexOf(s)
;if(n>=0){let e=u(t);if(e){const t=e.split("-")[0];return c(t[n])}if(t.getGender()===r.MASCULINE){
if(P.has(t._hash))return c("SEESEEE"[n]);if(x.has(t._hash))return c("SEEEEEE"[n])}}}return[]},
this.hasStressedEndingPlural=function(t,s){if(n.hasInteger(t._hash)){const n=e.indexOf(s);if(n>=0&&n<6){let e=u(t)
;if(e){const t=e.split("-")[1];return c(t[n])}
if(t.getGender()===r.MASCULINE&&(P.has(t._hash)||t.isAnimate()&&x.has(t._hash)))return c("E")}}return[]}}function k(e){
let t=new Map;for(let n of e){let e=t;for(let t=n.length-1;t>=0;t--){const r=n.charCodeAt(t);if(t>0){const t=e.get(r)
;if(0===t)break;void 0===t&&e.set(r,new Map),e=e.get(r)}else e.set(r,0)}}return t}function G(e,t){let n=t
;for(let t=e.length-1;t>=0;t--){const r=e.charCodeAt(t);if(!n.has(r))return!1;{const e=n.get(r);if(0===e)return!0;n=e}}}
const B=k(["ое","нький","ский","ской","лстой","отой","утой","евой","овой","живой"]),H=k(["ее","ое","нький","ский","ской","лстой","отой","утой"]),J=k(["евой","овой","отой","живой"]),v=k(["шний","жний","щий","ший","жий","чий"]),X=["божий","ажий","яжий","ужий","южий","бульдожий","кабарожий","медвежий","носорожий","миножий"],Y=k(X),q=k(X.map(e=>p(e,2)+"ьи")),K=new Set(["бубен","бугор","ветер","вошь","вымысел","горшок","деготь","дёготь","дятел","домысел","замысел","кашель","коготь","лапоть","лоб","локоть","ломоть","молебен","мох","ноготь","овен","пепел","пес","пёс","петушок","помысел","порошок","промысел","псалом","пушок","ров","рожь","рот","сон","стебель","стишок","угол","умысел","хребет","церковь","шов","ковер","овес","костер"].map(h)),Q=new F
;K.forEach(e=>Q.addInteger(e))
;const Z=k(["овёс","ковёр","костёр","шатер","шатёр","козел","козёл","котел","котёл","орел","орёл","осел","осёл","узел","уголь","чок","ешок","хол"])
;function $(e,t){const n=W(t);if(l(-402111711,n)){if(l(S,b(t,1))){const n=p(e,2);return G(t,Y)?n+N("ь",n):n}
if("й"!==n)return C(e)}return e}const ee=["ясень","бюллетень","олень","тюлень","гордень","пельмень","ячмень"]
;function te(e,t,n){const s=e.text(),i=W(t),u=o(i);let c;return-133667019&u&&(-402111711&u?c=function(e,t,n){
const r=b(t,1);return"ь"===r||"о"===n&&l(2504708,r)?C(e):$(e,t)}(s,t,i):"к"===i?c=function(e,t,n){
return e.length>=4&&_(t,["рёк","нёк","лёк"])&&!1!==n?p(e,2)+"ьк":t.endsWith("ёк")&&l(S,b(t,2))?p(e,2)+"йк":void 0
}(s,t,n):"ь"===i?c=function(e,t,n){
return K.has(e._hash)||G(n,Z)?p(t,3)+b(t,1):n.endsWith("ень")&&e.getGender()===r.MASCULINE&&!_(n,ee)?p(t,3)+"н":C(t)
}(e,s,t):(["лёд","лед","лён"].includes(t)||"лев"===t&&e.isAnimate())&&(c=p(s,2)+N("ь",b(s,1))+W(s))),
c||(c=function(e,t,n){
return!!(199680&n)&&G(t,Z)&&!["новосел","новосёл"].includes(t)||!!(2571270&n)&&(Q.hasInteger(e._hash)&&K.has(e._hash)||e.isAnimate()&&t.endsWith("посол"))
}(e,t,u)?p(s,2)+W(s):s),c}function ne(e,t){const n=C(e),r=C(t.lower());if("а"===W(r))return n
;if(_(r,["зне","жне","гре","спе","мудре"])||g(C(r),3).split("").every(e=>l(I,e))||t.isAName())return n
;if("ле"===g(r,2)){const e=b(r,2);return l(S,e)||"л"===e?C(n)+"ь":n}
return l(S,W(r))&&"и"!==W(r)?l(S,W(C(r)))?p(e,2)+"й":_(t.lower(),["месяц"])?n:p(e,2):n}
const re=k(["лапоток","желток","нишок","ришок","ишек"]),se=["поток","приток","переток","проток","биоток","электроток","восток","водосток","водоток","воток","знаток"],ie=["инок","исток","обморок","порок","пророк","сток","урок"]
;function ue(e){
return _(e,["чек","шек"])&&e.length>=6||G(e,re)||e.endsWith("ок")&&!e.endsWith("шок")&&!ie.includes(e)&&!_(e,se)&&!l(S,b(e,2))&&(l(S,b(e,3))||_(p(e,2),["ст","рт"]))&&e.length>=4
}const ce={"дочь":"дочерь","мать":"матерь"};function ae(e,n,r){const s=n.text(),i=n.lower()
;if(![t.NOMINATIVE,t.ACCUSATIVE].includes(r)&&Object.keys(ce).includes(i)){return ae(e,m(n,ce[i]),r)}let u=te(n,i)
;if(function(e){return e.endsWith("полночь")||e.startsWith("пол")&&l(134217984,W(e))&&O(e)>=2
}(i)&&(u="полу"+u.substring(3)),"мя"===g(i,2))switch(r){case t.NOMINATIVE:case t.ACCUSATIVE:return s;case t.GENITIVE:
case t.DATIVE:case t.PREPOSITIONAL:case t.LOCATIVE:return u+"ени";case t.INSTRUMENTAL:return u+"енем"}else switch(r){
case t.NOMINATIVE:case t.ACCUSATIVE:return s;case t.GENITIVE:case t.DATIVE:case t.PREPOSITIONAL:case t.LOCATIVE:
return u+"и";case t.INSTRUMENTAL:return _(i,["вошь","рожь","церковь"])?s+"ю":u+"ью"}}function Ee(e,n,r){
const s=n.text(),i=n.lower();if(i.endsWith("путь"))return r===t.INSTRUMENTAL?C(s)+"ём":ae(e,n,r)
;if(!i.endsWith("дитя"))throw new Error("unsupported");switch(r){case t.NOMINATIVE:case t.ACCUSATIVE:return s
;case t.GENITIVE:case t.DATIVE:case t.PREPOSITIONAL:case t.LOCATIVE:return s+"ти";case t.INSTRUMENTAL:
return[s+"тей",s+"тею"]}}function he(e,n,r){
const s=n.text(),i=n.lower(),u=te(n,i),c=f(u),a=C(s),E=C(i),h=()=>"я"===W(i),o=()=>i.endsWith("ая")&&!(2===O(s)||l(S,W(c))),d=()=>i.endsWith("яя")&&!(2===O(s)||l(S,W(c))),I=["жая","шая"]
;switch(r){case t.NOMINATIVE:return s;case t.GENITIVE:
return d()||_(i,I)?u+"ей":o()?u+"ой":n.isASurname()&&!i.endsWith("да")?a+"ой":i.endsWith("ничья")?a+"ей":h()||l(60818504,W(c))?a+"и":a+"ы"
;case t.DATIVE:
return d()||_(i,I)?u+"ей":o()?u+"ой":n.isASurname()&&!i.endsWith("да")?a+"ой":"ия"===g(i,2)?a+"и":i.endsWith("ничья")?a+"ей":a+"е"
;case t.ACCUSATIVE:return o()?u+"ую":d()?u+"юю":h()?a+"ю":a+"у";case t.INSTRUMENTAL:
return d()||_(i,I)?u+"ею":o()?[u+"ой",u+"ою"]:h()||"жшчщц".includes(W(c))&&!e.sd.hasStressedEndingSingular(n,r).includes(!0)?"и"===W(E)?a+"ей":[a+"ей",a+"ею"]:[a+"ой",a+"ою"]
;case t.PREPOSITIONAL:case t.LOCATIVE:
return d()||_(i,I)?u+"ей":o()?u+"ой":n.isASurname()&&!i.endsWith("да")?a+"ой":"ия"===g(i,2)?a+"и":i.endsWith("ничья")?a+"ей":a+"е"
}}const fe=k(["ов","ев","ёв","ин","ын"]),oe=function(e,t){let n=t;for(let t=0;t<e.length;t++){
const r=e.charCodeAt(t),s=n;n=new Map,n.set(r,s)}return n}("ы",fe);function le(e){
return e.filter((t,n)=>e.indexOf(t)===n)}function Se(e){const t=1&e.lower().includes("ё")
;return 4294967296*((65535&e._flags)<<1|t)+e._hash}const de=Object.freeze(function(){const e=new Map,t=Object.freeze({
gender:r.MASCULINE}),n=Object.freeze({gender:r.MASCULINE,animate:!0});function s(t,n,r,s,i){
const c=s.split(","),E=i instanceof Array?i:[u.U_SUFFIX];for(let s of c){const i=Object.assign({},t);i.text=s
;const u=Se(U.create(i));let c=e.get(u);c||(c=[],e.set(u,c));for(let e of r)for(let t of E)c.push(a(e,t,n))}}
const E=Object.freeze([c.V]),h=Object.freeze([c.VO]),f=Object.freeze([c.NA])
;s(t,i.CONTAINER,E,"мозг,пруд,стог,таз,год"),s(t,i.CONTAINER,h,"рот"),s(t,i.WAY,E,"год"),s(t,i.CONTAINER,E,"гроб"),
s(t,i.CONTAINER|i.RELIGIOUS,h,"гроб",[u.PREPOSITIONAL]),
s(t,i.LOCATION,E,"ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,низ,хлев"),
s(t,i.STRUCTURE,E,"круг,полк,артполк,ряд,род,строй,лад"),s(t,i.SURFACE,f,"баз,берег,бережок,вал,кон,круг,луг,пол,яр"),
s(t,i.WAY,f,"век,день"),s(t,i.WAY,E,"час"),s(t,i.WAY,f,"корень"),s(n,i.OBJECT_WITH_FUNCTIONAL_SURFACE,f,"вор"),
s(t,i.OBJECT_WITH_FUNCTIONAL_SURFACE,f,"повод,бочок,борт,воз,горб,кол,мост,плот,сук,х"+String.fromCharCode(1091)+"й"),
s(t,i.OBJECT_WITH_FUNCTIONAL_SURFACE,f,"крюк,болт",[u.PREPOSITIONAL,u.U_SUFFIX]);const o=",мёд,мех,пар,пух"
;s(t,i.SUBSTANCE,E,"дым,жир,мел,пушок"+o),
s(t,i.RESOURCE,f,"газ,клей,спирт"+o),s(t,i.CONDITION,E,"бой,бред,быт,долг,плен,пыл,сок,ход,лад"),
s(t,i.EXPOSURE,E.concat(f),"вид"),s(t,i.EXPOSURE,f,"слух,счёт,ветер,ветр,свет"),s(t,i.MOTION,f,"ход,бег,вес"),
s(t,i.MOTION|i.WITH_ADJECTIVE,f,"шаг"),s(t,i.EVENT,f,"бал,пир"),s(t,i.CONDITION,f,"дух,плав"),
s(t,i.MOTION|i.WITH_ADJECTIVE,f,"газ"),s(t,i.CONTAINER,E,"глаз,зоб,нос,шкаф"),s(t,i.CONTAINER,h,"лоб"),
s(t,i.OBJECT_WITH_FUNCTIONAL_SURFACE,f,"глаз,лоб,нос,шкаф,холм");let l="бок,верх,зад,угол";return s(t,i.LOCATION,E,l),
s(t,i.OBJECT_WITH_FUNCTIONAL_SURFACE,f,l),s(t,i.LOCATION|i.WITHOUT_ADJECTIVE,E,"край"),
s(t,i.OBJECT_WITH_FUNCTIONAL_SURFACE|i.WITHOUT_ADJECTIVE,f,"край"),s(t,i.SURFACE,f,"лёд,мох,снег"),
s(t,i.SUBSTANCE,h,"лёд,лён,мох"),s(t,i.SUBSTANCE,E,"снег"),e
}()),Ie=new Set("клей,чай,дом,дух,дым,дымок,газ,год,горошек,жар,жир,квас,пар,пыл,род,рост,сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,табак,творог,толк,торф,туман,убыток,укроп,уксус,ход,цемент,чеснок,шаг,шик,шиповник,шоколад,шорох,шум,яд".split(",")),Ae=new F
;Ie.forEach(e=>Ae.addInteger(h(e)))
;const Ne=k(["й","ие","иё"]),Oe=k(["воробей","муравей","ручей","соловей","улей"]),Te=k(["мой","ной","дой","шой","жой","рзой","осой","хой","латой","витой","литой","питой","житой","отой","утой","ятой","лагой","рагой","огой","угой","лубой","любой","илой","ылой","злой","малой","овой","евой","живой","ской","акой","укой","нний","ский","йкий","цкий","зкий","ткий","лкий","мкий","хкий","оркий","аркий","яркий","ький","ёкий","бокий","оокий","cокий","токий","ликий","дикий","укий","ыкий","який","пкий","дкий","бкий","нкий","жкий","чкий","гкий","овкий","авкий"])
;function pe(e,t){return"ый"===g(t,2)||(t.endsWith("кривой")||G(t,Te))&&O(t)>=2}
const ge=k(["ий","ие","чье","тье","дье","вье","бье","жалованье","енье","ружье","божье","верье","мужье"]),Ce=k(["вое","лое","мое","ное","рое","тое","той","ый"])
;function We(e,n,s){const i=n.text(),u=f(i),c=W(u),a=n.getGender(),h=e.sd.hasStressedEndingSingular(n,s)
;let o=te(n,u,h[0]),l=C(i);const S=_e(u);S&&(o="полу"+o.substring(3),l="полу"+l.substring(3));let d=f(o)
;const I=()=>S&&u.endsWith("я")||Ue(u),A=G(u,Ne),O=()=>G(u,Oe)?C(l)+N("ь",W(l)):l,T=()=>"чщ".includes(W(d))
;function p(e){
return!n.isAnimate()&&Ae.hasInteger(n._hash)&&Ie.has(u)&&("й"===c?e.push(C(i)+N("ю",W(i))):e=e.concat(w(h,o,e=>e+N("у",W(e))))),
e}switch(s){case t.NOMINATIVE:return i;case t.GENITIVE:switch(c){case"и":case"ы":if(S)return be(e,n,s,u);break;case"й":
case"е":if(A&&n.isASurname()||pe(0,u)||G(u,B))return o+"ого";if(G(u,v)||u.endsWith("ее"))return o+"его";case"ё":case"я":
case"ь":if(A){return p([O()+"я"])}if(I()&&!T())return o+"я";break;case"ц":return ne(i,n)+"ца";case"к":
if(ue(u))return C(l)+"ка";break;case"о":if(_(u,["шко"])&&r.MASCULINE===a)return l+"и"}let f
;return f=n.isASurname()||-1===d.indexOf("ё")?[o+"а"]:w(h,o,e=>e+"а"),p(f);case t.DATIVE:switch(c){case"и":case"ы":
if(S)return be(e,n,s,u);break;case"й":case"е":if(A&&n.isASurname()||pe(0,u)||G(u,B))return o+"ому"
;if(G(u,v)||u.endsWith("ее"))return o+"ему";case"ё":case"я":case"ь":if(A)return O()+"ю";if(I()&&!T())return o+"ю";break
;case"ц":return ne(i,n)+"цу";case"к":if(ue(u))return C(l)+"ку"}
return n.isASurname()||-1===d.indexOf("ё")?o+"у":w(h,o,e=>e+"у");case t.ACCUSATIVE:
return a===r.NEUTER||"иы".includes(c)&&S?i:n.isAnimate()?We(e,n,t.GENITIVE):i;case t.INSTRUMENTAL:switch(c){case"и":
case"ы":if(S)return be(e,n,s,u);break;case"й":case"е":case"ё":case"я":case"ь":
if(A&&n.isASurname()||G(u,H))return G(u,Ce)?o+"ым":o+"им";if(pe(0,u))return"и"===b(u,1)||u.endsWith("хой")?o+"им":o+"ым"
;if(G(u,J))return o+"ым";if(G(u,v))return o+"им";if(A)return O()+"ем";if(u.endsWith("це"))return i+"м";break;case"ц":
return w(h,i,(e,t)=>t?ne(e,n)+"цом":ne(e,n)+"цем");case"к":if(ue(u))return C(l)+"ком";break;case"н":case"в":
if(n.isASurname()&&G(u,fe))return i+"ым"}
return I()||"жшчщ".includes(W(d))?w(h,o,(e,t)=>t?e+"ом":e+"ем"):n.isASurname()||-1===d.indexOf("ё")?o+"ом":w(h,o,e=>e+"ом")
;case t.LOCATIVE:if("полпути"===u)return i;const U=de.get(Se(n));if(U){return le(U.map(e=>E(e))).map(t=>we(e,n,t))}
case t.PREPOSITIONAL:switch(c){case"и":if("полпути"===u)return i;case"ы":if(S)return be(e,n,s,u);break;case"й":case"е":
case"ё":case"я":case"ь":if(A&&n.isASurname()||pe(0,u)||G(u,B))return o+"ом";if(G(u,v)||u.endsWith("ее"))return o+"ем"
;if(_(u,["воробей"])){const e=C(l);return e+N("ье",W(e))}
if(G(u,ge)&&!_(u,["запястье","здоровье","изголовье","платье"]))return l+"и";if("й"===c||"иё"===g(u,2))return O()+"е"
;break;case"ц":return ne(i,n)+"це";case"к":if(ue(u))return C(l)+"ке"}
return n.isASurname()||-1===d.indexOf("ё")?o+"е":w(h,o,e=>e+"е")}}function be(e,t,n,r){
const s=()=>"полминуты"!==r?"полу"+t.text().substring(3):t.text();if("полпути"===r){return Ee(e,m(t,C(s())+"ь"),n)}
if(r.endsWith("зни")||r.endsWith("сти")){return ae(e,m(t,C(s())+"ь"),n)}
return he(e,m(t,C(s())+("ни"===g(r,2)?"я":"а")),n)}function _e(e){
if(e.startsWith("пол")&&l(2550137089,W(e))&&"л"!==e[3]&&O(e)>=2){let t=e.substring(3),n=t.search(/[а-яё]/)
;return n>=0&&l(d,t[n])}return!1}function we(e,n,r){if(u.U_SUFFIX===r){const e=n.text(),t=n.lower();let r=te(n,t),s=C(e)
;const i=_e(t)&&t.endsWith("я")||Ue(t);return"й"===W(t)?T(s)+"ю":i?T(r)+"ю":ue(t)?T(C(s))+"ку":T(r)+"у"}
if(u.PREPOSITIONAL===r)return We(e,n,t.PREPOSITIONAL)}function Ue(e){
return"ь"===W(e)&&!e.endsWith("господь")||"её".includes(W(e))&&!_(e,["це","же"])}
const me=new F,Re=Object.freeze([[[r.MASCULINE,void 0],{"болгарин":["болгары"],"господин":["господа"],
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
;for(const e of Re)Object.keys(e[1]).map(e=>me.addInteger(h(e)))
;const Me=["зять","деверь","друг","брат","собрат","стул","брус","обод","полоз","струп","подмастерье","якорь","перо","шило"],Le=new Set(["берег","бок","борт","век","вес","веер","вексель","вечер","глаз","голос","город","доктор","дом","детдом","егерь","жемчуг","катер","колокол","концлагерь","корм","короб","кузов","купол","лес","луг","мастер","номер","пояс","провод","рог","сахар","снег","сорт","стог","счет","счёт","спецсчет","спецсчёт","субсчет","субсчёт","терем","том","холод","цвет","череп"]),Ve=k(["округ","остров","отпуск","паспорт","парус","поезд","повар","погреб","рукав","цех","юнкер"]),Pe=new Set(["адрес","договор","буфер","ворох","директор","инспектор","инструктор","корпус","крейсер","орден","ордер","прожектор","пропуск","род","свитер","сервер","тенор","тон","трактор","тормоз","ветер","верх","китель","мех","хлеб","юнкер","ястреб"]),xe=new Set(["бункер","вымпел","год","образ","омут","токарь","тополь","шторм","штуцер"])
;function Fe(e,n){const s=[],i=n.text(),u=f(i),c=e.sd.hasStressedEndingPlural(n,t.NOMINATIVE);Object.freeze(c)
;const a=te(n,u,c[0]),E=f(a);if(u.endsWith("яя"))return s.push(p(i,2)+"ие"),le(s);const h=r=>{
const s=e.sd.hasStressedEndingPlural(n,t.NOMINATIVE).map(e=>!e)
;return s.length?s.map(e=>e?1===E.replace(/[^её]/g,"").length?r((e=>{
const t=Math.max(e.toLowerCase().lastIndexOf("е"),e.toLowerCase().lastIndexOf("ё")),n=N("ё",e[t])
;return e.substring(0,t)+n+e.substring(t+1)})(a)):r(a):r(T(a))):[r(a)]
},o=n.getGender(),d=n.getDeclension(),I=("й"===W(u)||l(S,W(u)))&&l(S,W(C(u)))?C(i):a,A=()=>(u.endsWith("евич")||u.endsWith("евна"))&&u.indexOf("ье")>=0
;function O(){const e=I,t=f(e).indexOf("ье"),n=N("и",e[t]);return e.substring(0,t)+n+e.substring(t+1)}function U(){
l(60818504,W(E))||"яйь".includes(W(u))||_(u,["сосед"])?A()?(s.push(O()+"и"),
s.push(I+"и")):Array.prototype.push.apply(s,w(c,I,e=>e+"и")):"ц"===W(u)?s.push(ne(i,n)+"цы"):A()?(s.push(O()+"ы"),
s.push(I+"ы")):Array.prototype.push.apply(s,w(c,I,e=>e+"ы"))}if(me.hasInteger(n._hash))for(const[e,t]of Re){
const r=e[0],i=e[1];if(o===r&&(null==i||i===n.isAnimate())&&t.hasOwnProperty(u)){const e=t[u];for(let t of e)s.push(t)
;return le(s)}}const m="ь"===W(E)?a:"к"===W(E)?C(a)+"чь":"г"===W(E)?C(a)+"зь":"й"===W(u)?C(i):_(u,["рь","ль"])?a:a+"ь"
;switch(d){case-1:s.push(i);break;case 0:if("путь"===u)s.push("пути");else{
if(!u.endsWith("дитя"))throw new Error("unsupported");s.push(p(i,3)+"ети")}break;case 1:
if(Me.includes(u))s.push(m+"я");else if(r.MASCULINE===o){
const e=["крюк","лист","лоскут","повод","прут","сук","учитель","флигель","штабель"],t=["клин","колос","ком","край","соболь"]
;"сын"===u?(s.push("сыновья"),U()):"человек"===u?(s.push("люди"),U()):e.includes(u)||"соболь"===u&&n.isAnimate()?(U(),
s.push(m+"я")):t.includes(u)?s.push(m+"я"):Le.has(u)||G(u,Ve)||Pe.has(u)||xe.has(u)?(xe.has(u)&&U(),
Ue(u)?Array.prototype.push.apply(s,h(e=>e+"я")):c.includes(!0)?s.push(T(a)+"а"):s.push(a+"а"),
Pe.has(u)&&U()):(u.endsWith("анин")&&u.length>5||u.endsWith("янин"))&&!n.isAName()||["барин","боярин"].includes(u)?(s.push(p(i,2)+"е"),
"барин"===u&&s.push(p(i,2)+"ы")):["цыган"].includes(u)?s.push(i+"е"):"щенок"===u?(s.push(p(i,2)+"ки"),
s.push(p(i,2)+"ята")):!u.endsWith("ребёнок")&&!u.endsWith("ребенок")||u.endsWith("жеребёнок")||u.endsWith("жеребенок")||u.endsWith("ястребёнок")||u.endsWith("ястребенок")?(u.endsWith("ёнок")||u.endsWith("енок"))&&n.isAnimate()?s.push(p(i,4)+"ята"):u.endsWith("ёночек")&&n.isAnimate()?s.push(p(i,6)+"ятки"):u.endsWith("онок")&&"жшч".includes(b(u,4))&&n.isAnimate()?s.push(p(i,4)+"ата"):ue(u)?s.push(p(i,2)+"ки"):G(u,v)?_(u,X)?s.push(p(i,2)+"ьи"):s.push(C(i)+"е"):pe(0,u)?u.endsWith("ый")||u.endsWith("ий")?s.push(C(i)+"е"):u.endsWith("ой")&&!_(u,["хой","ской"])?s.push(p(i,2)+"ые"):s.push(p(i,2)+"ие"):u.endsWith("его")?s.push(p(i,3)+"ие"):["воробей","муравей","ручей","соловей","улей","жеребей","ирей","репей","чирей"].includes(u)?s.push(p(i,2)+"ьи"):U():s.push(p(i,7)+"дети")
}else if(r.NEUTER===o)if(_(u,["ко","чо"])&&!_(u,["войско","облако"]))s.push(C(i)+"и");else if(u.endsWith("имое"))s.push(a+"ые");else if(u.endsWith("ее"))s.push(a+"ие");else if(u.endsWith("ое"))_(E,["г","к","ж","ш","х"])?s.push(a+"ие"):s.push(a+"ые");else if(_(u,["ие","иё"]))s.push(p(i,2)+"ия");else if(_(u,["ье","ьё"])){
const e=p(i,2),t=["безделье","варенье","воскресенье","жалованье","запястье","застолье","затишье","здоровье","зелье","изголовье","новоселье","одночасье","печенье","платье","побережье","поголовье","подворье","подземелье","подполье","поместье","предплечье","раздумье","сиденье","средневековье","увечье","угодье","устье"].includes(u)
;"е"!==W(u)||t||s.push(e+"ия"),s.push(e+"ья")
}else _(u,["дерево","звено","крыло"])?s.push(a+"ья"):_(u,["ле","ре"])?s.push(a+"я"):u.endsWith("судно")&&n.isATransport()?s.push(p(i,2)+"а"):(Array.prototype.push.apply(s,h(e=>e+"а")),
_(u,["щупальце"])&&U());else s.push(a+"и");break;case 2:
"заря"===u?s.push("зори"):u.endsWith("ая")&&!u.endsWith("свая")?"жхчшщ".includes(W(E))||_(E,["вк","гк","ск","цк","ньк"])?s.push(a+"ие"):s.push(a+"ые"):U()
;break;case 3:
"мя"===g(u,2)?s.push(a+"ена"):Object.keys(ce).includes(u)?s.push(C(ce[u])+"и"):r.FEMININE===o?s.push(I+"и"):"и"===W(I)?s.push(I+"я"):s.push(I+"а")
}return le(s)}
const je=k(["ли","си","би","ви","ди","ти","пи","ри","ни","фи","зи","ьи","ья","ия","ря","ля","ая","аи","ои","уи","эи","ыи","яи","ёи","юи","еи","ии"]),ye=["беготни","болтовни","будни","вожжи","возни","доли","лапши","левши","люди","марли","моря","мощи","ноздри","пени","пятерни","распри","родни","сакли","сени","ступни","судьи","фигни","чукчи"],ze=["головы","громадины","детины","деревенщины","дохлятины","дубины","ехидины","жадины","зверины","идиотины","кислятины","молодчины","орясины","остолопины","сиротины","скотины","старейшины","старины","старшины","уродины"],De=k(ze),ke=["адреса","паспорта","поезда","цеха","снега","бункера","буфера","берега","вымпела","голоса","города","директора","договора","доктора","жемчуга","инспектора","инструктора","колокола","кондуктора","короба","корпуса","крейсера","кузова","леса","мастера","номера","облачка","острова","отпуска","паруса","повара","погреба","пояса","провода","прожектора","пропуска","рукава","сахара","свитера","сервера","счета","трактора","тормоза","холода","цвета","черепа","шторма","штуцера","юнкера","ястреба","суда","корм"],Ge=k(ke),Be=new Set(ke.concat(["бега","беглецы","близнецы","бойцы","бока","борта","борцы","бруствера","брюшки","веера","века","венцы","верха","веса","весы","вечера","вороха","глупцы","года","гонцы","дворцы","дельцы","детдома","детдомы","дома","жеребцы","жильцы","жрецы","затишки","зубцы","излишки","истцы","катера","концы","корма","кузнецы","купола","купцы","лишки","луга","мертвецы","меха","мудрецы","облака","образа","образцы","огурцы","округа","омута","ордена","ордера","отцы","очки","певцы","песцы","пловцы","подлецы","продавцы","птенцы","резцы","рога","рода","рубцы","самцы","свинцы","сорта","соуса","спецы","стога","столбцы","стрельцы","творцы","тельцы","тенора","терема","тома","тона","торцы","хлеба","штришки","юнцы"])),He=new Set(["авары","аланы","аршины","баклажаны","буквы","гольфы","граммы","гусары","дела","кадеты","килограммы","омы","помидоры","рентгены","ботинки","человеки","чулки","шорты"]),Je=new Set(["гектары","рельсы"]),ve=new F
;Be.forEach(e=>ve.addRaw(y(e))),He.forEach(e=>ve.addRaw(y(e))),Je.forEach(e=>ve.addRaw(y(e)))
;const Xe=new Set(ze.concat(["абазины","авы","аввы","бедняги","бедолаги","болгары","бродяги","брызги","брюки","брюхи","будды","бусы","валенки","веки","вельможи","верзилы","вилы","владыки","воеводы","волосы","вояки","главы","грузины","задворки","задиры","железы","жилы","зануды","зеваки","именины","калеки","кальсоны","каникулы","колготки","коллеги","крохи","курицы","куры","ладоши","ламы","лыки","макароны","мужчины","нападки","нары","непоседы","носилки","ножны","папы","папаши","таты","падлы","партизаны","погоны","поминки","посиделки","похороны","предтечи","работяги","разы","ребятки","румыны","самоубийцы","санки","убийцы","сапоги","сатаны","сироты","сливки","слуги","солдаты","старосты","сумерки","сутки","татары","телеса","хитрюги","четвереньки","шляпы","шмотки","яблоки","дядьки","дяденьки","зайки","кроссовки","малютки","малолетки","попки","турки","узы","хлопоты","шахматы"])),Ye=new F
;Xe.forEach(e=>Ye.addRaw(y(e)))
;const qe=["х","ых","их","м","ым","им","х","ых","их","ми","ыми","ими","х","ых","их"],Ke=["ям","ам","","","ями","ами","ях","ах"],Qe=k(["вна","вца","вцы","пла","дца","дра","судна","рки","рцы","тлы","рна","тна","енца","десны","дёсны","рёбра","ребра","сосны"]),Ze=k(["жи","ши","чи","ля","ли","чи","ри","ти","ди","сани","борщи","клещи","товарищи","плащи","прыщи","хрящи"]),$e=k(["братья","брусья","деревья","донья","звенья","клинья","клочья","коленья","колосья","колья","комья","крылья","крючья","листья","лоскутья","лохмотья","перья","платья","поводья","прутья","стулья","сучья","хлопья","шилья"]),et=k(["ишки","дружки","тки","папочки","дедушки","дядюшки","батюшки","катанки","петрушки","шестерки"]),tt=k(["жки","шки","чки","рки","натки","хатки","ятки","етки","чётки","мки","нки","педки","илки"]),nt=k(["шок","щок","жок","зок","аток","яток","еток"])
;function rt(t,n,s,i){const u=f(i),c=W(u),a=o(c),E=e.indexOf(s)+1;if(1===E||4===E&&!n.isAnimate())return i
;if(134217984&a)if(2===E||4===E){if(_(u,["овичи","евичи"]))return C(i)+"ей"
;if(_(u,["вны","полусотни"])&&"овны"!==u)return p(i,2)+"ен"}else if(5===E){
if(_(u,["дети","люди"])&&!_(u,["нелюди"]))return C(i)+"ьми";if(_(u,["вери","дочери"]))return[C(i)+"ями",C(i)+"ьми"]}
const h=n.getGender(),d=u.endsWith("цы")?C(i):$(i,u),A=G(u,oe)&&(n.isASurname()||h===r.COMMON)&&!G(u,De),O=3*Math.min(Math.round(qe.length/3-1),E-2)
;if(A||u.endsWith("ничьи"))return i+qe[O];if(u.endsWith("ые"))return p(i,2)+qe[O+1]
;if(u.endsWith("ие")||G(u,q))return d+qe[O+2];if(E>2&&4!==E){const e=2,r=e*Math.min(Math.round(Ke.length/e-1),E-3)
;return G(u,je)?C(i)+Ke[r]:t.sd.hasStressedEndingPlural(n,s).includes(!0)?T(d)+Ke[r+1]:d+Ke[r+1]}{
const e=n.getDeclension(),a=()=>{const e=f(d),r=["жки","шки","чки","ножны"]
;if(_(e,["кн","кл","дк","нк","пк","зк","рк","тк","вк","лк","мк"])&&!_(u,["сумерки"])||"зл"===e||_(u,r)&&t.sd.hasStressedEndingPlural(n,s).includes(!0)){
const e=W(d);return C(d)+N("о",e)+e}if(G(u,Qe)&&!u.endsWith("недра")||_(u,r)){const e=b(i,1);return p(i,2)+N("е",e)+e}
if(_(u,["сестры","сёстры","серьги"])){const e=b(i,1);return("ь"===b(u,2)?T(p(i,3)):T(p(i,2)))+N("ё",e)+e}
if(_(e,["льц","сьм","деньг","ьк","йк","дьб"])){const e=W(d);return p(d,2)+N("е",e)+e}
return _(u,["сла","слы"])?C(d)+"ел":d};if([3,0].includes(e)){if(u.endsWith("и"))return C(i)+"ей"
;if(["гроздья"].includes(u))return C(i)+"ев"}const E=b(u,2);if(r.FEMININE!==h){const e=y(u),t=ve.hasRaw(e)
;if(t&&Be.has(u))return C(i)+"ов";if(t&&He.has(u)&&!n.isAName())return[a(),C(i)+"ов"]
;if(t&&Je.has(u))return[C(i)+"ов",a()]
;if(h===r.COMMON&&!_(u,ye)&&!"жшч".includes(E)||Ye.hasRaw(e)&&Xe.has(u)||n.isAName()&&h===r.MASCULINE&&n.lower().endsWith("а")||"барин"===n.lower())return a()
;switch(c){case"и":case"я":
if(G(u,Ze)||"щи"===u||ye.includes(u)||n.lower().endsWith("ь")&&!_(n.lower(),["зять","деверь"])){
return("ь"===W(C(u))?p(i,2):C(i))+"ей"}
if("и"===c)return u.endsWith("ульи")?C(i)+"ев":u.endsWith("ьи")?r.MASCULINE===h?C(i)+"ёв":p(i,2)+"ей":["ча","кле","холу","ху"].includes(C(u))?C(i)+"ёв":u.endsWith("ищи")?a():u.endsWith("мессии")?C(i)+"й":l(S,b(u,1))?C(i)+"ев":!G(u,tt)||r.MASCULINE===h&&!G(T(u),et)||G(n.lower(),nt)?C(i)+"ов":a()
;if(G(u,$e))return C(i)+"ев";if(_(u,["зятья","кумовья","деверья","края","острия"]))return C(i)+"ёв"
;if(_(u,["ья","ия"]))return r.MASCULINE===h?p(i,2)+"ей":p(i,2)+"ий";break;case"а":
return _(u,["семена","стремена"])?p(i,3)+"ян":u.endsWith("мена")?p(i,3)+"ён":n.lower().endsWith("яйцо")?N("яиц",C(i)):u.endsWith("нца")?[a(),C(i)+"ев"]:G(u,Ge)?C(i)+"ов":a()
;case"ы":return _(u,["ницы","лицы","пицы","бицы"])?C(i):u.endsWith("цы")?C(i)+"ев":C(i)+"ов";default:
if(u.endsWith("не"))return a()}}if(u.endsWith("йки"))return p(i,3)+"ек";if(u.endsWith("ки")){if("ь"===E){const e=W(C(i))
;return p(i,3)+N("е",e)+e}if("жшч".includes(E))return a();if(l(I,E))return p(i,2)+"ок"}
if(ye.includes(u))return C(i)+"ей";if(_(u,["аи","ои","еи","эи","уи"]))return C(i)+"й"
;if("свечи"===u)return[C(i),C(i)+"ей"];if("пригоршни"===u)return[C(i)+"ей",p(i,2)+"ен"]
;if("тихони"===u)return[p(i,2)+"нь",C(i)+"ей"]
;if(_(u,["ьи","ии"]))return t.sd.hasStressedEndingSingular(n,s).includes(!0)?p(i,2)+"ей":p(i,2)+"ий"
;if(u.endsWith("ни")&&l(I,b(u,2)))return["барышни","боярышни","деревни"].includes(u)?p(i,2)+"ень":u.endsWith("кухни")?p(i,2)+"онь":"сотни"===u?[p(i,2),p(i,2)+"ен"]:p(i,2)+"ен"
;if(f(d).endsWith("ийк"))return p(d,2)+"ек";if(d.length===u.length-1&&G(u,je)){
if("ьй".includes(f(b(d,1)))&&!n.isAnimate()){const e=W(d);return p(d,2)+N("е",e)+e}
return _(u,["земли","петли","пли","вли"])?C(d)+"ель":d+"ь"}return a()}}class st{sd=function(){function e(e,t,n,r){
const s=r.split(",");for(let r of s){const s=Object.assign({},t);s.text=r,e.put(s,n)}}const t=new D,n=Object.freeze({
gender:r.MASCULINE}),s=Object.freeze({gender:r.MASCULINE,animate:!0}),i=Object.freeze({gender:r.FEMININE
}),u=Object.freeze({gender:r.FEMININE,animate:!0}),c=Object.freeze({gender:r.COMMON,animate:!0}),a=(r,s)=>e(t,n,r,s)
;return e(t,n,"SSSSSSS-SSSSSS","брёх,дёрн,идиш,имидж,мед,упрёк"),e(t,{pluraleTantum:!0},"SSSSSSS-SSSSSS","ножны"),
e(t,n,"SSSSSSS-EEEEEE","адрес,век,вечер,город,детдом,поезд,спецсчёт,субсчёт"),
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
const s=function(e,t,n,r){const s=t.text();if(t.isIndeclinable())return s;if(t.isPluraleTantum())return rt(e,t,n,s)
;if(r)return rt(e,t,n,r);switch(t.getDeclension()){case-1:return s;case 0:return Ee(e,t,n);case 1:return We(e,t,n)
;case 2:return he(e,t,n);case 3:return ae(e,t,n)}}(e,t,n,r);if(s instanceof Array)return s;return[s]
}(this,U.create(e),t,n)}pluralize(e){const t=U.create(e);return t.isPluraleTantum()?[t.text()]:Fe(this,t)}
getLocativeForms(e){const t=this,n=U.create(e),r=n.getDeclension();if(r&&r>=0){const e=de.get(Se(n))
;if(e instanceof Array)return e.map(e=>new s(function(e){switch(1+(e>>3&7)){case c.V:return"в";case c.VO:return"во"
;case c.NA:return"на"}}(e),function(e,t,n,r){switch(t){case 0:return Ee(e,n,Case.PREPOSITIONAL);case 1:return we(e,n,r)
;case 2:return he(e,n,Case.PREPOSITIONAL);case 3:return ae(e,n,Case.PREPOSITIONAL)}}(t,r,n,E(e)),e>>6))}return[]}}
export{e as CASES,t as Case,st as Engine,r as Gender,U as Lemma,s as LocativeForm,i as LocativeFormAttribute,D as StressDictionary,M as createLemma,L as createLemmaOrNull};
//# sourceMappingURL=RussianNouns.mjs.map
