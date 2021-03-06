import * as Yup from "yup";
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItem,
  ListItemText,
  makeStyles,
  MenuItem,
  Theme
} from "@material-ui/core";
import React from "react";
import { Field, Formik } from "formik";
import { FormikTextField } from "../shared/FormikTextField";
import AddressInput from "../shared/AddressInput";
import { Select } from "formik-material-ui";
import { useMutation } from "@apollo/react-hooks";
import {AddItemModalStyles} from "./AddItemModalStyles";
import styled from "styled-components";
import {UPDATE_USER} from "../../graphql/updateUser";

const GET_USER = require("../../graphql/queries/user/GET_USER.graphql");

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  city: Yup.string(),
  state: Yup.string(),
  representation: Yup.string(),
  website: Yup.string().url(
    "Must be a valid URL, make sure to include http://"
  ),
  phoneNumber: Yup.string().matches(phoneRegExp, "Phone number is not valid")
});


const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    text: {
      color: theme.palette.secondary.light
    }
  });
});

const DialogStyles = styled(DialogContent)`
  display: flex;
  flex-direction: column:
  align-items: center;
  justify-content: center;
  
  .height {
    display: flex; 
    justify-content: space-between;
  }
  
  #createAccount {
    width: 100%;
    margin-top: 1.6rem;
  }
  .MuiInputBase-root {
    margin-bottom: 5px;
  }
`;

function EditUserModal({ user }: any) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_USER, variables: { id: user.id } }]
  });
  if (!user) {
    return <p>loading</p>;
  }
  const initialValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    city: user.city,
    state: user.state,
    website: user.website || "",
    gender: user.gender,
    representation: user.representation || "",
    phoneNumber: user.phoneNumber || "",
    feet: Math.floor(user.heightInches / 12),
    inches: user.heightInches % 12,
    eyeColor: user.eyeColor,
    hairColor: user.hairColor
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async (values: any, { resetForm, setErrors }: any) => {
    try {
      values.heightInches =
        parseInt(values.feet) * 12 + parseInt(values.inches);
      delete values.feet;
      delete values.inches;
      await updateUser({ variables: { data: values } });
      resetForm();
      handleClose();
    } catch (error) {
      setErrors({ submit: error.messages });
    }
  };

  return (
    <div>
      <ListItem onClick={handleOpen}>
        <ListItemText
          classes={{ secondary: classes.text }}
          primary="Update User"
          secondary="Update General Attributes"
        />
      </ListItem>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {props => (
          <Dialog
            fullWidth
            maxWidth="md"
            aria-labelledby="update-user-modal"
            open={open}
            onClose={handleClose}
          >
            <DialogTitle>Update User</DialogTitle>
            <DialogStyles>
              <AddItemModalStyles name="registerForm">
                <FormikTextField
                  type="text"
                  name="firstName"
                  label="First Name"
                />
                <FormikTextField
                  type="text"
                  name="lastName"
                  label="Last Name"
                />
                <FormikTextField
                  type="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number"
                />
                <AddressInput
                  required={false}
                  placeholder={`${user.city}, ${user.state}`}
                  handleChange={(city: string, state: string) => {
                    props.setFieldValue("city", city);
                    props.setFieldValue("state", state);
                  }}
                />
                <FormikTextField
                  required={false}
                  type="website"
                  name="website"
                  label="Website"
                />
                <FormikTextField
                  required={false}
                  type="input"
                  name="representation"
                  label="Representation"
                />
                <FormControl
                  variant="outlined"
                  style={{ marginBottom: "16px" }}
                >
                  <InputLabel shrink={true} htmlFor="gender">
                    Gender
                  </InputLabel>
                  <Field
                    name="gender"
                    select
                    label="Gender"
                    id="gender"
                    component={Select}
                  >
                    <MenuItem value={"male"}>Male</MenuItem>
                    <MenuItem value={"female"}>Female</MenuItem>
                    <MenuItem value={"nonbinary"}>Non-Binary</MenuItem>
                    <MenuItem value={"private"}>Private</MenuItem>
                  </Field>
                </FormControl>
                <div className={'height'}>
                  <FormikTextField type="text" name="feet" label="Feet" />
                  <FormikTextField type="text" name="inches" label="Inches" />
                </div>
                <FormControl
                  variant="outlined"
                  style={{ marginBottom: "16px" }}
                >
                  <InputLabel shrink={true} htmlFor="eyeColor">
                    Eye Color
                  </InputLabel>
                  <Field
                    name="eyeColor"
                    select
                    label="Eye Color"
                    id="eyeColor"
                    component={Select}
                  >
                    <MenuItem value={"brown"}>Brown</MenuItem>
                    <MenuItem value={"hazel"}>Hazel</MenuItem>
                    <MenuItem value={"blue"}>Blue</MenuItem>
                    <MenuItem value={"green"}>Green</MenuItem>
                    <MenuItem value={"gray"}>Gray</MenuItem>
                    <MenuItem value={"amber"}>Amber</MenuItem>
                    <MenuItem value={"other"}>Other</MenuItem>
                    <MenuItem value={"unknown"}>Unknown</MenuItem>
                  </Field>
                </FormControl>
                <FormControl
                  variant="outlined"
                  style={{ marginBottom: "16px" }}
                >
                  <InputLabel shrink={true} htmlFor="eyeColor">
                    Hair Color
                  </InputLabel>
                  <Field
                    label={"Hair Color"}
                    name="hairColor"
                    id="hairColor"
                    component={Select}
                  >
                    <MenuItem value={"black"}>Black</MenuItem>
                    <MenuItem value={"brown"}>Brown</MenuItem>
                    <MenuItem value={"red"}>Red</MenuItem>
                    <MenuItem value={"blonde"}>Blonde</MenuItem>
                    <MenuItem value={"gray"}>Gray</MenuItem>
                    <MenuItem value={"white"}>White</MenuItem>
                    <MenuItem value={"other"}>Other</MenuItem>
                    <MenuItem value={"unknown"}>Unknown</MenuItem>
                  </Field>
                </FormControl>
                <DialogActions>
                  <Button onClick={handleClose} color="secondary">
                    Cancel
                  </Button>
                  <Button
                    id="createAccount"
                    variant="contained"
                    color="primary"
                    aria-label="Register"
                    disabled={!props.isValid}
                    type="submit"
                  >
                    Update User
                  </Button>
                </DialogActions>
              </AddItemModalStyles>
            </DialogStyles>
          </Dialog>
        )}
      </Formik>
    </div>
  );
}

export default EditUserModal;
