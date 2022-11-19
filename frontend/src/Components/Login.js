import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
import { useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import app_constants from "../constants/constants";
import Swal from "sweetalert2";
import {Outlet,Link} from "react-router-dom";
import axios from "axios";

const Login = ({setValueOfisLocalStorageEmpty}) => {
  //const router = useRouter();
  
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const loginRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().max(255).required("Username is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: () => {
        SignIn();
      //router.push("/");
    },
  });

  //API Functions

  const SignIn = ()=>{
    var formData = new FormData();
    formData.append("username",formik.values.username);
    formData.append("password",formik.values.password);

    axios({
        url: app_constants.API_URL+"Login",
        method: "POST",
        data: formData,
        // headers: {
        //   "content-type": "multipart/form-data",
        // },
      }).then((res) => {
        console.log(res);
        if (res.data.status === "success"){
            //Login
          localStorage.setItem("token",res.data.token);
          setValueOfisLocalStorageEmpty(false);  
          loginRef.current.click();
        }
        else{
          //show invalid error
          Swal.fire({
            icon:"error",
            title:"Unauthorized",
            text:"Invalid username or password"
          })
        }
      }).catch((err) => {
        alert(err);
        
      }); // Catch errors
  }

  return (
    <>
      {/* <Head>
        <title>Login | Material Kit</title>
      </Head> */}
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "100vh",
          width: "100vw",
          background: "#CCCCFF",
        }}
      >
        <Box
          component="main"
          sx={{
            alignItems: "center",
            display: "flex",
            flexGrow: 1,
            minHeight: "100%",
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              border: "1px solid black",
              borderRadius: "15px",
              padding: "50px",
              background: "white",
              boxShadow: "0 3px 10px rgb(0 0 0 / 20%)",
            }}
          >
            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ my: 3 }}>
                <Typography color="textPrimary" variant="h4">
                  Inventory Manager
                </Typography>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="body2"
                  style={{
                    fontSize: "16px",
                    wordSpacing: "-1px",
                  }}
                >
                  Sign in on the internal platform
                </Typography>
              </Box>

              <TextField
                error={Boolean(
                  formik.touched.username && formik.errors.username
                )}
                fullWidth
                helperText={formik.touched.username && formik.errors.username}
                label="Username"
                margin="normal"
                name="username"
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
                //   onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.username}
                variant="outlined"
                InputProps={{
                  shrink: "true",
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon
                        style={usernameFocused ? { color: "#105db4" } : {}}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                error={Boolean(
                  formik.touched.password && formik.errors.password
                )}
                fullWidth
                helperText={formik.touched.password && formik.errors.password}
                label="Password"
                margin="normal"
                name="password"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                //   onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                value={formik.values.password}
                variant="outlined"
                InputProps={{
                  shrink: "true",
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon
                        style={passwordFocused ? { color: "#105db4" } : {}}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ py: 2 }}>
                <Button
                  color="primary"
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  {formik.isSubmitting ? (
                    <Typography
                      style={{ color: "white", marginBottom: "-3px" }}
                    >
                      <CircularProgress size={25} thickness={5} />
                    </Typography>
                  ) : (
                    "Sign In Now"
                  )}
                </Button>
              </Box>
              {/* <Typography color="textSecondary" variant="body2">
              Don&apos;t have an account?{" "}
              <NextLink href="/register">
                <Link
                  to="/register"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  Sign Up
                </Link>
              </NextLink>
            </Typography> */}
            </form>
          </Container>
        </Box>
        <Link to="/customers" ref={loginRef}/>
        <Outlet />
      </div>
    </>
  );
};

export default Login;
