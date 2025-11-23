import { useRef, useEffect, useContext } from "react"
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form"
import { AppContext } from "./App"

export default function Login() {
    const { setalert, setemail } = useContext(AppContext)
    const ballRef = useRef()
    const getEmail = (token) => {
        fetch("https://nano-path.onrender.com/email", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (!data) {
                    console.warn("Error while fetching email");
                    return;
                }
                if (data.email) {
                    setemail(data.email.userId.toLowerCase());
                }
            })
            .catch(err => console.error("Fetch error:", err));
    }
    function moveBallRandomly() {
        const left = Math.random() * (window.innerWidth - 100);
        const top = Math.random() * (window.innerHeight - 100);

        ballRef.current.style.left = left + 'px';
        ballRef.current.style.top = top + 'px';
    }

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm()

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await fetch("https://nano-path.onrender.com/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const token = response.headers.get("Authorization");
            if (token) {
                localStorage.setItem("token", token);
                setalert("Login Successfully")
                getEmail(token)
                navigate(-1)
            } else {
                console.warn("No token found in header");
                setalert("Error While Logging In", "bad")
            }
            const responseData = await response.json();

        } catch (error) {
            console.error("Error:", error);
            setalert("Invaild Credentials", "bad")
        }
    }


    useEffect(() => {
        if (errors.email || errors.password) {
            const alertElement = document.querySelector('.errorAlert');
            alertElement.classList.remove('showError');
            alertElement.classList.add('showError');
        }
    }, [errors.email, errors.password]);

    useEffect(() => {
        const ballEvent = setInterval(() => {
            if (ballRef.current) {
                moveBallRandomly()
            }
        }, 3000);

        return () => clearInterval(ballEvent)
    }, [])
    return (<>
        <div className="LoginPage">
            <div className="formBox">
                <div className="banner">
                    <img src="/Dashboard Image 1.png" alt="" />
                </div>
                <h2>Welcome Back</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="inputBox">
                        <input {...register("email", { required: "Email is required" })} type="email" placeholder="name@example.com" />
                        <input {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })} type="password" placeholder="Password" />
                    </div>
                    <p>New User <Link to={"/register"}>Register</Link></p>
                    <button type="sumbit" className="loginBtn" style={{ backgroundColor: isSubmitting ? "#35008055" : "#4a1ac6" }} disabled={isSubmitting}>LogIn</button>
                </form>
            </div>
        </div>
        <div className={`errorAlert`}>
            {errors.username && <span>{errors.username.message}</span>}
            {errors.password && <span>{errors.password.message}</span>}
        </div>
        <div className="ball" ref={ballRef} onMouseEnter={moveBallRandomly}>
        </div>
    </>)
}