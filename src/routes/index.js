const express = require('express')

const authRoutes = require("./authRoutes")
const blogRoutes = require("./blog")
const videoRoutes = require("./videoRoutes")
const statisticsRoutes = require("./statisticsRoutes")
const subscriberSRoute = require("./subscriber")

function routes(app) {
    app.use("/api/v1", authRoutes)
    app.use("/api/v1", blogRoutes)
    app.use("/api/v1", videoRoutes)
    app.use("/api/v1", statisticsRoutes)
    app.use("/api/v1", subscriberSRoute)
}

module.exports = routes