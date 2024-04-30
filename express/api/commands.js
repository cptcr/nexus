
module.exports = async (app) => {
    app.get("/test", async (req, res) => {
        res.send("hello world")
    })
}