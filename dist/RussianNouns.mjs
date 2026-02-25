/*!
  RussianNounsJS v3.0.0-alpha.2-SNAPSHOT
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
V:1,VO:2,NA:3});function h(e,t,n){return n<<6|(e-1&7)<<3|t-1&7}function f(e){return 1+(7&e)}function l(e){
const t=e.replaceAll("ё","е");let n=t.length%2,r=1,s=5381;function i(){s=(33*s+(255&n))%4294967296,n>>=8,r-=8}
for(let e of t){const t=e.charCodeAt(0)-1072&31;n|=t<<r,r+=5,r>=8&&i()}r>0&&i();const u=t.charCodeAt(0)%2
;return 2*(2147483647&s)+u}function d(e){const t=e.charCodeAt(0)-1072;return 33===t?32:t===(31&t)?1<<t:0}
function E(e,t){return 0!==(e&d(t))}const S=3892855073,p=66567902,g=66567390;function w(e){return E(S,e)}function A(e){
return e.split("").filter(w).length}function b(e){return e.replaceAll("ё","е").replaceAll("Ё","Е")}function W(e,t){
return e.substring(0,e.length-t)}function m(e,t){return e.substring(e.length-t)}function _(e){return W(e,1)}
function O(e){return I(e,1)}function I(e,t){return e[e.length-t]||""}function C(e,t){return 1===t.length&&e.includes(t)}
function N(e,t){return t.some(t=>e.endsWith(t))}class x{constructor(e){e instanceof x?(this._txt=e._txt,this._lc=e._lc,
this._hash=e._hash,this._flags=e._flags):(e.pluraleTantum?this._flags=5:this._flags=1+r.indexOf(e.gender),
this._txt=e.text,this._lc=e.text.toLowerCase(),this._hash=l(this._lc),this._flags|=8*(1&e.indeclinable),
this._flags|=16*(1&e.animate),this._flags|=32*(1&e.surname),this._flags|=64*(1&e.name),this._flags|=128*(1&e.transport),
this._flags|=u(16)*(2+function(e,t,n,r){if(t)return-2;if(r)return-1;const s=O(e);switch(n){case 1:
return"а"===s||"я"===s?2:E(p,s)?-1:3;case 2:return"а"===s||"я"===s?2:"путь"===e?0:1;case 3:
return["дитя","полудитя"].includes(e)?0:"мя"===m(e,2)?3:1;case 4:return"а"===s||"я"===s?2:"и"===s?-1:1;default:return-2}
}(this._lc,e.pluraleTantum,T(this),e.indeclinable)))}static create(e){if(e instanceof this)return e;const t=M(e)
;if(t)throw new Error(t);return Object.freeze(new this(e))}static createOrNull(e){
return null===M(e)?Object.freeze(new this(e)):null}equals(e){
return e instanceof x&&this._flags===e._flags&&this.lower()===e.lower()}text(){return this._txt}lower(){return this._lc}
isPluraleTantum(){return 5==(7&this._flags)}getGender(){const e=T(this);if(e>=1&&e<=4)return r[e-1]}isIndeclinable(){
return!!(8&this._flags)}isAnimate(){return!!(16&this._flags)||this.isASurname()||this.isAName()}isASurname(){
return!!(32&this._flags)}isAName(){return!!(64&this._flags)}isATransport(){return!!(128&this._flags)}getDeclension(){
return(this._flags>>16)-2}getSchoolDeclension(){const e=this.getDeclension();return 1===e?2:2===e?1:e}}function T(e){
return 7&e._flags}function y(e,t){const n=new x(e);return n._txt=t,n._lc=t.toLowerCase(),n._hash=l(n.lower()),
Object.freeze(n)}function M(e){if(null==e)return"No parameters specified."
;for(let t of["pluraleTantum","indeclinable","animate","surname","name","transport"]){
if((e=>null!=e&&"boolean"!=typeof e)(e[t]))return t+" must be boolean."}
if(null==e.text)return"A cyrillic word required.";if(!e.pluraleTantum){
if(null==e.gender)return"A grammatical gender required.";if(!r.includes(e.gender))return"Bad grammatical gender."}
return null}function R(e){return x.create(e)}function U(e){return x.createOrNull(e)}
const k=i([11720389,548,1024,1479,2622,2867,1222,2642,264,1328,137,123,397,65542229,212447047,31729170,8094836,1056,21701789,35520559,40358,21819,28248,119786,63892,31809,7356,74383,72369,5945,28902,90120738,21187517,91925642,3054826,1600765,65934,30948851,5569212,4205640,5412804,6787095,9749916,3940084,1511466,1303038,16090470,1376628,49919694,3827522,37915959,14032615,28701924,224587434,637275762,51079457,391103676,24108070,158999424,232633267,6058815,66599250,692781441,816204112,55209380,72754,90006,80058,45564,67845,42548,27193,21401,139393,750335,170896,4424,1566,6264,154969,17292,17229,175112,83011,117872,4183,13065,108972,108088,343663,66210,334,17090,380271,283272,59007,35796,230801,1067156,19992,157124,12433,252644,2626,23776,630482,531296,304718,90891,726,23116,47653,30493,167310,50156,123071,477118,241821,55660,908992,534269,205157,11218,2490,660,66391,46856,847526,68710,8450,36630,15642,109864,41716,354482,79820,51876,97325,5506,46436,191803,3957,40876,126323,2347821,338490,73216,475569,87602,29642,4220,10760,16896,50156,17424,35178,167244,126786,33643,30488,65045,35961,51453,55660,4,152461,138332,1958,34200,3709,61381,17424,30158,80591,11218,44099,260487]),j=i([11720389,548,1024,1060,4,5904,1848,4404,330555234,4691346,3365076,1045362,7414584,960432,10564312,253286,16178203,4357,4355,11350,31120,5248,40591,62367,54057,50487,13069,3664,39764,10263,3002,5810,8844,24551,4091,56761,21785,30553,55147139,15960625,1933097,12258067,16302047,54210486,45688435,1659767,4813249,33577763,2501798,10056946,672528,14209351,2012340,1655412,4652736,62568,148698,21186,71129124,260014161,108045611,1007583269,2026464,22799532,750068913,1499532,1285428194,74598,22348,6599,132273,309821,156816,397448,179394,148036,100257,21779,11218,36631,345954,50442,104394,2724,112115,30690,10552,31377,11286,7168,14612,51480,116537,192258,163145,65604,97951,1363157,212810,431243,2622,425588,275284,150351,570568,244701,16659,26136,130134,11040,159389,728373,3476,726,1290392,224730,189158,11218,2490,10750,21608,143747,65974,664563,84036,16283,17424,5758,45080,33066,1782,90658,37101,56107,233163,14216,5518,179264,2525,146957,111342,80594,2309,4217,25432,26905,29980,518951,1458289,523705,4202,477865,149368,126310,47828,212678,22744,269176,179119,4399,35997,69696,41777,41,127336,4202,73153,46372,114255,126869,23630,11218])
;class L{constructor(){this._filter=new Uint8ClampedArray(256)}addInteger(e){this.addRaw(z(e))}hasInteger(e){
return this.hasRaw(z(e))}addRaw(e){const t=2047&e,n=t>>>3;this._filter[n]=this._filter[n]|1<<7-t%8}hasRaw(e){
const t=2047&e;return!!(this._filter[t>>>3]>>>7-t%8&1)}clone(){return function(e){const t=new L
;return t._filter=Uint8ClampedArray.from(e),t}(this._filter)}}function z(e){return e>>>22&2047^e>>>11&2047^2047&e}
function V(e){const t=e.padStart(3,"а");return(7&t.charCodeAt(0))<<8|(15&t.charCodeAt(1))<<4|15&t.charCodeAt(2)}
const P=function(){const e=new L;return k.forEach(t=>e.addInteger(t)),j.forEach(t=>e.addInteger(t)),Object.freeze(e)}()
;function D(){const e=new Map,t=P.clone(),r=function(e){return 4294967296*(31&e._flags)+e._hash},s=function(e){
return e.lower().indexOf("ё")+1&255},i=t=>{const n=65504&t._flags,i=(t=>{const n=r(t),s=e.get(n)
;return s instanceof Array?s:[]})(t).filter(e=>(e[0]&n)<=n),u=i.filter(e=>e[0]>>16===s(t))
;return u.length?u[0][1]:i.length?i[0][1]:void 0};this.put=function(n,i){
const u=i.split("-"),c=(e,t)=>e.length!==t||e.split("").some(e=>!"SsbeE".includes(e))
;if(2!==u.length||c(u[0],7)||c(u[1],6))throw new Error("Bad settings format.");const a=x.create(n),o=r(a);let h=e.get(o)
;h instanceof Array||(h=[],e.set(o,h));const f=65535&a._flags|s(a)<<16,l=h.find(e=>f===e[0]);l?l[1]=i:h.push([f,i]),
t.addInteger(a._hash)};const u=e=>{switch(e){case"E":return[!0];case"e":return[!0,!1];case"b":case"s":return[!1,!0]
;default:return[!1]}};this.hasStressedEndingSingular=function(e,r){if(t.hasInteger(e._hash)){const t=n(r);if(t>=0){
let n=i(e);if(n){const e=n.split("-")[0];return u(e[t])}if(2===T(e)){if(k.has(e._hash))return u("SEESEEE"[t])
;if(j.has(e._hash))return u("SEEEEEE"[t])}}}return[]},this.hasStressedEndingPlural=function(e,r){
if(t.hasInteger(e._hash)){const t=n(r);if(t>=0&&t<6){let n=i(e);if(n){const e=n.split("-")[1];return u(e[t])}
if(2===T(e)&&(k.has(e._hash)||e.isAnimate()&&j.has(e._hash)))return u("E")}}return[]}}function v(e){let t=new Map
;for(let n of e){let e=t;for(let t=n.length-1;t>=0;t--){const r=n.charCodeAt(t);if(t>0){const t=e.get(r);if(0===t)break
;void 0===t&&e.set(r,new Map),e=e.get(r)}else e.set(r,0)}}return t}function F(e,t){let n=t
;for(let t=e.length-1;t>=0;t--){const r=e.charCodeAt(t);if(!n.has(r))return!1;{const e=n.get(r);if(0===e)return!0;n=e}}}
function B(e){let t=new Array(e.length);for(let n=0;n<e.length;n++){let r=e.charCodeAt(n)
;r>=1040&&r<=1071?r+=32:r>=1024&&r<=1039&&(r+=80),t[n]=r}return String.fromCharCode.apply(null,t)}function q(e,t){
return t===t.toUpperCase()?e.toUpperCase():e}
const G=v(["ое","нький","ский","ской","лстой","отой","утой","евой","овой","живой"]),H=v(["ее","ое","нький","ский","ской","лстой","отой","утой"]),J=v(["евой","овой","отой","живой"]),X=v(["шний","жний","щий","ший","жий","чий"]),Y=["божий","ажий","яжий","ужий","южий","бульдожий","кабарожий","медвежий","носорожий","миножий"],K=v(Y),Q=v(Y.map(e=>W(e,2)+"ьи")),Z=new Set(["бубен","бугор","ветер","вошь","вымысел","горшок","деготь","дёготь","дятел","домысел","замысел","кашель","коготь","лапоть","лоб","локоть","ломоть","молебен","мох","ноготь","овен","пепел","пес","пёс","петушок","помысел","порошок","промысел","псалом","пушок","ров","рожь","рот","сон","стебель","стишок","угол","умысел","хребет","церковь","шов","ковер","овес","костер"].map(l)),$=new L
;Z.forEach(e=>$.addInteger(e))
;const ee=v(["овёс","ковёр","костёр","шатер","шатёр","козел","козёл","котел","котёл","орел","орёл","осел","осёл","узел","уголь","чок","ешок","хол"])
;function te(e,t){const n=O(t);if(E(-402111711,n)){if(E(S,I(t,2))){const n=W(e,2);return F(t,K)?n+q("ь",n):n}
if("й"!==n)return _(e)}return e}const ne=["ясень","бюллетень","олень","тюлень","гордень","пельмень","ячмень"]
;function re(e,t,n){const r=e.text(),s=O(t),i=d(s);let u;return-133667019&i&&(-402111711&i?u=function(e,t,n){
const r=I(t,2);return"ь"===r||"о"===n&&E(2504708,r)?_(e):te(e,t)}(r,t,s):"к"===s?u=function(e,t,n){
return e.length>=4&&N(t,["рёк","нёк","лёк"])&&!1!==n?W(e,2)+"ьк":t.endsWith("ёк")&&E(S,I(t,3))?W(e,2)+"йк":void 0
}(r,t,n):"ь"===s?u=function(e,t,n){
return Z.has(e._hash)||F(n,ee)?W(t,3)+I(t,2):n.endsWith("ень")&&2===T(e)&&!N(n,ne)?W(t,3)+"н":_(t)
}(e,r,t):(["лёд","лед","лён"].includes(t)||"лев"===t&&e.isAnimate())&&(u=W(r,2)+q("ь",I(r,2))+O(r))),
u||(u=function(e,t,n){
return!!(199680&n)&&F(t,ee)&&!["новосел","новосёл"].includes(t)||!!(2571270&n)&&($.hasInteger(e._hash)&&Z.has(e._hash)||e.isAnimate()&&t.endsWith("посол"))
}(e,t,i)?W(r,2)+O(r):r),u}function se(e,t){const n=_(e),r=_(t.lower());if("а"===O(r))return n
;if(N(r,["зне","жне","гре","спе","мудре"])||m(_(r),3).split("").every(e=>E(g,e))||t.isAName())return n
;if("ле"===m(r,2)){const e=I(r,3);return E(S,e)||"л"===e?_(n)+"ь":n}
return E(S,O(r))&&"и"!==O(r)?E(S,O(_(r)))?W(e,2)+"й":N(t.lower(),["месяц"])?n:W(e,2):n}
const ie=v(["лапоток","желток","нишок","ришок","ишек"]),ue=["поток","приток","переток","проток","биоток","электроток","восток","водосток","водоток","воток","знаток"],ce=["инок","исток","обморок","порок","пророк","сток","урок"]
;function ae(e){
return N(e,["чек","шек"])&&e.length>=6||F(e,ie)||e.endsWith("ок")&&!e.endsWith("шок")&&!ce.includes(e)&&!N(e,ue)&&!E(S,I(e,3))&&(E(S,I(e,4))||N(W(e,2),["ст","рт"]))&&e.length>=4
}function oe(e,t,n){return(e.length?e:[!1]).map(e=>n(e?b(t):t,e))}const he=0,fe=3,le={"дочь":"дочерь","мать":"матерь"}
;function de(e,t,n){const r=t.text(),s=t.lower();if(![he,fe].includes(n)&&Object.keys(le).includes(s)){
return de(e,y(t,le[s]),n)}let i=re(t,s);if(function(e){
return e.endsWith("полночь")||e.startsWith("пол")&&E(134217984,O(e))&&A(e)>=2}(s)&&(i="полу"+i.substring(3)),
"мя"===m(s,2))switch(n){case he:case fe:return r;case 1:case 2:case 5:case 6:return i+"ени";case 4:return i+"енем"
}else switch(n){case he:case fe:return r;case 1:case 2:case 5:case 6:return i+"и";case 4:
return N(s,["вошь","рожь","церковь"])?r+"ю":i+"ью"}}function Ee(e,t,n){const r=t.text(),s=t.lower()
;if(s.endsWith("путь"))return 4===n?_(r)+"ём":de(e,t,n);if(!s.endsWith("дитя"))throw new Error("unsupported");switch(n){
case 0:case 3:return r;case 1:case 2:case 5:case 6:return r+"ти";case 4:return[r+"тей",r+"тею"]}}function Se(e,t,n){
const r=t.text(),s=t.lower(),i=re(t,s),u=B(i),c=_(r),a=_(s),o=()=>"я"===O(s),h=()=>s.endsWith("ая")&&!(2===A(s)||E(S,O(u))),f=()=>s.endsWith("яя")&&!(2===A(s)||E(S,O(u))),l=["жая","шая"]
;switch(n){case 0:return r;case 1:
return f()||N(s,l)?i+"ей":h()?i+"ой":t.isASurname()&&!s.endsWith("да")?c+"ой":s.endsWith("ничья")?c+"ей":o()||E(60818504,O(u))?c+"и":c+"ы"
;case 2:case 5:case 6:
return f()||N(s,l)?i+"ей":h()?i+"ой":t.isASurname()&&!s.endsWith("да")?c+"ой":"ия"===m(s,2)?c+"и":s.endsWith("ничья")?c+"ей":c+"е"
;case 3:return h()?i+"ую":f()?i+"юю":o()?c+"ю":c+"у";case 4:
return f()||N(s,l)?i+"ею":h()?[i+"ой",i+"ою"]:o()||C("жшчщц",O(u))&&!e.sd.hasStressedEndingSingular(t,n).includes(!0)?"и"===O(a)?c+"ей":[c+"ей",c+"ею"]:[c+"ой",c+"ою"]
}}const pe=v(["ов","ев","ёв","ин","ын"]),ge=function(e,t){let n=t;for(let t=0;t<e.length;t++){
const r=e.charCodeAt(t),s=n;n=new Map,n.set(r,s)}return n}("ы",pe);function we(e){
return e.filter((t,n)=>e.indexOf(t)===n)}function Ae(e){const t=1&e.lower().includes("ё")
;return 4294967296*((65535&e._flags)<<1|t)+e._hash}const be=Object.freeze(function(){const e=new Map,t={
gender:s.MASCULINE},n={gender:s.MASCULINE,animate:!0};function r(t,n,r,s,i){
const u=s.split(","),c=i instanceof Array?i:[2];for(let s of u){t.text=s;const i=Ae(x.create(t));let u=e.get(i)
;u||(u=[],e.set(i,u));for(let e of r)for(let t of c)u.push(h(e,t,n))}}const i=[o.V],c=[o.VO],a=[o.NA]
;r(t,u(0),i,"мозг,пруд,стог,таз,год"),r(t,u(0),c,"рот"),r(t,u(4),i,"год"),r(t,u(0),i,"гроб"),
r(t,u(0)|u(14),c,"гроб",[1]),r(t,u(1),i,"ад,бор,лес,порт,аэропорт,рай,сад,детсад,тыл,низ,хлев"),
r(t,u(2),i,"круг,полк,артполк,ряд,род,строй,лад"),r(t,u(3),a,"баз,берег,бережок,вал,кон,круг,луг,пол,яр"),
r(t,u(4),a,"век,день"),r(t,u(4),i,"час"),r(t,u(4),a,"корень"),r(n,u(5),a,"вор"),
r(t,u(5),a,"повод,бочок,борт,воз,горб,кол,мост,плот,сук,х"+String.fromCharCode(1091)+"й"),r(t,u(5),a,"крюк,болт",[1,2])
;const f=",мёд,мех,пар,пух";r(t,u(6),i,"дым,жир,мел,пушок"+f),r(t,u(7),a,"газ,клей,спирт"+f),
r(t,u(8),i,"бой,бред,быт,долг,плен,пыл,сок,ход,лад"),r(t,u(9),i.concat(a),"вид"),
r(t,u(9),a,"слух,счёт,ветер,ветр,свет"),r(t,u(10),a,"ход,бег,вес"),r(t,u(10)|u(12),a,"шаг"),r(t,u(11),a,"бал,пир"),
r(t,u(8),a,"дух,плав"),r(t,u(10)|u(12),a,"газ"),r(t,u(0),i,"глаз,зоб,нос,шкаф"),r(t,u(0),c,"лоб"),
r(t,u(5),a,"глаз,лоб,нос,шкаф,холм");let l="бок,верх,зад,угол";return r(t,u(1),i,l),r(t,u(5),a,l),
r(t,u(1)|u(13),i,"край"),r(t,u(5)|u(13),a,"край"),r(t,u(3),a,"лёд,мох,снег"),r(t,u(6),c,"лёд,лён,мох"),
r(t,u(6),i,"снег"),e
}()),We=new Set("клей,чай,дом,дух,дым,дымок,газ,год,горошек,жар,жир,квас,пар,пыл,род,рост,сахар,свет,сироп,смех,снег,снежок,сок,сор,спор,срок,соус,спирт,страх,суп,сыр,табак,творог,толк,торф,туман,убыток,укроп,уксус,ход,цемент,чеснок,шаг,шик,шиповник,шоколад,шорох,шум,яд".split(",")),me=new L
;We.forEach(e=>me.addInteger(l(e)))
;const _e=v(["й","ие","иё"]),Oe=v(["воробей","муравей","ручей","соловей","улей"]),Ie=v(["мой","ной","дой","шой","жой","рзой","осой","хой","латой","витой","литой","питой","житой","отой","утой","ятой","лагой","рагой","огой","угой","лубой","любой","илой","ылой","злой","малой","овой","евой","живой","ской","акой","укой","нний","ский","йкий","цкий","зкий","ткий","лкий","мкий","хкий","оркий","аркий","яркий","ький","ёкий","бокий","оокий","cокий","токий","ликий","дикий","укий","ыкий","який","пкий","дкий","бкий","нкий","жкий","чкий","гкий","овкий","авкий"])
;function Ce(e,t){return"ый"===m(t,2)||(t.endsWith("кривой")||F(t,Ie))&&A(t)>=2}
const Ne=v(["ий","ие","чье","тье","дье","вье","бье","жалованье","енье","ружье","божье","верье","мужье"]),xe=v(["вое","лое","мое","ное","рое","тое","той","ый"])
;function Te(e,t,n){const r=t.text(),s=B(r),i=O(s),u=e.sd.hasStressedEndingSingular(t,n);let c=re(t,s,u[0]),a=_(r)
;const o=Me(s);o&&(c="полу"+c.substring(3),a="полу"+a.substring(3));let h=B(c)
;const l=()=>o&&s.endsWith("я")||Ue(s),d=F(s,_e),E=()=>F(s,Oe)?_(a)+q("ь",O(a)):a,S=()=>C("чщ",O(h));function p(e){
return!t.isAnimate()&&me.hasInteger(t._hash)&&We.has(s)&&("й"===i?e.push(_(r)+q("ю",O(r))):e=e.concat(oe(u,c,e=>e+q("у",O(e))))),
e}switch(n){case 0:return r;case 1:switch(i){case"и":case"ы":if(o)return ye(e,t,n,s);break;case"й":case"е":
if(d&&t.isASurname()||Ce(0,s)||F(s,G))return c+"ого";if(F(s,X)||s.endsWith("ее"))return c+"его";case"ё":case"я":case"ь":
if(d){return p([E()+"я"])}if(l()&&!S())return c+"я";break;case"ц":return se(r,t)+"ца";case"к":if(ae(s))return _(a)+"ка"
;break;case"о":if(N(s,["шко"])&&2===T(t))return a+"и"}let g
;return g=t.isASurname()||-1===h.indexOf("ё")?[c+"а"]:oe(u,c,e=>e+"а"),p(g);case 2:switch(i){case"и":case"ы":
if(o)return ye(e,t,n,s);break;case"й":case"е":if(d&&t.isASurname()||Ce(0,s)||F(s,G))return c+"ому"
;if(F(s,X)||s.endsWith("ее"))return c+"ему";case"ё":case"я":case"ь":if(d)return E()+"ю";if(l()&&!S())return c+"ю";break
;case"ц":return se(r,t)+"цу";case"к":if(ae(s))return _(a)+"ку"}
return t.isASurname()||-1===h.indexOf("ё")?c+"у":oe(u,c,e=>e+"у");case 3:
return 3===T(t)||C("иы",i)&&o?r:t.isAnimate()?Te(e,t,1):r;case 4:switch(i){case"и":case"ы":if(o)return ye(e,t,n,s);break
;case"й":case"е":case"ё":case"я":case"ь":if(d&&t.isASurname()||F(s,H))return F(s,xe)?c+"ым":c+"им"
;if(Ce(0,s))return"и"===I(s,2)||s.endsWith("хой")?c+"им":c+"ым";if(F(s,J))return c+"ым";if(F(s,X))return c+"им"
;if(d)return E()+"ем";if(s.endsWith("це"))return r+"м";break;case"ц":return oe(u,r,(e,n)=>n?se(e,t)+"цом":se(e,t)+"цем")
;case"к":if(ae(s))return _(a)+"ком";break;case"н":case"в":if(t.isASurname()&&F(s,pe))return r+"ым"}
return l()||C("жшчщ",O(h))?oe(u,c,(e,t)=>t?e+"ом":e+"ем"):t.isASurname()||-1===h.indexOf("ё")?c+"ом":oe(u,c,e=>e+"ом")
;case 6:if("полпути"===s)return r;const w=be.get(Ae(t));if(w){return we(w.map(e=>f(e))).map(n=>Re(e,t,n))}case 5:
switch(i){case"и":if("полпути"===s)return r;case"ы":if(o)return ye(e,t,n,s);break;case"й":case"е":case"ё":case"я":
case"ь":if(d&&t.isASurname()||Ce(0,s)||F(s,G))return c+"ом";if(F(s,X)||s.endsWith("ее"))return c+"ем"
;if(N(s,["воробей"])){const e=_(a);return e+q("ье",O(e))}
if(F(s,Ne)&&!N(s,["запястье","здоровье","изголовье","платье"]))return a+"и";if("й"===i||"иё"===m(s,2))return E()+"е"
;break;case"ц":return se(r,t)+"це";case"к":if(ae(s))return _(a)+"ке"}
return t.isASurname()||-1===h.indexOf("ё")?c+"е":oe(u,c,e=>e+"е")}}function ye(e,t,n,r){
const s=()=>"полминуты"!==r?"полу"+t.text().substring(3):t.text();if("полпути"===r){return Ee(e,y(t,_(s())+"ь"),n)}
if(r.endsWith("зни")||r.endsWith("сти")){return de(e,y(t,_(s())+"ь"),n)}
return Se(e,y(t,_(s())+("ни"===m(r,2)?"я":"а")),n)}function Me(e){
if(e.startsWith("пол")&&E(2550137089,O(e))&&"л"!==e[3]&&A(e)>=2){let t=e.substring(3),n=t.search(/[а-яё]/)
;return n>=0&&E(p,t[n])}return!1}function Re(e,t,n){if(2===n){const e=t.text(),n=t.lower();let r=re(t,n),s=_(e)
;const i=Me(n)&&n.endsWith("я")||Ue(n);return"й"===O(n)?b(s)+"ю":i?b(r)+"ю":ae(n)?b(_(s))+"ку":b(r)+"у"}
if(1===n)return Te(e,t,5)}function Ue(e){return"ь"===O(e)&&!e.endsWith("господь")||C("её",O(e))&&!N(e,["це","же"])}
const ke=new L,je=Object.freeze([[[2,void 0],{"болгарин":["болгары"],"господин":["господа"],"дядя":["дяди","дядья"],
"зуб":["зубы","зубья"],"клок":["клочья","клоки"],"князь":["князи","князья"],"кол":["колы","колья"],"месяц":["месяцы"],
"полдень":["полдни","полудни"],"татарин":["татары"],"хозяин":["хозяева"],"цветок":["цветки","цветы"],"черт":["черти"],
"чёрт":["черти"]}],[[2,!0],{"кондуктор":["кондуктора","кондукторы"],"кум":["кумовья"],"муж":["мужья","мужи"]
}],[[1,void 0],{"гроздь":["грозди","гроздья"],"курица":["курицы","куры"],"стая":["стаи"],"щека":["щёки"],
"береста":["берёсты"],"верста":["вёрсты"],"десна":["дёсны"],"жена":["жёны"],"звезда":["звёзды"],
"кинозвезда":["кинозвёзды"],"медсестра":["медсёстры"],"метла":["мётлы"],"пчела":["пчёлы"],"сестра":["сёстры"],
"слеза":["слёзы"]}],[[3,void 0],{"брюхо":["брюхи"],"колено":["колена","колени","коленья"],"древо":["древа","древеса"],
"ухо":["уши"],"око":["очи"],"дно":["донья"],"чудо":["чудеса","чуда"],"небо":["небеса"],"бревно":["брёвна"],
"ведро":["вёдра"],"веретено":["веретёна"],"весло":["вёсла"],"гнездо":["гнёзда"],"зерно":["зёрна"],"знамя":["знамёна"],
"колесо":["колёса"],"облачко":["облачка"],"озеро":["озёра"],"полсотни":["полусотни"],"ребро":["рёбра"],
"ремесло":["ремёсла"],"седло":["сёдла"],"село":["сёла"]}]])
;for(const e of je)Object.keys(e[1]).map(e=>ke.addInteger(l(e)))
;const Le=["зять","деверь","друг","брат","собрат","стул","брус","обод","полоз","струп","подмастерье","якорь","перо","шило"],ze=new Set(["берег","бок","борт","век","вес","веер","вексель","вечер","глаз","голос","город","доктор","дом","детдом","егерь","жемчуг","катер","колокол","концлагерь","корм","короб","кузов","купол","лес","луг","мастер","номер","пояс","провод","рог","сахар","снег","сорт","стог","счет","счёт","спецсчет","спецсчёт","субсчет","субсчёт","терем","том","холод","цвет","череп"]),Ve=v(["округ","остров","отпуск","паспорт","парус","поезд","повар","погреб","рукав","цех","юнкер"]),Pe=new Set(["адрес","договор","буфер","ворох","директор","инспектор","инструктор","корпус","крейсер","орден","ордер","прожектор","пропуск","род","свитер","сервер","тенор","тон","трактор","тормоз","ветер","верх","китель","мех","хлеб","юнкер","ястреб"]),De=new Set(["бункер","вымпел","год","образ","омут","токарь","тополь","шторм","штуцер"])
;function ve(e,t){const n=[],r=t.text(),s=B(r),i=e.sd.hasStressedEndingPlural(t,0);Object.freeze(i)
;const u=re(t,s,i[0]),c=B(u);if(s.endsWith("яя"))return n.push(W(r,2)+"ие"),we(n);const a=n=>{
const r=e.sd.hasStressedEndingPlural(t,0).map(e=>!e)
;return r.length?r.map(e=>e?1===c.replace(/[^её]/g,"").length?n((e=>{
const t=Math.max(e.toLowerCase().lastIndexOf("е"),e.toLowerCase().lastIndexOf("ё")),n=q("ё",e[t])
;return e.substring(0,t)+n+e.substring(t+1)})(u)):n(u):n(b(u))):[n(u)]
},o=T(t),h=t.getDeclension(),f=("й"===O(s)||E(S,O(s)))&&E(S,O(_(s)))?_(r):u,l=()=>(s.endsWith("евич")||s.endsWith("евна"))&&s.indexOf("ье")>=0
;function d(){const e=f,t=B(e).indexOf("ье"),n=q("и",e[t]);return e.substring(0,t)+n+e.substring(t+1)}function p(){
E(60818504,O(c))||C("яйь",O(s))||N(s,["сосед"])?l()?(n.push(d()+"и"),
n.push(f+"и")):Array.prototype.push.apply(n,oe(i,f,e=>e+"и")):"ц"===O(s)?n.push(se(r,t)+"цы"):l()?(n.push(d()+"ы"),
n.push(f+"ы")):Array.prototype.push.apply(n,oe(i,f,e=>e+"ы"))}const g=function(e,t){if(ke.hasInteger(e._hash)){
const n=T(e),r=e.isAnimate();for(const[e,s]of je){const i=e[0],u=e[1]
;if(n===i&&(null==u||u===r)&&s.hasOwnProperty(t))return s[t].slice()}}}(t,s);if(g)return g
;const w="ь"===O(c)?u:"к"===O(c)?_(u)+"чь":"г"===O(c)?_(u)+"зь":"й"===O(s)?_(r):N(s,["рь","ль"])?u:u+"ь";switch(h){
case-1:n.push(r);break;case 0:if("путь"===s)n.push("пути");else{if(!s.endsWith("дитя"))throw new Error("unsupported")
;n.push(W(r,3)+"ети")}break;case 1:if(Le.includes(s))n.push(w+"я");else if(2===o){
const e=["крюк","лист","лоскут","повод","прут","сук","учитель","флигель","штабель"],c=["клин","колос","ком","край","соболь"]
;"сын"===s?(n.push("сыновья"),p()):"человек"===s?(n.push("люди"),p()):e.includes(s)||"соболь"===s&&t.isAnimate()?(p(),
n.push(w+"я")):c.includes(s)?n.push(w+"я"):ze.has(s)||F(s,Ve)||Pe.has(s)||De.has(s)?(De.has(s)&&p(),
Ue(s)?Array.prototype.push.apply(n,a(e=>e+"я")):i.includes(!0)?n.push(b(u)+"а"):n.push(u+"а"),
Pe.has(s)&&p()):(s.endsWith("анин")&&s.length>5||s.endsWith("янин"))&&!t.isAName()||["барин","боярин"].includes(s)?(n.push(W(r,2)+"е"),
"барин"===s&&n.push(W(r,2)+"ы")):["цыган"].includes(s)?n.push(r+"е"):"щенок"===s?(n.push(W(r,2)+"ки"),
n.push(W(r,2)+"ята")):!s.endsWith("ребёнок")&&!s.endsWith("ребенок")||s.endsWith("жеребёнок")||s.endsWith("жеребенок")||s.endsWith("ястребёнок")||s.endsWith("ястребенок")?(s.endsWith("ёнок")||s.endsWith("енок"))&&t.isAnimate()?n.push(W(r,4)+"ята"):s.endsWith("ёночек")&&t.isAnimate()?n.push(W(r,6)+"ятки"):s.endsWith("онок")&&C("жшч",I(s,5))&&t.isAnimate()?n.push(W(r,4)+"ата"):ae(s)?n.push(W(r,2)+"ки"):F(s,X)?N(s,Y)?n.push(W(r,2)+"ьи"):n.push(_(r)+"е"):Ce(0,s)?s.endsWith("ый")||s.endsWith("ий")?n.push(_(r)+"е"):s.endsWith("ой")&&!N(s,["хой","ской"])?n.push(W(r,2)+"ые"):n.push(W(r,2)+"ие"):s.endsWith("его")?n.push(W(r,3)+"ие"):["воробей","муравей","ручей","соловей","улей","жеребей","ирей","репей","чирей"].includes(s)?n.push(W(r,2)+"ьи"):p():n.push(W(r,7)+"дети")
}else if(3===o)if(N(s,["ко","чо"])&&!N(s,["войско","облако"]))n.push(_(r)+"и");else if(s.endsWith("имое"))n.push(u+"ые");else if(s.endsWith("ее"))n.push(u+"ие");else if(s.endsWith("ое"))N(c,["г","к","ж","ш","х"])?n.push(u+"ие"):n.push(u+"ые");else if(N(s,["ие","иё"]))n.push(W(r,2)+"ия");else if(N(s,["ье","ьё"])){
const e=W(r,2),t=["безделье","варенье","воскресенье","жалованье","запястье","застолье","затишье","здоровье","зелье","изголовье","новоселье","одночасье","печенье","платье","побережье","поголовье","подворье","подземелье","подполье","поместье","предплечье","раздумье","сиденье","средневековье","увечье","угодье","устье"].includes(s)
;"е"!==O(s)||t||n.push(e+"ия"),n.push(e+"ья")
}else N(s,["дерево","звено","крыло"])?n.push(u+"ья"):N(s,["ле","ре"])?n.push(u+"я"):s.endsWith("судно")&&t.isATransport()?n.push(W(r,2)+"а"):(Array.prototype.push.apply(n,a(e=>e+"а")),
N(s,["щупальце"])&&p());else n.push(u+"и");break;case 2:
"заря"===s?n.push("зори"):s.endsWith("ая")&&!s.endsWith("свая")?C("жхчшщ",O(c))||N(c,["вк","гк","ск","цк","ньк"])?n.push(u+"ие"):n.push(u+"ые"):p()
;break;case 3:
"мя"===m(s,2)?n.push(u+"ена"):Object.keys(le).includes(s)?n.push(_(le[s])+"и"):1===o?n.push(f+"и"):"и"===O(f)?n.push(f+"я"):n.push(f+"а")
}return we(n)}
const Fe=v(["ли","си","би","ви","ди","ти","пи","ри","ни","фи","зи","ьи","ья","ия","ря","ля","ая","аи","ои","уи","эи","ыи","яи","ёи","юи","еи","ии"]),Be=["беготни","болтовни","будни","вожжи","возни","доли","лапши","левши","люди","марли","моря","мощи","ноздри","пени","пятерни","распри","родни","сакли","сени","ступни","судьи","фигни","чукчи"],qe=["головы","громадины","детины","деревенщины","дохлятины","дубины","ехидины","жадины","зверины","идиотины","кислятины","молодчины","орясины","остолопины","сиротины","скотины","старейшины","старины","старшины","уродины"],Ge=v(qe),He=["адреса","паспорта","поезда","цеха","снега","бункера","буфера","берега","вымпела","голоса","города","директора","договора","доктора","жемчуга","инспектора","инструктора","колокола","кондуктора","короба","корпуса","крейсера","кузова","леса","мастера","номера","облачка","острова","отпуска","паруса","повара","погреба","пояса","провода","прожектора","пропуска","рукава","сахара","свитера","сервера","счета","трактора","тормоза","холода","цвета","черепа","шторма","штуцера","юнкера","ястреба","суда","корм"],Je=v(He),Xe=new Set(He.concat(["бега","беглецы","близнецы","бойцы","бока","борта","борцы","бруствера","брюшки","веера","века","венцы","верха","веса","весы","вечера","вороха","глупцы","года","гонцы","дворцы","дельцы","детдома","детдомы","дома","жеребцы","жильцы","жрецы","затишки","зубцы","излишки","истцы","катера","концы","корма","кузнецы","купола","купцы","лишки","луга","мертвецы","меха","мудрецы","облака","образа","образцы","огурцы","округа","омута","ордена","ордера","отцы","очки","певцы","песцы","пловцы","подлецы","продавцы","птенцы","резцы","рога","рода","рубцы","самцы","свинцы","сорта","соуса","спецы","стога","столбцы","стрельцы","творцы","тельцы","тенора","терема","тома","тона","торцы","хлеба","штришки","юнцы"])),Ye=new Set(["авары","аланы","аршины","баклажаны","буквы","гольфы","граммы","гусары","дела","кадеты","килограммы","омы","помидоры","рентгены","ботинки","человеки","чулки","шорты"]),Ke=new Set(["гектары","рельсы"]),Qe=new L
;Xe.forEach(e=>Qe.addRaw(V(e))),Ye.forEach(e=>Qe.addRaw(V(e))),Ke.forEach(e=>Qe.addRaw(V(e)))
;const Ze=new Set(qe.concat(["абазины","авы","аввы","бедняги","бедолаги","болгары","бродяги","брызги","брюки","брюхи","будды","бусы","валенки","веки","вельможи","верзилы","вилы","владыки","воеводы","волосы","вояки","главы","грузины","задворки","задиры","железы","жилы","зануды","зеваки","именины","калеки","кальсоны","каникулы","колготки","коллеги","крохи","курицы","куры","ладоши","ламы","лыки","макароны","мужчины","нападки","нары","непоседы","носилки","ножны","папы","папаши","таты","падлы","партизаны","погоны","поминки","посиделки","похороны","предтечи","работяги","разы","ребятки","румыны","самоубийцы","санки","убийцы","сапоги","сатаны","сироты","сливки","слуги","солдаты","старосты","сумерки","сутки","татары","телеса","хитрюги","четвереньки","шляпы","шмотки","яблоки","дядьки","дяденьки","зайки","кроссовки","малютки","малолетки","попки","турки","узы","хлопоты","шахматы"])),$e=new L
;Ze.forEach(e=>$e.addRaw(V(e)))
;const et=["х","ых","их","м","ым","им","х","ых","их","ми","ыми","ими","х","ых","их"],tt=["ям","ам","","","ями","ами","ях","ах"],nt=v(["вна","вца","вцы","пла","дца","дра","судна","рки","рцы","тлы","рна","тна","енца","десны","дёсны","рёбра","ребра","сосны"]),rt=v(["жи","ши","чи","ля","ли","чи","ри","ти","ди","сани","борщи","клещи","товарищи","плащи","прыщи","хрящи"]),st=v(["братья","брусья","деревья","донья","звенья","клинья","клочья","коленья","колосья","колья","комья","крылья","крючья","листья","лоскутья","лохмотья","перья","платья","поводья","прутья","стулья","сучья","хлопья","шилья"]),it=v(["ишки","дружки","тки","папочки","дедушки","дядюшки","батюшки","катанки","петрушки","шестерки"]),ut=v(["жки","шки","чки","рки","натки","хатки","ятки","етки","чётки","мки","нки","педки","илки"]),ct=v(["шок","щок","жок","зок","аток","яток","еток"])
;function at(e,t,n,r){const s=B(r),i=O(s),u=d(i),c=n+1;if(1===c||4===c&&!t.isAnimate())return r
;if(134217984&u)if(2===c||4===c){if(N(s,["овичи","евичи"]))return _(r)+"ей"
;if(N(s,["вны","полусотни"])&&"овны"!==s)return W(r,2)+"ен"}else if(5===c){
if(N(s,["дети","люди"])&&!N(s,["нелюди"]))return _(r)+"ьми";if(N(s,["вери","дочери"]))return[_(r)+"ями",_(r)+"ьми"]}
const a=T(t),o=s.endsWith("цы")?_(r):te(r,s),h=F(s,ge)&&(t.isASurname()||4===a)&&!F(s,Ge),f=3*Math.min(Math.round(et.length/3-1),c-2)
;if(h||s.endsWith("ничьи"))return r+et[f];if(s.endsWith("ые"))return W(r,2)+et[f+1]
;if(s.endsWith("ие")||F(s,Q))return o+et[f+2];if(c>2&&4!==c){const i=2,u=i*Math.min(Math.round(tt.length/i-1),c-3)
;return F(s,Fe)?_(r)+tt[u]:e.sd.hasStressedEndingPlural(t,n).includes(!0)?b(o)+tt[u+1]:o+tt[u+1]}{
const u=t.getDeclension(),c=()=>{const i=B(o),u=["жки","шки","чки","ножны"]
;if(N(i,["кн","кл","дк","нк","пк","зк","рк","тк","вк","лк","мк"])&&!N(s,["сумерки"])||"зл"===i||N(s,u)&&e.sd.hasStressedEndingPlural(t,n).includes(!0)){
const e=O(o);return _(o)+q("о",e)+e}if(F(s,nt)&&!s.endsWith("недра")||N(s,u)){const e=I(r,2);return W(r,2)+q("е",e)+e}
if(N(s,["сестры","сёстры","серьги"])){const e=I(r,2);return("ь"===I(s,3)?b(W(r,3)):b(W(r,2)))+q("ё",e)+e}
if(N(i,["льц","сьм","деньг","ьк","йк","дьб"])){const e=O(o);return W(o,2)+q("е",e)+e}
return N(s,["сла","слы"])?_(o)+"ел":o};if([3,0].includes(u)){if(s.endsWith("и"))return _(r)+"ей"
;if(["гроздья"].includes(s))return _(r)+"ев"}const h=I(s,3);if(1!==a){const e=V(s),n=Qe.hasRaw(e)
;if(n&&Xe.has(s))return _(r)+"ов";if(n&&Ye.has(s)&&!t.isAName())return[c(),_(r)+"ов"]
;if(n&&Ke.has(s))return[_(r)+"ов",c()]
;if(4===a&&!N(s,Be)&&!C("жшч",h)||$e.hasRaw(e)&&Ze.has(s)||t.isAName()&&2===a&&t.lower().endsWith("а")||"барин"===t.lower())return c()
;switch(i){case"и":case"я":
if(F(s,rt)||"щи"===s||Be.includes(s)||t.lower().endsWith("ь")&&!N(t.lower(),["зять","деверь"])){
return("ь"===O(_(s))?W(r,2):_(r))+"ей"}
if("и"===i)return s.endsWith("ульи")?_(r)+"ев":s.endsWith("ьи")?2===a?_(r)+"ёв":W(r,2)+"ей":["ча","кле","холу","ху"].includes(_(s))?_(r)+"ёв":s.endsWith("ищи")?c():s.endsWith("мессии")?_(r)+"й":E(S,I(s,2))?_(r)+"ев":!F(s,ut)||2===a&&!F(b(s),it)||F(t.lower(),ct)?_(r)+"ов":c()
;if(F(s,st))return _(r)+"ев";if(N(s,["зятья","кумовья","деверья","края","острия"]))return _(r)+"ёв"
;if(N(s,["ья","ия"]))return 2===a?W(r,2)+"ей":W(r,2)+"ий";break;case"а":
return N(s,["семена","стремена"])?W(r,3)+"ян":s.endsWith("мена")?W(r,3)+"ён":t.lower().endsWith("яйцо")?q("яиц",_(r)):s.endsWith("нца")?[c(),_(r)+"ев"]:F(s,Je)?_(r)+"ов":c()
;case"ы":return N(s,["ницы","лицы","пицы","бицы"])?_(r):s.endsWith("цы")?_(r)+"ев":_(r)+"ов";default:
if(s.endsWith("не"))return c()}}if(s.endsWith("йки"))return W(r,3)+"ек";if(s.endsWith("ки")){if("ь"===h){const e=O(_(r))
;return W(r,3)+q("е",e)+e}if(C("жшч",h))return c();if(E(g,h))return W(r,2)+"ок"}if(Be.includes(s))return _(r)+"ей"
;if(N(s,["аи","ои","еи","эи","уи"]))return _(r)+"й";if("свечи"===s)return[_(r),_(r)+"ей"]
;if("пригоршни"===s)return[_(r)+"ей",W(r,2)+"ен"];if("тихони"===s)return[W(r,2)+"нь",_(r)+"ей"]
;if(N(s,["ьи","ии"]))return e.sd.hasStressedEndingSingular(t,n).includes(!0)?W(r,2)+"ей":W(r,2)+"ий"
;if(s.endsWith("ни")&&E(g,I(s,3)))return["барышни","боярышни","деревни"].includes(s)?W(r,2)+"ень":s.endsWith("кухни")?W(r,2)+"онь":"сотни"===s?[W(r,2),W(r,2)+"ен"]:W(r,2)+"ен"
;if(B(o).endsWith("ийк"))return W(o,2)+"ек";if(o.length===s.length-1&&F(s,Fe)){if(C("ьй",B(I(o,2)))&&!t.isAnimate()){
const e=O(o);return W(o,2)+q("е",e)+e}return N(s,["земли","петли","пли","вли"])?_(o)+"ель":o+"ь"}return c()}}class ot{
sd=function(){let e;const t=new D;function n(n,r){const s=r.split(",");for(let r of s)e.text=r,t.put(e,n)}return e={
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
;if(s)return at(t,n,u,s);switch(n.getDeclension()){case-1:return i;case 0:return Ee(t,n,u);case 1:return Te(t,n,u)
;case 2:return Se(t,n,u);case 3:return de(t,n,u)}}(t,n,r,s);if(i instanceof Array)return i;return[i]
}(this,x.create(t),n,r)}pluralize(e){const t=x.create(e);return t.isPluraleTantum()?[t.text()]:ve(this,t)}
getLocativeForms(e){const t=this,n=x.create(e),r=n.getDeclension();if(r&&r>=0){const e=be.get(Ae(n))
;if(e instanceof Array)return e.map(e=>new c(function(e){switch(1+(e>>3&7)){case o.V:return"в";case o.VO:return"во"
;case o.NA:return"на"}}(e),function(e,t,n,r){const s=5;switch(t){case 0:return Ee(e,n,s);case 1:return Re(e,n,r);case 2:
return Se(e,n,s);case 3:return de(e,n,s)}}(t,r,n,f(e)),e>>6))}return[]}}
export{e as CASES,t as Case,ot as Engine,s as Gender,x as Lemma,c as LocativeForm,a as LocativeFormAttribute,D as StressDictionary,R as createLemma,U as createLemmaOrNull};
//# sourceMappingURL=RussianNouns.mjs.map
