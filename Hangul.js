var Hangul = (function (exports) {
  'use strict';

  var makeAry = (aryLike) => {
    if (typeof aryLike === 'string') {
      return aryLike.split``;
    } if (!Array.isArray(aryLike)) {
      throw new TypeError('aryLike must be a string or an array!');
    }
    return aryLike;
  };

  // I mean, how am I supposed to describe this?

  var runAry = (method => arg => aryLike => makeAry(aryLike)[method](v => arg(v)));

  var contains = (runAry('some'));

  var isAll = (runAry('every'));

  class Range {
    constructor(start, end) {
      if (typeof (start + end) !== 'number') {
        throw new TypeError('Both arguments to the Range constructor must be numbers!');
      }
      this.start = start;
      this.end = end;
      this.length = this.end - this.start + 1;
    }

    contains(num) {
      return num >= this.start && num <= this.end;
    }

    forEach(fn) {
      for (let i = this.start; i <= this.end; i++) {
        fn(i);
      }
    }

    map(fn) {
      return Array(this.length).fill``.map((v, i) => fn(i + this.start));
    }
  }

  var assertChar = ((char) => {
    if (typeof char !== 'string') {
      throw new TypeError('char must be a string!');
    } if (char.length - 1) {
      throw new Error(`"${char}" is not a character!`);
    }
  });

  var is = (range => (char) => {
    assertChar(char);
    if (range instanceof Range) {
      return range.contains(char.codePointAt(0));
    } if (Array.isArray(range)) {
      return range.includes(char);
    } if (typeof range === 'object') {
      return !!range[char];
    }
    return false;
  });

  const jamo = new Range(0x1100, 0x11FF);
  const compatibilityJamo = new Range(0x3130, 0x318F);
  const jamoExtendedA = new Range(0xA960, 0xA97F);
  const syllables = new Range(0xAC00, 0xD7AF);
  const jamoExtendedB = new Range(0xD7B0, 0xD7FF);
  const halfwidth = new Range(0xFFA0, 0xFFDF);
  const reserved = [
    0x3130, 0x318F, // compatibilityJamo
    new Range(0xA97D, 0xA97F), // jamoExtendedA
    new Range(0xD7A4, 0xD7AF), // syllables
    new Range(0xD7C7, 0xD7CA), // jamoExtendedB
    new Range(0xD7FC, 0xD7FF), // jamoExtendedB
  ];
  const isJamo = is(jamo);
  const isCompatibilityJamo = is(compatibilityJamo);
  const isJamoExtendedA = is(jamoExtendedA);
  const isSyllable = is(syllables);
  const isJamoExtendedB = is(jamoExtendedB);
  const isHalfwidth = is(halfwidth);

  const consonants = {
    ㄱ: 1,
    ㄴ: 1,
    ㄷ: 1,
    ㄹ: 1,
    ㅁ: 1,
    ㅂ: 1,
    ㅅ: 1,
    ㅇ: 1,
    ㅈ: 1,
    ㅊ: 1,
    ㅋ: 1,
    ㅌ: 1,
    ㅍ: 1,
    ㅎ: 1,
  };
  const vowels = {
    ㅏ: 1,
    ㅐ: 1,
    ㅑ: 1,
    ㅓ: 1,
    ㅔ: 1,
    ㅕ: 1,
    ㅖ: 1,
    ㅗ: 1,
    ㅛ: 1,
    ㅜ: 1,
    ㅠ: 1,
    ㅡ: 1,
    ㅣ: 1,
  };
  // ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  // ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'];
  // They're stored as objects so there's no need for iteration

  const isConsonant = is(consonants);
  const isVowel = is(vowels);

  const isStandardHangul = char => isCompatibilityJamo(char) || isSyllable(char);
  const isHangul = char => (
    isStandardHangul(char)
    || isJamo(char)
    || isJamoExtendedA(char)
    || isJamoExtendedB(char)
    || isHalfwidth(char)
  );

  const cho = {
    // the characters that you can type with "one" key + shift
    ㄱ: {
      $: 'ㄱ',
      ㄱ: 'ㄲ',
    },
    ㄷ: {
      $: 'ㄷ',
      ㄷ: 'ㄸ',
    },
    ㅅ: {
      $: 'ㅅ',
      ㅅ: 'ㅆ',
    },
    ㅈ: {
      $: 'ㅈ',
      ㅈ: 'ㅉ',
    },
    ㅂ: {
      $: 'ㅂ',
      ㅂ: 'ㅃ',
    },
  };
  const jung = {
    ㅗ: {
      $: 'ㅗ',
      ㅏ: 'ㅘ',
      ㅐ: 'ㅙ',
      ㅣ: 'ㅚ',
    },
    ㅜ: {
      $: 'ㅜ',
      ㅓ: 'ㅝ',
      ㅔ: 'ㅞ',
      ㅣ: 'ㅟ',
    },
    ㅡ: {
      $: 'ㅡ',
      ㅣ: 'ㅢ',
    },
  };
  const jong = {
    ㄱ: {
      $: 'ㄱ',
      ㄱ: 'ㄲ',
      ㅅ: 'ㄳ',
    },
    ㄴ: {
      $: 'ㄴ',
      ㅈ: 'ㄵ',
      ㅎ: 'ㄶ',
    },
    ㄹ: {
      $: 'ㄹ',
      ㄱ: 'ㄺ',
      ㅁ: 'ㄻ',
      ㅂ: 'ㄼ',
      ㅅ: 'ㄽ',
      ㅌ: 'ㄾ',
      ㅍ: 'ㄿ',
      ㅎ: 'ㅀ',
    },
    ㅂ: {
      $: 'ㅂ',
      ㅅ: 'ㅄ',
    },
    ㅅ: {
      $: 'ㅅ',
      ㅅ: 'ㅆ',
    },
  };
  const irregular = {
    is: 'irregular',
    ㄴ: {
      $: 'ㄴ',
      ㄴ: 'ㅥ',
      ㄷ: 'ㅦ',
      ㅅ: 'ㅧ',
      ㅿ: 'ㅨ',
    },
    ㄹ: {
      $: 'ㄹ',
      ㄱ: {
        isComplex: true,
        $: 'ㄺ',
        ㅅ: 'ㅩ',
      },
      ㄷ: 'ㅪ',
      ㅂ: {
        isComplex: true,
        $: 'ㄼ',
        ㅅ: 'ㅫ',
      },
      ㅿ: 'ㅬ',
      ㆆ: 'ㅭ',
    },
    ㅁ: {
      $: 'ㅁ',
      ㅂ: 'ㅮ',
      ㅅ: 'ㅯ',
      ㅿ: 'ㅰ',
    },
    ㅂ: {
      $: 'ㅂ',
      ㄱ: 'ㅲ',
      ㄷ: 'ㅳ',
      ㅅ: {
        isComplex: true,
        $: 'ㅄ',
        ㄱ: 'ㅴ',
        ㄷ: 'ㅵ',
      },
      ㅈ: 'ㅶ',
      ㅌ: 'ㅷ',
    },
    ㅅ: {
      $: 'ㅅ',
      ㄱ: 'ㅺ',
      ㄴ: 'ㅻ',
      ㄷ: 'ㅼ',
      ㅂ: 'ㅽ',
      ㅈ: 'ㅾ',
    },
    ㅇ: {
      $: 'ㅇ',
      ㅇ: 'ㆀ',
    },
    ㆁ: {
      $: 'ㆁ',
      ㅅ: 'ㆁ',
      ㅿ: 'ㅿ',
    },
    ㅎ: {
      $: 'ㅎ',
      ㅎ: 'ㆅ',
    },
    ㅛ: {
      $: 'ㅛ',
      ㅑ: 'ㆇ',
      ㅒ: 'ㆈ',
      ㅣ: 'ㆉ',
    },
    ㅠ: {
      $: 'ㅠ',
      ㅕ: 'ㆊ',
      ㅖ: 'ㆋ',
      ㅣ: 'ㆌ',
    },
    ㆍ: {
      $: 'ㆍ',
      ㅣ: 'ㆎ',
    },
  };
  // this file is sure complex...

  const cho$1 = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ',
    'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
    'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
  ];
  const choNum = {
    ㄱ: 0,
    ㄲ: 1,
    ㄴ: 2,
    ㄷ: 3,
    ㄸ: 4,
    ㄹ: 5,
    ㅁ: 6,
    ㅂ: 7,
    ㅃ: 8,
    ㅅ: 9,
    ㅆ: 10,
    ㅇ: 11,
    ㅈ: 12,
    ㅉ: 13,
    ㅊ: 14,
    ㅋ: 15,
    ㅌ: 16,
    ㅍ: 17,
    ㅎ: 18,
  };
  const jung$1 = [
    'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ',
    'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ',
    'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ',
  ];
  const jungNum = {
    ㅏ: 0,
    ㅐ: 1,
    ㅑ: 2,
    ㅒ: 3,
    ㅓ: 4,
    ㅔ: 5,
    ㅕ: 6,
    ㅖ: 7,
    ㅗ: 8,
    ㅘ: 9,
    ㅙ: 10,
    ㅚ: 11,
    ㅛ: 12,
    ㅜ: 13,
    ㅝ: 14,
    ㅞ: 15,
    ㅟ: 16,
    ㅠ: 17,
    ㅡ: 18,
    ㅢ: 19,
    ㅣ: 20,
  };
  const jong$1 = [
    null, 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ',
    'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
    'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ',
    'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
  ];
  const jongNum = {
    ㄱ: 1,
    ㄲ: 2,
    ㄳ: 3,
    ㄴ: 4,
    ㄵ: 5,
    ㄶ: 6,
    ㄷ: 7,
    ㄹ: 8,
    ㄺ: 9,
    ㄻ: 10,
    ㄼ: 11,
    ㄽ: 12,
    ㄾ: 13,
    ㄿ: 14,
    ㅀ: 15,
    ㅁ: 16,
    ㅂ: 17,
    ㅄ: 18,
    ㅅ: 19,
    ㅆ: 20,
    ㅇ: 21,
    ㅈ: 22,
    ㅊ: 23,
    ㅋ: 24,
    ㅌ: 25,
    ㅍ: 26,
    ㅎ: 27,
  };

  class Result {
    constructor(result = '', remainder = []) {
      this.result = result;
      if (!Array.isArray(remainder)) {
        throw new TypeError('The remainder of a new Result must be an array!');
      }
      this.remainder = remainder;
    }
  }

  const isAllString = isAll(v => typeof v === 'string');
  var composeComplex = (...objList) => (...ary) => {
    let objects = objList.slice();
    if (!objects.length) {
      throw new Error('Cannot compose complex without a list of complex to compose!');
    } if (ary.length < 2) {
      return new Result(ary[0]);
    }
    let i = 0;
    let res = '';
    while (i < ary.length) {
      const currentChar = ary[i];
      assertChar(currentChar);
      const currentObjects = objects.map(obj => obj[currentChar]).filter(v => v);
      if (!currentObjects.length) {
        // the current char in the array cannot be attached to the previous
        // characters to form a complex character
        res = objects[0].$;
        if (!res) {
          res = currentChar;
          i++;
        }
        break;
      } if (isAllString(currentObjects)) {
        // if there's only one option to choose from
        [res] = currentObjects;
        i++;
        break;
      }
      objects = currentObjects;
      i++;
      if (i === ary.length) {
        if (typeof currentObjects[0] === 'string') {
          [res] = currentObjects;
          break;
        }
        res = currentObjects[0].$;
      }
    }
    return new Result(res, ary.slice(i));
  };

  // if you're gonna copy this part, at least give me credit.
  // I had to do all of this manually.
  const jamo$1 = {
    ᄀ: 'ㄱ',
    ᄁ: ['ㄱ', 'ㄱ'],
    ᄂ: 'ㄴ',
    ᄃ: 'ㄷ',
    ᄄ: ['ㄷ', 'ㄷ'],
    ᄅ: 'ㄹ',
    ᄆ: 'ㅁ',
    ᄇ: 'ㅂ',
    ᄈ: ['ㅂ', 'ㅂ'],
    ᄉ: 'ㅅ',
    ᄊ: ['ㅅ', 'ㅅ'],
    ᄋ: 'ㅇ',
    ᄌ: 'ㅈ',
    ᄍ: ['ㅈ', 'ㅈ'],
    ᄎ: 'ㅊ',
    ᄏ: 'ㅋ',
    ᄐ: 'ㅌ',
    ᄑ: 'ㅍ',
    ᄒ: 'ㅎ',
    ᄓ: ['ㄴ', 'ㄱ'],
    ᄔ: ['ㄴ', 'ㄴ'],
    ᄕ: ['ㄴ', 'ㄷ'],
    ᄖ: ['ㄴ', 'ㅂ'],
    ᄗ: ['ㄷ', 'ㄱ'],
    ᄘ: ['ㄹ', 'ㄴ'],
    ᄙ: ['ㄹ', 'ㄹ'],
    ᄚ: ['ㄹ', 'ㅎ'],
    ᄛ: ['ㄹ', 'ㅇ'],
    ᄜ: ['ㅁ', 'ㅂ'],
    ᄝ: 'ㅱ',
    ᄞ: ['ㅂ', 'ㄱ'],
    ᄟ: ['ㅂ', 'ㄴ'],
    ᄠ: ['ㅂ', 'ㄷ'],
    ᄡ: ['ㅂ', 'ㅅ'],
    ᄢ: ['ㅂ', 'ㅅ', 'ㄱ'],
    ᄣ: ['ㅂ', 'ㅅ', 'ㄷ'],
    ᄤ: ['ㅂ', 'ㅅ', 'ㅂ'],
    ᄥ: ['ㅂ', 'ㅅ', 'ㅅ'],
    ᄦ: ['ㅂ', 'ㅅ', 'ㅈ'],
    ᄧ: ['ㅂ', 'ㅈ'],
    ᄨ: ['ㅂ', 'ㅊ'],
    ᄩ: ['ㅂ', 'ㅌ'],
    ᄪ: ['ㅂ', 'ㅍ'],
    ᄫ: 'ㅸ',
    ᄬ: 'ㅹ',
    ᄭ: ['ㅅ', 'ㄱ'],
    ᄮ: ['ㅅ', 'ㄴ'],
    ᄯ: ['ㅅ', 'ㄷ'],
    ᄰ: ['ㅅ', 'ㄹ'],
    ᄱ: ['ㅅ', 'ㅁ'],
    ᄲ: ['ㅅ', 'ㅂ'],
    ᄳ: ['ㅅ', 'ㅂ', 'ㄱ'],
    ᄴ: ['ㅅ', 'ㅅ', 'ㅅ'],
    ᄵ: ['ㅅ', 'ㅇ'],
    ᄶ: ['ㅅ', 'ㅈ'],
    ᄷ: ['ㅅ', 'ㅊ'],
    ᄸ: ['ㅅ', 'ㅋ'],
    ᄹ: ['ㅅ', 'ㅌ'],
    ᄺ: ['ㅅ', 'ㅍ'],
    ᄻ: ['ㅅ', 'ㅎ'],
    ᄼ: null,
    ᄽ: null,
    ᄾ: null,
    ᄿ: null,
    ᅀ: 'ㅿ',
    ᅁ: ['ㅇ', 'ㄱ'],
    ᅂ: ['ㅇ', 'ㄷ'],
    ᅃ: ['ㅇ', 'ㅁ'],
    ᅄ: ['ㅇ', 'ㅂ'],
    ᅅ: ['ㅇ', 'ㅅ'],
    ᅆ: ['ㅇ', 'ㅿ'],
    ᅇ: ['ㅇ', 'ㅇ'],
    ᅈ: ['ㅇ', 'ㅈ'],
    ᅉ: ['ㅇ', 'ㅊ'],
    ᅊ: ['ㅇ', 'ㅌ'],
    ᅋ: ['ㅇ', 'ㅍ'],
    ᅌ: 'ㆁ',
    ᅍ: ['ㅈ', 'ㅇ'],
    ᅎ: null,
    ᅏ: null,
    ᅐ: null,
    ᅑ: null,
    ᅒ: ['ㅊ', 'ㅋ'],
    ᅓ: ['ㅊ', 'ㅎ'],
    ᅔ: null,
    ᅕ: null,
    ᅖ: ['ㅂ', 'ㅂ'],
    ᅗ: 'ㆄ',
    ᅘ: ['ㅎ', 'ㅎ'],
    ᅙ: 'ㆆ',
    ᅚ: ['ㄱ', 'ㄷ'],
    ᅛ: ['ㄱ', 'ㅅ'],
    ᅜ: ['ㄱ', 'ㅈ'],
    ᅝ: ['ㄱ', 'ㅎ'],
    ᅞ: ['ㄷ', 'ㄹ'],
    ᅡ: 'ㅏ',
    ᅢ: 'ㅐ',
    ᅣ: 'ㅑ',
    ᅤ: 'ㅒ',
    ᅥ: 'ㅓ',
    ᅦ: 'ㅔ',
    ᅧ: 'ㅕ',
    ᅨ: 'ㅖ',
    ᅩ: 'ㅗ',
    ᅪ: ['ㅗ', 'ㅏ'],
    ᅫ: ['ㅗ', 'ㅐ'],
    ᅬ: ['ㅗ', 'ㅣ'],
    ᅭ: 'ㅛ',
    ᅮ: 'ㅜ',
    ᅯ: ['ㅜ', 'ㅓ'],
    ᅰ: ['ㅜ', 'ㅔ'],
    ᅱ: ['ㅜ', 'ㅣ'],
    ᅲ: 'ㅠ',
    ᅳ: 'ㅡ',
    ᅴ: ['ㅡ', 'ㅣ'],
    ᅵ: 'ㅣ',
    ᅶ: ['ㅏ', 'ㅗ'],
    ᅷ: ['ㅏ', 'ㅜ'],
    ᅸ: ['ㅑ', 'ㅗ'],
    ᅹ: ['ㅑ', 'ㅛ'],
    ᅺ: ['ㅓ', 'ㅗ'],
    ᅻ: ['ㅓ', 'ㅜ'],
    ᅼ: ['ㅓ', 'ㅡ'],
    ᅽ: ['ㅕ', 'ㅗ'],
    ᅾ: ['ㅕ', 'ㅜ'],
    ᅿ: ['ㅗ', 'ㅓ'],
    ᆀ: ['ㅔ', 'ㅗ'],
    ᆁ: ['ㅖ', 'ㅗ'],
    ᆂ: ['ㅗ', 'ㅗ'],
    ᆃ: ['ㅗ', 'ㅜ'],
    ᆄ: ['ㅛ', 'ㅑ'],
    ᆅ: ['ㅛ', 'ㅒ'],
    ᆆ: ['ㅛ', 'ㅕ'],
    ᆇ: ['ㅛ', 'ㅗ'],
    ᆈ: ['ㅛ', 'ㅣ'],
    ᆉ: ['ㅜ', 'ㅏ'],
    ᆊ: ['ㅜ', 'ㅐ'],
    ᆋ: ['ㅜ', 'ㅓ', 'ㅡ'],
    ᆌ: ['ㅜ', 'ㅖ'],
    ᆍ: ['ㅜ', 'ㅜ'],
    ᆎ: ['ㅠ', 'ㅏ'],
    ᆏ: ['ㅠ', 'ㅓ'],
    ᆐ: ['ㅠ', 'ㅔ'],
    ᆑ: ['ㅠ', 'ㅕ'],
    ᆒ: ['ㅠ', 'ㅔ'],
    ᆓ: ['ㅠ', 'ㅜ'],
    ᆔ: ['ㅠ', 'ㅣ'],
    ᆕ: ['ㅡ', 'ㅜ'],
    ᆖ: ['ㅡ', 'ㅡ'],
    ᆗ: ['ㅡ', 'ㅣ', 'ㅜ'],
    ᆘ: ['ㅣ', 'ㅏ'],
    ᆙ: ['ㅣ', 'ㅑ'],
    ᆚ: ['ㅣ', 'ㅗ'],
    ᆛ: ['ㅣ', 'ㅜ'],
    ᆜ: ['ㅣ', 'ㅡ'],
    ᆝ: null,
    ᆞ: 'ㆍ',
    ᆟ: ['ㆍ', 'ㅓ'],
    ᆠ: ['ㆍ', 'ㅜ'],
    ᆡ: ['ㆍ', 'ㅣ'],
    ᆢ: ['ㆍ', 'ㆍ'],
    ᆣ: ['ㅏ', 'ㅡ'],
    ᆤ: ['ㅑ', 'ㅜ'],
    ᆥ: ['ㅕ', 'ㅑ'],
    ᆦ: ['ㅗ', 'ㅑ'],
    ᆧ: ['ㅗ', 'ㅒ'],
    ᆨ: 'ㄱ',
    ᆩ: ['ㄱ', 'ㄱ'],
    ᆪ: ['ㄱ', 'ㅅ'],
    ᆫ: 'ㄴ',
    ᆬ: ['ㄴ', 'ㅈ'],
    ᆭ: ['ㄴ', 'ㅎ'],
    ᆮ: 'ㄷ',
    ᆯ: 'ㄹ',
    ᆰ: ['ㄹ', 'ㄱ'],
    ᆱ: ['ㄹ', 'ㅁ'],
    ᆲ: ['ㄹ', 'ㅂ'],
    ᆳ: ['ㄹ', 'ㅅ'],
    ᆴ: ['ㄹ', 'ㅌ'],
    ᆵ: ['ㄹ', 'ㅍ'],
    ᆶ: ['ㄹ', 'ㅎ'],
    ᆷ: 'ㅁ',
    ᆸ: 'ㅂ',
    ᆹ: ['ㅂ', 'ㅅ'],
    ᆺ: 'ㅅ',
    ᆻ: ['ㅅ', 'ㅅ'],
    ᆼ: 'ㅇ',
    ᆽ: 'ㅈ',
    ᆾ: 'ㅊ',
    ᆿ: 'ㅋ',
    ᇀ: 'ㅌ',
    ᇁ: 'ㅍ',
    ᇂ: 'ㅎ',
    ᇃ: ['ㄱ', 'ㄹ'],
    ᇄ: ['ㄱ', 'ㅅ', 'ㄱ'],
    ᇅ: ['ㄴ', 'ㄱ'],
    ᇆ: ['ㄴ', 'ㄷ'],
    ᇇ: ['ㄴ', 'ㅅ'],
    ᇈ: ['ㄴ', 'ㅿ'],
    ᇉ: ['ㄴ', 'ㅌ'],
    ᇊ: ['ㄷ', 'ㄱ'],
    ᇋ: ['ㄷ', 'ㄹ'],
    ᇌ: ['ㄹ', 'ㄱ', 'ㅅ'],
    ᇍ: ['ㄹ', 'ㄴ'],
    ᇎ: ['ㄹ', 'ㄷ'],
    ᇏ: ['ㄹ', 'ㄷ', 'ㅎ'],
    ᇐ: ['ㄹ', 'ㄹ'],
    ᇑ: ['ㄹ', 'ㅁ', 'ㄱ'],
    ᇒ: ['ㄹ', 'ㅁ', 'ㅅ'],
    ᇓ: ['ㄹ', 'ㅂ', 'ㅅ'],
    ᇔ: ['ㄹ', 'ㅂ', 'ㅎ'],
    ᇕ: ['ㄹ', 'ㅸ'],
    ᇖ: ['ㄹ', 'ㅅ', 'ㅅ'],
    ᇗ: ['ㄹ', ''],
    ᇘ: ['ㄹ', 'ㅋ'],
    ᇙ: ['ㄹ', 'ㆆ'],
    ᇚ: ['ㅁ', 'ㄱ'],
    ᇛ: ['ㅁ', 'ㄹ'],
    ᇜ: ['ㅁ', 'ㅂ'],
    ᇝ: ['ㅁ', 'ㅅ'],
    ᇞ: ['ㅁ', 'ㅅ', 'ㅅ'],
    ᇟ: ['ㅁ', 'ㅿ'],
    ᇠ: ['ㅁ', 'ㅊ'],
    ᇡ: ['ㅁ', 'ㅎ'],
    ᇢ: 'ㅱ',
    ᇣ: ['ㅂ', 'ㄹ'],
    ᇤ: ['ㅂ', 'ㅍ'],
    ᇥ: ['ㅂ', 'ㅎ'],
    ᇦ: 'ㅸ',
    ᇧ: ['ㅅ', 'ㄱ'],
    ᇨ: ['ㅅ', 'ㄷ'],
    ᇩ: ['ㅅ', 'ㄹ'],
    ᇪ: ['ㅅ', 'ㅂ'],
    ᇫ: 'ㅿ',
    ᇬ: ['ㆁ', 'ㄱ'],
    ᇭ: ['ㆁ', 'ㄱ', 'ㄱ'],
    ᇮ: ['ㆁ', 'ㆁ'],
    ᇯ: ['ㆁ', 'ㅋ'],
    ᇰ: 'ㆁ',
    ᇱ: ['ㆁ', 'ㅅ'],
    ᇲ: ['ㆁ', 'ㅿ'],
    ᇳ: ['ㅍ', 'ㅂ'],
    ᇴ: 'ㆄ',
    ᇵ: ['ㅎ', 'ㄴ'],
    ᇶ: ['ㅎ', 'ㄹ'],
    ᇷ: ['ㅎ', 'ㅁ'],
    ᇸ: ['ㅎ', 'ㅂ'],
    ᇹ: 'ㆆ',
    ᇺ: ['ㄱ', 'ㄴ'],
    ᇻ: ['ㄱ', 'ㅂ'],
    ᇼ: ['ㄱ', 'ㅊ'],
    ᇽ: ['ㄱ', 'ㅋ'],
    ᇾ: ['ㄱ', 'ㅎ'],
    ᇿ: ['ㄴ', 'ㄴ'],
  };
  const compatibilityJamo$1 = {
    // this object is missing a lot of characters in the block since
    // this file maps archaic characters to compatibilityJamo.
    ㄲ: ['ㄱ', 'ㄱ'],
    ㄳ: ['ㄱ', 'ㅅ'],
    ㄵ: ['ㄴ', 'ㅈ'],
    ㄶ: ['ㄴ', 'ㅎ'],
    ㄸ: ['ㄷ', 'ㄷ'],
    ㄻ: ['ㄹ', 'ㅁ'],
    ㄺ: ['ㄹ', 'ㄱ'],
    ㄼ: ['ㄹ', 'ㅂ'],
    ㄽ: ['ㄹ', 'ㅅ'],
    ㄾ: ['ㄹ', 'ㅌ'],
    ㄿ: ['ㄹ', 'ㅍ'],
    ㅀ: ['ㄹ', 'ㅎ'],
    ㅃ: ['ㅂ', 'ㅂ'],
    ㅄ: ['ㅂ', 'ㅅ'],
    ㅆ: ['ㅅ', 'ㅅ'],
    ㅉ: ['ㅈ', 'ㅈ'],
    ㅘ: ['ㅗ', 'ㅏ'],
    ㅙ: ['ㅗ', 'ㅐ'],
    ㅚ: ['ㅗ', 'ㅣ'],
    ㅝ: ['ㅜ', 'ㅓ'],
    ㅞ: ['ㅜ', 'ㅔ'],
    ㅟ: ['ㅜ', 'ㅣ'],
    ㅢ: ['ㅡ', 'ㅣ'],
    ㅥ: ['ㄴ', 'ㄴ'],
    ㅦ: ['ㄴ', 'ㄷ'],
    ㅧ: ['ㄴ', 'ㅅ'],
    ㅨ: ['ㄴ', 'ㅿ'],
    ㅩ: ['ㄹ', 'ㄱ', 'ㅅ'],
    ㅪ: ['ㄹ', 'ㄷ'],
    ㅫ: ['ㄹ', 'ㅂ', 'ㅅ'],
    ㅬ: ['ㄹ', 'ㅿ'],
    ㅭ: ['ㄹ', 'ㆆ'],
    ㅮ: ['ㅁ', 'ㅂ'],
    ㅯ: ['ㅁ', 'ㅅ'],
    ㅰ: ['ㅁ', 'ㅿ'],
    ㅲ: ['ㅂ', 'ㄱ'],
    ㅳ: ['ㅂ', 'ㄷ'],
    ㅴ: ['ㅂ', 'ㅅ', 'ㄱ'],
    ㅵ: ['ㅂ', 'ㅅ', 'ㄷ'],
    ㅶ: ['ㅂ', 'ㅈ'],
    ㅷ: ['ㅂ', 'ㅌ'],
    ㅺ: ['ㅅ', 'ㄱ'],
    ㅻ: ['ㅅ', 'ㄴ'],
    ㅼ: ['ㅅ', 'ㄷ'],
    ㅽ: ['ㅅ', 'ㅂ'],
    ㅾ: ['ㅅ', 'ㅈ'],
    ㆀ: ['ㅇ', 'ㅇ'],
    ㆂ: ['ㆁ', 'ㅅ'],
    ㆃ: ['ㆁ', 'ㅿ'],
    ㆅ: ['ㅎ', 'ㅎ'],
    ㆇ: ['ㅛ', 'ㅑ'],
    ㆈ: ['ㅛ', 'ㅒ'],
    ㆉ: ['ㅛ', 'ㅣ'],
    ㆊ: ['ㅠ', 'ㅕ'],
    ㆋ: ['ㅠ', 'ㅖ'],
    ㆌ: ['ㅠ', 'ㅣ'],
    ㆎ: ['ㆍ', 'ㅣ'],
  };
  const jamoExtendedA$1 = {
    ꥠ: ['ㄷ', 'ㅁ'],
    ꥡ: ['ㄷ', 'ㅂ'],
    ꥢ: ['ㄷ', 'ㅅ'],
    ꥣ: ['ㄷ', 'ㅈ'],
    ꥤ: ['ㄹ', 'ㄱ'],
    ꥥ: ['ㄹ', 'ㄱ', 'ㄱ'],
    ꥦ: ['ㄹ', 'ㄷ'],
    ꥧ: ['ㄹ', 'ㄷ', 'ㄷ'],
    ꥨ: ['ㄹ', 'ㅁ'],
    ꥩ: ['ㄹ', 'ㅂ'],
    ꥪ: ['ㄹ', 'ㅂ', 'ㅂ'],
    ꥫ: ['ㄹ', 'ㅸ'],
    ꥬ: ['ㄹ', 'ㅅ'],
    ꥭ: ['ㄹ', 'ㅈ'],
    ꥮ: ['ㄹ', 'ㅋ'],
    ꥯ: ['ㅁ', 'ㄱ'],
    ꥰ: ['ㅁ', 'ㄷ'],
    ꥱ: ['ㅁ', 'ㅅ'],
    ꥲ: ['ㅂ', 'ㅅ', 'ㅌ'],
    ꥳ: ['ㅂ', 'ㅋ'],
    ꥴ: ['ㅂ', 'ㅎ'],
    ꥵ: ['ㅅ', 'ㅅ', 'ㅂ'],
    ꥶ: ['ㅇ', 'ㄹ'],
    ꥷ: ['ㅇ', 'ㅎ'],
    ꥸ: ['ㅈ', 'ㅈ', 'ㅎ'],
    ꥹ: ['ㅌ', 'ㅌ'],
    ꥺ: ['ㅍ', 'ㅎ'],
    ꥻ: ['ㅎ', 'ㅅ'],
    ꥼ: ['ㆆ', 'ㆆ'],
  };
  const jamoExtendedB$1 = {
    ힰ: ['ㅗ', 'ㅕ'],
    ힱ: ['ㅗ', 'ㅗ', 'ㅣ'],
    ힲ: ['ㅛ', 'ㅏ'],
    ힳ: ['ㅛ', 'ㅐ'],
    ힴ: ['ㅛ', 'ㅓ'],
    ힵ: ['ㅜ', 'ㅕ'],
    ힶ: ['ㅜ', 'ㅣ', 'ㅣ'],
    ힷ: ['ㅠ', 'ㅐ'],
    ힸ: ['ㅠ', 'ㅗ'],
    ힹ: ['ㅡ', 'ㅏ'],
    ힺ: ['ㅡ', 'ㅓ'],
    ힻ: ['ㅡ', 'ㅔ'],
    ힼ: ['ㅡ', 'ㅗ'],
    ힽ: ['ㅣ', 'ㅏ', 'ㅗ'],
    ힾ: ['ㅣ', 'ㅒ'],
    ힿ: ['ㅣ', 'ㅕ'],
    ퟀ: ['ㅣ', 'ㅖ'],
    ퟁ: ['ㅣ', 'ㅗ', 'ㅣ'],
    ퟂ: ['ㅣ', 'ㅛ'],
    ퟃ: ['ㅣ', 'ㅠ'],
    ퟄ: ['ㅣ', 'ㅣ'],
    ퟅ: ['ㆍ', 'ㅏ'],
    ퟆ: ['ㆍ', 'ㅔ'],
    ퟋ: ['ㄴ', ''],
    ퟌ: ['ㄴ', ''],
    ퟍ: ['ㄷ', 'ㄷ'],
    ퟎ: ['ㄷ', 'ㄷ', 'ㅂ'],
    ퟏ: ['ㄷ', 'ㅂ'],
    ퟐ: ['ㄷ', 'ㅅ'],
    ퟑ: ['ㄷ', 'ㅅ', 'ㄱ'],
    ퟒ: ['ㄷ', 'ㅈ'],
    ퟓ: ['ㄷ', 'ㅊ'],
    ퟔ: ['ㄷ', 'ㅌ'],
    ퟕ: ['ㄹ', 'ㄱ', 'ㄱ'],
    ퟖ: ['ㄹ', 'ㄱ', 'ㅎ'],
    ퟗ: ['ㄹ', 'ㄹ', 'ㅋ'],
    ퟘ: ['ㄹ', 'ㅁ', 'ㅎ'],
    ퟙ: ['ㄹ', 'ㅂ', 'ㄷ'],
    ퟚ: ['ㄹ', 'ㅂ', 'ㅍ'],
    ퟛ: ['ㄹ', 'ㆁ'],
    ퟜ: ['ㄹ', 'ㆆ', 'ㅎ'],
    ퟝ: null,
    ퟞ: ['ㅁ', 'ㄴ'],
    ퟟ: ['ㅁ', 'ㄴ', 'ㄴ'],
    ퟠ: ['ㅁ', 'ㅁ'],
    ퟡ: ['ㅁ', 'ㅂ', 'ㅅ'],
    ퟢ: ['ㅁ', 'ㅈ'],
    ퟣ: ['ㅂ', 'ㄷ'],
    ퟤ: ['ㅂ', 'ㄹ', 'ㅍ'],
    ퟥ: ['ㅂ', 'ㅁ'],
    ퟦ: ['ㅂ', 'ㅂ'],
    ퟧ: ['ㅂ', 'ㅅ', 'ㄷ'],
    ퟨ: ['ㅂ', 'ㅈ'],
    ퟩ: ['ㅂ', 'ㅊ'],
    ퟪ: ['ㅅ', 'ㅁ'],
    ퟫ: ['ㅅ', 'ㅸ'],
    ퟬ: ['ㅅ', 'ㅅ', 'ㄱ'],
    ퟭ: ['ㅅ', 'ㅅ', 'ㄷ'],
    ퟮ: ['ㅅ', 'ㅿ'],
    ퟯ: ['ㅅ', 'ㅈ'],
    ퟰ: ['ㅅ', 'ㅊ'],
    ퟱ: ['ㅅ', 'ㅌ'],
    ퟲ: ['ㅅ', 'ㅎ'],
    ퟳ: ['ㅿ', 'ㅂ'],
    ퟴ: ['ㅿ', 'ㅸ'],
    ퟵ: ['ㆁ', 'ㅁ'],
    ퟶ: ['ㆁ', 'ㅎ'],
    ퟷ: ['ㅈ', 'ㅂ'],
    ퟸ: ['ㅈ', 'ㅂ', 'ㅂ'],
    ퟹ: ['ㅈ', 'ㅈ'],
    ퟺ: ['ㅍ', 'ㅅ'],
    ퟻ: ['ㅍ', 'ㅌ'],
  };
  const halfwidth$1 = {
    ﾡ: 'ㄱ',
    ﾢ: ['ㄱ', 'ㄱ'],
    ﾣ: ['ㄱ', 'ㅅ'],
    ﾤ: 'ㄴ',
    ﾥ: ['ㄴ', 'ㅈ'],
    ﾦ: ['ㄴ', 'ㅎ'],
    ﾧ: 'ㄷ',
    ﾨ: ['ㄷ', 'ㄷ'],
    ﾩ: 'ㄹ',
    ﾪ: ['ㄹ', 'ㄱ'],
    ﾫ: ['ㄹ', 'ㅁ'],
    ﾬ: ['ㄹ', 'ㅂ'],
    ﾭ: ['ㄹ', 'ㅅ'],
    ﾮ: ['ㄹ', 'ㅌ'],
    ﾯ: ['ㄹ', 'ㅍ'],
    ﾰ: ['ㄹ', 'ㅎ'],
    ﾱ: 'ㅁ',
    ﾲ: 'ㅂ',
    ﾳ: ['ㅂ', 'ㅂ'],
    ﾴ: ['ㅂ', 'ㅅ'],
    ﾵ: 'ㅅ',
    ﾶ: ['ㅅ', 'ㅅ'],
    ﾷ: 'ㅇ',
    ﾸ: 'ㅈ',
    ﾹ: ['ㅈ', 'ㅈ'],
    ﾺ: 'ㅊ',
    ﾻ: 'ㅋ',
    ﾼ: 'ㅌ',
    ﾽ: 'ㅍ',
    ﾾ: 'ㅎ',
    ￂ: 'ㅏ',
    ￃ: 'ㅐ',
    ￄ: 'ㅑ',
    ￅ: 'ㅒ',
    ￆ: 'ㅓ',
    ￇ: 'ㅔ',
    ￊ: 'ㅕ',
    ￋ: 'ㅖ',
    ￌ: 'ㅗ',
    ￍ: ['ㅗ', 'ㅏ'],
    ￎ: ['ㅗ', 'ㅐ'],
    ￏ: ['ㅗ', 'ㅣ'],
    ￒ: 'ㅛ',
    ￓ: 'ㅜ',
    ￔ: ['ㅜ', 'ㅓ'],
    ￕ: ['ㅜ', 'ㅔ'],
    ￖ: ['ㅜ', 'ㅣ'],
    ￗ: 'ㅠ',
    ￚ: 'ㅡ',
    ￛ: ['ㅡ', 'ㅣ'],
    ￜ: 'ㅣ',
  };
  const all = Object.assign({}, jamo$1, compatibilityJamo$1, jamoExtendedA$1, jamoExtendedB$1, halfwidth$1);

  // tries to transform everything into disassembled standard hangul

  function transformChar(char) {
    if (isHangul(char) && !isSyllable(char)) {
      // this if-statement isn't REALLY needed
      const comp = all[char];
      if (comp) {
        return comp;
      }
      return char;
    }
    return char;
  }
  function transform(aryLike) {
    const ary = makeAry(aryLike);
    return ary.map(transformChar);
  }

  var composeAnyComplex = (composeComplex(cho, jung, jong, irregular));

  function toStandardChar(char) {
    const v = transformChar(char);
    if (Array.isArray(v)) {
      const res = [];
      let rem = v;
      while (rem.length) {
        const comp = composeAnyComplex(...rem);
        res.push(comp.result);
        rem = comp.remainder;
      }
      return res;
    }
    return v;
  }
  var toStandard = (aryLike => makeAry(aryLike).map(toStandardChar));

  // import Y from './ComposeGeneratorYield';

  const composeSyllableFn = (cho, jung, jong = 0) => (
    String.fromCodePoint(cho * 588 + jung * 28 + jong + syllables.start)
  );
  var composeSyllable = ((choChar, jungChar, jongChar = null) => {
    const cho = choNum[toStandardChar(choChar)];
    const jung = jungNum[toStandardChar(jungChar)];
    // even though toStandardChar sometimes outputs an array
    // there's no need to check since all we want are the
    // sincle character standard characters.
    if (!choChar && !jungChar) {
      throw new Error('You must provide a cho and jung character to make a syllable');
    }
    let jong;
    if (jongChar) {
      jong = jongNum[toStandardChar(jongChar)];
    }
    if (!Number.isInteger(cho)) {
      throw new Error(`"${choChar}" is not a valid cho character`);
    } if (!Number.isInteger(jung)) {
      throw new Error(`"${jungChar}" is not a valid jung character`);
    } if (jong) {
      throw new Error(`"${jongChar}" is not a valid jong character`);
    }
    return composeSyllableFn(cho, jung, jong);
  });

  const composeComplexCho = composeComplex(cho);
  const composeComplexJung = composeComplex(jung);
  const composeComplexJong = composeComplex(jong);

  var compose = ((...ary) => {
    if (ary.length < 2) {
      throw new Error('Cannot compose a syllable with less than two characters');
    }
    const choRes = composeComplexCho(...ary);
    const choChar = choRes.result;
    const cho$$1 = choNum[choChar];
    if (!Number.isInteger(cho$$1)) {
      return new Result(ary[0], ary.slice(1));
    }
    const jungRes = composeComplexJung(...choRes.remainder);
    const jungChar = jungRes.result;
    const jung$$1 = jungNum[jungChar];
    if (!Number.isInteger(jung$$1)) {
      return new Result(choChar, choRes.remainder);
    }
    const jongRes = composeComplexJong(...jungRes.remainder);
    const jongChar = jongRes.result;
    const jong$$1 = jongNum[jongChar];
    if (!jong$$1) {
      return new Result(composeSyllableFn(cho$$1, jung$$1), jungRes.remainder);
    }
    return new Result(composeSyllableFn(cho$$1, jung$$1, jong$$1), jongRes.remainder);
  });

  var decomposeSyllable = ((syllable) => {
    assertChar(syllable);
    if (!isSyllable(syllable)) {
      throw new Error('Decomposing a syllable requires a syllable to decompose!');
    }
    const code = syllable.codePointAt(0) - syllables.start;
    const jongNum$$1 = code % 28;
    const q = (code - jongNum$$1) / 28;
    const jungNum$$1 = q % 21;
    const choNum$$1 = 0 | q / 21;
    return [cho$1[choNum$$1], jung$1[jungNum$$1], jong$1[jongNum$$1]].filter(v => v);
  });

  const composeComplexCho$1 = composeComplex(cho);

  var disassemble = ((aryLike, grouped, disassembleCho) => {
    const ary = makeAry(aryLike).map((char) => {
      const isSyl = isSyllable(char);
      let charGroups;
      if (isSyl) {
        charGroups = transform(decomposeSyllable(char));
      } else {
        charGroups = [makeAry(transformChar(char))];
      }
      if (!disassembleCho) {
        charGroups = charGroups.map((charGroup) => {
          if (Array.isArray(charGroup)) {
            const comp = composeComplexCho$1(...charGroup);
            if (!comp.remainder.length) {
              return comp.result;
            }
            return charGroup;
          }
          return charGroup;
        });
      }
      return isSyl ? charGroups : charGroups[0];
    });
    if (grouped) {
      return ary;
    }
    return ary.flat(2);
  });

  // I know I can export everything at once,

  const isAllHangul = isAll(isHangul);
  const isAllStandardHangul = isAll(isStandardHangul);
  const containsStandardHangul = contains(isStandardHangul);
  const containsHangul = contains(isHangul);

  exports.isAllHangul = isAllHangul;
  exports.isAllStandardHangul = isAllStandardHangul;
  exports.containsStandardHangul = containsStandardHangul;
  exports.containsHangul = containsHangul;
  exports.isSyllable = isSyllable;
  exports.isConsonant = isConsonant;
  exports.isVowel = isVowel;
  exports.isHangul = isHangul;
  exports.isStandardHangul = isStandardHangul;
  exports.compose = compose;
  exports.composeComplex = composeAnyComplex;
  exports.composeSyllable = composeSyllable;
  exports.decomposeSyllable = decomposeSyllable;
  exports.disassemble = disassemble;
  exports.toStandard = toStandard;
  exports.toStandardChar = toStandardChar;
  exports.transform = transform;
  exports.transformChar = transformChar;

  return exports;

}({}));
//# sourceMappingURL=Hangul.js.map
