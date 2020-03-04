const genToken = payload => {
    jwt.sign(payload, keys.secretOrKey, { 
        expiresIn: 3600 
    }, (err, token) => {
        if (!err)
            return "Bearer " + token
        return null
        }
    );
}

module.exports = genToken;