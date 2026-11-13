import type { Ability, Character } from './types';

// Shared, engine-supported mechanics keep this first balance pass easy to tune.
const mechanics = {
 charge: {tier:2, attack:3, health:4, ability:{trigger:'attack', effect:'buff', target:'self', attack:3}, text:'Az első támadásától +3 támadást kap erre a harcra.'},
 mentor: {tier:1, attack:2, health:2, ability:{trigger:'play', effect:'buff', target:'other', attack:1}, text:'Egy választott másik szövetséges véglegesen +1 támadást kap.'},
 guard: {tier:2, attack:2, health:6, ability:{trigger:'passive', effect:'taunt', target:'self'}, text:'Őrző: magára vonja az ellenséges támadásokat.'},
 ward: {tier:3, attack:3, health:6, ability:{trigger:'start', effect:'shield', target:'self'}, text:'Védőpajzsot kap erre a harcra.'},
 rally: {tier:4, attack:4, health:7, ability:{trigger:'start', effect:'buff', target:'neighbors', health:3}, text:'A közvetlen szomszédok +3 életerőt kapnak erre a harcra.'},
 cover: {tier:4, attack:5, health:5, ability:{trigger:'start', effect:'shield', target:'left'}, text:'A bal oldali szomszéd védőpajzsot kap erre a harcra.'},
 shot: {tier:5, attack:7, health:7, ability:{trigger:'start', effect:'damage', target:'enemy', amount:4}, text:'4 sebzést okoz egy véletlen ellenségnek a harc kezdetén.'},
 storm: {tier:6, attack:8, health:10, ability:{trigger:'start', effect:'damage', target:'enemies', amount:3}, text:'3 sebzést okoz minden ellenségnek a harc kezdetén.'},
 inspire: {tier:5, attack:6, health:8, ability:{trigger:'start', effect:'buff', target:'allies', attack:3}, text:'Minden más szövetséges +3 támadást kap erre a harcra.'},
 legacy: {tier:4, attack:4, health:8, ability:{trigger:'death', effect:'buff', target:'allies', attack:2, health:2}, text:'Halálakor minden élő szövetséges +2/+2 értéket kap erre a harcra.'},
 disrupt: {tier:3, attack:5, health:4, ability:{trigger:'attack', effect:'stealShield', target:'enemy'}, text:'Az első támadásakor eltávolítja a célpont pajzsát, és maga védőpajzsot kap.'},
 resolve: {tier:1, attack:1, health:3, ability:{trigger:'play', effect:'buff', target:'self', attack:2, health:1}, text:'Kijátszáskor véglegesen +2/+1 értéket kap.'},
} satisfies Record<string, {tier:number; attack:number; health:number; ability:Omit<Ability,'name'>; text:string}>;

type Role = keyof typeof mechanics;
type Entry = [name:string, role:Role, abilityName:string];
export interface FranchiseRoster { name:string; entries:Entry[] }

