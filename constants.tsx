
import { ArtworkData } from './types';

export const GALLERY_NAME = "MG Museum";
export const CURATORIAL_TEXT = `A Journey Through Art And MG's History. Stand on the circle to interact with the artworks by pressing ENTER KEY after read details appear.`;

export const ARTWORKS: ArtworkData[] = [
  // Back Wall (z = -4.95) - Center reserved for text
  {
    id: '1',
    title: 'The First',
    artist: 'MEET UP',
    description: 'First meetup with your fans. We never forgot your expression after seeing all those people came just for you. That moment said everything- suprise, gratitude, and pure happiness. It marked the beginning of a beautiful bond between you and boKkals',
    imageUrl: '/first-meetup.jpg',
    position: [-11, -0.6, -4.95],
    rotation: [0, 0, 0],
  },
  {
    id: '2',
    title: 'The Unexpected Bokkal',
    artist: 'BOKKAL',
    description: 'You shared how grateful you are after seeing people like him prioritising you more than anything. That moment reflected the deep respect and love your fans have for you. It was a reminder of how strongly your presence matters to them',
    imageUrl: '/unexcepted.jpg',
    position: [-6, -0.6, -4.95],
    rotation: [0, 0, 0],
  },
  {
    id: '3',
    title: 'The Trip',
    artist: 'TRIP',
    description: 'ANDAMAN trip with your bokkals. Every moment felt special sharing that journey together. Laughter, memories, and smile\'s made it unforgettable. Hope you had a great time and enjoyed a lot.',
    imageUrl: '/WA0011.jpg',
    position: [6, -0.6, -4.95],
    rotation: [0, 0, 0],
  },
  {
    id: '4',
    title: 'The Cancer',
    artist: 'GAME',
    description: 'The DRAGON CANCER.... a game that revealed real pain beyond the screen. It told a story filled with love, loss, and deep emotions. Every moment reminded us of the reality of many families face. An experience that stays in the heart long after playing.',
    imageUrl: '/WA0018.jpg',
    position: [11, -0.6, -4.95],
    rotation: [0, 0, 0],
  },
  // Opposite Wall (Front Wall, z = 4.95) - Total 7 Artworks
  {
    id: '10',
    title: 'The Hurt\'s',
    artist: 'GAME',
    description: 'VENBA.... this particular scene hurt\'s. It carries emotions that feels deeply personal and real. The silence, the music, and the moment say more than words ever could. A scene that stays heavy in the heart long after it ends.',
    imageUrl: '/WA0016.jpg',
    position: [-15, -0.6, 4.95],
    rotation: [0, Math.PI, 0],
  },
  {
    id: '5',
    title: 'The Little',
    artist: 'CHILD',
    description: 'Bali trip with this LITTLE ONE. Every moment felt brighter with that smile around. A bond filled with joy, laughter, and pure innocence. That\'s a truly adorable combo right there!',
    imageUrl: '/WA0012.jpg ',
    position: [-10, -0.6, 4.95],
    rotation: [0, Math.PI, 0],
  },
  {
    id: '6',
    title: 'The RJ',
    artist: 'INTERVIEW',
    description: 'Small talk with MAKAPA. It started casual but quickly got interesting. Laugh, random topics, and unexpected moments all around. Definitely a whole new experience-podcast vibes done right!',
    imageUrl: '/WA0025.jpg',
    position: [-5, -0.6, 4.95],
    rotation: [0, Math.PI, 0],
  },
  {
    id: '9',
    title: 'The Stays',
    artist: 'CHILD',
    description: 'Some incident like this will always stay in our hearts le.... The love shown by that child spoke louder than words ever could. Pure emotions, pure connections, no language needed. A moment that reminds us how deeply love can be felt.',
    imageUrl: '/WA0019.jpg',
    position: [0, -0.6, 4.95],
    rotation: [0, Math.PI, 0],
  },
  {
    id: '7',
    title: 'The 80thu',
    artist: 'INTERVIEW',
    description: 'Interview with Ranjith sirr. The conversation was calm until that moment hit "80THU POLA and SOORAKATHU POLAVARAN DAHH... SODAKU POTU ADIKA VARAN DAHH... 80THU POLA" becomes an instant peak. A line that turned the whole interview iconic and unforgettable!! Waiting for next LALITHA...👶',
    imageUrl: '/WA0026.jpg',
    position: [5, -0.6, 4.95],
    rotation: [0, Math.PI, 0],
  },
  {
    id: '8',
    title: 'The Bro',
    artist: 'BOKKAL',
    description: 'Couldn\'t forgot this man, NI8 HAWK bro. A constant presence with unwavering support. Always standing strong, through every high and low. Truely a deep supporter, always respected and remembered.',
    imageUrl: '/WA0020.jpg',
    position: [10, -0.6, 4.95],
    rotation: [0, Math.PI, 0],
  },
  {
    id: '11',
    title: 'The Big',
    artist: 'MEET UP',
    description: 'Second meetup in Kovai. The energy peaked at your entry... Your words, CHENNAI EH THOOKI SAPTA KOVAI.... 🔥🔥🔥🔥 wasn\'t just a line-it was a statement. A proud moment that truely defined the spirit of Kovai.',
    imageUrl: '/WA0021.jpg',
    position: [15, -0.6, 4.95],
    rotation: [0, Math.PI, 0],
  }
];

export const GALLERY_SIZE = {
  width: 40,
  height: 7,
  depth: 12
};
