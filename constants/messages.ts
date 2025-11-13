

export const messages = {

}

export const errorMessages = {
    invalidCredentials: 'Invalid credentials',
    userNotFound: 'No account found with the provided credentials. Please sign up first.',
    userAlreadyExists: 'An account with this username already exists. Please use a different username.',
    wrongPassword : "The password you entered is incorrect. Please try again.",
}

export const alerts = {
    userNotFound : {
        title: 'Login Failed',
        message: errorMessages.userNotFound,
    },
    userAlreadyExists : {
        title: 'Registration Failed',
        message: errorMessages.userAlreadyExists,
    },
    wrongPassword : {
        title: 'Login Failed',
        message: errorMessages.wrongPassword,
    },
    deleteTransaction: {
        Title: "Delete Transactions",
        message: "Are you sure you want to delete this transactions?"
    }
}