// Spreadsheet order, excluding the two previously approved rosters.
export const REMAINING_ROSTERS:FranchiseRoster[] = [
 {name:'Clair Obscur: Expedition 33', entries:[
  ['Gustave','charge','Overcharge'], ['Maelle','resolve','Virtuose'],
  ['Lune','cover','Elemental Genesis'], ['Sciel','mentor','Foretell'],
  ['Verso','disrupt','Perfection'], ['Monoco','guard','Bestial Wheel'],
  ['Esquie','rally','Expedition Guide'], ['Renoir','storm','Chroma Surge'],
 ]},
 {name:'Star Wars', entries:[
  ['Anakin Skywalker','charge','Chosen One'], ['Obi-Wan Kenobi','cover','High Ground'],
  ['Padme Amidala','mentor','Senate Appeal'], ['Yoda','inspire','Jedi Wisdom'],
  ['Mace Windu','disrupt','Vaapad'], ['Ahsoka Tano','resolve','Padawan Courage'],
  ['General Grievous','guard','Four Lightsabers'], ['Darth Sidious','storm','Force Lightning'],
 ]},
 {name:'Solo Leveling', entries:[
  ['Sung Jinwoo','inspire','Shadow Monarch'], ['Cha Hae-In','charge','Sword Dance'],
  ['Yoo Jinho','mentor','Loyal Companion'], ['Sung Jinah','resolve','Family Resolve'],
  ['Igris','ward','Blood-Red Commander'], ['Iron','guard','Iron Wall'],
  ['Beru','shot','Ant King'], ['Go Gunhee','rally','Hunters Association'],
 ]},
 {name:'Hearthstone Battlegrounds', entries:[
  ['Bob the Bartender','mentor','Friendly Advice'], ['Patches the Pirate','charge','Pirate Charge'],
  ['The Curator','guard','Menagerie Keeper'], ['George the Fallen','cover','Divine Protection'],
  ['A. F. Kay','resolve','Patient Return'], ['Millhouse Manastorm','disrupt','Arcane Trick'],
  ['Ragnaros the Firelord','shot','By Fire Be Purged'], ['The Lich King','legacy','Frozen Legacy'],
 ]},
 {name:"The Hitchhiker's Guide to the Galaxy", entries:[
  ['Arthur Dent','resolve','Do Not Panic'], ['Ford Prefect','mentor','Guide Entry'],
  ['Zaphod Beeblebrox','charge','Two Heads'], ['Trillian','cover','Astrophysics'],
  ['Marvin','guard','Brain the Size of a Planet'], ['Slartibartfast','rally','Award-Winning Fjords'],
  ['Humma Kavula','disrupt','Point of View'], ['Deep Thought','inspire','Forty-Two'],
 ]},
 {name:'Doctor Who', entries:[
  ['The Doctor','cover','Sonic Screwdriver'], ['Rose Tyler','resolve','Bad Wolf'],
  ['Martha Jones','mentor','Medical Training'], ['Donna Noble','rally','Best Friend'],
  ['Amy Pond','ward','The Girl Who Waited'], ['Rory Williams','guard','Last Centurion'],
  ['River Song','shot','Hello Sweetie'], ['The Master','storm','Time Lord Scheme'],
 ]},
 {name:'Little Misfortune', entries:[
  ['Misfortune Ramirez Hernandez','mentor','Glitter of Happiness'], ['Benjamin','cover','Protector'],
  ['Mr. Voice (Morgo)','shot','Deceptive Narration'], ['Hiro','legacy','Lost Friend'],
  ['Misfortune’s Mother','rally','Eternal Happiness'], ['Puppy','resolve','Playful Companion'],
  ['Hamster','charge','Underground Party'], ['Death','guard','Fourth Reality'],
 ]},
 {name:'The Batman (2022)', entries:[
  ['Bruce Wayne / Batman','ward','Armored Vigilante'], ['Selina Kyle / Catwoman','disrupt','Cat Burglar'],
  ['James Gordon','cover','Trusted Signal'], ['Alfred Pennyworth','mentor','Faithful Butler'],
  ['Oswald Cobblepot / Penguin','guard','Iceberg Lounge'], ['Edward Nashton / Riddler','shot','Riddle Trap'],
  ['Carmine Falcone','inspire','Gotham Connections'], ['Bella Real','resolve','Renewal'],
 ]},
 {name:'Squid Game', entries:[
  ['Seong Gi-hun','resolve','Player 456'], ['Cho Sang-woo','disrupt','Calculated Risk'],
  ['Kang Sae-byeok','ward','Quiet Survivor'], ['Abdul Ali','guard','Helping Hand'],
  ['Oh Il-nam','inspire','Old Friends'], ['Jang Deok-su','charge','Intimidation'],
  ['Han Mi-nyeo','legacy','Last Bargain'], ['Hwang Jun-ho','mentor','Undercover Officer'],
 ]},
 {name:'Rocket League', entries:[
  ['Octane','charge','Aerial Shot'], ['Dominus','shot','Power Shot'],
  ['Breakout','disrupt','Wall Pinch'], ['Merc','guard','Goal Line Defense'],
  ['Venom (Rocket League)','resolve','Kickoff Boost'], ['X-Devil','ward','Midair Recovery'],
  ['Paladin','cover','Defensive Rotation'], ['Backfire','mentor','Centering Pass'],
 ]},
 {name:'The Matrix', entries:[
  ['Neo','ward','Bullet Dodge'], ['Trinity','charge','Rooftop Leap'],
  ['Morpheus','inspire','Free Your Mind'], ['Agent Smith','storm','System Override'],
  ['The Oracle','mentor','Know Thyself'], ['Cypher','disrupt','Betrayal'],
  ['Tank','cover','Operator Support'], ['Niobe','guard','Captain of the Logos'],
 ]},
 {name:'The Chosen', entries:[
  ['Jesus','inspire','Follow Me'], ['Simon Peter','guard','Fisherman’s Resolve'],
  ['Matthew','mentor','Careful Record'], ['Mary Magdalene','resolve','New Beginning'],
  ['Nicodemus','cover','Night Conversation'], ['Andrew','rally','Bring a Friend'],
  ['John','legacy','Faithful Witness'], ['Thomas','ward','Steadfast Faith'],
 ]},
 {name:'Rust', entries:[
  ['Naked Survivor','resolve','Fresh Spawn'], ['Hazmat Scientist','shot','Patrol Fire'],
  ['Heavy Scientist','guard','Heavy Armor'], ['Bandit Camp Guard','cover','Safe Zone'],
  ['Outpost Scientist','mentor','Outpost Supplies'], ['Bear','charge','Territorial Charge'],
  ['Wolf','ward','Pack Instinct'], ['Patrol Helicopter','storm','Rocket Barrage'],
 ]},
 {name:'Sherlock (BBC)', entries:[
  ['Sherlock Holmes','disrupt','Deduction'], ['John Watson','cover','Army Doctor'],
  ['Mycroft Holmes','inspire','Government Connections'], ['Jim Moriarty','shot','Final Problem'],
  ['Irene Adler','ward','The Woman'], ['Mrs. Hudson','mentor','Baker Street Hospitality'],
  ['Greg Lestrade','guard','Scotland Yard'], ['Molly Hooper','resolve','Quiet Courage'],
 ]},
 {name:'Dark Souls III', entries:[
  ['Ashen One','resolve','Ember Restored'], ['Fire Keeper','mentor','Touch the Darkness'],
  ['Siegward of Catarina','guard','Onion Armor'], ['Anri of Astora','cover','Shared Quest'],
  ['Greirat','ward','Nimble Scavenger'], ['Abyss Watcher','charge','Wolf Blood'],
  ['Pontiff Sulyvahn','disrupt','Profaned Blade'], ['Soul of Cinder','storm','First Flame'],
 ]},
 {name:'Avatar (James Cameron)', entries:[
  ['Jake Sully','charge','Toruk Makto'], ['Neytiri','shot','Forest Archer'],
  ['Grace Augustine','mentor','Botanical Knowledge'], ['Norm Spellman','resolve','Avatar Training'],
  ['Trudy Chacon','cover','Air Support'], ['Tsu’tey','guard','Clan Warrior'],
  ['Mo’at','rally','Voice of Eywa'], ['Miles Quaritch','storm','AMP Assault'],
 ]},
 {name:'The Boys', entries:[
  ['Billy Butcher','disrupt','Supe Hunter'], ['Hughie Campbell','resolve','Unexpected Courage'],
  ['Annie January / Starlight','cover','Guiding Light'], ['Mother’s Milk','guard','Hold the Line'],
  ['Frenchie','mentor','Improvised Gear'], ['Kimiko','charge','Silent Fury'],
  ['Homelander','storm','Heat Vision'], ['Queen Maeve','ward','Warrior’s Resolve'],
 ]},
 {name:'South Park: The Stick of Truth / The Fractured But Whole', entries:[
  ['The New Kid','resolve','Choose Your Class'], ['Eric Cartman','shot','Grand Wizard'],
  ['Stan Marsh','guard','Toolshed'], ['Kyle Broflovski','cover','Human Kite'],
  ['Kenny McCormick','legacy','Mysterion'], ['Butters Stotch','mentor','Paladin’s Blessing'],
  ['Craig Tucker','charge','Super Craig'], ['Tweek Tweak','storm','Wonder Tweek'],
 ]},
 {name:'The Truman Show', entries:[
  ['Truman Burbank','resolve','Good Morning'], ['Christof','inspire','Cue the Sun'],
  ['Sylvia / Lauren Garland','cover','Truth Beyond the Set'], ['Meryl Burbank','mentor','Product Placement'],
  ['Marlon','guard','Best Friend'], ['Kirk Burbank','legacy','Father’s Return'],
  ['Angela Burbank','rally','Family Album'], ['Lawrence','ward','Control Room'],
 ]},
 {name:'Chernobyl (2019)', entries:[
  ['Valery Legasov','mentor','Tell the Truth'], ['Boris Shcherbina','inspire','Emergency Coordination'],
  ['Ulana Khomyuk','disrupt','Reactor Analysis'], ['Anatoly Dyatlov','guard','Control Room Orders'],
  ['Vasily Ignatenko','legacy','First Responder'], ['Lyudmilla Ignatenko','resolve','Unwavering Devotion'],
  ['General Pikalov','ward','Radiation Reconnaissance'], ['Mikhail Shchadov','rally','Mobilize the Miners'],
 ]},
 {name:'Deadlock', entries:[
  ['Ivy','cover','Stone Form'], ['Abrams','guard','Shoulder Charge'],
  ['Bebop','shot','Exploding Uppercut'], ['Dynamo','rally','Rejuvenating Aurora'],
  ['Infernus','charge','Flame Dash'], ['Haze','ward','Smoke Bomb'],
  ['Seven','storm','Storm Cloud'], ['Vindicta','mentor','Spotter'],
 ]},
 {name:'Shutter Island', entries:[
  ['Edward “Teddy” Daniels','resolve','Marshal’s Investigation'], ['Chuck Aule / Dr. Sheehan','cover','Trusted Partner'],
  ['Dr. John Cawley','mentor','Role-Play Therapy'], ['Dr. Jeremiah Naehring','disrupt','Clinical Interview'],
  ['Dolores Chanal','legacy','Haunting Memory'], ['Rachel Solando','ward','Missing Patient'],
  ['George Noyce','rally','Warning from Ward C'], ['The Warden','guard','Island Security'],
 ]},
 {name:'Friends', entries:[
  ['Rachel Green','resolve','Fresh Start'], ['Monica Geller','guard','Competitive Spirit'],
  ['Phoebe Buffay','legacy','Smelly Cat'], ['Joey Tribbiani','charge','How You Doin'],
  ['Chandler Bing','disrupt','Could I Be Any More'], ['Ross Geller','rally','Unagi'],
  ['Gunther','mentor','Central Perk'], ['Janice Hosenstein','ward','Oh My God'],
 ]},
 {name:'East of Eden (2008)', entries:[
  ['Lee Dong-chul','guard','Protective Brother'], ['Lee Dong-wook','disrupt','Prosecutor’s Case'],
  ['Min Hye-rin','mentor','Careful Counsel'], ['Kim Ji-hyun','resolve','Unbroken Resolve'],
  ['Shin Myung-hoon','charge','Rival Heir'], ['Gook Young-ran','cover','Loyal Heart'],
  ['Shin Tae-hwan','inspire','Taesung Influence'], ['Yang Chun-hee','rally','Family Bonds'],
 ]},
 {name:'The Lord of the Rings', entries:[
  ['Frodo Baggins','ward','Ring-Bearer'], ['Samwise Gamgee','mentor','Carry You'],
  ['Aragorn','inspire','Return of the King'], ['Legolas','shot','Elven Bow'],
  ['Gimli','guard','Dwarven Defense'], ['Gandalf','cover','You Shall Not Pass'],
  ['Boromir','legacy','Last Stand'], ['Gollum','disrupt','My Precious'],
 ]},
 {name:'Lord of Mysteries', entries:[
  ['Klein Moretti','disrupt','The Fool'], ['Audrey Hall','mentor','Spectator'],
  ['Alger Wilson','charge','The Hanged Man'], ['Derrick Berg','guard','The Sun'],
  ['Fors Wall','ward','The Magician'], ['Xio Derecha','cover','Judgement'],
  ['Leonard Mitchell','rally','The Star'], ['Amon','shot','Error'],
 ]},
 {name:'Vintage Story', entries:[
  ['Seraph','resolve','Temporal Survival'], ['Surface Drifter','charge','Rusty Claws'],
  ['Corrupt Drifter','guard','Deep Cave Horror'], ['Locust','ward','Clockwork Skitter'],
  ['Sawblade Locust','disrupt','Spinning Blade'], ['Bell','inspire','Cave Alarm'],
  ['Wolf (Vintage Story)','shot','Forest Ambush'], ['Trader','mentor','Wagon Supplies'],
 ]},
 {name:'Spider-Man', entries:[
  ['Peter Parker / Spider-Man','ward','Spider-Sense'], ['Miles Morales','disrupt','Venom Strike'],
  ['Gwen Stacy / Ghost-Spider','charge','Web Swing'], ['Mary Jane Watson','mentor','Face It Tiger'],
  ['May Parker','rally','Great Responsibility'], ['Green Goblin','shot','Pumpkin Bomb'],
  ['Doctor Octopus','guard','Mechanical Arms'], ['Venom','storm','Symbiote Fury'],
 ]},
 {name:'9-1-1', entries:[
  ['Bobby Nash','inspire','Captain of the 118'], ['Athena Grant','guard','Police Sergeant'],
  ['Evan “Buck” Buckley','charge','Ladder Rescue'], ['Henrietta Wilson','mentor','Paramedic Care'],
  ['Howard “Chimney” Han','cover','Emergency Support'], ['Eddie Diaz','ward','Rescue Training'],
  ['Maddie Buckley','rally','Dispatch Coordination'], ['Christopher Diaz','resolve','Brave Steps'],
 ]},
 {name:'Hero (2002)', entries:[
  ['Nameless','disrupt','Ten Paces'], ['Broken Sword','mentor','Calligraphy of Peace'],
  ['Flying Snow','charge','Sword Dance'], ['Long Sky','ward','Courtyard Duel'],
  ['Moon','resolve','Apprentice’s Resolve'], ['King of Qin','inspire','All Under Heaven'],
  ['Qin Archer','shot','Arrow Volley'], ['Qin Palace Guard','guard','Palace Formation'],
 ]},
 {name:'The Residence', entries:[
  ['Cordelia Cupp','disrupt','Birdwatcher’s Eye'], ['Edwin Park','cover','Federal Partner'],
  ['A.B. Wynter','legacy','Household Protocol'], ['Jasmine Haney','mentor','Assistant Usher'],
  ['Lilly Schumacher','charge','State Dinner Pressure'], ['Harry Hollinger','guard','Chief Adviser'],
  ['Perry Morgan','inspire','Presidential Address'], ['David Rylance','resolve','Diplomatic Guest'],
 ]},
 {name:'Fawlty Towers', entries:[
  ['Basil Fawlty','charge','Hotel Tantrum'], ['Sybil Fawlty','guard','Front Desk Authority'],
  ['Polly Sherman','cover','Quick Cover Story'], ['Manuel','resolve','Learning the Ropes'],
  ['Major Gowen','rally','Lobby Regular'], ['Terry Hughes','mentor','Kitchen Service'],
  ['Miss Tibbs','ward','Familiar Routine'], ['Miss Gatsby','legacy','Long-Term Guest'],
 ]},
 {name:'Dixit', entries:[
  ['Dixit Storyteller','mentor','One Cryptic Clue'], ['Dixit Dreamer','resolve','Dream Journey'],
  ['Dixit Rabbit','charge','Scoring Track Hop'], ['Dixit Guardian','guard','Protect the Tale'],
  ['Dixit Wanderer','ward','Unknown Path'], ['Dixit Illusionist','disrupt','Misleading Image'],
  ['Dixit Stargazer','cover','Guiding Constellation'], ['Dixit Muse','inspire','Shared Imagination'],
 ]},
];

export const FRANCHISE_EXPANSION:Character[] = REMAINING_ROSTERS.flatMap((roster,group) =>
 roster.entries.map(([name,role,abilityName],index) => {
  const id=51+group*8+index;
  const mechanic=mechanics[role];
  return {id, name, tags:[roster.name], tier:mechanic.tier, attack:mechanic.attack, health:mechanic.health,
   ability:{...mechanic.ability, name:abilityName}, text:`${abilityName}: ${mechanic.text}`, portrait:`/portraits/${id}.svg`};
 })
);
