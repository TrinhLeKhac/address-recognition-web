document.addEventListener('DOMContentLoaded', (event) => {
    let data = [];
    for (let i = 0; i < 2000; i++) data.push([]);

    // srcProvinces chứa toàn bộ các giá trị có thể hiển thị ở ô dropdown Tỉnh Thành Phố
    // cách tính: tách lấy field name từ dbProvinces
    let srcProvinces = []
    for (let v of Object.values(dbProvinces)) {
      srcProvinces.push(v['name'])
      // srcProvinces.push(JSON.stringify(v))
    }

    // srcDistricts chứa toàn bộ các giá trị có thể hiển thị ở ô dropdown Quận Huyện
    // cách tính: tách lấy field name từ dbDistricts
    let srcDistricts = []
    for (let v of Object.values(dbDistricts)) {
      srcDistricts.push(v['name'])
    }

    // srcWards chứa toàn bộ các giá trị có thể hiển thị ở ô dropdown Phường Xã
    // cách tính: tách lấy field name từ dbWards
    let srcWards = []
    for (let v of Object.values(dbWards)) {
      srcWards.push(v['name'])
    }

    let spreadsheet = jspreadsheet(document.getElementById('spreadsheet'), {
      data: data,
      onchange: onCellChanged,
      columns:  [
        { type: 'text', title: 'STT', width: 30 },
        { type: 'text', title: 'Mã Đơn Khách Hàng', width: 120 },
        { type: 'text', title: 'Tên Người Nhận', width: 120 },
        { type: 'text', title: 'SĐT Người Nhận', width: 120 },
        { type: 'text', title: 'Địa chỉ', width: 500 },
        // gắn srcProvinces, srcDistricts, srcWards vào ô dropdown tương ứng
        { type: 'dropdown', title: 'Tỉnh Thành Phố', width: 200, source: srcProvinces },
        { type: 'dropdown', title: 'Quận Huyện', width: 200, source: srcDistricts },
        { type: 'dropdown', title: 'Phường Xã', width: 200, source: srcWards },
        { type: 'text', title: 'Sản Phẩm', width: 120 },
        { type: 'text', title: 'Khối Lượng', width: 120 },
        { type: 'text', title: 'Thu Hộ', width: 120 },
        { type: 'text', title: 'Ghi Chú', width: 120 },
        { type: 'text', title: 'Người Trả Phí', width: 120 },
        { type: 'text', title: 'Gói Dịch Vụ', width: 120 },
        { type: 'text', title: 'Xem Thử Hàng', width: 120 },
        { type: 'text', title: 'Trị Giá', width: 120 },
        { type: 'text', title: 'Mã Khuyến Mãi', width: 120 },
        { type: 'text', title: 'Đổi Lấy Hàng Về', width: 120 }
      ]
    });

    // Button khôi phục giá trị từ localStorage của trình duyệt
    $('#restore-btn').on('click', function() {
       // Lấy giá trị của biến spreadsheetData từ localStorage của trình duyệt
       var serializedData = localStorage.getItem('spreadsheetData'); 
    
       if (serializedData) {
        //  Parse giá trị thành object
         let spreadsheetData = JSON.parse(serializedData); 

        // Hiển thị object đó trên trang tính
         spreadsheet.setData(spreadsheetData);
       }
    });
  })


const onCellChanged = (instance, cell, x, y, value) => {
  if (x != 4) return;
  let row = Number(y) + 1;
  if (value == "") {
    $(instance).jexcel("setValue", "F" + row, "");
    $(instance).jexcel("setValue", "G" + row, "");
    $(instance).jexcel("setValue", "H" + row, "");
    return;
  }

  // lấy kết quả từ function tách địa chỉ
  let result = parseAddress(value);
  // hiển thị giá trị fields name của các object province, district, ward lên trang tính
  $(instance).jexcel("setValue", "F" + row, result['province']);
  $(instance).jexcel("setValue", "G" + row, result['district']);
  $(instance).jexcel("setValue", "H" + row, result['ward']);

  // Set timer lưu data tự động từ bảng tính vào localStorage
  let saveTimer;

  // Xóa timer cũ nếu có sự thay đổi trên bảng tính
  clearTimeout(saveTimer);

  // Set timer mới lưu data từ bảng tính sau một khoảng delay
  saveTimer = setTimeout(() => {
    
    // Lấy data từ bảng tính
    let spreadsheetData = instance.jspreadsheet.getData(); 

    // Đổi sang dạng json
    let serializedData = JSON.stringify(spreadsheetData); 
  
    // Lưu data vào localStorage sau khoảng delay 2000ms nếu không có sự thay đổi nào trên bảng tính
    localStorage.setItem('spreadsheetData', serializedData);
  }, 2000)
};

