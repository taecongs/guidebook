import axios from 'axios';

/*====================================================
// [유효성 검사] 시리얼넘버 
=====================================================*/
export const ValidateSerialNumber = async (id, setErrors) => {
    const serialRegex = /^No\.\d{4}$/;

    if (!id) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            id: "시리얼번호를 입력해주세요. (등록 후 변경이 불가능합니다.)",
        }));
        return false;
    } else if (!serialRegex.test(id)) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            id: "시리얼번호는 'No.0000' 형식으로 입력해주세요. (등록 후 변경이 불가능합니다.)",
        }));
        return false;
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, id: "" }));

        // 중복 확인
        const isNotDuplicate = await CheckDuplicateSerial(id, setErrors);
        return isNotDuplicate;
    }
};


/*====================================================
// [유효성 검사] 시리얼넘버 중복 확인 
=====================================================*/
export const CheckDuplicateSerial = async (id, setErrors) => {
    try {
        const response = await axios.get(`http://localhost:4001/checkDuplicateSerial/${id}`);
         // 확인용 로그
        // console.log(response.data);
        if (response.data.isDuplicate) {
            // 중복된 시리얼번호인 경우
            setErrors((prevErrors) => ({
                ...prevErrors,
                id: "현재 등록되어 있는 시리얼번호입니다.",
            }));
            return false;
        } else {
            // 중복되지 않은 경우
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};


/*====================================================
// [유효성 검사] 이름 
=====================================================*/
export const ValidateName = (name, setErrors) => {
    const nameRegex = /^[가-힣]+$/;
    if (!name) {
        // 이름을 입력하지 않은 경우
        setErrors((prevErrors) => ({
            ...prevErrors,
            name: "이름을 입력해주세요.",
        }));
        return false;
    } else if (!nameRegex.test(name)) {
        // 이름이 한글이 아닌 경우
        setErrors((prevErrors) => ({
            ...prevErrors,
            name: "이름은 한글로만 입력해주세요.",
        }));
        return false;
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
        return true;
    }
};


/*====================================================
// [유효성 검사] 상세설명
=====================================================*/
export const ValidateDetail = (detail, setErrors) => {
    const koreanRegex = /^[가-힣0-9a-zA-Z\s.]+$/;
    if (!detail) {
        // 상세설명을 입력하지 않은 경우
        setErrors((prevErrors) => ({
            ...prevErrors,
            detail: "상세설명을 입력해주세요.",
        }));
        return false;
    } else if (!koreanRegex.test(detail)) {
        // 상세설명이 허용된 문자가 아닌 경우
        setErrors((prevErrors) => ({
            ...prevErrors,
            detail: "상세설명은 한글, 숫자, 영어로만 입력해주세요.",
        }));
        return false;
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, detail: "" }));
        return true;
    }
};


/*====================================================
// [유효성 검사] 타입 1
=====================================================*/
export const ValidateType1 = (selectedType1, setErrors) => {
    if (!selectedType1) {
        // 타입1을 선택하지 않은 경우
        setErrors((prevErrors) => ({
            ...prevErrors,
            type1: "타입을 선택해주세요.",
        }));
        return false;
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, type1: "" }));
        return true;
    }
};


/*====================================================
// [유효성 검사] 타입 2
=====================================================*/
export const ValidateType2 = (selectedType2, selectedType1, setErrors) => {
    console.error('유효성검사', selectedType2, selectedType1)
    if (!selectedType2) {
        // 타입2를 선택하지 않은 경우
        setErrors((prevErrors) => ({
            ...prevErrors,
            type2: "타입을 선택해주세요.",
        }));
        return false;
    } else if (selectedType1 && selectedType1.value === selectedType2.value) {
        // 타입1과 중복된 타입을 선택한 경우
        setErrors((prevErrors) => ({
            ...prevErrors,
            type2: "중복된 타입은 선택할 수 없습니다.",
        }));
        return false;
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, type2: "" }));
        return true;
    }
};


