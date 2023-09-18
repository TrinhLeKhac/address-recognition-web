// hàm viết hoa kí tự đầu mỗi từ trong chuỗi
function initCapWords(str) {
  if (typeof str !== 'string') {
    throw new Error('The input must be a string');
  }

  if (str.length === 0) {
    return str; 
  }
  // Tách các từ trong chuỗi string
  const words = str.split(' ');

  const capitalizedWords = words.map((word) => {
    if (word.length === 0) {
      return word; 
    }
    // Viết hoa kí tự đầu (charAt(0))
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return capitalized;
  });

  // gộp chuỗi đã tách lại
  return capitalizedWords.join(' ');
}

// hàm bỏ dấu chuỗi kí tự
const removeAccent = str => {
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a");
  str = str.replace(/[ÀÁẠẢÃĂẰẮẶẲẴÂẦẤẬẨẪ]/g, "A");
  str = str.replace(/[èéẹẻẽêềếệểễ]/g, "e");
  str = str.replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, "E");
  str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o");
  str = str.replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, "O");
  str = str.replace(/[ìíịỉĩ]/g, "i");
  str = str.replace(/[ÌÍỊỈĨ]/g, "I");
  str = str.replace(/[ùúụủũưừứựửữ]/g, "u");
  str = str.replace(/[ƯỪỨỰỬỮÙÚỤỦŨ]/g, "U");
  str = str.replace(/[ỳýỵỷỹ]/g, "y");
  str = str.replace(/[ỲÝỴỶỸ]/g, "Y");
  str = str.replace(/[Đ]/g, "D");
  str = str.replace(/[đ]/g, "d");
  return str
}

// hàm chuẩn hóa tên thành phố có dấu gạch ngang
const cleanDashAddress = str => {
  Object.keys(DICT_NORM_CITY_DASH_REGEX).forEach(key => {
    const arr = DICT_NORM_CITY_DASH_REGEX[key];
    arr.forEach(item => {
      str = str.replace(item, key)
    });
  });
  return str;
}

// hàm chuẩn hóa đưa kiểu viết tắt từ Tp, Tt, Q, H, X, P về dạng chuẩn
const cleanAbbrevAddress = str => {
  Object.keys(DICT_NORM_ABBREV_REGEX_KW).forEach(key => {
    const arr = DICT_NORM_ABBREV_REGEX_KW[key]
    arr.forEach(item => {
      str = str.replace(item, key)
    });
  });
  return str;
}

// hàm chuẩn hóa (đưa các dạng Q01 -> Q1)
const cleanDigitDistrict = str => {
  str = str.replace(/(q|Q|quan|Quan)\s+(\d)/g, 'Q$2');
  str = str.replace(/(?<=[A-Z])0+(?=\d)/g, '');
  return str
}

// hàm chuẩn hóa (đưa các dạng P08 => P8, F3 => P3)
const cleanDigitWard = str => {
  str = str.replace(/(p|P|phuong|Phuong)\s+(\d)/g, " P$2")
  str = str.replace(/(?<=[A-Z])0+(?=\d)/g, ''); 
  str = str.replace(/F(\d)/g, 'P$1'); 
  return str
}

// hàm loại bỏ space dư thừa, ví dụ: "Quận Bình   Chánh" -> "Quận Bình Chánh"
const removeSpareSpace = str => {
  str = str.trim();
  str = str.replace(/\s+/g, " ");
  return str
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// hàm remove toàn bộ các PUNCTUATIONS
const removePunctuation = str => {
  ADDRESS_PUNCTUATIONS.forEach(item => {
    // str = str.replace(item, ''); // chỉ remove match đầu tiên
    const reg = new RegExp(escapeRegExp(item), 'g');
    str = str.replace(reg, '');
  })
  str = removeSpareSpace(str);
  return str
}

// Thêm space trong trường hợp chưa chuẩn. Ví dụ: Phường 8,Quận 5 -> Phường 8, Quận 5
const addSpaceSeparator = str => {
  str = str.replace(/,/g, ", ");
  str = str.replace(/\./g, " ");
  str = str.replace(/-/g, " ");
  str = str.replace(/\s+/g, ' ');
  str = str.replace(/_/g, " ");
  str = str.trim();
  str = initCapWords(str);
  return str
}

// Hàm tổng hợp xử lý chuỗi địa chỉ
const cleanFullAddress = str => {
  str = initCapWords(str);
  str = removeAccent(str);
  str = cleanAbbrevAddress(str);
  str = removeSpareSpace(str);
  str = cleanDigitDistrict(str);
  str = cleanDigitWard(str);
  str = cleanDashAddress(str);
  str = removePunctuation(str);
  str = addSpaceSeparator(str);
  str = cleanDigitDistrict(str); // sau khi addSpaceSeparator, clean Digit District và Ward 1 lần nữa
  str = cleanDigitWard(str);
  return str
}

// hàm replace match sau cùng. 
// Ví dụ: replace a -> A ở vị trí cuối (aaa -> aaA) 
const replace_last_occurrences = (target_str, substr, replacement) => {
  const lastIndex = target_str.lastIndexOf(substr);
  if (lastIndex != -1) {
    result = target_str.substring(0, lastIndex) + target_str.substring(lastIndex).replace(substr, replacement);
  } else {
    result = target_str;
  }
  return result
}

// hàm trả về last index khi bắt regex
const last_index_of_regex = (str, regex) => {
  var lastIndex = -1;
  var match;

  while ((match = regex.exec(str)) !== null) {
    lastIndex = match.index;
  }

  return lastIndex
}

