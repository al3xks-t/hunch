// features/profile/utils/questionRoulette.js
export const questionPool = [
    "What’s your toxic trait?",
    "What’s your go-to karaoke song?",
    "A shower thought I had recently...",
    "My ideal weekend looks like...",
    "If I were a flavor, I'd be...",
    "An oddly specific thing I love is...",
    "Something I could talk about for hours is...",
    "The emoji I use way too much is...",
    "If my life had a theme song, it’d be...",
    "I'm irrationally afraid of..."
  ];
  
  export const getRandomQuestions = (count) => {
    const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  