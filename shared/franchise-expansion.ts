import type { Ability, Character } from './types';

// Shared, engine-supported mechanics keep this first balance pass easy to tune.
const mechanics = {
 charge: {tier:2, attack:3, health:4, ability:{trigger:'rally', effect:'buff', target:'self', attack:2}, text:'Minden támadásakor +2 támadást kap erre a harcra.'},
 mentor: {tier:1, attack:2, health:2, ability:{trigger:'play', effect:'buff', target:'other', attack:1, health:1}, text:'Kijátszáskor egy választott szövetséges tartósan +1/+1-et kap.'},
 guard: {tier:2, attack:2, health:6, ability:{trigger:'passive', effect:'taunt', target:'self'}, text:'Őrző: magára vonja az ellenséges támadásokat.'},
 ward: {tier:3, attack:3, health:6, ability:{trigger:'start', effect:'shield', target:'self'}, text:'Védőpajzsot kap erre a harcra.'},
 coach: {tier:4, attack:4, health:6, ability:{trigger:'turnEnd', effect:'buff', target:'neighbors', attack:2, health:2}, text:'A köröd végén mindkét szomszédja tartósan +2/+2-t kap.'},
 cover: {tier:4, attack:5, health:5, ability:{trigger:'start', effect:'shield', target:'left'}, text:'A bal oldali szomszéd védőpajzsot kap erre a harcra.'},
 shot: {tier:5, attack:8, health:8, ability:{trigger:'start', effect:'damage', target:'enemy', amount:7}, text:'Harc elején 7 sebzést okoz egy véletlen ellenségnek.'},
 storm: {tier:6, attack:10, health:11, ability:{trigger:'start', effect:'damage', target:'enemies', amount:5}, text:'Harc elején 5 sebzést okoz minden ellenségnek.'},
 inspire: {tier:5, attack:5, health:8, ability:{trigger:'turnStart', effect:'buff', target:'tribe', attack:3, health:3}, text:'A köröd elején a törzséhez tartozó többi szövetséges tartósan +3/+3-at kap.'},
 legacy: {tier:4, attack:5, health:7, ability:{trigger:'death', effect:'buff', target:'allies', attack:3, health:3}, text:'Halálakor a többi élő szövetséges +3/+3-at kap erre a harcra.'},
 apprentice: {tier:2, attack:2, health:3, ability:{trigger:'turnStart', effect:'buff', target:'self', attack:1, health:2}, text:'A köröd elején tartósan +1/+2-t kap.'},
 reserves: {tier:2, attack:2, health:2, ability:{trigger:'death', effect:'summon', target:'self', amount:1}, text:'Halálakor megidéz egy 2/2-es Segítőt.'},
 supplier: {tier:3, attack:3, health:4, ability:{trigger:'turnEnd', effect:'buff', target:'left', attack:3, health:2}, text:'A köröd végén a bal oldali szomszédja tartósan +3/+2-t kap.'},
 rallyGuard: {tier:3, attack:4, health:5, ability:{trigger:'rally', effect:'buff', target:'neighbors', attack:2, health:2}, text:'Minden támadásakor a két szomszédja +2/+2-t kap erre a harcra.'},
 reinforce: {tier:4, attack:5, health:5, ability:{trigger:'play', effect:'buff', target:'other', attack:4, health:4}, text:'Kijátszáskor egy választott szövetséges tartósan +4/+4-et kap.'},
 ambush: {tier:5, attack:7, health:6, ability:{trigger:'death', effect:'damage', target:'enemies', amount:5}, text:'Halálakor 5 sebzést okoz minden ellenségnek.'},
 standard: {tier:5, attack:6, health:9, ability:{trigger:'rally', effect:'buff', target:'tribe', attack:3, health:3}, text:'Minden támadásakor a törzséhez tartozó többi szövetséges +3/+3-at kap erre a harcra.'},
 master: {tier:6, attack:6, health:10, ability:{trigger:'turnEnd', effect:'buff', target:'left', attack:7, health:7}, text:'A köröd végén a bal oldali szomszédja tartósan +7/+7-et kap.'},
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
  ['Verso','rallyGuard','Perfection'], ['Monoco','guard','Bestial Wheel'],
  ['Esquie','coach','Expedition Guide'], ['Renoir','master','Chroma Surge'],
 ]},
 {name:'Star Wars', entries:[
  ['Anakin Skywalker','charge','Chosen One'], ['Obi-Wan Kenobi','cover','High Ground'],
  ['Padme Amidala','mentor','Senate Appeal'], ['Yoda','inspire','Jedi Wisdom'],
  ['Mace Windu','rallyGuard','Vaapad'], ['Ahsoka Tano','resolve','Padawan Courage'],
  ['General Grievous','guard','Four Lightsabers'], ['Darth Sidious','storm','Force Lightning'],
 ]},
 {name:'Solo Leveling', entries:[
  ['Sung Jinwoo','standard','Shadow Monarch'], ['Cha Hae-In','apprentice','Sword Dance'],
  ['Yoo Jinho','mentor','Loyal Companion'], ['Sung Jinah','resolve','Family Resolve'],
  ['Igris','ward','Blood-Red Commander'], ['Iron','reserves','Iron Wall'],
  ['Beru','shot','Ant King'], ['Go Gunhee','coach','Hunters Association'],
 ]},
 {name:'Hearthstone Battlegrounds', entries:[
  ['Bob the Bartender','mentor','Friendly Advice'], ['Patches the Pirate','charge','Pirate Charge'],
  ['The Curator','guard','Menagerie Keeper'], ['George the Fallen','cover','Divine Protection'],
  ['A. F. Kay','resolve','Patient Return'], ['Millhouse Manastorm','disrupt','Arcane Trick'],
  ['Ragnaros the Firelord','shot','By Fire Be Purged'], ['The Lich King','legacy','Frozen Legacy'],
 ]},
 {name:"The Hitchhiker's Guide to the Galaxy", entries:[
  ['Arthur Dent','resolve','Do Not Panic'], ['Ford Prefect','mentor','Guide Entry'],
  ['Zaphod Beeblebrox','charge','Two Heads'], ['Trillian','reinforce','Astrophysics'],
  ['Marvin','guard','Brain the Size of a Planet'], ['Slartibartfast','coach','Award-Winning Fjords'],
  ['Humma Kavula','disrupt','Point of View'], ['Deep Thought','inspire','Forty-Two'],
 ]},
 {name:'Doctor Who', entries:[
  ['The Doctor','cover','Sonic Screwdriver'], ['Rose Tyler','resolve','Bad Wolf'],
  ['Martha Jones','mentor','Medical Training'], ['Donna Noble','coach','Best Friend'],
  ['Amy Pond','supplier','The Girl Who Waited'], ['Rory Williams','apprentice','Last Centurion'],
  ['River Song','ambush','Hello Sweetie'], ['The Master','master','Time Lord Scheme'],
 ]},
 {name:'Little Misfortune', entries:[
  ['Misfortune Ramirez Hernandez','mentor','Glitter of Happiness'], ['Benjamin','reinforce','Protector'],
  ['Mr. Voice (Morgo)','ambush','Deceptive Narration'], ['Hiro','legacy','Lost Friend'],
  ['Misfortune’s Mother','coach','Eternal Happiness'], ['Puppy','resolve','Playful Companion'],
  ['Hamster','reserves','Underground Party'], ['Death','guard','Fourth Reality'],
 ]},
 {name:'The Batman (2022)', entries:[
  ['Bruce Wayne / Batman','rallyGuard','Armored Vigilante'], ['Selina Kyle / Catwoman','disrupt','Cat Burglar'],
  ['James Gordon','cover','Trusted Signal'], ['Alfred Pennyworth','mentor','Faithful Butler'],
  ['Oswald Cobblepot / Penguin','guard','Iceberg Lounge'], ['Edward Nashton / Riddler','ambush','Riddle Trap'],
  ['Carmine Falcone','inspire','Gotham Connections'], ['Bella Real','resolve','Renewal'],
 ]},
 {name:'Squid Game', entries:[
  ['Seong Gi-hun','resolve','Player 456'], ['Cho Sang-woo','disrupt','Calculated Risk'],
  ['Kang Sae-byeok','supplier','Quiet Survivor'], ['Abdul Ali','guard','Helping Hand'],
  ['Oh Il-nam','inspire','Old Friends'], ['Jang Deok-su','charge','Intimidation'],
  ['Han Mi-nyeo','legacy','Last Bargain'], ['Hwang Jun-ho','mentor','Undercover Officer'],
 ]},
 {name:'Rocket League', entries:[
  ['Octane','charge','Aerial Shot'], ['Dominus','shot','Power Shot'],
  ['Breakout','disrupt','Wall Pinch'], ['Merc','reserves','Goal Line Defense'],
  ['Venom (Rocket League)','resolve','Kickoff Boost'], ['X-Devil','ward','Midair Recovery'],
  ['Paladin','reinforce','Defensive Rotation'], ['Backfire','mentor','Centering Pass'],
 ]},
 {name:'The Matrix', entries:[
  ['Neo','ward','Bullet Dodge'], ['Trinity','apprentice','Rooftop Leap'],
  ['Morpheus','standard','Free Your Mind'], ['Agent Smith','master','System Override'],
  ['The Oracle','mentor','Know Thyself'], ['Cypher','disrupt','Betrayal'],
  ['Tank','cover','Operator Support'], ['Niobe','guard','Captain of the Logos'],
 ]},
 {name:'The Chosen', entries:[
  ['Jesus','inspire','Follow Me'], ['Simon Peter','guard','Fisherman’s Resolve'],
  ['Matthew','mentor','Careful Record'], ['Mary Magdalene','resolve','New Beginning'],
  ['Nicodemus','reinforce','Night Conversation'], ['Andrew','coach','Bring a Friend'],
  ['John','legacy','Faithful Witness'], ['Thomas','ward','Steadfast Faith'],
 ]},
 {name:'Rust', entries:[
  ['Naked Survivor','resolve','Fresh Spawn'], ['Hazmat Scientist','shot','Patrol Fire'],
  ['Heavy Scientist','guard','Heavy Armor'], ['Bandit Camp Guard','cover','Safe Zone'],
  ['Outpost Scientist','mentor','Outpost Supplies'], ['Bear','charge','Territorial Charge'],
  ['Wolf','supplier','Pack Instinct'], ['Patrol Helicopter','storm','Rocket Barrage'],
 ]},
 {name:'Sherlock (BBC)', entries:[
  ['Sherlock Holmes','disrupt','Deduction'], ['John Watson','cover','Army Doctor'],
  ['Mycroft Holmes','inspire','Government Connections'], ['Jim Moriarty','shot','Final Problem'],
  ['Irene Adler','supplier','The Woman'], ['Mrs. Hudson','mentor','Baker Street Hospitality'],
  ['Greg Lestrade','reserves','Scotland Yard'], ['Molly Hooper','resolve','Quiet Courage'],
 ]},
 {name:'Dark Souls III', entries:[
  ['Ashen One','resolve','Ember Restored'], ['Fire Keeper','mentor','Touch the Darkness'],
  ['Siegward of Catarina','guard','Onion Armor'], ['Anri of Astora','reinforce','Shared Quest'],
  ['Greirat','ward','Nimble Scavenger'], ['Abyss Watcher','charge','Wolf Blood'],
  ['Pontiff Sulyvahn','disrupt','Profaned Blade'], ['Soul of Cinder','storm','First Flame'],
 ]},
 {name:'Avatar (James Cameron)', entries:[
  ['Jake Sully','charge','Toruk Makto'], ['Neytiri','standard','Forest Archer'],
  ['Grace Augustine','mentor','Botanical Knowledge'], ['Norm Spellman','resolve','Avatar Training'],
  ['Trudy Chacon','reinforce','Air Support'], ['Tsu’tey','guard','Clan Warrior'],
  ['Mo’at','coach','Voice of Eywa'], ['Miles Quaritch','storm','AMP Assault'],
 ]},
 {name:'The Boys', entries:[
  ['Billy Butcher','rallyGuard','Supe Hunter'], ['Hughie Campbell','resolve','Unexpected Courage'],
  ['Annie January / Starlight','cover','Guiding Light'], ['Mother’s Milk','guard','Hold the Line'],
  ['Frenchie','mentor','Improvised Gear'], ['Kimiko','charge','Silent Fury'],
  ['Homelander','storm','Heat Vision'], ['Queen Maeve','ward','Warrior’s Resolve'],
 ]},
 {name:'South Park: The Stick of Truth / The Fractured But Whole', entries:[
  ['The New Kid','resolve','Choose Your Class'], ['Eric Cartman','shot','Grand Wizard'],
  ['Stan Marsh','guard','Toolshed'], ['Kyle Broflovski','cover','Human Kite'],
  ['Kenny McCormick','legacy','Mysterion'], ['Butters Stotch','mentor','Paladin’s Blessing'],
  ['Craig Tucker','charge','Super Craig'], ['Tweek Tweak','master','Wonder Tweek'],
 ]},
 {name:'The Truman Show', entries:[
  ['Truman Burbank','resolve','Good Morning'], ['Christof','inspire','Cue the Sun'],
  ['Sylvia / Lauren Garland','cover','Truth Beyond the Set'], ['Meryl Burbank','mentor','Product Placement'],
  ['Marlon','reserves','Best Friend'], ['Kirk Burbank','legacy','Father’s Return'],
  ['Angela Burbank','coach','Family Album'], ['Lawrence','supplier','Control Room'],
 ]},
 {name:'Chernobyl (2019)', entries:[
  ['Valery Legasov','mentor','Tell the Truth'], ['Boris Shcherbina','inspire','Emergency Coordination'],
  ['Ulana Khomyuk','disrupt','Reactor Analysis'], ['Anatoly Dyatlov','guard','Control Room Orders'],
  ['Vasily Ignatenko','legacy','First Responder'], ['Lyudmilla Ignatenko','resolve','Unwavering Devotion'],
  ['General Pikalov','rallyGuard','Radiation Reconnaissance'], ['Mikhail Shchadov','coach','Mobilize the Miners'],
 ]},
 {name:'Deadlock', entries:[
  ['Ivy','cover','Stone Form'], ['Abrams','guard','Shoulder Charge'],
  ['Bebop','ambush','Exploding Uppercut'], ['Dynamo','coach','Rejuvenating Aurora'],
  ['Infernus','charge','Flame Dash'], ['Haze','ward','Smoke Bomb'],
  ['Seven','storm','Storm Cloud'], ['Vindicta','mentor','Spotter'],
 ]},
 {name:'Shutter Island', entries:[
  ['Edward “Teddy” Daniels','resolve','Marshal’s Investigation'], ['Chuck Aule / Dr. Sheehan','cover','Trusted Partner'],
  ['Dr. John Cawley','mentor','Role-Play Therapy'], ['Dr. Jeremiah Naehring','rallyGuard','Clinical Interview'],
  ['Dolores Chanal','legacy','Haunting Memory'], ['Rachel Solando','ward','Missing Patient'],
  ['George Noyce','coach','Warning from Ward C'], ['The Warden','guard','Island Security'],
 ]},
 {name:'Friends', entries:[
  ['Rachel Green','resolve','Fresh Start'], ['Monica Geller','apprentice','Competitive Spirit'],
  ['Phoebe Buffay','legacy','Smelly Cat'], ['Joey Tribbiani','charge','How You Doin'],
  ['Chandler Bing','disrupt','Could I Be Any More'], ['Ross Geller','coach','Unagi'],
  ['Gunther','mentor','Central Perk'], ['Janice Hosenstein','ward','Oh My God'],
 ]},
 {name:'East of Eden (2008)', entries:[
  ['Lee Dong-chul','guard','Protective Brother'], ['Lee Dong-wook','disrupt','Prosecutor’s Case'],
  ['Min Hye-rin','mentor','Careful Counsel'], ['Kim Ji-hyun','resolve','Unbroken Resolve'],
  ['Shin Myung-hoon','charge','Rival Heir'], ['Gook Young-ran','reinforce','Loyal Heart'],
  ['Shin Tae-hwan','standard','Taesung Influence'], ['Yang Chun-hee','coach','Family Bonds'],
 ]},
 {name:'The Lord of the Rings', entries:[
  ['Frodo Baggins','ward','Ring-Bearer'], ['Samwise Gamgee','mentor','Carry You'],
  ['Aragorn','standard','Return of the King'], ['Legolas','shot','Elven Bow'],
  ['Gimli','guard','Dwarven Defense'], ['Gandalf','reinforce','You Shall Not Pass'],
  ['Boromir','legacy','Last Stand'], ['Gollum','disrupt','My Precious'],
 ]},
 {name:'Lord of Mysteries', entries:[
  ['Klein Moretti','disrupt','The Fool'], ['Audrey Hall','mentor','Spectator'],
  ['Alger Wilson','apprentice','The Hanged Man'], ['Derrick Berg','guard','The Sun'],
  ['Fors Wall','supplier','The Magician'], ['Xio Derecha','cover','Judgement'],
  ['Leonard Mitchell','coach','The Star'], ['Amon','ambush','Error'],
 ]},
 {name:'Vintage Story', entries:[
  ['Seraph','resolve','Temporal Survival'], ['Surface Drifter','reserves','Rusty Claws'],
  ['Corrupt Drifter','guard','Deep Cave Horror'], ['Locust','supplier','Clockwork Skitter'],
  ['Sawblade Locust','rallyGuard','Spinning Blade'], ['Bell','inspire','Cave Alarm'],
  ['Wolf (Vintage Story)','ambush','Forest Ambush'], ['Trader','mentor','Wagon Supplies'],
 ]},
 {name:'Spider-Man', entries:[
  ['Peter Parker / Spider-Man','ward','Spider-Sense'], ['Miles Morales','disrupt','Venom Strike'],
  ['Gwen Stacy / Ghost-Spider','charge','Web Swing'], ['Mary Jane Watson','mentor','Face It Tiger'],
  ['May Parker','coach','Great Responsibility'], ['Green Goblin','shot','Pumpkin Bomb'],
  ['Doctor Octopus','guard','Mechanical Arms'], ['Venom','storm','Symbiote Fury'],
 ]},
 {name:'9-1-1', entries:[
  ['Bobby Nash','standard','Captain of the 118'], ['Athena Grant','guard','Police Sergeant'],
  ['Evan “Buck” Buckley','charge','Ladder Rescue'], ['Henrietta Wilson','mentor','Paramedic Care'],
  ['Howard “Chimney” Han','cover','Emergency Support'], ['Eddie Diaz','ward','Rescue Training'],
  ['Maddie Buckley','coach','Dispatch Coordination'], ['Christopher Diaz','resolve','Brave Steps'],
 ]},
 {name:'Hero (2002)', entries:[
  ['Nameless','disrupt','Ten Paces'], ['Broken Sword','mentor','Calligraphy of Peace'],
  ['Flying Snow','charge','Sword Dance'], ['Long Sky','supplier','Courtyard Duel'],
  ['Moon','resolve','Apprentice’s Resolve'], ['King of Qin','inspire','All Under Heaven'],
  ['Qin Archer','ambush','Arrow Volley'], ['Qin Palace Guard','reserves','Palace Formation'],
 ]},
 {name:'The Residence', entries:[
  ['Cordelia Cupp','disrupt','Birdwatcher’s Eye'], ['Edwin Park','cover','Federal Partner'],
  ['A.B. Wynter','legacy','Household Protocol'], ['Jasmine Haney','mentor','Assistant Usher'],
  ['Lilly Schumacher','apprentice','State Dinner Pressure'], ['Harry Hollinger','guard','Chief Adviser'],
  ['Perry Morgan','standard','Presidential Address'], ['David Rylance','resolve','Diplomatic Guest'],
 ]},
 {name:'Fawlty Towers', entries:[
  ['Basil Fawlty','charge','Hotel Tantrum'], ['Sybil Fawlty','guard','Front Desk Authority'],
  ['Polly Sherman','cover','Quick Cover Story'], ['Manuel','resolve','Learning the Ropes'],
  ['Major Gowen','coach','Lobby Regular'], ['Terry Hughes','mentor','Kitchen Service'],
  ['Miss Tibbs','ward','Familiar Routine'], ['Miss Gatsby','legacy','Long-Term Guest'],
 ]},
 {name:'Dixit', entries:[
  ['Dixit Storyteller','mentor','One Cryptic Clue'], ['Dixit Dreamer','resolve','Dream Journey'],
  ['Dixit Rabbit','charge','Scoring Track Hop'], ['Dixit Guardian','reserves','Protect the Tale'],
  ['Dixit Wanderer','ward','Unknown Path'], ['Dixit Illusionist','disrupt','Misleading Image'],
  ['Dixit Stargazer','reinforce','Guiding Constellation'], ['Dixit Muse','standard','Shared Imagination'],
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
