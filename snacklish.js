const blacklist = new Set([
    "the", "of", "and", "a", "to", "in", "is", "you", "that", "it",
    "he", "was", "for", "on", "are", "as", "with", "his", "they", "i",
    "at", "be", "this", "have", "from", "or", "by", "one", "had", "not",
    "but", "what", "all", "were", "we", "when", "your", "can", "there", "an",
    "each", "which", "she", "do", "how", "their", "if", "will", "up", "other",
    "about", "out", "many", "then", "them", "these", "so", "some", "her", "would",
    "make", "like", "him", "into", "time", "has", "look", "two", "more", "write",
    "go", "see", "number", "no", "way", "could", "people", "my", "than", "first",
    "water", "been", "call", "who", "its", "now", "find", "long", "down", "day",
    "did", "get", "come", "made", "may", "part"
]);

const fixedList = {
    "say": "saytisfy",
    "better": "treatter",
    "there": "treatere",
    "if": "fill",
    "you're": "youchewer",
    "true": "chew",
    "us": "chews",
    "use": "chewse",
    "now": "chow",
    "make": "caramakel",
    "know": "knougat",
    "no": "nougat",
    "meme": "yume",
    "my": "yumy",
    "yes": "yumye",
    "snake": "snack",
    "little": "snackittle",
    "sucked": "snacked",
    "six": "snax",
    "storm": "snackstorm",
    "kill": "hungercide",
    "war": "whunger",
    "man": "hungerman",
    "tongue": "tonguegry",
    "noone": "chocone",
    "got": "chocot",
    "hope": "chocopelate",
    "been": "beenut",
    "can": "canut",
    "much": "nutuch",
    "pawn": "pawnuts",
    "none": "nutte",
    "regret": "nutgret",
    "must": "nuts",
    "nine": "ninut",
    "bare": "bar",
    "think": "chomptemplate",
    "time": "chomptime",
    "create": "crunch",
    "created": "crunched",
    "dead": "fed",
    "seven": "sweetven",
    "so": "soweet",
    "eat": "wait",
    "body": "candy",
    "full": "mouthfull",
    "her": "flaveher",
    "four": "flavefour",
    "worst": "flavorst",
    "give": "goodive",
    "pretty": "prettytasty",
    "take": "takesty",
    "state": "substateial",
    "hidden": "hiddenjoy",
    "have": "havisfaction"
};

const ruleList = [
    { pattern: /[bcdfghjklmnpqrstvwxz](ight|ite)/gi, replace: 'bite' },
    { pattern: /(ck|x)\b/gi, replace: '$0olate' },
    { pattern: /\b(co|cl|go)/gi, replace: 'cho$0' },
    { pattern: /\bo/gi, replace: 'choco' },
    { pattern: /t\b/gi, replace: 'nut' },
    { pattern: /ts\b/gi, replace: 'treats' },
    { pattern: /tr/gi, replace: 'treat' },
    { pattern: /\bs/gi, replace: 'sati$0' },
    { pattern: /\b[fpwln]/gi, replace: 'satis$0' },
    { pattern: /\b[bcdfghjklmnpqrstvwxz]is/gi, replace: 'satis' },
    { pattern: /[aeiouyr]\b/gi, replace: '$0licious' },
    { pattern: /es\b/gi, replace: 'elicious' },
    { pattern: /[ts]\b/gi, replace: '$0isfaction' },
    { pattern: /er\b/gi, replace: 'isfaction' },
    {
      pattern: /\b[bcdfghjklmnpqrstvwxz]ark\b/gi,
      replace: 'satis$0tion'
    },
    { pattern: /ve\b/gi, replace: 'visfaction' },
    { pattern: /\bin/gi, replace: 'indulg' },
    { pattern: /\bd/gi, replace: 'induld' },
    { pattern: /in\b/gi, replace: 'indulge' },
    { pattern: /\bany/gi, replace: 'candy' },
    { pattern: /ing\b/gi, replace: 'eat' },
    { pattern: /\bext/gi, replace: 'eats' },
    {
      pattern: /\b(b[e]?|pre|[cdfghjklmnopqrstvwxz]ar)/gi,
      replace: 'bar'
    },
    { pattern: /\b(comp|sop?|o?p)/gi, replace: 'chomp' },
    { pattern: /\bcont/gi, replace: 'crunch' },
    { pattern: /p\b/gi, replace: 'peanut' },
    { pattern: /\bbl?/gi, replace: 'delecta$0' },
    { pattern: /(ds?|l)\b/gi, replace: 'delectable' },
    {
      pattern: /\b[bcdfghjklmnpqrstwxz]?[ae](ck|k|c|g|t)/gi,
      replace: 'snack'
    },
    { pattern: /\b[k]/gi, replace: 'snack' },
    { pattern: /\bl/gi, replace: 'caramel' },
    { pattern: /l\b/gi, replace: 'lamel' },
    {
      pattern: /\b[bcdfghjklmnpqrstvwxz]?(a|e|i)(l|n)/gi,
      replace: 'caram$1$2'
    },
    { pattern: /med\b/gi, replace: 'meled' },
    { pattern: /\bre/gi, replace: 'hungry' },
    { pattern: /\b(r|gr)/gi, replace: 'hunger' },
    { pattern: /\b(m|hun|hum)/gi, replace: 'yum' },
    { pattern: /(em|eam)/gi, replace: 'eyum' },
    {
      pattern: /\b[bcdfghjklmnpqrstvwxz]{0,3}(al+|il+|el+)/gi,
      replace: 'fill'
    },
    { pattern: /ls\b/gi, replace: 'fills' },
    { pattern: /\bt/gi, replace: 'nougat' },
    { pattern: /\bg/gi, replace: 'noug' },
    { pattern: /n\b/gi, replace: 'nougat' },
    { pattern: /\b[bcdfghjklmnpqrstvwxz]ag/gi, replace: 'noug' },
    { pattern: /\bar/gi, replace: 'nougar' },
    { pattern: /\bnu\b/gi, replace: 'nougat' },
    { pattern: /\bus/gi, replace: 'chews' },
    { pattern: /\bw/gi, replace: 'chew' },
    { pattern: /\bup/gi, replace: 'chewp' },
    { pattern: /\btr/gi, replace: 'chewr' },
    { pattern: /\bun/gi, replace: 'nut' },
    { pattern: /tur/gi, replace: 'chewer' },
    { pattern: /[c^](do|ru|tw|hu|qu|tu|eu)/gi, replace: 'chew' },
    { pattern: /[bcdfghjklmnpqrstvwxz](ow|aw)/gi, replace: 'chow' },
    { pattern: /net|not/gi, replace: 'nut' },
    { pattern: /ous/gi, replace: 'nuts' },
    { pattern: /nt\b/gi, replace: 'nut' },
    { pattern: /nt/gi, replace: 'nutt' }
  ];

function transformToSnacklish(inputText, probability = 0.5) {
    function shouldTransform(probability) {
        return Math.random() < probability;
    }

    for (const [key, value] of Object.entries(fixedList)) {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        inputText = inputText.replace(regex, value);
    }

    const words = inputText.split(' ');

    const transformedWords = words.map(word => {
        if (blacklist.has(word.toLowerCase())) {
            return word;
        }
        
        for (const rule of ruleList) {
            if (rule.pattern.test(word) && shouldTransform(probability)) {
                word = word.replace(rule.pattern, rule.replace);
                break;  
            }
        }

        word = word.replace(/\$0|\$1\$2/g, "");

        return word;
    });

    return transformedWords.join(' ');
}

module.exports = transformToSnacklish;