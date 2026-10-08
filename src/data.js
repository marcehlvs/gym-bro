import qrcode from 'qrcode-generator';
export const GYM={name:'Gym Bro'}; // cambiá el nombre del gimnasio acá
export const EX={
sq:{n:'Sentadilla',m:'Piernas y glúteos',d:'Pies al ancho de hombros. Llevá la cadera hacia atrás como para sentarte, espalda recta, y subí empujando con los talones.',p:2400,f:[[102,10,100,22,100,56,106,38,112,52,102,82,100,108,102,82,100,108],[110,40,102,52,86,82,120,52,138,50,112,84,100,108,112,84,100,108]]},
mc:{n:'Escaladores',m:'Cardio y abdomen',d:'Manos bajo los hombros, cuerpo recto. Llevá una rodilla al pecho y cambiá de pierna rápido, sin subir la cadera.',p:800,f:[[158,72,142,78,92,88,142,93,142,107,118,90,106,104,66,97,40,106],[158,72,142,78,92,88,142,93,142,107,66,97,40,106,118,90,106,104]]},
cr:{n:'Abdominal corto',m:'Recto abdominal',d:'Boca arriba, rodillas flexionadas, manos detrás de la cabeza. Subí los hombros contrayendo el abdomen y bajá lento. No tires del cuello.',p:1900,f:[[46,100,66,104,112,104,58,92,48,96,138,84,158,104,140,86,160,104],[70,76,82,90,112,104,70,68,62,76,138,84,158,104,140,86,160,104]]},
lr:{n:'Elevación de piernas',m:'Abdomen bajo',d:'Boca arriba, manos junto al cuerpo y zona lumbar pegada al piso. Subí las piernas juntas y bajalas lento sin tocar el suelo.',p:2600,f:[[40,102,58,104,104,104,80,106,100,106,104,76,104,48,106,76,106,48],[40,102,58,104,104,104,80,106,100,106,132,102,160,102,132,103,160,103]]},
bi:{n:'Bicicleta',m:'Oblicuos',d:'Boca arriba, manos detrás de la cabeza, hombros arriba. Pedaleá alternando piernas y llevá el codo hacia la rodilla contraria.',p:1300,f:[[54,80,72,92,112,104,66,68,56,78,136,84,150,100,142,102,172,100],[54,80,72,92,112,104,66,68,56,78,142,102,172,100,136,84,150,100]]},
pl:{n:'Plancha',m:'Core completo',d:'Antebrazos y puntas de pie en el piso. Cuerpo en línea recta, abdomen y glúteos firmes. Respirá normal y mantené la posición.',p:3600,f:[[158,80,140,86,90,95,140,104,166,104,65,101,38,106,65,102,38,107],[158,80,140,86,90,92,140,104,166,104,65,99,38,106,65,100,38,107]]}};
export const R={A:{n:'Quema-grasa total',ex:['sq','mc','cr','lr','pl']},B:{n:'Cardio y cintura',ex:['mc','bi','sq','lr','pl']},C:{n:'Abdominales marcados',ex:['cr','bi','lr','pl']}};
export const PLAN=[null,'A','B',null,'A','B','C'],D=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
export const LV={Principiante:{s:3,w:30,r:15,sr:15},Intermedio:{s:4,w:40,r:15,sr:15},Avanzado:{s:5,w:45,r:15,sr:15}};
export const dkey=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'),dayDate=i=>{const d=new Date();d.setDate(d.getDate()-(d.getDay()-i));return d};
// racha: días de entrenamiento seguidos; los días de descanso del plan no cortan la racha
export function streak(done){let s=0,d=new Date();const t=dkey(d);for(let k=0;k<120;k++){if(done[dkey(d)])s++;else if(PLAN[d.getDay()]&&dkey(d)!==t)break;d.setDate(d.getDate()-1)}return s}
export function qrSvg(t){try{const q=qrcode(0,'M');q.addData(t);q.make();return q.createSvgTag({cellSize:4,margin:0,scalable:true})}catch(e){return '<p style="color:#000">No se pudo generar el QR</p>'}}

export function build(r,L){const s=[{t:'prep',k:r.ex[0],d:10,s:1,j:0}];
for(let n=1;n<=L.s;n++){r.ex.forEach((k,j)=>{s.push({t:'work',k,d:L.w,s:n,j});if(j<r.ex.length-1)s.push({t:'rest',k:r.ex[j+1],d:L.r,s:n,j:j+1})});if(n<L.s)s.push({t:'sr',k:r.ex[0],d:L.sr,s:n,j:0})}return s}
