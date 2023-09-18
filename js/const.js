// regex phụ trợ đưa từ viết tắt Tp, Tt, Q, H, X, P về dạng chuẩn
const DICT_NORM_ABBREV_REGEX_KW = {
  "Tp ": ["Tp.", "Tp:"],
  "Tt ": ["Tt.", "Tt:"],
  "Q ": ["Q.", "Q:"],
  "H ": ["H.", "H:"],
  "X ": ["X.", "X:"],
  "P ": ["P.", "P:"],
};

// Chuẩn hóa tên thành phố có dấu gạch ngang + quy chuẩn tên tp.hcm + adhoc Quang Nam-Da Nang
const DICT_NORM_CITY_DASH_REGEX = {
  " Ba Ria - Vung Tau ": [
      "Ba Ria Vung Tau",
      "Ba Ria-Vung Tau",
      "Brvt",
      "Br - Vt"
  ],
  " Phan Rang - Thap Cham ": [
      "Phan Rang Thap Cham",
  ],
  " Thua Thien Hue ": ["Thua Thien - Hue"],
  " Ho Chi Minh ": ["Sai Gon", "Tphcm", "Hcm", "Sg"],
  " Da Nang ": [
      "Quang Nam-Da Nang",
      "Quang Nam - Da Nang",
  ],
};

// Các kí tự đặc biệt trong chuỗi address cần loại bỏ
const ADDRESS_PUNCTUATIONS = ["?", "!", ":", "'"];

// Thêm g để detect trường hợp adhoc viết sai chính tả (Hớn Quản => Hớn Quảng, Phước Kiến => Phước Kiếng)
const SPECIAL_ENDING = "[g.;,\\s]"; 