

export const getStocks = async(user)=>{
    const response = await fetch("https://tradex-101.onrender.com/api/user-stocks", {
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
  const response = await fetch("https://tradex-101.onrender.com/api/user-watchlist", {
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
  const response = await fetch("https://tradex-101.onrender.com/api/remove", {
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
  const response = await fetch("https://tradex-101.onrender.com/api/add", {
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

