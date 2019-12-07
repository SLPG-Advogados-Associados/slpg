// @ts-ignore
const blog = require.context('./blog/', true, /^(.*\.(md$))[^.]*$/imu)
// @ts-ignore
const team = require.context('./team/', true, /^(.*\.(json$))[^.]*$/imu)

export { blog, team }
