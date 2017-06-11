/*
 * @credit: https://github.com/NaturalNode/natural/blob/master/lib/natural/stemmers/porter_stemmer.js
 */

/*
  Copyright (c) 2011, Chris Umbel
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

// Denote groups of consecutive consonants with a C and consecutive vowels
// with a V.
function categorizeGroups(token) {
  return token.replace(/[^aeiou]+/g, 'C').replace(/[aeiouy]+/g, 'V');
}

// Denote single consonants with a C and single vowels with a V
function categorizeChars(token) {
  return token.replace(/[^aeiou]/g, 'C').replace(/[aeiouy]/g, 'V');
}

// Calculate the "measure" M of a word. M is the count of VC sequences dropping
// an initial C if it exists and a trailing V if it exists.
function measure(token) {
  if(!token)
    return -1;

  return categorizeGroups(token).replace(/^C/, '').replace(/V$/, '').length / 2;
}

// Determine if a token end with a double consonant i.e. happ
function endsWithDoublCons(token) {
  return token.match(/([^aeiou])\1$/);
}

// Replace a pattern in a word. if a replacement occurs an optional callback
// can be called to post-process the result. if no match is made NULL is
// returned.
function attemptReplace(token, pattern, replacement, callback) {
  var result = null;

  if((typeof pattern == 'string') && token.substr(0 - pattern.length) == pattern)
    result = token.replace(new RegExp(pattern + '$'), replacement);
  else if((pattern instanceof RegExp) && token.match(pattern))
    result = token.replace(pattern, replacement);

  if(result && callback)
    return callback(result);
  else
    return result;
}

// Attempt to replace a list of patterns/replacements on a token for a minimum
// measure M.
function attemptReplacePatterns(token, replacements, measureThreshold) {
  var replacement = null;

  for(var i = 0; i < replacements.length; i++) {
    if(!measureThreshold || measure(attemptReplace(token, replacements[i][0], '')) > measureThreshold)
      replacement = attemptReplace(token, replacements[i][0], replacements[i][1]);

    if(replacement)
      break;
  }

  return replacement;
}

// Replace a list of patterns/replacements on a word. if no match is made return
// the original token.
function replacePatterns(token, replacements, measureThreshold) {
  var result = attemptReplacePatterns(token, replacements, measureThreshold);
  token = !result ? token : result;
  return token;
}

// Step 1a as defined for the porter stemmer algorithm.
function step1a(token) {
  if(token.match(/(ss|i)es$/))
    return token.replace(/(ss|i)es$/, '$1');

  if(token.substr(-1) == 's' && token.substr(-2, 1) != 's' && token.length > 3)
    return token.replace(/s?$/, '');

  return token;
}

// Step 1b as defined for the porter stemmer algorithm.
function step1b(token) {
  if(token.substr(-3) == 'eed') {
    if(measure(token.substr(0, token.length - 3)) > 0)
      return token.replace(/eed$/, 'ee');
  } else {
    var result = attemptReplace(token, /ed|ing$/, '', function(token) {
      if(categorizeGroups(token).indexOf('V') >= 0) {
        var result = attemptReplacePatterns(token, [['at', 'ate'],  ['bl', 'ble'], ['iz', 'ize']]);
        if(result)
          return result;
        else {
          if(endsWithDoublCons(token) && token.match(/[^lsz]$/))
            return token.replace(/([^aeiou])\1$/, '$1');

          if(measure(token) == 1 && categorizeChars(token).substr(-3) == 'CVC' && token.match(/[^wxy]$/))
            return token + 'e';
        }

        return token;
      }

      return null;
    });

    if(result)
      return result;
  }

  return token;
}

// Step 1c as defined for the porter stemmer algorithm.
function step1c(token) {
  if(categorizeGroups(token).substr(-2, 1) == 'V') {
    if(token.substr(-1) == 'y')
      return token.replace(/y$/, 'i');
  }

  return token;
}

// Step 2 as defined for the porter stemmer algorithm.
function step2(token) {
  return replacePatterns(token, [['ational', 'ate'], ['tional', 'tion'], ['enci', 'ence'], ['anci', 'ance'],
    ['izer', 'ize'], ['abli', 'able'], ['alli', 'al'], ['entli', 'ent'], ['eli', 'e'],
    ['ousli', 'ous'], ['ization', 'ize'], ['ation', 'ate'], ['ator', 'ate'],['alism', 'al'],
    ['iveness', 'ive'], ['fulness', 'ful'], ['ousness', 'ous'], ['aliti', 'al'],
  ['iviti', 'ive'], ['biliti', 'ble']], 0);
}

// Step 3 as defined for the porter stemmer algorithm.
function step3(token) {
  return replacePatterns(token, [['icate', 'ic'], ['ative', ''], ['alize', 'al'],
  ['iciti', 'ic'], ['ical', 'ic'], ['ful', ''], ['ness', '']], 0);
}

// Step 4 as defined for the porter stemmer algorithm.
function step4(token) {
  return replacePatterns(token, [['al', ''], ['ance', ''], ['ence', ''], ['er', ''],
    ['ic', ''], ['able', ''], ['ible', ''], ['ant', ''],
    ['ement', ''], ['ment', ''], ['ent', ''], [/([st])ion/, '$1'], ['ou', ''], ['ism', ''],
    ['ate', ''], ['iti', ''], ['ous', ''], ['ive', ''],
  ['ize', '']], 1);
}

// Step 5a as defined for the porter stemmer algorithm.
function step5a(token) {
  var m = measure(token);

  if(token.length > 3 && ((m > 1 && token.substr(-1) == 'e') || (m == 1 && !(categorizeChars(token).substr(-4, 3) == 'CVC' && token.match(/[^wxy].$/)))))
    return token.replace(/e$/, '');

  return token;
}

// Step 5b as defined for the porter stemmer algorithm.
function step5b(token) {
  if(measure(token) > 1) {
    if(endsWithDoublCons(token) && token.substr(-2) == 'll')
      return token.replace(/ll$/, 'l');
  }

  return token;
}

var Tokenizer = function() {

};

// List of commonly used words that have little meaning to be excluded from analysis.
Tokenizer.stopwords = [
  'about', 'after', 'all', 'also', 'am', 'an', 'and', 'another', 'any', 'are', 'as', 'at', 'be',
  'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came', 'can',
  'come', 'could', 'did', 'do', 'each', 'for', 'from', 'get', 'got', 'has', 'had',
  'he', 'have', 'her', 'here', 'him', 'himself', 'his', 'how', 'if', 'in', 'into',
  'is', 'it', 'like', 'make', 'many', 'me', 'might', 'more', 'most', 'much', 'must',
  'my', 'never', 'now', 'of', 'on', 'only', 'or', 'other', 'our', 'out', 'over',
  'said', 'same', 'see', 'should', 'since', 'some', 'still', 'such', 'take', 'than',
  'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those',
  'through', 'to', 'too', 'under', 'up', 'very', 'was', 'way', 'we', 'well', 'were',
  'what', 'where', 'which', 'while', 'who', 'with', 'would', 'you', 'your',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '$', '1',
  '2', '3', '4', '5', '6', '7', '8', '9', '0', '_', 'https://', 'co', 'com', 'ada',
  'adalah','adanya','adapun','agak','agaknya','agar','akan','akankah','akhir','akhiri',
  'akhirnya','aku','akulah','amat','amatlah','anda','andalah','antar','antara','antaranya',
  'apa','apaan','apabila','apakah','apalagi','apatah','artinya','asal','asalkan','atas',
  'atau','ataukah','ataupun','awal','awalnya','bagai','bagaikan','bagaimana','bagaimanakah',
  'bagaimanapun','bagi','bagian','bahkan','bahwa','bahwasanya','baik','bakal','bakalan','balik',
  'banyak','bapak','baru','bawah','beberapa','begini','beginian','beginikah','beginilah','begitu',
  'begitukah','begitulah','begitupun','bekerja','belakang','belakangan','belum','belumlah','benar',
  'benarkah','benarlah','berada','berakhir','berakhirlah','berakhirnya','berapa','berapakah','berapalah',
  'berapapun','berarti','berawal','berbagai','berdatangan','beri','berikan','berikut','berikutnya','berjumlah',
  'berkali-kali','berkata','berkehendak','berkeinginan','berkenaan','berlainan','berlalu','berlangsung',
  'berlebihan','bermacam','bermacam-macam','bermaksud','bermula','bersama','bersama-sama','bersiap',
  'bersiap-siap','bertanya','bertanya-tanya','berturut','berturut-turut','bertutur','berujar','berupa',
  'besar','betul','betulkah','biasa','biasanya','bila','bilakah','bisa','bisakah','boleh','bolehkah','bolehlah',
  'buat','bukan','bukankah','bukanlah','bukannya','bulan','bung','cara','caranya','cukup','cukupkah','cukuplah',
  'cuma','dahulu','dalam','dan','dapat','dari','daripada','datang','dekat','demi','demikian','demikianlah',
  'dengan','depan','di','dia','diakhiri','diakhirinya','dialah','diantara','diantaranya','diberi',
  'diberikan','diberikannya','dibuat','dibuatnya','didapat','didatangkan','digunakan','diibaratkan',
  'diibaratkannya','diingat','diingatkan','diinginkan','dijawab','dijelaskan','dijelaskannya',
  'dikarenakan','dikatakan','dikatakannya','dikerjakan','diketahui','diketahuinya','dikira','dilakukan',
  'dilalui','dilihat','dimaksud','dimaksudkan','dimaksudkannya','dimaksudnya','diminta','dimintai',
  'dimisalkan','dimulai','dimulailah','dimulainya','dimungkinkan','dini','dipastikan','diperbuat',
  'diperbuatnya','dipergunakan','diperkirakan','diperlihatkan','diperlukan','diperlukannya','dipersoalkan',
  'dipertanyakan','dipunyai','diri','dirinya','disampaikan','disebut','disebutkan','disebutkannya',
  'disini','disinilah','ditambahkan','ditandaskan','ditanya','ditanyai','ditanyakan','ditegaskan','ditujukan',
  'ditunjuk','ditunjuki','ditunjukkan','ditunjukkannya','ditunjuknya','dituturkan','dituturkannya','diucapkan',
  'diucapkannya','diungkapkan','dong','dua','dulu','empat','enggak','enggaknya','entah','entahlah','guna','gunakan',
  'hal','hampir','hanya','hanyalah','hari','harus','haruslah','harusnya','hendak','hendaklah','hendaknya','hingga',
  'ia','ialah','ibarat','ibaratkan','ibaratnya','ibu','ikut','ingat','ingat-ingat','ingin','inginkah','inginkan',
  'ini','inikah','inilah','itu','itukah','itulah','jadi','jadilah','jadinya','jangan','jangankan','janganlah',
  'jauh','jawab','jawaban','jawabnya','jelas','jelaskan','jelaslah','jelasnya','jika','jikalau','juga','jumlah',
  'jumlahnya','justru','kala','kalau','kalaulah','kalaupun','kalian','kami','kamilah','kamu','kamulah','kan',
  'kapan','kapankah','kapanpun','karena','karenanya','kasus','kata','katakan','katakanlah','katanya','ke','keadaan',
  'kebetulan','kecil','kedua','keduanya','keinginan','kelamaan','kelihatan','kelihatannya','kelima','keluar',
  'kembali','kemudian','kemungkinan','kemungkinannya','kenapa','kepada','kepadanya','kesampaian','keseluruhan',
  'keseluruhannya','keterlaluan','ketika','khususnya','kini','kinilah','kira','kira-kira','kiranya','kita',
  'kitalah','kok','kurang','lagi','lagian','lah','lain','lainnya','lalu','lama','lamanya','lanjut','lanjutnya',
  'lebih','lewat','lima','luar','macam','maka','makanya','makin','malah','malahan','mampu','mampukah','mana',
  'manakala','manalagi','masa','masalah','masalahnya','masih','masihkah','masing','masing-masing','mau',
  'maupun','melainkan','melakukan','melalui','melihat','melihatnya','memang','memastikan','memberi','memberikan',
  'membuat','memerlukan','memihak','meminta','memintakan','memisalkan','memperbuat','mempergunakan','memperkirakan',
  'memperlihatkan','mempersiapkan','mempersoalkan','mempertanyakan','mempunyai','memulai','memungkinkan','menaiki',
  'menambahkan','menandaskan','menanti','menanti-nanti','menantikan','menanya','menanyai','menanyakan','mendapat',
  'mendapatkan','mendatang','mendatangi','mendatangkan','menegaskan','mengakhiri','mengapa','mengatakan','mengatakannya',
  'mengenai','mengerjakan','mengetahui','menggunakan','menghendaki','mengibaratkan','mengibaratkannya','mengingat',
  'mengingatkan','menginginkan','mengira','mengucapkan','mengucapkannya','mengungkapkan','menjadi','menjawab',
  'menjelaskan','menuju','menunjuk','menunjuki','menunjukkan','menunjuknya','menurut','menuturkan','menyampaikan',
  'menyangkut','menyatakan','menyebutkan','menyeluruh','menyiapkan','merasa','mereka','merekalah','merupakan',
  'meski','meskipun','meyakini','meyakinkan','minta','mirip','misal','misalkan','misalnya','mula','mulai','mulailah',
  'mulanya','mungkin','mungkinkah','nah','naik','namun','nanti','nantinya','nyaris','nyatanya','oleh','olehnya',
  'pada','padahal','padanya','pak','paling','panjang','pantas','para','pasti','pastilah','penting','pentingnya',
  'per','percuma','perlu','perlukah','perlunya','pernah','persoalan','pertama','pertama-tama','pertanyaan','pertanyakan',
  'pihak','pihaknya','pukul','pula','pun','punya','rasa','rasanya','rata','rupanya','saat','saatnya','saja','sajalah',
  'saling','sama','sama-sama','sambil','sampai','sampai-sampai','sampaikan','sana','sangat','sangatlah','satu','saya',
  'sayalah','se','sebab','sebabnya','sebagai','sebagaimana','sebagainya','sebagian','sebaik','sebaik-baiknya','sebaiknya',
  'sebaliknya','sebanyak','sebegini','sebegitu','sebelum','sebelumnya','sebenarnya','seberapa','sebesar','sebetulnya',
  'sebisanya','sebuah','sebut','sebutlah','sebutnya','secara','secukupnya','sedang','sedangkan','sedemikian','sedikit',
  'sedikitnya','seenaknya','segala','segalanya','segera','seharusnya','sehingga','seingat','sejak','sejauh','sejenak',
  'sejumlah','sekadar','sekadarnya','sekali','sekali-kali','sekalian','sekaligus','sekalipun','sekarang','sekarang',
  'sekecil','seketika','sekiranya','sekitar','sekitarnya','sekurang-kurangnya','sekurangnya','sela','selain','selaku',
  'selalu','selama','selama-lamanya','selamanya','selanjutnya','seluruh','seluruhnya','semacam','semakin','semampu',
  'semampunya','semasa','semasih','semata','semata-mata','semaunya','sementara','semisal','semisalnya','sempat','semua',
  'semuanya','semula','sendiri','sendirian','sendirinya','seolah','seolah-olah','seorang','sepanjang','sepantasnya',
  'sepantasnyalah','seperlunya','seperti','sepertinya','sepihak','sering','seringnya','serta','serupa','sesaat','sesama',
  'sesampai','sesegera','sesekali','seseorang','sesuatu','sesuatunya','sesudah','sesudahnya','setelah','setempat',
  'setengah','seterusnya','setiap','setiba','setibanya','setidak-tidaknya','setidaknya','setinggi','seusai','sewaktu',
  'siap','siapa','siapakah','siapapun','sini','sinilah','soal','soalnya','suatu','sudah','sudahkah','sudahlah','supaya',
  'tadi','tadinya','tahu','tahun','tak','tambah','tambahnya','tampak','tampaknya','tandas','tandasnya','tanpa','tanya',
  'tanyakan','tanyanya','tapi','tegas','tegasnya','telah','tempat','tengah','tentang','tentu','tentulah','tentunya',
  'tepat','terakhir','terasa','terbanyak','terdahulu','terdapat','terdiri','terhadap','terhadapnya','teringat',
  'teringat-ingat','terjadi','terjadilah','terjadinya','terkira','terlalu','terlebih','terlihat','termasuk','ternyata',
  'tersampaikan','tersebut','tersebutlah','tertentu','tertuju','terus','terutama','tetap','tetapi','tiap','tiba',
  'tiba-tiba','tidak','tidakkah','tidaklah','tiga','tinggi','toh','tunjuk','turut','tutur','tuturnya','ucap','ucapnya',
  'ujar','ujarnya','umum','umumnya','ungkap','ungkapnya','untuk','usah','usai','waduh','wah','wahai','waktu','waktunya',
  'walau','walaupun','wong','yaitu','yakin','yakni','yang'
];

Tokenizer.prototype.trim = function(array) {
  while (array[array.length - 1] === '')
    array.pop();

  while (array[0] === '')
    array.shift();

  return array;
};

Tokenizer.prototype.tokenize = function(text) {
  // Break a string up into an array of tokens by anything non-word
  return this.trim(text.split(/\W+/));
};

var Stemmer = function() {

};

// perform full stemming algorithm on a single word
Stemmer.prototype.stem = function(token) {
  return step5b(step5a(step4(step3(step2(step1c(step1b(step1a(token.toLowerCase())))))))).toString();
};

Stemmer.prototype.addStopWord = function(stopWord) {
  Tokenizer.stopwords.push(stopWord);
};

Stemmer.prototype.addStopWords = function(moreStopWords) {
  Tokenizer.stopwords = Tokenizer.stopwords.concat(moreStopWords);
};

Stemmer.prototype.tokenizeAndStem = function(text, keepStops) {
  var stemmedTokens = [];

  new Tokenizer().tokenize(text).forEach(function(token) {
    if(keepStops || Tokenizer.stopwords.indexOf(token) == -1)
      stemmedTokens.push(this.stem(token));
  }.bind(this));

  return stemmedTokens;
};

module.exports = new Stemmer();