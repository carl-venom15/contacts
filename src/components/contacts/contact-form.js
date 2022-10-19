// Tools
import React, { useReducer } from 'react'
import { phone } from 'phone';
import * as yup from 'yup';

// Components
import { Button, Grid, InputLabel , TextField , Paper, Typography } from '@mui/material'

const formsReducer = (state, action) => {    
    switch (action.type) {
        case "UPDATE_FORM":
            const { name = null, value, hasError, error, isFormValid = true } = action.data
            if(name === null) {
                return {
                    ...state,
                    isFormValid
                }
            }
            return {
                ...state,
                [name]: { ...state[name], value, hasError, error },
                isFormValid,
            }
      default:
        return state
    }
}

export const onInputChange = (name, value, dispatch) => {
    dispatch({
      type: "UPDATE_FORM",
      data: {
        name,
        value,
        hasError: false,
        error: ""
      },
    })
}

export const validateFormValue = async(name, value, dispatch, schema) => {
    let form = {
        name,
        value,
        hasError: false,
        error: ""
    }
    await yup.reach(schema, name).validate(value)
        .catch( err => {
            form.error = err.errors[0]
            form.hasError = true
    })
    dispatch({
        type: "UPDATE_FORM",
        data: form
    })
}

const initialState = {
    fname: { value: "", hasError: true, error: "" },
    lname: { value: "", hasError: true, error: "" },
    mobile: { value: "", hasError: true, error: "" },
    email: { value: "", hasError: true, error: "" },
    group: { value: "", hasError: true, error: "" },
    isFormValid: true,
}

