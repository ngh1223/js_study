const data = require('./test.json')
const md5 = require('./md5.min')
const flat_data = data.reduce((acc, cur) => acc.concat(cur));

//테스트용 함수
const sum = function sum(list){
  return list.reduce((acc, cur) => acc + cur);
}

const max = function max(list){
  return list.reduce((acc, cur) => Math.max(acc, cur));
}

function groupBy(data, arr, target, func){
  const props = data.map(data => arr.map(prop => data[prop]).filter(Boolean))
  const concatProps = props.map(item => item.reduce((acc, cur) => acc+','+cur))
  const uniqueProps = concatProps.filter((item, idx, arr) => arr.indexOf(item) === idx)
  const result = uniqueProps.map(uniqueProp => ( { [md5(uniqueProp)] : uniqueProp, "data" :  ({ "user" : flat_data.filter( data => arr.map(props => data[props]).filter(Boolean).reduce((acc, cur) => acc+','+cur) === uniqueProp)
  ,[func.name+'-'+target] : func( (flat_data.filter( data => arr.map(props => data[props]).filter(Boolean).reduce((acc, cur) => acc+','+cur) === uniqueProp).map(data => data[target]).filter(Boolean)) ) })  } ) )
  return result
}

const resultCol = groupBy(flat_data, ['byrNm','supNm'], 'totAmt', sum)

//갯수카운팅
function verifyGroupBy(before, after){
 const count = after.map(data => data['data']['user']).reduce((acc, cur) => acc.concat(cur)).length
 return ('------------------------------\nOriginal data count : '+before.length + '\nResult data count : '+count)
}

//결과 확인
resultCol.map(data => console.log('------', data ,data['data']))
console.log(verifyGroupBy(flat_data, resultCol))