/*====================================================
// [유효성 검사] 키
=====================================================*/
export const ValidateHeight = (height, setErrors) => {
    const numberRegex = /^[0-9]+(\.[0-9]+)?$/;
    if (!height) {
        // 키를 입력하지 않은 경우
        setErrors((prevErrors) => ({
            ...prevErrors,
            height: "키를 입력해주세요.",
        }));
        return false;
    } else if (!numberRegex.test(height)) {
        // 키가 숫자가 아니거나 소수점 형식이 아닌 경우
        setErrors((prevErrors) => ({
            ...prevErrors,
            height: "키는 숫자로만 입력해주세요.",
        }));
        return false;
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, height: "" }));
        return true;
    }
}


/*====================================================
    // [유효성 검사] 분류 
=====================================================*/
export const ValidateCategory = (category, setErrors) => {
    const koreanRegex = /^[가-힣]+$/;

    // 입력값이 변경되지 않은 경우
    if (!category || category.trim() === "포켓몬") {
        setErrors((prevErrors) => ({
            ...prevErrors,
            category: "분류를 입력해주세요. 예시)씨앗포켓몬",
        }));
        return false;
    } else if (!koreanRegex.test(category)) {
        // 카테고리가 한글이 아닌 경우
        setErrors((prevErrors) => ({
            ...prevErrors,
            category: "분류는 한글로만 입력해주세요. 예시)씨앗포켓몬",
        }));
        return false;
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, category: "" }));
        return true;
    }
}


/*====================================================
// [유효성 검사] 몸무게
=====================================================*/
export const VaildateWeight = (weight, setErrors) => {
    const numberRegex = /^[0-9]+(\.[0-9]+)?$/;
    if (!weight) {
        // 몸무게를 입력하지 않은 경우
        setErrors((prevErrors) => ({
            ...prevErrors,
            weight: "몸무게를 입력해주세요.",
        }));
        return false;
    } else if (!numberRegex.test(weight)) {
        // 몸무게가 숫자가 아니거나 소수점 형식이 아닌 경우
        setErrors((prevErrors) => ({
            ...prevErrors,
            weight: "몸무게는 숫자로만 입력해주세요.",
        }));
        return false;
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, weight: "" }));
        return true;
    }
}


/*====================================================
// [유효성 검사] 특성1
=====================================================*/
export const VaildateCharacteristic1 = (characteristic1, setErrors) => {
    if (!characteristic1) {
        // 특성1을 선택하지 않은 경우
        setErrors((prevErrors) => ({
            ...prevErrors,
            characteristic1: "특성을 선택해주세요.",
        }));
        return false;
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, characteristic1: "" }));
        return true;
    }
}


/*====================================================
// [유효성 검사] 특성2 
=====================================================*/
export const VaildateCharacteristic2 = (characteristic2, characteristic1, setErrors) => {
    if (!characteristic2) {
        // 특성2를 선택하지 않은 경우
        setErrors((prevErrors) => ({
            ...prevErrors,
            characteristic2: "특성을 선택해주세요.",
        }));
        return false;
    } else if (characteristic1 && characteristic1.value === characteristic2.value) {
        // 특성1과 중복된 특성을 선택한 경우
        setErrors((prevErrors) => ({
            ...prevErrors,
            characteristic2: "중복된 특성은 선택할 수 없습니다.",
        }));
        return false;
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, characteristic2: "" }));
        return true;
    }
}


/*====================================================
// [유효성 검사] 이미지
=====================================================*/
export const ValidateImage = (file, setErrors) => {
    if (!file) {
        setErrors((prevErrors) => ({
            ...prevErrors,
            image: "이미지를 등록해주세요.",
        }));
        return false;
    } else {
        setErrors((prevErrors) => ({ ...prevErrors, image: "" }));
        return true;
    }
}