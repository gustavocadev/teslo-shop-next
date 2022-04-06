import { Slide } from "react-slideshow-image"
import styles from "./ProductSlideShow.module.css"
import "react-slideshow-image/dist/styles.css"

type Props = {
  images: string[]
}

const ProductSlideShow = ({ images }: Props) => {
  return (
    <Slide easing="ease" duration={7000} indicators>
      {images.map((image) => {
        return (
          <div key={image} className={styles["each-slide"]}>
            <section
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
              }}
            ></section>
          </div>
        )
      })}
    </Slide>
  )
}

export default ProductSlideShow
