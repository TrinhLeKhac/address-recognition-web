const inputAddress = "707 Đỗ Xuân Hợp, Phường Phú Hữu, Quận 9, Thủ Đức, Hcm";
console.log(`full address: ${inputAddress}`)

let address = cleanFullAddress(inputAddress) + ',';
console.log(`process address: ${address}`)
console.log('\n');

let foundedProvince = "";
let foundedDistrict = "";
let foundedWard = "";

let largestIndex = -1;
let chooseWord = "";
let chooseProvince = "";

for (let province of Object.keys(dbProvinces)) {
  for (let word of dbProvinces[province]['words']) {
    // chọn lấy thành phần(tỉnh, huyện, xã) gần nhất tính từ bên phải address
    // nếu có 2 thành phần cùng index => ưu tiên chuỗi dài hơn
    // trong dbDistricts, dbProvinces, dbWards có từ viết tắt, ưu tiên chuỗi đầy đủ(dài hơn) trước 
    if ((address.lastIndexOf(word) > largestIndex) || (
      (address.lastIndexOf(word) === largestIndex) && (largestIndex > -1) && (word.length > chooseWord.length)
    )) {
      foundedProvince = province;
      chooseWord = word;
      largestIndex = address.lastIndexOf(word);
    }
  }
}
if (foundedProvince != "") {
  address = replace_last_occurrences(address, chooseWord, "");
}

console.log(chooseWord);
console.log(address);
console.log(foundedProvince);
console.log('\n');


largestIndex = -1;
chooseWord = "";

if (foundedProvince != "") {
  for (let district of dbProvinces[foundedProvince]['district']) {
    for (let word of dbDistricts[district]['words']) {
      const reg_word= new RegExp(`${word}${SPECIAL_ENDING}`, 'g');
      if ((last_index_of_regex(address, reg_word) > largestIndex) || (
        (last_index_of_regex(address, reg_word) === largestIndex) && (largestIndex > -1) && (word.length > chooseWord.length)
      )){
        foundedDistrict = district;
        chooseWord = word;
        largestIndex = last_index_of_regex(address, reg_word);
      }
    }
  }
} else {
  for (let district of Object.keys(dbDistricts)) {
    for (let word of dbDistrict[district]['words']) {
      const reg_word = new RegExp(word, 'g');
      if ((last_index_of_regex(address, reg_word) > largestIndex) || (
        (last_index_of_regex(address, reg_word) === largestIndex) && (largestIndex > -1) && (word.length > chooseWord.length)
      )) {
        foundedDistrict = district;
        chooseWord = word;
        largestIndex = last_index_of_regex(address, reg_word);
      }
    }
  }
}

if (foundedDistrict != "") {
  address = replace_last_occurrences(address, chooseWord, "");
  if (foundedProvince === "") {
    provinceId = dbDistricts[foundedDistrict]['province']
    foundedProvince = Object.entries(dbProvinces).filter(([key, value]) => value['id'] === provinceId)[0][0];
  }
  console.log(foundedDistrict);
  console.log(address);
}

console.log('\n');

largestIndex = -1;
chooseWord = "";

if (foundedDistrict != "") {
  for (let ward of dbDistricts[foundedDistrict]['ward']) {
    for (let word of dbWards[ward]['words']) {
      const reg_word = new RegExp(`${word}${SPECIAL_ENDING}`, 'g');
      if (last_index_of_regex(address, reg_word) > largestIndex) {
        foundedWard = ward;
        chooseWord = word;
        largestIndex = last_index_of_regex(address, reg_word);
      }
    }
  }
  if (foundedWard != "") {
    address = replace_last_occurrences(address, chooseWord, "");
    console.log(chooseWord);
    console.log(address);
    console.log(foundedWard);
  }
}

if (foundedProvince != "") {
  foundedProvince = dbProvinces[foundedProvince]['name']
}
if (foundedDistrict != "") {
  foundedDistrict = dbDistricts[foundedDistrict]['name']
}
if (foundedWard != "") {
  foundedWard = dbWards[foundedWard]['name']
}

console.log(foundedProvince)
console.log(foundedDistrict)
console.log(foundedWard)
console.log('\n');