// 계산기 관련 변수들
let currentInput = '0'; // 현재 입력값
let history = []; // 계산 히스토리

// 디스플레이에 숫자나 연산자 입력
function inputNumber(number) {
  if (currentInput === '0' && number !== '.') {
    currentInput = number; // 0일 경우 숫자 입력 시 숫자만 보이도록
  } else if (number === '.' && !currentInput.includes('.')) {
    currentInput += '.'; // 이미 소수점이 없다면 소수점 추가
  } else {
    currentInput += number; // 기존 입력에 숫자 추가
  }
  updateDisplay();
}

// 연산자 입력
function inputOperator(operator) {
  currentInput += operator;
  updateDisplay();
}

// 루트 연산
function inputSquareRoot() {
  const value = parseFloat(currentInput);
  const result = Math.sqrt(value);
  currentInput = formatResult(result); // 계산된 값은 소수점 6자리까지 포맷
  updateDisplay();
  saveHistory(`√${value} = ${formatResult(result)}`); // 결과 기록
}

// 제곱 연산
function inputSquare() {
  const value = parseFloat(currentInput);
  const result = Math.pow(value, 2);
  const formattedValue = Number.isInteger(value) ? value : `(${value})`; // 정수인 경우 괄호 생략
  currentInput = formatResult(result); // 계산된 값은 소수점 6자리까지 포맷
  updateDisplay();
  saveHistory(`${formattedValue}² = ${formatResult(result)}`);
}

// 결과 계산
function calculate() {
  try {
    const result = calculateExpression(currentInput);
    currentInput = formatResult(result); // 계산된 값은 소수점 6자리까지 포맷
    saveHistory(`${currentInput} = ${formatResult(result)}`);
    updateDisplay();
  } catch (error) {
    currentInput = 'Error';
    updateDisplay();
  }
}

// 수식 계산 함수 (eval 없이 계산)
function calculateExpression(expression) {
  const operators = ['+', '-', '*', '/'];
  let result = expression.replace(/([0-9\.]+)\s*([\*\/])\s*([0-9\.]+)/g, (match, num1, operator, num2) => {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    if (operator === '*') return num1 * num2;
    if (operator === '/') return num1 / num2;
  });

  result = result.replace(/([0-9\.]+)\s*([\+\-])\s*([0-9\.]+)/g, (match, num1, operator, num2) => {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    if (operator === '+') return num1 + num2;
    if (operator === '-') return num1 - num2;
  });

  let parsedResult = parseFloat(result);
  return parsedResult % 1 === 0 ? parsedResult.toString() : parsedResult.toFixed(6).replace(/(\.\d*?[1-9])0+$/, '$1');
}

// 결과값 포맷팅 (소수점 최대 6자리)
function formatResult(result) {
  return result % 1 === 0 ? result.toString() : result.toFixed(6).replace(/(\.\d*?[1-9])0+$/, '$1');
}

// 디스플레이 업데이트
function updateDisplay() {
  const display = document.getElementById('display');
  display.textContent = currentInput;
}

// 결과 기록을 업데이트
function saveHistory(entry) {
  history.unshift(entry);
  updateResults();
}

// 결과 기록을 업데이트
function updateResults() {
  const results = document.getElementById('results');
  results.innerHTML = '';
  history.slice(0, 5).forEach(item => {
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result');
    resultDiv.textContent = item;
    resultDiv.onclick = () => {
      currentInput = item.split(' = ')[0];
      updateDisplay();
    };
    results.appendChild(resultDiv);
  });
}

// 입력 값 삭제
function deleteLastDigit() {
  if (currentInput === 'Error' || currentInput === 'Infinity') {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === '' || currentInput === '-' || currentInput === '.') {
      currentInput = '0';
    }
  }
  updateDisplay();
}

// 디스플레이 초기화
function clearDisplay() {
  currentInput = '0';
  updateDisplay();
}
