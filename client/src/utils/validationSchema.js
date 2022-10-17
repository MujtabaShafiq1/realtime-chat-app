import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().trim().required("Password is required").min(8, 'Minimum characters: 8').max(15, 'Maximum characters: 15'),
})

export const signupSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    username: yup.string().trim().matches("^[a-zA-Z][a-zA-Z0-9]*$", "Invalid Character").required("Username is required")
        .min(3, 'Minimum characters: 3').max(12, 'Maximum characters: 12'),
    password: yup.string().trim().required("Password is required").min(8, 'Minimum characters: 8').max(15, 'Maximum characters: 15'),
    confirmedPassword: yup.string().trim().required("Please confirm Password").oneOf([yup.ref('password'), null], 'Passwords must match')
})
