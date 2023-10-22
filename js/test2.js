const inputAddress = "173/175 Bầu Cát, Phường 14 quận Tân bình Thành phố Hồ chí minh";
console.log(`full address: ${inputAddress}`)

let address = cleanFullAddress(inputAddress) + ',';
console.log(`process address: ${address}`)
console.log('\n');

let foundedProvince = "";
let foundedDistrict = "";
let foundedWard = "";

let largestIndex = -1;
let chooseItem = null;
let chooseProvince = null;

for (let provinceObject of dbProvinces) {
  for (let item of provinceObject['set_province']) {
    // chọn lấy thành phần(tỉnh, huyện, xã) gần nhất tính từ bên phải address
    // nếu có 2 thành phần cùng index => ưu tiên chuỗi dài hơn
    // trong dbDistricts, dbProvinces, dbWards có từ viết tắt, ưu tiên chuỗi đầy đủ(dài hơn) trước 
    if ((address.lastIndexOf(item) > largestIndex) || (
      (address.lastIndexOf(item) === largestIndex) && (largestIndex > -1) && (item.length > chooseItem.length)
    )) {
      foundedProvince = provinceObject['province'];
      chooseItem = item;
      largestIndex = address.lastIndexOf(item);
    }
  }
}
if (foundedProvince != "") {
  address = replace_last_occurrences(address, chooseItem, "");
}

console.log(chooseItem);
console.log(address);
console.log(foundedProvince);
console.log('\n');


largestIndex = -1;
chooseItem = null;

if (foundedProvince != "") {
  let filterDistricts = province_mapping_district.filter(item => item['province'] === foundedProvince)[0]['district'];
  for (let district of filterDistricts) {
    let filterDbDistricts = dbDistricts.filter(item => item['district'] === district)[0]
    // console.log(filterDbDistricts);
    for (let item of filterDbDistricts['set_district']) {
      const reg_item = new RegExp(`${item}${SPECIAL_ENDING}`, 'g');
      if ((last_index_of_regex(address, reg_item) > largestIndex) || (
        (last_index_of_regex(address, reg_item) === largestIndex) && (largestIndex > -1) && (item.length > chooseItem.length)
      )){
        foundedDistrict = district;
        chooseItem = item;
        largestIndex = last_index_of_regex(address, reg_item);
      }
    }
  }
} else {
  for (let dbDistrict of dbDistricts) {
    for (let item of dbDistrict['set_district']) {
      const reg_item = new RegExp(item, 'g');
      if ((last_index_of_regex(address, reg_item) > largestIndex) || (
        (last_index_of_regex(address, reg_item) === largestIndex) && (largestIndex > -1) && (item.length > chooseItem.length)
      )) {
        foundedDistrict = dbDistrict['district'];
        chooseItem = item;
        largestIndex = last_index_of_regex(address, reg_item);
      }
    }
  }
}

if (foundedDistrict != "") {
  address = replace_last_occurrences(address, chooseItem, "");
  if (foundedProvince === "") {
    foundedProvince = province_mapping_district.filter(item => item['district'].includes(foundedDistrict))[0]['province'];
  }
  console.log(foundedDistrict);
  console.log(address);
}

console.log('\n');

largestIndex = -1;
chooseItem = null;

if (foundedDistrict != "") {
  let filterWards = district_mapping_ward.filter(item => item['district'] === foundedDistrict)[0];
  console.log(filterWards);
  for (let ward of filterWards['ward']) {
    // console.log(ward);
    let filterDbWards = dbWards.filter(item => item['ward'] === ward)[0]
    // console.log(filterDbWards);
    for (let item of filterDbWards['set_ward']) {
      // console.log(item)
      const reg_item = new RegExp(`${item}${SPECIAL_ENDING}`, 'g');
      if (last_index_of_regex(address, reg_item) > largestIndex) {
        foundedWard = ward;
        chooseItem = item;
        largestIndex = last_index_of_regex(address, reg_item);
      }
    }
  }
  if (foundedWard != "") {
    address = replace_last_occurrences(address, chooseItem, "");
    console.log(chooseItem);
    console.log(address);
    console.log(foundedWard);
  }
}
foundedProvince = province_mapping[foundedProvince]
foundedDistrict = district_mapping[foundedDistrict]
foundedWard = ward_mapping[foundedWard]

console.log(foundedProvince)
console.log(foundedDistrict)
console.log(foundedWard)
console.log('\n');