

export const getStocks = async(user)=>{
    const response = await fetch("http://localhost:3000/api/user-stocks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: user.id
    }),
  });
  return await response.json();
}

export const getwatchStocks = async(user)=>{
  const response = await fetch("http://localhost:3000/api/user-watchlist", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    id: user.id
  }),
});
return await response.json();
}

export const removestock = async(user, symbol)=>{
  const response = await fetch("http://localhost:3000/api/remove", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    id: user.id,
    symbol: symbol
  }),
});
return await response.json();
}

export const addstock = async(user, symbol)=>{
  const response = await fetch("http://localhost:3000/api/add", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    id: user.id,
    symbol: symbol
  }),
});
return await response.json();
}


export const gettransaction = async(user)=>{
  const response = await fetch("http://localhost:3000/api/transactions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    id: user.id
  }),
});
return await response.json();
}