

export const getUser = async(token) => {
    if (!token) return null;

    try {
        const user = await fetch(`http://localhost:3000/api/getuser/${token}`);
        return user.json()
    } catch (error) {
        return null; // Return null if token verification fails
    }
}


