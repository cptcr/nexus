function token(length) {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let d = ""; 

    for (let x = 0; x < length; x++) { 
        const i = Math.floor(Math.random() * letters.length); 
        const o = letters[i];
        d += o;
    }

    return d;
}

module.exports = {token};