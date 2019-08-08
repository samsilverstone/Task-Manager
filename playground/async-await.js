const add=(a,b)=>new Promise((resolve,reject)=>{
    if(typeof(a)==='number' && typeof(b)==='number'){
        resolve(a+b)
    }else
    {
        reject("Cannot do this")
    }
})

const x=async ()=>{
    const sum=await add(3,5)
    console.log(sum)
    const sum2=await add(sum,45)
    return sum2
}

console.log(x())