import Lottie from "react-lottie";
import animationData from "../../animations/loading.json"

const Loader = () => {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <Lottie options={defaultOptions} style={{ height: "100vh", width: "50%" }} />
    )
}

export default Loader