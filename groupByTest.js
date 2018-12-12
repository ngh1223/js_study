const data = require('./test.json')
const flat_data = data.reduce((acc, cur) => acc.concat(cur));

//테스트용 함수
const sum = function sum(list){
  return list.reduce((acc, cur) => acc + cur);
}

const max = function max(list){
  return list.reduce((acc, cur) => Math.max(acc, cur));
}

function groupBy(col, propList, func, target){
  const obj = new Object();
  const resultCol = [];

  //자릿수 가져와서 난수 자를 때 사용
  const length = col.length.toString().length;

  //파라미터로 받은 collection에 있는 object 하나씩 돌면서 property list 갖고 있는지 확인
  for (const user of col ) {
      const arr = []

      for (const prop of propList) {
          //선택 된 property중 있는 값만 배열에 넣음
          if (user[prop] == undefined) {    
              continue;
          } else {
              arr.push(user[prop]);    
          }
      }

      //해당하는 property의 값들 배열에 넣고 resultCol에 일치하는 value값 있는지 확인
      const reduced_prop = arr.reduce((acc, cur) => (acc+','+cur));
      const resultValues = [];

      //resultCol에 있는 value들 모두 가져와서 배열에 넣음
      for (const result of resultCol) {
        resultValues.push(Object.values(result)[0])
      }

      //result colelction에 있는 value인지 확인하여 있으면 해당 키-data-user에 push
      if (resultValues.indexOf(reduced_prop)  !== -1) {
          const match_key = Object.keys(resultCol).find(key => Object.values(resultCol[key])[0] === reduced_prop)
          resultCol[match_key]['data']['user'].push(user); 
      } else { 
          //없으면 새 객체 만들어서 result collection에 push
          const newObj = new Object();
          const newKey = Math.random().toString().substr(2,length)
          newObj[newKey] = reduced_prop
          newObj['data'] = {'user' : [ user ]}
          resultCol.push(newObj)
      }
    }
  
  keys = Object.keys(resultCol)
  for (const key of keys) {
    const valueArr = [];
    for (const item of resultCol[key]['data']['user']){

      //계산하려는 값이 숫자면 값 push
      if (typeof item[target] === 'number'){
        valueArr.push(item[target])
      } else {
        //아니면 NaN push
        valueArr.push(NaN);
      }
    }

    //계산하려는 배열에 NaN있으면 NaN return하고 NaN없으면 계산값 넣음.
    if (valueArr.includes(NaN)) {
      resultCol[key]['data'][func.name+'-'+target] = NaN
    } else {
      resultCol[key]['data'][func.name+'-'+target] = func(valueArr);
    }
  }
  return resultCol
}

result_data = groupBy(flat_data, ['itemNm','byrRgNo','supRgNo'], sum, 'byrNm')

//테스트함수 - 갯수 카운팅
function verifyGroupBy(before, after){
  let count = 0;
  for (const result of after){
    count += result['data']['user'].length
  }
  return ('------------------------------\nOriginal data count : '+before.length + '\nResult data count : '+count)
}

//결과값 출력
for (const data of result_data){
  console.log('-------------------------------\n',data)
  console.log(data['data'])
}

console.log(verifyGroupBy(flat_data, result_data))