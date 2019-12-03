// @ts-ignore
const blog = require.context('./blog/', true, /^(.*\.(md$))[^.]*$/imu)

export { blog }
