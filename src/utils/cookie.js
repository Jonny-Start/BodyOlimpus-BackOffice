module.exports = cookie = {
    getToken: (req) => {
        return req.cookies.token;
    },
    setToken: (res, token) => {
        res.cookie('token', token, { httpOnly: true });
    },
    removeToken: (res) => {
        res.clearCookie('token');
    }
};