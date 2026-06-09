// ============================================================
// === Banderas y nombres en español de selecciones
// ============================================================
// Usamos códigos ISO 3166-1 (con subdivisiones GB-* para UK).
// El componente <Flag /> los resuelve a una imagen de flagcdn.com.

export const TEAM_CODES: Record<string, string> = {
  'Argentina':'ar','Brazil':'br','France':'fr','Germany':'de','Spain':'es','England':'gb-eng',
  'Portugal':'pt','Netherlands':'nl','Belgium':'be','Croatia':'hr','Italy':'it','Switzerland':'ch',
  'Denmark':'dk','Poland':'pl','Austria':'at','Norway':'no','Czech Republic':'cz','Czechia':'cz',
  'Scotland':'gb-sct','Wales':'gb-wls','Republic of Ireland':'ie','Ireland':'ie',
  'Turkey':'tr','Türkiye':'tr','Hungary':'hu','Romania':'ro','Serbia':'rs',
  'Slovakia':'sk','Slovenia':'si','Ukraine':'ua','Russia':'ru',
  'United States':'us','USA':'us','US':'us','Canada':'ca','Mexico':'mx','Costa Rica':'cr',
  'Honduras':'hn','Panama':'pa','Jamaica':'jm','Curacao':'cw','Curaçao':'cw',
  'Trinidad and Tobago':'tt','Haiti':'ht','El Salvador':'sv','Guatemala':'gt',
  'Ecuador':'ec','Uruguay':'uy','Colombia':'co','Paraguay':'py','Bolivia':'bo','Peru':'pe','Chile':'cl','Venezuela':'ve',
  'Morocco':'ma','Senegal':'sn','Tunisia':'tn','Algeria':'dz','Egypt':'eg','Cameroon':'cm','Ghana':'gh','Nigeria':'ng',
  'Ivory Coast':'ci',"Côte d'Ivoire":'ci',"Cote d'Ivoire":'ci',
  'South Africa':'za','Mali':'ml','Cape Verde':'cv','Burkina Faso':'bf','DR Congo':'cd','Congo DR':'cd','Gabon':'ga',
  'Japan':'jp','South Korea':'kr','Korea Republic':'kr','Korea DPR':'kp','Iran':'ir','IR Iran':'ir',
  'Saudi Arabia':'sa','Australia':'au','Qatar':'qa','Iraq':'iq','Jordan':'jo','Uzbekistan':'uz',
  'New Zealand':'nz','China':'cn','India':'in','Indonesia':'id','Thailand':'th',
  'United Arab Emirates':'ae','UAE':'ae','Bahrain':'bh','Oman':'om','Kuwait':'kw','Lebanon':'lb',
  'Palestine':'ps','Israel':'il',
};

export const TEAM_NAMES_ES: Record<string, string> = {
  'Argentina':'Argentina','Brazil':'Brasil','France':'Francia','Germany':'Alemania','Spain':'España',
  'England':'Inglaterra','Portugal':'Portugal','Netherlands':'Países Bajos','Belgium':'Bélgica',
  'Croatia':'Croacia','Italy':'Italia','Switzerland':'Suiza','Denmark':'Dinamarca','Poland':'Polonia',
  'Austria':'Austria','Norway':'Noruega','Czech Republic':'Rep. Checa','Czechia':'Rep. Checa',
  'Scotland':'Escocia','Wales':'Gales','Republic of Ireland':'Irlanda','Ireland':'Irlanda',
  'Turkey':'Turquía','Türkiye':'Turquía','Hungary':'Hungría','Romania':'Rumanía','Serbia':'Serbia',
  'Slovakia':'Eslovaquia','Slovenia':'Eslovenia','Ukraine':'Ucrania','Russia':'Rusia',
  'United States':'Estados Unidos','USA':'Estados Unidos','US':'Estados Unidos','Canada':'Canadá',
  'Mexico':'México','Costa Rica':'Costa Rica','Honduras':'Honduras','Panama':'Panamá',
  'Jamaica':'Jamaica','Curacao':'Curazao','Curaçao':'Curazao','Trinidad and Tobago':'Trinidad y Tobago',
  'Haiti':'Haití','El Salvador':'El Salvador','Guatemala':'Guatemala',
  'Ecuador':'Ecuador','Uruguay':'Uruguay','Colombia':'Colombia','Paraguay':'Paraguay',
  'Bolivia':'Bolivia','Peru':'Perú','Chile':'Chile','Venezuela':'Venezuela',
  'Morocco':'Marruecos','Senegal':'Senegal','Tunisia':'Túnez','Algeria':'Argelia',
  'Egypt':'Egipto','Cameroon':'Camerún','Ghana':'Ghana','Nigeria':'Nigeria',
  'Ivory Coast':'Costa de Marfil',"Côte d'Ivoire":'Costa de Marfil',"Cote d'Ivoire":'Costa de Marfil',
  'South Africa':'Sudáfrica','Mali':'Malí','Cape Verde':'Cabo Verde','Burkina Faso':'Burkina Faso',
  'DR Congo':'RD Congo','Congo DR':'RD Congo','Gabon':'Gabón',
  'Japan':'Japón','South Korea':'Corea del Sur','Korea Republic':'Corea del Sur','Korea DPR':'Corea del Norte',
  'Iran':'Irán','IR Iran':'Irán','Saudi Arabia':'Arabia Saudita','Australia':'Australia',
  'Qatar':'Catar','Iraq':'Irak','Jordan':'Jordania','Uzbekistan':'Uzbekistán',
  'New Zealand':'Nueva Zelanda','China':'China','India':'India','Indonesia':'Indonesia','Thailand':'Tailandia',
  'United Arab Emirates':'Emiratos Árabes Unidos','UAE':'Emiratos Árabes Unidos','Bahrain':'Baréin',
  'Oman':'Omán','Kuwait':'Kuwait','Lebanon':'Líbano','Palestine':'Palestina','Israel':'Israel',
};

// flagFor devuelve el código ISO. El componente <Flag /> lo resuelve a una imagen.
// Si no hay match, devuelve 'xx' (renderiza placeholder neutral).
export const flagFor   = (team: string): string => TEAM_CODES[team] ?? 'xx';
export const teamName  = (team: string): string => TEAM_NAMES_ES[team] ?? team;
export const isEcuador = (team: string): boolean => /ecuador/i.test(team);

/** URL de la imagen de bandera (PNG, alta calidad). */
export function flagUrl(code: string, width: 40 | 80 | 160 | 320 = 80): string {
  if (!code || code === 'xx') return '';
  return `https://flagcdn.com/w${width}/${code}.png`;
}
