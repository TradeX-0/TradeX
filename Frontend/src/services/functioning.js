

export const close = async(symbol, id, balance) =>{
    const response = await fetch(`https://tradex-101.onrender.com/api/close`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            symbol: symbol,
            balance: balance
          }),
    });
    console.log(response.json())
}

export const buy = async(symbol, quantity, price, id, balance)=>{
        const response = await fetch(`https://tradex-101.onrender.com/api/buy`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: id,
                symbol: symbol,
                quantity: quantity,
                price: price,
                balance: balance
              }),
        });
        console.log(response.json())
}

export const sell = async(symbol, quantity, price, id, balance)=>{
    const response = await fetch(`https://tradex-101.onrender.com/api/sell`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            symbol: symbol,
            quantity: quantity,
            price: price,
            balance: balance
          }),
    });
    console.log(response.json())
}