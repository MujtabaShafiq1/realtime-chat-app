import { useMediaQuery, Typography, ImageListItem, ImageList } from '@mui/material'
import { Flexbox } from '../../misc/MUIComponents';


const ImageGrid = ({ images }) => {

    const matches = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    function srcset(image, size = (matches ? 120 : 148), rows = 1, cols = 1) {
        return {
            src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
            srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
        };
    }

    return (
        <ImageList
            sx={{ alignSelf: "flex-end", width: "100%", height: "100%" }}
            rowHeight={matches ? 120 : 148}
            cols={4}
            variant="quilted"
        >
            <ImageListItem cols={2} rows={2}>
                <img
                    {...srcset(images[0])}
                    loading="lazy"
                    alt=""
                    style={{ borderRadius: "5px" }}
                />
            </ImageListItem>
            <ImageListItem
                cols={(images.length === 2 || images.length === 3) ? 2 : 1}
                rows={images.length === 2 ? 2 : 1}
            >
                <img
                    {...srcset(images[1])}
                    loading="lazy"
                    alt=""
                    style={{ borderRadius: "5px" }}
                />
            </ImageListItem>
            {images[2] &&
                <ImageListItem
                    cols={images.length === 3 ? 2 : 1}
                    rows={1}
                >
                    <img
                        {...srcset(images[2])}
                        loading="lazy"
                        alt=""
                        style={{ borderRadius: "5px" }}
                    />
                </ImageListItem>
            }
            {images[3] &&
                <ImageListItem cols={2} rows={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
                    <img
                        {...srcset(images[3])}
                        loading="lazy"
                        alt=""
                        style={{ borderRadius: "5px" }}
                    />
                    {images.length > 4 &&
                        <Flexbox
                            sx={{ backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", height: "100%", width: "100%", borderRadius: "8px" }}>
                            <Typography sx={{ fontSize: "28px", color: "white", fontWeight: 400, opacity: 0.7 }}>
                                + {images.length - 4}
                            </Typography>
                        </Flexbox>
                    }
                </ImageListItem>
            }
        </ImageList>
    )
}

export default ImageGrid