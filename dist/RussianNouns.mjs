/*!
  RussianNounsJS v3.0.0-alpha.1
  Copyright (c) 2011-2026 Georgy Ustinov
  Released under the MIT license
*/
const e=Object.freeze(["именительный","родительный","дательный","винительный","творительный","предложный","местный"]),t=Object.freeze({
NOMINATIVE:e[0],GENITIVE:e[1],DATIVE:e[2],ACCUSATIVE:e[3],INSTRUMENTAL:e[4],PREPOSITIONAL:e[5],LOCATIVE:e[6]})
;function n(t){return"number"==typeof t?t:e.indexOf(t)}
const r=Object.freeze(["женский","мужской","средний","общий"]),s=Object.freeze({FEMININE:r[0],MASCULINE:r[1],
NEUTER:r[2],COMMON:r[3]});function i(e){const t=new Set;let n=0;for(let r of e)n+=r,t.add(n);return t}function u(e){
return 1<<e}function c(e,t,n){this.preposition=e,this.word=t,this.attributes=n}const a=Object.freeze({CONTAINER:1,
LOCATION:2,STRUCTURE:4,SURFACE:8,WAY:16,OBJECT_WITH_FUNCTIONAL_SURFACE:32,SUBSTANCE:64,RESOURCE:128,CONDITION:256,
EXPOSURE:u(9),MOTION:u(10),EVENT:u(11),WITH_ADJECTIVE:u(12),WITHOUT_ADJECTIVE:u(13),RELIGIOUS:u(14)}),o=Object.freeze({
PREPOSITIONAL:1,U_SUFFIX:2}),h=Object.freeze({V:1,VO:2,NA:3});function f(e,t,n){return n<<6|(e-1&7)<<3|t-1&7}
function l(e){return 1+(7&e)}function E(e){const t=e.replaceAll("ё","е");let n=t.length%2,r=1,s=5381;function i(){
s=(33*s+(255&n))%4294967296,n>>=8,r-=8}for(let e of t){const t=e.charCodeAt(0)-1072&31;n|=t<<r,r+=5,r>=8&&i()}r>0&&i()
;const u=t.charCodeAt(0)%2;return 2*(2147483647&s)+u}function d(e){const t=e.charCodeAt(0)-1072
;return 33===t?32:t===(31&t)?1<<t:0}function S(e,t){return 0!==(e&d(t))}const p=3892855073,g=66567902,A=66567390
;function w(e){return S(p,e)}function b(e){return e.split("").filter(w).length}function W(e){
return e.replaceAll("ё","е").replaceAll("Ё","Е")}function m(e,t){return e.substring(0,e.length-t)}function I(e,t){
return e.substring(e.length-t)}function N(e){return m(e,1)}function O(e){return _(e,1)}function _(e,t){
return e[e.length-t]||""}function C(e,t){return 1===t.length&&e.includes(t)}function M(e,t){
return t.some(t=>e.endsWith(t))}class U{constructor(e){e instanceof U?(this._txt=e._txt,this._lc=e._lc,
this._hash=e._hash,this._flags=e._flags):(e.pluraleTantum?this._flags=5:this._flags=1+r.indexOf(e.gender),
this._txt=e.text,this._lc=e.text.toLowerCase(),this._hash=E(this._lc),this._flags|=8*(1&e.indeclinable),
this._flags|=16*(1&e.animate),this._flags|=32*(1&e.surname),this._flags|=64*(1&e.name),this._flags|=128*(1&e.transport),
this._flags|=u(16)*(2+function(e,t,n,r){if(t)return-2;if(r)return-1;const i=O(e);switch(n){case s.FEMININE:
return"а"===i||"я"===i?2:S(g,i)?-1:3;case s.MASCULINE:return"а"===i||"я"===i?2:"путь"===e?0:1;case s.NEUTER:
return["дитя","полудитя"].includes(e)?0:"мя"===I(e,2)?3:1;case s.COMMON:return"а"===i||"я"===i?2:"и"===i?-1:1;default:
return-2}}(this._lc,e.pluraleTantum,e.gender,e.indeclinable)))}static create(e){if(e instanceof this)return e
;const t=x(e);if(t)throw new Error(t);return Object.freeze(new this(e))}static createOrNull(e){
return null===x(e)?Object.freeze(new this(e)):null}equals(e){
return e instanceof U&&this._flags===e._flags&&this.lower()===e.lower()}text(){return this._txt}lower(){return this._lc}
isPluraleTantum(){return 5==(7&this._flags)}getGender(){const e=7&this._flags;if(e>=1&&e<=4)return r[e-1]}
isIndeclinable(){return!!(8&this._flags)}isAnimate(){return!!(16&this._flags)||this.isASurname()||this.isAName()}
isASurname(){return!!(32&this._flags)}isAName(){return!!(64&this._flags)}isATransport(){return!!(128&this._flags)}
getDeclension(){return(this._flags>>16)-2}getSchoolDeclension(){const e=this.getDeclension();return 1===e?2:2===e?1:e}}
function T(e,t){const n=new U(e);return n._txt=t,n._lc=t.toLowerCase(),n._hash=E(n.lower()),Object.freeze(n)}
function x(e){if(null==e)return"No parameters specified."
;for(let t of["pluraleTantum","indeclinable","animate","surname","name","transport"]){
if((e=>null!=e&&"boolean"!=typeof e)(e[t]))return t+" must be boolean."}
if(null==e.text)return"A cyrillic word required.";if(!e.pluraleTantum){
if(null==e.gender)return"A grammatical gender required.";if(!r.includes(e.gender))return"Bad grammatical gender."}
return null}function L(e){return U.create(e)}function y(e){return U.createOrNull(e)}
const R=i([11720389,548,1024,1479,2622,2867,1222,2642,264,1328,137,123,397,65542229,212447047,31729170,8094836,1056,21701789,35520559,40358,21819,28248,119786,63892,31809,7356,74383,72369,5945,28902,90120738,21187517,91925642,3054826,1600765,65934,30948851,5569212,4205640,5412804,6787095,9749916,3940084,1511466,1303038,16090470,1376628,49919694,3827522,37915959,14032615,28701924,224587434,637275762,51079457,391103676,24108070,158999424,232633267,6058815,66599250,692781441,816204112,55209380,72754,90006,80058,45564,67845,42548,27193,21401,139393,750335,170896,4424,1566,6264,154969,17292,17229,175112,83011,117872,4183,13065,108972,108088,343663,66210,334,17090,380271,283272,59007,35796,230801,1067156,19992,157124,12433,252644,2626,23776,630482,531296,304718,90891,726,23116,47653,30493,167310,50156,123071,477118,241821,55660,908992,534269,205157,11218,2490,660,66391,46856,847526,68710,8450,36630,15642,109864,41716,354482,79820,51876,97325,5506,46436,191803,3957,40876,126323,2347821,338490,73216,475569,87602,29642,4220,10760,16896,50156,17424,35178,167244,126786,33643,30488,65045,35961,51453,55660,4,152461,138332,1958,34200,3709,61381,17424,30158,80591,11218,44099,260487]),k=i([11720389,548,1024,1060,4,5904,1848,4404,330555234,4691346,3365076,1045362,7414584,960432,10564312,253286,16178203,4357,4355,11350,31120,5248,40591,62367,54057,50487,13069,3664,39764,10263,3002,5810,8844,24551,4091,56761,21785,30553,55147139,15960625,1933097,12258067,16302047,54210486,45688435,1659767,4813249,33577763,2501798,10056946,672528,14209351,2012340,1655412,4652736,62568,148698,21186,71129124,260014161,108045611,1007583269,2026464,22799532,750068913,1499532,1285428194,74598,22348,6599,132273,309821,156816,397448,179394,148036,100257,21779,11218,36631,345954,50442,104394,2724,112115,30690,10552,31377,11286,7168,14612,51480,116537,192258,163145,65604,97951,1363157,212810,431243,2622,425588,275284,150351,570568,244701,16659,26136,130134,11040,159389,728373,3476,726,1290392,224730,189158,11218,2490,10750,21608,143747,65974,664563,84036,16283,17424,5758,45080,33066,1782,90658,37101,56107,233163,14216,5518,179264,2525,146957,111342,80594,2309,4217,25432,26905,29980,518951,1458289,523705,4202,477865,149368,126310,47828,212678,22744,269176,179119,4399,35997,69696,41777,41,127336,4202,73153,46372,114255,126869,23630,11218])
;class j{constructor(){this._filter=new Uint8ClampedArray(256)}addInteger(e){this.addRaw(P(e))}hasInteger(e){
return this.hasRaw(P(e))}addRaw(e){const t=2047&e,n=t>>>3;this._filter[n]=this._filter[n]|1<<7-t%8}hasRaw(e){
const t=2047&e;return!!(this._filter[t>>>3]>>>7-t%8&1)}clone(){return function(e){const t=new j
;return t._filter=Uint8ClampedArray.from(e),t}(this._filter)}}function P(e){return e>>>22&2047^e>>>11&2047^2047&e}
function z(e){const t=e.padStart(3,"а");return(7&t.charCodeAt(0))<<8|(15&t.charCodeAt(1))<<4|15&t.charCodeAt(2)}
const F=function(){const e=new j;return R.forEach(t=>e.addInteger(t)),k.forEach(t=>e.addInteger(t)),Object.freeze(e)}()
;function V(){const e=new Map,t=F.clone(),r=function(e){return 4294967296*(31&e._flags)+e._hash},i=function(e){
return e.lower().indexOf("ё")+1&255},u=t=>{const n=65504&t._flags,s=(t=>{const n=r(t),s=e.get(n)
;return s instanceof Array?s:[]})(t).filter(e=>(e[0]&n)<=n),u=s.filter(e=>e[0]>>16===i(t))
;return u.length?u[0][1]:s.length?s[0][1]:void 0};this.put=function(n,s){
const u=s.split("-"),c=(e,t)=>e.length!==t||e.split("").some(e=>!"SsbeE".includes(e))
;if(2!==u.length||c(u[0],7)||c(u[1],6))throw new Error("Bad settings format.");const a=U.create(n),o=r(a);let h=e.get(o)
;h instanceof Array||(h=[],e.set(o,h));const f=65535&a._flags|i(a)<<16,l=h.find(e=>f===e[0]);l?l[1]=s:h.push([f,s]),
t.addInteger(a._hash)};const c=e=>{switch(e){case"E":return[!0];case"e":return[!0,!1];case"b":case"s":return[!1,!0]
;default:return[!1]}};this.hasStressedEndingSingular=function(e,r){if(t.hasInteger(e._hash)){const t=n(r);if(t>=0){
let n=u(e);if(n){const e=n.split("-")[0];return c(e[t])}if(e.getGender()===s.MASCULINE){
if(R.has(e._hash))return c("SEESEEE"[t]);if(k.has(e._hash))return c("SEEEEEE"[t])}}}return[]},
this.hasStressedEndingPlural=function(e,r){if(t.hasInteger(e._hash)){const t=n(r);if(t>=0&&t<6){let n=u(e);if(n){
const e=n.split("-")[1];return c(e[t])}
if(e.getGender()===s.MASCULINE&&(R.has(e._hash)||e.isAnimate()&&k.has(e._hash)))return c("E")}}return[]}}function D(e){
let t=new Map;for(let n of e){let e=t;for(let t=n.length-1;t>=0;t--){const r=n.charCodeAt(t);if(t>0){const t=e.get(r)
;if(0===t)break;void 0===t&&e.set(r,new Map),e=e.get(r)}else e.set(r,0)}}return t}function G(e,t){let n=t
;for(let t=e.length-1;t>=0;t--){const r=e.charCodeAt(t);if(!n.has(r))return!1;{const e=n.get(r);if(0===e)return!0;n=e}}}
function v(e){let t=new Array(e.length);for(let n=0;n<e.length;n++){let r=e.charCodeAt(n)
;r>=1040&&r<=1071?r+=32:r>=1024&&r<=1039&&(r+=80),t[n]=r}return String.fromCharCode.apply(null,t)}function B(e,t){
return t===t.toUpperCase()?e.toUpperCase():e}
const q=D(["ое","нький","ский","ской","лстой","отой","утой","евой","овой","живой"]),H=D(["ее","ое","нький","ский","ской","лстой","отой","утой"]),J=D(["евой","овой","отой","живой"]),X=D(["шний","жний","щий","ший","жий","чий"]),Y=["божий","ажий","яжий","ужий","южий","бульдожий","кабарожий","медвежий","носорожий","миножий"],K=D(Y),Q=D(Y.map(e=>m(e,2)+"ьи")),Z=new Set(["бубен","бугор","ветер","вошь","вымысел","горшок","деготь","дёготь","дятел","домысел","замысел","кашель","коготь","лапоть","лоб","локоть","ломоть","молебен","мох","ноготь","овен","пепел","пес","пёс","петушок","помысел","порошок","промысел","псалом","пушок","ров","рожь","рот","сон","стебель","стишок","угол","умысел","хребет","церковь","шов","ковер","овес","костер"].map(E)),$=new j
;Z.forEach(e=>$.addInteger(e))
;const ee=D(["овёс","ковёр","костёр","шатер","шатёр","козел","козёл","котел","котёл","орел","орёл","осел","осёл","узел","уголь","чок","ешок","хол"])
;function te(e,t){const n=O(t);if(S(-402111711,n)){if(S(p,_(t,2))){const n=m(e,2);return G(t,K)?n+B("ь",n):n}
if("й"!==n)return N(e)}return e}const ne=["ясень","бюллетень","олень","тюлень","гордень","пельмень","ячмень"]
;function re(e,t,n){const r=e.text(),i=O(t),u=d(i);let c;return-133667019&u&&(-402111711&u?c=function(e,t,n){
const r=_(t,2);return"ь"===r||"о"===n&&S(2504708,r)?N(e):te(e,t)}(r,t,i):"к"===i?c=function(e,t,n){
return e.length>=4&&M(t,["рёк","нёк","лёк"])&&!1!==n?m(e,2)+"ьк":t.endsWith("ёк")&&S(p,_(t,3))?m(e,2)+"йк":void 0
}(r,t,n):"ь"===i?c=function(e,t,n){
return Z.has(e._hash)||G(n,ee)?m(t,3)+_(t,2):n.endsWith("ень")&&e.getGender()===s.MASCULINE&&!M(n,ne)?m(t,3)+"н":N(t)
}(e,r,t):(["лёд","лед","лён"].includes(t)||"лев"===t&&e.isAnimate())&&(c=m(r,2)+B("ь",_(r,2))+O(r))),
c||(c=function(e,t,n){
return!!(199680&n)&&G(t,ee)&&!["новосел","новосёл"].includes(t)||!!(2571270&n)&&($.hasInteger(e._hash)&&Z.has(e._hash)||e.isAnimate()&&t.endsWith("посол"))
}(e,t,u)?m(r,2)+O(r):r),c}function se(e,t){const n=N(e),r=N(t.lower());if("а"===O(r))return n
;if(M(r,["зне","жне","гре","спе","мудре"])||I(N(r),3).split("").every(e=>S(A,e))||t.isAName())return n
;if("ле"===I(r,2)){const e=_(r,3);return S(p,e)||"л"===e?N(n)+"ь":n}
return S(p,O(r))&&"и"!==O(r)?S(p,O(N(r)))?m(e,2)+"й":M(t.lower(),["месяц"])?n:m(e,2):n}
const ie=D(["лапоток","желток","нишок","ришок","ишек"]),ue=["поток","приток","переток","проток","биоток","электроток","восток","водосток","водоток","воток","знаток"],ce=["инок","исток","обморок","порок","пророк","сток","урок"]
;function ae(e){
return M(e,["чек","шек"])&&e.length>=6||G(e,ie)||e.endsWith("ок")&&!e.endsWith("шок")&&!ce.includes(e)&&!M(e,ue)&&!S(p,_(e,3))&&(S(p,_(e,4))||M(m(e,2),["ст","рт"]))&&e.length>=4
}function oe(e,t,n){return(e.length?e:[!1]).map(e=>n(e?W(t):t,e))}const he=0,fe=3,le={"дочь":"дочерь","мать":"матерь"}
;function Ee(e,t,n){const r=t.text(),s=t.lower();if(![he,fe].includes(n)&&Object.keys(le).includes(s)){
return Ee(e,T(t,le[s]),n)}let i=re(t,s);if(function(e){
return e.endsWith("полночь")||e.startsWith("пол")&&S(134217984,O(e))&&b(e)>=2}(s)&&(i="полу"+i.substring(3)),
"мя"===I(s,2))switch(n){case he:case fe:return r;case 1:case 2:case 5:case 6:return i+"ени";case 4:return i+"енем"
}else switch(n){case he:case fe:return r;case 1:case 2:case 5:case 6:return i+"и";case 4:
return M(s,["вошь","рожь","церковь"])?r+"ю":i+"ью"}}function de(e,t,n){const r=t.text(),s=t.lower()
;if(s.endsWith("путь"))return 4===n?N(r)+"ём":Ee(e,t,n);if(!s.endsWith("дитя"))throw new Error("unsupported");switch(n){
case 0:case 3:return r;case 1:case 2:case 5:case 6:return r+"ти";case 4:return[r+"тей",r+"тею"]}}function Se(e,t,n){
const r=t.text(),s=t.lower(),i=re(t,s),u=v(i),c=N(r),a=N(s),o=()=>"я"===O(s),h=()=>s.endsWith("ая")&&!(2===b(s)||S(p,O(u))),f=()=>s.endsWith("яя")&&!(2===b(s)||S(p,O(u))),l=["жая","шая"]
;switch(n){case 0:return r;case 1:
return f()||M(s,l)?i+"ей":h()?i+"ой":t.isASurname()&&!s.endsWith("да")?c+"ой":s.endsWith("ничья")?c+"ей":o()||S(60818504,O(u))?c+"и":c+"ы"
;case 2:case 5:case 6:
return f()||M(s,l)?i+"ей":h()?i+"ой":t.isASurname()&&!s.endsWith("да")?c+"ой":"ия"===I(s,2)?c+"и":s.endsWith("ничья")?c+"ей":c+"е"
;case 3:return h()?i+"ую":f()?i+"юю":o()?c+"ю":c+"у";case 4:
return f()||M(s,l)?i+"ею":h()?[i+"ой",i+"ою"]:o()||C("жшчщц",O(u))&&!e.sd.hasStressedEndingSingular(t,n).includes(!0)?"и"===O(a)?c+"ей":[c+"ей",c+"ею"]:[c+"ой",c+"ою"]
}}const pe=D(["ов","ев","ёв","ин","ын"]),ge=function(e,t){let n=t;for(let t=0;t<e.length;t++){
const r=e.charCodeAt(t),s=n;n=new Map,n.set(r,s)}return n}("ы",pe);function Ae(e){
return e.filter((t,n)=>e.indexOf(t)===n)}function we(e){const t=1&e.lower().includes("ё")
;return 4294967296*((65535&e._flags)<<1|t)+e._hash}const be=Object.freeze(function(){const e=new Map,t={
gender:s.MASCULINE},n={gender:s.MASCULINE,animate:!0};function r(t,n,r,s,i){
const u=s.split(","),c=i instanceof Array?i:[2];for(let s of u){t.text=s;const i=we(U.create(t));let u=e.get(i)
;u||(u=[],e.set(i,u));for(let e of r)for(let t of c)u.push(f(e,t,n))}}const i=[h.V],c=[h.VO],a=[h.NA]
;r(t,u(0),i,"мозг,пруд,стог,таз,год"),r(t,u(0),c,"рот"),r(t,u(4),i,"год"),r(t,u(0),i,"гроб"),
r(t,u(0)|u(14),c,"гроб",[1]),r(t,u(1),i,"ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,низ,хлев"),
r(t,u(2),i,"круг,полк,артполк,ряд,род,строй,лад"),r(t,u(3),a,"баз,берег,бережок,вал,кон,круг,луг,пол,яр"),
r(t,u(4),a,"век,день"),r(t,u(4),i,"час"),r(t,u(4),a,"корень"),r(n,u(5),a,"вор"),
r(t,u(5),a,"повод,бочок,борт,воз,горб,кол,мост,плот,сук,х"+String.fromCharCode(1091)+"й"),r(t,u(5),a,"крюк,болт",[1,2])
;const o=",мёд,мех,пар,пух";r(t,u(6),i,"дым,жир,мел,пушок"+o),r(t,u(7),a,"газ,клей,спирт"+o),
r(t,u(8),i,"бой,бред,быт,долг,плен,пыл,сок,ход,лад"),r(t,u(9),i.concat(a),"вид"),
r(t,u(9),a,"слух,счёт,ветер,ветр,свет"),r(t,u(10),a,"ход,бег,вес"),r(t,u(10)|u(12),a,"шаг"),r(t,u(11),a,"бал,пир"),
r(t,u(8),a,"дух,плав"),r(t,u(10)|u(12),a,"газ"),r(t,u(0),i,"глаз,зоб,нос,шкаф"),r(t,u(0),c,"лоб"),
r(t,u(5),a,"глаз,лоб,нос,шкаф,холм");let l="бок,верх,зад,угол";return r(t,u(1),i,l),r(t,u(5),a,l),
r(t,u(1)|u(13),i,"край"),r(t,u(5)|u(13),a,"край"),r(t,u(3),a,"лёд,мох,снег"),r(t,u(6),c,"лёд,лён,мох"),
r(t,u(6),i,"снег"),e
}()),We=new Set("клей,чай,дом,дух,дым,дымок,газ,год,горошек,жар,жир,квас,пар,пыл,род,рост,сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,табак,творог,толк,торф,туман,убыток,укроп,уксус,ход,цемент,чеснок,шаг,шик,шиповник,шоколад,шорох,шум,яд".split(",")),me=new j
;We.forEach(e=>me.addInteger(E(e)))
;const Ie=D(["й","ие","иё"]),Ne=D(["воробей","муравей","ручей","соловей","улей"]),Oe=D(["мой","ной","дой","шой","жой","рзой","осой","хой","латой","витой","литой","питой","житой","отой","утой","ятой","лагой","рагой","огой","угой","лубой","любой","илой","ылой","злой","малой","овой","евой","живой","ской","акой","укой","нний","ский","йкий","цкий","зкий","ткий","лкий","мкий","хкий","оркий","аркий","яркий","ький","ёкий","бокий","оокий","cокий","токий","ликий","дикий","укий","ыкий","який","пкий","дкий","бкий","нкий","жкий","чкий","гкий","овкий","авкий"])
;function _e(e,t){return"ый"===I(t,2)||(t.endsWith("кривой")||G(t,Oe))&&b(t)>=2}
const Ce=D(["ий","ие","чье","тье","дье","вье","бье","жалованье","енье","ружье","божье","верье","мужье"]),Me=D(["вое","лое","мое","ное","рое","тое","той","ый"])
;function Ue(e,t,n){const r=t.text(),i=v(r),u=O(i),c=t.getGender(),a=e.sd.hasStressedEndingSingular(t,n)
;let o=re(t,i,a[0]),h=N(r);const f=xe(i);f&&(o="полу"+o.substring(3),h="полу"+h.substring(3));let E=v(o)
;const d=()=>f&&i.endsWith("я")||ye(i),S=G(i,Ie),p=()=>G(i,Ne)?N(h)+B("ь",O(h)):h,g=()=>C("чщ",O(E));function A(e){
return!t.isAnimate()&&me.hasInteger(t._hash)&&We.has(i)&&("й"===u?e.push(N(r)+B("ю",O(r))):e=e.concat(oe(a,o,e=>e+B("у",O(e))))),
e}switch(n){case 0:return r;case 1:switch(u){case"и":case"ы":if(f)return Te(e,t,n,i);break;case"й":case"е":
if(S&&t.isASurname()||_e(0,i)||G(i,q))return o+"ого";if(G(i,X)||i.endsWith("ее"))return o+"его";case"ё":case"я":case"ь":
if(S){return A([p()+"я"])}if(d()&&!g())return o+"я";break;case"ц":return se(r,t)+"ца";case"к":if(ae(i))return N(h)+"ка"
;break;case"о":if(M(i,["шко"])&&s.MASCULINE===c)return h+"и"}let w
;return w=t.isASurname()||-1===E.indexOf("ё")?[o+"а"]:oe(a,o,e=>e+"а"),A(w);case 2:switch(u){case"и":case"ы":
if(f)return Te(e,t,n,i);break;case"й":case"е":if(S&&t.isASurname()||_e(0,i)||G(i,q))return o+"ому"
;if(G(i,X)||i.endsWith("ее"))return o+"ему";case"ё":case"я":case"ь":if(S)return p()+"ю";if(d()&&!g())return o+"ю";break
;case"ц":return se(r,t)+"цу";case"к":if(ae(i))return N(h)+"ку"}
return t.isASurname()||-1===E.indexOf("ё")?o+"у":oe(a,o,e=>e+"у");case 3:
return c===s.NEUTER||C("иы",u)&&f?r:t.isAnimate()?Ue(e,t,1):r;case 4:switch(u){case"и":case"ы":if(f)return Te(e,t,n,i)
;break;case"й":case"е":case"ё":case"я":case"ь":if(S&&t.isASurname()||G(i,H))return G(i,Me)?o+"ым":o+"им"
;if(_e(0,i))return"и"===_(i,2)||i.endsWith("хой")?o+"им":o+"ым";if(G(i,J))return o+"ым";if(G(i,X))return o+"им"
;if(S)return p()+"ем";if(i.endsWith("це"))return r+"м";break;case"ц":return oe(a,r,(e,n)=>n?se(e,t)+"цом":se(e,t)+"цем")
;case"к":if(ae(i))return N(h)+"ком";break;case"н":case"в":if(t.isASurname()&&G(i,pe))return r+"ым"}
return d()||C("жшчщ",O(E))?oe(a,o,(e,t)=>t?e+"ом":e+"ем"):t.isASurname()||-1===E.indexOf("ё")?o+"ом":oe(a,o,e=>e+"ом")
;case 6:if("полпути"===i)return r;const b=be.get(we(t));if(b){return Ae(b.map(e=>l(e))).map(n=>Le(e,t,n))}case 5:
switch(u){case"и":if("полпути"===i)return r;case"ы":if(f)return Te(e,t,n,i);break;case"й":case"е":case"ё":case"я":
case"ь":if(S&&t.isASurname()||_e(0,i)||G(i,q))return o+"ом";if(G(i,X)||i.endsWith("ее"))return o+"ем"
;if(M(i,["воробей"])){const e=N(h);return e+B("ье",O(e))}
if(G(i,Ce)&&!M(i,["запястье","здоровье","изголовье","платье"]))return h+"и";if("й"===u||"иё"===I(i,2))return p()+"е"
;break;case"ц":return se(r,t)+"це";case"к":if(ae(i))return N(h)+"ке"}
return t.isASurname()||-1===E.indexOf("ё")?o+"е":oe(a,o,e=>e+"е")}}function Te(e,t,n,r){
const s=()=>"полминуты"!==r?"полу"+t.text().substring(3):t.text();if("полпути"===r){return de(e,T(t,N(s())+"ь"),n)}
if(r.endsWith("зни")||r.endsWith("сти")){return Ee(e,T(t,N(s())+"ь"),n)}
return Se(e,T(t,N(s())+("ни"===I(r,2)?"я":"а")),n)}function xe(e){
if(e.startsWith("пол")&&S(2550137089,O(e))&&"л"!==e[3]&&b(e)>=2){let t=e.substring(3),n=t.search(/[а-яё]/)
;return n>=0&&S(g,t[n])}return!1}function Le(e,t,n){if(o.U_SUFFIX===n){const e=t.text(),n=t.lower();let r=re(t,n),s=N(e)
;const i=xe(n)&&n.endsWith("я")||ye(n);return"й"===O(n)?W(s)+"ю":i?W(r)+"ю":ae(n)?W(N(s))+"ку":W(r)+"у"}
if(o.PREPOSITIONAL===n)return Ue(e,t,5)}function ye(e){
return"ь"===O(e)&&!e.endsWith("господь")||C("её",O(e))&&!M(e,["це","же"])}
const Re=new j,ke=Object.freeze([[[s.MASCULINE,void 0],{"болгарин":["болгары"],"господин":["господа"],
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
;for(const e of ke)Object.keys(e[1]).map(e=>Re.addInteger(E(e)))
;const je=["зять","деверь","друг","брат","собрат","стул","брус","обод","полоз","струп","подмастерье","якорь","перо","шило"],Pe=new Set(["берег","бок","борт","век","вес","веер","вексель","вечер","глаз","голос","город","доктор","дом","детдом","егерь","жемчуг","катер","колокол","концлагерь","корм","короб","кузов","купол","лес","луг","мастер","номер","пояс","провод","рог","сахар","снег","сорт","стог","счет","счёт","спецсчет","спецсчёт","субсчет","субсчёт","терем","том","холод","цвет","череп"]),ze=D(["округ","остров","отпуск","паспорт","парус","поезд","повар","погреб","рукав","цех","юнкер"]),Fe=new Set(["адрес","договор","буфер","ворох","директор","инспектор","инструктор","корпус","крейсер","орден","ордер","прожектор","пропуск","род","свитер","сервер","тенор","тон","трактор","тормоз","ветер","верх","китель","мех","хлеб","юнкер","ястреб"]),Ve=new Set(["бункер","вымпел","год","образ","омут","токарь","тополь","шторм","штуцер"])
;function De(e,t){const n=[],r=t.text(),i=v(r),u=e.sd.hasStressedEndingPlural(t,0);Object.freeze(u)
;const c=re(t,i,u[0]),a=v(c);if(i.endsWith("яя"))return n.push(m(r,2)+"ие"),Ae(n);const o=n=>{
const r=e.sd.hasStressedEndingPlural(t,0).map(e=>!e)
;return r.length?r.map(e=>e?1===a.replace(/[^её]/g,"").length?n((e=>{
const t=Math.max(e.toLowerCase().lastIndexOf("е"),e.toLowerCase().lastIndexOf("ё")),n=B("ё",e[t])
;return e.substring(0,t)+n+e.substring(t+1)})(c)):n(c):n(W(c))):[n(c)]
},h=t.getGender(),f=t.getDeclension(),l=("й"===O(i)||S(p,O(i)))&&S(p,O(N(i)))?N(r):c,E=()=>(i.endsWith("евич")||i.endsWith("евна"))&&i.indexOf("ье")>=0
;function d(){const e=l,t=v(e).indexOf("ье"),n=B("и",e[t]);return e.substring(0,t)+n+e.substring(t+1)}function g(){
S(60818504,O(a))||C("яйь",O(i))||M(i,["сосед"])?E()?(n.push(d()+"и"),
n.push(l+"и")):Array.prototype.push.apply(n,oe(u,l,e=>e+"и")):"ц"===O(i)?n.push(se(r,t)+"цы"):E()?(n.push(d()+"ы"),
n.push(l+"ы")):Array.prototype.push.apply(n,oe(u,l,e=>e+"ы"))}const A=function(e,t){if(Re.hasInteger(e._hash)){
const n=e.getGender(),r=e.isAnimate();for(const[e,s]of ke){const i=e[0],u=e[1]
;if(n===i&&(null==u||u===r)&&s.hasOwnProperty(t))return s[t].slice()}}}(t,i);if(A)return A
;const w="ь"===O(a)?c:"к"===O(a)?N(c)+"чь":"г"===O(a)?N(c)+"зь":"й"===O(i)?N(r):M(i,["рь","ль"])?c:c+"ь";switch(f){
case-1:n.push(r);break;case 0:if("путь"===i)n.push("пути");else{if(!i.endsWith("дитя"))throw new Error("unsupported")
;n.push(m(r,3)+"ети")}break;case 1:if(je.includes(i))n.push(w+"я");else if(s.MASCULINE===h){
const e=["крюк","лист","лоскут","повод","прут","сук","учитель","флигель","штабель"],s=["клин","колос","ком","край","соболь"]
;"сын"===i?(n.push("сыновья"),g()):"человек"===i?(n.push("люди"),g()):e.includes(i)||"соболь"===i&&t.isAnimate()?(g(),
n.push(w+"я")):s.includes(i)?n.push(w+"я"):Pe.has(i)||G(i,ze)||Fe.has(i)||Ve.has(i)?(Ve.has(i)&&g(),
ye(i)?Array.prototype.push.apply(n,o(e=>e+"я")):u.includes(!0)?n.push(W(c)+"а"):n.push(c+"а"),
Fe.has(i)&&g()):(i.endsWith("анин")&&i.length>5||i.endsWith("янин"))&&!t.isAName()||["барин","боярин"].includes(i)?(n.push(m(r,2)+"е"),
"барин"===i&&n.push(m(r,2)+"ы")):["цыган"].includes(i)?n.push(r+"е"):"щенок"===i?(n.push(m(r,2)+"ки"),
n.push(m(r,2)+"ята")):!i.endsWith("ребёнок")&&!i.endsWith("ребенок")||i.endsWith("жеребёнок")||i.endsWith("жеребенок")||i.endsWith("ястребёнок")||i.endsWith("ястребенок")?(i.endsWith("ёнок")||i.endsWith("енок"))&&t.isAnimate()?n.push(m(r,4)+"ята"):i.endsWith("ёночек")&&t.isAnimate()?n.push(m(r,6)+"ятки"):i.endsWith("онок")&&C("жшч",_(i,5))&&t.isAnimate()?n.push(m(r,4)+"ата"):ae(i)?n.push(m(r,2)+"ки"):G(i,X)?M(i,Y)?n.push(m(r,2)+"ьи"):n.push(N(r)+"е"):_e(0,i)?i.endsWith("ый")||i.endsWith("ий")?n.push(N(r)+"е"):i.endsWith("ой")&&!M(i,["хой","ской"])?n.push(m(r,2)+"ые"):n.push(m(r,2)+"ие"):i.endsWith("его")?n.push(m(r,3)+"ие"):["воробей","муравей","ручей","соловей","улей","жеребей","ирей","репей","чирей"].includes(i)?n.push(m(r,2)+"ьи"):g():n.push(m(r,7)+"дети")
}else if(s.NEUTER===h)if(M(i,["ко","чо"])&&!M(i,["войско","облако"]))n.push(N(r)+"и");else if(i.endsWith("имое"))n.push(c+"ые");else if(i.endsWith("ее"))n.push(c+"ие");else if(i.endsWith("ое"))M(a,["г","к","ж","ш","х"])?n.push(c+"ие"):n.push(c+"ые");else if(M(i,["ие","иё"]))n.push(m(r,2)+"ия");else if(M(i,["ье","ьё"])){
const e=m(r,2),t=["безделье","варенье","воскресенье","жалованье","запястье","застолье","затишье","здоровье","зелье","изголовье","новоселье","одночасье","печенье","платье","побережье","поголовье","подворье","подземелье","подполье","поместье","предплечье","раздумье","сиденье","средневековье","увечье","угодье","устье"].includes(i)
;"е"!==O(i)||t||n.push(e+"ия"),n.push(e+"ья")
}else M(i,["дерево","звено","крыло"])?n.push(c+"ья"):M(i,["ле","ре"])?n.push(c+"я"):i.endsWith("судно")&&t.isATransport()?n.push(m(r,2)+"а"):(Array.prototype.push.apply(n,o(e=>e+"а")),
M(i,["щупальце"])&&g());else n.push(c+"и");break;case 2:
"заря"===i?n.push("зори"):i.endsWith("ая")&&!i.endsWith("свая")?C("жхчшщ",O(a))||M(a,["вк","гк","ск","цк","ньк"])?n.push(c+"ие"):n.push(c+"ые"):g()
;break;case 3:
"мя"===I(i,2)?n.push(c+"ена"):Object.keys(le).includes(i)?n.push(N(le[i])+"и"):s.FEMININE===h?n.push(l+"и"):"и"===O(l)?n.push(l+"я"):n.push(l+"а")
}return Ae(n)}
const Ge=D(["ли","си","би","ви","ди","ти","пи","ри","ни","фи","зи","ьи","ья","ия","ря","ля","ая","аи","ои","уи","эи","ыи","яи","ёи","юи","еи","ии"]),ve=["беготни","болтовни","будни","вожжи","возни","доли","лапши","левши","люди","марли","моря","мощи","ноздри","пени","пятерни","распри","родни","сакли","сени","ступни","судьи","фигни","чукчи"],Be=["головы","громадины","детины","деревенщины","дохлятины","дубины","ехидины","жадины","зверины","идиотины","кислятины","молодчины","орясины","остолопины","сиротины","скотины","старейшины","старины","старшины","уродины"],qe=D(Be),He=["адреса","паспорта","поезда","цеха","снега","бункера","буфера","берега","вымпела","голоса","города","директора","договора","доктора","жемчуга","инспектора","инструктора","колокола","кондуктора","короба","корпуса","крейсера","кузова","леса","мастера","номера","облачка","острова","отпуска","паруса","повара","погреба","пояса","провода","прожектора","пропуска","рукава","сахара","свитера","сервера","счета","трактора","тормоза","холода","цвета","черепа","шторма","штуцера","юнкера","ястреба","суда","корм"],Je=D(He),Xe=new Set(He.concat(["бега","беглецы","близнецы","бойцы","бока","борта","борцы","бруствера","брюшки","веера","века","венцы","верха","веса","весы","вечера","вороха","глупцы","года","гонцы","дворцы","дельцы","детдома","детдомы","дома","жеребцы","жильцы","жрецы","затишки","зубцы","излишки","истцы","катера","концы","корма","кузнецы","купола","купцы","лишки","луга","мертвецы","меха","мудрецы","облака","образа","образцы","огурцы","округа","омута","ордена","ордера","отцы","очки","певцы","песцы","пловцы","подлецы","продавцы","птенцы","резцы","рога","рода","рубцы","самцы","свинцы","сорта","соуса","спецы","стога","столбцы","стрельцы","творцы","тельцы","тенора","терема","тома","тона","торцы","хлеба","штришки","юнцы"])),Ye=new Set(["авары","аланы","аршины","баклажаны","буквы","гольфы","граммы","гусары","дела","кадеты","килограммы","омы","помидоры","рентгены","ботинки","человеки","чулки","шорты"]),Ke=new Set(["гектары","рельсы"]),Qe=new j
;Xe.forEach(e=>Qe.addRaw(z(e))),Ye.forEach(e=>Qe.addRaw(z(e))),Ke.forEach(e=>Qe.addRaw(z(e)))
;const Ze=new Set(Be.concat(["абазины","авы","аввы","бедняги","бедолаги","болгары","бродяги","брызги","брюки","брюхи","будды","бусы","валенки","веки","вельможи","верзилы","вилы","владыки","воеводы","волосы","вояки","главы","грузины","задворки","задиры","железы","жилы","зануды","зеваки","именины","калеки","кальсоны","каникулы","колготки","коллеги","крохи","курицы","куры","ладоши","ламы","лыки","макароны","мужчины","нападки","нары","непоседы","носилки","ножны","папы","папаши","таты","падлы","партизаны","погоны","поминки","посиделки","похороны","предтечи","работяги","разы","ребятки","румыны","самоубийцы","санки","убийцы","сапоги","сатаны","сироты","сливки","слуги","солдаты","старосты","сумерки","сутки","татары","телеса","хитрюги","четвереньки","шляпы","шмотки","яблоки","дядьки","дяденьки","зайки","кроссовки","малютки","малолетки","попки","турки","узы","хлопоты","шахматы"])),$e=new j
;Ze.forEach(e=>$e.addRaw(z(e)))
;const et=["х","ых","их","м","ым","им","х","ых","их","ми","ыми","ими","х","ых","их"],tt=["ям","ам","","","ями","ами","ях","ах"],nt=D(["вна","вца","вцы","пла","дца","дра","судна","рки","рцы","тлы","рна","тна","енца","десны","дёсны","рёбра","ребра","сосны"]),rt=D(["жи","ши","чи","ля","ли","чи","ри","ти","ди","сани","борщи","клещи","товарищи","плащи","прыщи","хрящи"]),st=D(["братья","брусья","деревья","донья","звенья","клинья","клочья","коленья","колосья","колья","комья","крылья","крючья","листья","лоскутья","лохмотья","перья","платья","поводья","прутья","стулья","сучья","хлопья","шилья"]),it=D(["ишки","дружки","тки","папочки","дедушки","дядюшки","батюшки","катанки","петрушки","шестерки"]),ut=D(["жки","шки","чки","рки","натки","хатки","ятки","етки","чётки","мки","нки","педки","илки"]),ct=D(["шок","щок","жок","зок","аток","яток","еток"])
;function at(e,t,n,r){const i=v(r),u=O(i),c=d(u),a=n+1;if(1===a||4===a&&!t.isAnimate())return r
;if(134217984&c)if(2===a||4===a){if(M(i,["овичи","евичи"]))return N(r)+"ей"
;if(M(i,["вны","полусотни"])&&"овны"!==i)return m(r,2)+"ен"}else if(5===a){
if(M(i,["дети","люди"])&&!M(i,["нелюди"]))return N(r)+"ьми";if(M(i,["вери","дочери"]))return[N(r)+"ями",N(r)+"ьми"]}
const o=t.getGender(),h=i.endsWith("цы")?N(r):te(r,i),f=G(i,ge)&&(t.isASurname()||o===s.COMMON)&&!G(i,qe),l=3*Math.min(Math.round(et.length/3-1),a-2)
;if(f||i.endsWith("ничьи"))return r+et[l];if(i.endsWith("ые"))return m(r,2)+et[l+1]
;if(i.endsWith("ие")||G(i,Q))return h+et[l+2];if(a>2&&4!==a){const s=2,u=s*Math.min(Math.round(tt.length/s-1),a-3)
;return G(i,Ge)?N(r)+tt[u]:e.sd.hasStressedEndingPlural(t,n).includes(!0)?W(h)+tt[u+1]:h+tt[u+1]}{
const c=t.getDeclension(),a=()=>{const s=v(h),u=["жки","шки","чки","ножны"]
;if(M(s,["кн","кл","дк","нк","пк","зк","рк","тк","вк","лк","мк"])&&!M(i,["сумерки"])||"зл"===s||M(i,u)&&e.sd.hasStressedEndingPlural(t,n).includes(!0)){
const e=O(h);return N(h)+B("о",e)+e}if(G(i,nt)&&!i.endsWith("недра")||M(i,u)){const e=_(r,2);return m(r,2)+B("е",e)+e}
if(M(i,["сестры","сёстры","серьги"])){const e=_(r,2);return("ь"===_(i,3)?W(m(r,3)):W(m(r,2)))+B("ё",e)+e}
if(M(s,["льц","сьм","деньг","ьк","йк","дьб"])){const e=O(h);return m(h,2)+B("е",e)+e}
return M(i,["сла","слы"])?N(h)+"ел":h};if([3,0].includes(c)){if(i.endsWith("и"))return N(r)+"ей"
;if(["гроздья"].includes(i))return N(r)+"ев"}const f=_(i,3);if(s.FEMININE!==o){const e=z(i),n=Qe.hasRaw(e)
;if(n&&Xe.has(i))return N(r)+"ов";if(n&&Ye.has(i)&&!t.isAName())return[a(),N(r)+"ов"]
;if(n&&Ke.has(i))return[N(r)+"ов",a()]
;if(o===s.COMMON&&!M(i,ve)&&!C("жшч",f)||$e.hasRaw(e)&&Ze.has(i)||t.isAName()&&o===s.MASCULINE&&t.lower().endsWith("а")||"барин"===t.lower())return a()
;switch(u){case"и":case"я":
if(G(i,rt)||"щи"===i||ve.includes(i)||t.lower().endsWith("ь")&&!M(t.lower(),["зять","деверь"])){
return("ь"===O(N(i))?m(r,2):N(r))+"ей"}
if("и"===u)return i.endsWith("ульи")?N(r)+"ев":i.endsWith("ьи")?s.MASCULINE===o?N(r)+"ёв":m(r,2)+"ей":["ча","кле","холу","ху"].includes(N(i))?N(r)+"ёв":i.endsWith("ищи")?a():i.endsWith("мессии")?N(r)+"й":S(p,_(i,2))?N(r)+"ев":!G(i,ut)||s.MASCULINE===o&&!G(W(i),it)||G(t.lower(),ct)?N(r)+"ов":a()
;if(G(i,st))return N(r)+"ев";if(M(i,["зятья","кумовья","деверья","края","острия"]))return N(r)+"ёв"
;if(M(i,["ья","ия"]))return s.MASCULINE===o?m(r,2)+"ей":m(r,2)+"ий";break;case"а":
return M(i,["семена","стремена"])?m(r,3)+"ян":i.endsWith("мена")?m(r,3)+"ён":t.lower().endsWith("яйцо")?B("яиц",N(r)):i.endsWith("нца")?[a(),N(r)+"ев"]:G(i,Je)?N(r)+"ов":a()
;case"ы":return M(i,["ницы","лицы","пицы","бицы"])?N(r):i.endsWith("цы")?N(r)+"ев":N(r)+"ов";default:
if(i.endsWith("не"))return a()}}if(i.endsWith("йки"))return m(r,3)+"ек";if(i.endsWith("ки")){if("ь"===f){const e=O(N(r))
;return m(r,3)+B("е",e)+e}if(C("жшч",f))return a();if(S(A,f))return m(r,2)+"ок"}if(ve.includes(i))return N(r)+"ей"
;if(M(i,["аи","ои","еи","эи","уи"]))return N(r)+"й";if("свечи"===i)return[N(r),N(r)+"ей"]
;if("пригоршни"===i)return[N(r)+"ей",m(r,2)+"ен"];if("тихони"===i)return[m(r,2)+"нь",N(r)+"ей"]
;if(M(i,["ьи","ии"]))return e.sd.hasStressedEndingSingular(t,n).includes(!0)?m(r,2)+"ей":m(r,2)+"ий"
;if(i.endsWith("ни")&&S(A,_(i,3)))return["барышни","боярышни","деревни"].includes(i)?m(r,2)+"ень":i.endsWith("кухни")?m(r,2)+"онь":"сотни"===i?[m(r,2),m(r,2)+"ен"]:m(r,2)+"ен"
;if(v(h).endsWith("ийк"))return m(h,2)+"ек";if(h.length===i.length-1&&G(i,Ge)){if(C("ьй",v(_(h,2)))&&!t.isAnimate()){
const e=O(h);return m(h,2)+B("е",e)+e}return M(i,["земли","петли","пли","вли"])?N(h)+"ель":h+"ь"}return a()}}class ot{
sd=function(){let e;const t=new V;function n(n,r){const s=r.split(",");for(let r of s)e.text=r,t.put(e,n)}return e={
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
const i=n.text(),u=e.indexOf(r);if(n.isIndeclinable())return i;if(n.isPluraleTantum())return at(t,n,u,i)
;if(s)return at(t,n,u,s);switch(n.getDeclension()){case-1:return i;case 0:return de(t,n,u);case 1:return Ue(t,n,u)
;case 2:return Se(t,n,u);case 3:return Ee(t,n,u)}}(t,n,r,s);if(i instanceof Array)return i;return[i]
}(this,U.create(t),n,r)}pluralize(e){const t=U.create(e);return t.isPluraleTantum()?[t.text()]:De(this,t)}
getLocativeForms(e){const t=this,n=U.create(e),r=n.getDeclension();if(r&&r>=0){const e=be.get(we(n))
;if(e instanceof Array)return e.map(e=>new c(function(e){switch(1+(e>>3&7)){case h.V:return"в";case h.VO:return"во"
;case h.NA:return"на"}}(e),function(e,t,n,r){const s=5;switch(t){case 0:return de(e,n,s);case 1:return Le(e,n,r);case 2:
return Se(e,n,s);case 3:return Ee(e,n,s)}}(t,r,n,l(e)),e>>6))}return[]}}
export{e as CASES,t as Case,ot as Engine,s as Gender,U as Lemma,c as LocativeForm,a as LocativeFormAttribute,V as StressDictionary,L as createLemma,y as createLemmaOrNull};
//# sourceMappingURL=RussianNouns.mjs.map
