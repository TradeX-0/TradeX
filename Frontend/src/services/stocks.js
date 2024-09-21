

export const getStocks = async(user)=>{
    const response = await fetch("https://trade-x-ux6n.vercel.app/api/user-stocks", {
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
  const response = await fetch("https://trade-x-ux6n.vercel.app/api/user-watchlist", {
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
  const response = await fetch("https://trade-x-ux6n.vercel.app/api/remove", {
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
  const response = await fetch("https://trade-x-ux6n.vercel.app/api/add", {
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

