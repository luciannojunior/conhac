(() => {
    const getById = id => () => document.getElementById(id);
    const getValue = el => el.value  
    const setValue = el => value => el.value = value
    
    const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))
    const head = list => list[0]
    const tail = list => list.slice(1)
    const trim = str => str && str.trim ? str.trim() : str
    
    const peak = input => { console.log(input); return input}
    
    const entrada = getById('entrada')()
    const saida = getById('saida')()
    entrada.onkeyup = () => analyseInput()
  
    const splitBy = divider => text => text.split(divider)
    
    const groupCSVList = list => tail(list).reduce(getReducerForCSV(splitBy(':')(head(list))), [])
    
    const parseCSV = csvText => compose(groupCSVList, splitBy('\n'), getValue)(entrada)
       
    const getReducerForCSV = keys => (acc, current) => {
      const values = splitBy(':')(current)
      return [...acc, values.reduce((accObj, current, i) => ({...accObj, [trim(keys[i])]: trim(current) }),{})]
    }
    
    const dumpOnOutput = str => setValue(saida)(str)
    
    const jsonToString = JSON.stringify
    
    const codeForFind = () => `
      let processGrade = grade => grade.replace(".", ",");
      function path(paths, obj) {
        var val = obj;
        var idx = 0;
        while (idx < paths.length) {
          if (val == null) {
            return;
          }
          val = val[paths[idx]];
          idx += 1;
        }
        return val;
      };
      const trim = str => str.trim ? str.trim() : str
      const reducerForRow = nome => (acc, current) => (trim(path(['children', '2','innerText'], current)) === nome) ? current : acc;
      const findRowByNome = rows => nome => [...rows].reduce(reducerForRow(nome), null);     
      const rows = document.getElementsByTagName('tr')
      const findRow = findRowByNome(rows)
      __grades.map(({nome, nota1, nota2, nota3}) => {
          let row = findRow(nome); if (!row || !row.children) return;
          row.children[3].children[0].value = processGrade(nota1);
          row.children[4].children[0].value = processGrade(nota2);
          row.children[5].children[0].value = processGrade(nota3);
      })
    `
    const generateCodeForGrades = grades => {
      let output = 'const __grades = ' + jsonToString(grades) + ';';
      output += codeForFind()
      return output
    }
    
    const analyseInput = () => {
      compose(dumpOnOutput, generateCodeForGrades, parseCSV, getValue)(entrada)
    }
    
})()
