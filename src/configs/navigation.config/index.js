// src/configs/navigation.config.js

import dashboardNavigationConfig from './dashboard.navigation.config'
import contentManagementNavigationConfig from './contentManagement.navigation.config'
import appearanceNavigationConfig from './appearance.navigation.config'
import userManagementNavigationConfig from './userManagement.navigation.config'

const navigationConfig = [
    ...dashboardNavigationConfig,
    ...contentManagementNavigationConfig,
    ...appearanceNavigationConfig,
    ...userManagementNavigationConfig,
]

export default navigationConfig