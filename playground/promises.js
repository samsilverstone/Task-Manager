func=(a,b)=>new Promise((resolve,reject)=>{
    if(typeof(a)==='number' && typeof(b)==='number'){
        resolve(a+b)
    }else{
        reject("Cannot add strings")
    }
})


func(2,3).then(res=>func(res,8))
.then(data=>func(data,10))
.then(data=>console.log(data))
.catch(e=>console.log(e)) 