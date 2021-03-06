import React, { useState } from "react";
import {
  Button,
  CardContent,
  CircularProgress,
  TextField,
  Typography
} from "@material-ui/core";
import { Link } from "react-router-dom";
import {useAuthStyles, AuthPageSplash, AuthCard, AuthContainerStyles} from "./SharedAuth";
import arAxios from "utils/axiosHelper";
import { useSnackbar } from "notistack";

function PasswordResetPage(props: any) {
  const classes = useAuthStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [state, updateState] = useState({
    email: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const setFormState = newState => updateState({ ...state, ...newState });

  function isFormValid() {
    if (props.match.params.token) {
      return (
        state.email.length > 0 &&
        state.newPassword.length > 0 &&
        state.newPassword === state.confirmNewPassword
      );
    } else {
      return state.email.length > 0;
    }
  }

  const handleSubmit = async (ev: any) => {
    ev.preventDefault();
    setIsLoading(true);
    setError(false);

    try {
      if (!props.match.params.token) {
        await arAxios.post("/auth/passwordReset", { email: state.email });
        props.history.push("/pendingPasswordReset");
        enqueueSnackbar(
          "Password Reset Email Sent. Please check your e-mail.",
          {
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right"
            }
          }
        );
      } else {
        const passwordResetToken = props.match.params.token;
        const expiresToken = props.location.search.split("=")[1];
        await arAxios.post(
          `/auth/passwordReset/${passwordResetToken}?resetPasswordExpires=${expiresToken}`,
          { password: state.newPassword }
        );
        setIsLoading(false);
        props.history.push("/login");
      }
    } catch (e) {
      setError(true);
      setIsLoading(false);
    }
  };

  return (
    <AuthContainerStyles className={classes.root}>
      <AuthPageSplash />

      <AuthCard square>
        <CardContent>
          <Typography variant="h6">
            RESET YOUR PASSWORD
          </Typography>
          {isLoading && <CircularProgress color="secondary" />}
          {!isLoading && (
            <form
              name="recoverForm"
              noValidate
              onSubmit={handleSubmit}
            >
              <TextField
                className="mb-16"
                style={{marginBottom: '1.6rem'}}
                label="Email"
                autoFocus
                type="email"
                name="email"
                value={state.email}
                onChange={e => setFormState({ email: e.target.value })}
                variant="outlined"
                required
                fullWidth
                error={error}
                helperText={
                  error &&
                  "Server Error, please contact support@auditionrevolution.com for assistance"
                }
              />
              {props.match.params.token && (
                <>
                  <TextField
                    style={{marginBottom: '1.6rem'}}
                    label="New Password"
                    autoFocus
                    type="password"
                    name="newPassword"
                    value={state.newPassword}
                    onChange={e =>
                      setFormState({ newPassword: e.target.value })
                    }
                    variant="outlined"
                    required
                    fullWidth
                  />
                  <TextField
                    style={{marginBottom: '1.6rem'}}
                    label="Confirm New Password"
                    autoFocus
                    type="password"
                    name="confirmNewPassword"
                    value={state.confirmNewPassword}
                    onChange={e =>
                      setFormState({ confirmNewPassword: e.target.value })
                    }
                    variant="outlined"
                    required
                    fullWidth
                  />
                </>
              )}

              <Button
                variant="contained"
                color="primary"
                aria-label="Reset"
                disabled={!isFormValid()}
                type="submit"
              >
                {props.match.params.token
                  ? "Set New Password"
                  : "RESET PASSWORD"}
              </Button>
            </form>
          )}
          <div className="no-account">
            <Link className="font-medium" to="/login">
              Go back to login
            </Link>
          </div>
        </CardContent>
      </AuthCard>
    </AuthContainerStyles>
  );
}

export default PasswordResetPage;
