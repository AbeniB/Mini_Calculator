function calculator(inputedValues) {
    const inputVal = [];
    let variableAns = '';

    inputedValues.forEach((element, index) => {
        if (['+', '-', '*', '/'].includes(element)) {
            if (variableAns !== '') {
                inputVal.push(variableAns);
                variableAns = '';
            }
            inputVal.push(element);
        } else {
            variableAns += element;
        }
    });

    if (variableAns !== '') {
        inputVal.push(variableAns);
    }

    try {
        const finalAnswer = eval(inputVal.join(''));
        return finalAnswer;
    } catch (error) {
        console.error("Error evaluating expression:", error.message);
        return 'Error';
    }
}

const answerCont = document.querySelector('.answerCont');
const numCont = document.querySelector('.numCont');

let clickedBtn;
const inputedValues = [];

numCont.addEventListener('click', (event) => {
    if (event.target.nodeName === 'BUTTON') {
        clickedBtn = event.target.textContent;

        if (clickedBtn === 'C') {
            inputedValues.splice(0);
            answerCont.value = '';
        } else if (clickedBtn === '=') {
            answerCont.value = calculator(inputedValues);
            inputedValues.splice(0);
        } else {
            const lastValue = inputedValues[inputedValues.length - 1];

            // Prevent multiple operators in sequence
            if (['+', '-', '*', '/'].includes(clickedBtn) && ['+', '-', '*', '/'].includes(lastValue)) {
                inputedValues.pop();
            }

            inputedValues.push(clickedBtn);
            answerCont.value = inputedValues.join('');
        }
}
});