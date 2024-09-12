

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