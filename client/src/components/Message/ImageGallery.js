import { useState } from "react"
import { Box, Modal } from '@mui/material';
import { Flexbox } from '../../misc/MUIComponents';

import CloseIcon from '@mui/icons-material/CancelRounded';
import ArrowIcon from '@mui/icons-material/ExpandCircleDown';
import CircleIcon from '@mui/icons-material/Brightness1';

const ImageGallery = ({ images, close }) => {

    const [slider, setSlider] = useState(0)

    const nextImageHandler = () => {
        if (slider === images.length - 1) {
            setSlider(0)
            return;
        }
        setSlider(prev => prev + 1)
    }

    const previousImageHandler = () => {
        if (slider === 0) {
            setSlider(images.length - 1)
            return
        }
        setSlider(prev => prev - 1)
    }

    return (
        <Modal
            keepMounted
            open={true}
            onClose={close}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
                height: "100vh",
                width: "100vw",
            }}
        >
            <>

                {/* Previous Image*/}
                {images.length > 1 &&
                    <Flexbox
                        sx={{
                            height: "100%",
                            width: { xs: "5%", md: "10%", },
                            right: "92%",
                            position: "absolute",
                            bgcolor: "rgba(0,0,0,0.01)",
                        }}
                    >
                        <ArrowIcon sx={{
                            color: "text.primary",
                            fontSize: { xs: "24px", md: "48px" },
                            cursor: "pointer",
                            transform: "rotate(90deg)",
                        }}
                            onClick={previousImageHandler}
                        />
                    </Flexbox>
                }

                {/* Closing Icon */}
                <CloseIcon sx={{
                    color: "red",
                    fontSize: { xs: "24px", md: "48px" },
                    cursor: "pointer",
                    position: "absolute",
                    left: "90%",
                    top: "2%",
                    zIndex: 1,
                }}
                    onClick={close}
                />

                {/* Image */}
                <Flexbox sx={{ height: "80%", width: "auto" }}>
                    <Box
                        component="img"
                        loading="lazy"
                        alt=""
                        src={images[slider]}
                        sx={{
                            maxWidth: { xs: "80%", md: "90%" },
                            maxHeight: { xs: "80%", md: "90%" },
                        }}
                    />
                </Flexbox>


                {/* Next Image*/}
                {images.length > 1 &&
                    <Flexbox
                        sx={{
                            height: "100%",
                            width: { xs: "5%", md: "10%", },
                            left: "92%",
                            position: "absolute",
                            bgcolor: "rgba(0,0,0,0.01)",
                        }}
                    >
                        <ArrowIcon sx={{
                            color: "text.primary",
                            fontSize: { xs: "24px", md: "48px" },
                            cursor: "pointer",
                            transform: "rotate(270deg)"
                        }}
                            onClick={nextImageHandler}
                        />
                    </Flexbox>
                }

                {/* Slider button */}
                <Flexbox sx={{ position: "absolute", top: "90%", gap: { xs: 1, md: 3 } }}>
                    {images.map((image, index) => {
                        return (
                            <CircleIcon
                                sx={{ width: { xs: 10, md: 20 }, cursor: "pointer", fill: (slider === index ? "white" : "black") }}
                                onClick={() => { if (index !== slider) setSlider(index) }}
                            />
                        )
                    })}
                </Flexbox>
            </>

        </Modal >
    );
}

export default ImageGallery