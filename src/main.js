const sousDisplay = document.querySelector('#sous-display')
const mainDisplay = document.querySelector('#display')
const buttons = document.querySelectorAll('.operation')
const sousCalculate = []
const mainCalculate = []
let firstNum
let secondNum
let result
let nextOp

const displayHTML = (where, what) => {
    return typeof what === 'string' ? where.innerHTML = what : where.innerHTML = what.join('')
}

const clear = () => {
    mainCalculate.splice(0, mainCalculate.length)
    sousCalculate.splice(0, sousCalculate.length)
    firstNum = undefined
    secondNum = undefined
    displayHTML(mainDisplay, '0')
    displayHTML(sousDisplay, '')
}

const handleResults = () => {
    clear()
    mainCalculate.push(`${result}`)
    displayHTML(mainDisplay, mainCalculate)
}

const operations = {
    '+': () => {
        result = firstNum + secondNum
        handleResults()
    },
    '-': () => {
        result = firstNum - secondNum
        handleResults()
    },
    '/': () => {
        result = firstNum / secondNum
        handleResults()
    },
    '*': () => {
        result = firstNum * secondNum
        handleResults()
    }
}

const getNumbers = () => {
    if (!sousCalculate.length) {
        firstNum = parseFloat(mainCalculate.slice(0, mainCalculate.length).join(''))
        sousCalculate.push(...mainCalculate)
        mainCalculate.splice(0, mainCalculate.length)
        displayHTML(mainDisplay, '0')
    } else if (!secondNum) {
        firstNum = parseFloat(sousCalculate.slice(0, sousCalculate.length).join(''))
        secondNum = parseFloat(mainCalculate.slice(0, mainCalculate.length).join(''))
    }
}

const fixers = {
    '0': () => {
        if (mainCalculate.at(0) === '0' && mainCalculate.at(1) === '0') {
            mainCalculate.splice(mainCalculate.length - 1, 1)
        }
        displayHTML(mainDisplay, mainCalculate)
    },
    'D': () => {
        mainCalculate.splice(mainCalculate.length - 1, 1)
        displayHTML(mainDisplay, mainCalculate)
        if (mainCalculate.length < 1) {
            displayHTML(mainDisplay, '0')
        }
    },
    '.': () => {
        let count = 0
        mainCalculate.forEach(item => {
            if (item === '.') count++
            if (count > 1) {
                mainCalculate.splice(mainCalculate.length - 1, 1)
            }
        })
        if (mainCalculate.at(-1) === '.' && !mainCalculate.at(-2)){
            mainCalculate.unshift('0')
        }
        displayHTML(mainDisplay, mainCalculate)
    },
    '+/-': () => {
        let negNum = parseFloat(mainCalculate.splice(0, mainCalculate.length).join(''))
        firstNum = negNum * -1
        mainCalculate.push(`${firstNum}`)
        displayHTML(mainDisplay, mainCalculate)
    },
    '=': () => {
        getNumbers()
    },
    'fccTestFix': (targetValue) => {
        /**
         * So to solve my problem, I just went error by error and coded,
         * which isn't great, but it gets the work done.
         */
        if (!sousCalculate.length && mainCalculate.length > 1) {
            getNumbers()
        }
        if (secondNum) {
            operations[sousCalculate.at(-1)]()
        }
        if (operations[mainCalculate.at(1)] && operations[sousCalculate.at(-1)]) {
            sousCalculate.splice(sousCalculate.length - 1, 1, `${targetValue}`)
            mainCalculate.splice(0, mainCalculate.length)
        }
        displayHTML(sousDisplay, sousCalculate)
    }
}

const handleOperations = (targetValue) => {
    if (mainCalculate.at(0) === '-') {
        /**
         * I Had some problems with the test 13 (Go to README) because it doesn't recognize the way I did it,
         * which was for all the signs (+, -, /, *) to be overruled by the last one,
         * so if you want to use negative numbers have to click the "+/-" button.
         */
        return fixers['fccTestFix'](targetValue)
    }
    if (operations[mainCalculate.at(0)] && operations[sousCalculate.at(-1)]) {
        sousCalculate.splice(sousCalculate.length - 1, 1, `${targetValue}`)
        mainCalculate.splice(0, mainCalculate.length)
    }
    getNumbers()
    if (operations[mainCalculate.at(-1)] && sousCalculate.length) {
        nextOp = targetValue
        operations[sousCalculate.at(-1)]()
        sousCalculate.push(...mainCalculate, nextOp)
        mainCalculate.splice(0, mainCalculate.length)
        displayHTML(mainDisplay, '0')
    }
    if (sousCalculate.length && mainCalculate.length) {
        operations[sousCalculate.at(-1)]()
    }
    displayHTML(sousDisplay, sousCalculate)
}

const handleClick = (e) => {
    let targetValue = e.target.value
    switch(targetValue) {
        case 'C':
            clear()
            break
        case 'D':
            fixers[targetValue]()
            break
        case '=':
            fixers[targetValue]()
            handleOperations()
            break
        default:
            mainCalculate.push(targetValue)
            displayHTML(mainDisplay, mainCalculate)
            if (operations[targetValue]) {
                handleOperations(targetValue)
            }
            if (fixers[targetValue]) {
                fixers[targetValue]()
            }
    }
}

buttons.forEach(btn => {
    btn.addEventListener('click', handleClick)
})