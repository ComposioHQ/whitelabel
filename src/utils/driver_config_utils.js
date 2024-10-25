const driverObjDemoLoggedOut = {
    showProgress: true,
    steps: [
        {
            element: '#main-container',
            popover: {
                title: 'Welcome to Composio\'s Whitelabel Demo Page',
                description: 'This page showcases how you can whitelabel Composio\'s apps'
            }
        },
        {
            element: '#demo-app-container',
            popover: {
                title: 'Demo Apps',
                description: 'Try out the apps by connecting your account and executing the actions'
            }
        },
        {
            element: '#connect-accounts-button',
            popover: {
                title: 'Login and Connect Account',
                description: 'Click here to login and connect your account'
            }
        }
    ]
};

const driverObjDemoLoggedIn = {
    showProgress: true,
    steps: [
        {
            element: '#connect-accounts-button',
            popover: {
                title: 'Connect Account & Execute Action',
                description: 'Click here to connect your account if it\'s not already connected & then execute the action'
            }
        },
    ]
};

export { driverObjDemoLoggedOut, driverObjDemoLoggedIn };