const ContactForm = ({ data = null, editCallback, insertCallback, cancelFormCallback}) => {

    // Form  variables and functions
    const formTitle = data !== null ? "Edit": "Add"
    const [formState, dispatch] = useReducer(formsReducer, data !== null ? {...data, isFormValid: true} : initialState)

    let schema = yup.object().shape({
        id: yup.number(),
        fname: yup.string().required('First name is required').min(2, 'First name must have at least two characters')
            .max(20, 'First name should not exceed 20 characters'),
        lname: yup.string().required('Last name is required').min(2, 'Last name must have at least two characters')
            .max(20, 'Last name should not exceed 20 characters'),
        mobile: yup.string().required('Mobile number is required').test(
            'mobile-validation',
            'Invalid mobile number. Enter in e164 format.',
            val => validatePhoneInput(val)
        ),
        email: yup.string().nullable().when((val, schema) =>
            val?.length > 0 ? schema.email("Enter a valid email address").max(50, 'Email should not exceed 50 characters') : schema,
        ),
        group: yup.string().nullable().when((val, schema) =>
            val?.length > 0 ? schema.min(2, 'Group must have at least two characters').max(20, 'Group should not exceed 20 characters') : schema,
        )
    });

    const validatePhoneInput = (value) => {
        let validatePhone = phone(value);
        return validatePhone.isValid
    }

    const onSubmit = async() => {
        let newForm = {
            fname: formState.fname.value,
            lname: formState.lname.value,
            mobile: formState.mobile.value,
            email: formState.email.value === "" ? null : formState.email.value,
            group: formState.group.value === "" ? null : formState.group.value,
        }

        if( data !== null){
            newForm.email = formState.email.value === data.email.value ? null : formState.email.value
            newForm.group = formState.group.value  === data.group.value ? null: formState.group.value
        }

        let validateForm = await schema.validate(newForm)
            .then( ()=> { return true })
            .catch( async() => {
                for( let formKey in formState ){
                    if(formKey !== 'isFormValid') await validateFormValue(formKey, formState[formKey].value, dispatch, schema)
                }
                dispatch({
                    type: "UPDATE_FORM",
                    data: {
                    isFormValid: false
                    }
                })
                return false
        });

        if(!validateForm) return 0

        // If Form is valid
        newForm.id = data === null ? 0 : data.id

        if(formTitle === "Add"){
            await insertCallback(newForm)
        }
        else{
            await editCallback(newForm)
        }
    }

    return (
        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            
            <div className='title-form'>
                <Typography variant="h3" gutterBottom >
                    {formTitle} Contact
                </Typography>
            </div>

            <Grid className="" container spacing={2}>

                <Grid item xs={12} md={6} lg={6}>
                        <InputLabel shrink htmlFor="fname">
                            First name
                        </InputLabel>
                        <TextField 
                            className="text-field-form" 
                            required 
                            label={formState.fname.value === "" ? "First name" : ""  }
                            name="fname" 
                            variant="outlined" 
                            InputLabelProps={{shrink: false}}
                            value={formState.fname.value} 
                            onChange={ e => onInputChange(e.target.name, e.target.value, dispatch) }
                            onBlur={e => validateFormValue(e.target.name, e.target.value, dispatch, schema)}
                        />
                        <p className="error-message-form">{formState.fname.error}</p>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                    <InputLabel shrink htmlFor="bootstrap-input">
                        Last name
                    </InputLabel>
                    <TextField 
                        className="text-field-form" 
                        required 
                        label={formState.lname.value === "" ? "Last name" : ""  }
                        name="lname" 
                        variant="outlined" 
                        InputLabelProps={{shrink: false}}
                        value={formState.lname.value} 
                        onChange={ e => onInputChange(e.target.name, e.target.value, dispatch) }
                        onBlur={e => validateFormValue(e.target.name, e.target.value, dispatch, schema)}
                    />
                    <p className="error-message-form">{formState.lname.error}</p>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                        <InputLabel shrink htmlFor="fname">
                            Email
                        </InputLabel>
                        <TextField 
                            className="text-field-form" 
                            label={formState.email?.value === "" ? "Email" : ""  }
                            name="email" 
                            variant="outlined" 
                            InputLabelProps={{shrink: false}}
                            value={formState.email.value} 
                            onChange={ e => onInputChange(e.target.name, e.target.value, dispatch) }
                            onBlur={e => validateFormValue(e.target.name, e.target.value, dispatch, schema)}
                        />
                        <p className="error-message-form">{formState.email.error}</p>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                    <InputLabel shrink htmlFor="bootstrap-input">
                        Group
                    </InputLabel>
                    <TextField 
                        className="text-field-form" 
                        label={formState.group?.value === "" ? "Group" : ""  }
                        name="group" 
                        variant="outlined" 
                        InputLabelProps={{shrink: false}}
                        value={formState.group.value} 
                        onChange={ e => onInputChange(e.target.name, e.target.value, dispatch) }
                        onBlur={e => validateFormValue(e.target.name, e.target.value, dispatch, schema)}
                    />
                    <p className="error-message-form">{formState.group.error}</p>
                </Grid>

                <Grid item xs={12}>
                    <InputLabel shrink htmlFor="bootstrap-input">
                        Mobile number
                    </InputLabel>
                    <TextField 
                        className="text-field-form" 
                        required 
                        label={formState.mobile.value === "" ? "Mobile number" : ""  }
                        name="mobile" 
                        variant="outlined" 
                        InputLabelProps={{shrink: false}}
                        value={formState.mobile.value} 
                        onChange={ e => onInputChange(e.target.name, e.target.value, dispatch) }
                        onBlur={e => validateFormValue(e.target.name, e.target.value, dispatch, schema)}
                    />
                    <p className="error-message-form">{formState.mobile.error}</p>
                </Grid>

                <Grid item xs={12} container justifyContent="center" alignItems="center">
                    { formState.isFormValid ? null : <p className='main-error-message-form'>Please fill all the fields correctly</p> }
                    <Button variant="outlined" style={{width: 100, margin: 15}} onClick={() => cancelFormCallback()}>Cancel</Button>
                    <Button variant="outlined" onClick={() => onSubmit()} style={{width: 100, margin: 15}}>Save</Button>
                </Grid>

            </Grid>
        </Paper>
    )
}

export default ContactForm