// hàm tách địa chỉ
const parseAddress = inputAddress => {
  // Tiền xử lý địa chỉ
  let address = cleanFullAddress(inputAddress) + ',';

  let foundedProvince = "";
  let foundedDistrict = "";
  let foundedWard = "";

  let chooseWord = "";
  let largestIndex = -1;

  // Tách Tỉnh Thành Phố
  for (let province of Object.keys(dbProvinces)) {
    for (let word of dbProvinces[province]['words']) {
      if (
          // chọn lấy thành phần(tỉnh, huyện, xã) gần nhất tính từ bên phải address
          (address.lastIndexOf(word) > largestIndex) || 
          // nếu có 2 thành phần cùng index => ưu tiên chuỗi dài hơn
          (
            (address.lastIndexOf(word) === largestIndex) && 
            (largestIndex > -1) && 
            (word.length > chooseWord.length)
          )
        ) {
        foundedProvince = province, // dbProvinces[province]['name'];
        chooseWord = word;
        largestIndex = address.lastIndexOf(word);
      }
    }
  }

  // Nếu tìm thấy Tỉnh Thành Phố, tách bỏ phần Tỉnh Thành Phố khỏi địa chỉ đang tách 
  // (chỉ tách bỏ phần sau cùng)
  if (foundedProvince != "") {
    address = replace_last_occurrences(address, chooseWord, "");
  }

  chooseWord = "";
  largestIndex = -1;
  
  // Tách Quận Huyện khi đã tách được Tỉnh Thành Phố
  if (foundedProvince != "") {
    for (let district of dbProvinces[foundedProvince]['district']) {
      for (let word of dbDistricts[district]['words']) {
        const reg_word = new RegExp(`${word}${SPECIAL_ENDING}`, 'g');
        if (
            (last_index_of_regex(address, reg_word) > largestIndex) || 
            (
              (last_index_of_regex(address, reg_word) === largestIndex) && 
              (largestIndex > -1) && 
              (word.length > chooseWord.length)
            )
          ){
          foundedDistrict = district;
          chooseWord = word;
          largestIndex = last_index_of_regex(address, reg_word);
        }
      }
    }
  } else {
    // Tách Quận Huyện khi trong chuỗi địa chỉ không có Tỉnh Thành Phố (suy ngược từ Quận Huyện => Tỉnh Thành Phố)
    for (let district of Object.keys(dbDistricts)) {
      for (let word of dbDistricts[district]['words']) {
        const reg_word = new RegExp(word, 'g');
        // const reg_word = new RegExp(`${word}${SPECIAL_ENDING}`, 'g'); (2)
        // 439/97/14 Tổ 21Khu Phố 1,phường Tân Thới Hiệp Quận 12Tphcm => (2) bat ko duoc
        if (
            (last_index_of_regex(address, reg_word) > largestIndex) || 
            (
              (last_index_of_regex(address, reg_word) === largestIndex) && 
              (largestIndex > -1) && 
              (word.length > chooseWord.length)
            )
          ){
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
      foundedProvince = Object.entries(dbProvinces).filter(([key, value]) => value['id'] === provinceId)[0][0]
    }
  }

  largestIndex = -1;
  chooseWord = "";

  // Tách Phường Xã
  if (foundedDistrict != "") {
    for (let ward of dbDistricts[foundedDistrict]['ward']) {
      for (let word of dbWards[ward]['words']) {
        const reg_word = new RegExp(`${word}${SPECIAL_ENDING}`, 'g');
        if (
            (last_index_of_regex(address, reg_word) > largestIndex) || 
            (
              (last_index_of_regex(address, reg_word) === largestIndex) && 
              (largestIndex > -1) && 
              (word.length > chooseWord.length)
            )
          ){
          foundedWard = ward;
          chooseWord = word;
          largestIndex = last_index_of_regex(address, reg_word);
        }
      }
    }
    if (foundedWard != "") { 
      address = replace_last_occurrences(address, chooseWord, "");
    }
  }

  // Mapping lại kết quả Tỉnh Thành Phố, Quận Huyện, Phường Xã
  if (foundedProvince != "") {
    foundedProvince = dbProvinces[foundedProvince]['name']
  }
  if (foundedDistrict != "") {
    foundedDistrict = dbDistricts[foundedDistrict]['name']
  }
  if (foundedWard != "") {
    foundedWard = dbWards[foundedWard]['name']
  }
  return {
    province: foundedProvince,
    district: foundedDistrict,
    ward: foundedWard,
  };
};

const htmlTableToExcel = (type) => {
  var data = document.getElementsByTagName('table')[0];
  var excelFile = XLSX.utils.table_to_book(data, { sheet: "sheet1" });
  XLSX.write(excelFile, { bookType: type, bookSST: true, type: 'base64' });
  XLSX.writeFile(excelFile, 'supership_order.' + type);
};



